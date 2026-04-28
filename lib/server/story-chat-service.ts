import "server-only";

import { execFile } from "node:child_process";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import {
  analyzeBookDraftReadiness,
  buildSceneContextPacket,
  getDraftJobsForScene
} from "@/lib/book-engine";
import {
  DEFAULT_BOOK_JOB_MODELS,
  resolveBookJobModelValue
} from "@/lib/book-job-models";
import type {
  AssistantArtifactKind,
  AssistantContextSelection,
  AssistantModelSelection,
  AssistantOutputMode,
  AssistantProvider,
  StoryDocument
} from "@/lib/story-schema";
import {
  countWords,
  createDefaultAssistantContextSelection,
  getAllScenes
} from "@/lib/story-schema";

const storyChatSchema = z.object({
  reply: z.string().min(40),
  suggestedThreadTitle: z.string().min(3).max(80).optional(),
  artifact: z
    .object({
      title: z.string().min(3).max(120),
      kind: z.enum(["regie", "note"]),
      summary: z.string().min(12).max(240),
      content: z.string().min(80)
    })
    .nullable()
});

type StoryChatPayload = z.infer<typeof storyChatSchema>;
type RemoteStoryChatProvider = "openai" | "anthropic";
type StoryChatDraftJob = StoryDocument["book"]["draftEngine"]["jobs"][number];
const DEFAULT_LOCAL_GEMMA_COMMAND = "/Users/bucci369/mlx-gemma4/.venv/bin/mlx_vlm.generate";
const DEFAULT_LOCAL_GEMMA_MODEL = "mlx-community/gemma-4-e4b-it-mxfp4";

const STORY_CHAT_STAGE_ORDER = [
  "context",
  "beat_plan",
  "draft",
  "rewrite",
  "length_control",
  "extract",
  "continuity",
  "quality_eval"
] as const;

export type StoryChatExecution = {
  provider: Exclude<AssistantProvider, "auto">;
  mode: "remote" | "local_fallback";
  modelName: string | null;
  reply: string;
  suggestedThreadTitle?: string;
  artifact?: {
    title: string;
    kind: AssistantArtifactKind;
    summary: string;
    content: string;
  };
  warning?: string;
};

export async function generateStoryChat(params: {
  story: StoryDocument;
  threadId: string;
  provider?: AssistantProvider;
  modelSelection?: AssistantModelSelection;
  outputMode?: AssistantOutputMode;
  contextSelection?: AssistantContextSelection;
}): Promise<StoryChatExecution> {
  const provider = params.provider ?? "auto";
  const outputMode = params.outputMode ?? "chat";
  const thread = params.story.assistant.threads.find(function (candidate) {
    return candidate.id === params.threadId;
  });

  if (!thread) {
    throw new Error("Assistant-Thread konnte nicht gefunden werden.");
  }

  if (!thread.messages.length) {
    throw new Error("Der Assistant-Thread enthält noch keine Nachricht.");
  }

  const contextSelection =
    params.contextSelection ?? thread.context ?? createDefaultAssistantContextSelection();

  if (provider === "local") {
    try {
      const payload = await generateWithLocalGemma(
        params.story,
        thread.id,
        outputMode,
        contextSelection
      );

      return {
        provider: "local",
        mode: "local_fallback",
        modelName: payload.modelName,
        reply: payload.data.reply,
        suggestedThreadTitle: payload.data.suggestedThreadTitle,
        artifact: payload.data.artifact ?? undefined
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Lokales Gemma-Modell konnte nicht ausgeführt werden.";

      return createLocalExecution(
        params.story,
        thread.id,
        outputMode,
        contextSelection,
        `Gemma lokal fehlgeschlagen; deterministischer lokaler Fallback verwendet. ${message}`
      );
    }
  }

  const remoteProvider = resolveRemoteProvider(provider);

  if (!remoteProvider) {
    return createLocalExecution(
      params.story,
      thread.id,
      outputMode,
      contextSelection,
      "Kein OPENAI_API_KEY oder ANTHROPIC_API_KEY gesetzt; lokaler Fallback verwendet."
    );
  }

  try {
    const payload =
      remoteProvider === "openai"
        ? await generateWithOpenAI(
            params.story,
            thread.id,
            outputMode,
            contextSelection,
            params.modelSelection
          )
        : await generateWithAnthropic(
            params.story,
            thread.id,
            outputMode,
            contextSelection,
            params.modelSelection
          );

    return {
      provider: remoteProvider,
      mode: "remote",
      modelName: payload.modelName,
      reply: payload.data.reply,
      suggestedThreadTitle: payload.data.suggestedThreadTitle,
      artifact: payload.data.artifact ?? undefined
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Story-Chat konnte nicht remote erzeugt werden.";

    return createLocalExecution(params.story, thread.id, outputMode, contextSelection, message);
  }
}

function resolveRemoteProvider(provider: AssistantProvider) {
  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    return "openai" as const;
  }

  if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    return "anthropic" as const;
  }

  if (provider === "auto") {
    if (process.env.OPENAI_API_KEY) {
      return "openai" as const;
    }

    if (process.env.ANTHROPIC_API_KEY) {
      return "anthropic" as const;
    }

  }

  return null;
}

async function generateWithOpenAI(
  story: StoryDocument,
  threadId: string,
  outputMode: AssistantOutputMode,
  contextSelection: AssistantContextSelection,
  modelSelection?: AssistantModelSelection
) {
  const modelName = resolveBookJobModelValue(
    modelSelection?.openai,
    process.env.OPENAI_STORY_CHAT_MODEL,
    DEFAULT_BOOK_JOB_MODELS.openai
  );
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  const response = await client.responses.parse({
    model: modelName,
    store: false,
    reasoning: {
      effort: "medium"
    },
    input: [
      {
        role: "system",
        content: buildSystemPrompt(story, outputMode)
      },
      {
        role: "user",
        content: buildUserPrompt(story, threadId, outputMode, contextSelection)
      }
    ],
    text: {
      format: zodTextFormat(storyChatSchema, "ember_story_chat")
    }
  });

  if (!response.output_parsed) {
    throw new Error("OpenAI lieferte keine strukturierte Antwort.");
  }

  return {
    modelName,
    data: response.output_parsed
  };
}

async function generateWithAnthropic(
  story: StoryDocument,
  threadId: string,
  outputMode: AssistantOutputMode,
  contextSelection: AssistantContextSelection,
  modelSelection?: AssistantModelSelection
) {
  const modelName = resolveBookJobModelValue(
    modelSelection?.anthropic,
    process.env.ANTHROPIC_STORY_CHAT_MODEL,
    DEFAULT_BOOK_JOB_MODELS.anthropic
  );
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
  const message = await client.messages.parse({
    model: modelName,
    max_tokens: 2200,
    system: buildAnthropicSystemPrompt(story, outputMode),
    messages: [
      {
        role: "user",
        content: buildUserPrompt(story, threadId, outputMode, contextSelection)
      }
    ],
    output_config: {
      format: zodOutputFormat(storyChatSchema)
    }
  });

  if (!message.parsed_output) {
    throw new Error("Anthropic lieferte keine strukturierte Antwort.");
  }

  return {
    modelName,
    data: message.parsed_output
  };
}

async function generateWithLocalGemma(
  story: StoryDocument,
  threadId: string,
  outputMode: AssistantOutputMode,
  contextSelection: AssistantContextSelection
) {
  const command = process.env.LOCAL_GEMMA_COMMAND || DEFAULT_LOCAL_GEMMA_COMMAND;
  const modelName = process.env.LOCAL_GEMMA_MODEL || DEFAULT_LOCAL_GEMMA_MODEL;
  const maxTokens = process.env.LOCAL_GEMMA_MAX_TOKENS || (outputMode === "regie" ? "1600" : "900");
  const temperature = process.env.LOCAL_GEMMA_TEMPERATURE || "0.35";
  const prompt = buildLocalGemmaUserPrompt(story, threadId, outputMode, contextSelection);
  const systemPrompt = buildLocalGemmaSystemPrompt(outputMode);
  const rawOutput = await execLocalGemma(command, [
    "--model",
    modelName,
    "--system",
    systemPrompt,
    "--prompt",
    prompt,
    "--max-tokens",
    maxTokens,
    "--temperature",
    temperature,
    "--skip-special-tokens"
  ]);
  const reply = normalizeLocalGemmaOutput(rawOutput);

  if (reply.length < 20) {
    throw new Error("Gemma lieferte keine verwertbare Antwort.");
  }

  const data: StoryChatPayload = {
    reply: outputMode === "regie"
      ? "Gemma lokal hat einen Roh-Regieentwurf erzeugt. Bitte als Vorarbeit prüfen, nicht ungeprüft als finalen Importvertrag verwenden."
      : reply,
    suggestedThreadTitle: deriveLocalThreadTitle(getLastUserMessage(story, threadId), outputMode === "regie" ? "Gemma Regie" : "Gemma"),
    artifact: outputMode === "regie"
      ? {
          title: `Gemma-Rohregie — ${story.title}`,
          kind: "regie",
          summary: "Lokaler Rohentwurf aus Gemma; für Brainstorming und Vorstrukturierung gedacht.",
          content: reply
        }
      : null
  };

  return {
    modelName,
    data
  };
}

function execLocalGemma(command: string, args: string[]) {
  return new Promise<string>(function (resolve, reject) {
    execFile(
      command,
      args,
      {
        timeout: Number(process.env.LOCAL_GEMMA_TIMEOUT_MS || 180000),
        maxBuffer: 1024 * 1024 * 8
      },
      function (error, stdout, stderr) {
        if (error) {
          const detail = [error.message, stderr].filter(Boolean).join("\n").trim();
          reject(new Error(detail || "MLX-Prozess fehlgeschlagen."));
          return;
        }

        resolve([stdout, stderr].filter(Boolean).join("\n"));
      }
    );
  });
}

function buildLocalGemmaSystemPrompt(outputMode: AssistantOutputMode) {
  return [
    "Du bist Gemma lokal im EMBER Studio.",
    "Antworte auf Deutsch.",
    "Deine Rolle: billige Vorarbeit, Brainstorming, Sortierung und Rohentwurf.",
    "Erfinde keine harten Canon-Fakten. Markiere Lücken klar.",
    "Finale Pipeline-Kompatibilität muss später geprüft werden.",
    outputMode === "regie"
      ? "Erzeuge Markdown als Roh-Regieentwurf mit klaren Abschnitten, aber kennzeichne unsichere Stellen."
      : "Antworte kompakt mit konkreten Listen, Entscheidungen und nächsten Schritten."
  ].join("\n");
}

function buildLocalGemmaUserPrompt(
  story: StoryDocument,
  threadId: string,
  outputMode: AssistantOutputMode,
  contextSelection: AssistantContextSelection
) {
  const thread = story.assistant.threads.find(function (candidate) {
    return candidate.id === threadId;
  });
  const recentMessages = (thread?.messages ?? []).slice(-6).map(function (message) {
    return `${message.role === "assistant" ? "ASSISTANT" : "USER"}: ${trimPromptText(message.content, 900)}`;
  });
  const scopedScenes = getScopedSceneContexts(story, contextSelection).slice(0, 10);
  const sceneLines = scopedScenes.map(function (sceneContext) {
    return `- ${sceneContext.sceneTitle}: ${trimPromptText(sceneContext.summary || "", 180)}`;
  });

  return [
    `OUTPUT_MODE: ${outputMode}`,
    `AKTIVER_KONTEXT: ${buildContextLabel(story, contextSelection) || "Gesamtprojekt"}`,
    "",
    "PROJEKT:",
    `Titel: ${story.title}`,
    `Genre: ${story.meta.genre || "nicht gesetzt"}`,
    `Prämisse: ${trimPromptText(story.book.masterBrief.premise || "nicht gesetzt", 420)}`,
    `Reader Promise: ${trimPromptText(story.book.masterBrief.readerPromise || "nicht gesetzt", 360)}`,
    `Thematischer Kern: ${trimPromptText(story.book.masterBrief.thematicCore || "nicht gesetzt", 360)}`,
    `Author Intent: ${trimPromptText(story.book.masterBrief.authorIntent || "nicht gesetzt", 300)}`,
    `Current Focus: ${trimPromptText(story.book.masterBrief.currentFocus || "nicht gesetzt", 300)}`,
    "",
    "WRITER CONSTITUTION AUSZUG:",
    formatPromptList(story.book.writerConstitution.slice(0, 8), "Keine Writer Constitution gesetzt.", 8),
    "",
    "AKTIVE SZENEN:",
    sceneLines.length ? sceneLines.join("\n") : "- Keine Szenen im aktiven Scope.",
    "",
    "LETZTE NACHRICHTEN:",
    recentMessages.length ? recentMessages.join("\n") : "- Keine bisherigen Nachrichten.",
    "",
    outputMode === "regie"
      ? [
          "AUFGABE:",
          "Erzeuge einen Roh-Regieentwurf als Markdown.",
          "Nutze diese Abschnitte: ## Core, ## World/Pressure System, ## Characters, ## Canon Facts Kandidaten, ## Open Threads, ## Act Map, ## Scene-Card-Rohentwurf, ## Lücken.",
          "Canon Facts Kandidaten müssen als Kandidaten markiert bleiben.",
          "Scene Cards nur als Rohentwurf, nicht als finaler Import."
        ].join("\n")
      : [
          "AUFGABE:",
          "Beantworte die letzte Nutzerfrage. Nutze Gemma nur für Vorarbeit: sortieren, brainstormen, extrahieren, Varianten bilden.",
          "Gib bei harten Entscheidungen an, was später mit starkem Modell oder Dry-Run geprüft werden muss."
        ].join("\n")
  ].join("\n");
}

function normalizeLocalGemmaOutput(output: string) {
  const withoutProgress = output
    .replace(/\r/g, "\n")
    .split("\n")
    .filter(function (line) {
      return !line.includes("Fetching ") && !line.includes("it/s]");
    })
    .join("\n")
    .trim();
  const modelMatch = withoutProgress.match(/<\|turn\>model\s*\n+([\s\S]*?)\n=+\s*(?:Prompt:|$)/);

  if (modelMatch?.[1]) {
    return modelMatch[1].trim();
  }

  const sections = withoutProgress.split("==========").map(function (section) {
    return section.trim();
  }).filter(Boolean);
  const responseSection = sections.find(function (section) {
    return section.includes("<|turn>model");
  });

  if (responseSection) {
    const parts = responseSection.split("<|turn>model");
    return (parts[1] ?? responseSection)
      .replace(/^Prompt:.*$/gm, "")
      .trim();
  }

  return withoutProgress
    .replace(/^Files:.*$/gm, "")
    .replace(/^Prompt:.*$/gm, "")
    .replace(/^Generation:.*$/gm, "")
    .replace(/^Peak memory:.*$/gm, "")
    .trim();
}

function getLastUserMessage(story: StoryDocument, threadId: string) {
  const thread = story.assistant.threads.find(function (candidate) {
    return candidate.id === threadId;
  });

  return [...(thread?.messages ?? [])].reverse().find(function (message) {
    return message.role === "user";
  })?.content ?? "";
}

function buildSystemPrompt(story: StoryDocument, outputMode: AssistantOutputMode) {
  const modeInstruction =
    outputMode === "regie"
      ? [
          "Wenn du ein Dokument erzeugst, arbeite im Stil eines internen EMBER-Regiebriefs.",
          "Das Dokument muss in sauberem Markdown erscheinen, mit klaren Überschriften, knappen Leitplanken und verwertbaren Entscheidungen.",
          "Bilde die reale EMBER-Struktur ab: Stable Prefix, Writer Constitution, Dynamic Context, Pipeline-Fit, Extractor/Ledger und nächste Schritte.",
          "Trenne positive Schreibregeln und negative Constraints sauber, wenn die Writer Constitution solche Einträge enthält.",
          "Behaupte keine Datenfelder, die im Kontext nicht existieren. Wenn etwas nur abgeleitet statt persistiert ist, benenne das präzise.",
          "Kein lockerer Ton, keine Meta-Erklärung über den Modellprozess."
        ]
      : [
          "Arbeite wie ein präziser Story-Strategist und Editor.",
          "Gib keine Watte, sondern klare Hebel, Risiken und nächste Schritte."
        ];

  return [
    "Du bist die integrierte Story-Assistentin von EMBER Studio.",
    "Antworte standardmäßig auf Deutsch.",
    "Nutze nur den gegebenen Projektkontext. Wenn etwas fehlt, markiere die Lücke knapp statt zu halluzinieren.",
    "Dein Output muss sofort in einen professionellen Schreib-Workflow passen.",
    ...modeInstruction,
    `Projektmodus: ${story.mode === "book" ? "Buch" : "Branching"}.`
  ].join("\n");
}

function buildAnthropicSystemPrompt(story: StoryDocument, outputMode: AssistantOutputMode) {
  return [
    {
      type: "text" as const,
      text: buildSystemPrompt(story, outputMode)
    }
  ];
}

function buildUserPrompt(
  story: StoryDocument,
  threadId: string,
  outputMode: AssistantOutputMode,
  contextSelection: AssistantContextSelection
) {
  const thread = story.assistant.threads.find(function (candidate) {
    return candidate.id === threadId;
  });
  const recentMessages = (thread?.messages ?? []).slice(-8).map(function (message) {
    return `${message.role === "assistant" ? "ASSISTANT" : "USER"}: ${trimPromptText(message.content, 1400)}`;
  });
  const projectContext = buildAssistantProjectContextPrompt(story, contextSelection);

  return [
    `OUTPUT_MODE: ${outputMode}`,
    `CONTEXT_SCOPE: ${contextSelection.scope}`,
    `AKTIVER_KONTEXT: ${buildContextLabel(story, contextSelection)}`,
    "",
    "PROJECT_CONTEXT:",
    projectContext,
    "",
    "LETZTE NACHRICHTEN:",
    recentMessages.length ? recentMessages.join("\n") : "- Keine bisherigen Nachrichten.",
    "",
    "LIEFERE JSON im vereinbarten Schema.",
    "Nutze PROJECT_CONTEXT als Quelle der Wahrheit: Blueprint, Memory, Pipeline und aktiver Scope sind wichtiger als allgemeine Schreibratschläge.",
    "Wenn die Nutzerfrage unklar ist, antworte trotzdem hilfreich aus dem aktiven Scope und markiere die wichtigste fehlende Entscheidung.",
    "Wenn OUTPUT_MODE chat ist, soll artifact null sein.",
    "Wenn OUTPUT_MODE regie ist, erzeuge ein kompaktes, hochwertiges Markdown-Dokument als artifact.",
    "Wenn OUTPUT_MODE regie ist, muss artifact.content diese Abschnitte enthalten: ## Strukturabgleich, ## Stable Prefix, ## Writer Constitution, ## Dynamic Context, ## Pipeline-Fit, ## Nächste Schritte.",
    "Wenn du eine Lücke benennst, sage explizit, ob sie heute ein echter Datenmodell- oder Persistenzmangel ist oder nur ein geplanter Ausbau laut Struktur.",
    "Der reply-Text bleibt knapp und sagt, was du entschieden oder erzeugt hast."
  ].join("\n");
}

function buildAssistantProjectContextPrompt(
  story: StoryDocument,
  contextSelection: AssistantContextSelection
) {
  const scopedScenes = getScopedSceneContexts(story, contextSelection);
  const scopedSceneIds = new Set(
    scopedScenes.map(function (sceneContext) {
      return sceneContext.sceneId;
    })
  );
  const sections: Array<string | null> = [
    buildProjectIdentityPrompt(story, scopedScenes.length),
    buildStableBriefPrompt(story),
    buildPipelineContextPrompt(story, scopedSceneIds),
    buildMemoryContextPrompt(story, scopedSceneIds),
    buildActiveScopeContextPrompt(story, contextSelection, scopedScenes),
    buildActiveScenePacketPrompt(story, contextSelection),
    buildAssistantWorkspaceMemoryPrompt(story)
  ];

  return sections.filter(Boolean).join("\n\n");
}

function buildProjectIdentityPrompt(story: StoryDocument, scopedSceneCount: number) {
  const allScenes = getAllScenes(story);
  const totalWords = allScenes.reduce(function (sum, scene) {
    return sum + getSceneTextWordCount(scene);
  }, 0);

  return [
    "## Project Identity",
    `Title: ${formatPromptValue(story.title)}`,
    `Author: ${formatPromptValue(story.authorName)}`,
    `Status: ${story.status}`,
    `Mode: ${story.mode}`,
    `Language: ${formatPromptValue(story.meta.language || "de")}`,
    `Genre: ${formatPromptValue(story.meta.genre)}`,
    `Audience: ${formatPromptValue(story.meta.audience)}`,
    `Target: ${story.book.targetFormat}, ${story.book.targetLengthWords} words`,
    `Current structure: ${story.acts.length} act(s), ${allScenes.length} scene(s), approx. ${totalWords} words in scene text`,
    `Active scope scene count: ${scopedSceneCount}`
  ].join("\n");
}

function buildStableBriefPrompt(story: StoryDocument) {
  return [
    "## Stable Brief",
    `Premise: ${formatPromptValue(story.book.masterBrief.premise)}`,
    `Reader Promise: ${formatPromptValue(story.book.masterBrief.readerPromise)}`,
    `Ending Promise: ${formatPromptValue(story.book.masterBrief.endingPromise)}`,
    `Thematic Core: ${formatPromptValue(story.book.masterBrief.thematicCore)}`,
    `Amazon Goal: ${formatPromptValue(story.book.marketBrief.amazonGoal)}`,
    `Category Lane: ${formatPromptValue(story.book.marketBrief.categoryLane)}`,
    `Commercial Hook: ${formatPromptValue(story.book.marketBrief.hook)}`,
    `Series Potential: ${formatPromptValue(story.book.marketBrief.seriesPotential)}`,
    `Cover Direction: ${formatPromptValue(story.book.marketBrief.coverDirection)}`,
    "Story Architecture:",
    formatPromptList(story.book.masterBrief.storyArchitecture, "Keine Story-Architecture hinterlegt.", 8),
    "Publishing Guardrails:",
    formatPromptList(story.book.marketBrief.publishingGuardrails, "Keine Publishing-Guardrails hinterlegt.", 8),
    "Writer Constitution:",
    buildWriterConstitutionPrompt(story.book.writerConstitution)
  ].join("\n");
}

function buildPipelineContextPrompt(story: StoryDocument, scopedSceneIds: Set<string>) {
  const audit = analyzeBookDraftReadiness(story);
  const allSceneCount = getAllScenes(story).length;
  const sortedJobs = story.book.draftEngine.jobs
    .slice()
    .sort(function (left, right) {
      return right.updatedAt.localeCompare(left.updatedAt);
    });
  const scopedJobs = sortedJobs.filter(function (job) {
    return scopedSceneIds.has(job.sceneId);
  });
  const scopedJobLines = scopedJobs.slice(0, 5).map(formatDraftJobLine);
  const latestJobLines = sortedJobs.slice(0, 5).map(formatDraftJobLine);
  const readinessWarnings = audit.continuityBlockers
    .concat(audit.qualityWarnings)
    .concat(audit.marketWarnings)
    .slice(0, 8);

  return [
    "## Pipeline State",
    `Active Phase: ${story.book.activePhase}`,
    `Draft Target: ${story.book.draftEngine.targetSceneWordsMin}-${story.book.draftEngine.targetSceneWordsMax} words per scene`,
    `Style Profile: ${story.book.draftEngine.styleProfileVersion}`,
    `Market Profile: ${story.book.draftEngine.marketProfileVersion}`,
    `Stage Order: ${STORY_CHAT_STAGE_ORDER.join(" -> ")}`,
    `Draft Jobs: ${sortedJobs.length} total, ${audit.acceptedJobs} accepted, ${audit.pendingJobs} ready/pending, ${audit.uncoveredSceneCount}/${allSceneCount} scene(s) uncovered`,
    `Current Scope Jobs: ${scopedJobs.length}`,
    "Readiness / Risks:",
    formatPromptList(readinessWarnings, "Keine harten Readiness-Warnungen im aktuellen Snapshot.", 8),
    "Latest Draft Jobs:",
    formatPromptList(latestJobLines, "Noch keine Draft-Jobs vorhanden.", 5),
    scopedSceneIds.size && scopedSceneIds.size !== allSceneCount
      ? ["Draft Jobs in Active Scope:", formatPromptList(scopedJobLines, "Noch kein Draft-Job im aktiven Scope.", 5)].join("\n")
      : ""
  ].filter(Boolean).join("\n");
}

function buildMemoryContextPrompt(story: StoryDocument, scopedSceneIds: Set<string>) {
  const memory = story.book.memory;
  const canonEntries = selectRelevantCanonEntries(story, scopedSceneIds);
  const characterStates = selectRelevantCharacterStates(story, scopedSceneIds);
  const openThreads = selectRelevantOpenThreads(story, scopedSceneIds);

  return [
    "## Memory Backbone",
    `Last Synced: ${memory.lastSyncedAt || "noch nie"}`,
    `Canon Ledger: ${memory.canonLedger.length} fact(s)`,
    `Character Ledger: ${memory.characterLedger.length} state(s)`,
    `Open Threads: ${memory.openThreads.length} thread(s)`,
    `Scene Cards: ${memory.sceneCards.length}`,
    `Context Packs: ${memory.contextPacks.length}`,
    "Relevant Canon:",
    formatPromptList(
      canonEntries.map(function (entry) {
        return `${entry.title} [${entry.kind}, ${entry.importance}, ${entry.status}]: ${trimPromptText(entry.summary, 220)}`;
      }),
      "Keine relevanten Kanon-Einträge im aktiven Scope.",
      6
    ),
    "Relevant Character States:",
    formatPromptList(
      characterStates.map(function (entry) {
        const latestSnapshot = entry.snapshots[entry.snapshots.length - 1] ?? null;
        return `${entry.characterName}: ${trimPromptText(entry.currentState, 180)} | Agenda: ${trimPromptText(entry.agenda, 140)} | Latest: ${latestSnapshot?.sourceLabel || "Baseline"}`;
      }),
      "Keine relevanten Figurenstände im aktiven Scope.",
      6
    ),
    "Relevant Open Threads:",
    formatPromptList(
      openThreads.map(function (thread) {
        return `${thread.label} [${thread.status}/${thread.priority}] from ${thread.sourceSceneTitle}: ${trimPromptText(thread.detail, 220)}`;
      }),
      "Keine relevanten offenen Fäden im aktiven Scope.",
      6
    ),
    "Continuity Notes:",
    formatPromptList(memory.continuityNotes, "Keine Continuity-Notizen hinterlegt.", 5)
  ].join("\n");
}

function buildActiveScopeContextPrompt(
  story: StoryDocument,
  contextSelection: AssistantContextSelection,
  scopedScenes: ReturnType<typeof getScopedSceneContexts>
) {
  const structureLines = story.acts.map(function (act) {
    const sceneCount = act.chapters.reduce(function (sum, chapter) {
      return sum + chapter.scenes.length;
    }, 0);

    return `${act.title}: ${act.chapters.length} chapter(s), ${sceneCount} scene(s)`;
  });
  const weakSceneLines = scopedScenes
    .filter(function (sceneContext) {
      return sceneContext.summary.length < 30;
    })
    .slice(0, 5)
    .map(function (sceneContext) {
      return `${sceneContext.sceneTitle} (${sceneContext.chapterTitle}) hat eine sehr kurze oder fehlende Summary.`;
    });

  return [
    "## Active Scope",
    `Resolved Label: ${buildContextLabel(story, contextSelection)}`,
    buildScopedContextPrompt(story, contextSelection),
    "Structure Overview:",
    formatPromptList(structureLines, "Keine Struktur angelegt.", 8),
    "Scenes in Active Scope:",
    formatPromptList(
      scopedScenes.slice(0, 10).map(function (sceneContext) {
        return formatScopedSceneLine(story, sceneContext);
      }),
      "Keine Szene im aktiven Scope auflösbar.",
      10
    ),
    "Scope Gaps:",
    formatPromptList(weakSceneLines, "Keine offensichtlichen Scope-Lücken in den ersten Szenen.", 5)
  ].join("\n");
}

function buildActiveScenePacketPrompt(story: StoryDocument, contextSelection: AssistantContextSelection) {
  if (!contextSelection.sceneId) {
    return null;
  }

  const packet = buildSceneContextPacket(story, contextSelection.sceneId);

  if (!packet) {
    return "## Active Scene Packet\n- Scene Context Packet konnte nicht geladen werden.";
  }

  const sceneCard = story.book.memory.sceneCards.find(function (card) {
    return card.sceneId === contextSelection.sceneId;
  }) ?? null;
  const jobs = getDraftJobsForScene(story, contextSelection.sceneId);
  const latestJob = jobs[0] ?? null;

  return [
    "## Active Scene Packet",
    `Act / Chapter: ${packet.dynamicContext.actTitle} / ${packet.dynamicContext.chapterTitle}`,
    `Scene: ${packet.dynamicContext.sceneTitle}`,
    `Scene Label: ${packet.dynamicContext.sceneCardLabel || "nicht gesetzt"}`,
    `Summary: ${formatPromptValue(packet.dynamicContext.sceneSummary)}`,
    `Excerpt: ${formatPromptValue(packet.dynamicContext.sceneExcerpt, 600)}`,
    `Context Pack: ${packet.dynamicContext.contextPackId || "nicht persistiert"}`,
    `Memory Synced: ${packet.dynamicContext.memorySyncedAt || "noch nie"}`,
    `Word Target: ${packet.dynamicContext.wordTargetMin ?? story.book.draftEngine.targetSceneWordsMin}-${packet.dynamicContext.wordTargetMax ?? story.book.draftEngine.targetSceneWordsMax}`,
    "Scene Card Outline:",
    formatPromptList(packet.dynamicContext.sceneCardOutline, "Keine Outline in der Scene Card.", 8),
    "Scene Directives:",
    formatPromptList(formatSceneDirectives(sceneCard?.directives ?? null), "Keine konkreten Scene-Directives hinterlegt.", 12),
    "Hard Constraints:",
    formatPromptList(packet.dynamicContext.sceneHardConstraints, "Keine harten Szenen-Constraints erkannt.", 8),
    "Previous Beats:",
    formatPromptList(
      packet.dynamicContext.previousBeats.map(function (beat) {
        return `${beat.orderLabel} ${beat.sceneTitle}: ${trimPromptText(beat.summary, 180)}`;
      }),
      "Keine vorherigen Beats im Packet.",
      4
    ),
    "Next Beat:",
    packet.dynamicContext.nextBeatTitle
      ? `- ${packet.dynamicContext.nextBeatTitle}`
      : "- Kein nächster Beat im Packet.",
    "Packet Canon:",
    formatPromptList(
      packet.dynamicContext.relevantCodex.map(function (entry) {
        return `${entry.title}: ${trimPromptText(entry.summary, 220)}`;
      }),
      "Kein relevanter Kanon im Packet.",
      5
    ),
    "Packet Character States:",
    formatPromptList(
      packet.dynamicContext.relevantCharacterStates.map(function (entry) {
        return `${entry.characterName}: ${trimPromptText(entry.currentState, 180)} | ${trimPromptText(entry.innerShift, 160)}`;
      }),
      "Keine relevanten Figurenstände im Packet.",
      5
    ),
    "Packet Open Threads:",
    formatPromptList(
      packet.dynamicContext.activeThreads.map(function (thread) {
        return `${thread.label} [${thread.status}/${thread.priority}]: ${trimPromptText(thread.detail, 220)}`;
      }),
      "Keine aktiven Fäden im Packet.",
      5
    ),
    "Latest Scene Draft Job:",
    latestJob ? formatFocusedJobBlock(latestJob) : "- Noch kein Draft-Job für diese Szene."
  ].join("\n");
}

function buildAssistantWorkspaceMemoryPrompt(story: StoryDocument) {
  const artifacts = story.assistant.artifacts
    .slice()
    .sort(function (left, right) {
      return right.updatedAt.localeCompare(left.updatedAt);
    })
    .slice(0, 4)
    .map(function (artifact) {
      return `${artifact.kind}: ${artifact.title} (${buildContextLabel(story, artifact.context)}) - ${trimPromptText(artifact.summary, 180)}`;
    });

  return [
    "## Assistant Workspace Memory",
    `Threads: ${story.assistant.threads.length}`,
    `Artifacts: ${story.assistant.artifacts.length}`,
    "Recent Artifacts:",
    formatPromptList(artifacts, "Noch keine Assistant-Dokumente gespeichert.", 4)
  ].join("\n");
}

function createLocalExecution(
  story: StoryDocument,
  threadId: string,
  outputMode: AssistantOutputMode,
  contextSelection: AssistantContextSelection,
  warning: string
): StoryChatExecution {
  const thread = story.assistant.threads.find(function (candidate) {
    return candidate.id === threadId;
  });
  const lastUserMessage =
    [...(thread?.messages ?? [])].reverse().find(function (message) {
      return message.role === "user";
    })?.content ?? "";

  if (outputMode === "regie") {
    const artifact = buildLocalRegieArtifact(story, contextSelection, lastUserMessage);

    return {
      provider: "local",
      mode: "local_fallback",
      modelName: null,
      reply: "Ich habe einen Regiebrief auf Basis des aktuellen Projektstands erzeugt. Prüfe vor allem Fokus, Verbote und die nächsten operativen Schritte.",
      suggestedThreadTitle: deriveLocalThreadTitle(lastUserMessage, "Regie"),
      artifact,
      warning
    };
  }

  return {
    provider: "local",
    mode: "local_fallback",
    modelName: null,
    reply: buildLocalReply(story, contextSelection, lastUserMessage),
    suggestedThreadTitle: deriveLocalThreadTitle(lastUserMessage, "Brainstorm"),
    warning
  };
}

function buildLocalReply(story: StoryDocument, contextSelection: AssistantContextSelection, prompt: string) {
  const packet = contextSelection.sceneId ? buildSceneContextPacket(story, contextSelection.sceneId) : null;
  const anchor = packet?.dynamicContext.sceneTitle || buildContextLabel(story, contextSelection) || story.title;
  const hook = story.book.marketBrief.hook || story.book.masterBrief.premise || "Der Stoff braucht einen klareren Zug.";
  const thematicCore = story.book.masterBrief.thematicCore || "Der thematische Kern ist noch nicht scharf genug benannt.";

  return [
    `Fokus: Für ${anchor} ist die stärkste Arbeitsachse aktuell ${hook}.`,
    `Hebel: Verdichte die Entscheidung so, dass sie den thematischen Kern "${thematicCore}" nicht erklärt, sondern im Konflikt sichtbar macht.`,
    `Nächster Schritt: Formuliere die Szene oder Idee als Frage mit Konsequenz und entscheide danach erst über Ton, POV und Eskalation.`,
    prompt ? `Direkt aus deiner Frage: ${prompt}` : "Direkt aus dem Projektzustand: erst Fokus, dann Verdichtung, dann formale Ausarbeitung."
  ].join("\n\n");
}

function buildLocalRegieArtifact(
  story: StoryDocument,
  contextSelection: AssistantContextSelection,
  prompt: string
) {
  const packet = contextSelection.sceneId ? buildSceneContextPacket(story, contextSelection.sceneId) : null;
  const today = new Date().toISOString().slice(0, 10);
  const writerRules = splitWriterConstitution(story.book.writerConstitution);
  const structureNotes = buildStructureAlignmentNotes(story, packet);
  const dynamicContextLines = buildDynamicContextLines(packet, contextSelection, story);
  const pipelineFitLines = buildPipelineFitLines(packet, story);
  const nextSteps = buildRegieNextSteps(story, packet);
  const content = [
    `# REGIE — „${story.title}”`,
    `> Format: EMBER Regiebrief v1 | Stand: ${today}`,
    `> Fokus: ${prompt || "Strategische Verdichtung des aktuellen Projektstands"}`,
    "",
    "---",
    "",
    "## STRUKTURABGLEICH",
    "",
    structureNotes.join("\n"),
    "",
    "## STABLE PREFIX",
    "",
    "| Feld | Inhalt |",
    "|---|---|",
    `| **Prämisse** | ${story.book.masterBrief.premise || "Noch nicht gesetzt."} |`,
    `| **Reader Promise** | ${story.book.masterBrief.readerPromise || "Noch nicht gesetzt."} |`,
    `| **Ending Promise** | ${story.book.masterBrief.endingPromise || "Noch nicht gesetzt."} |`,
    `| **Thematischer Kern** | ${story.book.masterBrief.thematicCore || "Noch nicht gesetzt."} |`,
    `| **Hook** | ${story.book.marketBrief.hook || "Noch nicht gesetzt."} |`,
    `| **Category Lane** | ${story.book.marketBrief.categoryLane || "Noch nicht gesetzt."} |`,
    `| **Serienpotenzial** | ${story.book.marketBrief.seriesPotential || "Noch nicht gesetzt."} |`,
    `| **Cover-Richtung** | ${story.book.marketBrief.coverDirection || "Noch nicht gesetzt."} |`,
    "",
    "## WRITER CONSTITUTION",
    "",
    "### Positive Leitplanken",
    "",
    writerRules.positive.length
      ? writerRules.positive.map(function (rule) {
          return `- ${rule}`;
        }).join("\n")
      : "- Keine positiven Leitplanken hinterlegt.",
    "",
    "### Negative Constraints",
    "",
    writerRules.negative.length
      ? writerRules.negative.map(function (rule) {
          return `- ${rule}`;
        }).join("\n")
      : "- Keine expliziten Negativregeln hinterlegt.",
    "",
    "## DYNAMIC CONTEXT",
    "",
    dynamicContextLines.join("\n"),
    "",
    "## PIPELINE-FIT",
    "",
    pipelineFitLines.join("\n"),
    "",
    "## NÄCHSTE SCHRITTE",
    "",
    nextSteps.join("\n")
  ].join("\n");

  return {
    title: `Regiebrief — ${story.title}`,
    kind: "regie" as const,
    summary: `Strategischer Regiebrief für ${story.title}${packet ? ` mit Fokus auf ${packet.dynamicContext.sceneTitle}` : ""}.`,
    content
  };
}

function buildScopedContextPrompt(story: StoryDocument, contextSelection: AssistantContextSelection) {
  if (contextSelection.scope === "project") {
    return [
      "Ebene: Gesamtprojekt",
      `Akts: ${story.acts.length}`,
      `Codex-Einträge: ${story.worldBible.length}`,
      `Scene Cards: ${story.book.memory.sceneCards.length}`,
      `Character States: ${story.book.memory.characterLedger.length}`,
      `Context Packs: ${story.book.memory.contextPacks.length}`,
      `Letzte Thread-Ebene: ${buildContextLabel(story, contextSelection)}`
    ].join("\n");
  }

  const act = story.acts.find(function (entry) {
    return entry.id === contextSelection.actId;
  });

  if (!act) {
    return "Kontext konnte nicht aufgelöst werden. Nutze das Gesamtprojekt.";
  }

  if (contextSelection.scope === "act") {
    return [
      `Ebene: Act`,
      `Act: ${act.title}`,
      "Kapitel:",
      act.chapters.map(function (chapter) {
        return `- ${chapter.title}: ${chapter.scenes.length} Szenen`;
      }).join("\n")
    ].join("\n");
  }

  const chapter = act.chapters.find(function (entry) {
    return entry.id === contextSelection.chapterId;
  });

  if (!chapter) {
    return [`Ebene: Act`, `Act: ${act.title}`].join("\n");
  }

  if (contextSelection.scope === "chapter") {
    return [
      `Ebene: Kapitel`,
      `Act: ${act.title}`,
      `Kapitel: ${chapter.title}`,
      "Szenenübersicht:",
      chapter.scenes.map(function (scene) {
        return `- ${scene.title}: ${scene.summary || "Keine Summary."}`;
      }).join("\n")
    ].join("\n");
  }

  const packet = contextSelection.sceneId ? buildSceneContextPacket(story, contextSelection.sceneId) : null;

  if (!packet) {
    return [
      `Ebene: Kapitel`,
      `Act: ${act.title}`,
      `Kapitel: ${chapter.title}`,
      "Szenenkontext konnte nicht geladen werden."
    ].join("\n");
  }

  return [
    `Ebene: Szene`,
    `Act: ${packet.dynamicContext.actTitle}`,
    `Kapitel: ${packet.dynamicContext.chapterTitle}`,
    `Szene: ${packet.dynamicContext.sceneTitle}`,
    `Zusammenfassung: ${packet.dynamicContext.sceneSummary}`,
    `Auszug: ${packet.dynamicContext.sceneExcerpt}`,
    `Context Pack: ${packet.dynamicContext.contextPackId || "nicht persistiert"}`,
    `Vorherige Beats: ${packet.dynamicContext.previousBeats.map(function (beat) {
      return beat.sceneTitle;
    }).join(" | ") || "keine"}`,
    `Nächster Beat: ${packet.dynamicContext.nextBeatTitle || "keiner"}`,
    `Relevanter Codex: ${packet.dynamicContext.relevantCodex.map(function (entry) {
      return entry.title;
    }).join(" | ") || "keiner"}`,
    `Relevante Character States: ${packet.dynamicContext.relevantCharacterStates.map(function (entry) {
      return `${entry.characterName} ← ${entry.snapshots.slice(-1).map(function (snapshot) {
        return snapshot.sourceLabel || snapshot.currentState;
      }).join("") || entry.updatedFromSceneId || "ohne Snapshot"}`;
    }).join(" | ") || "keine"}`,
    packet.dynamicContext.activeThreads.length
      ? `Offene Threads: ${packet.dynamicContext.activeThreads.map(function (thread) {
          return thread.label;
        }).join(" | ")}`
      : "Offene Threads: keine"
  ].join("\n");
}

function buildContextLabel(story: StoryDocument, contextSelection: AssistantContextSelection) {
  if (contextSelection.scope === "project") {
    return "Projektweit";
  }

  const act = story.acts.find(function (entry) {
    return entry.id === contextSelection.actId;
  });

  if (!act) {
    return "Projektweit";
  }

  if (contextSelection.scope === "act") {
    return `Act · ${act.title}`;
  }

  const chapter = act.chapters.find(function (entry) {
    return entry.id === contextSelection.chapterId;
  });

  if (!chapter) {
    return `Act · ${act.title}`;
  }

  if (contextSelection.scope === "chapter") {
    return `Kapitel · ${chapter.title}`;
  }

  const scene = chapter.scenes.find(function (entry) {
    return entry.id === contextSelection.sceneId;
  });

  return scene ? `Szene · ${scene.title}` : `Kapitel · ${chapter.title}`;
}

function deriveLocalThreadTitle(prompt: string, fallback: string) {
  const cleaned = prompt.replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return fallback;
  }

  return cleaned.split(" ").slice(0, 6).join(" ");
}

function buildWriterConstitutionPrompt(rules: string[]) {
  const split = splitWriterConstitution(rules.slice(0, 12));
  const lines: string[] = [];

  lines.push("Positive Leitplanken:");
  lines.push(
    split.positive.length
      ? split.positive.map(function (rule) {
          return `- ${rule}`;
        }).join("\n")
      : "- Keine positiven Leitplanken."
  );
  lines.push("Negative Constraints:");
  lines.push(
    split.negative.length
      ? split.negative.map(function (rule) {
          return `- ${rule}`;
        }).join("\n")
      : "- Keine expliziten Negativregeln."
  );

  return lines.join("\n");
}

function splitWriterConstitution(rules: string[]) {
  return rules.reduce(
    function (acc, rule) {
      const cleaned = rule.trim();

      if (!cleaned) {
        return acc;
      }

      if (/^negative regel:/i.test(cleaned) || /^vermeide\b/i.test(cleaned) || /^kein\b/i.test(cleaned)) {
        acc.negative.push(cleaned.replace(/^negative regel:\s*/i, ""));
        return acc;
      }

      acc.positive.push(cleaned);
      return acc;
    },
    {
      positive: [] as string[],
      negative: [] as string[]
    }
  );
}

function buildMemorySnapshotPrompt(story: StoryDocument, contextSelection: AssistantContextSelection) {
  const packet = contextSelection.sceneId ? buildSceneContextPacket(story, contextSelection.sceneId) : null;

  return [
    `Last synced: ${story.book.memory.lastSyncedAt || "noch nie"}`,
    `Canon facts: ${story.book.memory.canonLedger.length}`,
    `Character states: ${story.book.memory.characterLedger.length}`,
    `Open threads: ${story.book.memory.openThreads.length}`,
    `Scene cards: ${story.book.memory.sceneCards.length}`,
    `Context packs: ${story.book.memory.contextPacks.length}`,
    packet ? `Aktiver Scene-Packet: ${packet.dynamicContext.sceneTitle} (${packet.dynamicContext.contextPackId || "lokal"})` : `Aktiver Scope: ${buildContextLabel(story, contextSelection)}`
  ].join("\n");
}

function buildStructureAlignmentNotes(
  story: StoryDocument,
  packet: ReturnType<typeof buildSceneContextPacket>
) {
  const writerRules = splitWriterConstitution(story.book.writerConstitution);

  return [
    `- Writer Constitution liegt heute bereits als versionierbare Regelliste im Blueprint und im Stable Prefix, nicht als einzelner Prosa-Block.${writerRules.negative.length ? " Negative Regeln sind vorhanden und werden hier separat als Constraints geführt." : " Explizite Negativregeln fehlen aktuell oder sind nicht sauber markiert."}`,
    `- Scene Cards tragen aktuell Summary, Excerpt und Chapter Goal, aber kein persistiertes Outline-Feld. Der Outline-Schritt wird im Draft-Job aus Szenen-Context, offenen Threads, relevantem Codex und Next Beat abgeleitet.${packet ? " Für den aktuellen Scope ist dieser Ableitungspfad unten konkretisiert." : ""}`,
    "- Character States tragen jetzt Szenen- und Kapitel-Snapshots pro Figur; `currentState` ist nur die verdichtete Spitze dieses Verlaufs.",
    "- Wenn ein Constraint hart im Prompt landen soll, gehört er als eigener Writer-Constitution-Eintrag in die Regelbasis und nicht nur in Freitext oder Chat-Prosa."
  ];
}

function buildDynamicContextLines(
  packet: ReturnType<typeof buildSceneContextPacket>,
  contextSelection: AssistantContextSelection,
  story: StoryDocument
) {
  if (!packet) {
    return [
      `- Scope: ${buildContextLabel(story, contextSelection)}.`,
      "- Kein einzelner Scene Context Packet aktiv; der Regiebrief bleibt deshalb auf Projekt-, Act- oder Kapitel-Ebene.",
      `- Memory Backbone: ${story.book.memory.sceneCards.length} Scene Cards, ${story.book.memory.characterLedger.length} Character States, ${story.book.memory.openThreads.length} Open Threads.`
    ];
  }

  return [
    `- Scope: Szene · ${packet.dynamicContext.sceneTitle}.`,
    `- Act/Kapitel: ${packet.dynamicContext.actTitle} / ${packet.dynamicContext.chapterTitle}.`,
    `- Summary: ${packet.dynamicContext.sceneSummary || "Keine Summary hinterlegt."}`,
    `- Context Pack: ${packet.dynamicContext.contextPackId || "noch nicht persistiert"}.`,
    `- Previous Beats: ${packet.dynamicContext.previousBeats.map(function (beat) {
      return `${beat.sceneTitle} (${beat.orderLabel})`;
    }).join(" | ") || "keine"}.`,
    `- Next Beat: ${packet.dynamicContext.nextBeatTitle || "keiner"}.`,
    `- Relevanter Codex: ${packet.dynamicContext.relevantCodex.map(function (entry) {
      return `${entry.title}: ${entry.summary}`;
    }).join(" | ") || "keiner"}.`,
    `- Character States: ${packet.dynamicContext.relevantCharacterStates.map(function (entry) {
      return `${entry.characterName} — ${entry.currentState} [Snapshots: ${entry.snapshots.slice(-2).map(function (snapshot) {
        return snapshot.sourceLabel || snapshot.currentState;
      }).join(" | ") || "keine"}]`;
    }).join(" | ") || "keine"}.`,
    `- Offene Threads: ${packet.dynamicContext.activeThreads.map(function (thread) {
      return `${thread.label} (${thread.status})`;
    }).join(" | ") || "keine"}.`
  ];
}

function buildPipelineFitLines(
  packet: ReturnType<typeof buildSceneContextPacket>,
  story: StoryDocument
) {
  if (!packet) {
    return [
      "- Der aktuelle Regiebrief ist kein Draft-Job-Paket auf Szenenebene; Outline-, Extract- und Rewrite-Details bleiben deshalb vorläufig.",
      "- Für echte Pipeline-Härte muss der Scope auf eine konkrete Szene gesetzt werden, damit Context Pack, Beats und Character States referenziert werden können."
    ];
  }

  return [
    `- Outline-Input wird nicht aus einem separaten Scene-Card-Feld gelesen, sondern aus Summary, aktivem Thread und relevantem Codex der Szene "${packet.dynamicContext.sceneTitle}" abgeleitet.`,
    `- Draft-Anker: ${packet.dynamicContext.sceneSummary || story.book.masterBrief.premise || "Summary/Premise fehlt."}`,
    `- Extractor-Ziele: new_canon_facts, character_state_updates, open_threads_created, open_threads_resolved, foreshadowing_added, continuity_risks, style_drift_notes.`,
    `- Ledger-Status: Character States referenzieren jetzt Snapshot-Historie; Continuity sollte auf widersprüchliche Zustandswechsel zwischen benachbarten Snapshots prüfen.`,
    `- Operativer Fokus: Hook "${story.book.marketBrief.hook || "nicht gesetzt"}" und thematischer Kern "${story.book.masterBrief.thematicCore || "nicht gesetzt"}" müssen im selben Konflikt sichtbar werden.`
  ];
}

function buildRegieNextSteps(
  story: StoryDocument,
  packet: ReturnType<typeof buildSceneContextPacket>
) {
  const nextSteps = [
    "- Writer-Constitution-Regeln, die als harte Verbote gelten sollen, als eigene knappe Regelzeilen formulieren statt in Fließtext verstecken.",
    "- Scene Summary so schärfen, dass daraus ohne Interpretationssprung die Outline-Beats abgeleitet werden können.",
    "- Extractor-Updates nach akzeptierten Drafts prüfen, damit Snapshot-Verlauf, `updatedFromSceneId` und offene Threads sauber mitlaufen."
  ];

  if (packet) {
    nextSteps.push(
      `- Für ${packet.dynamicContext.sceneTitle} den Szenennachhall explizit aus der aktuellen Scene Card planen, damit Outline und Rewrite denselben Zug halten.`
    );
  } else {
    nextSteps.push("- Für eine belastbare Regie-Datei den Scope auf eine konkrete Szene setzen; erst dann sind Packet-, Extract- und Continuity-Aussagen präzise.")
  }

  if (!story.book.marketBrief.hook || !story.book.masterBrief.thematicCore) {
    nextSteps.push("- Hook und thematischen Kern im Blueprint vervollständigen; sonst bleibt der Regiebrief strukturell korrekt, aber dramaturgisch zu weich.");
  }

  return nextSteps;
}

function getScopedSceneContexts(story: StoryDocument, contextSelection: AssistantContextSelection) {
  const contexts = story.acts.flatMap(function (act) {
    return act.chapters.flatMap(function (chapter) {
      return chapter.scenes.map(function (scene) {
        return {
          actId: act.id,
          actTitle: act.title,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          sceneId: scene.id,
          sceneTitle: scene.title,
          summary: scene.summary,
          wordCount: getSceneTextWordCount(scene)
        };
      });
    });
  });

  if (contextSelection.scope === "project") {
    return contexts;
  }

  if (contextSelection.scope === "act") {
    return contexts.filter(function (sceneContext) {
      return sceneContext.actId === contextSelection.actId;
    });
  }

  if (contextSelection.scope === "chapter") {
    return contexts.filter(function (sceneContext) {
      return (
        sceneContext.actId === contextSelection.actId &&
        sceneContext.chapterId === contextSelection.chapterId
      );
    });
  }

  return contexts.filter(function (sceneContext) {
    return sceneContext.sceneId === contextSelection.sceneId;
  });
}

function getSceneTextWordCount(
  scene: StoryDocument["acts"][number]["chapters"][number]["scenes"][number]
) {
  if (scene.wordCount > 0) {
    return scene.wordCount;
  }

  return countWords(
    [scene.summary]
      .concat(
        scene.blocks.map(function (block) {
          return block.text;
        })
      )
      .join(" ")
  );
}

function formatScopedSceneLine(
  story: StoryDocument,
  sceneContext: ReturnType<typeof getScopedSceneContexts>[number]
) {
  const latestJob = getLatestJobForScene(story, sceneContext.sceneId);
  const jobStatus = latestJob
    ? `${latestJob.status}, ${countWords(latestJob.rewriteText)} rewrite words`
    : "no draft job";

  return `${sceneContext.actTitle} / ${sceneContext.chapterTitle} / ${sceneContext.sceneTitle} (${sceneContext.wordCount} words; ${jobStatus}): ${formatPromptValue(sceneContext.summary, 220)}`;
}

function getLatestJobForScene(story: StoryDocument, sceneId: string) {
  return getDraftJobsForScene(story, sceneId)[0] ?? null;
}

function selectRelevantCanonEntries(story: StoryDocument, scopedSceneIds: Set<string>) {
  const allSceneCount = getAllScenes(story).length;

  if (!scopedSceneIds.size || scopedSceneIds.size === allSceneCount) {
    return story.book.memory.canonLedger.slice(0, 6);
  }

  const scoped = story.book.memory.canonLedger.filter(function (entry) {
    return entry.sceneIds.some(function (sceneId) {
      return scopedSceneIds.has(sceneId);
    });
  });

  return (scoped.length ? scoped : story.book.memory.canonLedger).slice(0, 6);
}

function selectRelevantCharacterStates(story: StoryDocument, scopedSceneIds: Set<string>) {
  const allSceneCount = getAllScenes(story).length;

  if (!scopedSceneIds.size || scopedSceneIds.size === allSceneCount) {
    return story.book.memory.characterLedger.slice(0, 6);
  }

  const scoped = story.book.memory.characterLedger.filter(function (entry) {
    if (scopedSceneIds.has(entry.updatedFromSceneId)) {
      return true;
    }

    return entry.snapshots.some(function (snapshot) {
      return Boolean(snapshot.sourceSceneId && scopedSceneIds.has(snapshot.sourceSceneId));
    });
  });

  return (scoped.length ? scoped : story.book.memory.characterLedger).slice(0, 6);
}

function selectRelevantOpenThreads(story: StoryDocument, scopedSceneIds: Set<string>) {
  const allSceneCount = getAllScenes(story).length;
  const threads = story.book.memory.openThreads
    .slice()
    .sort(function (left, right) {
      const leftScore = scoreOpenThread(left.status, left.priority);
      const rightScore = scoreOpenThread(right.status, right.priority);

      return rightScore - leftScore || left.label.localeCompare(right.label);
    });

  if (!scopedSceneIds.size || scopedSceneIds.size === allSceneCount) {
    return threads.slice(0, 6);
  }

  const scoped = threads.filter(function (thread) {
    return (
      scopedSceneIds.has(thread.sourceSceneId) ||
      Boolean(thread.payoffSceneId && scopedSceneIds.has(thread.payoffSceneId))
    );
  });

  return (scoped.length ? scoped : threads).slice(0, 6);
}

function scoreOpenThread(status: StoryDocument["book"]["memory"]["openThreads"][number]["status"], priority: StoryDocument["book"]["memory"]["openThreads"][number]["priority"]) {
  const statusScore = status === "active" ? 20 : status === "watch" ? 10 : 0;
  const priorityScore = priority === "high" ? 3 : priority === "medium" ? 2 : 1;

  return statusScore + priorityScore;
}

function formatSceneDirectives(
  directives: StoryDocument["book"]["memory"]["sceneCards"][number]["directives"] | null
) {
  if (!directives) {
    return [];
  }

  const fixedEntries: Array<[string, string | null]> = [
    ["POV", directives.pov],
    ["Location", directives.location],
    ["Time", directives.timeAnchor],
    ["Objective", directives.objective],
    ["Opening", directives.opening],
    ["Core Action", directives.coreAction],
    ["Dramatic Beat", directives.dramaticBeat],
    ["Ending", directives.ending],
    ["Closing Line", directives.closingLine]
  ];
  const customEntries = directives.custom.map(function (entry) {
    return [entry.key, entry.value] as [string, string | null];
  });

  return fixedEntries
    .concat(customEntries)
    .filter(function (entry) {
      return Boolean(entry[1]?.trim());
    })
    .map(function ([key, value]) {
      return `${key}: ${trimPromptText(value ?? "", 240)}`;
    });
}

function formatDraftJobLine(job: StoryChatDraftJob) {
  const pendingSyncItems = job.extractedState.memorySync.items.filter(function (item) {
    return item.status === "pending";
  }).length;
  const qualityScore = job.stages.quality_eval.qualityScore;
  const qualitySuffix = typeof qualityScore === "number" ? `, quality ${qualityScore}` : "";

  return `${job.sceneTitle} [${job.status}, ${job.provider}${job.modelName ? `/${job.modelName}` : ""}, ${countWords(job.rewriteText)} rewrite words${qualitySuffix}, pending sync ${pendingSyncItems}] stages: ${formatStageStatusSummary(job)}`;
}

function formatFocusedJobBlock(job: StoryChatDraftJob) {
  return [
    `- Status: ${job.status}; provider: ${job.provider}${job.modelName ? `/${job.modelName}` : ""}; updated: ${job.updatedAt}`,
    `- Context Snapshot: chapter ${job.contextSnapshot.chapterTitle}; pack ${job.contextSnapshot.contextPackId || "lokal"}; memory ${job.contextSnapshot.memorySyncedAt || "unsynced"}`,
    `- Outline: ${job.outline.length ? job.outline.slice(0, 6).join(" | ") : "keine Outline"}`,
    `- Rewrite Notes: ${job.rewriteNotes.length ? job.rewriteNotes.slice(0, 5).join(" | ") : "keine Rewrite Notes"}`,
    `- Extracted Canon: ${job.extractedState.newCanonFacts.slice(0, 4).join(" | ") || "keine"}`,
    `- Character Updates: ${job.extractedState.characterStateUpdates.slice(0, 4).join(" | ") || "keine"}`,
    `- Open Threads Created: ${job.extractedState.openThreadsCreated.slice(0, 4).join(" | ") || "keine"}`,
    `- Continuity Risks: ${job.extractedState.continuityRisks.concat(job.extractedState.styleDriftNotes).slice(0, 5).join(" | ") || "keine"}`,
    `- Stage Status: ${formatStageStatusSummary(job)}`
  ].join("\n");
}

function formatStageStatusSummary(job: StoryChatDraftJob) {
  return STORY_CHAT_STAGE_ORDER.map(function (stage) {
    const run = job.stages[stage];

    return `${stage}:${run.status}${run.repairCount ? `/repairs-${run.repairCount}` : ""}`;
  }).join(", ");
}

function formatPromptList(items: string[], emptyLabel: string, maxItems = 6) {
  const lines = items
    .map(function (item) {
      return trimPromptText(item, 520);
    })
    .filter(Boolean)
    .slice(0, maxItems);

  if (!lines.length) {
    return `- ${emptyLabel}`;
  }

  return lines.map(function (line) {
    return `- ${line}`;
  }).join("\n");
}

function formatPromptValue(value: string | null | undefined, maxLength = 360) {
  const trimmed = trimPromptText(value ?? "", maxLength);

  return trimmed || "nicht gesetzt";
}

function trimPromptText(value: string, maxLength: number) {
  const cleaned = value.replace(/\s+/g, " ").trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { buildSceneContextPacket } from "@/lib/book-engine";
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
import { createDefaultAssistantContextSelection } from "@/lib/story-schema";

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
type RemoteStoryChatProvider = Exclude<AssistantProvider, "auto" | "local">;

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
    return createLocalExecution(
      params.story,
      thread.id,
      outputMode,
      contextSelection,
      "Lokaler Provider explizit gewählt."
    );
  }

  const remoteProvider = resolveRemoteProvider(provider);

  if (!remoteProvider) {
    return createLocalExecution(
      params.story,
      thread.id,
      outputMode,
      contextSelection,
      "Kein OPENAI_API_KEY, ANTHROPIC_API_KEY oder GEMINI_API_KEY gesetzt; lokaler Fallback verwendet."
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
        : remoteProvider === "anthropic"
          ? await generateWithAnthropic(
              params.story,
              thread.id,
              outputMode,
              contextSelection,
              params.modelSelection
            )
          : await generateWithGemini(
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

  if (provider === "gemini" && getGeminiApiKey()) {
    return "gemini" as const;
  }

  if (provider === "auto") {
    if (process.env.OPENAI_API_KEY) {
      return "openai" as const;
    }

    if (process.env.ANTHROPIC_API_KEY) {
      return "anthropic" as const;
    }

    if (getGeminiApiKey()) {
      return "gemini" as const;
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

async function generateWithGemini(
  story: StoryDocument,
  threadId: string,
  outputMode: AssistantOutputMode,
  contextSelection: AssistantContextSelection,
  modelSelection?: AssistantModelSelection
) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error("Missing Gemini API key.");
  }

  const modelName = resolveBookJobModelValue(
    modelSelection?.gemini,
    process.env.GEMINI_STORY_CHAT_MODEL || process.env.GOOGLE_GEMINI_STORY_CHAT_MODEL,
    DEFAULT_BOOK_JOB_MODELS.gemini
  );
  const client = new GoogleGenAI({
    apiKey
  });
  const response = await client.models.generateContent({
    model: modelName,
    contents: buildUserPrompt(story, threadId, outputMode, contextSelection),
    config: {
      systemInstruction: buildSystemPrompt(story, outputMode),
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(storyChatSchema)
    }
  });

  if (!response.text) {
    throw new Error("Gemini lieferte keinen Text.");
  }

  return {
    modelName,
    data: storyChatSchema.parse(JSON.parse(response.text))
  };
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
    return `${message.role === "assistant" ? "ASSISTANT" : "USER"}: ${message.content}`;
  });
  const codexSnapshot = story.worldBible.slice(0, 8).map(function (entry) {
    return `- ${entry.title} (${entry.kind}): ${entry.summary}`;
  });
  const writerRules = buildWriterConstitutionPrompt(story.book.writerConstitution);
  const scopedContext = buildScopedContextPrompt(story, contextSelection);
  const memorySnapshot = buildMemorySnapshotPrompt(story, contextSelection);

  return [
    `OUTPUT_MODE: ${outputMode}`,
    `CONTEXT_SCOPE: ${contextSelection.scope}`,
    `PROJEKT: ${story.title}`,
    `GENRE: ${story.meta.genre || "nicht gesetzt"}`,
    `SPRACHE: ${story.meta.language || "de"}`,
    `PREMISE: ${story.book.masterBrief.premise || "nicht gesetzt"}`,
    `READER_PROMISE: ${story.book.masterBrief.readerPromise || "nicht gesetzt"}`,
    `ENDING_PROMISE: ${story.book.masterBrief.endingPromise || "nicht gesetzt"}`,
    `THEMATIC_CORE: ${story.book.masterBrief.thematicCore || "nicht gesetzt"}`,
    `MARKET_HOOK: ${story.book.marketBrief.hook || "nicht gesetzt"}`,
    "",
    "WRITER_CONSTITUTION:",
    writerRules,
    "",
    "CODEX:",
    codexSnapshot.length ? codexSnapshot.join("\n") : "- Keine Codex-Einträge",
    "",
    "MEMORY_BACKBONE:",
    memorySnapshot,
    "",
    "KONTEXT:",
    scopedContext,
    "",
    "LETZTE NACHRICHTEN:",
    recentMessages.join("\n"),
    "",
    "LIEFERE JSON im vereinbarten Schema.",
    "Wenn OUTPUT_MODE chat ist, soll artifact null sein.",
    "Wenn OUTPUT_MODE regie ist, erzeuge ein kompaktes, hochwertiges Markdown-Dokument als artifact.",
    "Wenn OUTPUT_MODE regie ist, muss artifact.content diese Abschnitte enthalten: ## Strukturabgleich, ## Stable Prefix, ## Writer Constitution, ## Dynamic Context, ## Pipeline-Fit, ## Nächste Schritte.",
    "Wenn du eine Lücke benennst, sage explizit, ob sie heute ein echter Datenmodell- oder Persistenzmangel ist oder nur ein geplanter Ausbau laut Struktur.",
    "Der reply-Text bleibt knapp und sagt, was du entschieden oder erzeugt hast."
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
    `Nächster Beat: ${packet.dynamicContext.nextBeat?.sceneTitle || "keiner"}`,
    `Relevanter Codex: ${packet.dynamicContext.relevantCodex.map(function (entry) {
      return entry.title;
    }).join(" | ") || "keiner"}`,
    `Relevante Character States: ${packet.dynamicContext.relevantCharacterStates.map(function (entry) {
      return `${entry.characterName} ← ${entry.updatedFromSceneId || "ohne Szenenbezug"}`;
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

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || null;
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
    "- Character States haben bereits einen Szenenbezug über `updatedFromSceneId`, bilden aber noch keinen vollständigen Verlauf mit mehreren Snapshots pro Figur ab.",
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
    `- Next Beat: ${packet.dynamicContext.nextBeat ? `${packet.dynamicContext.nextBeat.sceneTitle} (${packet.dynamicContext.nextBeat.orderLabel})` : "keiner"}.`,
    `- Relevanter Codex: ${packet.dynamicContext.relevantCodex.map(function (entry) {
      return `${entry.title}: ${entry.summary}`;
    }).join(" | ") || "keiner"}.`,
    `- Character States: ${packet.dynamicContext.relevantCharacterStates.map(function (entry) {
      return `${entry.characterName} — ${entry.currentState} [Quelle: ${entry.updatedFromSceneId || "ohne Szenenbezug"}]`;
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
    `- Outline-Input wird nicht aus einem separaten Scene-Card-Feld gelesen, sondern aus Summary, aktivem Thread, relevantem Codex und Next Beat der Szene "${packet.dynamicContext.sceneTitle}" abgeleitet.`,
    `- Draft-Anker: ${packet.dynamicContext.sceneSummary || story.book.masterBrief.premise || "Summary/Premise fehlt."}`,
    `- Extractor-Ziele: new_canon_facts, character_state_updates, open_threads_created, open_threads_resolved, foreshadowing_added, continuity_risks, style_drift_notes.`,
    `- Ledger-Risiko: Character States kennen aktuell die letzte Quellszene, aber noch keine echte Snapshot-Historie über mehrere Zustandswechsel hinweg.`,
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
    "- Extractor-Updates nach akzeptierten Drafts prüfen, damit `updatedFromSceneId` und offene Threads sauber mitlaufen."
  ];

  if (packet) {
    nextSteps.push(
      `- Für ${packet.dynamicContext.sceneTitle} die nächste Verschiebung explizit gegen ${packet.dynamicContext.nextBeat?.sceneTitle || "den Folge-Beat"} planen, damit Outline und Rewrite denselben Zug halten.`
    );
  } else {
    nextSteps.push("- Für eine belastbare Regie-Datei den Scope auf eine konkrete Szene setzen; erst dann sind Packet-, Extract- und Continuity-Aussagen präzise.")
  }

  if (!story.book.marketBrief.hook || !story.book.masterBrief.thematicCore) {
    nextSteps.push("- Hook und thematischen Kern im Blueprint vervollständigen; sonst bleibt der Regiebrief strukturell korrekt, aber dramaturgisch zu weich.");
  }

  return nextSteps;
}

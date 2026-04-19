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
  const writerRules = story.book.writerConstitution.slice(0, 8).map(function (rule) {
    return `- ${rule}`;
  });
  const scopedContext = buildScopedContextPrompt(story, contextSelection);

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
    writerRules.length ? writerRules.join("\n") : "- Keine Regeln gesetzt",
    "",
    "CODEX:",
    codexSnapshot.length ? codexSnapshot.join("\n") : "- Keine Codex-Einträge",
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
  const sceneFocus = packet
    ? `**Szenenfokus** | ${packet.dynamicContext.sceneTitle} | ${packet.dynamicContext.sceneSummary || "Zusammenfassung fehlt."}`
    : null;
  const content = [
    `# REGIE — „${story.title}”`,
    `> Format: EMBER Regiebrief v1 | Stand: ${today}`,
    `> Fokus: ${prompt || "Strategische Verdichtung des aktuellen Projektstands"}`,
    "",
    "---",
    "",
    "## MASTER BRIEF",
    "",
    "| Feld | Inhalt |",
    "|---|---|",
    `| **Prämisse** | ${story.book.masterBrief.premise || "Noch nicht gesetzt."} |`,
    `| **Reader Promise** | ${story.book.masterBrief.readerPromise || "Noch nicht gesetzt."} |`,
    `| **Ending Promise** | ${story.book.masterBrief.endingPromise || "Noch nicht gesetzt."} |`,
    `| **Thematischer Kern** | ${story.book.masterBrief.thematicCore || "Noch nicht gesetzt."} |`,
    "",
    "## MARKET BRIEF",
    "",
    "| Feld | Inhalt |",
    "|---|---|",
    `| **Hook** | ${story.book.marketBrief.hook || "Noch nicht gesetzt."} |`,
    `| **Category Lane** | ${story.book.marketBrief.categoryLane || "Noch nicht gesetzt."} |`,
    `| **Serienpotenzial** | ${story.book.marketBrief.seriesPotential || "Noch nicht gesetzt."} |`,
    `| **Cover-Richtung** | ${story.book.marketBrief.coverDirection || "Noch nicht gesetzt."} |`,
    "",
    "## WRITER CONSTITUTION",
    "",
    story.book.writerConstitution.slice(0, 8).map(function (rule) {
      return `- ${rule}`;
    }).join("\n") || "- Keine Regeln hinterlegt.",
    "",
    "## OPERATIVE REGIE",
    "",
    `- Halte die Stoffbewegung an der stärksten Marktachse: ${story.book.marketBrief.hook || story.book.masterBrief.premise || "noch offen"}.`,
    `- Vermeide generische Crime-Signale und arbeite stattdessen über ${story.book.masterBrief.thematicCore || "konkrete Reibung und Folgeentscheidungen"}.`,
    `- Jede neue Szene muss Risiko, Verschiebung und Nachhall liefern; weiche Übergänge werden gestrichen.`,
    packet && packet.dynamicContext.activeThreads.length
      ? `- Aktive Threads im Blick: ${packet.dynamicContext.activeThreads.map(function (thread) {
          return thread.label;
        }).join(" | ")}.`
      : "- Aktive Threads im Blick: keine priorisierten Thread-Daten im Kontext.",
    "",
        "## SZENEN- ODER PROJEKTFOKUS",
        "",
    sceneFocus
      ? ["| Typ | Titel | Zugriff |", "|---|---|---|", sceneFocus].join("\n")
      : `- Kontext: ${buildContextLabel(story, contextSelection)}.`,
    "",
    "## NÄCHSTE SCHRITTE",
    "",
    "- Hook und thematischen Kern auf denselben Konflikt ausrichten.",
    "- Die nächste Szene so planen, dass sie eine klare Verschiebung erzeugt.",
    "- Bei Bedarf aus diesem Regiebrief eine Szenenanweisung oder Outline ableiten."
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

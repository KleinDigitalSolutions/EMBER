import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import {
  DEFAULT_BOOK_JOB_MODELS,
  resolveBookJobModelValue,
  type BookJobModelOverrides
} from "@/lib/book-job-models";
import {
  buildSceneContextPacket,
  createCompletedDraftStageRuns,
  createDraftJobFromPacket,
  type SceneContextPacket
} from "@/lib/book-engine";
import type { BookDraftJob, StoryDocument } from "@/lib/story-schema";
import { createUuid } from "@/lib/id";

const draftJobSchema = z.object({
  outline: z.array(z.string()).min(3).max(6),
  draftText: z.string().min(120),
  rewriteText: z.string().min(120),
  rewriteNotes: z.array(z.string()).min(1).max(6),
  extractedState: z.object({
    newCanonFacts: z.array(z.string()).max(6),
    characterStateUpdates: z.array(z.string()).max(6),
    openThreadsCreated: z.array(z.string()).max(6),
    openThreadsResolved: z.array(z.string()).max(6),
    foreshadowingAdded: z.array(z.string()).max(6),
    continuityRisks: z.array(z.string()).max(6),
    styleDriftNotes: z.array(z.string()).max(6)
  })
});

const continuityAuditSchema = z.object({
  continuityRisks: z.array(z.string()).max(6),
  styleDriftNotes: z.array(z.string()).max(6)
});

type DraftJobPayload = z.infer<typeof draftJobSchema>;
type ContinuityAuditPayload = z.infer<typeof continuityAuditSchema>;
export type BookJobProvider = "auto" | "openai" | "anthropic" | "gemini" | "local";
type RemoteBookJobProvider = Exclude<BookJobProvider, "auto" | "local">;

export type BookJobExecution = {
  provider: Exclude<BookJobProvider, "auto">;
  mode: "remote" | "local_fallback";
  job: BookDraftJob;
  warning?: string;
};

export async function generateBookDraftJob(params: {
  story?: StoryDocument;
  sceneId: string;
  packet?: SceneContextPacket;
  provider?: BookJobProvider;
  modelOverrides?: BookJobModelOverrides;
  targetSceneWordsMin?: number;
  targetSceneWordsMax?: number;
  directorNote?: string;
}): Promise<BookJobExecution> {
  const provider = params.provider ?? "auto";
  const packet =
    params.packet ?? (params.story ? buildSceneContextPacket(params.story, params.sceneId) : null);
  const targetSceneWordsMin = params.targetSceneWordsMin ?? 1200;
  const targetSceneWordsMax = params.targetSceneWordsMax ?? 1600;
  const directorNote = params.directorNote?.trim() || "";

  if (!packet) {
    throw new Error("Scene context could not be built.");
  }

  if (provider === "local") {
    return createLocalExecution(
      packet,
      targetSceneWordsMin,
      targetSceneWordsMax,
      "Lokaler Provider explizit gewaehlt."
    );
  }

  const remoteProvider = resolveRemoteProvider(provider);

  if (!remoteProvider) {
    return createLocalExecution(
      packet,
      targetSceneWordsMin,
      targetSceneWordsMax,
      "Kein OPENAI_API_KEY, ANTHROPIC_API_KEY oder GEMINI_API_KEY gesetzt; lokaler Fallback verwendet."
    );
  }

  try {
    const providerOptions = {
      modelOverrides: params.modelOverrides,
      targetSceneWordsMin,
      targetSceneWordsMax,
      directorNote
    };

    const result =
      remoteProvider === "openai"
        ? await generateWithOpenAI(packet, providerOptions)
        : remoteProvider === "anthropic"
          ? await generateWithAnthropic(packet, providerOptions)
          : await generateWithGemini(packet, providerOptions);

    return {
      provider: remoteProvider,
      mode: "remote",
      job: hydrateDraftJob(params.sceneId, packet, result.payload, {
        provider: remoteProvider,
        mode: "remote",
        modelName: result.modelName,
        continuityModelName: result.continuityModelName ?? null
      })
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown provider error.";

    return createLocalExecution(
      packet,
      targetSceneWordsMin,
      targetSceneWordsMax,
      `${remoteProvider} request failed; local fallback used. ${message}`
    );
  }
}

function resolveRemoteProvider(provider: BookJobProvider) {
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
  packet: SceneContextPacket,
  options: {
    modelOverrides?: BookJobModelOverrides;
    targetSceneWordsMin: number;
    targetSceneWordsMax: number;
    directorNote: string;
  }
) {
  const modelName = resolveBookJobModelValue(
    options.modelOverrides?.openai,
    process.env.OPENAI_BOOK_MODEL,
    DEFAULT_BOOK_JOB_MODELS.openai
  );
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await client.responses.parse({
    model: modelName,
    store: false,
    reasoning: { effort: "medium" },
    input: [
      {
        role: "system",
        content: buildSystemPrompt(packet)
      },
      {
        role: "user",
        content: buildDynamicUserPrompt(packet, options)
      }
    ],
    text: {
      format: zodTextFormat(draftJobSchema, "ember_book_job")
    }
  });

  if (!response.output_parsed) {
    throw new Error("OpenAI returned no parsed output.");
  }

  return {
    modelName,
    continuityModelName: null,
    payload: response.output_parsed
  };
}

async function generateWithAnthropic(
  packet: SceneContextPacket,
  options: {
    modelOverrides?: BookJobModelOverrides;
    targetSceneWordsMin: number;
    targetSceneWordsMax: number;
    directorNote: string;
  }
) {
  const modelName = resolveBookJobModelValue(
    options.modelOverrides?.anthropic,
    process.env.ANTHROPIC_BOOK_MODEL,
    DEFAULT_BOOK_JOB_MODELS.anthropic
  );
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const systemPromptBlocks = buildAnthropicSystemPromptBlocks(packet);
  const message = await client.messages.parse({
    model: modelName,
    max_tokens: 2200,
    system: systemPromptBlocks,
    messages: [
      {
        role: "user",
        content: buildDynamicUserPrompt(packet, options)
      }
    ],
    output_config: {
      format: zodOutputFormat(draftJobSchema)
    }
  });

  if (!message.parsed_output) {
    throw new Error("Anthropic returned no parsed output.");
  }

  const continuityAudit = await runAnthropicContinuityAudit(client, packet, options, {
    payload: message.parsed_output
  });

  return {
    modelName,
    continuityModelName:
      continuityAudit && continuityAudit.continuityRisks.concat(continuityAudit.styleDriftNotes).length
        ? resolveBookJobModelValue(
            options.modelOverrides?.anthropicContinuity,
            process.env.ANTHROPIC_CONTINUITY_MODEL,
            DEFAULT_BOOK_JOB_MODELS.anthropicContinuity
          )
        : modelName,
    payload: continuityAudit
      ? mergeContinuityAudit(message.parsed_output, continuityAudit)
      : message.parsed_output
  };
}

async function generateWithGemini(
  packet: SceneContextPacket,
  options: {
    modelOverrides?: BookJobModelOverrides;
    targetSceneWordsMin: number;
    targetSceneWordsMax: number;
    directorNote: string;
  }
) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error("Missing Gemini API key.");
  }

  const modelName =
    resolveBookJobModelValue(
      options.modelOverrides?.gemini,
      process.env.GEMINI_BOOK_MODEL || process.env.GOOGLE_GEMINI_BOOK_MODEL,
      DEFAULT_BOOK_JOB_MODELS.gemini
    );
  const client = new GoogleGenAI({
    apiKey
  });

  const response = await client.models.generateContent({
    model: modelName,
    contents: buildDynamicUserPrompt(packet, options),
    config: {
      systemInstruction: buildSystemPrompt(packet),
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(draftJobSchema)
    }
  });

  if (!response.text) {
    throw new Error("Gemini returned no text output.");
  }

  return {
    modelName,
    continuityModelName: null,
    payload: draftJobSchema.parse(JSON.parse(response.text))
  };
}

function getGeminiApiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    null
  );
}

function hydrateDraftJob(
  sceneId: string,
  packet: SceneContextPacket,
  payload: DraftJobPayload,
  meta: {
    provider: BookDraftJob["provider"];
    mode: BookDraftJob["mode"];
    modelName: string | null;
    continuityModelName: string | null;
  }
): BookDraftJob {
  const now = new Date().toISOString();

  return {
    id: createLocalId("draft_job"),
    sceneId,
    sceneTitle: packet.dynamicContext.sceneTitle,
    createdAt: now,
    updatedAt: now,
    provider: meta.provider,
    mode: meta.mode,
    modelName: meta.modelName,
    status: "ready" as const,
    acceptedAt: null,
    outline: payload.outline,
    draftText: payload.draftText,
    rewriteText: payload.rewriteText,
    rewriteNotes: payload.rewriteNotes,
    extractedState: payload.extractedState,
    stages: createCompletedDraftStageRuns({
      provider: meta.provider,
      modelName: meta.modelName,
      continuityModelName: meta.continuityModelName,
      updatedAt: now,
      continuityNotes: payload.extractedState.continuityRisks.concat(
        payload.extractedState.styleDriftNotes
      ),
      rewriteNotes: payload.rewriteNotes
    }),
    contextSnapshot: {
      contextPackId: packet.dynamicContext.contextPackId || createLocalId("pack"),
      memorySyncedAt: packet.dynamicContext.memorySyncedAt,
      chapterTitle: packet.dynamicContext.chapterTitle,
      sceneSummary: packet.dynamicContext.sceneSummary,
      relevantCodexTitles: packet.dynamicContext.relevantCodex.map(function (entry) {
        return entry.title;
      }),
      relevantCharacterNames: packet.dynamicContext.relevantCharacterStates.map(function (entry) {
        return entry.characterName;
      }),
      activeThreadLabels: packet.dynamicContext.activeThreads.map(function (thread) {
        return thread.label;
      })
    }
  };
}

function createLocalExecution(
  packet: SceneContextPacket,
  targetSceneWordsMin: number,
  targetSceneWordsMax: number,
  warning: string
): BookJobExecution {
  return {
    provider: "local",
    mode: "local_fallback",
    job: createDraftJobFromPacket(packet, targetSceneWordsMin, targetSceneWordsMax),
    warning
  };
}

function buildSystemPrompt(packet: SceneContextPacket) {
  return [
    buildCoreSystemPrompt(),
    buildStablePrefixPrompt(packet)
  ].join("\n");
}

function buildDynamicUserPrompt(
  packet: SceneContextPacket,
  options: {
    targetSceneWordsMin: number;
    targetSceneWordsMax: number;
    directorNote: string;
  }
) {
  return [
    "Create one drafting job for the selected scene.",
    `Target rewrite length: ${options.targetSceneWordsMin}-${options.targetSceneWordsMax} words.`,
    `Act: ${packet.dynamicContext.actTitle}`,
    `Chapter: ${packet.dynamicContext.chapterTitle}`,
    `Scene: ${packet.dynamicContext.sceneTitle}`,
    `Scene summary: ${packet.dynamicContext.sceneSummary}`,
    `Scene excerpt: ${packet.dynamicContext.sceneExcerpt}`,
    `Context pack id: ${packet.dynamicContext.contextPackId || "generated_locally"}`,
    `Previous beats: ${packet.dynamicContext.previousBeats
      .map(function (beat) {
        return `${beat.sceneTitle}: ${beat.summary || beat.excerpt}`;
      })
      .join(" || ")}`,
    `Next beat: ${packet.dynamicContext.nextBeat?.sceneTitle || "none"}`,
    `Relevant codex: ${packet.dynamicContext.relevantCodex
      .map(function (entry) {
        return `${entry.title}: ${entry.summary}`;
      })
      .join(" || ")}`,
    `Relevant character states: ${packet.dynamicContext.relevantCharacterStates
      .map(function (entry) {
        return `${entry.characterName}: ${entry.currentState}`;
      })
      .join(" || ")}`,
    `Active threads: ${packet.dynamicContext.activeThreads
      .map(function (thread) {
        return `${thread.label}: ${thread.detail}`;
      })
      .join(" || ")}`,
    options.directorNote ? `Director note: ${options.directorNote}` : "Director note: none",
    "Produce:",
    "- outline beats",
    "- draftText as a scene draft",
    "- rewriteText as the cleaner revised version",
    "- rewriteNotes",
    "- extractedState with canon facts, character updates, open threads, foreshadowing, continuity risks, and style drift notes"
  ].join("\n");
}

function formatPromptList(label: string, items: string[]) {
  const compactItems = items
    .map(function (item) {
      return item.trim();
    })
    .filter(Boolean);

  if (!compactItems.length) {
    return `${label}: none`;
  }

  return `${label}: ${compactItems.join(" | ")}`;
}

function buildCoreSystemPrompt() {
  return [
    "You are the drafting engine for EMBER Book Studio.",
    "Return only structured output matching the requested schema.",
    "Do not imitate living authors or copyrighted prose.",
    "Honor the canon, preserve tone consistency, and surface continuity risks explicitly.",
    "Write commercially readable genre prose, but keep it grounded in the supplied scene context.",
    "If canon is insufficient, do not invent silently; flag the gap in continuityRisks.",
    "Publishing and KDP rules shape readability, quality, and packaging; they must never appear as meta commentary inside the scene prose.",
    "Favor scene truth, subtext, momentum, and readability over exposition-heavy explanation."
  ].join("\n");
}

function buildStablePrefixPrompt(packet: SceneContextPacket) {
  return [
    `Premise: ${packet.stablePrefix.premise}`,
    `Reader promise: ${packet.stablePrefix.readerPromise}`,
    `Ending promise: ${packet.stablePrefix.endingPromise}`,
    `Thematic core: ${packet.stablePrefix.thematicCore}`,
    `Commercial lane: ${packet.stablePrefix.categoryLane || "not set"}`,
    `Commercial hook: ${packet.stablePrefix.marketHook || "not set"}`,
    formatPromptList("Story architecture", packet.stablePrefix.storyArchitecture),
    formatPromptList("Writer constitution", packet.stablePrefix.writerConstitution),
    formatPromptList("Publishing guardrails", packet.stablePrefix.publishingGuardrails)
  ].join("\n");
}

function buildAnthropicSystemPromptBlocks(packet: SceneContextPacket) {
  return [
    {
      type: "text" as const,
      text: buildCoreSystemPrompt()
    },
    {
      type: "text" as const,
      text: buildStablePrefixPrompt(packet),
      cache_control: { type: "ephemeral" as const }
    }
  ];
}

async function runAnthropicContinuityAudit(
  client: Anthropic,
  packet: SceneContextPacket,
  options: {
    modelOverrides?: BookJobModelOverrides;
    targetSceneWordsMin: number;
    targetSceneWordsMax: number;
    directorNote: string;
  },
  draft: {
    payload: DraftJobPayload;
  }
) {
  const continuityModelName =
    resolveBookJobModelValue(
      options.modelOverrides?.anthropicContinuity,
      process.env.ANTHROPIC_CONTINUITY_MODEL,
      DEFAULT_BOOK_JOB_MODELS.anthropicContinuity
    );

  try {
    const message = await client.messages.parse({
      model: continuityModelName,
      max_tokens: 800,
      system: buildAnthropicSystemPromptBlocks(packet),
      messages: [
        {
          role: "user",
          content: buildContinuityAuditPrompt(packet, options, draft.payload)
        }
      ],
      output_config: {
        format: zodOutputFormat(continuityAuditSchema)
      }
    });

    return message.parsed_output ?? null;
  } catch {
    return null;
  }
}

function buildContinuityAuditPrompt(
  packet: SceneContextPacket,
  options: {
    targetSceneWordsMin: number;
    targetSceneWordsMax: number;
    directorNote: string;
  },
  payload: DraftJobPayload
) {
  return [
    "Audit the generated scene draft for continuity and style drift only.",
    "This is not a creative writing pass.",
    `Target rewrite length remains ${options.targetSceneWordsMin}-${options.targetSceneWordsMax} words.`,
    `Act: ${packet.dynamicContext.actTitle}`,
    `Chapter: ${packet.dynamicContext.chapterTitle}`,
    `Scene: ${packet.dynamicContext.sceneTitle}`,
    `Scene summary: ${packet.dynamicContext.sceneSummary}`,
    `Scene excerpt: ${packet.dynamicContext.sceneExcerpt}`,
    `Previous beats: ${packet.dynamicContext.previousBeats
      .map(function (beat) {
        return `${beat.sceneTitle}: ${beat.summary || beat.excerpt}`;
      })
      .join(" || ")}`,
    `Next beat: ${packet.dynamicContext.nextBeat?.sceneTitle || "none"}`,
    `Relevant codex: ${packet.dynamicContext.relevantCodex
      .map(function (entry) {
        return `${entry.title}: ${entry.summary}`;
      })
      .join(" || ")}`,
    `Relevant character states: ${packet.dynamicContext.relevantCharacterStates
      .map(function (entry) {
        return `${entry.characterName}: ${entry.currentState}`;
      })
      .join(" || ")}`,
    `Active threads: ${packet.dynamicContext.activeThreads
      .map(function (thread) {
        return `${thread.label}: ${thread.detail}`;
      })
      .join(" || ")}`,
    options.directorNote ? `Director note: ${options.directorNote}` : "Director note: none",
    `Outline beats: ${payload.outline.join(" | ")}`,
    `Draft text: ${payload.draftText}`,
    `Rewrite text: ${payload.rewriteText}`,
    `Existing continuity risks: ${payload.extractedState.continuityRisks.join(" | ") || "none"}`,
    `Existing style drift notes: ${payload.extractedState.styleDriftNotes.join(" | ") || "none"}`,
    "Return only:",
    "- continuityRisks",
    "- styleDriftNotes"
  ].join("\n");
}

function mergeContinuityAudit(payload: DraftJobPayload, audit: ContinuityAuditPayload): DraftJobPayload {
  return {
    ...payload,
    extractedState: {
      ...payload.extractedState,
      continuityRisks: dedupeStrings(
        payload.extractedState.continuityRisks.concat(audit.continuityRisks)
      ).slice(0, 6),
      styleDriftNotes: dedupeStrings(
        payload.extractedState.styleDriftNotes.concat(audit.styleDriftNotes)
      ).slice(0, 6)
    }
  };
}

function dedupeStrings(values: string[]) {
  return values
    .map(function (value) {
      return value.trim();
    })
    .filter(Boolean)
    .filter(function (value, index, list) {
      return list.indexOf(value) === index;
    });
}

function createLocalId(prefix: string) {
  return createUuid();
}

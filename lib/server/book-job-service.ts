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
type DraftGenerationOptions = {
  modelOverrides?: BookJobModelOverrides;
  targetSceneWordsMin: number;
  targetSceneWordsMax: number;
  directorNote: string;
};
type DraftQualityIssue = {
  code: "rewrite_length" | "meta_language" | "extractor_discipline";
  detail: string;
};
type DraftProviderResult = {
  modelName: string;
  continuityModelName: string | null;
  payload: DraftJobPayload;
  warning?: string;
};
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
    const providerOptions: DraftGenerationOptions = {
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
      warning: result.warning,
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
  options: DraftGenerationOptions
): Promise<DraftProviderResult> {
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
  options: DraftGenerationOptions
): Promise<DraftProviderResult> {
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
  options: DraftGenerationOptions
): Promise<DraftProviderResult> {
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

  const payload = draftJobSchema.parse(JSON.parse(response.text));
  const repaired = await maybeRepairGeminiPayload(client, modelName, packet, options, payload);

  return {
    modelName,
    continuityModelName: null,
    payload: repaired.payload,
    warning: repaired.warning
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
  options: DraftGenerationOptions
) {
  return [
    "Create one drafting job for the selected scene.",
    `Target rewrite length: ${options.targetSceneWordsMin}-${options.targetSceneWordsMax} words.`,
    "Hard requirements:",
    "- All fields must be written in German, including rewriteNotes, canon facts, state updates, continuity risks, and style notes.",
    "- rewriteText must land inside the target range and must not stop early.",
    "- Write for a commercially sharp German psychothriller audience: immediate unease, clean readability, scene pressure, social friction, concrete observation, and a strong closing hook.",
    "- No imitation or mention of real authors. Use market traits, not author mimicry.",
    "- Avoid generic TV-crime filler, soft exposition, decorative literary padding, and melodramatic over-explaining.",
    "- rewriteNotes must describe real visible revisions in the rewriteText, not invented process commentary.",
    "- extractedState must stay conservative: only explicit facts from packet or generated scene text become facts. Uncertainty belongs in continuityRisks.",
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
    "Write all output in German unless a field explicitly requires another language, which it does not here.",
    "Honor the canon, preserve tone consistency, and surface continuity risks explicitly.",
    "Write commercially readable genre prose, but keep it grounded in the supplied scene context.",
    "If canon is insufficient, do not invent silently; flag the gap in continuityRisks.",
    "Publishing and KDP rules shape readability, quality, and packaging; they must never appear as meta commentary inside the scene prose.",
    "Favor scene truth, subtext, momentum, and readability over exposition-heavy explanation.",
    "Target a premium German psychothriller rhythm: fast scene entry, controlled sentence pressure, sharp observation, psychologically loaded dialogue, and a destabilizing end beat.",
    "The prose should feel bestselling and immediate, not literary for its own sake and not generic procedural filler."
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

async function maybeRepairGeminiPayload(
  client: GoogleGenAI,
  modelName: string,
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  payload: DraftJobPayload
) {
  const issues = assessDraftPayloadQuality(payload, options);

  if (!issues.length) {
    return {
      payload
    };
  }

  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: buildRepairUserPrompt(packet, options, payload, issues),
      config: {
        systemInstruction: buildSystemPrompt(packet),
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(draftJobSchema)
      }
    });

    if (!response.text) {
      return {
        payload,
        warning: `Gemini repair returned no text. Issues remained: ${formatQualityIssues(issues)}`
      };
    }

    const repairedPayload = draftJobSchema.parse(JSON.parse(response.text));
    const originalPenalty = computeDraftQualityPenalty(payload, options);
    const repairedPenalty = computeDraftQualityPenalty(repairedPayload, options);
    const finalIssues = assessDraftPayloadQuality(
      repairedPenalty <= originalPenalty ? repairedPayload : payload,
      options
    );

    return {
      payload: repairedPenalty <= originalPenalty ? repairedPayload : payload,
      warning: finalIssues.length
        ? `Gemini output repaired but not fully clean: ${formatQualityIssues(finalIssues)}`
        : `Gemini output repaired: ${formatQualityIssues(issues)}`
    };
  } catch (error) {
    return {
      payload,
      warning: `Gemini repair failed. Issues remained: ${formatQualityIssues(issues)}${error instanceof Error ? ` | ${error.message}` : ""}`
    };
  }
}

async function runAnthropicContinuityAudit(
  client: Anthropic,
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
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
  options: DraftGenerationOptions,
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

function buildRepairUserPrompt(
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  payload: DraftJobPayload,
  issues: DraftQualityIssue[]
) {
  return [
    "Repair the existing draft-job output and return the full JSON again.",
    "Keep what is already strong. Only fix the violations.",
    `Target rewrite length remains ${options.targetSceneWordsMin}-${options.targetSceneWordsMax} words.`,
    `Act: ${packet.dynamicContext.actTitle}`,
    `Chapter: ${packet.dynamicContext.chapterTitle}`,
    `Scene: ${packet.dynamicContext.sceneTitle}`,
    "Violations to fix:",
    issues.map(function (issue) {
      return `- ${issue.detail}`;
    }).join("\n"),
    "Repair rules:",
    "- Keep every field in German.",
    "- Rewrite notes must describe concrete visible revisions in the rewriteText.",
    "- Strengthen commercial German psychothriller pull: tension through observation, dialogue friction, social unease, and a clean end hook.",
    "- Do not imitate real authors; use only the requested market characteristics.",
    "- Remove unsupported specifics from extractedState. If something is uncertain, move it to continuityRisks instead of canon facts.",
    "Current JSON:",
    JSON.stringify(payload, null, 2)
  ].join("\n");
}

function assessDraftPayloadQuality(payload: DraftJobPayload, options: DraftGenerationOptions) {
  const issues: DraftQualityIssue[] = [];
  const rewriteWords = countWords(payload.rewriteText);

  if (rewriteWords < options.targetSceneWordsMin) {
    issues.push({
      code: "rewrite_length",
      detail: `rewriteText is too short with ${rewriteWords} words; it must reach at least ${options.targetSceneWordsMin} words.`
    });
  } else if (rewriteWords > options.targetSceneWordsMax + 80) {
    issues.push({
      code: "rewrite_length",
      detail: `rewriteText is too long with ${rewriteWords} words; it should stay close to the upper bound ${options.targetSceneWordsMax}.`
    });
  }

  if (hasEnglishMetaLeak(payload)) {
    issues.push({
      code: "meta_language",
      detail: "Meta fields leak English. rewriteNotes and extractedState entries must be German."
    });
  }

  if (hasSpeculativeExtractorLeak(payload)) {
    issues.push({
      code: "extractor_discipline",
      detail: "extractedState sounds too speculative. Facts must stay explicit; uncertainty belongs in continuityRisks."
    });
  }

  return issues;
}

function computeDraftQualityPenalty(payload: DraftJobPayload, options: DraftGenerationOptions) {
  const rewriteWords = countWords(payload.rewriteText);
  let penalty = 0;

  if (rewriteWords < options.targetSceneWordsMin) {
    penalty += options.targetSceneWordsMin - rewriteWords;
  }

  if (rewriteWords > options.targetSceneWordsMax) {
    penalty += rewriteWords - options.targetSceneWordsMax;
  }

  if (hasEnglishMetaLeak(payload)) {
    penalty += 400;
  }

  if (hasSpeculativeExtractorLeak(payload)) {
    penalty += 180;
  }

  return penalty;
}

function hasEnglishMetaLeak(payload: DraftJobPayload) {
  return [
    ...payload.rewriteNotes,
    ...payload.extractedState.newCanonFacts,
    ...payload.extractedState.characterStateUpdates,
    ...payload.extractedState.openThreadsCreated,
    ...payload.extractedState.openThreadsResolved,
    ...payload.extractedState.foreshadowingAdded,
    ...payload.extractedState.continuityRisks,
    ...payload.extractedState.styleDriftNotes
  ].some(function (value) {
    return looksLikeEnglishMeta(value);
  });
}

function looksLikeEnglishMeta(value: string) {
  const englishHits =
    value.match(/\b(expanded|deepened|enhanced|introduced|extended|ensured|return|only|with|and|the|scene|draft|hook|village|notes?|cleaner|revised)\b/gi)?.length ?? 0;
  const germanHits =
    value.match(/\b(und|mit|der|die|das|nicht|Szene|Kapitel|Dorf|Hinweis|Spannung|Haken|Fokus|Regel|wird|soll|muss)\b/gi)?.length ?? 0;

  return englishHits >= 2 && englishHits > germanHits;
}

function hasSpeculativeExtractorLeak(payload: DraftJobPayload) {
  return payload.extractedState.newCanonFacts
    .concat(payload.extractedState.characterStateUpdates)
    .concat(payload.extractedState.foreshadowingAdded)
    .some(function (value) {
      return /\b(vielleicht|moeglicherweise|möglicherweise|koennte|könnte|scheint|wirkt|deutet darauf hin|wahrscheinlich)\b/i.test(
        value
      );
    });
}

function formatQualityIssues(issues: DraftQualityIssue[]) {
  return issues.map(function (issue) {
    return issue.code;
  }).join(", ");
}

function countWords(value: string) {
  const words = value.trim().match(/\S+/g);
  return words ? words.length : 0;
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

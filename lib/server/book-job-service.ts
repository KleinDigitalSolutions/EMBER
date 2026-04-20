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
import { normalizeBookDraftTargets, type BookDraftJob, type StoryDocument } from "@/lib/story-schema";
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

const ANTHROPIC_DRAFT_MIN_OUTPUT_TOKENS = 5000;
const ANTHROPIC_DRAFT_MAX_OUTPUT_TOKENS = 12000;
const ANTHROPIC_DRAFT_RETRY_STEP_TOKENS = 2000;
const ANTHROPIC_DRAFT_RETRY_LIMIT = 2;
const ANTHROPIC_CONTINUITY_MAX_TOKENS = 1200;

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
  const normalizedTargets = normalizeBookDraftTargets(
    params.targetSceneWordsMin ?? 1200,
    params.targetSceneWordsMax ?? 1600
  );
  const targetSceneWordsMin = normalizedTargets.targetSceneWordsMin;
  const targetSceneWordsMax = normalizedTargets.targetSceneWordsMax;
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
    const sanitizedResult = sanitizeDraftJobPayload(packet, result.payload);

    return {
      provider: remoteProvider,
      mode: "remote",
      warning: combineWarnings(result.warning, sanitizedResult.notes),
      job: hydrateDraftJob(params.sceneId, packet, sanitizedResult.payload, {
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
  const draftResult = await requestAnthropicDraftPayload(client, modelName, packet, options);
  const repairedDraftResult = await maybeRepairAnthropicPayload(
    client,
    modelName,
    packet,
    options,
    draftResult.payload
  );

  const continuityAudit = await runAnthropicContinuityAudit(client, packet, options, {
    payload: repairedDraftResult.payload
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
      ? mergeContinuityAudit(repairedDraftResult.payload, continuityAudit)
      : repairedDraftResult.payload,
    warning: combineWarnings(draftResult.warning, repairedDraftResult.warning)
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
    "- Return exactly one JSON object and nothing else. No markdown fences, no preface, no trailing commentary.",
    "- rewriteText must land inside the target range and must not stop early.",
    "- draftText is a compact first pass and should stay materially shorter than rewriteText, roughly 55-70% of the rewrite length.",
    "- Write for a commercially sharp German psychothriller audience: immediate unease, clean readability, scene pressure, social friction, concrete observation, and a strong closing hook.",
    "- No imitation or mention of real authors. Use market traits, not author mimicry.",
    "- Avoid generic TV-crime filler, soft exposition, decorative literary padding, and melodramatic over-explaining.",
    "- rewriteNotes must describe real visible revisions in the rewriteText, not invented process commentary.",
    "- Keep outline beats, rewriteNotes, and extractedState entries compact and concrete; one short sentence per item is enough.",
    "- extractedState must stay conservative: only explicit facts from packet or generated scene text become facts. Uncertainty belongs in continuityRisks.",
    `Act: ${packet.dynamicContext.actTitle}`,
    `Chapter: ${packet.dynamicContext.chapterTitle}`,
    `Scene: ${packet.dynamicContext.sceneTitle}`,
    `Scene summary: ${packet.dynamicContext.sceneSummary}`,
    `Scene excerpt: ${packet.dynamicContext.sceneExcerpt}`,
    `Scene card outline: ${packet.dynamicContext.sceneCardOutline.join(" || ") || "none"}`,
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
        return formatCharacterStatePrompt(entry);
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
    "- extractedState with canon facts, character updates, open threads, foreshadowing, continuity risks, and style drift notes",
    "Use exactly this JSON shape and key casing:",
    buildDraftJobJsonShapePrompt()
  ].join("\n");
}

async function requestAnthropicDraftPayload(
  client: Anthropic,
  modelName: string,
  packet: SceneContextPacket,
  options: DraftGenerationOptions
) {
  const systemPromptBlocks = buildAnthropicSystemPromptBlocks(packet);
  const baseMaxTokens = resolveAnthropicDraftMaxTokens(options);
  const attemptWarnings: string[] = [];
  let lastFailure = "Anthropic returned no structured draft output.";

  for (let attempt = 0; attempt < ANTHROPIC_DRAFT_RETRY_LIMIT; attempt += 1) {
    const maxTokens = Math.min(
      ANTHROPIC_DRAFT_MAX_OUTPUT_TOKENS,
      baseMaxTokens + attempt * ANTHROPIC_DRAFT_RETRY_STEP_TOKENS
    );
    const message = await client.messages.create({
      model: modelName,
      max_tokens: maxTokens,
      system: systemPromptBlocks,
      messages: [
        {
          role: "user",
          content: buildAnthropicDraftUserPrompt(packet, options, attempt > 0)
        }
      ]
    });
    const parsed = parseAnthropicDraftResponse(message);

    if (parsed.payload) {
      if (attempt > 0) {
        attemptWarnings.push(
          `Anthropic Draft wurde nach unvollstaendigem JSON mit hoeherem Output-Budget erfolgreich wiederholt (${maxTokens} max_tokens).`
        );
      }

      return {
        payload: parsed.payload,
        warning: combineWarnings(attemptWarnings, parsed.warning)
      };
    }

    lastFailure = `Anthropic draft parse failed (stop_reason=${message.stop_reason || "unknown"}, max_tokens=${maxTokens}). ${parsed.error}`;

    if (attempt < ANTHROPIC_DRAFT_RETRY_LIMIT - 1) {
      attemptWarnings.push(lastFailure);
      continue;
    }
  }

  throw new Error(lastFailure);
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

function buildAnthropicDraftUserPrompt(
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  isRetry: boolean
) {
  const basePrompt = buildDynamicUserPrompt(packet, options);

  if (!isRetry) {
    return basePrompt;
  }

  return [
    basePrompt,
    "Retry mode:",
    "- The previous response was incomplete or invalid JSON.",
    "- Start with { and end with }.",
    "- Use exactly these keys: outline, draftText, rewriteText, rewriteNotes, extractedState, newCanonFacts, characterStateUpdates, openThreadsCreated, openThreadsResolved, foreshadowingAdded, continuityRisks, styleDriftNotes.",
    "- Keep outline to 3-4 beats if needed.",
    "- Keep rewriteNotes and extractedState entries very short.",
    "- Spend the token budget on a complete rewriteText, not on verbose metadata."
  ].join("\n");
}

function buildDraftJobJsonShapePrompt() {
  return JSON.stringify(
    {
      outline: ["string"],
      draftText: "string",
      rewriteText: "string",
      rewriteNotes: ["string"],
      extractedState: {
        newCanonFacts: ["string"],
        characterStateUpdates: ["string"],
        openThreadsCreated: ["string"],
        openThreadsResolved: ["string"],
        foreshadowingAdded: ["string"],
        continuityRisks: ["string"],
        styleDriftNotes: ["string"]
      }
    },
    null,
    2
  );
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

async function maybeRepairAnthropicPayload(
  client: Anthropic,
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

  const systemPromptBlocks = buildAnthropicSystemPromptBlocks(packet);

  try {
    const message = await client.messages.create({
      model: modelName,
      max_tokens: Math.min(
        ANTHROPIC_DRAFT_MAX_OUTPUT_TOKENS,
        resolveAnthropicDraftMaxTokens(options) + 1200
      ),
      system: systemPromptBlocks,
      messages: [
        {
          role: "user",
          content: [
            buildRepairUserPrompt(packet, options, payload, issues),
            "Return exactly one JSON object with this shape:",
            buildDraftJobJsonShapePrompt()
          ].join("\n")
        }
      ]
    });
    const parsed = parseAnthropicDraftResponse(message);

    if (!parsed.payload) {
      return {
        payload,
        warning: `Anthropic repair failed. Issues remained: ${formatQualityIssues(issues)} | ${parsed.error}`
      };
    }

    const originalPenalty = computeDraftQualityPenalty(payload, options);
    const repairedPenalty = computeDraftQualityPenalty(parsed.payload, options);
    const finalPayload = repairedPenalty <= originalPenalty ? parsed.payload : payload;
    const finalIssues = assessDraftPayloadQuality(finalPayload, options);

    return {
      payload: finalPayload,
      warning: finalIssues.length
        ? `Anthropic output repaired but not fully clean: ${formatQualityIssues(finalIssues)}`
        : `Anthropic output repaired: ${formatQualityIssues(issues)}`
    };
  } catch (error) {
    return {
      payload,
      warning: `Anthropic repair failed. Issues remained: ${formatQualityIssues(issues)}${error instanceof Error ? ` | ${error.message}` : ""}`
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
      max_tokens: ANTHROPIC_CONTINUITY_MAX_TOKENS,
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

function resolveAnthropicDraftMaxTokens(options: DraftGenerationOptions) {
  const rewriteBudget = Math.round(options.targetSceneWordsMax * 3.2);
  const draftBudget = Math.round(options.targetSceneWordsMax * 2.1);
  const metadataBudget = 900;

  return clampNumber(
    rewriteBudget + draftBudget + metadataBudget,
    ANTHROPIC_DRAFT_MIN_OUTPUT_TOKENS,
    ANTHROPIC_DRAFT_MAX_OUTPUT_TOKENS
  );
}

function parseAnthropicDraftResponse(message: Anthropic.Message) {
  const rawText = collectAnthropicText(message).trim();

  if (!rawText) {
    return {
      payload: null,
      error: "Anthropic returned no text content."
    };
  }

  const candidates = [rawText, extractFirstJsonObject(rawText)].filter(function (
    value
  ): value is string {
    return Boolean(value && value.trim());
  });

  for (const candidate of candidates) {
    try {
      const parsedJson = normalizeDraftJobJsonCandidate(JSON.parse(candidate));
      const parsedPayload = draftJobSchema.safeParse(parsedJson);

      if (parsedPayload.success) {
        return {
          payload: parsedPayload.data,
          warning:
            candidate !== rawText
              ? "Anthropic JSON wurde aus einer umgebenden Textantwort extrahiert."
              : undefined
        };
      }

      return {
        payload: null,
        error: parsedPayload.error.issues
          .map(function (issue) {
            return `${issue.path.join(".") || "root"}: ${issue.message}`;
          })
          .join("; ")
      };
    } catch (error) {
      if (candidate === candidates[candidates.length - 1]) {
        return {
          payload: null,
          error: error instanceof Error ? error.message : "Invalid JSON."
        };
      }
    }
  }

  return {
    payload: null,
    error: "Anthropic returned no parseable JSON object."
  };
}

function normalizeDraftJobJsonCandidate(value: unknown) {
  if (!value || typeof value !== "object") {
    return value;
  }

  const candidate = value as {
    outline?: unknown;
    draftText?: unknown;
    rewriteText?: unknown;
    rewriteNotes?: unknown;
    extractedState?: Record<string, unknown>;
  };

  return {
    ...candidate,
    outline: Array.isArray(candidate.outline) ? candidate.outline.slice(0, 6) : candidate.outline,
    rewriteNotes: Array.isArray(candidate.rewriteNotes)
      ? candidate.rewriteNotes.slice(0, 6)
      : candidate.rewriteNotes,
    extractedState:
      candidate.extractedState && typeof candidate.extractedState === "object"
        ? {
            ...candidate.extractedState,
            newCanonFacts: Array.isArray(candidate.extractedState.newCanonFacts)
              ? candidate.extractedState.newCanonFacts.slice(0, 6)
              : candidate.extractedState.newCanonFacts,
            characterStateUpdates: Array.isArray(candidate.extractedState.characterStateUpdates)
              ? candidate.extractedState.characterStateUpdates.slice(0, 6)
              : candidate.extractedState.characterStateUpdates,
            openThreadsCreated: Array.isArray(candidate.extractedState.openThreadsCreated)
              ? candidate.extractedState.openThreadsCreated.slice(0, 6)
              : candidate.extractedState.openThreadsCreated,
            openThreadsResolved: Array.isArray(candidate.extractedState.openThreadsResolved)
              ? candidate.extractedState.openThreadsResolved.slice(0, 6)
              : candidate.extractedState.openThreadsResolved,
            foreshadowingAdded: Array.isArray(candidate.extractedState.foreshadowingAdded)
              ? candidate.extractedState.foreshadowingAdded.slice(0, 6)
              : candidate.extractedState.foreshadowingAdded,
            continuityRisks: Array.isArray(candidate.extractedState.continuityRisks)
              ? candidate.extractedState.continuityRisks.slice(0, 6)
              : candidate.extractedState.continuityRisks,
            styleDriftNotes: Array.isArray(candidate.extractedState.styleDriftNotes)
              ? candidate.extractedState.styleDriftNotes.slice(0, 6)
              : candidate.extractedState.styleDriftNotes
          }
        : candidate.extractedState
  };
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
    `Scene card outline: ${packet.dynamicContext.sceneCardOutline.join(" || ") || "none"}`,
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
        return formatCharacterStatePrompt(entry);
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

function formatCharacterStatePrompt(
  entry: SceneContextPacket["dynamicContext"]["relevantCharacterStates"][number]
) {
  const recentSnapshots = entry.snapshots.slice(-3).map(function (snapshot) {
    return `${snapshot.scope}:${snapshot.sourceLabel || snapshot.currentState} => ${snapshot.currentState}`;
  });

  return [
    `${entry.characterName}: ${entry.currentState}`,
    entry.innerShift ? `inner_shift=${entry.innerShift}` : "",
    entry.agenda ? `agenda=${entry.agenda}` : "",
    recentSnapshots.length ? `snapshot_trail=${recentSnapshots.join(" | ")}` : ""
  ]
    .filter(Boolean)
    .join(" || ");
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

function sanitizeDraftJobPayload(
  packet: SceneContextPacket,
  payload: DraftJobPayload
) {
  const evidenceTerms = buildPacketEvidenceTerms(packet);
  const knownEntities = buildKnownEntityTerms(packet);
  const reviewNotes: string[] = [];
  const movedRisks: string[] = [];
  const filteredCanonFacts = payload.extractedState.newCanonFacts.filter(function (value) {
    const keep = isConservativeExtractorEntry(value, evidenceTerms, knownEntities, {
      requireEntity: false,
      minimumOverlap: 2
    });

    if (!keep) {
      movedRisks.push(`Extractor-Review: Unsicherer Canon-Fact verworfen -> ${value}`);
    }

    return keep;
  });
  const filteredCharacterUpdates = payload.extractedState.characterStateUpdates.filter(function (value) {
    const keep = isConservativeExtractorEntry(value, evidenceTerms, knownEntities, {
      requireEntity: true,
      minimumOverlap: 2
    });

    if (!keep) {
      movedRisks.push(`Extractor-Review: Unsicheres Character-Update verworfen -> ${value}`);
    }

    return keep;
  });
  const filteredForeshadowing = payload.extractedState.foreshadowingAdded.filter(function (value) {
    const keep = isConservativeExtractorEntry(value, evidenceTerms, knownEntities, {
      requireEntity: false,
      minimumOverlap: 1
    });

    if (!keep) {
      movedRisks.push(`Extractor-Review: Unsicheres Foreshadowing verworfen -> ${value}`);
    }

    return keep;
  });
  const filteredOpenThreadsCreated = payload.extractedState.openThreadsCreated.filter(function (value) {
    return isConservativeExtractorEntry(value, evidenceTerms, knownEntities, {
      requireEntity: false,
      minimumOverlap: 1
    });
  });

  if (
    filteredCanonFacts.length !== payload.extractedState.newCanonFacts.length ||
    filteredCharacterUpdates.length !== payload.extractedState.characterStateUpdates.length ||
    filteredForeshadowing.length !== payload.extractedState.foreshadowingAdded.length ||
    filteredOpenThreadsCreated.length !== payload.extractedState.openThreadsCreated.length
  ) {
    reviewNotes.push("Extractor-State wurde gegen den Packet-Kontext konservativ bereinigt.");
  }

  return {
    payload: {
      ...payload,
      extractedState: {
        ...payload.extractedState,
        newCanonFacts: dedupeStrings(filteredCanonFacts).slice(0, 6),
        characterStateUpdates: dedupeStrings(filteredCharacterUpdates).slice(0, 6),
        openThreadsCreated: dedupeStrings(filteredOpenThreadsCreated).slice(0, 6),
        foreshadowingAdded: dedupeStrings(filteredForeshadowing).slice(0, 6),
        continuityRisks: dedupeStrings(
          payload.extractedState.continuityRisks.concat(movedRisks.slice(0, 3))
        ).slice(0, 6)
      }
    },
    notes: reviewNotes
  };
}

function buildPacketEvidenceTerms(packet: SceneContextPacket) {
  return new Set(
    extractEvidenceTerms(
      [
        packet.dynamicContext.sceneTitle,
        packet.dynamicContext.sceneSummary,
        packet.dynamicContext.sceneExcerpt
      ]
        .concat(packet.dynamicContext.sceneCardOutline)
        .concat(
          packet.dynamicContext.previousBeats.map(function (beat) {
            return `${beat.sceneTitle} ${beat.summary} ${beat.excerpt}`;
          })
        )
        .concat(
          packet.dynamicContext.relevantCodex.map(function (entry) {
            return `${entry.title} ${entry.summary}`;
          })
        )
        .concat(
          packet.dynamicContext.relevantCharacterStates.map(function (entry) {
            return `${entry.characterName} ${entry.currentState} ${entry.innerShift} ${entry.agenda}`;
          })
        )
        .concat(
          packet.dynamicContext.activeThreads.map(function (thread) {
            return `${thread.label} ${thread.detail}`;
          })
        )
        .concat([
          packet.dynamicContext.nextBeat?.sceneTitle || "",
          packet.stablePrefix.premise,
          packet.stablePrefix.readerPromise,
          packet.stablePrefix.thematicCore
        ])
    )
  );
}

function buildKnownEntityTerms(packet: SceneContextPacket) {
  return extractEvidenceTerms(
    packet.dynamicContext.relevantCodex
      .map(function (entry) {
        return entry.title;
      })
      .concat(
        packet.dynamicContext.relevantCharacterStates.map(function (entry) {
          return entry.characterName;
        })
      )
      .concat(
        packet.dynamicContext.activeThreads.map(function (thread) {
          return thread.label;
        })
      )
      .concat([packet.dynamicContext.sceneTitle])
  );
}

function extractEvidenceTerms(values: string[]) {
  return values
    .flatMap(function (value) {
      return value
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
        .split(/\s+/)
        .map(function (token) {
          return token.trim();
        });
    })
    .filter(function (token) {
      return token.length >= 4 && !GERMAN_STOPWORDS.has(token);
    });
}

function isConservativeExtractorEntry(
  value: string,
  evidenceTerms: Set<string>,
  knownEntities: string[],
  options: {
    requireEntity: boolean;
    minimumOverlap: number;
  }
) {
  const candidateTerms = extractEvidenceTerms([value]);
  const overlapCount = candidateTerms.filter(function (term) {
    return evidenceTerms.has(term);
  }).length;
  const entityHits = knownEntities.filter(function (entity) {
    return normalizeText(value).includes(normalizeText(entity));
  }).length;
  const unsupportedTerms = candidateTerms.filter(function (term) {
    return !evidenceTerms.has(term) && !knownEntities.includes(term);
  });

  if (options.requireEntity && entityHits === 0) {
    return false;
  }

  if (overlapCount < options.minimumOverlap) {
    return false;
  }

  if (looksLikeHardAssertion(value) && unsupportedTerms.length >= 3) {
    return false;
  }

  return true;
}

function looksLikeHardAssertion(value: string) {
  return /\b(ist|war|hat|wurde|uebernahm|übernahm|bat|bittet|hinterliess|hinterließ|betreibt|fuehrt|führt|gilt|wirkte|verheimlicht)\b/i.test(
    value
  );
}

function combineWarnings(...values: Array<string | string[] | undefined>) {
  return dedupeStrings(
    values
      .flatMap(function (value) {
        if (Array.isArray(value)) {
          return value;
        }

        return value ? [value] : [];
      })
      .filter(function (value) {
        return Boolean(value && value.trim());
      })
  ).join(" | ") || undefined;
}

function countWords(value: string) {
  const words = value.trim().match(/\S+/g);
  return words ? words.length : 0;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function collectAnthropicText(message: Anthropic.Message) {
  return message.content
    .map(function (block) {
      return block.type === "text" ? block.text : "";
    })
    .join("\n");
}

function extractFirstJsonObject(value: string) {
  let depth = 0;
  let startIndex = -1;
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (char === "\\") {
        isEscaped = true;
        continue;
      }

      if (char === "\"") {
        inString = false;
      }

      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      if (depth === 0) {
        startIndex = index;
      }

      depth += 1;
      continue;
    }

    if (char === "}") {
      if (depth === 0) {
        continue;
      }

      depth -= 1;

      if (depth === 0 && startIndex !== -1) {
        return value.slice(startIndex, index + 1);
      }
    }
  }

  return null;
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

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createLocalId(prefix: string) {
  return createUuid();
}

const GERMAN_STOPWORDS = new Set([
  "aber",
  "auch",
  "beim",
  "dabei",
  "daher",
  "damit",
  "dann",
  "dass",
  "deine",
  "deinen",
  "deiner",
  "dem",
  "den",
  "der",
  "des",
  "dessen",
  "dies",
  "diese",
  "diesem",
  "diesen",
  "dieser",
  "doch",
  "dort",
  "eine",
  "einem",
  "einen",
  "einer",
  "eines",
  "einfach",
  "einst",
  "er",
  "es",
  "etwas",
  "fuer",
  "für",
  "hatte",
  "hier",
  "hinter",
  "ihre",
  "ihren",
  "ihrer",
  "ihres",
  "immer",
  "ihm",
  "ihn",
  "ins",
  "ist",
  "kein",
  "keine",
  "keinen",
  "konnte",
  "mehr",
  "nicht",
  "noch",
  "oder",
  "ohne",
  "schon",
  "sein",
  "seine",
  "seinen",
  "seiner",
  "sich",
  "sie",
  "sind",
  "sofort",
  "statt",
  "ueber",
  "über",
  "und",
  "unter",
  "vom",
  "von",
  "vor",
  "weil",
  "weiter",
  "wenn",
  "wieder",
  "wird",
  "wurde",
  "zum",
  "zur",
  "zwar"
]);

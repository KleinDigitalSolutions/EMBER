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
  sanitizeGeminiModelId
} from "@/lib/book-job-models";
import {
  buildSceneContextPacket,
  createDraftJobFromPacket,
  createStageRun,
  type SceneContextPacket
} from "@/lib/book-engine";
import {
  normalizeBookDraftTargets,
  type BookDraftJob,
  type BookDraftStageId,
  type BookDraftStageRuns,
  type DraftExtractionState,
  type LiteraryFrictionReport,
  type StoryDocument,
  withDraftMemorySync
} from "@/lib/story-schema";
import { createUuid } from "@/lib/id";

const beatPlanSchema = z.object({
  beats: z.array(
    z.object({
      label: z.string().min(1).max(120),
      purpose: z.string().min(1).max(600),
      targetWords: z.number().int().min(50).max(1200),
      mustLand: z.string().min(1).max(320)
    })
  )
    .min(3)
    .max(6)
});

const stateExtractionSchema = z.object({
  rewriteNotes: z.array(z.string().min(1).max(100)).min(1).max(4),
  extractedState: z.object({
    newCanonFacts: z.array(z.string().min(1).max(100)).max(3),
    characterStateUpdates: z.array(z.string().min(1).max(100)).max(3),
    openThreadsCreated: z.array(z.string().min(1).max(100)).max(3),
    openThreadsResolved: z.array(z.string().min(1).max(100)).max(3),
    foreshadowingAdded: z.array(z.string().min(1).max(100)).max(3),
    continuityRisks: z.array(z.string().min(1).max(100)).max(3),
    styleDriftNotes: z.array(z.string().min(1).max(100)).max(3)
  })
});

const continuityAuditSchema = z.object({
  continuityRisks: z.array(z.string()).max(6),
  styleDriftNotes: z.array(z.string()).max(6)
});

const qualityEvalSchema = z.object({
  wordTargetMin: z.number().int().min(0),
  wordTargetMax: z.number().int().min(0),
  wordActual: z.number().int().min(0),
  hookScore: z.number().int().min(0).max(10),
  tensionScore: z.number().int().min(0).max(10),
  dialogueScore: z.number().int().min(0).max(10),
  specificityScore: z.number().int().min(0).max(10),
  germanCleanlinessScore: z.number().int().min(0).max(10),
  continuityScore: z.number().int().min(0).max(10),
  marketFitScore: z.number().int().min(0).max(10),
  povDisciplineScore: z.number().int().min(0).max(10),
  readabilityScore: z.number().int().min(0).max(10),
  issues: z.array(z.string()).max(8)
});

const literaryFrictionSchema = z.object({
  protect: z.array(z.string().min(1)).max(8),
  cutCandidates: z.array(z.string().min(1)).max(8),
  overExplanation: z.array(z.string().min(1)).max(8),
  patternWarnings: z.array(z.string().min(1)).max(8),
  abstractionFlags: z.array(z.string().min(1)).max(8),
  endingAssessment: z.string().min(1).max(400),
  microEdits: z.array(z.string().min(1)).max(8),
  needsRevision: z.boolean(),
  revisedText: z.string().nullable(),
  scores: z.object({
    imageStrength: z.number().int().min(1).max(5),
    bodyTruth: z.number().int().min(1).max(5),
    ambiguity: z.number().int().min(1).max(5),
    antiExplanation: z.number().int().min(1).max(5),
    sentenceVariety: z.number().int().min(1).max(5),
    endingStrength: z.number().int().min(1).max(5),
    antiSmoothness: z.number().int().min(1).max(5),
    voiceSpecificity: z.number().int().min(1).max(5)
  })
});

const ANTHROPIC_PROSE_MIN_TOKENS = 1800;
const ANTHROPIC_PROSE_MAX_TOKENS = 10000;
const OPENAI_PROSE_MIN_TOKENS = 1200;
const OPENAI_PROSE_MAX_TOKENS = 9000;
const GEMINI_PROSE_MIN_TOKENS = 1200;
const GEMINI_PROSE_MAX_TOKENS = 9000;
const GROQ_PROSE_MIN_TOKENS = 1200;
const GROQ_PROSE_MAX_TOKENS = 9000;
const STRUCTURED_STAGE_MAX_TOKENS = 1400;
const EXTRACT_STAGE_MAX_TOKENS = 900;
const LITERARY_FRICTION_MAX_TOKENS = 5200;
const EXTRACT_ARRAY_MAX_ITEMS = 3;
const EXTRACT_REWRITE_NOTES_MAX_ITEMS = 4;
const EXTRACT_STRING_MAX_LENGTH = 100;
const ANTHROPIC_CACHE_TTL = "1h" as const;
const ANTHROPIC_CACHE_BETAS = ["extended-cache-ttl-2025-04-11"] as const;
const FIXED_OPUS_MODEL = "claude-opus-4-7";
const ENABLE_AUTOMATIC_LITERARY_FRICTION = false;
const buildAnthropicCacheRequestOptions = () => ({
  headers: {
    "anthropic-beta": ANTHROPIC_CACHE_BETAS.join(",")
  }
});

type BeatPlanPayload = z.infer<typeof beatPlanSchema>;
type StateExtractionPayload = z.infer<typeof stateExtractionSchema>;
type ContinuityAuditPayload = z.infer<typeof continuityAuditSchema>;
type QualityEvalPayload = z.infer<typeof qualityEvalSchema>;
type LiteraryFrictionPayload = z.infer<typeof literaryFrictionSchema>;

type DraftGenerationOptions = {
  targetSceneWordsMin: number;
  targetSceneWordsMax: number;
  directorNote: string;
};

type StageCallMetrics = {
  modelName: string | null;
  attemptCount: number;
  repairCount: number;
  durationMs: number | null;
  inputTokens: number | null;
  outputTokens: number | null;
  stopReason: string | null;
};

type StructuredStageResult<T> = {
  payload: T;
  metrics: StageCallMetrics;
};

type TextStageResult = {
  text: string;
  metrics: StageCallMetrics;
};

type LengthControlAction = "accept" | "expand" | "compress";
type AnthropicStructuredStageName =
  | "beat_plan"
  | "extract"
  | "continuity"
  | "quality_eval"
  | "literary_friction";

type ScenePipelineAdapter = {
  provider: RemoteBookJobProvider;
  modelName: string;
  continuityModelName: string | null;
  extractModelName: string | null;
  stageProviders?: Partial<Record<BookDraftStageId, Exclude<BookJobProvider, "auto" | "local">>>;
  generateBeatPlan: () => Promise<StructuredStageResult<BeatPlanPayload>>;
  writeDraft: (beatPlan: BeatPlanPayload) => Promise<TextStageResult>;
  rewriteScene: (beatPlan: BeatPlanPayload, draftText: string) => Promise<TextStageResult>;
  expandScene: (beatPlan: BeatPlanPayload, rewriteText: string) => Promise<TextStageResult>;
  compressScene: (beatPlan: BeatPlanPayload, rewriteText: string) => Promise<TextStageResult>;
  extractSceneState: (
    beatPlan: BeatPlanPayload,
    rewriteText: string
  ) => Promise<StructuredStageResult<StateExtractionPayload>>;
  auditContinuity: (
    beatPlan: BeatPlanPayload,
    draftText: string,
    rewriteText: string,
    extractedState: DraftExtractionState
  ) => Promise<StructuredStageResult<ContinuityAuditPayload>>;
  evaluateQuality: (
    beatPlan: BeatPlanPayload,
    rewriteText: string,
    extractedState: DraftExtractionState
  ) => Promise<StructuredStageResult<QualityEvalPayload>>;
  runLiteraryFriction: (
    beatPlan: BeatPlanPayload,
    rewriteText: string,
    extractedState: DraftExtractionState,
    qualityEval: QualityEvalPayload
  ) => Promise<StructuredStageResult<LiteraryFrictionPayload>>;
};

type DraftProviderResult = {
  modelName: string;
  continuityModelName: string | null;
  beatPlan: BeatPlanPayload;
  draftText: string;
  rewriteText: string;
  rewriteNotes: string[];
  extractedState: DraftExtractionState;
  qualityEval: QualityEvalPayload;
  literaryFrictionText?: string;
  literaryFrictionNotes?: string[];
  literaryFrictionReport?: LiteraryFrictionReport;
  stages: BookDraftStageRuns;
  warning?: string;
};

export type BookJobProvider = "auto" | "openai" | "anthropic" | "gemini" | "groq" | "duo" | "local";
type RemoteBookJobProvider = Exclude<BookJobProvider, "auto" | "local">;
const DEFAULT_DUO_OPENAI_MODEL = "gpt-5.5";

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

  if (provider === "duo" && remoteProvider !== "duo") {
    return createLocalExecution(
      packet,
      targetSceneWordsMin,
      targetSceneWordsMax,
      "Duo benoetigt sowohl ANTHROPIC_API_KEY als auch OPENAI_API_KEY; lokaler Fallback verwendet."
    );
  }

  if (!remoteProvider) {
    return createLocalExecution(
      packet,
      targetSceneWordsMin,
      targetSceneWordsMax,
      "Kein ANTHROPIC_API_KEY gesetzt; lokaler Fallback verwendet."
    );
  }

  try {
    const providerOptions: DraftGenerationOptions = {
      targetSceneWordsMin,
      targetSceneWordsMax,
      directorNote
    };

    const result =
      remoteProvider === "duo"
        ? await generateWithDuo(packet, providerOptions)
        : await generateWithAnthropic(packet, providerOptions);

    return {
      provider: remoteProvider,
      mode: "remote",
      warning: result.warning,
      job: hydrateDraftJob(params.sceneId, packet, result, {
        provider: remoteProvider,
        mode: "remote",
        modelName: result.modelName
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
  if (provider === "duo" && process.env.ANTHROPIC_API_KEY && process.env.OPENAI_API_KEY) {
    return "duo" as const;
  }

  if (provider !== "duo" && process.env.ANTHROPIC_API_KEY) {
    return "anthropic" as const;
  }

  return null;
}

async function generateWithOpenAI(
  packet: SceneContextPacket,
  options: DraftGenerationOptions
): Promise<DraftProviderResult> {
  const modelName = resolveBookJobModelValue(
    undefined,
    process.env.OPENAI_BOOK_MODEL,
    DEFAULT_BOOK_JOB_MODELS.openai
  );
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  return runScenePipeline(packet, options, {
    provider: "openai",
    modelName,
    continuityModelName: modelName,
    extractModelName: modelName,
    generateBeatPlan: function () {
      return requestOpenAIStructured({
        client,
        modelName,
        schema: beatPlanSchema,
        schemaName: "ember_book_beat_plan",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildBeatPlanPrompt(packet, options)
      });
    },
    writeDraft: function (beatPlan) {
      return requestOpenAIText({
        client,
        modelName,
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildDraftProsePrompt(packet, options, beatPlan),
        maxOutputTokens: resolveOpenAIProseMaxTokens(resolveDraftWordTargets(options).max)
      });
    },
    rewriteScene: function (beatPlan, draftText) {
      return requestOpenAIText({
        client,
        modelName,
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildRewriteProsePrompt(packet, options, beatPlan, draftText),
        maxOutputTokens: resolveOpenAIProseMaxTokens(options.targetSceneWordsMax)
      });
    },
    expandScene: function (beatPlan, rewriteText) {
      return requestOpenAIText({
        client,
        modelName,
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildExpandPrompt(packet, options, beatPlan, rewriteText),
        maxOutputTokens: resolveOpenAIProseMaxTokens(options.targetSceneWordsMax)
      });
    },
    compressScene: function (beatPlan, rewriteText) {
      return requestOpenAIText({
        client,
        modelName,
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildCompressPrompt(packet, options, beatPlan, rewriteText),
        maxOutputTokens: resolveOpenAIProseMaxTokens(options.targetSceneWordsMax)
      });
    },
    extractSceneState: function (beatPlan, rewriteText) {
      return requestOpenAIStructured({
        client,
        modelName,
        schema: stateExtractionSchema,
        schemaName: "ember_book_state_extract",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildStateExtractionPrompt(packet, options, beatPlan, rewriteText)
      });
    },
    auditContinuity: function (beatPlan, draftText, rewriteText, extractedState) {
      return requestOpenAIStructured({
        client,
        modelName,
        schema: continuityAuditSchema,
        schemaName: "ember_book_continuity_audit",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildContinuityAuditPrompt(
          packet,
          options,
          beatPlan,
          draftText,
          rewriteText,
          extractedState
        )
      });
    },
    evaluateQuality: function (beatPlan, rewriteText, extractedState) {
      return requestOpenAIStructured({
        client,
        modelName,
        schema: qualityEvalSchema,
        schemaName: "ember_book_quality_eval",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildQualityEvalPrompt(packet, options, beatPlan, rewriteText, extractedState)
      });
    },
    runLiteraryFriction: function (beatPlan, rewriteText, extractedState, qualityEval) {
      return requestOpenAIStructured({
        client,
        modelName,
        schema: literaryFrictionSchema,
        schemaName: "ember_book_literary_friction",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildLiteraryFrictionPrompt(
          packet,
          options,
          beatPlan,
          rewriteText,
          extractedState,
          qualityEval
        )
      });
    }
  });
}

async function generateWithAnthropic(
  packet: SceneContextPacket,
  options: DraftGenerationOptions
): Promise<DraftProviderResult> {
  const modelName = FIXED_OPUS_MODEL;
  const continuityModelName = FIXED_OPUS_MODEL;
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  return runScenePipeline(packet, options, {
    provider: "anthropic",
    modelName,
    continuityModelName,
    extractModelName: continuityModelName,
    generateBeatPlan: function () {
      return requestAnthropicStructured({
        client,
        stageName: "beat_plan",
        modelName: continuityModelName,
        maxTokens: STRUCTURED_STAGE_MAX_TOKENS,
        schema: beatPlanSchema,
        systemBlocks: buildAnthropicSystemPromptBlocks(packet),
        userPrompt: buildBeatPlanPrompt(packet, options)
      });
    },
    writeDraft: function (beatPlan) {
      return requestAnthropicText({
        client,
        modelName,
        maxTokens: resolveAnthropicProseMaxTokens(resolveDraftWordTargets(options).max),
        systemBlocks: buildAnthropicSystemPromptBlocks(packet),
        userPrompt: buildAnthropicScenePrompt({
          mode: "draft",
          packet,
          options,
          beatPlan
        })
      });
    },
    rewriteScene: function (beatPlan, draftText) {
      return requestAnthropicText({
        client,
        modelName,
        maxTokens: resolveAnthropicProseMaxTokens(options.targetSceneWordsMax),
        systemBlocks: buildAnthropicSystemPromptBlocks(packet),
        userPrompt: buildAnthropicScenePrompt({
          mode: "rewrite",
          packet,
          options,
          beatPlan,
          draftText
        })
      });
    },
    expandScene: function (beatPlan, rewriteText) {
      return requestAnthropicText({
        client,
        modelName,
        maxTokens: resolveAnthropicProseMaxTokens(options.targetSceneWordsMax),
        systemBlocks: buildAnthropicSystemPromptBlocks(packet),
        userPrompt: buildAnthropicScenePrompt({
          mode: "expand",
          packet,
          options,
          beatPlan,
          rewriteText
        })
      });
    },
    compressScene: function (beatPlan, rewriteText) {
      return requestAnthropicText({
        client,
        modelName,
        maxTokens: resolveAnthropicProseMaxTokens(options.targetSceneWordsMax),
        systemBlocks: buildAnthropicSystemPromptBlocks(packet),
        userPrompt: buildAnthropicScenePrompt({
          mode: "compress",
          packet,
          options,
          beatPlan,
          rewriteText
        })
      });
    },
    extractSceneState: function (beatPlan, rewriteText) {
      return requestAnthropicStructured({
        client,
        stageName: "extract",
        modelName: continuityModelName,
        maxTokens: EXTRACT_STAGE_MAX_TOKENS,
        schema: stateExtractionSchema,
        systemBlocks: buildAnthropicSystemPromptBlocks(packet),
        userPrompt: buildStateExtractionPrompt(packet, options, beatPlan, rewriteText)
      });
    },
    auditContinuity: function (beatPlan, draftText, rewriteText, extractedState) {
      return requestAnthropicStructured({
        client,
        stageName: "continuity",
        modelName: continuityModelName,
        maxTokens: STRUCTURED_STAGE_MAX_TOKENS,
        schema: continuityAuditSchema,
        systemBlocks: buildAnthropicSystemPromptBlocks(packet),
        userPrompt: buildContinuityAuditPrompt(
          packet,
          options,
          beatPlan,
          draftText,
          rewriteText,
          extractedState
        )
      });
    },
    evaluateQuality: function (beatPlan, rewriteText, extractedState) {
      return requestAnthropicStructured({
        client,
        stageName: "quality_eval",
        modelName: continuityModelName,
        maxTokens: STRUCTURED_STAGE_MAX_TOKENS,
        schema: qualityEvalSchema,
        systemBlocks: buildAnthropicSystemPromptBlocks(packet),
        userPrompt: buildQualityEvalPrompt(packet, options, beatPlan, rewriteText, extractedState)
      });
    },
    runLiteraryFriction: function (beatPlan, rewriteText, extractedState, qualityEval) {
      return requestAnthropicStructured({
        client,
        stageName: "literary_friction",
        modelName: continuityModelName,
        maxTokens: LITERARY_FRICTION_MAX_TOKENS,
        schema: literaryFrictionSchema,
        systemBlocks: buildAnthropicSystemPromptBlocks(packet),
        userPrompt: buildLiteraryFrictionPrompt(
          packet,
          options,
          beatPlan,
          rewriteText,
          extractedState,
          qualityEval
        )
      });
    }
  });
}

async function generateWithDuo(
  packet: SceneContextPacket,
  options: DraftGenerationOptions
): Promise<DraftProviderResult> {
  const anthropicModelName = FIXED_OPUS_MODEL;
  const openaiModelName = DEFAULT_DUO_OPENAI_MODEL;
  const anthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
  const openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  return runScenePipeline(packet, options, {
    provider: "duo",
    modelName: `${anthropicModelName} -> ${openaiModelName}`,
    continuityModelName: openaiModelName,
    extractModelName: openaiModelName,
    stageProviders: {
      context: "openai",
      beat_plan: "openai",
      draft: "anthropic",
      rewrite: "openai",
      length_control: "openai",
      extract: "openai",
      continuity: "openai",
      quality_eval: "openai",
      literary_friction: "openai"
    },
    generateBeatPlan: function () {
      return requestOpenAIStructured({
        client: openAIClient,
        modelName: openaiModelName,
        schema: beatPlanSchema,
        schemaName: "ember_book_beat_plan",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildBeatPlanPrompt(packet, options)
      });
    },
    writeDraft: function (beatPlan) {
      return requestAnthropicText({
        client: anthropicClient,
        modelName: anthropicModelName,
        maxTokens: resolveAnthropicProseMaxTokens(resolveDraftWordTargets(options).max),
        systemBlocks: buildAnthropicSystemPromptBlocks(packet),
        userPrompt: buildAnthropicScenePrompt({
          mode: "draft",
          packet,
          options,
          beatPlan
        })
      });
    },
    rewriteScene: function (beatPlan, draftText) {
      return requestOpenAIText({
        client: openAIClient,
        modelName: openaiModelName,
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildRewriteProsePrompt(packet, options, beatPlan, draftText),
        maxOutputTokens: resolveOpenAIProseMaxTokens(options.targetSceneWordsMax)
      });
    },
    expandScene: function (beatPlan, rewriteText) {
      return requestOpenAIText({
        client: openAIClient,
        modelName: openaiModelName,
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildExpandPrompt(packet, options, beatPlan, rewriteText),
        maxOutputTokens: resolveOpenAIProseMaxTokens(options.targetSceneWordsMax)
      });
    },
    compressScene: function (beatPlan, rewriteText) {
      return requestOpenAIText({
        client: openAIClient,
        modelName: openaiModelName,
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildCompressPrompt(packet, options, beatPlan, rewriteText),
        maxOutputTokens: resolveOpenAIProseMaxTokens(options.targetSceneWordsMax)
      });
    },
    extractSceneState: function (beatPlan, rewriteText) {
      return requestOpenAIStructured({
        client: openAIClient,
        modelName: openaiModelName,
        schema: stateExtractionSchema,
        schemaName: "ember_book_state_extract",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildStateExtractionPrompt(packet, options, beatPlan, rewriteText)
      });
    },
    auditContinuity: function (beatPlan, draftText, rewriteText, extractedState) {
      return requestOpenAIStructured({
        client: openAIClient,
        modelName: openaiModelName,
        schema: continuityAuditSchema,
        schemaName: "ember_book_continuity_audit",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildContinuityAuditPrompt(
          packet,
          options,
          beatPlan,
          draftText,
          rewriteText,
          extractedState
        )
      });
    },
    evaluateQuality: function (beatPlan, rewriteText, extractedState) {
      return requestOpenAIStructured({
        client: openAIClient,
        modelName: openaiModelName,
        schema: qualityEvalSchema,
        schemaName: "ember_book_quality_eval",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildQualityEvalPrompt(packet, options, beatPlan, rewriteText, extractedState)
      });
    },
    runLiteraryFriction: function (beatPlan, rewriteText, extractedState, qualityEval) {
      return requestOpenAIStructured({
        client: openAIClient,
        modelName: openaiModelName,
        schema: literaryFrictionSchema,
        schemaName: "ember_book_literary_friction",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildLiteraryFrictionPrompt(
          packet,
          options,
          beatPlan,
          rewriteText,
          extractedState,
          qualityEval
        )
      });
    }
  });
}

async function generateWithGemini(
  packet: SceneContextPacket,
  options: DraftGenerationOptions
): Promise<DraftProviderResult> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error("Missing Gemini API key.");
  }

  const modelName = sanitizeGeminiModelId(
    resolveBookJobModelValue(
      undefined,
      process.env.GEMINI_BOOK_MODEL || process.env.GOOGLE_GEMINI_BOOK_MODEL,
      DEFAULT_BOOK_JOB_MODELS.gemini
    )
  );
  const client = new GoogleGenAI({
    apiKey
  });

  return runScenePipeline(packet, options, {
    provider: "gemini",
    modelName,
    continuityModelName: modelName,
    extractModelName: modelName,
    generateBeatPlan: function () {
      return requestGeminiStructured({
        client,
        modelName,
        schema: beatPlanSchema,
        systemInstruction: buildSystemPrompt(packet),
        userPrompt: buildBeatPlanPrompt(packet, options)
      });
    },
    writeDraft: function (beatPlan) {
      return requestGeminiText({
        client,
        modelName,
        systemInstruction: buildSystemPrompt(packet),
        userPrompt: buildDraftProsePrompt(packet, options, beatPlan),
        maxOutputTokens: resolveGeminiProseMaxTokens(resolveDraftWordTargets(options).max)
      });
    },
    rewriteScene: function (beatPlan, draftText) {
      return requestGeminiText({
        client,
        modelName,
        systemInstruction: buildSystemPrompt(packet),
        userPrompt: buildRewriteProsePrompt(packet, options, beatPlan, draftText),
        maxOutputTokens: resolveGeminiProseMaxTokens(options.targetSceneWordsMax)
      });
    },
    expandScene: function (beatPlan, rewriteText) {
      return requestGeminiText({
        client,
        modelName,
        systemInstruction: buildSystemPrompt(packet),
        userPrompt: buildExpandPrompt(packet, options, beatPlan, rewriteText),
        maxOutputTokens: resolveGeminiProseMaxTokens(options.targetSceneWordsMax)
      });
    },
    compressScene: function (beatPlan, rewriteText) {
      return requestGeminiText({
        client,
        modelName,
        systemInstruction: buildSystemPrompt(packet),
        userPrompt: buildCompressPrompt(packet, options, beatPlan, rewriteText),
        maxOutputTokens: resolveGeminiProseMaxTokens(options.targetSceneWordsMax)
      });
    },
    extractSceneState: function (beatPlan, rewriteText) {
      return requestGeminiStructured({
        client,
        modelName,
        schema: stateExtractionSchema,
        systemInstruction: buildSystemPrompt(packet),
        userPrompt: buildStateExtractionPrompt(packet, options, beatPlan, rewriteText)
      });
    },
    auditContinuity: function (beatPlan, draftText, rewriteText, extractedState) {
      return requestGeminiStructured({
        client,
        modelName,
        schema: continuityAuditSchema,
        systemInstruction: buildSystemPrompt(packet),
        userPrompt: buildContinuityAuditPrompt(
          packet,
          options,
          beatPlan,
          draftText,
          rewriteText,
          extractedState
        )
      });
    },
    evaluateQuality: function (beatPlan, rewriteText, extractedState) {
      return requestGeminiStructured({
        client,
        modelName,
        schema: qualityEvalSchema,
        systemInstruction: buildSystemPrompt(packet),
        userPrompt: buildQualityEvalPrompt(packet, options, beatPlan, rewriteText, extractedState)
      });
    },
    runLiteraryFriction: function (beatPlan, rewriteText, extractedState, qualityEval) {
      return requestGeminiStructured({
        client,
        modelName,
        schema: literaryFrictionSchema,
        systemInstruction: buildSystemPrompt(packet),
        userPrompt: buildLiteraryFrictionPrompt(
          packet,
          options,
          beatPlan,
          rewriteText,
          extractedState,
          qualityEval
        )
      });
    }
  });
}

async function generateWithGroq(
  packet: SceneContextPacket,
  options: DraftGenerationOptions
): Promise<DraftProviderResult> {
  const apiKey = getGroqApiKey();

  if (!apiKey) {
    throw new Error("Missing Groq API key.");
  }

  const modelName = resolveBookJobModelValue(
    undefined,
    process.env.GROQ_BOOK_MODEL,
    DEFAULT_BOOK_JOB_MODELS.groq
  );
  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1"
  });

  return runScenePipeline(packet, options, {
    provider: "groq",
    modelName,
    continuityModelName: modelName,
    extractModelName: modelName,
    generateBeatPlan: function () {
      return requestGroqStructured({
        client,
        modelName,
        schema: beatPlanSchema,
        schemaName: "ember_book_beat_plan",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildBeatPlanPrompt(packet, options),
        maxOutputTokens: STRUCTURED_STAGE_MAX_TOKENS
      });
    },
    writeDraft: function (beatPlan) {
      return requestGroqText({
        client,
        modelName,
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildDraftProsePrompt(packet, options, beatPlan),
        maxOutputTokens: resolveGroqProseMaxTokens(resolveDraftWordTargets(options).max)
      });
    },
    rewriteScene: function (beatPlan, draftText) {
      return requestGroqText({
        client,
        modelName,
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildRewriteProsePrompt(packet, options, beatPlan, draftText),
        maxOutputTokens: resolveGroqProseMaxTokens(options.targetSceneWordsMax)
      });
    },
    expandScene: function (beatPlan, rewriteText) {
      return requestGroqText({
        client,
        modelName,
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildExpandPrompt(packet, options, beatPlan, rewriteText),
        maxOutputTokens: resolveGroqProseMaxTokens(options.targetSceneWordsMax)
      });
    },
    compressScene: function (beatPlan, rewriteText) {
      return requestGroqText({
        client,
        modelName,
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildCompressPrompt(packet, options, beatPlan, rewriteText),
        maxOutputTokens: resolveGroqProseMaxTokens(options.targetSceneWordsMax)
      });
    },
    extractSceneState: function (beatPlan, rewriteText) {
      return requestGroqStructured({
        client,
        modelName,
        schema: stateExtractionSchema,
        schemaName: "ember_book_state_extract",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildStateExtractionPrompt(packet, options, beatPlan, rewriteText),
        maxOutputTokens: EXTRACT_STAGE_MAX_TOKENS
      });
    },
    auditContinuity: function (beatPlan, draftText, rewriteText, extractedState) {
      return requestGroqStructured({
        client,
        modelName,
        schema: continuityAuditSchema,
        schemaName: "ember_book_continuity_audit",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildContinuityAuditPrompt(
          packet,
          options,
          beatPlan,
          draftText,
          rewriteText,
          extractedState
        ),
        maxOutputTokens: STRUCTURED_STAGE_MAX_TOKENS
      });
    },
    evaluateQuality: function (beatPlan, rewriteText, extractedState) {
      return requestGroqStructured({
        client,
        modelName,
        schema: qualityEvalSchema,
        schemaName: "ember_book_quality_eval",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildQualityEvalPrompt(packet, options, beatPlan, rewriteText, extractedState),
        maxOutputTokens: STRUCTURED_STAGE_MAX_TOKENS
      });
    },
    runLiteraryFriction: function (beatPlan, rewriteText, extractedState, qualityEval) {
      return requestGroqStructured({
        client,
        modelName,
        schema: literaryFrictionSchema,
        schemaName: "ember_book_literary_friction",
        systemPrompt: buildSystemPrompt(packet),
        userPrompt: buildLiteraryFrictionPrompt(
          packet,
          options,
          beatPlan,
          rewriteText,
          extractedState,
          qualityEval
        ),
        maxOutputTokens: LITERARY_FRICTION_MAX_TOKENS
      });
    }
  });
}

function getStageProvider(
  adapter: ScenePipelineAdapter,
  stageId: BookDraftStageId
): Exclude<BookJobProvider, "auto" | "local"> {
  return adapter.stageProviders?.[stageId] ?? adapter.provider;
}

async function runScenePipeline(
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  adapter: ScenePipelineAdapter
): Promise<DraftProviderResult> {
  const warnings: string[] = [];
  const draftTargets = resolveDraftWordTargets(options);
  let beatPlan = buildFallbackBeatPlan(packet, options);
  let outlineNotes = buildOutlineFromBeatPlan(beatPlan);
  let beatPlanStage = createStageRun({
    status: "skipped",
    provider: getStageProvider(adapter, "beat_plan"),
    modelName: adapter.modelName,
    updatedAt: new Date().toISOString(),
    attemptCount: 0,
    notes: ["Beat-Plan wurde noch nicht erzeugt."]
  });

  try {
    const beatPlanResult = await adapter.generateBeatPlan();
    beatPlan = sanitizeBeatPlan(packet, options, beatPlanResult.payload);
    outlineNotes = buildOutlineFromBeatPlan(beatPlan);
    beatPlanStage = createStageRun({
      provider: getStageProvider(adapter, "beat_plan"),
      modelName: beatPlanResult.metrics.modelName,
      updatedAt: new Date().toISOString(),
      attemptCount: beatPlanResult.metrics.attemptCount,
      repairCount: beatPlanResult.metrics.repairCount,
      durationMs: beatPlanResult.metrics.durationMs,
      inputTokens: beatPlanResult.metrics.inputTokens,
      outputTokens: beatPlanResult.metrics.outputTokens,
      stopReason: beatPlanResult.metrics.stopReason,
      notes: outlineNotes
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    const fallbackNote = `Beat-Plan fehlgeschlagen; fallback aus Scene Card verwendet. ${message}`;
    warnings.push(fallbackNote);
    beatPlanStage = createStageRun({
      status: "failed",
      provider: getStageProvider(adapter, "beat_plan"),
      modelName: adapter.modelName,
      updatedAt: new Date().toISOString(),
      notes: [fallbackNote].concat(outlineNotes.slice(0, 3))
    });
  }

  const draftResult = await adapter.writeDraft(beatPlan);
  const draftText = sanitizeSceneText(draftResult.text);

  if (!draftText) {
    throw new Error("Draft stage returned no prose.");
  }

  const rewriteResult = await adapter.rewriteScene(beatPlan, draftText);
  const rewrittenText = sanitizeSceneText(rewriteResult.text);

  if (!rewrittenText) {
    throw new Error("Rewrite stage returned no prose.");
  }

  const lengthControl = await maybeRunLengthControl(packet, options, adapter, beatPlan, rewrittenText);

  if (lengthControl.warning) {
    warnings.push(lengthControl.warning);
  }
  let rewriteNotes: string[] = [];
  let extractedState: DraftExtractionState = withDraftMemorySync(
    buildFallbackStateExtraction(
      packet,
      lengthControl.text,
      beatPlan
    ).extractedState,
    {
      fallbackCreatedAt: new Date().toISOString(),
      defaultStatus: "pending"
    }
  );
  let extractStage = createStageRun({
    status: "skipped",
    provider: getStageProvider(adapter, "extract"),
    modelName: adapter.modelName,
    updatedAt: new Date().toISOString(),
    attemptCount: 0,
    notes: ["State-Extraktion wurde nicht ausgefuehrt."]
  });

  try {
    const extractionResult = await adapter.extractSceneState(beatPlan, lengthControl.text);
    const normalizedExtraction = normalizeStateExtractionPayload(extractionResult.payload);
    const sanitizedExtraction = sanitizeSceneStateExtraction(packet, normalizedExtraction);
    extractedState = withDraftMemorySync(sanitizedExtraction.payload.extractedState, {
      fallbackCreatedAt: new Date().toISOString(),
      defaultStatus: "pending"
    });
    rewriteNotes = normalizeRewriteNotes(
      sanitizedExtraction.payload.rewriteNotes,
      lengthControl.text,
      beatPlan
    );

    if (sanitizedExtraction.notes.length) {
      warnings.push(sanitizedExtraction.notes.join(" | "));
    }

    extractStage = createStageRun({
      provider: getStageProvider(adapter, "extract"),
      modelName: extractionResult.metrics.modelName,
      updatedAt: new Date().toISOString(),
      attemptCount: extractionResult.metrics.attemptCount,
      repairCount: extractionResult.metrics.repairCount,
      durationMs: extractionResult.metrics.durationMs,
      inputTokens: extractionResult.metrics.inputTokens,
      outputTokens: extractionResult.metrics.outputTokens,
      stopReason: extractionResult.metrics.stopReason,
      notes: buildExtractionNotes(rewriteNotes, sanitizedExtraction.notes)
    });
  } catch (error) {
    const fallbackExtraction = buildFallbackStateExtraction(packet, lengthControl.text, beatPlan);
    const message = error instanceof Error ? error.message : "unknown error";
    const fallbackNote = `State-Extraktion fehlgeschlagen; konservativer Fallback verwendet. ${message}`;
    rewriteNotes = normalizeRewriteNotes(fallbackExtraction.rewriteNotes, lengthControl.text, beatPlan);
    extractedState = withDraftMemorySync(fallbackExtraction.extractedState, {
      fallbackCreatedAt: new Date().toISOString(),
      defaultStatus: "pending"
    });
    warnings.push(fallbackNote);
    extractStage = createStageRun({
      status: "failed",
      provider: getStageProvider(adapter, "extract"),
      modelName: adapter.extractModelName || adapter.modelName,
      updatedAt: new Date().toISOString(),
      notes: [fallbackNote].concat(buildExtractionNotes(rewriteNotes, []))
    });
  }

  let continuityStage = createStageRun({
    status: "skipped",
    provider: getStageProvider(adapter, "continuity"),
    modelName: adapter.continuityModelName ?? adapter.modelName,
    updatedAt: new Date().toISOString(),
    attemptCount: 0,
    notes: ["Continuity-Audit wurde nicht ausgefuehrt."]
  });

  try {
    const continuityResult = await adapter.auditContinuity(
      beatPlan,
      draftText,
      lengthControl.text,
      extractedState
    );
    extractedState = mergeContinuityAudit(extractedState, continuityResult.payload);
    continuityStage = createStageRun({
      provider: getStageProvider(adapter, "continuity"),
      modelName: adapter.continuityModelName ?? continuityResult.metrics.modelName,
      updatedAt: new Date().toISOString(),
      attemptCount: continuityResult.metrics.attemptCount,
      repairCount: continuityResult.metrics.repairCount,
      durationMs: continuityResult.metrics.durationMs,
      inputTokens: continuityResult.metrics.inputTokens,
      outputTokens: continuityResult.metrics.outputTokens,
      stopReason: continuityResult.metrics.stopReason,
      notes:
        extractedState.continuityRisks.concat(extractedState.styleDriftNotes).length > 0
          ? extractedState.continuityRisks.concat(extractedState.styleDriftNotes)
          : ["Keine offenen Continuity-Hinweise."]
    });
  } catch (error) {
    continuityStage = createStageRun({
      status: "failed",
      provider: getStageProvider(adapter, "continuity"),
      modelName: adapter.continuityModelName ?? adapter.modelName,
      updatedAt: new Date().toISOString(),
      notes: [
        `Continuity-Audit fehlgeschlagen: ${error instanceof Error ? error.message : "unknown error"}`
      ]
    });
    warnings.push(continuityStage.notes[0]);
  }

  let qualityEval = createFallbackQualityEval(options, countWords(lengthControl.text));
  let qualityStage = createStageRun({
    status: "skipped",
    provider: getStageProvider(adapter, "quality_eval"),
    modelName: adapter.modelName,
    updatedAt: new Date().toISOString(),
    attemptCount: 0,
    targetWordsMin: options.targetSceneWordsMin,
    targetWordsMax: options.targetSceneWordsMax,
    actualWords: qualityEval.wordActual,
    notes: ["Quality-Eval wurde nicht ausgefuehrt."]
  });

  try {
    const qualityResult = await adapter.evaluateQuality(beatPlan, lengthControl.text, extractedState);
    qualityEval = sanitizeQualityEval(qualityResult.payload, options, countWords(lengthControl.text));
    const qualityScore = computeQualityScore(qualityEval);
    qualityStage = createStageRun({
      provider: getStageProvider(adapter, "quality_eval"),
      modelName: qualityResult.metrics.modelName,
      updatedAt: new Date().toISOString(),
      attemptCount: qualityResult.metrics.attemptCount,
      repairCount: qualityResult.metrics.repairCount,
      durationMs: qualityResult.metrics.durationMs,
      inputTokens: qualityResult.metrics.inputTokens,
      outputTokens: qualityResult.metrics.outputTokens,
      stopReason: qualityResult.metrics.stopReason,
      targetWordsMin: qualityEval.wordTargetMin,
      targetWordsMax: qualityEval.wordTargetMax,
      actualWords: qualityEval.wordActual,
      qualityScore,
      qualityIssues: qualityEval.issues,
      notes: buildQualityEvalNotes(qualityEval, qualityScore)
    });
  } catch (error) {
    qualityStage = createStageRun({
      status: "failed",
      provider: getStageProvider(adapter, "quality_eval"),
      modelName: adapter.modelName,
      updatedAt: new Date().toISOString(),
      targetWordsMin: options.targetSceneWordsMin,
      targetWordsMax: options.targetSceneWordsMax,
      actualWords: countWords(lengthControl.text),
      notes: [
        `Quality-Eval fehlgeschlagen: ${error instanceof Error ? error.message : "unknown error"}`
      ]
    });
    warnings.push(qualityStage.notes[0]);
  }

  let literaryFrictionReport: LiteraryFrictionReport | undefined;
  let literaryFrictionText: string | undefined;
  let literaryFrictionNotes: string[] = [];
  let literaryFrictionStage = createStageRun({
    status: "skipped",
    provider: getStageProvider(adapter, "literary_friction"),
    modelName: adapter.continuityModelName ?? adapter.modelName,
    updatedAt: new Date().toISOString(),
    attemptCount: 0,
    targetWordsMin: options.targetSceneWordsMin,
    targetWordsMax: options.targetSceneWordsMax,
    actualWords: countWords(lengthControl.text),
    notes: ["Literary-Friction-Pass wurde nicht ausgeführt."]
  });

  if (!ENABLE_AUTOMATIC_LITERARY_FRICTION) {
    literaryFrictionStage = createStageRun({
      status: "skipped",
      provider: getStageProvider(adapter, "literary_friction"),
      modelName: adapter.continuityModelName ?? adapter.modelName,
      updatedAt: new Date().toISOString(),
      attemptCount: 0,
      targetWordsMin: options.targetSceneWordsMin,
      targetWordsMax: options.targetSceneWordsMax,
      actualWords: countWords(lengthControl.text),
      notes: ["Literary-Friction ist im driftarmen 23er Schreibmodus deaktiviert."]
    });
  } else {
    try {
      const frictionResult = await adapter.runLiteraryFriction(
        beatPlan,
        lengthControl.text,
        extractedState,
        qualityEval
      );
      literaryFrictionReport = sanitizeLiteraryFriction(
        frictionResult.payload,
        lengthControl.text
      );
      literaryFrictionText =
        literaryFrictionReport.needsRevision && literaryFrictionReport.revisedText
          ? sanitizeSceneText(literaryFrictionReport.revisedText)
          : undefined;
      literaryFrictionNotes = buildLiteraryFrictionNotes(literaryFrictionReport);
      const frictionWarnings = buildLiteraryFrictionWarnings(literaryFrictionReport);

      if (frictionWarnings.length) {
        warnings.push(frictionWarnings.join(" | "));
      }

      literaryFrictionStage = createStageRun({
        provider: getStageProvider(adapter, "literary_friction"),
        modelName: frictionResult.metrics.modelName,
        updatedAt: new Date().toISOString(),
        attemptCount: frictionResult.metrics.attemptCount,
        repairCount: frictionResult.metrics.repairCount,
        durationMs: frictionResult.metrics.durationMs,
        inputTokens: frictionResult.metrics.inputTokens,
        outputTokens: frictionResult.metrics.outputTokens,
        stopReason: frictionResult.metrics.stopReason,
        targetWordsMin: options.targetSceneWordsMin,
        targetWordsMax: options.targetSceneWordsMax,
        actualWords: countWords(literaryFrictionText || lengthControl.text),
        qualityScore: computeLiteraryFrictionScore(literaryFrictionReport),
        qualityIssues: frictionWarnings,
        notes: literaryFrictionNotes
      });
    } catch (error) {
      literaryFrictionStage = createStageRun({
        status: "failed",
        provider: getStageProvider(adapter, "literary_friction"),
        modelName: adapter.continuityModelName ?? adapter.modelName,
        updatedAt: new Date().toISOString(),
        targetWordsMin: options.targetSceneWordsMin,
        targetWordsMax: options.targetSceneWordsMax,
        actualWords: countWords(lengthControl.text),
        notes: [
          `Literary-Friction fehlgeschlagen: ${error instanceof Error ? error.message : "unknown error"}`
        ]
      });
      warnings.push(literaryFrictionStage.notes[0]);
    }
  }

  return {
    modelName: adapter.modelName,
    continuityModelName: adapter.continuityModelName,
    beatPlan,
    draftText,
    rewriteText: lengthControl.text,
    rewriteNotes,
    literaryFrictionText,
    literaryFrictionNotes,
    literaryFrictionReport,
    extractedState,
    qualityEval,
    stages: {
      context: createStageRun({
        provider: getStageProvider(adapter, "context"),
        modelName: adapter.modelName,
        updatedAt: new Date().toISOString(),
        notes: ["Context-Pack vorbereitet."]
      }),
      beat_plan: beatPlanStage,
      draft: createStageRun({
        provider: getStageProvider(adapter, "draft"),
        modelName: draftResult.metrics.modelName,
        updatedAt: new Date().toISOString(),
        attemptCount: draftResult.metrics.attemptCount,
        repairCount: draftResult.metrics.repairCount,
        durationMs: draftResult.metrics.durationMs,
        inputTokens: draftResult.metrics.inputTokens,
        outputTokens: draftResult.metrics.outputTokens,
        stopReason: draftResult.metrics.stopReason,
        targetWordsMin: draftTargets.min,
        targetWordsMax: draftTargets.max,
        actualWords: countWords(draftText),
        notes: [`Erster Prosa-Pass mit ${countWords(draftText)} Wörtern erstellt.`]
      }),
      rewrite: createStageRun({
        provider: getStageProvider(adapter, "rewrite"),
        modelName: rewriteResult.metrics.modelName,
        updatedAt: new Date().toISOString(),
        attemptCount: rewriteResult.metrics.attemptCount,
        repairCount: rewriteResult.metrics.repairCount,
        durationMs: rewriteResult.metrics.durationMs,
        inputTokens: rewriteResult.metrics.inputTokens,
        outputTokens: rewriteResult.metrics.outputTokens,
        stopReason: rewriteResult.metrics.stopReason,
        targetWordsMin: options.targetSceneWordsMin,
        targetWordsMax: options.targetSceneWordsMax,
        actualWords: countWords(rewrittenText),
        notes: [`Rewrite-Pass mit ${countWords(rewrittenText)} Wörtern erzeugt.`]
      }),
      length_control: lengthControl.stage,
      extract: extractStage,
      continuity: continuityStage,
      quality_eval: qualityStage,
      literary_friction: literaryFrictionStage
    },
    warning: combineWarnings(warnings)
  };
}

async function maybeRunLengthControl(
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  adapter: ScenePipelineAdapter,
  beatPlan: BeatPlanPayload,
  rewriteText: string
) {
  const actualWords = countWords(rewriteText);
  const action = resolveLengthControlAction(actualWords, options);

  if (action === "accept") {
    return {
      text: rewriteText,
      warning: undefined,
      stage: createStageRun({
        status: "skipped",
        provider: getStageProvider(adapter, "length_control"),
        modelName: adapter.modelName,
        updatedAt: new Date().toISOString(),
        attemptCount: 0,
        targetWordsMin: options.targetSceneWordsMin,
        targetWordsMax: options.targetSceneWordsMax,
        actualWords,
        notes: [`Length-Control akzeptiert ${actualWords} Wörter ohne Korrektur.`]
      })
    };
  }

  try {
    const result =
      action === "expand"
        ? await adapter.expandScene(beatPlan, rewriteText)
        : await adapter.compressScene(beatPlan, rewriteText);
    const candidateText = sanitizeSceneText(result.text);
    const finalText = selectBetterLengthCandidate(rewriteText, candidateText, options);
    const finalWords = countWords(finalText);
    const notes =
      action === "expand"
        ? [`Expand-Pass abgeschlossen. Wortstand: ${finalWords}.`]
        : [`Compress-Pass abgeschlossen. Wortstand: ${finalWords}.`];
    const warning =
      finalText === rewriteText
        ? `Length-Control ${action} lieferte keine bessere Fassung und wurde verworfen.`
        : undefined;

    return {
      text: finalText,
      warning,
      stage: createStageRun({
        provider: getStageProvider(adapter, "length_control"),
        modelName: result.metrics.modelName,
        updatedAt: new Date().toISOString(),
        attemptCount: result.metrics.attemptCount,
        repairCount: result.metrics.repairCount,
        durationMs: result.metrics.durationMs,
        inputTokens: result.metrics.inputTokens,
        outputTokens: result.metrics.outputTokens,
        stopReason: result.metrics.stopReason,
        targetWordsMin: options.targetSceneWordsMin,
        targetWordsMax: options.targetSceneWordsMax,
        actualWords: finalWords,
        notes
      })
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";

    return {
      text: rewriteText,
      warning: `Length-Control ${action} fehlgeschlagen: ${message}`,
      stage: createStageRun({
        status: "failed",
        provider: getStageProvider(adapter, "length_control"),
        modelName: adapter.modelName,
        updatedAt: new Date().toISOString(),
        targetWordsMin: options.targetSceneWordsMin,
        targetWordsMax: options.targetSceneWordsMax,
        actualWords,
        notes: [`Length-Control ${action} fehlgeschlagen: ${message}`]
      })
    };
  }
}

function resolveLengthControlAction(actualWords: number, options: DraftGenerationOptions): LengthControlAction {
  if (actualWords < Math.floor(options.targetSceneWordsMin * 0.92)) {
    return "expand";
  }

  if (actualWords > Math.ceil(options.targetSceneWordsMax * 1.05)) {
    return "compress";
  }

  return "accept";
}

function selectBetterLengthCandidate(
  originalText: string,
  candidateText: string,
  options: DraftGenerationOptions
) {
  if (!candidateText.trim()) {
    return originalText;
  }

  const originalPenalty = computeRangePenalty(countWords(originalText), options);
  const candidatePenalty = computeRangePenalty(countWords(candidateText), options);

  return candidatePenalty <= originalPenalty ? candidateText : originalText;
}

function computeRangePenalty(actualWords: number, options: DraftGenerationOptions) {
  if (actualWords < options.targetSceneWordsMin) {
    return options.targetSceneWordsMin - actualWords;
  }

  if (actualWords > options.targetSceneWordsMax) {
    return actualWords - options.targetSceneWordsMax;
  }

  return 0;
}

function getGeminiApiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    null
  );
}

function getGroqApiKey() {
  return process.env.GROQ_API_KEY || null;
}

function hydrateDraftJob(
  sceneId: string,
  packet: SceneContextPacket,
  payload: DraftProviderResult,
  meta: {
    provider: BookDraftJob["provider"];
    mode: BookDraftJob["mode"];
    modelName: string | null;
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
    outline: buildOutlineFromBeatPlan(payload.beatPlan),
    draftText: payload.draftText,
    rewriteText: payload.rewriteText,
    rewriteNotes: payload.rewriteNotes,
    literaryFrictionText: payload.literaryFrictionText,
    literaryFrictionNotes: payload.literaryFrictionNotes,
    literaryFrictionReport: payload.literaryFrictionReport,
    extractedState: withDraftMemorySync(payload.extractedState, {
      fallbackCreatedAt: now,
      defaultStatus: "pending"
    }),
    stages: payload.stages,
    contextSnapshot: {
      contextPackId: packet.dynamicContext.contextPackId || null,
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

async function requestOpenAIStructured<T>(params: {
  client: OpenAI;
  modelName: string;
  schema: z.ZodType<T>;
  schemaName: string;
  systemPrompt: string;
  userPrompt: string;
}) {
  const startedAt = Date.now();
  const response = await params.client.responses.parse({
    model: params.modelName,
    store: false,
    reasoning: { effort: "medium" },
    input: buildOpenAIInput(params.systemPrompt, params.userPrompt),
    text: {
      format: zodTextFormat(params.schema, params.schemaName)
    }
  });

  if (!response.output_parsed) {
    throw new Error("OpenAI returned no parsed output.");
  }

  return {
    payload: response.output_parsed,
    metrics: buildOpenAIMetrics(response, params.modelName, startedAt)
  };
}

async function requestOpenAIText(params: {
  client: OpenAI;
  modelName: string;
  systemPrompt: string;
  userPrompt: string;
  maxOutputTokens: number;
}) {
  const startedAt = Date.now();
  const response = await params.client.responses.create({
    model: params.modelName,
    store: false,
    reasoning: { effort: "medium" },
    input: buildOpenAIInput(params.systemPrompt, params.userPrompt),
    max_output_tokens: params.maxOutputTokens
  });
  const text = response.output_text?.trim();

  if (!text) {
    throw new Error("OpenAI returned no text output.");
  }

  return {
    text,
    metrics: buildOpenAIMetrics(response, params.modelName, startedAt)
  };
}

async function requestAnthropicStructured<T>(params: {
  client: Anthropic;
  stageName: AnthropicStructuredStageName;
  modelName: string;
  maxTokens: number;
  schema: z.ZodType<T>;
  systemBlocks: Anthropic.TextBlockParam[];
  userPrompt: string;
}) {
  const startedAt = Date.now();
  try {
    const message = await params.client.messages.parse({
      betas: [...ANTHROPIC_CACHE_BETAS],
      model: params.modelName,
      max_tokens: params.maxTokens,
      system: params.systemBlocks,
      messages: [
        {
          role: "user",
          content: params.userPrompt
        }
      ],
      output_config: {
        format: zodOutputFormat(params.schema)
      }
    });

    if (!message.parsed_output) {
      throw new Error("Anthropic returned no parsed output.");
    }

    return {
      payload: message.parsed_output,
      metrics: buildAnthropicMetrics(message, params.modelName, startedAt)
    };
  } catch (initialError) {
    return requestAnthropicStructuredFallback(params, startedAt, initialError);
  }
}

async function requestAnthropicText(params: {
  client: Anthropic;
  modelName: string;
  maxTokens: number;
  systemBlocks: Anthropic.TextBlockParam[];
  userPrompt: string;
}) {
  const startedAt = Date.now();
  const message = await params.client.messages.create({
    model: params.modelName,
    max_tokens: params.maxTokens,
    system: params.systemBlocks,
    messages: [
      {
        role: "user",
        content: params.userPrompt
      }
    ]
  }, buildAnthropicCacheRequestOptions());
  const text = collectAnthropicText(message).trim();

  if (!text) {
    throw new Error("Anthropic returned no text output.");
  }

  return {
    text,
    metrics: buildAnthropicMetrics(message, params.modelName, startedAt)
  };
}

async function requestGeminiStructured<T>(params: {
  client: GoogleGenAI;
  modelName: string;
  schema: z.ZodType<T>;
  systemInstruction: string;
  userPrompt: string;
}) {
  const startedAt = Date.now();
  const response = await params.client.models.generateContent({
    model: params.modelName,
    contents: params.userPrompt,
    config: {
      systemInstruction: params.systemInstruction,
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(params.schema)
    }
  });

  if (!response.text) {
    throw new Error("Gemini returned no text output.");
  }

  return {
    payload: params.schema.parse(JSON.parse(response.text)),
    metrics: buildGeminiMetrics(response, params.modelName, startedAt)
  };
}

async function requestGeminiText(params: {
  client: GoogleGenAI;
  modelName: string;
  systemInstruction: string;
  userPrompt: string;
  maxOutputTokens: number;
}) {
  const startedAt = Date.now();
  const response = await params.client.models.generateContent({
    model: params.modelName,
    contents: params.userPrompt,
    config: {
      systemInstruction: params.systemInstruction,
      maxOutputTokens: params.maxOutputTokens
    }
  });
  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini returned no text output.");
  }

  return {
    text,
    metrics: buildGeminiMetrics(response, params.modelName, startedAt)
  };
}

async function requestGroqStructured<T>(params: {
  client: OpenAI;
  modelName: string;
  schema: z.ZodType<T>;
  schemaName: string;
  systemPrompt: string;
  userPrompt: string;
  maxOutputTokens: number;
}) {
  const startedAt = Date.now();
  const schemaJson = z.toJSONSchema(params.schema);
  const completion = await params.client.chat.completions.create({
    model: params.modelName,
    temperature: 0.2,
    max_tokens: params.maxOutputTokens,
    response_format: {
      type: "json_object"
    },
    messages: [
      {
        role: "system",
        content: [
          params.systemPrompt,
          "Return only valid JSON with no markdown, prose, or code fences.",
          `Schema name: ${params.schemaName}`,
          `JSON schema: ${JSON.stringify(schemaJson)}`
        ].join("\n\n")
      },
      {
        role: "user",
        content: params.userPrompt
      }
    ]
  });
  const text = extractGroqMessageText(completion);

  return {
    payload: params.schema.parse(JSON.parse(normalizeJsonText(text))),
    metrics: buildGroqMetrics(completion, params.modelName, startedAt)
  };
}

async function requestGroqText(params: {
  client: OpenAI;
  modelName: string;
  systemPrompt: string;
  userPrompt: string;
  maxOutputTokens: number;
}) {
  const startedAt = Date.now();
  const completion = await params.client.chat.completions.create({
    model: params.modelName,
    temperature: 0.7,
    max_tokens: params.maxOutputTokens,
    messages: [
      {
        role: "system",
        content: params.systemPrompt
      },
      {
        role: "user",
        content: params.userPrompt
      }
    ]
  });
  const text = extractGroqMessageText(completion).trim();

  if (!text) {
    throw new Error("Groq returned no text output.");
  }

  return {
    text,
    metrics: buildGroqMetrics(completion, params.modelName, startedAt)
  };
}

function buildOpenAIInput(systemPrompt: string, userPrompt: string) {
  return [
    {
      role: "system" as const,
      content: systemPrompt
    },
    {
      role: "user" as const,
      content: userPrompt
    }
  ];
}

function buildOpenAIMetrics(
  response: {
    usage?: { input_tokens: number; output_tokens: number } | null;
    incomplete_details?: { reason?: string | null } | null;
    status?: string | null;
  },
  modelName: string,
  startedAt: number
): StageCallMetrics {
  return {
    modelName,
    attemptCount: 1,
    repairCount: 0,
    durationMs: Date.now() - startedAt,
    inputTokens: response.usage?.input_tokens ?? null,
    outputTokens: response.usage?.output_tokens ?? null,
    stopReason: response.incomplete_details?.reason ?? response.status ?? null
  };
}

function buildAnthropicMetrics(
  message: Anthropic.Message,
  modelName: string,
  startedAt: number
): StageCallMetrics {
  const inputTokens =
    (message.usage.input_tokens ?? 0) +
      (message.usage.cache_creation_input_tokens ?? 0) +
      (message.usage.cache_read_input_tokens ?? 0) || null;

  return {
    modelName,
    attemptCount: 1,
    repairCount: 0,
    durationMs: Date.now() - startedAt,
    inputTokens,
    outputTokens: message.usage.output_tokens ?? null,
    stopReason: message.stop_reason ?? null
  };
}

function buildGeminiMetrics(
  response: {
    usageMetadata?: {
      promptTokenCount?: number;
      candidatesTokenCount?: number;
    } | null;
    candidates?: Array<{
      finishReason?: string | null;
    }> | null;
  },
  modelName: string,
  startedAt: number
): StageCallMetrics {
  return {
    modelName,
    attemptCount: 1,
    repairCount: 0,
    durationMs: Date.now() - startedAt,
    inputTokens: response.usageMetadata?.promptTokenCount ?? null,
    outputTokens: response.usageMetadata?.candidatesTokenCount ?? null,
    stopReason: response.candidates?.[0]?.finishReason ?? null
  };
}

function buildGroqMetrics(
  completion: {
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
    } | null;
    choices?: Array<{
      finish_reason?: string | null;
    }> | null;
  },
  modelName: string,
  startedAt: number
): StageCallMetrics {
  return {
    modelName,
    attemptCount: 1,
    repairCount: 0,
    durationMs: Date.now() - startedAt,
    inputTokens: completion.usage?.prompt_tokens ?? null,
    outputTokens: completion.usage?.completion_tokens ?? null,
    stopReason: completion.choices?.[0]?.finish_reason ?? null
  };
}

function resolveDraftWordTargets(options: DraftGenerationOptions) {
  const min = Math.max(250, Math.round(options.targetSceneWordsMin * 0.58));
  const max = Math.max(min + 120, Math.round(options.targetSceneWordsMax * 0.72));

  return { min, max };
}

function resolveOpenAIProseMaxTokens(targetWordMax: number) {
  return clampNumber(Math.round(targetWordMax * 3.2), OPENAI_PROSE_MIN_TOKENS, OPENAI_PROSE_MAX_TOKENS);
}

function resolveAnthropicProseMaxTokens(targetWordMax: number) {
  return clampNumber(
    Math.round(targetWordMax * 3.25),
    ANTHROPIC_PROSE_MIN_TOKENS,
    ANTHROPIC_PROSE_MAX_TOKENS
  );
}

function resolveGeminiProseMaxTokens(targetWordMax: number) {
  return clampNumber(Math.round(targetWordMax * 3.1), GEMINI_PROSE_MIN_TOKENS, GEMINI_PROSE_MAX_TOKENS);
}

function resolveGroqProseMaxTokens(targetWordMax: number) {
  return clampNumber(Math.round(targetWordMax * 3.1), GROQ_PROSE_MIN_TOKENS, GROQ_PROSE_MAX_TOKENS);
}

function extractGroqMessageText(completion: {
  choices?: Array<{
    message?: {
      content?: string | null;
    } | null;
  }> | null;
}) {
  const text = completion.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("Groq returned no text output.");
  }

  return text;
}

function normalizeJsonText(value: string) {
  const trimmed = value.trim();

  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  return trimmed;
}

function buildSystemPrompt(packet: SceneContextPacket) {
  return [buildCoreSystemPrompt(), buildStablePrefixPrompt(packet)].join("\n\n");
}

function buildCoreSystemPrompt() {
  return [
    "You are the drafting engine for EMBER Book Studio.",
    "Write all output in German.",
    "Honor canon, continuity, and scene-level causality.",
    "Scene-specific hard constraints outrank style rules, examples, and generic thriller habits.",
    "Never reuse literal timestamps, locations, headers, or props from examples unless they appear in the current scene constraints.",
    "Do not imitate real authors or copyrighted prose.",
    "Favor commercial readability, tension, subtext, concrete observation, and clean scene movement.",
    "If context is insufficient, flag risk explicitly instead of inventing hidden facts.",
    "Show, don't explain. If an image, gesture, or action already carries meaning, no explanatory sentence follows.",
    "Forbidden patterns: 'Sie merkte, dass', 'Sie spürte, wie', 'Das war es, was', 'nicht X, sondern Y' as explanation. End the sentence where the action ends."
  ].join("\n");
}

function buildGlobalTechniqueSections(packet: SceneContextPacket) {
  const sections = [buildLlmOutputControlPrompt()];

  if (isThrillerProject(packet)) {
    sections.push(buildGlobalThrillerTechniquePrompt());
  }

  return sections;
}

function buildLlmOutputControlPrompt() {
  return [
    "LLM output control:",
    "- Do not explain strong images after they already land.",
    "- Do not round off scene endings into soft closure.",
    "- Do not repeat the same emotional or evidentiary effect twice.",
    "- Keep the antagonist early-stage socially plausible, never too cleanly exposed.",
    "- Side figures need their own protection logic; they are not plot levers.",
    "- Institutions act by procedure, risk, documentation, and scope, not convenience.",
    "- Avoid object clutter: one strong proof object beats many decorative props.",
    "- Cut inner commentary that only restates visible action.",
    "- Suspense without concrete cost is weak suspense.",
    "- Never let a chapter explain its own thematic purpose."
  ].join("\n");
}

function buildGlobalThrillerTechniquePrompt() {
  return [
    "Global thriller engine:",
    "Scene promise: every scene must satisfy 'the protagonist wants X, does Y, gains/loses Z, but B gets worse.'",
    "Suspense stack: track main_question, pressure_clock, information_gap, false_reading, reversal, proof_object, cost, status_shift, new_question, ending_type, bad_version_risk, revision_focus.",
    "Question-answer economy: each scene must partly answer one live reader question and replace it with a more dangerous one.",
    "Reversal rule: rational action should expose a sharper danger.",
    "Chapter endings end on a concrete turn: proof turn, access loss, social reframe, object intrusion, quiet countermove, child echo, institutional lock, moral reframe, physical proximity, or deadline shift.",
    "Proof image before explanation: object, gesture, behavior, or administrative detail carries meaning; prose does not re-explain it.",
    "Anti-redundancy: if scene A delivers shock, scene B must deliver consequence; if scene A delivers suspicion, scene B must deliver cost.",
    "Red-herring protocol: false leads are false readings that remain partly true and cost the protagonist something real.",
    "Capability rules: the counterforce needs a plausible channel, timeframe, risk, and residue for every bigger move.",
    "One-weapon rule: one dominant weapon per scene, even if secondary weapons appear.",
    "Counterforce cost rule: every larger success leaves a mistake, witness line, residue, tighter corridor, or system reaction.",
    "Subtlety rule: early signs are only minimally too helpful, informed, early, calm, plausible, or fitting.",
    "Supporting figures and institutions stay competent, bounded, and self-protective.",
    "Global proof ladder: anomaly -> documented plausibility -> social/institutional effect -> pattern -> access -> replacement/reframing -> durable chain -> public or irreversible consequence.",
    "Scene engine: enter under pressure, give the protagonist a concrete goal, let the world answer plausibly, force a mid-scene reversal, shift relation or power, end after the strongest turn."
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

function buildStablePrefixSections(packet: SceneContextPacket) {
  return [
    [
      `Premise: ${packet.stablePrefix.premise}`,
      `Reader promise: ${packet.stablePrefix.readerPromise}`,
      `Ending promise: ${packet.stablePrefix.endingPromise}`,
      `Thematic core: ${packet.stablePrefix.thematicCore}`,
      `Commercial lane: ${packet.stablePrefix.categoryLane || "not set"}`,
      `Commercial hook: ${packet.stablePrefix.marketHook || "not set"}`
    ].join("\n"),
    formatPromptList("Story architecture", packet.stablePrefix.storyArchitecture),
    formatPromptList("Writer constitution", packet.stablePrefix.writerConstitution),
    formatGuidanceBlocks("Voice pack", packet.stablePrefix.voicePack),
    formatGuidanceBlocks("Proof ladder", packet.stablePrefix.proofLadder),
    formatPromptList("Publishing guardrails", packet.stablePrefix.publishingGuardrails),
    formatWorldBiblePrimer("World bible primer", packet.stablePrefix.worldBiblePrimer)
  ];
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
      cache_control: { type: "ephemeral" as const, ttl: ANTHROPIC_CACHE_TTL }
    },
    {
      type: "text" as const,
      text: buildAnthropicDynamicContextPrompt(packet),
      cache_control: { type: "ephemeral" as const, ttl: ANTHROPIC_CACHE_TTL }
    }
  ];
}

function buildAnthropicCachedTextBlock(text: string) {
  return {
    type: "text" as const,
    text,
    cache_control: { type: "ephemeral" as const, ttl: ANTHROPIC_CACHE_TTL }
  };
}

export function buildAnthropicPromptInspection(packet: SceneContextPacket) {
  return {
    systemBlocks: buildAnthropicSystemPromptBlocks(packet).map(function (block) {
      return {
        text: block.text,
        cacheControl: "cache_control" in block ? block.cache_control : null
      };
    }),
    dynamicContextPrompt: buildAnthropicDynamicContextPrompt(packet),
    beatPlanPrompt: buildBeatPlanPrompt(packet, {
      targetSceneWordsMin: 1200,
      targetSceneWordsMax: 1600,
      directorNote: ""
    })
  };
}

function buildAnthropicDynamicContextPrompt(packet: SceneContextPacket) {
  return [
    "Scene-bound dynamic context for this job:",
    buildSceneContextPrompt(packet),
    "",
    "Continuity focus:",
    buildContinuityContext(packet)
  ].join("\n");
}

function buildBeatPlanPrompt(packet: SceneContextPacket, options: DraftGenerationOptions) {
  const totalTarget = Math.round((options.targetSceneWordsMin + options.targetSceneWordsMax) / 2);

  return [
    "Create a compact beat plan for one scene.",
    "Return only structured output matching the requested schema.",
    `Target scene range: ${options.targetSceneWordsMin}-${options.targetSceneWordsMax} words.`,
    `Preferred total beat budget: ${totalTarget} words.`,
    "Requirements:",
    "- 3 to 5 beats.",
    "- Each beat must have a functional purpose and a concrete mustLand payoff.",
    "- targetWords across all beats should roughly sum to the preferred total.",
    "- Keep beats dramatic, not essayistic.",
    "- label should stay short.",
    "- purpose should be one compact sentence.",
    "- mustLand should be one compact payoff sentence.",
    buildSceneContextPrompt(packet),
    options.directorNote ? `Director note: ${options.directorNote}` : "Director note: none"
  ].join("\n");
}

function buildDraftProsePrompt(
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  beatPlan: BeatPlanPayload
) {
  const draftTargets = resolveDraftWordTargets(options);

  return [
    "Write the first draft of the selected scene.",
    "Return prose only. No JSON, no headings, no bullet points, no commentary.",
    `Draft target range: ${draftTargets.min}-${draftTargets.max} words.`,
    "This is a fast but complete scene pass. Stay scene-bound and keep exposition compressed.",
    "Hit every beat, but keep some sentences raw enough that a later rewrite can sharpen them.",
    buildSceneContextPrompt(packet),
    `Beat plan: ${formatBeatPlanForPrompt(beatPlan)}`,
    options.directorNote ? `Director note: ${options.directorNote}` : "Director note: none"
  ].join("\n");
}

function buildRewriteProsePrompt(
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  beatPlan: BeatPlanPayload,
  draftText: string
) {
  return [
    "Rewrite the scene into the final prose pass.",
    "Return prose only. No JSON, no commentary.",
    `Target rewrite range: ${options.targetSceneWordsMin}-${options.targetSceneWordsMax} words.`,
    "Tighten rhythm, sharpen observation, improve dialogue subtext, and end on a stronger hook.",
    "Preserve canon and beat order. Expand pressure, not fluff.",
    buildSceneContextPrompt(packet),
    `Beat plan: ${formatBeatPlanForPrompt(beatPlan)}`,
    `Current draft: ${draftText}`
  ].join("\n");
}

function buildExpandPrompt(
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  beatPlan: BeatPlanPayload,
  rewriteText: string
) {
  const beatsToExpand = beatPlan.beats.slice(-2).map(function (beat) {
    return `${beat.label}: ${beat.purpose}`;
  });

  return [
    "Expand the scene while preserving continuity and voice.",
    "Return prose only.",
    `Target rewrite range: ${options.targetSceneWordsMin}-${options.targetSceneWordsMax} words.`,
    "Only deepen up to two named beats. Add tension, physical detail, reaction, and pressure. Do not add side plots.",
    `Preferred expansion beats: ${beatsToExpand.join(" | ") || "last two beats"}`,
    buildSceneContextPrompt(packet),
    `Beat plan: ${formatBeatPlanForPrompt(beatPlan)}`,
    `Current rewrite: ${rewriteText}`
  ].join("\n");
}

function buildCompressPrompt(
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  beatPlan: BeatPlanPayload,
  rewriteText: string
) {
  return [
    "Compress the scene while preserving all essential story movement.",
    "Return prose only.",
    `Target rewrite range: ${options.targetSceneWordsMin}-${options.targetSceneWordsMax} words.`,
    "Cut exposition, repeated reflection, redundant gestures, and duplicate information. Do not cut the dramatic turn or closing hook.",
    buildSceneContextPrompt(packet),
    `Beat plan: ${formatBeatPlanForPrompt(beatPlan)}`,
    `Current rewrite: ${rewriteText}`
  ].join("\n");
}

function buildStateExtractionPrompt(
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  beatPlan: BeatPlanPayload,
  rewriteText: string
) {
  return [
    "Extract scene state from the finished rewrite.",
    "Return only structured output matching the requested schema.",
    `Target rewrite range: ${options.targetSceneWordsMin}-${options.targetSceneWordsMax} words.`,
    "Rules:",
    "- rewriteNotes must describe visible revisions or strengths in plain compact language.",
    "- rewriteNotes: 1 to 4 items, each under 100 characters.",
    "- Every extractedState list: 0 to 3 items, each under 100 characters.",
    "- Every extractedState entry must be a plain string. No objects.",
    "- extractedState must stay conservative: explicit facts only.",
    "- Prefer empty arrays over speculative entries.",
    "- Uncertainty belongs only in continuityRisks.",
    buildSceneContextPrompt(packet),
    `Beat plan: ${formatBeatPlanForPrompt(beatPlan)}`,
    `Final rewrite: ${rewriteText}`
  ].join("\n");
}

function buildContinuityAuditPrompt(
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  beatPlan: BeatPlanPayload,
  draftText: string,
  rewriteText: string,
  extractedState: DraftExtractionState
) {
  return [
    "Audit this scene for continuity and style drift only.",
    "Return only structured output matching the requested schema.",
    `Target rewrite range: ${options.targetSceneWordsMin}-${options.targetSceneWordsMax} words.`,
    "Do not rewrite the scene. Only flag issues that matter for canon or stylistic consistency.",
    "Keep every listed issue compact.",
    "Also flag these LLM failure modes when present: explanation after image, overly smooth ending, repeated effect, antagonist too clear too early, side figures acting only as plot tools, institutions behaving too conveniently, object clutter, excess inner commentary, suspense without cost, scene explaining its own purpose.",
    buildSceneContextPrompt(packet),
    `Beat plan: ${formatBeatPlanForPrompt(beatPlan)}`,
    `Draft text: ${draftText}`,
    `Rewrite text: ${rewriteText}`,
    `Existing continuity risks: ${extractedState.continuityRisks.join(" | ") || "none"}`,
    `Existing style drift notes: ${extractedState.styleDriftNotes.join(" | ") || "none"}`
  ].join("\n");
}

function buildQualityEvalPrompt(
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  beatPlan: BeatPlanPayload,
  rewriteText: string,
  extractedState: DraftExtractionState
) {
  return [
    "Evaluate the final scene quality.",
    "Return only structured output matching the requested schema.",
    "Score from 0 to 10.",
    `wordTargetMin must equal ${options.targetSceneWordsMin}.`,
    `wordTargetMax must equal ${options.targetSceneWordsMax}.`,
    `wordActual must equal the actual word count of the scene text.`,
    "Issues should be short, concrete, and user-facing.",
    "Keep every issue compact.",
    "Check for: explanation after image, rounded ending, repeated effect, antagonist too explicit too early, functional side figures, convenient institutions, too many proof objects, excess inner commentary, tension without cost, and chapters that explain their own purpose.",
    buildSceneContextPrompt(packet),
    `Beat plan: ${formatBeatPlanForPrompt(beatPlan)}`,
    `Extracted continuity risks: ${extractedState.continuityRisks.join(" | ") || "none"}`,
    `Final rewrite: ${rewriteText}`
  ].join("\n");
}

function buildLiteraryFrictionPrompt(
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  beatPlan: BeatPlanPayload,
  rewriteText: string,
  extractedState: DraftExtractionState,
  qualityEval: QualityEvalPayload
) {
  const thrillerNote = isThrillerProject(packet)
    ? "Apply the global thriller rules strictly, especially proof image before explanation, question-answer economy, reversal, proof ladder, and anti-redundancy."
    : "Apply the literary-friction pass without adding genre ornament."

  return [
    "Run a final literary friction pass on the finished scene.",
    "Return only structured output matching the requested schema.",
    "This is not a normal rewrite.",
    "Do not make the prose prettier, more poetic, or more expansive.",
    "Protect strong images, body detail, social ambivalence, and abrasive edges.",
    "Do not add plot, motives, symbolism, or new explanation.",
    "If revision is needed, revise at most 10 percent of the text and keep the same story events.",
    "Assess:",
    "- image protection and over-explanation",
    "- retrospective explanation",
    "- AI sentence patterns",
    "- abstraction pressure",
    "- ending strength",
    "- ambiguity protection",
    "- body truth",
    "- dialogue friction",
    "- LLM weaknesses: soft endings, repeated effects, over-clear antagonist, functional side figures, convenient institutions, too many objects, excess inner commentary, suspense without cost, chapter explaining itself",
    thrillerNote,
    `Target rewrite range: ${options.targetSceneWordsMin}-${options.targetSceneWordsMax} words.`,
    buildSceneContextPrompt(packet),
    `Beat plan: ${formatBeatPlanForPrompt(beatPlan)}`,
    `Continuity risks: ${extractedState.continuityRisks.join(" | ") || "none"}`,
    `Quality issues: ${qualityEval.issues.join(" | ") || "none"}`,
    `Final rewrite: ${rewriteText}`
  ].join("\n");
}

function buildAnthropicScenePrompt(params: {
  mode: "draft" | "rewrite" | "expand" | "compress";
  packet: SceneContextPacket;
  options: DraftGenerationOptions;
  beatPlan: BeatPlanPayload;
  draftText?: string;
  rewriteText?: string;
}) {
  const sceneContext = buildSceneContextXml(params.packet);
  const modeInstruction =
    params.mode === "draft"
      ? `Write a first-pass scene in ${resolveDraftWordTargets(params.options).min}-${resolveDraftWordTargets(params.options).max} words.`
      : params.mode === "rewrite"
        ? `Rewrite the scene into a polished final pass in ${params.options.targetSceneWordsMin}-${params.options.targetSceneWordsMax} words.`
        : params.mode === "expand"
          ? `Expand the scene into ${params.options.targetSceneWordsMin}-${params.options.targetSceneWordsMax} words by deepening at most two beats.`
          : `Compress the scene into ${params.options.targetSceneWordsMin}-${params.options.targetSceneWordsMax} words by cutting exposition and repetition.`;

  return [
    `<market_traits>${escapeXml([params.packet.stablePrefix.categoryLane, params.packet.stablePrefix.marketHook].filter(Boolean).join(" | "))}</market_traits>`,
    `<writer_constitution>${escapeXml(params.packet.stablePrefix.writerConstitution.join(" | "))}</writer_constitution>`,
    `<scene_context>${sceneContext}</scene_context>`,
    `<continuity>${escapeXml(buildContinuityContext(params.packet))}</continuity>`,
    `<beat_plan>${escapeXml(formatBeatPlanForPrompt(params.beatPlan))}</beat_plan>`,
    params.options.directorNote
      ? `<director_note>${escapeXml(params.options.directorNote)}</director_note>`
      : "",
    params.draftText ? `<draft_pass>${escapeXml(params.draftText)}</draft_pass>` : "",
    params.rewriteText ? `<current_rewrite>${escapeXml(params.rewriteText)}</current_rewrite>` : "",
    `<output_contract>${escapeXml(`${modeInstruction} Return prose only in German. No headings, no JSON, no commentary.`)}</output_contract>`
  ]
    .filter(Boolean)
    .join("\n");
}

function buildSceneContextPrompt(packet: SceneContextPacket) {
  return [
    `Act: ${packet.dynamicContext.actTitle}`,
    `Chapter: ${packet.dynamicContext.chapterTitle}`,
    `Scene: ${packet.dynamicContext.sceneTitle}`,
    `Scene card id: ${packet.dynamicContext.sceneCardLabel || "not set"}`,
    `Scene header hints: ${packet.dynamicContext.sceneHeaderHints.join(" || ") || "none"}`,
    `Hard scene constraints: ${packet.dynamicContext.sceneHardConstraints.join(" || ") || "none"}`,
    `Scene drive: ${packet.dynamicContext.sceneDrive || "none"}`,
    `POV knowledge boundary: ${packet.dynamicContext.povKnowledgeBoundary || "none"}`,
    `Relationship pressure: ${packet.dynamicContext.relationshipPressure || "none"}`,
    `End-state hook: ${packet.dynamicContext.endStateHook || "none"}`,
    `Scene summary: ${packet.dynamicContext.sceneSummary}`,
    `Scene excerpt: ${packet.dynamicContext.sceneExcerpt}`,
    `Scene card outline: ${packet.dynamicContext.sceneCardOutline.join(" || ") || "none"}`,
    `Context pack id: ${packet.dynamicContext.contextPackId || "generated_locally"}`,
    `Previous accepted prose tail: ${packet.dynamicContext.previousAcceptedProseTail || "none"}`,
    "Previous accepted prose tail is continuity context only; preserve concrete facts from it, but do not copy its wording and do not extract it as new state for the current scene.",
    `Previous beats: ${packet.dynamicContext.previousBeats
      .map(function (beat) {
        return `${beat.sceneTitle}: ${beat.summary || beat.excerpt}`;
      })
      .join(" || ") || "none"}`,
    `Next beat: ${packet.dynamicContext.nextBeat?.sceneTitle || "none"}`,
    `Relevant codex: ${packet.dynamicContext.relevantCodex
      .map(function (entry) {
        return `${entry.title}: ${entry.summary}`;
      })
      .join(" || ") || "none"}`,
    `Relevant character states: ${packet.dynamicContext.relevantCharacterStates
      .map(function (entry) {
        return formatCharacterStatePrompt(entry);
      })
      .join(" || ") || "none"}`,
    `Active threads: ${packet.dynamicContext.activeThreads
      .map(function (thread) {
        return `${thread.label}: ${thread.detail}`;
      })
      .join(" || ") || "none"}`
  ].join("\n");
}

function buildSceneContextXml(packet: SceneContextPacket) {
  return escapeXml(buildSceneContextPrompt(packet));
}

function buildContinuityContext(packet: SceneContextPacket) {
  return [
    `Relevant codex: ${packet.dynamicContext.relevantCodex
      .map(function (entry) {
        return `${entry.title}: ${entry.summary}`;
      })
      .join(" | ") || "none"}`,
    `Relevant character states: ${packet.dynamicContext.relevantCharacterStates
      .map(function (entry) {
        return formatCharacterStatePrompt(entry);
      })
      .join(" | ") || "none"}`,
    `Active threads: ${packet.dynamicContext.activeThreads
      .map(function (thread) {
        return `${thread.label}: ${thread.detail}`;
      })
      .join(" | ") || "none"}`,
    `Previous accepted prose tail: ${packet.dynamicContext.previousAcceptedProseTail || "none"}`
  ].join("\n");
}

function isThrillerProject(packet: SceneContextPacket) {
  const haystack = normalizeText(
    [
      packet.stablePrefix.categoryLane,
      packet.stablePrefix.marketHook,
      packet.stablePrefix.readerPromise,
      packet.stablePrefix.premise,
      packet.stablePrefix.endingPromise
    ]
      .filter(Boolean)
      .join(" ")
  );

  return [
    "thriller",
    "suspense",
    "crime",
    "psychological",
    "psychologisch",
    "domestic",
    "mystery"
  ].some(function (needle) {
    return haystack.includes(needle);
  });
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

function formatGuidanceBlocks(
  label: string,
  blocks: SceneContextPacket["stablePrefix"]["voicePack"]
) {
  const compactBlocks = blocks.filter(function (block) {
    return block.title.trim() && block.lines.length > 0;
  });

  if (!compactBlocks.length) {
    return `${label}: none`;
  }

  return [
    `${label}:`,
    ...compactBlocks.flatMap(function (block, index) {
      const lines = block.lines.map(function (line) {
        return `- ${line}`;
      });

      return (index > 0 ? [""] : []).concat([`${block.title}:`]).concat(lines);
    })
  ].join("\n");
}

function formatWorldBiblePrimer(
  label: string,
  entries: SceneContextPacket["stablePrefix"]["worldBiblePrimer"]
) {
  if (!entries.length) {
    return `${label}: none`;
  }

  return [
    `${label}:`,
    ...entries.map(function (entry) {
      return `- [${entry.kind}] ${entry.title}: ${entry.summary}`;
    })
  ].join("\n");
}

function serializeGuidanceBlocks(blocks: SceneContextPacket["stablePrefix"]["voicePack"]) {
  return blocks
    .filter(function (block) {
      return block.title.trim() && block.lines.length > 0;
    })
    .map(function (block) {
      return `${block.title}: ${block.lines.join(" | ")}`;
    })
    .join(" || ") || "none";
}

function serializeWorldBiblePrimer(entries: SceneContextPacket["stablePrefix"]["worldBiblePrimer"]) {
  return entries
    .map(function (entry) {
      return `[${entry.kind}] ${entry.title}: ${entry.summary}`;
    })
    .join(" | ") || "none";
}

function sanitizeBeatPlan(
  packet: SceneContextPacket,
  options: DraftGenerationOptions,
  payload: BeatPlanPayload
): BeatPlanPayload {
  const fallback = buildFallbackBeatPlan(packet, options);
  const rawBeats = Array.isArray(payload.beats) && payload.beats.length ? payload.beats : fallback.beats;
  const trimmedBeats = rawBeats.slice(0, 5).map(function (beat, index) {
    return {
      label: truncateText(beat.label.trim() || `Beat ${index + 1}`, 80),
      purpose: truncateText(
        beat.purpose.trim() || fallback.beats[index]?.purpose || packet.dynamicContext.sceneSummary,
        240
      ),
      targetWords: clampNumber(beat.targetWords, 60, options.targetSceneWordsMax),
      mustLand: truncateText(
        beat.mustLand.trim() || fallback.beats[index]?.mustLand || "Die Szene kippt sichtbar.",
        180
      )
    };
  });

  return {
    beats: rebalanceBeatTargets(trimmedBeats, Math.round((options.targetSceneWordsMin + options.targetSceneWordsMax) / 2))
  };
}

function buildFallbackBeatPlan(
  packet: SceneContextPacket,
  options: DraftGenerationOptions
): BeatPlanPayload {
  const source = packet.dynamicContext.sceneCardOutline.length
    ? packet.dynamicContext.sceneCardOutline
    : [
        `${packet.dynamicContext.sceneTitle} startet unter Druck.`,
        packet.dynamicContext.sceneSummary,
        "Die Szene endet mit einer sichtbaren Verschiebung."
      ];
  const totalTarget = Math.round((options.targetSceneWordsMin + options.targetSceneWordsMax) / 2);
  const perBeat = Math.max(90, Math.round(totalTarget / source.length));

  return {
    beats: source.slice(0, 5).map(function (entry, index) {
      return {
        label: `Beat ${index + 1}`,
        purpose: entry,
        targetWords: perBeat,
        mustLand: entry
      };
    })
  };
}

function rebalanceBeatTargets(
  beats: BeatPlanPayload["beats"],
  totalTarget: number
): BeatPlanPayload["beats"] {
  const safeBeats = beats.length ? beats : [{ label: "Beat 1", purpose: "", targetWords: totalTarget, mustLand: "" }];
  const currentTotal = safeBeats.reduce(function (sum, beat) {
    return sum + beat.targetWords;
  }, 0);

  if (!currentTotal) {
    return safeBeats.map(function (beat) {
      return {
        ...beat,
        targetWords: Math.max(80, Math.round(totalTarget / safeBeats.length))
      };
    });
  }

  const scale = totalTarget / currentTotal;

  return safeBeats.map(function (beat, index) {
    const scaled = Math.max(60, Math.round(beat.targetWords * scale));

    return {
      ...beat,
      targetWords: index === safeBeats.length - 1
        ? Math.max(
            60,
            totalTarget -
              safeBeats
                .slice(0, index)
                .reduce(function (sum, currentBeat) {
                  return sum + Math.max(60, Math.round(currentBeat.targetWords * scale));
                }, 0)
          )
        : scaled
    };
  });
}

function buildOutlineFromBeatPlan(beatPlan: BeatPlanPayload) {
  return beatPlan.beats.map(function (beat) {
    return `${beat.label}: ${beat.purpose} (${beat.targetWords}W, Payoff: ${beat.mustLand})`;
  });
}

function formatBeatPlanForPrompt(beatPlan: BeatPlanPayload) {
  return beatPlan.beats
    .map(function (beat) {
      return `${beat.label} [${beat.targetWords}W] - ${beat.purpose} -> ${beat.mustLand}`;
    })
    .join(" | ");
}

function normalizeStateExtractionPayload(payload: StateExtractionPayload): StateExtractionPayload {
  return {
    rewriteNotes: dedupeStrings(payload.rewriteNotes).slice(0, EXTRACT_REWRITE_NOTES_MAX_ITEMS),
    extractedState: {
      newCanonFacts: dedupeStrings(payload.extractedState.newCanonFacts).slice(0, EXTRACT_ARRAY_MAX_ITEMS),
      characterStateUpdates: dedupeStrings(payload.extractedState.characterStateUpdates).slice(0, EXTRACT_ARRAY_MAX_ITEMS),
      openThreadsCreated: dedupeStrings(payload.extractedState.openThreadsCreated).slice(0, EXTRACT_ARRAY_MAX_ITEMS),
      openThreadsResolved: dedupeStrings(payload.extractedState.openThreadsResolved).slice(0, EXTRACT_ARRAY_MAX_ITEMS),
      foreshadowingAdded: dedupeStrings(payload.extractedState.foreshadowingAdded).slice(0, EXTRACT_ARRAY_MAX_ITEMS),
      continuityRisks: dedupeStrings(payload.extractedState.continuityRisks).slice(0, EXTRACT_ARRAY_MAX_ITEMS),
      styleDriftNotes: dedupeStrings(payload.extractedState.styleDriftNotes).slice(0, EXTRACT_ARRAY_MAX_ITEMS)
    }
  };
}

function normalizeRewriteNotes(
  notes: string[],
  rewriteText: string,
  beatPlan: BeatPlanPayload
) {
  const sanitized = dedupeStrings(notes).slice(0, EXTRACT_REWRITE_NOTES_MAX_ITEMS);

  if (sanitized.length) {
    return sanitized;
  }

  return [
    `Beat-Folge ${beatPlan.beats[0]?.label || "Beat 1"} bis ${beatPlan.beats[beatPlan.beats.length - 1]?.label || "Finale"} sichtbar gehalten.`,
    `Rewrite auf ${countWords(rewriteText)} Wörter im Zielkorridor stabilisiert.`
  ];
}

function sanitizeSceneStateExtraction(
  packet: SceneContextPacket,
  payload: StateExtractionPayload
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
      rewriteNotes: payload.rewriteNotes,
      extractedState: {
        ...payload.extractedState,
        newCanonFacts: dedupeStrings(filteredCanonFacts).slice(0, EXTRACT_ARRAY_MAX_ITEMS),
        characterStateUpdates: dedupeStrings(filteredCharacterUpdates).slice(0, EXTRACT_ARRAY_MAX_ITEMS),
        openThreadsCreated: dedupeStrings(filteredOpenThreadsCreated).slice(0, EXTRACT_ARRAY_MAX_ITEMS),
        foreshadowingAdded: dedupeStrings(filteredForeshadowing).slice(0, EXTRACT_ARRAY_MAX_ITEMS),
        continuityRisks: dedupeStrings(
          payload.extractedState.continuityRisks.concat(movedRisks.slice(0, 3))
        ).slice(0, EXTRACT_ARRAY_MAX_ITEMS)
      }
    },
    notes: reviewNotes
  };
}

function mergeContinuityAudit(
  extractedState: DraftExtractionState,
  audit: ContinuityAuditPayload
): DraftExtractionState {
  return {
    ...extractedState,
    continuityRisks: dedupeStrings(extractedState.continuityRisks.concat(audit.continuityRisks)).slice(0, 6),
    styleDriftNotes: dedupeStrings(extractedState.styleDriftNotes.concat(audit.styleDriftNotes)).slice(0, 6)
  };
}

function sanitizeQualityEval(
  payload: QualityEvalPayload,
  options: DraftGenerationOptions,
  actualWords: number
): QualityEvalPayload {
  return {
    wordTargetMin: options.targetSceneWordsMin,
    wordTargetMax: options.targetSceneWordsMax,
    wordActual: actualWords,
    hookScore: clampNumber(payload.hookScore, 0, 10),
    tensionScore: clampNumber(payload.tensionScore, 0, 10),
    dialogueScore: clampNumber(payload.dialogueScore, 0, 10),
    specificityScore: clampNumber(payload.specificityScore, 0, 10),
    germanCleanlinessScore: clampNumber(payload.germanCleanlinessScore, 0, 10),
    continuityScore: clampNumber(payload.continuityScore, 0, 10),
    marketFitScore: clampNumber(payload.marketFitScore, 0, 10),
    povDisciplineScore: clampNumber(payload.povDisciplineScore, 0, 10),
    readabilityScore: clampNumber(payload.readabilityScore, 0, 10),
    issues: dedupeStrings(payload.issues).slice(0, 8)
  };
}

function createFallbackQualityEval(
  options: DraftGenerationOptions,
  actualWords: number
): QualityEvalPayload {
  return {
    wordTargetMin: options.targetSceneWordsMin,
    wordTargetMax: options.targetSceneWordsMax,
    wordActual: actualWords,
    hookScore: 0,
    tensionScore: 0,
    dialogueScore: 0,
    specificityScore: 0,
    germanCleanlinessScore: 0,
    continuityScore: 0,
    marketFitScore: 0,
    povDisciplineScore: 0,
    readabilityScore: 0,
    issues: []
  };
}

function computeQualityScore(payload: QualityEvalPayload) {
  const total =
    payload.hookScore +
    payload.tensionScore +
    payload.dialogueScore +
    payload.specificityScore +
    payload.germanCleanlinessScore +
    payload.continuityScore +
    payload.marketFitScore +
    payload.povDisciplineScore +
    payload.readabilityScore;

  return Math.round((total / 9) * 10) / 10;
}

function buildQualityEvalNotes(payload: QualityEvalPayload, qualityScore: number) {
  const notes = [`Quality-Score ${qualityScore}/10 bei ${payload.wordActual} Wörtern.`];

  if (payload.issues.length) {
    return notes.concat(payload.issues.slice(0, 3));
  }

  return notes.concat(["Keine offenen Eval-Issues."]);
}

function sanitizeLiteraryFriction(
  payload: LiteraryFrictionPayload,
  sourceText: string
): LiteraryFrictionReport {
  const sanitizedReport: LiteraryFrictionReport = {
    protect: dedupeStrings(payload.protect).slice(0, 8),
    cutCandidates: dedupeStrings(payload.cutCandidates).slice(0, 8),
    overExplanation: dedupeStrings(payload.overExplanation).slice(0, 8),
    patternWarnings: dedupeStrings(payload.patternWarnings).slice(0, 8),
    abstractionFlags: dedupeStrings(payload.abstractionFlags).slice(0, 8),
    endingAssessment: truncateText(payload.endingAssessment.trim(), 400),
    microEdits: dedupeStrings(payload.microEdits).slice(0, 8),
    needsRevision: payload.needsRevision,
    revisedText: payload.revisedText ? sanitizeSceneText(payload.revisedText) : null,
    scores: {
      imageStrength: clampNumber(payload.scores.imageStrength, 1, 5),
      bodyTruth: clampNumber(payload.scores.bodyTruth, 1, 5),
      ambiguity: clampNumber(payload.scores.ambiguity, 1, 5),
      antiExplanation: clampNumber(payload.scores.antiExplanation, 1, 5),
      sentenceVariety: clampNumber(payload.scores.sentenceVariety, 1, 5),
      endingStrength: clampNumber(payload.scores.endingStrength, 1, 5),
      antiSmoothness: clampNumber(payload.scores.antiSmoothness, 1, 5),
      voiceSpecificity: clampNumber(payload.scores.voiceSpecificity, 1, 5)
    }
  };
  const revisedText = sanitizedReport.revisedText;

  if (!sanitizedReport.needsRevision || !revisedText) {
    return {
      ...sanitizedReport,
      revisedText: null
    };
  }

  const originalWords = Math.max(1, countWords(sourceText));
  const revisedWords = countWords(revisedText);
  const deltaRatio = Math.abs(revisedWords - originalWords) / originalWords;

  if (!revisedText.trim() || deltaRatio > 0.1) {
    return {
      ...sanitizedReport,
      needsRevision: false,
      revisedText: null,
      microEdits: dedupeStrings(
        sanitizedReport.microEdits.concat(["Vorgeschlagene Revision überschritt den 10%-Rahmen und wurde verworfen."])
      ).slice(0, 8)
    };
  }

  return sanitizedReport;
}

function buildLiteraryFrictionNotes(report: LiteraryFrictionReport) {
  const notes = [
    `Friction-Scores: Bild ${report.scores.imageStrength}/5 · Anti-Erklärung ${report.scores.antiExplanation}/5 · Schluss ${report.scores.endingStrength}/5.`,
    report.endingAssessment || "Kein separates Schluss-Assessment."
  ];

  if (report.microEdits.length) {
    return notes.concat(report.microEdits.slice(0, 2));
  }

  return notes;
}

function buildLiteraryFrictionWarnings(report: LiteraryFrictionReport) {
  const scoreValues = Object.values(report.scores);
  const lowScoreCount = scoreValues.filter(function (score) {
    return score < 4;
  }).length;
  const warnings: string[] = [];

  if (lowScoreCount > 2) {
    warnings.push("Friction-Warnung: mehr als zwei Scores liegen unter 4.")
  }

  if (report.scores.antiExplanation < 4) {
    warnings.push("Friction-Warnung: Anti-Erklärung unter 4.")
  }

  if (report.scores.endingStrength < 4) {
    warnings.push("Friction-Warnung: Schlusskraft unter 4.")
  }

  if (report.scores.sentenceVariety < 3) {
    warnings.push("Friction-Warnung: Satzvariation unter 3.")
  }

  return warnings.concat(report.overExplanation.slice(0, 2)).slice(0, 8)
}

function computeLiteraryFrictionScore(report: LiteraryFrictionReport) {
  const total = Object.values(report.scores).reduce(function (sum, score) {
    return sum + score;
  }, 0);

  return Math.round((total / 8) * 2 * 10) / 10;
}

function buildExtractionNotes(rewriteNotes: string[], reviewNotes: string[]) {
  const notes = rewriteNotes.slice(0, 2).concat(reviewNotes);
  return notes.length ? notes : ["State-Extraktion abgeschlossen."];
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

function buildPacketEvidenceTerms(packet: SceneContextPacket) {
  return new Set(
    extractEvidenceTerms(
      [
        packet.dynamicContext.sceneTitle,
        packet.dynamicContext.sceneSummary,
        packet.dynamicContext.sceneExcerpt
      ]
        .concat(packet.dynamicContext.sceneHeaderHints)
        .concat(packet.dynamicContext.sceneHardConstraints)
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

function combineWarnings(values: string[]) {
  return dedupeStrings(values).join(" | ") || undefined;
}

function sanitizeSceneText(value: string) {
  return value
    .trim()
    .replace(/^```(?:text|markdown)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function requestAnthropicStructuredFallback<T>(
  params: {
    client: Anthropic;
    stageName: AnthropicStructuredStageName;
    modelName: string;
    maxTokens: number;
    schema: z.ZodType<T>;
    systemBlocks: Anthropic.TextBlockParam[];
    userPrompt: string;
  },
  startedAt: number,
  initialError: unknown
) {
  const fallbackMessage = await params.client.messages.create({
    model: params.modelName,
    max_tokens: params.maxTokens,
    system: params.systemBlocks,
    messages: [
      {
        role: "user",
        content: buildAnthropicStructuredJsonPrompt(params.stageName, params.userPrompt)
      }
    ]
  }, buildAnthropicCacheRequestOptions());
  const fallbackText = sanitizeSceneText(collectAnthropicText(fallbackMessage));

  try {
    return {
      payload: parseAnthropicStructuredPayload(params.stageName, params.schema, fallbackText),
      metrics: {
        ...buildAnthropicMetrics(fallbackMessage, params.modelName, startedAt),
        attemptCount: 2,
        repairCount: 1
      }
    };
  } catch (fallbackError) {
    const retryMessage = await params.client.messages.create({
      model: params.modelName,
      max_tokens: params.maxTokens,
      system: params.systemBlocks,
      messages: [
        {
          role: "user",
          content: buildAnthropicStructuredRetryPrompt(
            params.stageName,
            params.userPrompt,
            initialError instanceof Error ? initialError.message : String(initialError),
            fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
          )
        }
      ]
    }, buildAnthropicCacheRequestOptions());
    const retryText = sanitizeSceneText(collectAnthropicText(retryMessage));

    return {
      payload: parseAnthropicStructuredPayload(params.stageName, params.schema, retryText),
      metrics: {
        ...buildAnthropicMetrics(retryMessage, params.modelName, startedAt),
        attemptCount: 3,
        repairCount: 2
      }
    };
  }
}

function parseAnthropicStructuredPayload<T>(
  stageName: AnthropicStructuredStageName,
  schema: z.ZodType<T>,
  rawText: string
) {
  const jsonText = extractFirstJsonObject(rawText);
  const parsed = JSON.parse(jsonText);
  const repaired = repairAnthropicStructuredPayload(stageName, parsed);
  return schema.parse(repaired);
}

function buildAnthropicStructuredJsonPrompt(
  stageName: AnthropicStructuredStageName,
  originalPrompt: string
) {
  return [
    originalPrompt,
    "",
    "FORMAT REQUIREMENTS:",
    "- Return exactly one valid JSON object.",
    "- Use double-quoted property names and string values.",
    "- No markdown fences.",
    "- No prose before or after the JSON object.",
    "- Keep all string values compact.",
    describeAnthropicStructuredStageDiscipline(stageName),
    `- Contract: ${describeAnthropicStructuredStageContract(stageName)}`
  ].join("\n");
}

function buildAnthropicStructuredRetryPrompt(
  stageName: AnthropicStructuredStageName,
  originalPrompt: string,
  initialError: string,
  latestError: string
) {
  return [
    originalPrompt,
    "",
    "RETRY INSTRUCTIONS:",
    "Generate a fresh JSON object from scratch.",
    "Return JSON only.",
    "Use double-quoted property names and string values.",
    "Do not add markdown fences or commentary.",
    "Do not reuse or repair prior output.",
    "Prefer fewer items, shorter strings, and empty arrays over speculative detail.",
    describeAnthropicStructuredStageDiscipline(stageName),
    `Contract: ${describeAnthropicStructuredStageContract(stageName)}`,
    `Initial error: ${truncateText(initialError, 600)}`,
    `Latest error: ${truncateText(latestError, 600)}`,
  ].join("\n");
}

function describeAnthropicStructuredStageDiscipline(stageName: AnthropicStructuredStageName) {
  if (stageName === "extract") {
    return `- Extract discipline: rewriteNotes 1-${EXTRACT_REWRITE_NOTES_MAX_ITEMS}; every extractedState list 0-${EXTRACT_ARRAY_MAX_ITEMS}; every string <= ${EXTRACT_STRING_MAX_LENGTH} chars; plain strings only.`;
  }

  if (stageName === "literary_friction") {
    return "- Literary-friction discipline: keep arrays compact, scores 1-5, revisedText optional, and revise no more than 10 percent.";
  }

  return "- Keep the object compact and schema-first.";
}

function describeAnthropicStructuredStageContract(stageName: AnthropicStructuredStageName) {
  if (stageName === "beat_plan") {
    return '{"beats":[{"label":"string","purpose":"string","targetWords":123,"mustLand":"string"}]}';
  }

  if (stageName === "extract") {
    return '{"rewriteNotes":["string"],"extractedState":{"newCanonFacts":[],"characterStateUpdates":[],"openThreadsCreated":[],"openThreadsResolved":[],"foreshadowingAdded":[],"continuityRisks":[],"styleDriftNotes":[]}}';
  }

  if (stageName === "continuity") {
    return '{"continuityRisks":["string"],"styleDriftNotes":["string"]}';
  }

  if (stageName === "literary_friction") {
    return '{"protect":["string"],"cutCandidates":["string"],"overExplanation":["string"],"patternWarnings":["string"],"abstractionFlags":["string"],"endingAssessment":"string","microEdits":["string"],"needsRevision":false,"revisedText":null,"scores":{"imageStrength":4,"bodyTruth":4,"ambiguity":4,"antiExplanation":4,"sentenceVariety":4,"endingStrength":4,"antiSmoothness":4,"voiceSpecificity":4}}';
  }

  return '{"wordTargetMin":0,"wordTargetMax":0,"wordActual":0,"hookScore":0,"tensionScore":0,"dialogueScore":0,"specificityScore":0,"germanCleanlinessScore":0,"continuityScore":0,"marketFitScore":0,"povDisciplineScore":0,"readabilityScore":0,"issues":["string"]}';
}

function repairAnthropicStructuredPayload(stageName: AnthropicStructuredStageName, payload: unknown) {
  if (stageName === "beat_plan") {
    return repairBeatPlanPayload(payload);
  }

  if (stageName === "extract") {
    return repairStateExtractionPayload(payload);
  }

  if (stageName === "continuity") {
    return repairContinuityAuditPayload(payload);
  }

  if (stageName === "literary_friction") {
    return repairLiteraryFrictionPayload(payload);
  }

  return repairQualityEvalPayload(payload);
}

function repairBeatPlanPayload(payload: unknown): BeatPlanPayload {
  const source = isRecord(payload) && Array.isArray(payload.beats) ? payload.beats : [];

  return {
    beats: source.slice(0, 6).map(function (beat, index) {
      const entry = isRecord(beat) ? beat : {};

      return {
        label: truncateText(coerceString(entry.label, `Beat ${index + 1}`), 120),
        purpose: truncateText(coerceString(entry.purpose, `Beat ${index + 1} haelt den Szenendruck.`), 600),
        targetWords: clampNumber(coerceInteger(entry.targetWords, 120), 50, 1200),
        mustLand: truncateText(coerceString(entry.mustLand, "Die Szene kippt sichtbar."), 320)
      };
    })
  };
}

function repairStateExtractionPayload(payload: unknown): StateExtractionPayload {
  const root = isRecord(payload) ? payload : {};
  const extractedState = isRecord(root.extractedState) ? root.extractedState : {};

  return {
    rewriteNotes: coerceStringArray(root.rewriteNotes, EXTRACT_REWRITE_NOTES_MAX_ITEMS, [
      "Rewrite-Fassung automatisch extrahiert und konservativ normalisiert."
    ], EXTRACT_STRING_MAX_LENGTH).slice(0, EXTRACT_REWRITE_NOTES_MAX_ITEMS),
    extractedState: {
      newCanonFacts: coerceStringArray(
        extractedState.newCanonFacts,
        EXTRACT_ARRAY_MAX_ITEMS,
        [],
        EXTRACT_STRING_MAX_LENGTH
      ),
      characterStateUpdates: coerceStringArray(
        extractedState.characterStateUpdates,
        EXTRACT_ARRAY_MAX_ITEMS,
        [],
        EXTRACT_STRING_MAX_LENGTH
      ),
      openThreadsCreated: coerceStringArray(
        extractedState.openThreadsCreated,
        EXTRACT_ARRAY_MAX_ITEMS,
        [],
        EXTRACT_STRING_MAX_LENGTH
      ),
      openThreadsResolved: coerceStringArray(
        extractedState.openThreadsResolved,
        EXTRACT_ARRAY_MAX_ITEMS,
        [],
        EXTRACT_STRING_MAX_LENGTH
      ),
      foreshadowingAdded: coerceStringArray(
        extractedState.foreshadowingAdded,
        EXTRACT_ARRAY_MAX_ITEMS,
        [],
        EXTRACT_STRING_MAX_LENGTH
      ),
      continuityRisks: coerceStringArray(
        extractedState.continuityRisks,
        EXTRACT_ARRAY_MAX_ITEMS,
        [],
        EXTRACT_STRING_MAX_LENGTH
      ),
      styleDriftNotes: coerceStringArray(
        extractedState.styleDriftNotes,
        EXTRACT_ARRAY_MAX_ITEMS,
        [],
        EXTRACT_STRING_MAX_LENGTH
      )
    }
  };
}

function repairContinuityAuditPayload(payload: unknown): ContinuityAuditPayload {
  const root = isRecord(payload) ? payload : {};

  return {
    continuityRisks: coerceStringArray(root.continuityRisks, 6),
    styleDriftNotes: coerceStringArray(root.styleDriftNotes, 6)
  };
}

function repairQualityEvalPayload(payload: unknown): QualityEvalPayload {
  const root = isRecord(payload) ? payload : {};

  return {
    wordTargetMin: coerceInteger(root.wordTargetMin, 0),
    wordTargetMax: coerceInteger(root.wordTargetMax, 0),
    wordActual: coerceInteger(root.wordActual, 0),
    hookScore: clampNumber(coerceInteger(root.hookScore, 0), 0, 10),
    tensionScore: clampNumber(coerceInteger(root.tensionScore, 0), 0, 10),
    dialogueScore: clampNumber(coerceInteger(root.dialogueScore, 0), 0, 10),
    specificityScore: clampNumber(coerceInteger(root.specificityScore, 0), 0, 10),
    germanCleanlinessScore: clampNumber(coerceInteger(root.germanCleanlinessScore, 0), 0, 10),
    continuityScore: clampNumber(coerceInteger(root.continuityScore, 0), 0, 10),
    marketFitScore: clampNumber(coerceInteger(root.marketFitScore, 0), 0, 10),
    povDisciplineScore: clampNumber(coerceInteger(root.povDisciplineScore, 0), 0, 10),
    readabilityScore: clampNumber(coerceInteger(root.readabilityScore, 0), 0, 10),
    issues: coerceStringArray(root.issues, 8)
  };
}

function repairLiteraryFrictionPayload(payload: unknown): LiteraryFrictionPayload {
  const root = isRecord(payload) ? payload : {};
  const scores = isRecord(root.scores) ? root.scores : {};

  return {
    protect: coerceStringArray(root.protect, 8),
    cutCandidates: coerceStringArray(root.cutCandidates, 8),
    overExplanation: coerceStringArray(root.overExplanation, 8),
    patternWarnings: coerceStringArray(root.patternWarnings, 8),
    abstractionFlags: coerceStringArray(root.abstractionFlags, 8),
    endingAssessment: truncateText(coerceString(root.endingAssessment, "Kein separates Schluss-Assessment."), 400),
    microEdits: coerceStringArray(root.microEdits, 8),
    needsRevision: typeof root.needsRevision === "boolean" ? root.needsRevision : false,
    revisedText:
      typeof root.revisedText === "string" && root.revisedText.trim() ? root.revisedText : null,
    scores: {
      imageStrength: clampNumber(coerceInteger(scores.imageStrength, 3), 1, 5),
      bodyTruth: clampNumber(coerceInteger(scores.bodyTruth, 3), 1, 5),
      ambiguity: clampNumber(coerceInteger(scores.ambiguity, 3), 1, 5),
      antiExplanation: clampNumber(coerceInteger(scores.antiExplanation, 3), 1, 5),
      sentenceVariety: clampNumber(coerceInteger(scores.sentenceVariety, 3), 1, 5),
      endingStrength: clampNumber(coerceInteger(scores.endingStrength, 3), 1, 5),
      antiSmoothness: clampNumber(coerceInteger(scores.antiSmoothness, 3), 1, 5),
      voiceSpecificity: clampNumber(coerceInteger(scores.voiceSpecificity, 3), 1, 5)
    }
  };
}

function buildFallbackStateExtraction(
  packet: SceneContextPacket,
  rewriteText: string,
  beatPlan: BeatPlanPayload
): StateExtractionPayload["extractedState"] extends infer _Unused
  ? {
      rewriteNotes: string[];
      extractedState: Omit<DraftExtractionState, "memorySync">;
    }
  : never {
  return {
    rewriteNotes: [
      "Structured Extractor fiel aus; konservativer Fallback aus Rewrite und Packet verwendet.",
      `Rewrite auf ${countWords(rewriteText)} Wörter stabil gehalten.`
    ],
    extractedState: {
      newCanonFacts: [],
      characterStateUpdates: [],
      openThreadsCreated: [],
      openThreadsResolved: [],
      foreshadowingAdded: [],
      continuityRisks: [
        "Structured Extractor fiel aus; neue Canon-Fakten und Thread-Aenderungen manuell pruefen."
      ],
      styleDriftNotes: [
        `Fallback-Extraktion aktiv; Beat-Folge ${beatPlan.beats[0]?.label || "Beat 1"} bis ${beatPlan.beats[beatPlan.beats.length - 1]?.label || "Finale"} nur konservativ ausgewertet.`
      ]
    }
  };
}

function extractFirstJsonObject(value: string) {
  const trimmed = value.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fencedMatch?.[1]?.trim() || trimmed;
  const start = source.indexOf("{");

  if (start === -1) {
    throw new Error("No JSON object found in Anthropic output.");
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }

      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  throw new Error("No complete JSON object found in Anthropic output.");
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

function truncateText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return normalized.slice(0, Math.max(0, maxLength - 3)).trimEnd() + "...";
}

function coerceString(value: unknown, fallback: string) {
  return typeof value === "string" ? value.trim() || fallback : fallback;
}

function coerceInteger(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value);
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function coerceStringArray(
  value: unknown,
  maxItems: number,
  fallback: string[] = [],
  maxLength = 240
) {
  if (!Array.isArray(value)) {
    return fallback.slice(0, maxItems);
  }

  return value
    .map(function (entry) {
      return typeof entry === "string" ? truncateText(entry, maxLength) : "";
    })
    .filter(Boolean)
    .slice(0, maxItems);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeAnthropicModelName(value: string) {
  const normalized = value.trim();

  if (normalized === "claude-3-5-haiku-20241022" || normalized === "claude-haiku-4-5") {
    return "claude-haiku-4-5-20251001";
  }

  return normalized;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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

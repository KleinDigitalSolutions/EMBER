import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import {
  buildSceneContextPacket,
  createLocalDraftJob,
  type SceneContextPacket
} from "@/lib/book-engine";
import type { BookDraftJob, StoryDocument } from "@/lib/story-schema";

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
    continuityRisks: z.array(z.string()).max(6),
    styleDriftNotes: z.array(z.string()).max(6)
  })
});

type DraftJobPayload = z.infer<typeof draftJobSchema>;
export type BookJobProvider = "auto" | "openai" | "anthropic" | "local";
export type BookJobExecution = {
  provider: Exclude<BookJobProvider, "auto">;
  mode: "remote" | "local_fallback";
  job: BookDraftJob;
  warning?: string;
};

export async function generateBookDraftJob(params: {
  story: StoryDocument;
  sceneId: string;
  provider?: BookJobProvider;
}): Promise<BookJobExecution> {
  const provider = params.provider ?? "auto";
  const packet = buildSceneContextPacket(params.story, params.sceneId);

  if (!packet) {
    throw new Error("Scene context could not be built.");
  }

  if (provider === "local") {
    return createLocalExecution(params.story, params.sceneId, "Lokaler Provider explizit gewaehlt.");
  }

  const remoteProvider = resolveRemoteProvider(provider);

  if (!remoteProvider) {
    return createLocalExecution(
      params.story,
      params.sceneId,
      "Kein OPENAI_API_KEY oder ANTHROPIC_API_KEY gesetzt; lokaler Fallback verwendet."
    );
  }

  try {
    const payload =
      remoteProvider === "openai"
        ? await generateWithOpenAI(packet)
        : await generateWithAnthropic(packet);

    return {
      provider: remoteProvider,
      mode: "remote",
      job: hydrateDraftJob(params.story, params.sceneId, packet, payload)
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown provider error.";

    return createLocalExecution(
      params.story,
      params.sceneId,
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

async function generateWithOpenAI(packet: SceneContextPacket) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await client.responses.parse({
    model: process.env.OPENAI_BOOK_MODEL || "gpt-5.4",
    reasoning: { effort: "medium" },
    input: [
      {
        role: "system",
        content: buildSystemPrompt(packet)
      },
      {
        role: "user",
        content: buildUserPrompt(packet)
      }
    ],
    text: {
      format: zodTextFormat(draftJobSchema, "ember_book_job")
    }
  });

  if (!response.output_parsed) {
    throw new Error("OpenAI returned no parsed output.");
  }

  return response.output_parsed;
}

async function generateWithAnthropic(packet: SceneContextPacket) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const message = await client.messages.parse({
    model: process.env.ANTHROPIC_BOOK_MODEL || "claude-sonnet-4-5",
    max_tokens: 2200,
    system: buildSystemPrompt(packet),
    messages: [
      {
        role: "user",
        content: buildUserPrompt(packet)
      }
    ],
    output_config: {
      format: zodOutputFormat(draftJobSchema)
    }
  });

  if (!message.parsed_output) {
    throw new Error("Anthropic returned no parsed output.");
  }

  return message.parsed_output;
}

function hydrateDraftJob(
  story: StoryDocument,
  sceneId: string,
  packet: SceneContextPacket,
  payload: DraftJobPayload
): BookDraftJob {
  const now = new Date().toISOString();

  return {
    id: createLocalId("draft_job"),
    sceneId,
    sceneTitle: packet.dynamicContext.sceneTitle,
    createdAt: now,
    updatedAt: now,
    status: "ready",
    outline: payload.outline,
    draftText: payload.draftText,
    rewriteText: payload.rewriteText,
    rewriteNotes: payload.rewriteNotes,
    extractedState: payload.extractedState,
    contextSnapshot: {
      chapterTitle: packet.dynamicContext.chapterTitle,
      sceneSummary: packet.dynamicContext.sceneSummary,
      relevantCodexTitles: packet.dynamicContext.relevantCodex.map(function (entry) {
        return entry.title;
      }),
      activeThreadLabels: packet.dynamicContext.activeThreads.map(function (thread) {
        return thread.label;
      })
    }
  };
}

function createLocalExecution(
  story: StoryDocument,
  sceneId: string,
  warning: string
): BookJobExecution {
  const result = createLocalDraftJob(story, sceneId);

  if (!result) {
    throw new Error("Local fallback could not create a draft job.");
  }

  return {
    provider: "local",
    mode: "local_fallback",
    job: result.job,
    warning
  };
}

function buildSystemPrompt(packet: SceneContextPacket) {
  return [
    "You are the drafting engine for EMBER Book Studio.",
    "Return only structured output matching the requested schema.",
    "Do not imitate living authors or copyrighted prose.",
    "Honor the canon, preserve tone consistency, and surface continuity risks explicitly.",
    "Write commercially readable genre prose, but keep it grounded in the supplied scene context.",
    `Writer constitution: ${packet.stablePrefix.writerConstitution.join(" | ")}`
  ].join("\n");
}

function buildUserPrompt(packet: SceneContextPacket) {
  return [
    "Create one drafting job for the selected scene.",
    `Premise: ${packet.stablePrefix.premise}`,
    `Reader promise: ${packet.stablePrefix.readerPromise}`,
    `Ending promise: ${packet.stablePrefix.endingPromise}`,
    `Thematic core: ${packet.stablePrefix.thematicCore}`,
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
    `Active threads: ${packet.dynamicContext.activeThreads
      .map(function (thread) {
        return `${thread.label}: ${thread.detail}`;
      })
      .join(" || ")}`,
    "Produce:",
    "- outline beats",
    "- draftText as a scene draft",
    "- rewriteText as the cleaner revised version",
    "- rewriteNotes",
    "- extractedState with canon facts, character updates, open threads, continuity risks, and style drift notes"
  ].join("\n");
}

function createLocalId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

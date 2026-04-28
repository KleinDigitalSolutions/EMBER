import assert from "node:assert/strict";
import Module from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  approveBookStateDiff,
  rejectBookStateDiff,
  validateBookStateDiff
} from "@/lib/book-state-validator";
import {
  appendActToStory,
  appendSceneToChapter,
  createEmptyStoryDocument,
  normalizeBookStateDiff,
  normalizeBookStateDiffStatus,
  type BookStateDiff,
  type StoryDocument
} from "@/lib/story-schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = Module.createRequire(import.meta.url);
type ModuleWithResolver = typeof Module & {
  _resolveFilename: (
    request: string,
    parent: unknown,
    isMain: boolean,
    options: unknown
  ) => string;
};
const moduleWithResolver = Module as ModuleWithResolver;
const originalResolveFilename = moduleWithResolver._resolveFilename;

moduleWithResolver._resolveFilename = function (request, parent, isMain, options) {
  if (request === "server-only") {
    return path.join(__dirname, "server-only-stub.cjs");
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

const baseDiff = (sceneId: string): BookStateDiff => ({
  sceneId,
  objectChanges: [],
  knowledgeChanges: [],
  promiseUpdates: [],
  characterStateUpdates: [],
  relationshipNotes: [],
  proposedCanonFacts: [],
  sceneLocalDetails: [],
  conflicts: [],
  requiresHumanReview: false
});

function createStory() {
  const first = appendActToStory(
    createEmptyStoryDocument("story_state_diff_test", "workspace_state_diff_test", "State Diff Test")
  );
  const second = appendSceneToChapter(first.story, first.chapterId);
  const story = second.story;

  story.acts[0].title = "Akt 1";
  story.acts[0].chapters[0].title = "Kapitel 1";
  story.acts[0].chapters[0].scenes[0].title = "Setup";
  story.acts[0].chapters[0].scenes[0].summary = "Mara findet den gelben Umschlag.";
  story.acts[0].chapters[0].scenes[1].title = "Reveal";
  story.acts[0].chapters[0].scenes[1].summary = "Der Umschlag wird erklaert.";

  story.book.memory.objectLedger = [
    {
      id: "object_state_1",
      objectEntryId: "object_entry_1",
      objectName: "gelber Umschlag",
      currentHolderCharacterName: "Mara",
      currentLocationName: null,
      condition: "intakt",
      knownByCharacterNames: ["Mara"],
      lastSeenSceneId: story.acts[0].chapters[0].scenes[0].id,
      updatedAt: "2026-04-28T00:00:00.000Z"
    }
  ];

  return story;
}

function assertConflict(result: ReturnType<typeof validateBookStateDiff>, expected: string) {
  assert.equal(result.valid, false);
  assert.equal(result.requiresHumanReview, true);
  assert.ok(
    result.conflicts.some(function (conflict) {
      return conflict.includes(expected);
    }),
    `Expected conflict containing "${expected}", got ${JSON.stringify(result.conflicts)}`
  );
}

async function main() {
{
  const missingDiff = normalizeBookStateDiff(null, "scene_legacy");
  const legacyStatus = missingDiff
    ? normalizeBookStateDiffStatus("approved", "pending")
    : "none";

  assert.equal(missingDiff, null);
  assert.equal(legacyStatus, "none");
}

{
  const story = createStory();
  const sceneId = story.acts[0].chapters[0].scenes[0].id;
  const result = validateBookStateDiff(story, {
    ...baseDiff(sceneId),
    objectChanges: [
      {
        objectName: "gelber Umschlag",
        toHolderCharacterName: "Mara",
        toLocationName: "Kueche",
        evidenceQuote: "Mara haelt den Umschlag in der Kueche.",
        confidence: 0.9
      }
    ]
  });

  assertConflict(result, "gleichzeitig Holder und Location");
}

{
  const story = createStory();
  const sceneId = story.acts[0].chapters[0].scenes[0].id;
  const result = validateBookStateDiff(story, {
    ...baseDiff(sceneId),
    objectChanges: [
      {
        objectName: "gelber Umschlag",
        fromHolderCharacterName: "Eva",
        toLocationName: "Kueche",
        evidenceQuote: "Der Umschlag liegt auf dem Tisch.",
        confidence: 0.8
      }
    ]
  });

  assertConflict(result, "fromHolder passt nicht");
}

{
  const story = createStory();
  const firstSceneId = story.acts[0].chapters[0].scenes[0].id;
  const revealSceneId = story.acts[0].chapters[0].scenes[1].id;
  const result = validateBookStateDiff(story, {
    ...baseDiff(firstSceneId),
    knowledgeChanges: [
      {
        id: "knowledge_1",
        proposition: "Mara weiss, wer Mila abgeholt hat.",
        truthStatus: "true",
        knownByCharacterNames: ["Mara"],
        believedByCharacterNames: ["Mara"],
        hiddenFromCharacterNames: [],
        readerState: "confirmed",
        sourceSceneId: firstSceneId,
        revealSceneId
      }
    ]
  });

  assertConflict(result, "vor revealSceneId");
}

{
  const story = createStory();
  const sceneId = story.acts[0].chapters[0].scenes[0].id;
  const result = validateBookStateDiff(story, {
    ...baseDiff(sceneId),
    promiseUpdates: [
      {
        id: "promise_1",
        label: "Wer hat Mila abgeholt?",
        kind: "mystery",
        status: "paid",
        setupSceneId: sceneId,
        reinforcementSceneIds: [],
        plannedPayoffSceneId: null,
        actualPayoffSceneId: sceneId,
        logicalPayoff: "Eva hat es dokumentiert.",
        emotionalPayoff: ""
      }
    ]
  });

  assertConflict(result, "ohne logicalPayoff und emotionalPayoff");
}

{
  const story = createStory();
  const sceneId = story.acts[0].chapters[0].scenes[0].id;
  const jobId = "job_state_diff_test";
  const storyWithJob: StoryDocument = {
    ...story,
    book: {
      ...story.book,
      draftEngine: {
        ...story.book.draftEngine,
        jobs: [
          {
            id: jobId,
            sceneId,
            sceneTitle: "Setup",
            createdAt: "2026-04-28T00:00:00.000Z",
            updatedAt: "2026-04-28T00:00:00.000Z",
            provider: "local",
            mode: "local_fallback",
            modelName: null,
            status: "ready",
            acceptedAt: null,
            outline: [],
            draftText: "",
            rewriteText: "",
            rewriteNotes: [],
            extractedState: {
              newCanonFacts: [],
              characterStateUpdates: [],
              openThreadsCreated: [],
              openThreadsResolved: [],
              foreshadowingAdded: [],
              continuityRisks: [],
              styleDriftNotes: [],
              memorySync: {
                items: []
              }
            },
            stateDiff: {
              ...baseDiff(sceneId),
              proposedCanonFacts: ["Umschlag: Mara nimmt den Umschlag an sich."],
              sceneLocalDetails: ["Die Tasse steht links neben der Spuele."]
            },
            stateDiffStatus: "pending",
            stages: {
              context: createStage(),
              beat_plan: createStage(),
              draft: createStage(),
              rewrite: createStage(),
              length_control: createStage(),
              extract: createStage(),
              continuity: createStage(),
              quality_eval: createStage()
            },
            contextSnapshot: {
              contextPackId: null,
              memorySyncedAt: null,
              chapterTitle: "Kapitel 1",
              sceneSummary: "",
              relevantCodexTitles: [],
              relevantCharacterNames: [],
              activeThreadLabels: []
            }
          }
        ]
      }
    }
  };

  const approved = approveBookStateDiff(storyWithJob, jobId);
  const canonText = approved.book.memory.canonLedger.map(function (entry) {
    return `${entry.title}: ${entry.summary}`;
  }).join("\n");

  assert.match(canonText, /Umschlag/);
  assert.doesNotMatch(canonText, /Tasse steht links/);
}

{
  const story = createStory();
  const sceneId = story.acts[0].chapters[0].scenes[0].id;
  const jobId = "job_state_diff_reject_test";
  const storyWithJob: StoryDocument = {
    ...story,
    book: {
      ...story.book,
      memory: {
        ...story.book.memory,
        canonLedger: []
      },
      draftEngine: {
        ...story.book.draftEngine,
        jobs: [
          {
            id: jobId,
            sceneId,
            sceneTitle: "Setup",
            createdAt: "2026-04-28T00:00:00.000Z",
            updatedAt: "2026-04-28T00:00:00.000Z",
            provider: "local",
            mode: "local_fallback",
            modelName: null,
            status: "ready",
            acceptedAt: null,
            outline: [],
            draftText: "",
            rewriteText: "",
            rewriteNotes: [],
            extractedState: {
              newCanonFacts: [],
              characterStateUpdates: [],
              openThreadsCreated: [],
              openThreadsResolved: [],
              foreshadowingAdded: [],
              continuityRisks: [],
              styleDriftNotes: [],
              memorySync: {
                items: []
              }
            },
            stateDiff: {
              ...baseDiff(sceneId),
              proposedCanonFacts: ["Geheimer Beleg: Mara findet den Beleg."]
            },
            stateDiffStatus: "pending",
            stages: {
              context: createStage(),
              beat_plan: createStage(),
              draft: createStage(),
              rewrite: createStage(),
              length_control: createStage(),
              extract: createStage(),
              continuity: createStage(),
              quality_eval: createStage()
            },
            contextSnapshot: {
              contextPackId: null,
              memorySyncedAt: null,
              chapterTitle: "Kapitel 1",
              sceneSummary: "",
              relevantCodexTitles: [],
              relevantCharacterNames: [],
              activeThreadLabels: []
            }
          }
        ]
      }
    }
  };

  const rejected = rejectBookStateDiff(storyWithJob, jobId);

  assert.equal(rejected.book.memory.canonLedger.length, 0);
  assert.equal(rejected.book.draftEngine.jobs[0].stateDiffStatus, "rejected");
}

{
  const story = createStory();
  const sceneId = story.acts[0].chapters[0].scenes[0].id;
  const { generateBookDraftJob } = await import("@/lib/server/book-job-service");
  const result = await generateBookDraftJob({
    story,
    sceneId,
    provider: "local"
  });

  assert.equal(result.provider, "local");
  assert.equal(result.mode, "local_fallback");
  assert.equal(result.job.sceneId, sceneId);
  assert.equal(result.job.stateDiffStatus, "pending");
  assert.ok(result.job.stateDiff);
}

}

function createStage() {
  return {
    status: "completed" as const,
    provider: "local" as const,
    modelName: null,
    updatedAt: "2026-04-28T00:00:00.000Z",
    attemptCount: 1,
    repairCount: 0,
    durationMs: null,
    inputTokens: null,
    outputTokens: null,
    costCents: null,
    stopReason: null,
    targetWordsMin: null,
    targetWordsMax: null,
    actualWords: null,
    qualityScore: null,
    qualityIssues: [],
    notes: []
  };
}

main().then(function () {
  console.log("book-state-validator tests passed");
}).catch(function (error) {
  console.error(error);
  process.exit(1);
});

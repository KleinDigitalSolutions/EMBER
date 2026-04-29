import assert from "node:assert/strict";
import Module from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  approveBookStateDiff,
  buildStateDiffFromExtraction,
  rejectBookStateDiff,
  validateBookStateDiff
} from "@/lib/book-state-validator";
import {
  auditSceneContinuityGuards,
  buildSceneContextPacket,
  buildObjectCandidatesFromSceneCard,
  getDraftJobAcceptanceBlockers,
  type TimelineBeat
} from "@/lib/book-engine";
import {
  appendActToStory,
  appendSceneToChapter,
  createEmptyBookSceneCardDirectives,
  createEmptyStoryDocument,
  normalizeBookStateDiff,
  normalizeBookStateDiffStatus,
  type BookDraftJob,
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
  story.acts[0].chapters[0].scenes[0].summary = "Die Figur findet den silbernen Ring.";
  story.acts[0].chapters[0].scenes[1].title = "Reveal";
  story.acts[0].chapters[0].scenes[1].summary = "Der Ring wird erklaert.";

  story.book.memory.objectLedger = [
    {
      id: "object_state_1",
      objectEntryId: "object_entry_1",
      objectName: "silberner Ring",
      currentHolderCharacterName: "Lea",
      currentLocationName: null,
      condition: "intakt",
      knownByCharacterNames: ["Lea"],
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
  const sceneCard = createTestSceneCard("scene_object_hard", [
    { key: "object_anchor", value: "silberner Ring" }
  ]);
  const candidates = buildObjectCandidatesFromSceneCard(sceneCard);

  assert.deepEqual(candidates, [
    {
      objectName: "silberner Ring",
      sourceField: "object_anchor",
      hardness: "hard",
      sceneId: "scene_object_hard"
    }
  ]);
}

{
  const sceneCard = createTestSceneCard("scene_object_soft", [
    { key: "proof_object", value: "alter Mietvertrag" }
  ]);
  const candidates = buildObjectCandidatesFromSceneCard(sceneCard);

  assert.equal(candidates.length, 1);
  assert.ok(candidates.every(function (candidate) {
    return candidate.hardness === "soft";
  }));
  assert.ok(candidates.some(function (candidate) {
    return candidate.objectName === "alter Mietvertrag";
  }));
}

{
  const diff = buildStateDiffFromExtraction({
    sceneId: "scene_soft_object",
    extractedState: createExtractionState({
      newCanonFacts: ["alter Mietvertrag liegt im Safe."]
    }),
    objectCandidates: [
      {
        objectName: "alter Mietvertrag",
        sourceField: "proof_object",
        hardness: "soft",
        sceneId: "scene_soft_object"
      }
    ]
  });

  assert.equal(diff.objectChanges.length, 0);
  assert.equal(diff.requiresHumanReview, true);
  assert.match(diff.sceneLocalDetails.join("\n"), /Soft object candidate/);
}

{
  const diff = buildStateDiffFromExtraction({
    sceneId: "scene_hard_object",
    extractedState: createExtractionState({}),
    objectCandidates: [
      {
        objectName: "silberner Ring",
        sourceField: "locked_object",
        hardness: "hard",
        sceneId: "scene_hard_object"
      }
    ]
  });

  assert.equal(diff.objectChanges.length, 1);
  assert.equal(diff.objectChanges[0].objectName, "silberner Ring");
}

{
  const diff = buildStateDiffFromExtraction({
    sceneId: "scene_knowledge_note",
    extractedState: createExtractionState({}),
    sceneSoftGuidance: [
      "wissensgrenze: Die Figur weiss noch nicht, wer den Mietvertrag unterschrieben hat.",
      "information_gap: Wer hat den Mietvertrag unterschrieben?"
    ]
  });

  assert.equal(diff.knowledgeChanges.length, 0);
  assert.equal(diff.requiresHumanReview, true);
  assert.match(diff.sceneLocalDetails.join("\n"), /wissensgrenze/);
  assert.match(diff.sceneLocalDetails.join("\n"), /information_gap/);
}

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
        objectName: "silberner Ring",
        toHolderCharacterName: "Lea",
        toLocationName: "Safe",
        evidenceQuote: "Lea haelt den Ring am Safe.",
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
        objectName: "silberner Ring",
        fromHolderCharacterName: "Noah",
        toLocationName: "Safe",
        evidenceQuote: "Der Ring liegt im Safe.",
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
        proposition: "Lea weiss, wer den Mietvertrag unterschrieben hat.",
        truthStatus: "true",
        knownByCharacterNames: ["Lea"],
        believedByCharacterNames: ["Lea"],
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
        label: "Wer hat den Mietvertrag unterschrieben?",
        kind: "mystery",
        status: "paid",
        setupSceneId: sceneId,
        reinforcementSceneIds: [],
        plannedPayoffSceneId: null,
        actualPayoffSceneId: sceneId,
        logicalPayoff: "Der Notar hat es dokumentiert.",
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
              proposedCanonFacts: ["Ring: Lea nimmt den silbernen Ring an sich."],
              sceneLocalDetails: ["Die Lampe steht links neben dem Safe."]
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

  assert.match(canonText, /Ring/);
  assert.doesNotMatch(canonText, /Lampe steht links/);
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
              proposedCanonFacts: ["Geheimer Beleg: Die Figur findet den Beleg."]
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
  const sceneCard = createTestSceneCard(sceneId, [
    { key: "material", value: "Liste, Rucksack, Uhr, Signal, Tuer, Schild" },
    { key: "forbidden_public_term", value: "Veridium | X7" },
    { key: "fixed_visual_text", value: "AUTHORIZED PERSONNEL ONLY" },
    { key: "sequence_anchor", value: "Bus -> Ankunft -> Gruppeneinteilung" }
  ]);
  sceneCard.directives = {
    ...sceneCard.directives,
    opening: "Es gibt Schulausfluege, die man vergisst. Und es gibt Schulausfluege, die alles veraendern.",
    closingLine: "Niemand ging zurueck."
  };
  const storyWithAnchors: StoryDocument = {
    ...story,
    book: {
      ...story.book,
      memory: {
        ...story.book.memory,
        sceneCards: [sceneCard],
        lastSyncedAt: "2026-04-28T00:00:00.000Z"
      }
    }
  };
  const packet = buildSceneContextPacket(storyWithAnchors, sceneId);

  assert.ok(packet);
  assert.ok(packet.dynamicContext.sceneHardConstraints.some(function (constraint) {
    return constraint.startsWith("Fixer Einstiegssatz:");
  }));
  assert.ok(packet.dynamicContext.sceneSoftGuidance.some(function (guidance) {
    return guidance.includes("Concrete material:");
  }));

  const badDraft = [
    "Im Bus roch es nach Plastik. Frau Joelle hob ihr Tablet. Frau Joelle laechelte.",
    "Veridium stand auf einem Display.",
    "Am Ende blieb ein Schild mit Wartung. Kein Zutritt."
  ].join("\n\n");
  const issues = auditSceneContinuityGuards(packet, badDraft);

  assert.ok(issues.some(function (issue) {
    return issue.includes("Fixer Einstiegssatz");
  }), issues.join("\n"));
  assert.ok(issues.some(function (issue) {
    return issue.includes("Fixer Schlussanker");
  }), issues.join("\n"));
  assert.ok(issues.some(function (issue) {
    return issue.includes("Fixer Textanker");
  }), issues.join("\n"));
  assert.ok(issues.some(function (issue) {
    return issue.includes("Verbotener Szenenbegriff");
  }), issues.join("\n"));
  assert.ok(issues.some(function (issue) {
    return issue.includes("Neuer Eigenname");
  }), issues.join("\n"));

  const storyWithJob: StoryDocument = {
    ...storyWithAnchors,
    book: {
      ...storyWithAnchors.book,
      draftEngine: {
        ...storyWithAnchors.book.draftEngine,
        jobs: [createTestDraftJob(sceneId, badDraft)]
      }
    }
  };

  assert.ok(getDraftJobAcceptanceBlockers(storyWithJob, "job_acceptance_guard_test").length >= 4);
}

{
  const story = createStory();
  const sceneId = story.acts[0].chapters[0].scenes[0].id;
  const sceneCard = createTestSceneCard(sceneId, [
    { key: "sequence_anchor", value: "Bus -> Ankunft -> Gruppeneinteilung -> Tourbeginn/Foyer" }
  ]);
  const storyWithSequence: StoryDocument = {
    ...story,
    book: {
      ...story.book,
      memory: {
        ...story.book.memory,
        sceneCards: [sceneCard],
        lastSyncedAt: "2026-04-28T00:00:00.000Z"
      }
    }
  };
  const packet = buildSceneContextPacket(storyWithSequence, sceneId);

  assert.ok(packet);

  const draftWithSceneBuiltGrouping = [
    "Blake, Coleman und Mills stritten im Bus ueber die Sitzplaetze.",
    "Sie stiegen vor dem Science Center aus.",
    "Der Lehrer teilte sie in Dreiergruppen ein und las Namen vor.",
    "Die Tour begann im Foyer."
  ].join("\n\n");
  const issues = auditSceneContinuityGuards(packet, draftWithSceneBuiltGrouping);

  assert.ok(!issues.some(function (issue) {
    return issue.includes("Gruppeneinteilung fehlt");
  }), issues.join("\n"));
  assert.ok(!issues.some(function (issue) {
    return issue.includes("Gruppeneinteilung steht vor");
  }), issues.join("\n"));
}

{
  const story = createStory();
  const sceneId = story.acts[0].chapters[0].scenes[0].id;
  const sceneCard = createTestSceneCard(sceneId, [
    { key: "sequence_anchor", value: "Bus -> Ankunft -> Gruppeneinteilung -> Tourbeginn/Foyer" }
  ]);
  const storyWithSequence: StoryDocument = {
    ...story,
    book: {
      ...story.book,
      memory: {
        ...story.book.memory,
        sceneCards: [sceneCard],
        lastSyncedAt: "2026-04-28T00:00:00.000Z"
      }
    }
  };
  const packet = buildSceneContextPacket(storyWithSequence, sceneId);

  assert.ok(packet);

  const draftWithWrongSequence = [
    "Der Bus roch nach Sonnencreme.",
    "Der Lehrer teilte sie in Dreiergruppen ein.",
    "Sie stiegen vor dem Science Center aus.",
    "Die Tour begann im Foyer."
  ].join("\n\n");
  const issues = auditSceneContinuityGuards(packet, draftWithWrongSequence);

  assert.ok(issues.some(function (issue) {
    return issue.includes("Pflicht-Ablauf verletzt");
  }), issues.join("\n"));

  const storyWithJob: StoryDocument = {
    ...storyWithSequence,
    book: {
      ...storyWithSequence.book,
      draftEngine: {
        ...storyWithSequence.book.draftEngine,
        jobs: [createTestDraftJob(sceneId, draftWithWrongSequence)]
      }
    }
  };

  assert.deepEqual(getDraftJobAcceptanceBlockers(storyWithJob, "job_acceptance_guard_test"), []);
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

function createTestDraftJob(sceneId: string, rewriteText: string): BookDraftJob {
  return {
    id: "job_acceptance_guard_test",
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
    draftText: rewriteText,
    rewriteText,
    rewriteNotes: [],
    extractedState: createExtractionState({}),
    stateDiff: baseDiff(sceneId),
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
  };
}

function createTestSceneCard(
  sceneId: string,
  custom: Array<{ key: string; value: string }>
): TimelineBeat {
  return {
    sceneId,
    sceneTitle: "Test Scene",
    actTitle: "Act",
    chapterTitle: "Chapter",
    summary: "Test summary",
    excerpt: "",
    orderLabel: "SC_TEST",
    chapterGoal: "Test goal",
    directives: {
      ...createEmptyBookSceneCardDirectives(),
      custom
    },
    outline: []
  };
}

function createExtractionState(
  overrides: Partial<Parameters<typeof buildStateDiffFromExtraction>[0]["extractedState"]>
): Parameters<typeof buildStateDiffFromExtraction>[0]["extractedState"] {
  return {
    newCanonFacts: overrides.newCanonFacts ?? [],
    characterStateUpdates: overrides.characterStateUpdates ?? [],
    openThreadsCreated: overrides.openThreadsCreated ?? [],
    openThreadsResolved: overrides.openThreadsResolved ?? [],
    foreshadowingAdded: overrides.foreshadowingAdded ?? [],
    continuityRisks: overrides.continuityRisks ?? [],
    styleDriftNotes: overrides.styleDriftNotes ?? [],
    memorySync: overrides.memorySync ?? {
      items: []
    }
  };
}

main().then(function () {
  console.log("book-state-validator tests passed");
}).catch(function (error) {
  console.error(error);
  process.exit(1);
});

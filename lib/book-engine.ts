import {
  createEmptyBookSceneCardDirectives,
  type BookDraftStageId,
  countWords,
  findSceneContext,
  getAllScenes,
  normalizeStoryWordCounts,
  updateSceneInStory,
  type BookDraftJob,
  type BookDraftStageRun,
  type BookDraftStageRuns,
  type BookJobProvider,
  type DraftMemorySyncItemKind,
  type DraftMemorySyncStatus,
  type DraftExtractionState,
  type StoryDocument,
  type StoryScene,
  type WorldBibleEntry,
  withDraftMemorySync
} from "@/lib/story-schema";
import { createUuid, isUuid } from "@/lib/id";

export type CanonLedgerEntry = StoryDocument["book"]["memory"]["canonLedger"][number];
export type CharacterStateEntry = StoryDocument["book"]["memory"]["characterLedger"][number];
export type CharacterStateSnapshotEntry =
  StoryDocument["book"]["memory"]["characterLedger"][number]["snapshots"][number];
export type TimelineBeat = StoryDocument["book"]["memory"]["sceneCards"][number];
export type OpenThread = StoryDocument["book"]["memory"]["openThreads"][number];
type ContextPack = StoryDocument["book"]["memory"]["contextPacks"][number];

type CanonImportance = CanonLedgerEntry["importance"];
type ObjectColorAnchor = {
  objectLabel: string;
  objectKey: string;
  colorLabel: string;
  phrase: string;
  sceneIds: string[];
  protectedHit: boolean;
};

const HARD_CUSTOM_DIRECTIVE_KEYS = new Set([
  "proof_object",
  "beweisobjekt",
  "alltagswaffe",
  "ersetzungsmoment",
  "false_friend_signal",
  "mila_kindmoment",
  "kindmoment",
  "object_anchor",
  "prop_anchor"
]);

const COLOR_WORD_PATTERN =
  "gelb\\p{L}*|rosa|pink\\p{L}*|lila|violett\\p{L}*|rot\\p{L}*|blau\\p{L}*|gruen\\p{L}*|grun\\p{L}*|grün\\p{L}*|schwarz\\p{L}*|grau\\p{L}*|braun\\p{L}*|orange\\p{L}*";

const CONTINUITY_GUARD_STOPWORDS = new Set([
  "aber",
  "alle",
  "alles",
  "ander",
  "andere",
  "anderen",
  "beim",
  "beide",
  "dabei",
  "damit",
  "dann",
  "darf",
  "durch",
  "einer",
  "einem",
  "einen",
  "eines",
  "fuer",
  "hier",
  "kein",
  "keine",
  "nicht",
  "noch",
  "oder",
  "ohne",
  "sich",
  "sind",
  "ueber",
  "unter",
  "wenn",
  "wie",
  "wird",
  "wurde"
]);

export type SceneContextPacket = {
  sceneId: string;
  stablePrefix: {
    premise: string;
    readerPromise: string;
    endingPromise: string;
    thematicCore: string;
    storyArchitecture: string[];
    categoryLane: string;
    marketHook: string;
    publishingGuardrails: string[];
    writerConstitution: string[];
    lockedFacts: StoryDocument["book"]["memory"]["lockedFacts"];
    continuityGuardrails: string[];
  };
  dynamicContext: {
    actTitle: string;
    chapterTitle: string;
    sceneTitle: string;
    sceneSummary: string;
    sceneExcerpt: string;
    sceneCardOutline: string[];
    sceneCardLabel: string | null;
    sceneHeaderHints: string[];
    sceneHardConstraints: string[];
    contextPackId: string | null;
    memorySyncedAt: string | null;
    previousBeats: TimelineBeat[];
    nextBeat: TimelineBeat | null;
    relevantCodex: CanonLedgerEntry[];
    relevantCharacterStates: CharacterStateEntry[];
    activeThreads: OpenThread[];
    variables: Array<{
      key: string;
      label: string;
      defaultValue: boolean | string | number;
    }>;
    wordTargetMin: number | null;
    wordTargetMax: number | null;
  };
  extractorTemplate: {
    new_canon_facts: string[];
    character_state_updates: string[];
    open_threads_created: string[];
    open_threads_resolved: string[];
    foreshadowing_added: string[];
    continuity_risks: string[];
    style_drift_notes: string[];
  };
};

export type BookDraftAudit = {
  acceptedJobs: number;
  pendingJobs: number;
  uncoveredSceneCount: number;
  continuityBlockers: string[];
  qualityWarnings: string[];
  marketWarnings: string[];
};

export type AmazonLaunchPackage = {
  titleLine: string;
  subtitle: string;
  seriesLine: string;
  penName: string;
  description: string;
  keywords: string[];
  categories: string[];
  audienceTags: string[];
  aiDisclosure: string;
  checklist: Array<{
    label: string;
    done: boolean;
  }>;
  readinessScore: number;
};

export const BOOK_DRAFT_STAGE_SEQUENCE: BookDraftStageId[] = [
  "context",
  "beat_plan",
  "draft",
  "rewrite",
  "length_control",
  "extract",
  "continuity",
  "quality_eval"
];

export function buildCanonLedger(story: StoryDocument): CanonLedgerEntry[] {
  if (story.book.memory.canonLedger.length) {
    return story.book.memory.canonLedger;
  }

  return deriveCanonLedger(story);
}

export function buildCharacterLedger(story: StoryDocument): CharacterStateEntry[] {
  if (story.book.memory.characterLedger.length) {
    return story.book.memory.characterLedger.map(ensureCharacterStateSnapshots);
  }

  return deriveCharacterLedger(
    story,
    deriveCanonLedger(story),
    deriveOpenThreads(story),
    story.book.memory.lastSyncedAt || new Date().toISOString()
  );
}

function ensureCharacterStateSnapshots(entry: CharacterStateEntry): CharacterStateEntry {
  if (entry.snapshots.length) {
    return entry;
  }

  return {
    ...entry,
    snapshots: [
      {
        id: createLocalId("character_snapshot"),
        scope: "baseline",
        sortOrder: 0,
        sourceSceneId: entry.updatedFromSceneId || null,
        sourceChapterId: null,
        sourceLabel: entry.updatedFromSceneId ? "Legacy Snapshot" : "Baseline",
        currentState: entry.currentState || "Kein expliziter Status gespeichert.",
        innerShift: entry.innerShift || "Noch keine extrahierte innere Verschiebung.",
        agenda: entry.agenda || "Noch keine explizite Agenda abgeleitet.",
        capturedAt: entry.updatedAt
      }
    ]
  };
}

export function buildTimelineBeats(story: StoryDocument): TimelineBeat[] {
  if (story.book.memory.sceneCards.length) {
    return story.book.memory.sceneCards;
  }

  return deriveTimelineBeats(story);
}

export function buildOpenThreads(story: StoryDocument): OpenThread[] {
  if (story.book.memory.openThreads.length) {
    return story.book.memory.openThreads;
  }

  return deriveOpenThreads(story);
}

export function syncStoryBookArtifacts(story: StoryDocument): StoryDocument {
  const normalizedStory = normalizeStoryWordCounts(story);
  const memory = buildBookMemoryBackbone(normalizedStory);

  return {
    ...normalizedStory,
    book: {
      ...normalizedStory.book,
      memory
    }
  };
}

export function buildSceneContextPacket(
  story: StoryDocument,
  sceneId: string
): SceneContextPacket | null {
  const sceneContext = findSceneContext(story, sceneId);

  if (!sceneContext) {
    return null;
  }

  const syncedStory = story.book.memory.lastSyncedAt ? story : syncStoryBookArtifacts(story);
  const timeline = buildTimelineBeats(syncedStory);
  const sceneIndex = timeline.findIndex(function (beat) {
    return beat.sceneId === sceneId;
  });
  const canonLedger = buildCanonLedger(syncedStory);
  const characterLedger = buildCharacterLedger(syncedStory);
  const memory = syncedStory.book.memory;
  const contextPack =
    memory.contextPacks.find(function (pack) {
      return pack.sceneId === sceneId;
    }) ?? null;
  const activeThreads = resolveThreadsForPacket(memory, sceneId, contextPack);
  const relevantCodex = resolveCanonForPacket(syncedStory, sceneId, contextPack, canonLedger).slice(0, 4);
  const relevantCharacterStates = resolveCharacterStatesForPacket(
    sceneId,
    contextPack,
    characterLedger,
    relevantCodex
  ).slice(0, 4);
  const previousBeats = contextPack
    ? contextPack.previousSceneIds
        .map(function (previousSceneId) {
          return timeline.find(function (beat) {
            return beat.sceneId === previousSceneId;
          }) ?? null;
        })
        .filter(function (beat): beat is TimelineBeat {
          return Boolean(beat);
        })
    : timeline.slice(Math.max(0, sceneIndex - 2), sceneIndex);
  const nextBeat = contextPack?.nextSceneId
    ? timeline.find(function (beat) {
        return beat.sceneId === contextPack.nextSceneId;
      }) ?? null
    : timeline[sceneIndex + 1] ?? null;

  return {
    sceneId,
    stablePrefix: {
      premise: syncedStory.book.masterBrief.premise,
      readerPromise: syncedStory.book.masterBrief.readerPromise,
      endingPromise: syncedStory.book.masterBrief.endingPromise,
      thematicCore: syncedStory.book.masterBrief.thematicCore,
      storyArchitecture: syncedStory.book.masterBrief.storyArchitecture,
      categoryLane: syncedStory.book.marketBrief.categoryLane,
      marketHook: syncedStory.book.marketBrief.hook,
      publishingGuardrails: syncedStory.book.marketBrief.publishingGuardrails,
      writerConstitution: syncedStory.book.writerConstitution,
      lockedFacts: syncedStory.book.memory.lockedFacts,
      continuityGuardrails: syncedStory.book.memory.continuityGuardrails
    },
    dynamicContext: {
      actTitle: sceneContext.act.title,
      chapterTitle: sceneContext.chapter.title,
      sceneTitle: sceneContext.scene.title,
      sceneSummary: sceneContext.scene.summary,
      sceneExcerpt: buildSceneExcerpt(sceneContext.scene),
      sceneCardOutline: timeline[sceneIndex]?.outline ?? [],
      sceneCardLabel: timeline[sceneIndex]?.orderLabel ?? null,
      sceneHeaderHints: buildSceneHeaderHints(timeline[sceneIndex] ?? null),
      sceneHardConstraints: buildSceneHardConstraints(syncedStory, timeline[sceneIndex] ?? null),
      contextPackId: contextPack?.id ?? null,
      memorySyncedAt: memory.lastSyncedAt,
      previousBeats,
      nextBeat,
      relevantCodex,
      relevantCharacterStates,
      activeThreads: activeThreads.slice(0, 4),
      variables: syncedStory.variables.map(function (variable) {
        return {
          key: variable.key,
          label: variable.label,
          defaultValue: variable.defaultValue
        };
      }),
      wordTargetMin: extractWordTargetFromBeat(timeline[sceneIndex] ?? null, "word_target_min"),
      wordTargetMax: extractWordTargetFromBeat(timeline[sceneIndex] ?? null, "word_target_max")
    },
    extractorTemplate: {
      new_canon_facts: [],
      character_state_updates: [],
      open_threads_created: [],
      open_threads_resolved: [],
      foreshadowing_added: [],
      continuity_risks: [],
      style_drift_notes: []
    }
  };
}

export function getDraftJobsForScene(story: StoryDocument, sceneId: string) {
  return story.book.draftEngine.jobs
    .filter(function (job) {
      return job.sceneId === sceneId;
    })
    .sort(function (left, right) {
      return right.updatedAt.localeCompare(left.updatedAt);
    });
}

export function createLocalDraftJob(
  story: StoryDocument,
  sceneId: string
): { story: StoryDocument; job: BookDraftJob } | null {
  const packet = buildSceneContextPacket(story, sceneId);

  if (!packet) {
    return null;
  }

  const job = createDraftJobFromPacket(
    packet,
    story.book.draftEngine.targetSceneWordsMin,
    story.book.draftEngine.targetSceneWordsMax
  );

  return {
    story: upsertDraftJob(story, job),
    job
  };
}

export function createDraftJobFromPacket(
  packet: SceneContextPacket,
  targetSceneWordsMin: number,
  targetSceneWordsMax: number
): BookDraftJob {
  const outline = buildOutlineSteps(packet);
  const draftText = buildDraftText(packet, targetSceneWordsMin);
  const now = new Date().toISOString();
  const extractedState = withDraftMemorySync(extractDraftState(packet, draftText), {
    fallbackCreatedAt: now,
    defaultStatus: "pending"
  });
  const rewriteNotes = buildRewriteNotes(packet, draftText, extractedState);
  const rewriteText = buildRewriteText(packet, draftText, rewriteNotes);
  const actualWords = countWords(rewriteText);

  return {
    id: createLocalId("draft_job"),
    sceneId: packet.sceneId,
    sceneTitle: packet.dynamicContext.sceneTitle,
    createdAt: now,
    updatedAt: now,
    provider: "local" as const,
    mode: "local_fallback" as const,
    modelName: null,
    status: "ready" as const,
    acceptedAt: null,
    outline,
    draftText,
    rewriteText,
    rewriteNotes,
    extractedState,
    stages: createCompletedDraftStageRuns({
      provider: "local",
      modelName: null,
      updatedAt: now,
      targetWordsMin: targetSceneWordsMin,
      targetWordsMax: targetSceneWordsMax,
      draftWords: countWords(draftText),
      rewriteWords: actualWords,
      continuityNotes: extractedState.continuityRisks.concat(extractedState.styleDriftNotes),
      rewriteNotes,
      beatPlanNotes: outline,
      qualityScore: null,
      qualityIssues: []
    }),
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

export function createCompletedDraftStageRuns(params: {
  provider: BookJobProvider;
  modelName: string | null;
  updatedAt: string;
  targetWordsMin?: number | null;
  targetWordsMax?: number | null;
  draftWords?: number | null;
  rewriteWords?: number | null;
  continuityModelName?: string | null;
  continuityNotes?: string[];
  rewriteNotes?: string[];
  beatPlanNotes?: string[];
  qualityScore?: number | null;
  qualityIssues?: string[];
}): BookDraftStageRuns {
  return {
    context: createStageRun({
      provider: params.provider,
      modelName: params.modelName,
      updatedAt: params.updatedAt,
      notes: ["Context-Pack vorbereitet."]
    }),
    beat_plan: createStageRun({
      provider: params.provider,
      modelName: params.modelName,
      updatedAt: params.updatedAt,
      notes:
        params.beatPlanNotes && params.beatPlanNotes.length
          ? params.beatPlanNotes
          : ["Beat-Plan fuer die Szene erzeugt."]
    }),
    draft: createStageRun({
      provider: params.provider,
      modelName: params.modelName,
      updatedAt: params.updatedAt,
      targetWordsMin: params.targetWordsMin ?? null,
      targetWordsMax: params.targetWordsMax ?? null,
      actualWords: params.draftWords ?? null,
      notes: ["Szenendraft erzeugt."]
    }),
    rewrite: createStageRun({
      provider: params.provider,
      modelName: params.modelName,
      updatedAt: params.updatedAt,
      targetWordsMin: params.targetWordsMin ?? null,
      targetWordsMax: params.targetWordsMax ?? null,
      actualWords: params.rewriteWords ?? null,
      notes:
        params.rewriteNotes && params.rewriteNotes.length
          ? params.rewriteNotes
          : ["Rewrite abgeschlossen."]
    }),
    length_control: createStageRun({
      provider: params.provider,
      modelName: params.modelName,
      updatedAt: params.updatedAt,
      attemptCount: 0,
      targetWordsMin: params.targetWordsMin ?? null,
      targetWordsMax: params.targetWordsMax ?? null,
      actualWords: params.rewriteWords ?? null,
      notes: ["Keine separate Length-Control erforderlich."]
    }),
    extract: createStageRun({
      provider: params.provider,
      modelName: params.modelName,
      updatedAt: params.updatedAt,
      notes: ["State-Extraktion aus dem finalen Rewrite abgeschlossen."]
    }),
    continuity: createStageRun({
      provider: params.provider,
      modelName: params.continuityModelName ?? params.modelName,
      updatedAt: params.updatedAt,
      notes:
        params.continuityNotes && params.continuityNotes.length
          ? params.continuityNotes
          : ["Keine offenen Continuity-Hinweise."]
    }),
    quality_eval: createStageRun({
      provider: params.provider,
      modelName: params.modelName,
      updatedAt: params.updatedAt,
      targetWordsMin: params.targetWordsMin ?? null,
      targetWordsMax: params.targetWordsMax ?? null,
      actualWords: params.rewriteWords ?? null,
      qualityScore: params.qualityScore ?? null,
      qualityIssues: params.qualityIssues ?? [],
      notes:
        params.qualityIssues && params.qualityIssues.length
          ? params.qualityIssues
          : ["Keine offenen Quality-Eval-Probleme."]
    })
  };
}

export function createFallbackDraftStageRuns(params: {
  provider: BookJobProvider;
  modelName: string | null;
  updatedAt: string;
}): BookDraftStageRuns {
  return createCompletedDraftStageRuns({
    provider: params.provider,
    modelName: params.modelName,
    updatedAt: params.updatedAt
  });
}

export function createStageRun(params: {
  provider: BookJobProvider;
  modelName: string | null;
  updatedAt: string | null;
  status?: BookDraftStageRun["status"];
  attemptCount?: number;
  repairCount?: number;
  durationMs?: number | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
  costCents?: number | null;
  stopReason?: string | null;
  targetWordsMin?: number | null;
  targetWordsMax?: number | null;
  actualWords?: number | null;
  qualityScore?: number | null;
  qualityIssues?: string[];
  notes?: string[];
}): BookDraftStageRun {
  return {
    status: params.status ?? "completed",
    provider: params.provider,
    modelName: params.modelName,
    updatedAt: params.updatedAt,
    attemptCount: params.attemptCount ?? 1,
    repairCount: params.repairCount ?? 0,
    durationMs: params.durationMs ?? null,
    inputTokens: params.inputTokens ?? null,
    outputTokens: params.outputTokens ?? null,
    costCents: params.costCents ?? null,
    stopReason: params.stopReason ?? null,
    targetWordsMin: params.targetWordsMin ?? null,
    targetWordsMax: params.targetWordsMax ?? null,
    actualWords: params.actualWords ?? null,
    qualityScore: params.qualityScore ?? null,
    qualityIssues: params.qualityIssues ?? [],
    notes: params.notes ?? []
  };
}

function buildBookMemoryBackbone(story: StoryDocument): StoryDocument["book"]["memory"] {
  const syncedAt = new Date().toISOString();
  const canonLedger = deriveCanonLedger(story);
  const openThreads = deriveOpenThreads(story);
  const characterLedger = deriveCharacterLedger(story, canonLedger, openThreads, syncedAt);
  const sceneCards = story.book.memory.sceneCards.length
    ? story.book.memory.sceneCards
    : deriveTimelineBeats(story);
  const contextPacks = deriveContextPacks(
    story,
    syncedAt,
    sceneCards,
    canonLedger,
    characterLedger,
    openThreads
  );
  const continuityNotes = story.book.memory.continuityNotes.length
    ? story.book.memory.continuityNotes
    : story.book.draftEngine.jobs
        .flatMap(function (job) {
          return job.extractedState.continuityRisks.map(function (risk) {
            return `${job.sceneTitle}: ${risk}`;
          });
        })
        .slice(0, 12);

  return {
    lastSyncedAt: syncedAt,
    canonLedger,
    characterLedger,
    openThreads,
    sceneCards,
    contextPacks,
    lockedFacts:
      Object.values(story.book.memory.lockedFacts).some(Boolean)
        ? story.book.memory.lockedFacts
        : story.book.masterBriefRuntime.lockedFacts,
    continuityGuardrails:
      story.book.memory.continuityGuardrails.length > 0
        ? story.book.memory.continuityGuardrails
        : story.book.writerRulesRuntime.continuityGuardrails,
    continuityNotes,
    humanEditExamples: story.book.memory.humanEditExamples
  };
}

function deriveCanonLedger(story: StoryDocument): CanonLedgerEntry[] {
  const scenes = getAllScenes(story);
  const ledger = new Map<string, CanonLedgerEntry>();

  story.worldBible.forEach(function (entry) {
    const sceneIds = scenes
      .filter(function (scene) {
        return scoreEntryAgainstScene(entry, scene) > 0;
      })
      .map(function (scene) {
        return scene.id;
      });
    const mentionCount = sceneIds.length;

    ledger.set(normalizeText(entry.title), {
      entryId: entry.id,
      title: entry.title,
      kind: entry.kind,
      summary: entry.summary,
      mentionCount,
      sceneIds,
      importance: getCanonImportance(mentionCount),
      status: mentionCount ? "active" : "watch"
    });
  });

  resolveStoryObjectColorAnchors(story).forEach(function (anchor) {
    mergeCanonFact(ledger, {
      entryId: createLocalId("object_color_anchor"),
      title: anchor.phrase,
      kind: "object",
      summary: `Kanon-Objektanker: ${anchor.objectLabel} bleibt ${anchor.colorLabel}; Farbe und Requisite duerfen nicht ersetzt werden.`,
      mentionCount: Math.max(2, anchor.sceneIds.length),
      sceneIds: anchor.sceneIds,
      importance: "high",
      status: "active"
    });
  });

  story.book.draftEngine.jobs.forEach(function (job) {
    getApprovedMemorySyncValues(job, "canon_fact").filter(function (fact) {
      return !detectMemorySyncValueDrift(story, fact).length;
    }).forEach(function (fact) {
      const parsed = parseLedgerFact(fact, createLocalId("scene_fact"), "scene_fact");
      mergeCanonFact(ledger, {
        ...parsed,
        sceneIds: [job.sceneId],
        mentionCount: 1,
        importance: "medium",
        status: job.status === "accepted" ? "active" : "watch"
      });
    });

    getApprovedMemorySyncValues(job, "foreshadowing").filter(function (fact) {
      return !detectMemorySyncValueDrift(story, fact).length;
    }).forEach(function (fact) {
      const parsed = parseLedgerFact(
        fact,
        createLocalId("foreshadow"),
        "foreshadowing"
      );
      mergeCanonFact(ledger, {
        ...parsed,
        sceneIds: [job.sceneId],
        mentionCount: 1,
        importance: "medium",
        status: "watch"
      });
    });
  });

  return Array.from(ledger.values()).sort(function (left, right) {
    return right.mentionCount - left.mentionCount || left.title.localeCompare(right.title);
  });
}

function deriveCharacterLedger(
  story: StoryDocument,
  canonLedger: CanonLedgerEntry[],
  openThreads: OpenThread[],
  syncedAt: string
): CharacterStateEntry[] {
  const orderedScenes = story.acts.flatMap(function (act, actIndex) {
    return act.chapters.flatMap(function (chapter, chapterIndex) {
      return chapter.scenes.map(function (scene, sceneIndex) {
        return {
          actTitle: act.title,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          sceneId: scene.id,
          sceneTitle: scene.title,
          sceneOrder: actIndex * 10000 + chapterIndex * 100 + sceneIndex
        };
      });
    });
  });
  const sceneOrderMap = new Map<
    string,
    {
      actTitle: string;
      chapterId: string;
      chapterTitle: string;
      sceneId: string;
      sceneTitle: string;
      sceneOrder: number;
    }
  >(
    orderedScenes.map(function (entry) {
      return [entry.sceneId, entry];
    })
  );

  return canonLedger
    .filter(function (entry) {
      return entry.kind === "character";
    })
    .map(function (entry) {
      const snapshots = buildCharacterStateSnapshots({
        story,
        characterEntry: entry,
        openThreads,
        syncedAt,
        sceneOrderMap
      });
      const latestSnapshot = snapshots[snapshots.length - 1] ?? null;
      const latestSceneSnapshot = findLatestCharacterSnapshotByScope(snapshots, "scene");
      const baselineState = entry.summary || "Kein expliziter Status gespeichert.";
      const defaultAgenda =
        openThreads.find(function (thread) {
          return normalizeText(thread.label).includes(normalizeText(entry.title));
        })?.label || "Noch keine explizite Agenda abgeleitet.";

      return {
        id: isUuid(entry.entryId) ? entry.entryId : createLocalId("character_state"),
        characterEntryId: entry.entryId,
        characterName: entry.title,
        currentState: latestSnapshot?.currentState || baselineState,
        innerShift: latestSnapshot?.innerShift || "Noch keine extrahierte innere Verschiebung.",
        agenda: latestSnapshot?.agenda || defaultAgenda,
        updatedFromSceneId: latestSceneSnapshot?.sourceSceneId || entry.sceneIds[0] || "",
        updatedAt: latestSnapshot?.capturedAt || syncedAt,
        snapshots
      };
    });
}

function buildCharacterStateSnapshots(params: {
  story: StoryDocument;
  characterEntry: CanonLedgerEntry;
  openThreads: OpenThread[];
  syncedAt: string;
  sceneOrderMap: Map<
    string,
    {
      actTitle: string;
      chapterId: string;
      chapterTitle: string;
      sceneId: string;
      sceneTitle: string;
      sceneOrder: number;
    }
  >;
}): CharacterStateSnapshotEntry[] {
  const defaultAgenda =
    params.openThreads.find(function (thread) {
      return normalizeText(thread.label).includes(normalizeText(params.characterEntry.title));
    })?.label || "Noch keine explizite Agenda abgeleitet.";
  const baselineState = params.characterEntry.summary || "Kein expliziter Status gespeichert.";
  const narrativeSnapshots = params.story.book.draftEngine.jobs
    .flatMap(function (job) {
      const sceneMeta = params.sceneOrderMap.get(job.sceneId);

      if (!sceneMeta) {
        return [];
      }

      const updates = getApprovedMemorySyncValues(job, "character_state")
        .filter(function (update) {
          return !detectMemorySyncValueDrift(params.story, update).length;
        })
        .filter(function (update) {
          return normalizeText(update).includes(normalizeText(params.characterEntry.title));
        });

      return updates.map(function (update, updateIndex) {
        return {
          id: createLocalId("character_snapshot"),
          scope: "scene" as const,
          sortOrder: sceneMeta.sceneOrder * 10 + updateIndex + 1,
          sourceSceneId: job.sceneId,
          sourceChapterId: sceneMeta.chapterId,
          sourceLabel: `Szene · ${sceneMeta.sceneTitle}`,
          currentState: update,
          innerShift: `Aus ${sceneMeta.sceneTitle} extrahiert: ${update}`,
          agenda: resolveCharacterAgendaForSnapshot(
            params.characterEntry.title,
            defaultAgenda,
            params.openThreads,
            job.sceneId
          ),
          capturedAt: job.updatedAt || params.syncedAt
        };
      });
    })
    .sort(function (left, right) {
      return left.sortOrder - right.sortOrder || left.capturedAt.localeCompare(right.capturedAt);
    });

  const snapshots: CharacterStateSnapshotEntry[] = [
    {
      id: createLocalId("character_snapshot"),
      scope: "baseline",
      sortOrder: 0,
      sourceSceneId: null,
      sourceChapterId: null,
      sourceLabel: "Baseline",
      currentState: baselineState,
      innerShift: "Noch keine extrahierte innere Verschiebung.",
      agenda: defaultAgenda,
      capturedAt: params.syncedAt
    }
  ];

  narrativeSnapshots.forEach(function (snapshot) {
    snapshots.push(snapshot);
  });

  buildChapterCharacterSnapshots(narrativeSnapshots).forEach(function (snapshot) {
    snapshots.push(snapshot);
  });

  return snapshots.sort(function (left, right) {
    return left.sortOrder - right.sortOrder || left.capturedAt.localeCompare(right.capturedAt);
  });
}

function buildChapterCharacterSnapshots(
  sceneSnapshots: CharacterStateSnapshotEntry[]
): CharacterStateSnapshotEntry[] {
  const latestSnapshotByChapter = new Map<string, CharacterStateSnapshotEntry>();

  sceneSnapshots.forEach(function (snapshot) {
    if (!snapshot.sourceChapterId) {
      return;
    }

    latestSnapshotByChapter.set(snapshot.sourceChapterId, snapshot);
  });

  return Array.from(latestSnapshotByChapter.values()).map(function (snapshot) {
    return {
      id: createLocalId("character_snapshot"),
      scope: "chapter" as const,
      sortOrder: snapshot.sortOrder + 5,
      sourceSceneId: snapshot.sourceSceneId,
      sourceChapterId: snapshot.sourceChapterId,
      sourceLabel: `Kapitelstatus nach ${snapshot.sourceLabel.replace(/^Szene · /, "")}`,
      currentState: snapshot.currentState,
      innerShift: `Kapitelstatus gesichert nach ${snapshot.sourceLabel.replace(/^Szene · /, "")}.`,
      agenda: snapshot.agenda,
      capturedAt: snapshot.capturedAt
    };
  });
}

function resolveCharacterAgendaForSnapshot(
  characterName: string,
  fallbackAgenda: string,
  openThreads: OpenThread[],
  sceneId: string
) {
  return (
    openThreads.find(function (thread) {
      return (
        thread.sourceSceneId === sceneId &&
        normalizeText(thread.label).includes(normalizeText(characterName))
      );
    })?.label ||
    openThreads.find(function (thread) {
      return normalizeText(thread.label).includes(normalizeText(characterName));
    })?.label ||
    fallbackAgenda
  );
}

function findLatestCharacterSnapshotByScope(
  snapshots: CharacterStateSnapshotEntry[],
  scope: CharacterStateSnapshotEntry["scope"]
) {
  const matchingSnapshots = snapshots.filter(function (snapshot) {
    return snapshot.scope === scope;
  });

  return matchingSnapshots[matchingSnapshots.length - 1] ?? null;
}

function deriveTimelineBeats(story: StoryDocument): TimelineBeat[] {
  return story.acts.flatMap(function (act, actIndex) {
    return act.chapters.flatMap(function (chapter, chapterIndex) {
      const chapterGoal =
        chapter.scenes.find(function (scene) {
          return Boolean(scene.summary.trim());
        })?.summary || chapter.title;

      return chapter.scenes.map(function (scene, sceneIndex) {
        return {
          sceneId: scene.id,
          sceneTitle: scene.title,
          actTitle: act.title,
          chapterTitle: chapter.title,
          summary: scene.summary,
          excerpt: buildSceneExcerpt(scene),
          orderLabel: `A${actIndex + 1} · C${chapterIndex + 1} · S${sceneIndex + 1}`,
          chapterGoal,
          directives: createEmptyBookSceneCardDirectives(),
          outline: buildSceneCardOutline(scene, chapterGoal, chapter.scenes[sceneIndex + 1]?.title ?? null)
        };
      });
    });
  });
}

function deriveOpenThreads(story: StoryDocument): OpenThread[] {
  const allScenes = getAllScenes(story);
  const threads: OpenThread[] = [];

  allScenes.forEach(function (scene) {
    scene.choices.forEach(function (choice, choiceIndex) {
      const targetScene = allScenes.find(function (candidate) {
        return candidate.id === choice.toSceneId;
      });

      threads.push({
        id: choice.id,
        label: choice.label || `Choice ${choiceIndex + 1}`,
        detail: targetScene
          ? `Fuehrt zu ${targetScene.title} und braucht spaeter eine klare Konsequenz.`
          : "Fuehrt aktuell auf kein bekanntes Ziel und ist damit ein offener Strukturpunkt.",
        sourceSceneId: scene.id,
        sourceSceneTitle: scene.title,
        status: targetScene && targetScene.wordCount > 0 ? "watch" : "active",
        priority: targetScene && targetScene.wordCount > 0 ? "medium" : "high",
        payoffSceneId: targetScene?.id ?? null
      });
    });

    if (looksLikeOpenQuestion(scene.summary)) {
      threads.push({
        id: createLocalId("summary_thread"),
        label: createThreadLabel(scene.summary, scene.title),
        detail: "Die Szenen-Zusammenfassung signalisiert einen offenen Konflikt oder eine unbezahlte Frage.",
        sourceSceneId: scene.id,
        sourceSceneTitle: scene.title,
        status: "active",
        priority: "high",
        payoffSceneId: null
      });
    }
  });

  story.book.draftEngine.jobs.forEach(function (job) {
    job.extractedState.openThreadsCreated.forEach(function (label) {
      threads.push({
        id: createLocalId("job_thread"),
        label,
        detail: `Vom Extractor nach ${job.sceneTitle} als neuer offener Faden markiert.`,
        sourceSceneId: job.sceneId,
        sourceSceneTitle: job.sceneTitle,
        status: job.status === "accepted" ? "active" : "watch",
        priority: "medium",
        payoffSceneId: null
      });
    });
  });

  const dedupedThreads = dedupeThreads(threads);

  story.book.draftEngine.jobs.forEach(function (job) {
    job.extractedState.openThreadsResolved.forEach(function (resolvedLabel) {
      dedupedThreads.forEach(function (thread) {
        if (normalizeText(thread.label) === normalizeText(resolvedLabel)) {
          thread.status = "resolved";
        }
      });
    });
  });

  return dedupedThreads;
}

function deriveContextPacks(
  story: StoryDocument,
  syncedAt: string,
  sceneCards: TimelineBeat[],
  canonLedger: CanonLedgerEntry[],
  characterLedger: CharacterStateEntry[],
  openThreads: OpenThread[]
): ContextPack[] {
  return sceneCards.map(function (sceneCard, index) {
    const previousSceneIds = sceneCards
      .slice(Math.max(0, index - 2), index)
      .map(function (beat) {
        return beat.sceneId;
      });
    const nextSceneId = sceneCards[index + 1]?.sceneId ?? null;
    const relevantCanon = rankRelevantCodexForScene(story, sceneCard.sceneId, canonLedger).slice(0, 4);
    const relevantCharacterStates = rankCharacterStatesForScene(
      sceneCard.sceneId,
      characterLedger,
      relevantCanon
    ).slice(0, 4);
    const activeThreadIds = openThreads
      .filter(function (thread) {
        return thread.sourceSceneId === sceneCard.sceneId || thread.status === "active";
      })
      .slice(0, 4)
      .map(function (thread) {
        return thread.id;
      });

    return {
      id: sceneCard.sceneId,
      sceneId: sceneCard.sceneId,
      preparedAt: syncedAt,
      stablePrefixSignature: buildStablePrefixSignature(story, sceneCard.chapterGoal),
      previousSceneIds,
      nextSceneId,
      relevantCanonEntryIds: relevantCanon.map(function (entry) {
        return entry.entryId;
      }),
      relevantCharacterStateIds: relevantCharacterStates.map(function (entry) {
        return entry.id;
      }),
      activeThreadIds,
      runtimeContext: {
        lockedFacts: story.book.memory.lockedFacts,
        continuityGuardrails: story.book.memory.continuityGuardrails
      }
    };
  });
}

function resolveCanonForPacket(
  story: StoryDocument,
  sceneId: string,
  contextPack: ContextPack | null,
  canonLedger: CanonLedgerEntry[]
) {
  if (contextPack?.relevantCanonEntryIds.length) {
    return contextPack.relevantCanonEntryIds
      .map(function (entryId) {
        return canonLedger.find(function (entry) {
          return entry.entryId === entryId;
        }) ?? null;
      })
      .filter(function (entry): entry is CanonLedgerEntry {
        return Boolean(entry);
      });
  }

  return rankRelevantCodexForScene(story, sceneId, canonLedger);
}

function resolveCharacterStatesForPacket(
  sceneId: string,
  contextPack: ContextPack | null,
  characterLedger: CharacterStateEntry[],
  relevantCodex: CanonLedgerEntry[]
) {
  if (contextPack?.relevantCharacterStateIds.length) {
    return contextPack.relevantCharacterStateIds
      .map(function (stateId) {
        return characterLedger.find(function (entry) {
          return entry.id === stateId;
        }) ?? null;
      })
      .filter(function (entry): entry is CharacterStateEntry {
        return Boolean(entry);
      });
  }

  return rankCharacterStatesForScene(sceneId, characterLedger, relevantCodex);
}

function resolveThreadsForPacket(
  memory: StoryDocument["book"]["memory"],
  sceneId: string,
  contextPack: ContextPack | null
) {
  if (contextPack?.activeThreadIds.length) {
    return contextPack.activeThreadIds
      .map(function (threadId) {
        return memory.openThreads.find(function (thread) {
          return thread.id === threadId;
        }) ?? null;
      })
      .filter(function (thread): thread is OpenThread {
        return Boolean(thread);
      });
  }

  return memory.openThreads.filter(function (thread) {
    return thread.sourceSceneId === sceneId || thread.status === "active";
  });
}

export function upsertDraftJob(story: StoryDocument, job: BookDraftJob): StoryDocument {
  return syncStoryBookArtifacts({
    ...story,
    book: {
      ...story.book,
      activePhase: "phase_3_drafting",
      draftEngine: {
        ...story.book.draftEngine,
        jobs: [job].concat(
          story.book.draftEngine.jobs.filter(function (currentJob) {
            return currentJob.sceneId !== job.sceneId;
          })
        )
      }
    }
  });
}

export function updateDraftJobMemorySyncStatus(
  story: StoryDocument,
  params: {
    jobId: string;
    itemId: string;
    status: DraftMemorySyncStatus;
  }
): StoryDocument {
  const now = new Date().toISOString();

  return syncStoryBookArtifacts({
    ...story,
    book: {
      ...story.book,
      activePhase: "phase_2_memory",
      draftEngine: {
        ...story.book.draftEngine,
        jobs: story.book.draftEngine.jobs.map(function (job) {
          if (job.id !== params.jobId) {
            return job;
          }

          return {
            ...job,
            updatedAt: now,
            extractedState: {
              ...job.extractedState,
              memorySync: {
                items: job.extractedState.memorySync.items.map(function (item) {
                  if (item.id !== params.itemId) {
                    return item;
                  }

                  return {
                    ...item,
                    status: params.status,
                    reviewedAt: params.status === "pending" ? null : now
                  };
                })
              }
            }
          };
        })
      }
    }
  });
}

export function updateDraftJobMemorySyncKindStatus(
  story: StoryDocument,
  params: {
    jobId: string;
    kind: DraftMemorySyncItemKind;
    status: DraftMemorySyncStatus;
    onlyPending?: boolean;
  }
): StoryDocument {
  const now = new Date().toISOString();

  return syncStoryBookArtifacts({
    ...story,
    book: {
      ...story.book,
      activePhase: "phase_2_memory",
      draftEngine: {
        ...story.book.draftEngine,
        jobs: story.book.draftEngine.jobs.map(function (job) {
          if (job.id !== params.jobId) {
            return job;
          }

          return {
            ...job,
            updatedAt: now,
            extractedState: {
              ...job.extractedState,
              memorySync: {
                items: job.extractedState.memorySync.items.map(function (item) {
                  if (item.kind !== params.kind) {
                    return item;
                  }

                  if (params.onlyPending && item.status !== "pending") {
                    return item;
                  }

                  return {
                    ...item,
                    status: params.status,
                    reviewedAt: params.status === "pending" ? null : now
                  };
                })
              }
            }
          };
        })
      }
    }
  });
}

export function acceptDraftJobToScene(
  story: StoryDocument,
  jobId: string
): { story: StoryDocument; sceneId: string } | null {
  const job = story.book.draftEngine.jobs.find(function (candidate) {
    return candidate.id === jobId;
  });

  if (!job) {
    return null;
  }

  if (getDraftJobAcceptanceBlockers(story, jobId).length) {
    return null;
  }

  const nextStory = updateSceneInStory(story, job.sceneId, function (scene) {
    const paragraphs = splitIntoParagraphs(job.rewriteText);
    const reusableBlockIds = scene.blocks.map(function (block) {
      return isUuid(block.id) ? block.id : createUuid();
    });

    return {
      ...scene,
      summary: deriveSceneSummary(job),
      blocks: paragraphs.map(function (paragraph, index) {
        return {
          id: reusableBlockIds[index] ?? createUuid(),
          kind: "paragraph",
          text: paragraph
        };
      })
    };
  });

  return {
    story: syncStoryBookArtifacts({
      ...nextStory,
      book: {
        ...nextStory.book,
        draftEngine: {
          ...nextStory.book.draftEngine,
          jobs: nextStory.book.draftEngine.jobs.map(function (currentJob) {
            if (currentJob.id !== jobId) {
              return currentJob;
            }

            return {
              ...currentJob,
              status: "accepted",
              acceptedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          })
        }
      }
    }),
    sceneId: job.sceneId
  };
}

export function getDraftJobAcceptanceBlockers(story: StoryDocument, jobId: string): string[] {
  const job = story.book.draftEngine.jobs.find(function (candidate) {
    return candidate.id === jobId;
  });

  if (!job) {
    return ["Draft-Job wurde nicht gefunden."];
  }

  if (!job.rewriteText.trim()) {
    return ["Rewrite-Text ist leer."];
  }

  const packet = buildSceneContextPacket(story, job.sceneId);

  if (!packet) {
    return ["Scene context konnte fuer den Draft-Job nicht aufgebaut werden."];
  }

  return auditSceneContinuityGuards(packet, job.rewriteText);
}

function getApprovedMemorySyncValues(
  job: BookDraftJob,
  kind: DraftMemorySyncItemKind
): string[] {
  return job.extractedState.memorySync.items
    .filter(function (item) {
      return item.kind === kind && item.status === "approved";
    })
    .map(function (item) {
      return item.value;
    });
}

export function analyzeBookDraftReadiness(story: StoryDocument): BookDraftAudit {
  const scenes = getAllScenes(story);
  const jobs = story.book.draftEngine.jobs;
  const acceptedJobs = jobs.filter(function (job) {
    return job.status === "accepted";
  });
  const pendingJobs = jobs.length - acceptedJobs.length;
  const pendingMemorySyncCount = jobs.reduce(function (sum, job) {
    return (
      sum +
      job.extractedState.memorySync.items.filter(function (item) {
        return item.status === "pending";
      }).length
    );
  }, 0);
  const continuityBlockers: string[] = [];
  const qualityWarnings: string[] = [];
  const marketWarnings: string[] = [];

  const uncoveredSceneCount = scenes.filter(function (scene) {
    return !jobs.some(function (job) {
      return job.sceneId === scene.id;
    });
  }).length;

  if (!story.book.masterBrief.readerPromise) {
    qualityWarnings.push("Reader Promise fehlt; Stil- und Spannungssteuerung bleiben unscharf.");
  }

  if (!story.book.marketBrief.hook) {
    marketWarnings.push("Commercial Hook fehlt; Amazon-Paketierung ist damit noch weich.");
  }

  if (!story.book.marketBrief.categoryLane) {
    marketWarnings.push("Category Lane ist leer; Positionierung fuer den ersten Titel fehlt.");
  }

  if (!acceptedJobs.length) {
    continuityBlockers.push("Noch kein Draft-Job wurde in eine Szene uebernommen.");
  }

  if (uncoveredSceneCount) {
    continuityBlockers.push(
      `${uncoveredSceneCount} Szene(n) haben noch keinen Draft-Job und bleiben ausserhalb der Pipeline.`
    );
  }

  if (pendingMemorySyncCount) {
    continuityBlockers.push(
      `${pendingMemorySyncCount} Memory-Sync-Extract(s) sind noch nicht bestaetigt.`
    );
  }

  jobs.forEach(function (job) {
    const packet = buildSceneContextPacket(story, job.sceneId);
    const deterministicRisks = packet ? auditSceneContinuityGuards(packet, job.rewriteText) : [];

    deterministicRisks.forEach(function (risk) {
      continuityBlockers.push(`${job.sceneTitle}: ${risk}`);
    });

    job.extractedState.memorySync.items
      .filter(function (item) {
        return item.status === "approved";
      })
      .forEach(function (item) {
        detectMemorySyncValueDrift(story, item.value).forEach(function (risk) {
          continuityBlockers.push(`${job.sceneTitle}: Approved Extract blockiert: ${risk}`);
        });
      });

    if (job.extractedState.continuityRisks.length) {
      continuityBlockers.push(
        `${job.sceneTitle}: ${job.extractedState.continuityRisks.join(" ")}`
      );
    }

    if (job.extractedState.styleDriftNotes.length) {
      qualityWarnings.push(
        `${job.sceneTitle}: ${job.extractedState.styleDriftNotes.join(" ")}`
      );
    }
  });

  return {
    acceptedJobs: acceptedJobs.length,
    pendingJobs,
    uncoveredSceneCount,
    continuityBlockers: dedupeStrings(continuityBlockers),
    qualityWarnings: dedupeStrings(qualityWarnings),
    marketWarnings: dedupeStrings(marketWarnings)
  };
}

export function buildAmazonLaunchPackage(story: StoryDocument): AmazonLaunchPackage {
  const ops = story.book.amazonOps;
  const titleLine = [story.title, ops.subtitle].filter(Boolean).join(": ");
  const checklist = [
    { label: "Manuskript", done: ops.launchChecklist.manuscriptReady },
    { label: "Cover", done: ops.launchChecklist.coverReady },
    { label: "Blurb", done: ops.launchChecklist.blurbReady },
    { label: "Keywords", done: ops.launchChecklist.keywordsReady },
    { label: "Kategorien", done: ops.launchChecklist.categoriesReady },
    { label: "AI Disclosure", done: ops.launchChecklist.aiDisclosureReady }
  ];
  const readinessScore = Math.round(
    (checklist.filter(function (item) {
      return item.done;
    }).length /
      checklist.length) *
      100
  );

  return {
    titleLine,
    subtitle: ops.subtitle,
    seriesLine: ops.seriesName
      ? `${ops.seriesName}${ops.volumeNumber ? ` · Band ${ops.volumeNumber}` : ""}`
      : "",
    penName: ops.penName || story.authorName,
    description: ops.description || buildFallbackDescription(story),
    keywords: ops.keywords,
    categories: ops.categories,
    audienceTags: ops.audienceTags,
    aiDisclosure: formatAiDisclosure(ops.aiDisclosure),
    checklist,
    readinessScore
  };
}

function rankRelevantCodexForScene(
  story: StoryDocument,
  sceneId: string,
  ledger: CanonLedgerEntry[]
) {
  const timeline = story.book.memory.sceneCards.length
    ? story.book.memory.sceneCards
    : deriveTimelineBeats(story);
  const sceneIndex = timeline.findIndex(function (beat) {
    return beat.sceneId === sceneId;
  });
  const currentBeat = timeline[sceneIndex];
  const previousBeat = timeline[sceneIndex - 1] ?? null;
  const nextBeat = timeline[sceneIndex + 1] ?? null;

  return ledger
    .map(function (entry) {
      let score = 0;

      if (currentBeat && entry.sceneIds.includes(currentBeat.sceneId)) {
        score += 5;
      }

      if (previousBeat && entry.sceneIds.includes(previousBeat.sceneId)) {
        score += 2;
      }

      if (nextBeat && entry.sceneIds.includes(nextBeat.sceneId)) {
        score += 1;
      }

      if (entry.kind === "character") {
        score += 1;
      }

      return {
        entry,
        score
      };
    })
    .sort(function (left, right) {
      return right.score - left.score || right.entry.mentionCount - left.entry.mentionCount;
    })
    .filter(function (item) {
      return item.score > 1;
    })
    .map(function (item) {
      return item.entry;
    });
}

function rankCharacterStatesForScene(
  sceneId: string,
  characterLedger: CharacterStateEntry[],
  relevantCodex: CanonLedgerEntry[]
) {
  const relevantCharacterIds = new Set(
    relevantCodex
      .filter(function (entry) {
        return entry.kind === "character";
      })
      .map(function (entry) {
        return entry.entryId;
      })
  );

  return characterLedger
    .map(function (entry) {
      let score = 0;

      if (relevantCharacterIds.has(entry.characterEntryId)) {
        score += 4;
      }

      if (entry.updatedFromSceneId === sceneId) {
        score += 2;
      }

      return {
        entry,
        score
      };
    })
    .sort(function (left, right) {
      return right.score - left.score || right.entry.characterName.localeCompare(left.entry.characterName);
    })
    .filter(function (item) {
      return item.score > 0;
    })
    .map(function (item) {
      return item.entry;
    });
}

function parseLedgerFact(
  rawValue: string,
  fallbackId: string,
  kind: CanonLedgerEntry["kind"]
) {
  const parts = rawValue.split(":");
  const title = clampText(parts[0]?.trim() || rawValue.trim() || fallbackId, 80);
  const summary = clampText(parts.slice(1).join(":").trim() || rawValue.trim(), 220);

  return {
    entryId: fallbackId,
    title,
    kind,
    summary
  };
}

function mergeCanonFact(
  ledger: Map<string, CanonLedgerEntry>,
  nextEntry: CanonLedgerEntry
) {
  const key = normalizeText(nextEntry.title);
  const existing = ledger.get(key);

  if (!existing) {
    ledger.set(key, nextEntry);
    return;
  }

  const mergedSceneIds = dedupeStrings(existing.sceneIds.concat(nextEntry.sceneIds));
  const mentionCount = Math.max(existing.mentionCount, mergedSceneIds.length, nextEntry.mentionCount);

  ledger.set(key, {
    ...existing,
    summary: existing.summary || nextEntry.summary,
    sceneIds: mergedSceneIds,
    mentionCount,
    importance: getCanonImportance(mentionCount),
    status:
      existing.status === "active" || nextEntry.status === "active"
        ? "active"
        : existing.status === "watch" || nextEntry.status === "watch"
          ? "watch"
          : "resolved"
  });
}

function buildStablePrefixSignature(story: StoryDocument, chapterGoal: string) {
  return clampText(
    [
      story.id,
      story.book.masterBrief.premise,
      story.book.masterBrief.readerPromise,
      story.book.masterBrief.storyArchitecture.join("|"),
      story.book.marketBrief.categoryLane,
      story.book.marketBrief.hook,
      chapterGoal,
      story.book.writerConstitution.join("|")
    ].join(" :: "),
    180
  );
}

export function buildNarrativeSceneCardOutlineSteps(sceneCardOutline: string[]) {
  const seen = new Set<string>();

  return sceneCardOutline
    .map(formatSceneCardOutlineStepForNarrative)
    .filter(Boolean)
    .filter(function (step) {
      if (seen.has(step)) {
        return false;
      }

      seen.add(step);
      return true;
    });
}

function formatSceneCardOutlineStepForNarrative(step: string) {
  const trimmed = step.trim();

  if (!trimmed) {
    return "";
  }

  const separatorIndex = trimmed.indexOf(":");

  if (separatorIndex === -1) {
    return trimmed;
  }

  const rawKey = trimmed.slice(0, separatorIndex).trim();
  const value = trimmed.slice(separatorIndex + 1).trim();
  const key = normalizeSceneCardDirectiveKey(rawKey);

  if (!value || SCENE_CARD_CONTEXT_ONLY_KEYS.has(key)) {
    return "";
  }

  const label = SCENE_CARD_NARRATIVE_LABELS[key];

  if (label) {
    return `${label}: ${value}`;
  }

  return `${rawKey}: ${value}`;
}

function normalizeSceneCardDirectiveKey(value: string) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

const SCENE_CARD_CONTEXT_ONLY_KEYS = new Set([
  "pov",
  "ort",
  "location",
  "uhrzeit",
  "time_anchor",
  "timeanchor",
  "zeit",
  "ziel",
  "objective",
  "setup"
]);

const SCENE_CARD_NARRATIVE_LABELS: Record<string, string> = {
  oeffnung: "Oeffnung",
  offnung: "Oeffnung",
  opening: "Einstieg",
  einstieg: "Einstieg",
  druck: "Druck",
  core_action: "Kernaktion",
  coreaction: "Kernaktion",
  kern_aktion: "Kernaktion",
  kernaktion: "Kernaktion",
  dramatic_beat: "Wendung",
  dramaticbeat: "Wendung",
  beat: "Wendung",
  ending: "Ende",
  ende: "Ende",
  ausgang: "Ausgang",
  closing_line: "Schlussbild",
  closingline: "Schlussbild",
  letzter_satz: "Schlussbild",
  letztersatz: "Schlussbild"
};

function buildOutlineSteps(packet: SceneContextPacket) {
  const sceneCardOutline = buildNarrativeSceneCardOutlineSteps(packet.dynamicContext.sceneCardOutline);
  const steps = sceneCardOutline.length
    ? sceneCardOutline
    : [
    `Oeffnung: ${packet.dynamicContext.sceneTitle} mit Fokus auf ${packet.dynamicContext.sceneSummary || "den unmittelbaren Konflikt"}.`,
    packet.stablePrefix.storyArchitecture[0]
      ? `Strukturanker: ${packet.stablePrefix.storyArchitecture[0]}`
      : "",
    `Druck aufbauen: ${packet.dynamicContext.activeThreads[0]?.label || "eine offene Frage"} konkretisieren.`,
    `Wendung: ${packet.dynamicContext.relevantCodex[0]?.title || "der Kernkonflikt"} neu rahmen.`,
    `Nachhall: in ${packet.dynamicContext.nextBeat?.sceneTitle || "den naechsten Plot-Schritt"} ueberleiten.`
  ];

  return steps.filter(Boolean);
}

function buildDraftText(packet: SceneContextPacket, targetWordsMin: number) {
  const lead = packet.dynamicContext.relevantCodex[0];
  const characterState = packet.dynamicContext.relevantCharacterStates[0];
  const thread = packet.dynamicContext.activeThreads[0];
  const previousBeat =
    packet.dynamicContext.previousBeats[packet.dynamicContext.previousBeats.length - 1] ?? null;
  const nextBeat = packet.dynamicContext.nextBeat;
  const targetWords = Math.max(320, Math.min(targetWordsMin, 1200));

  const paragraphs = [
    [
      packet.dynamicContext.sceneTitle,
      packet.dynamicContext.sceneSummary || packet.stablePrefix.premise,
      packet.stablePrefix.marketHook
        ? `Der kommerzielle Zug der Szene bleibt am Hook ausgerichtet: ${packet.stablePrefix.marketHook}`
        : "",
      lead
        ? `${lead.title} liegt als relevanter Kanon offen im Raum: ${lead.summary}`
        : "Die Szene muss den Konflikt aus der Praemisse unmittelbar spueren lassen.",
      characterState
        ? `${characterState.characterName} traegt aktuell diesen Druck: ${characterState.currentState}${
            characterState.snapshots.length
              ? ` Letzte Marker: ${characterState.snapshots.slice(-2).map(function (snapshot) {
                  return snapshot.sourceLabel || snapshot.currentState;
                }).join(" | ")}`
              : ""
          }`
        : "Der Figurenzustand muss aus dem vorhandenen Kanon und der Szene selbst lesbar werden."
    ].join(" "),
    [
      previousBeat
        ? `Direkt davor stand ${previousBeat.sceneTitle}: ${previousBeat.summary || previousBeat.excerpt}`
        : "Es gibt keinen langen Rueckblick; die Szene steigt schnell in die aktuelle Lage ein.",
      packet.stablePrefix.storyArchitecture[1]
        ? `Der Szenendruck bleibt kompatibel mit dem groesseren Strukturziel: ${packet.stablePrefix.storyArchitecture[1]}`
        : "",
      thread
        ? `Der offene Thread lautet im Kern: ${thread.label}. ${thread.detail}`
        : "Der Druck kommt aus der aktuellen Situation und nicht aus abstrakter Erklaerung.",
      "Die Figuren reagieren konkret, nicht essayistisch."
    ].join(" "),
    [
      packet.stablePrefix.readerPromise || "Der Leser erwartet einen spannungsgetragenen, klaren Vorwaertszug.",
      packet.stablePrefix.thematicCore
        ? `Unter der Aktion arbeitet das Thema: ${packet.stablePrefix.thematicCore}.`
        : "Die Szene soll bereits eine lesbare emotionale Verschiebung erzeugen.",
      packet.stablePrefix.categoryLane
        ? `Die Szene muss lesbar in der Marktspur bleiben: ${packet.stablePrefix.categoryLane}.`
        : "",
      nextBeat
        ? `Am Ende muss genug Zug in Richtung ${nextBeat.sceneTitle} bleiben.`
        : "Das Ende muss wie ein bewusst gesetzter Nachhall wirken."
    ].join(" ")
  ];

  const text = paragraphs.join("\n\n");

  return padDraftToTarget(text, targetWords);
}

function extractDraftState(
  packet: SceneContextPacket,
  draftText: string
): Omit<DraftExtractionState, "memorySync"> {
  const canonFacts = packet.dynamicContext.relevantCodex.map(function (entry) {
    return `${entry.title}: ${entry.summary || "Relevanter Kanon fuer diese Szene."}`;
  });

  return {
    newCanonFacts: canonFacts.slice(0, 2),
    characterStateUpdates: packet.dynamicContext.relevantCodex
      .filter(function (entry) {
        return entry.kind === "character";
      })
      .map(function (entry) {
        return `${entry.title} verlaesst die Szene nicht unveraendert; der innere Druck steigt.`;
      })
      .slice(0, 2),
    openThreadsCreated: packet.dynamicContext.activeThreads
      .filter(function (thread) {
        return thread.status === "active";
      })
      .map(function (thread) {
        return thread.label;
      })
      .slice(0, 2),
    openThreadsResolved: [],
    foreshadowingAdded: packet.dynamicContext.nextBeat
      ? [`Die Szene bereitet ${packet.dynamicContext.nextBeat.sceneTitle} lesbar vor.`]
      : [],
    continuityRisks: detectContinuityRisks(packet, draftText),
    styleDriftNotes: detectStyleDrift(packet, draftText)
  };
}

function buildRewriteNotes(
  packet: SceneContextPacket,
  draftText: string,
  extractedState: DraftExtractionState
) {
  const notes = [
    "Oeffnung frueher auf Handlung und Druck setzen.",
    "Exposition knapper halten und in die Wahrnehmung der Szene einbetten."
  ];

  if (packet.dynamicContext.activeThreads.length) {
    notes.push(`Den Thread "${packet.dynamicContext.activeThreads[0].label}" klarer zuspitzen.`);
  }

  if (extractedState.continuityRisks.length) {
    notes.push("Kanon-Bezuege expliziter verankern, damit der Continuity-Pass weniger Warnungen sieht.");
  }

  if (countApproxWords(draftText) < packet.dynamicContext.variables.length + 220) {
    notes.push("Der Draft ist sehr knapp; die emotionale Konsequenz sollte etwas dichter werden.");
  }

  return notes.slice(0, 4);
}

function buildRewriteText(
  packet: SceneContextPacket,
  draftText: string,
  rewriteNotes: string[]
) {
  const codexTail = packet.dynamicContext.relevantCodex
    .slice(0, 2)
    .map(function (entry) {
      return `${entry.title} bleibt dabei nicht Dekor, sondern aktive Reibungsflaeche.`;
    })
    .join(" ");

  const ending = packet.dynamicContext.nextBeat
    ? `Die Szene endet so, dass ${packet.dynamicContext.nextBeat.sceneTitle} logisch und mit Zug folgen kann.`
    : "Die Szene endet auf einem Nachhall, nicht auf einer neutralen Ausblendung.";

  return [
    draftText,
    "",
    `Rewrite-Fokus: ${rewriteNotes.join(" ")}`,
    packet.stablePrefix.publishingGuardrails[0]
      ? `Lesbarkeits-Guardrail: ${packet.stablePrefix.publishingGuardrails[0]}`
      : "",
    codexTail,
    ending
  ]
    .filter(Boolean)
    .join("\n\n");
}

function scoreEntryAgainstScene(entry: WorldBibleEntry, scene: StoryScene) {
  const haystack = normalizeText(
    [scene.title, scene.label, scene.summary]
      .concat(
        scene.blocks.map(function (block) {
          return block.text;
        })
      )
      .join(" ")
  );
  const tokens = entry.title
    .toLowerCase()
    .split(/\s+/)
    .filter(function (token) {
      return token.length >= 3;
    });

  if (!tokens.length) {
    return 0;
  }

  return tokens.reduce(function (score, token) {
    return haystack.includes(normalizeText(token)) ? score + 1 : score;
  }, 0);
}

function buildSceneExcerpt(scene: StoryScene) {
  const text = scene.blocks
    .map(function (block) {
      return block.text.trim();
    })
    .filter(Boolean)
    .join(" ");

  return clampText(text || scene.summary, 220);
}

function buildSceneHeaderHints(sceneCard: TimelineBeat | null) {
  if (!sceneCard) {
    return [];
  }

  const directives = resolveSceneCardDirectives(sceneCard);
  const hints = [directives.timeAnchor, directives.location]
    .map(function (value) {
      return value?.trim() || "";
    })
    .filter(Boolean);

  return hints.slice(0, 2);
}

function buildSceneHardConstraints(story: StoryDocument, sceneCard: TimelineBeat | null) {
  if (!sceneCard) {
    return [];
  }

  const directives = resolveSceneCardDirectives(sceneCard);
  const hardConstraints: string[] = [];

  if (directives.pov) {
    hardConstraints.push(`POV ist ${directives.pov}. Bleib in dieser Perspektive.`)
  }

  if (directives.location) {
    hardConstraints.push(`Ort der Szene: ${directives.location}. Ersetze ihn nicht durch einen anderen Schauplatz.`)
  }

  if (directives.timeAnchor) {
    hardConstraints.push(`Zeit der Szene: ${directives.timeAnchor}. Verwende keine andere konkrete Uhrzeit.`)
  }

  buildSceneCharacterNameHardConstraints(story, sceneCard).forEach(function (constraint) {
    hardConstraints.push(constraint);
  });

  buildSceneObjectColorHardConstraints(story, sceneCard).forEach(function (constraint) {
    hardConstraints.push(constraint);
  });

  buildLockedFactHardConstraints(story, sceneCard).forEach(function (constraint) {
    hardConstraints.push(constraint);
  });

  if (directives.objective) {
    hardConstraints.push(`Szenenziel: ${directives.objective}. Die Szene darf nicht in einen anderen Zweck abdriften.`)
  }

  if (directives.opening) {
    hardConstraints.push(`Pflicht-Einstieg: ${directives.opening}`)
  }

  if (directives.coreAction) {
    hardConstraints.push(`Pflicht-Kernaktion: ${directives.coreAction}`)
  }

  if (directives.dramaticBeat) {
    hardConstraints.push(`Pflicht-Beat: ${directives.dramaticBeat}`)
  }

  if (directives.ending) {
    hardConstraints.push(`Pflicht-Ende: ${directives.ending}`)
  }

  if (directives.closingLine) {
    hardConstraints.push(`Pflicht-Schlusssatz oder Schlussbild: ${directives.closingLine}`)
  }

  directives.custom.forEach(function (entry) {
    const normalizedKey = normalizeDirectiveKey(entry.key);

    if (HARD_CUSTOM_DIRECTIVE_KEYS.has(normalizedKey)) {
      hardConstraints.push(formatHardCustomDirective(normalizedKey, entry.value));
      return;
    }

    if (
      normalizedKey.endsWith("_moment") ||
      normalizedKey.endsWith("_plant") ||
      normalizedKey.endsWith("_payoff") ||
      normalizedKey === "setup" ||
      normalizedKey === "subtext" ||
      normalizedKey === "charakter_subtext" ||
      normalizedKey === "buch2_hinweis"
    ) {
      hardConstraints.push(`${entry.key}: ${entry.value}`)
    }
  });

  return dedupeStrings(hardConstraints).slice(0, 20);
}

function formatHardCustomDirective(normalizedKey: string, value: string) {
  if (normalizedKey === "proof_object" || normalizedKey === "beweisobjekt") {
    return `Pflicht-Beweisobjekt: ${value}. Dieses Beweisobjekt darf nicht ersetzt, umgefaerbt oder weggelassen werden.`;
  }

  if (normalizedKey === "alltagswaffe") {
    return `Pflicht-Alltagswaffe: ${value}. Diese Alltagslogik muss konkret sichtbar bleiben.`;
  }

  if (normalizedKey === "ersetzungsmoment") {
    return `Pflicht-Ersetzungsmoment: ${value}. Die Szene darf diese Ersetzungslogik nicht verwischen.`;
  }

  if (normalizedKey === "mila_kindmoment" || normalizedKey === "kindmoment") {
    return `Pflicht-Kindmoment: ${value}. Mila bleibt Kind; das Objekt oder die Handlung darf nicht symbolisch umgebaut werden.`;
  }

  if (normalizedKey === "object_anchor" || normalizedKey === "prop_anchor") {
    return `Pflicht-Objektanker: ${value}. Farbe, Funktion und Besitzlogik duerfen nicht driften.`;
  }

  return `Pflicht-False-Friend-Signal: ${value}. Das Hilfssignal muss plausibel bleiben und darf nicht villainhaft werden.`;
}

function buildSceneCharacterNameHardConstraints(story: StoryDocument, sceneCard: TimelineBeat) {
  const sceneText = normalizeGuardText(collectSceneCardTextEntries(sceneCard).join(" "));

  return story.worldBible
    .filter(function (entry) {
      return entry.kind === "character";
    })
    .map(function (entry) {
      const nameParts = entry.title.trim().split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] ?? "";

      if (nameParts.length < 2 || firstName.length < 3) {
        return "";
      }

      if (
        normalizedTextContainsTerm(sceneText, firstName) ||
        normalizedTextContainsTerm(sceneText, entry.title)
      ) {
        return `Kanon-Name: ${firstName} heisst vollstaendig ${entry.title}. Keine anderen Nachnamen verwenden.`;
      }

      return "";
    })
    .filter(Boolean);
}

function buildSceneObjectColorHardConstraints(story: StoryDocument, sceneCard: TimelineBeat) {
  const sceneText = normalizeGuardText(collectSceneCardTextEntries(sceneCard).join(" "));

  return resolveStoryObjectColorAnchors(story)
    .filter(function (anchor) {
      return normalizedTextContainsTerm(sceneText, anchor.objectLabel);
    })
    .map(function (anchor) {
      return `Kanon-Objektanker: ${anchor.objectLabel} bleibt ${anchor.colorLabel}. Keine andere Farbe oder Ersatz-Requisite verwenden.`;
    });
}

function buildLockedFactHardConstraints(story: StoryDocument, sceneCard: TimelineBeat) {
  const lockedFacts = story.book.memory.lockedFacts;
  const sceneText = normalizeGuardText(collectSceneCardTextEntries(sceneCard).join(" "));
  const constraints: string[] = [];

  if (
    lockedFacts.institutionName &&
    (normalizedTextContainsTerm(sceneText, lockedFacts.institutionName) || normalizedTextContainsTerm(sceneText, "kita"))
  ) {
    constraints.push(
      `Locked Fact - Kita: ${lockedFacts.institutionName}. Wenn die Einrichtung namentlich auftaucht, muss sie so heissen.`
    );
  }

  if (
    lockedFacts.incidentDate &&
    (
      normalizedTextContainsTerm(sceneText, lockedFacts.incidentDate) ||
      normalizedTextContainsTerm(sceneText, "datum") ||
      normalizedTextContainsTerm(sceneText, "vortag") ||
      normalizedTextContainsTerm(sceneText, "app-eintrag") ||
      normalizedTextContainsTerm(sceneText, "abschlussvermerk")
    )
  ) {
    constraints.push(`Locked Fact - Vorfallsdatum: ${lockedFacts.incidentDate}.`);
  }

  if (
    lockedFacts.incidentTime &&
    (
      normalizedTextContainsTerm(sceneText, lockedFacts.incidentTime) ||
      normalizedTextContainsTerm(sceneText, "abhol") ||
      normalizedTextContainsTerm(sceneText, "app-eintrag") ||
      normalizedTextContainsTerm(sceneText, "abschlussvermerk")
    )
  ) {
    constraints.push(`Locked Fact - Dokumentierte Abholzeit: ${lockedFacts.incidentTime} Uhr.`);
  }

  if (
    lockedFacts.notificationTime &&
    (
      normalizedTextContainsTerm(sceneText, lockedFacts.notificationTime) ||
      normalizedTextContainsTerm(sceneText, "app") ||
      normalizedTextContainsTerm(sceneText, "benachrichtigung")
    )
  ) {
    constraints.push(`Locked Fact - App-Benachrichtigung: ${lockedFacts.notificationTime} Uhr.`);
  }

  if (
    lockedFacts.firstOfficeTime &&
    (
      normalizedTextContainsTerm(sceneText, lockedFacts.firstOfficeTime) ||
      normalizedTextContainsTerm(sceneText, "leitungsbuero") ||
      normalizedTextContainsTerm(sceneText, "petra")
    )
  ) {
    constraints.push(`Locked Fact - Leitungsbuero-Zeit: ${lockedFacts.firstOfficeTime} Uhr.`);
  }

  if (
    lockedFacts.evaAlibiLocation &&
    (
      normalizedTextContainsTerm(sceneText, lockedFacts.evaAlibiLocation) ||
      normalizedTextContainsTerm(sceneText, "nachweisbar") ||
      normalizedTextContainsTerm(sceneText, "kundentermin") ||
      normalizedTextContainsTerm(sceneText, "alibi")
    )
  ) {
    constraints.push(`Locked Fact - Eva-Alibi-Ort: ${lockedFacts.evaAlibiLocation}.`);
  }

  if (
    lockedFacts.evaAlibiWindow &&
    (
      normalizedTextContainsTerm(sceneText, lockedFacts.evaAlibiWindow) ||
      normalizedTextContainsTerm(sceneText, "kundentermin") ||
      normalizedTextContainsTerm(sceneText, "alibi") ||
      normalizedTextContainsTerm(sceneText, "frankfurt") ||
      normalizedTextContainsTerm(sceneText, "maintower") ||
      normalizedTextContainsTerm(sceneText, "termin")
    )
  ) {
    constraints.push(`Locked Fact - Eva-Alibi-Fenster: ${lockedFacts.evaAlibiWindow}.`);
  }

  if (
    lockedFacts.documentedPickupPerson &&
    (
      normalizedTextContainsTerm(sceneText, lockedFacts.documentedPickupPerson) ||
      normalizedTextContainsTerm(sceneText, "abholung")
    )
  ) {
    constraints.push(`Locked Fact - Dokumentierte Abholperson: ${lockedFacts.documentedPickupPerson}.`);
  }

  return constraints;
}

function resolveStoryObjectColorAnchors(story: StoryDocument): ObjectColorAnchor[] {
  const sceneCards = story.book.memory.sceneCards.length
    ? story.book.memory.sceneCards
    : deriveTimelineBeats(story);
  const anchorsByObject = new Map<
    string,
    {
      objectLabel: string;
      colors: Map<
        string,
        {
          phrase: string;
          sceneIds: string[];
          protectedHit: boolean;
        }
      >;
    }
  >();

  sceneCards.forEach(function (sceneCard) {
    collectSceneCardTextEntriesWithHardness(sceneCard).forEach(function (entry) {
      extractObjectColorAnchors([entry.value]).forEach(function (hit) {
        const existing = anchorsByObject.get(hit.objectKey) ?? {
          objectLabel: hit.objectLabel,
          colors: new Map()
        };
        const colorBucket = existing.colors.get(hit.colorLabel) ?? {
          phrase: hit.phrase,
          sceneIds: [],
          protectedHit: false
        };

        colorBucket.sceneIds = dedupeStrings(colorBucket.sceneIds.concat(sceneCard.sceneId));
        colorBucket.protectedHit = colorBucket.protectedHit || entry.hard;
        existing.colors.set(hit.colorLabel, colorBucket);
        anchorsByObject.set(hit.objectKey, existing);
      });
    });
  });

  story.worldBible
    .filter(function (entry) {
      return entry.kind === "object";
    })
    .forEach(function (entry) {
      extractObjectColorAnchors([`${entry.title} ${entry.summary}`]).forEach(function (hit) {
        const sceneIds = sceneCards
          .filter(function (sceneCard) {
            return normalizedTextContainsTerm(
              normalizeGuardText(collectSceneCardTextEntries(sceneCard).join(" ")),
              hit.objectLabel
            );
          })
          .map(function (sceneCard) {
            return sceneCard.sceneId;
          });
        const existing = anchorsByObject.get(hit.objectKey) ?? {
          objectLabel: hit.objectLabel,
          colors: new Map()
        };
        const colorBucket = existing.colors.get(hit.colorLabel) ?? {
          phrase: hit.phrase,
          sceneIds: [],
          protectedHit: false
        };

        colorBucket.sceneIds = dedupeStrings(colorBucket.sceneIds.concat(sceneIds));
        colorBucket.protectedHit = true;
        existing.colors.set(hit.colorLabel, colorBucket);
        anchorsByObject.set(hit.objectKey, existing);
      });
    });

  return Array.from(anchorsByObject.entries())
    .map(function ([objectKey, entry]) {
      if (entry.colors.size !== 1) {
        return null;
      }

      const colorEntry = Array.from(entry.colors.entries())[0];

      if (!colorEntry) {
        return null;
      }

      const [colorLabel, colorBucket] = colorEntry;

      if (colorBucket.sceneIds.length < 2 && !colorBucket.protectedHit) {
        return null;
      }

      return {
        objectLabel: entry.objectLabel,
        objectKey,
        colorLabel,
        phrase: colorBucket.phrase,
        sceneIds: colorBucket.sceneIds,
        protectedHit: colorBucket.protectedHit
      };
    })
    .filter(function (anchor): anchor is ObjectColorAnchor {
      return Boolean(anchor);
    });
}

function collectSceneCardTextEntries(sceneCard: TimelineBeat) {
  return collectSceneCardTextEntriesWithHardness(sceneCard).map(function (entry) {
    return entry.value;
  });
}

function collectSceneCardTextEntriesWithHardness(sceneCard: TimelineBeat) {
  const directives = resolveSceneCardDirectives(sceneCard);
  const entries: Array<{ value: string; hard: boolean }> = [
    { value: sceneCard.sceneTitle, hard: false },
    { value: sceneCard.summary, hard: false },
    { value: sceneCard.excerpt, hard: false },
    { value: sceneCard.chapterGoal, hard: false },
    { value: directives.objective || "", hard: true },
    { value: directives.opening || "", hard: true },
    { value: directives.coreAction || "", hard: true },
    { value: directives.dramaticBeat || "", hard: true },
    { value: directives.ending || "", hard: true },
    { value: directives.closingLine || "", hard: true }
  ];

  sceneCard.outline.forEach(function (line) {
    entries.push({ value: line, hard: false });
  });

  directives.custom.forEach(function (entry) {
    entries.push({
      value: entry.value,
      hard: HARD_CUSTOM_DIRECTIVE_KEYS.has(normalizeDirectiveKey(entry.key))
    });
  });

  return entries.filter(function (entry) {
    return entry.value.trim().length > 0;
  });
}

function resolveSceneCardDirectives(sceneCard: TimelineBeat) {
  const fallbackFields = parseSceneCardOutlineFields(sceneCard.outline);
  const nextDirectives = sceneCard.directives ?? createEmptyBookSceneCardDirectives();
  const customEntries = nextDirectives.custom.length
    ? nextDirectives.custom
    : Object.entries(fallbackFields)
        .filter(function ([key, value]) {
          if (!value) {
            return false;
          }

          return ![
            "pov",
            "ort",
            "uhrzeit",
            "ziel",
            "einstieg",
            "kern_aktion",
            "beat",
            "ende",
            "letzter_satz"
          ].includes(key);
        })
        .map(function ([key, value]) {
          return { key, value };
        });

  return {
    pov: nextDirectives.pov || fallbackFields.pov || null,
    location: nextDirectives.location || fallbackFields.ort || null,
    timeAnchor: nextDirectives.timeAnchor || fallbackFields.uhrzeit || null,
    objective: nextDirectives.objective || fallbackFields.ziel || null,
    opening: nextDirectives.opening || fallbackFields.einstieg || null,
    coreAction: nextDirectives.coreAction || fallbackFields.kern_aktion || null,
    dramaticBeat: nextDirectives.dramaticBeat || fallbackFields.beat || null,
    ending: nextDirectives.ending || fallbackFields.ende || null,
    closingLine: nextDirectives.closingLine || fallbackFields.letzter_satz || null,
    custom: customEntries
  };
}

function extractWordTargetFromBeat(beat: TimelineBeat | null, key: string): number | null {
  if (!beat) return null;
  const directives = resolveSceneCardDirectives(beat);
  const entry = directives.custom.find(function (e) {
    return normalizeDirectiveKey(e.key) === key;
  });
  if (!entry) return null;
  const parsed = parseInt(entry.value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseSceneCardOutlineFields(outline: string[]) {
  return outline.reduce(function (fields, line) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      return fields;
    }

    const rawKey = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!rawKey || !value) {
      return fields;
    }

    const normalizedKey = normalizeText(rawKey)
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    fields[normalizedKey] = value;
    return fields;
  }, {} as Record<string, string>);
}

function buildSceneCardOutline(scene: StoryScene, chapterGoal: string, nextSceneTitle: string | null) {
  const summary = clampText(scene.summary || scene.title || "Die Szene braucht einen klaren Konflikt.", 140);
  const excerpt = buildSceneExcerpt(scene);
  const scenePressure = excerpt && excerpt !== summary
    ? clampText(excerpt, 140)
    : clampText(
        scene.blocks
          .map(function (block) {
            return block.text.trim();
          })
          .filter(Boolean)[0] || "Der Druck der Szene muss konkret und beobachtbar werden.",
        140
      );

  return [
    `Oeffnung: ${summary}`,
    `Druck: ${scenePressure}`,
    `Ziel: ${clampText(chapterGoal || scene.summary || scene.title || "Die Szene braucht ein klares Ziel.", 140)}`,
    nextSceneTitle
      ? `Ausgang: Die Szene kippt in ${nextSceneTitle}.`
      : "Ausgang: Die Szene endet mit Nachhall oder offener Drohung."
  ].filter(Boolean);
}

function deriveSceneSummary(job: BookDraftJob) {
  return clampText(
    job.contextSnapshot.sceneSummary ||
      job.outline[0] ||
      `${job.sceneTitle} wird ueber den lokalen Draft-Job neu ausgerichtet.`,
    180
  );
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function clampText(value: string, maxLength: number) {
  const compact = value.replace(/\s+/g, " ").trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength - 1).trim()}…`;
}

function looksLikeOpenQuestion(value: string) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return false;
  }

  return /(\?|warum|wieso|wer |wie |weshalb|verschwunden|geheim|notizbuch|ring|auftrag)/.test(
    normalized
  );
}

function createThreadLabel(summary: string, fallbackTitle: string) {
  const cleaned = clampText(summary, 72);

  if (cleaned) {
    return cleaned;
  }

  return `Offene Frage aus ${fallbackTitle}`;
}

function dedupeThreads(threads: OpenThread[]) {
  const seen = new Set<string>();

  return threads.filter(function (thread) {
    const key = `${thread.sourceSceneId}:${thread.label.toLowerCase()}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function getCanonImportance(mentionCount: number): CanonImportance {
  if (mentionCount >= 2) {
    return "high";
  }

  if (mentionCount === 1) {
    return "medium";
  }

  return "low";
}

function detectContinuityRisks(packet: SceneContextPacket, draftText: string) {
  const risks: string[] = [];

  if (!packet.dynamicContext.relevantCodex.length) {
    risks.push("Keine Codex-Anker im Kontext; der Draft koennte zu frei driften.");
  }

  if (countApproxWords(draftText) < 220) {
    risks.push("Der Draft ist fuer eine tragende Szene sehr knapp und koennte nur Skelettniveau haben.");
  }

  if (!packet.dynamicContext.activeThreads.length) {
    risks.push("Es gibt keinen klaren offenen Thread fuer die Szene; Konsequenzfluss pruefen.");
  }

  return dedupeStrings(risks.concat(auditSceneContinuityGuards(packet, draftText)));
}

export function auditSceneContinuityGuards(packet: SceneContextPacket, proseText: string): string[] {
  const issues: string[] = [];
  const normalizedProse = normalizeGuardText(proseText);

  parseNameHardConstraints(packet.dynamicContext.sceneHardConstraints).forEach(function (constraint) {
    findWrongSurnameMentions(proseText, constraint.firstName, constraint.fullName).forEach(function (wrongName) {
      issues.push(
        `Namensdrift: ${wrongName} muss ${constraint.fullName} bleiben.`
      );
    });
  });

  parseObjectColorHardConstraints(packet.dynamicContext.sceneHardConstraints).forEach(function (constraint) {
    const proseAnchors = extractObjectColorAnchors([proseText]).filter(function (anchor) {
      return anchor.objectKey === constraint.objectKey;
    });
    const wrongColor = proseAnchors.find(function (anchor) {
      return anchor.colorLabel !== constraint.colorLabel;
    });

    if (wrongColor) {
      issues.push(
        `Farbdrift: ${constraint.objectLabel} ist ${constraint.colorLabel}, nicht ${wrongColor.colorLabel}.`
      );
      return;
    }

    if (!normalizedTextContainsTerm(normalizedProse, constraint.objectLabel)) {
      issues.push(
        `Objektdrift: ${constraint.objectLabel} fehlt, obwohl der Szenenanker es verlangt.`
      );
      return;
    }

    if (!proseAnchors.some(function (anchor) {
      return anchor.colorLabel === constraint.colorLabel;
    })) {
      issues.push(
        `Farbanker fehlt: ${constraint.objectLabel} muss lokal als ${constraint.colorLabel} gefuehrt werden.`
      );
    }
  });

  parseRequiredSceneAnchors(packet.dynamicContext.sceneHardConstraints).forEach(function (anchor) {
    if (!requiredAnchorAppears(normalizedProse, anchor.value)) {
      issues.push(`${anchor.label} nicht sichtbar: ${clampText(anchor.value, 90)}`);
    }
  });

  parseLockedFactConstraints(packet.dynamicContext.sceneHardConstraints).forEach(function (constraint) {
    if (constraint.kind === "institution") {
      if (!requiredAnchorAppears(normalizedProse, constraint.value)) {
        issues.push(`${constraint.label} driftet oder fehlt: ${clampText(constraint.value, 90)}`);
      }

      findWrongInstitutionMentions(proseText, constraint.value).forEach(function (wrongName) {
        issues.push(`Institutionsdrift: ${wrongName} muss ${constraint.value} bleiben.`);
      });
      return;
    }

    if (constraint.kind === "incident_date") {
      if (!containsIncidentDate(proseText, constraint.value)) {
        issues.push(`${constraint.label} driftet oder fehlt: ${clampText(constraint.value, 90)}`);
      }
      return;
    }

    if (constraint.kind === "time_window") {
      if (!containsLockedTimeWindow(proseText, constraint.value)) {
        issues.push(`${constraint.label} driftet oder fehlt: ${clampText(constraint.value, 90)}`);
      }
      return;
    }

    if (!requiredAnchorAppears(normalizedProse, constraint.value)) {
      issues.push(`${constraint.label} driftet oder fehlt: ${clampText(constraint.value, 90)}`);
    }
  });

  return dedupeStrings(issues).slice(0, 8);
}

function detectMemorySyncValueDrift(story: StoryDocument, value: string) {
  const issues: string[] = [];
  const proseAnchors = extractObjectColorAnchors([value]);

  story.worldBible
    .filter(function (entry) {
      return entry.kind === "character";
    })
    .forEach(function (entry) {
      const firstName = entry.title.trim().split(/\s+/).filter(Boolean)[0] ?? "";

      if (!firstName) {
        return;
      }

      findWrongSurnameMentions(value, firstName, entry.title).forEach(function (wrongName) {
        issues.push(`Namensdrift: ${wrongName} muss ${entry.title} bleiben.`);
      });
    });

  resolveStoryObjectColorAnchors(story).forEach(function (anchor) {
    proseAnchors
      .filter(function (candidate) {
        return candidate.objectKey === anchor.objectKey && candidate.colorLabel !== anchor.colorLabel;
      })
      .forEach(function (candidate) {
        issues.push(
          `Farbdrift: ${anchor.objectLabel} ist ${anchor.colorLabel}, nicht ${candidate.colorLabel}.`
        );
      });
  });

  return dedupeStrings(issues);
}

function parseNameHardConstraints(values: string[]) {
  return values
    .map(function (value) {
      const match = value.match(/^Kanon-Name: (.+?) heisst vollstaendig (.+?)\./);

      if (!match) {
        return null;
      }

      return {
        firstName: match[1],
        fullName: match[2]
      };
    })
    .filter(function (entry): entry is { firstName: string; fullName: string } {
      return Boolean(entry);
    });
}

function parseObjectColorHardConstraints(values: string[]) {
  return values
    .map(function (value) {
      const match = value.match(/^Kanon-Objektanker: (.+?) bleibt ([^.]+)\./);

      if (!match) {
        return null;
      }

      const colorLabel = normalizeColorWord(match[2]);
      const objectLabel = normalizeObjectLabel(match[1]);

      if (!colorLabel || !objectLabel) {
        return null;
      }

      return {
        objectLabel,
        objectKey: normalizeGuardToken(objectLabel),
        colorLabel
      };
    })
    .filter(function (entry): entry is { objectLabel: string; objectKey: string; colorLabel: string } {
      return Boolean(entry);
    });
}

function parseRequiredSceneAnchors(values: string[]) {
  return values
    .map(function (value) {
      const match = value.match(/^(Pflicht-(?:Beweisobjekt|Alltagswaffe|Ersetzungsmoment|Kindmoment|Objektanker)): (.+?)\./);

      if (!match) {
        return null;
      }

      return {
        label: match[1],
        value: match[2]
      };
    })
    .filter(function (entry): entry is { label: string; value: string } {
      return Boolean(entry);
    });
}

function parseLockedFactConstraints(values: string[]) {
  return values
    .map(function (value) {
      const match = value.match(/^Locked Fact - ([^:]+): (.+?)\.(?:\s|$)/);

      if (!match) {
        return null;
      }

      const label = match[1];
      const factValue = match[2];
      let kind: "generic" | "institution" | "incident_date" | "time_window" = "generic";

      if (/kita/i.test(label)) {
        kind = "institution";
      } else if (/vorfallsdatum/i.test(label)) {
        kind = "incident_date";
      } else if (/alibi-fenster/i.test(label)) {
        kind = "time_window";
      }

      return {
        label: `Locked Fact - ${label}`,
        value: factValue,
        kind
      };
    })
    .filter(function (
      entry
    ): entry is {
      label: string;
      value: string;
      kind: "generic" | "institution" | "incident_date" | "time_window";
    } {
      return Boolean(entry);
    });
}

function containsIncidentDate(proseText: string, incidentDate: string) {
  const normalizedDate = incidentDate.trim();

  if (!normalizedDate) {
    return true;
  }

  const proseMatches = proseText.match(/\b\d{1,2}\.\d{1,2}\.?\b/g) ?? [];
  const normalizedExpected = normalizedDate.replace(/\.$/, "");

  return proseMatches.some(function (match) {
    return match.replace(/\.$/, "") === normalizedExpected;
  });
}

function containsLockedTimeWindow(proseText: string, timeWindow: string) {
  const expectedTimes = Array.from(timeWindow.matchAll(/\b\d{1,2}:\d{2}\b/g)).map(function (match) {
    return match[0];
  });

  if (expectedTimes.length < 2) {
    return requiredAnchorAppears(normalizeGuardText(proseText), timeWindow);
  }

  const proseTimes = new Set(
    Array.from(proseText.matchAll(/\b\d{1,2}:\d{2}\b/g)).map(function (match) {
      return match[0];
    })
  );

  return expectedTimes.every(function (time) {
    return proseTimes.has(time);
  });
}

function findWrongInstitutionMentions(proseText: string, expectedName: string) {
  const wrongNames: string[] = [];
  const pattern = /\bKita\s+([A-ZÄÖÜ][\p{L}ßäöüÄÖÜ-]+)/gu;
  const expected = normalizeGuardText(expectedName);
  let match: RegExpExecArray | null = pattern.exec(proseText);

  while (match) {
    const actualName = match[1];

    if (normalizeGuardText(actualName) !== expected) {
      wrongNames.push(`Kita ${actualName}`);
    }

    match = pattern.exec(proseText);
  }

  return dedupeStrings(wrongNames);
}

function requiredAnchorAppears(normalizedProse: string, value: string) {
  const terms = extractGuardTerms(value);

  if (!terms.length) {
    return true;
  }

  const proseWords = normalizedProse.split(/\s+/);

  return terms.some(function (term) {
    if (normalizedTextContainsTerm(normalizedProse, term)) {
      return true;
    }

    // German compound words: "Namensetiketten" contains "etiketten" which appears standalone in prose
    if (term.length >= 8) {
      if (proseWords.some(function (word) {
        return word.length >= 5 && term.endsWith(word);
      })) {
        return true;
      }

      // "freigabelink" → prefix "freigabe" matches "freigabeseite" in prose
      const prefix = term.slice(0, Math.min(term.length - 2, 8));
      if (prefix.length >= 6 && proseWords.some(function (word) {
        return word.startsWith(prefix);
      })) {
        return true;
      }
    }

    return false;
  });
}

function findWrongSurnameMentions(proseText: string, firstName: string, fullName: string) {
  const expectedFullName = normalizeGuardText(fullName);
  const firstNamePattern = escapeRegExp(firstName);
  const expectedTailWordCount = Math.max(1, fullName.trim().split(/\s+/).length - 1);
  const tailPattern = Array.from({ length: expectedTailWordCount }, function () {
    return "[A-ZÄÖÜ][\\p{L}ßäöüÄÖÜ-]+";
  }).join("\\s+");
  const pattern = new RegExp(
    `\\b${firstNamePattern}\\s+(${tailPattern})`,
    "gu"
  );
  const wrongNames: string[] = [];
  let match: RegExpExecArray | null = pattern.exec(proseText);

  while (match) {
    const actualFullName = `${firstName} ${match[1]}`;

    if (normalizeGuardText(actualFullName) !== expectedFullName) {
      wrongNames.push(actualFullName);
    }

    match = pattern.exec(proseText);
  }

  return dedupeStrings(wrongNames);
}

function extractObjectColorAnchors(values: string[]) {
  const pattern = new RegExp(`\\b(${COLOR_WORD_PATTERN})\\s+([\\p{L}][\\p{L}-]{2,})`, "giu");
  const anchors: Array<{
    objectLabel: string;
    objectKey: string;
    colorLabel: string;
    phrase: string;
  }> = [];

  values.forEach(function (value) {
    let match: RegExpExecArray | null = pattern.exec(value);

    while (match) {
      const colorLabel = normalizeColorWord(match[1]);
      const objectLabel = normalizeObjectLabel(match[2]);
      const objectKey = normalizeGuardToken(objectLabel);

      if (
        colorLabel &&
        objectLabel &&
        /^[A-ZÄÖÜ]/.test(objectLabel) &&
        objectKey &&
        !CONTINUITY_GUARD_STOPWORDS.has(objectKey)
      ) {
        anchors.push({
          objectLabel,
          objectKey,
          colorLabel,
          phrase: `${match[1]} ${match[2]}`
        });
      }

      match = pattern.exec(value);
    }
  });

  return anchors;
}

function normalizeDirectiveKey(value: string) {
  return normalizeGuardText(value).replace(/\s+/g, "_");
}

function normalizeColorWord(value: string) {
  const normalized = normalizeGuardToken(value);

  if (normalized.startsWith("gelb")) return "gelb";
  if (normalized.startsWith("rosa")) return "rosa";
  if (normalized.startsWith("pink")) return "pink";
  if (normalized.startsWith("lila")) return "lila";
  if (normalized.startsWith("violett")) return "violett";
  if (normalized.startsWith("rot")) return "rot";
  if (normalized.startsWith("blau")) return "blau";
  if (normalized.startsWith("gruen") || normalized.startsWith("grun")) return "gruen";
  if (normalized.startsWith("schwarz")) return "schwarz";
  if (normalized.startsWith("grau")) return "grau";
  if (normalized.startsWith("braun")) return "braun";
  if (normalized.startsWith("orange")) return "orange";

  return null;
}

function normalizeObjectLabel(value: string) {
  return value
    .replace(/^[^A-Za-zÄÖÜäöüß]+|[^A-Za-zÄÖÜäöüß-]+$/g, "")
    .trim();
}

function extractGuardTerms(value: string) {
  return normalizeGuardText(value)
    .split(/\s+/)
    .map(function (term) {
      return normalizeGuardToken(term);
    })
    .filter(function (term) {
      return term.length >= 4 && !CONTINUITY_GUARD_STOPWORDS.has(term);
    });
}

function normalizeGuardText(value: string) {
  return normalizeText(value)
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeGuardToken(value: string) {
  return normalizeGuardText(value).replace(/\s+/g, " ").trim();
}

function normalizedTextContainsTerm(normalizedText: string, rawTerm: string) {
  const normalizedTerm = normalizeGuardToken(rawTerm);

  if (!normalizedTerm) {
    return false;
  }

  return new RegExp(`(^|\\s)${escapeRegExp(normalizedTerm)}(\\s|$)`).test(normalizedText);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectStyleDrift(packet: SceneContextPacket, draftText: string) {
  const notes: string[] = [];

  if (draftText.includes("Die Figuren reagieren konkret, nicht essayistisch.")) {
    notes.push("Der lokale Draft enthaelt noch Metasprache und braucht spaetere Modell-Politur.");
  }

  if (!packet.stablePrefix.readerPromise) {
    notes.push("Reader Promise ist leer; Stilsteuerung bleibt dadurch allgemein.");
  }

  return notes;
}

function padDraftToTarget(value: string, targetWords: number) {
  const buffer = [
    "Jeder Absatz bleibt funktional und versucht zugleich, atmosphaerische Reibung zu tragen.",
    "Der Text ist noch kein fertiger Romanstil, aber ein belastbarer Rohzug fuer spaetere Modell- und Human-Paesse.",
    "Konflikt, Wahrnehmung und Konsequenz werden enger zusammengedraengt als in einer reinen Outline."
  ];

  let nextValue = value;
  let bufferIndex = 0;

  while (countApproxWords(nextValue) < targetWords && bufferIndex < buffer.length) {
    nextValue = `${nextValue}\n\n${buffer[bufferIndex]}`;
    bufferIndex += 1;
  }

  return nextValue;
}

function countApproxWords(value: string) {
  const matches = value.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

function splitIntoParagraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map(function (paragraph) {
      return paragraph.trim();
    })
    .filter(Boolean);
}

function createLocalId(prefix: string) {
  return createUuid();
}

function dedupeStrings(values: string[]) {
  return Array.from(new Set(values));
}

function buildFallbackDescription(story: StoryDocument) {
  const premise = story.book.masterBrief.premise || story.book.marketBrief.hook;
  const promise = story.book.masterBrief.readerPromise;

  return [premise, promise].filter(Boolean).join(" ");
}

function formatAiDisclosure(value: StoryDocument["book"]["amazonOps"]["aiDisclosure"]) {
  if (value === "generated") {
    return "AI-generated content";
  }

  if (value === "human_led") {
    return "Human-led project";
  }

  return "AI-assisted content";
}

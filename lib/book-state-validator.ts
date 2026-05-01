import { createUuid } from "@/lib/id";
import {
  normalizeBookStateDiff,
  type BookCanonFact,
  type BookDraftJob,
  type BookKnowledgeState,
  type BookObjectState,
  type BookObjectStateChange,
  type BookPromiseState,
  type BookStateObjectCandidate,
  type BookStateDiff,
  type BookStateDiffValidationResult,
  type DraftExtractionState,
  type StoryDocument
} from "@/lib/story-schema";

export function buildStateDiffFromExtraction(params: {
  sceneId: string;
  extractedState: DraftExtractionState;
  objectCandidates?: BookStateObjectCandidate[];
  sceneSoftGuidance?: string[];
}): BookStateDiff {
  const objectCandidates = params.objectCandidates ?? [];
  const extractionText = buildExtractionSearchText(params.extractedState);
  const hardObjectChanges = objectCandidates
    .filter(function (candidate) {
      return candidate.hardness === "hard" || candidateAppearsInExtraction(candidate, extractionText);
    })
    .filter(function (candidate) {
      return candidate.hardness === "hard";
    })
    .map(function (candidate): BookObjectStateChange {
      return {
        objectName: candidate.objectName,
        conditionChange: `Scene-card anchor from ${candidate.sourceField}`,
        evidenceQuote: `${candidate.sourceField}: ${candidate.objectName}`,
        confidence: 0.75
      };
    });
  const softSceneLocalDetails = objectCandidates
    .filter(function (candidate) {
      return candidate.hardness === "soft" && candidateAppearsInExtraction(candidate, extractionText);
    })
    .map(function (candidate) {
      return `Soft object candidate (${candidate.sourceField}): ${candidate.objectName}`;
    });
  const knowledgeLocalDetails = extractKnowledgeLocalDetails(params.sceneSoftGuidance ?? []);

  return {
    sceneId: params.sceneId,
    objectChanges: dedupeObjectChanges(hardObjectChanges),
    knowledgeChanges: [],
    promiseUpdates: [],
    characterStateUpdates: params.extractedState.characterStateUpdates.slice(0, 6),
    relationshipNotes: [],
    proposedCanonFacts: params.extractedState.newCanonFacts
      .concat(params.extractedState.foreshadowingAdded)
      .slice(0, 6),
    sceneLocalDetails: dedupeStrings(softSceneLocalDetails.concat(knowledgeLocalDetails)).slice(0, 8),
    conflicts: [],
    requiresHumanReview: softSceneLocalDetails.length > 0 || knowledgeLocalDetails.length > 0
  };
}

function buildExtractionSearchText(extractedState: DraftExtractionState) {
  return normalizeKey(
    extractedState.newCanonFacts
      .concat(extractedState.foreshadowingAdded)
      .concat(extractedState.characterStateUpdates)
      .join(" ")
  );
}

function candidateAppearsInExtraction(candidate: BookStateObjectCandidate, extractionText: string) {
  return extractionText.includes(normalizeKey(candidate.objectName));
}

function extractKnowledgeLocalDetails(sceneSoftGuidance: string[]) {
  return sceneSoftGuidance
    .filter(function (entry) {
      const normalized = normalizeKey(entry);
      return normalized.startsWith("wissensgrenze") || normalized.startsWith("information_gap");
    })
    .map(function (entry) {
      return `Scene knowledge note: ${entry}`;
    });
}

function dedupeObjectChanges(changes: BookObjectStateChange[]) {
  const byName = new Map<string, BookObjectStateChange>();

  changes.forEach(function (change) {
    byName.set(normalizeKey(change.objectName), change);
  });

  return Array.from(byName.values());
}

export function validateBookStateDiff(
  story: StoryDocument | null,
  diff: BookStateDiff
): BookStateDiffValidationResult {
  const conflicts = dedupeStrings(
    diff.conflicts
      .concat(validateObjectChanges(story, diff.objectChanges))
      .concat(validateKnowledgeChanges(story, diff))
      .concat(validatePromiseUpdates(diff.promiseUpdates))
  );

  return {
    valid: conflicts.length === 0,
    conflicts,
    requiresHumanReview: diff.requiresHumanReview || conflicts.length > 0
  };
}

export function approveBookStateDiff(story: StoryDocument, jobId: string): StoryDocument {
  return updateBookStateDiffStatus(story, jobId, "approved");
}

export function rejectBookStateDiff(story: StoryDocument, jobId: string): StoryDocument {
  return updateBookStateDiffStatus(story, jobId, "rejected");
}

function updateBookStateDiffStatus(
  story: StoryDocument,
  jobId: string,
  status: BookDraftJob["stateDiffStatus"]
): StoryDocument {
  const now = new Date().toISOString();
  const targetJob = story.book.draftEngine.jobs.find(function (job) {
    return job.id === jobId;
  });
  const stateDiff = normalizeBookStateDiff(targetJob?.stateDiff, targetJob?.sceneId ?? "");

  if (!targetJob || !stateDiff) {
    return story;
  }

  const validation = validateBookStateDiff(story, stateDiff);
  const reviewedDiff: BookStateDiff = {
    ...stateDiff,
    conflicts: validation.conflicts,
    requiresHumanReview: validation.requiresHumanReview
  };
  const shouldApply = status === "approved_manual" || (status === "approved" && validation.valid);
  const nextStatus: BookDraftJob["stateDiffStatus"] =
    status === "approved" && !validation.valid ? "pending" : status;

  return {
    ...story,
    book: {
      ...story.book,
      activePhase: "phase_2_memory",
      memory: shouldApply
        ? applyBookStateDiffToMemory(story, reviewedDiff, now)
        : story.book.memory,
      draftEngine: {
        ...story.book.draftEngine,
        jobs: story.book.draftEngine.jobs.map(function (job) {
          if (job.id !== jobId) {
            return job;
          }

          return {
            ...job,
            updatedAt: now,
            stateDiff: reviewedDiff,
            stateDiffStatus: nextStatus
          };
        })
      }
    }
  };
}

export function applyBookStateDiffToMemory(
  story: StoryDocument,
  diff: BookStateDiff,
  now: string
): StoryDocument["book"]["memory"] {
  return {
    ...story.book.memory,
    lastSyncedAt: now,
    objectLedger: applyObjectChanges(story.book.memory.objectLedger, diff, now),
    knowledgeLedger: upsertKnowledgeStates(story.book.memory.knowledgeLedger, diff.knowledgeChanges),
    promiseLedger: upsertPromiseStates(story.book.memory.promiseLedger, diff.promiseUpdates),
    canonLedger: applyProposedCanonFacts(story.book.memory.canonLedger, diff)
  };
}

function validateObjectChanges(
  story: StoryDocument | null,
  changes: BookObjectStateChange[]
): string[] {
  const conflicts: string[] = [];
  const holderByObject = new Map<string, string>();
  const locationByObject = new Map<string, string>();
  const objectLedger = story?.book.memory.objectLedger ?? [];

  changes.forEach(function (change) {
    const objectKey = normalizeKey(change.objectName);

    if (change.toHolderCharacterName && change.toLocationName) {
      conflicts.push(`${change.objectName}: Objekt darf nicht gleichzeitig Holder und Location haben.`);
    }

    if (change.toHolderCharacterName) {
      const previousHolder = holderByObject.get(objectKey);
      if (previousHolder && previousHolder !== change.toHolderCharacterName) {
        conflicts.push(`${change.objectName}: Objekt hat in diesem Diff mehrere Holder.`);
      }
      holderByObject.set(objectKey, change.toHolderCharacterName);
    }

    if (change.toLocationName) {
      const previousLocation = locationByObject.get(objectKey);
      if (previousLocation && previousLocation !== change.toLocationName) {
        conflicts.push(`${change.objectName}: Objekt hat in diesem Diff mehrere Locations.`);
      }
      locationByObject.set(objectKey, change.toLocationName);
    }

    conflicts.push(...validateObjectPreviousState(objectLedger, change));
  });

  return conflicts;
}

function validateObjectPreviousState(
  objectLedger: BookObjectState[],
  change: BookObjectStateChange
): string[] {
  const existing = objectLedger.find(function (entry) {
    return normalizeKey(entry.objectName) === normalizeKey(change.objectName);
  });

  if (!existing) {
    if (change.fromHolderCharacterName || change.fromLocationName) {
      return [`${change.objectName}: Transfer verweist auf einen unbekannten bisherigen Objektzustand.`];
    }
    return [];
  }

  const conflicts: string[] = [];

  if (
    change.fromHolderCharacterName &&
    normalizeNullableKey(change.fromHolderCharacterName) !==
      normalizeNullableKey(existing.currentHolderCharacterName)
  ) {
    conflicts.push(`${change.objectName}: fromHolder passt nicht zum gespeicherten Holder.`);
  }

  if (
    change.fromLocationName &&
    normalizeNullableKey(change.fromLocationName) !==
      normalizeNullableKey(existing.currentLocationName)
  ) {
    conflicts.push(`${change.objectName}: fromLocation passt nicht zur gespeicherten Location.`);
  }

  if (
    existing.currentHolderCharacterName &&
    change.toLocationName &&
    !change.fromHolderCharacterName
  ) {
    conflicts.push(`${change.objectName}: Transfer aus bekanntem Holder braucht fromHolder.`);
  }

  if (
    existing.currentLocationName &&
    change.toHolderCharacterName &&
    !change.fromLocationName
  ) {
    conflicts.push(`${change.objectName}: Transfer aus bekannter Location braucht fromLocation.`);
  }

  return conflicts;
}

function validateKnowledgeChanges(story: StoryDocument | null, diff: BookStateDiff): string[] {
  const conflicts: string[] = [];

  diff.knowledgeChanges.forEach(function (item) {
    item.knownByCharacterNames.forEach(function (name) {
      if (item.hiddenFromCharacterNames.some(function (hiddenName) {
        return normalizeKey(hiddenName) === normalizeKey(name);
      })) {
        conflicts.push(`${item.proposition}: Figur kann Wissen nicht zugleich haben und verborgen bekommen.`);
      }
    });

    if (
      item.readerState === "confirmed" &&
      item.revealSceneId &&
      item.revealSceneId !== diff.sceneId &&
      isSceneBefore(story, diff.sceneId, item.revealSceneId)
    ) {
      conflicts.push(`${item.proposition}: Secret darf vor revealSceneId nicht confirmed sein.`);
    }
  });

  return conflicts;
}

function validatePromiseUpdates(updates: BookPromiseState[]): string[] {
  return updates
    .filter(function (promise) {
      return promise.status === "paid" && (!promise.logicalPayoff || !promise.emotionalPayoff);
    })
    .map(function (promise) {
      return `${promise.label}: Promise darf nicht paid sein ohne logicalPayoff und emotionalPayoff.`;
    });
}

function applyObjectChanges(
  currentLedger: BookObjectState[],
  diff: BookStateDiff,
  now: string
): BookObjectState[] {
  const byName = new Map<string, BookObjectState>();

  currentLedger.forEach(function (entry) {
    byName.set(normalizeKey(entry.objectName), entry);
  });

  diff.objectChanges.forEach(function (change) {
    const key = normalizeKey(change.objectName);
    const existing = byName.get(key);
    const nextHolder =
      change.toHolderCharacterName !== undefined
        ? change.toHolderCharacterName
        : existing?.currentHolderCharacterName ?? null;
    const nextLocation =
      change.toLocationName !== undefined
        ? change.toLocationName
        : existing?.currentLocationName ?? null;

    byName.set(key, {
      id: existing?.id ?? createUuid(),
      objectEntryId: existing?.objectEntryId ?? "",
      objectName: change.objectName,
      currentHolderCharacterName: nextHolder || null,
      currentLocationName: nextHolder ? null : nextLocation || null,
      condition: change.conditionChange || existing?.condition || "unknown",
      knownByCharacterNames: existing?.knownByCharacterNames ?? [],
      lastSeenSceneId: diff.sceneId,
      updatedAt: now
    });
  });

  return Array.from(byName.values());
}

function upsertKnowledgeStates(
  currentLedger: BookKnowledgeState[],
  updates: BookKnowledgeState[]
): BookKnowledgeState[] {
  const byKey = new Map<string, BookKnowledgeState>();

  currentLedger.forEach(function (entry) {
    byKey.set(entry.id || normalizeKey(entry.proposition), entry);
  });

  updates.forEach(function (entry) {
    byKey.set(entry.id || normalizeKey(entry.proposition), entry);
  });

  return Array.from(byKey.values());
}

function upsertPromiseStates(
  currentLedger: BookPromiseState[],
  updates: BookPromiseState[]
): BookPromiseState[] {
  const byKey = new Map<string, BookPromiseState>();

  currentLedger.forEach(function (entry) {
    byKey.set(entry.id || normalizeKey(entry.label), entry);
  });

  updates.forEach(function (entry) {
    byKey.set(entry.id || normalizeKey(entry.label), entry);
  });

  return Array.from(byKey.values());
}

function applyProposedCanonFacts(
  currentLedger: BookCanonFact[],
  diff: BookStateDiff
): BookCanonFact[] {
  const byTitle = new Map<string, BookCanonFact>();

  currentLedger.forEach(function (entry) {
    byTitle.set(normalizeKey(entry.title), entry);
  });

  diff.proposedCanonFacts.forEach(function (fact) {
    const title = fact.includes(":") ? fact.split(":")[0].trim() : fact.trim();
    const summary = fact.includes(":") ? fact.slice(fact.indexOf(":") + 1).trim() : fact.trim();
    const key = normalizeKey(title);
    const existing = byTitle.get(key);

    byTitle.set(key, {
      entryId: existing?.entryId ?? createUuid(),
      title,
      kind: existing?.kind ?? "scene_fact",
      summary: summary || existing?.summary || fact,
      mentionCount: existing ? existing.mentionCount + 1 : 1,
      sceneIds: dedupeStrings((existing?.sceneIds ?? []).concat(diff.sceneId)),
      importance: existing?.importance ?? "medium",
      status: existing?.status ?? "watch"
    });
  });

  return Array.from(byTitle.values());
}

function isSceneBefore(
  story: StoryDocument | null,
  leftSceneId: string,
  rightSceneId: string
) {
  if (!story) {
    return true;
  }

  const order = story.acts.flatMap(function (act) {
    return act.chapters.flatMap(function (chapter) {
      return chapter.scenes.map(function (scene) {
        return scene.id;
      });
    });
  });
  const leftIndex = order.indexOf(leftSceneId);
  const rightIndex = order.indexOf(rightSceneId);

  if (leftIndex === -1 || rightIndex === -1) {
    return leftSceneId !== rightSceneId;
  }

  return leftIndex < rightIndex;
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function normalizeNullableKey(value: string | null | undefined) {
  return value ? normalizeKey(value) : "";
}

function dedupeStrings(values: string[]) {
  return Array.from(new Set(values.map(function (value) {
    return value.trim();
  }).filter(Boolean)));
}

import { createUuid } from "@/lib/id";
import type { BookEngineMode } from "@/lib/book-engine-modes";
import {
  createEmptyBookLockedFacts,
  normalizeBookLockedFacts
} from "@/lib/book-locked-facts";

export {
  createEmptyBookCommonLockedFacts,
  createEmptyBookLockedFacts,
  createEmptyDomesticSuspenseThrillerLockedFacts,
  createEmptyYaSuperheroOriginLockedFacts,
  getCommonLockedFacts,
  getDomesticSuspenseLockedFacts,
  getYaSuperheroLockedFacts,
  hasBookLockedFacts,
  hasDomesticSuspenseLockedFacts,
  mergeBookLockedFacts,
  normalizeBookLockedFacts
} from "@/lib/book-locked-facts";

export type StoryStatus = "draft" | "playtest" | "submitted";
export type StoryMode = "book" | "branching";
export type BookJobProvider = "openai" | "anthropic" | "local";
export type BookJobMode = "remote" | "local_fallback";
export type BookDraftStageId =
  | "context"
  | "beat_plan"
  | "draft"
  | "rewrite"
  | "length_control"
  | "extract"
  | "continuity"
  | "quality_eval";
export type BookDraftStageStatus = "completed" | "failed" | "skipped";
export type BookDraftStageRun = {
  status: BookDraftStageStatus;
  provider: BookJobProvider;
  modelName: string | null;
  updatedAt: string | null;
  attemptCount: number;
  repairCount: number;
  durationMs: number | null;
  inputTokens: number | null;
  outputTokens: number | null;
  costCents: number | null;
  stopReason: string | null;
  targetWordsMin: number | null;
  targetWordsMax: number | null;
  actualWords: number | null;
  qualityScore: number | null;
  qualityIssues: string[];
  notes: string[];
};
export type BookDraftStageRuns = {
  context: BookDraftStageRun;
  beat_plan: BookDraftStageRun;
  draft: BookDraftStageRun;
  rewrite: BookDraftStageRun;
  length_control: BookDraftStageRun;
  extract: BookDraftStageRun;
  continuity: BookDraftStageRun;
  quality_eval: BookDraftStageRun;
};

export const LEGACY_BOOK_WRITER_CONSTITUTION = [
  "Jede Szene braucht konkrete Lage, Reibung, Veraenderung und eine lesbare Folge.",
  "Exposition bleibt knapp und wird nur dann platziert, wenn sie die aktuelle Szene traegt.",
  "Dialog muss Information, Beziehung, Entscheidung oder Machtbalance veraendern.",
  "Kanon geht vor Improvisation; Luecken werden markiert statt erfunden."
] as const;

export const DEFAULT_BOOK_STORY_ARCHITECTURE = [
  "Anfang: Fuehre Figur, Welt, Versprechen und erste Veraenderung konkret ein.",
  "Entwicklung: Lass Entscheidungen, Beziehungen und aeussere Lage sichtbar aufeinander reagieren.",
  "Folgen: Zahle die wichtigsten Versprechen in Handlung, Beziehung und Selbstbild aus.",
  "Tracke sichtbares Ziel und innere Notwendigkeit getrennt, bis beide in einer konkreten Entscheidung aufeinandertreffen."
] as const;

export const DEFAULT_BOOK_WRITER_CONSTITUTION = [
  "Jede Szene braucht konkrete Lage, Reibung, Veraenderung und eine lesbare Folge.",
  "Steige spaet in die Szene ein und verlasse sie frueh, sobald der dramatische Punkt gesetzt ist.",
  "Zeige Emotion ueber Verhalten, Koerper, Handlung und sinnliche Details statt sie nur zu benennen.",
  "Dialog veraendert Beziehung, Information, Entscheidung oder Machtbalance.",
  "Starker Dialog traegt Subtext: Was Figuren sagen und was sie meinen, darf auseinanderliegen.",
  "Negative Regel: Figuren erklaeren ihre Emotion nicht essayistisch; sie reagieren konkret, treffen Entscheidungen und veraendern ihr Verhalten.",
  "Negative Regel: Hauptfiguren klingen nie generisch oder austauschbar; jede Stimme bleibt klar und wiedererkennbar.",
  "Pacing wird bewusst gesteuert: kurze Saetze fuer akute Bewegung, laengere fuer Reflexion und Ausklang.",
  "Kapitel und Szenen enden nach Moeglichkeit mit einem klaren Bild, einer offenen Reibung oder einer neuen Entscheidung, nicht mit weichem Auslaufen.",
  "Jede Hauptfigur braucht eine eigene Stimme, Wortwahl und Rhythmik.",
  "Bevorzuge aktive Verben, starke Nomen und konkrete Bilder statt schwacher Konstruktionen.",
  "Redundanzen, Fuellwoerter und dekorative Adverbien werden gestrichen, nicht gesammelt.",
  "Dialogtags bleiben in der Regel bei sagte oder fragte; Haltung und Intensitaet zeigt die Szene selbst.",
  "Tempus bleibt konsistent und Prosa muss laut gelesen standhalten.",
  "Kanon geht vor Improvisation; Luecken werden markiert statt erfunden."
] as const;

export const DEFAULT_BOOK_PUBLISHING_GUARDRAILS = [
  "Commercial fiction muss Genre-Erwartungen erfuellen, ohne mechanisch zu wirken.",
  "Lesbarkeit geht vor Eitelkeit: klare Struktur, saubere Orientierung und niedrige Reibung fuer den Leser.",
  "Packaging darf nichts versprechen, was Manuskript, Hook und Ending Promise nicht einloesen.",
  "Formatierungs- und Qualitaetsfehler sind keine Nebensache; sie schaedigen Marktvertrauen und KDP-Tauglichkeit."
] as const;

export type StoryDocument = {
  id: string;
  workspaceId: string;
  title: string;
  authorName: string;
  status: StoryStatus;
  mode: StoryMode;
  meta: {
    genre: string;
    language: string;
    audience: string;
  };
  book: BookBlueprint;
  assistant: AssistantWorkspace;
  worldBible: WorldBibleEntry[];
  variables: StoryVariable[];
  acts: StoryAct[];
};

export type AssistantProvider = "auto" | "openai" | "anthropic" | "local";
export type AssistantOutputMode = "chat" | "note" | "regie";
export type AssistantArtifactKind = "regie" | "note";
export type AssistantContextScope = "project" | "act" | "chapter" | "scene";
export type AssistantContextSelection = {
  scope: AssistantContextScope;
  actId: string | null;
  chapterId: string | null;
  sceneId: string | null;
};
export type AssistantModelSelection = {
  openai: string;
  anthropic: string;
};

export type AssistantWorkspace = {
  preferences: {
    provider: AssistantProvider;
    outputMode: AssistantOutputMode;
    modelSelection: AssistantModelSelection;
  };
  threads: AssistantThread[];
  artifacts: AssistantArtifact[];
};

export type AssistantThread = {
  id: string;
  title: string;
  summary: string;
  context: AssistantContextSelection;
  createdAt: string;
  updatedAt: string;
  messages: AssistantMessage[];
};

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  outputMode: AssistantOutputMode;
  provider: AssistantProvider;
  modelName: string | null;
  context: AssistantContextSelection;
  artifactId: string | null;
};

export type AssistantArtifact = {
  id: string;
  threadId: string;
  sourceMessageId: string | null;
  title: string;
  kind: AssistantArtifactKind;
  format: "markdown";
  summary: string;
  content: string;
  context: AssistantContextSelection;
  createdAt: string;
  updatedAt: string;
};

export type StoryLibraryEntry = {
  id: string;
  workspaceId: string;
  title: string;
  authorName: string;
  status: StoryStatus;
  mode: StoryMode;
  createdAt: string;
  updatedAt: string;
};

export type BookBlueprint = {
  priority: "primary" | "secondary";
  activePhase:
    | "phase_1_foundation"
    | "phase_2_memory"
    | "phase_3_drafting"
    | "phase_4_continuity"
    | "phase_5_market";
  engineMode: BookEngineMode;
  targetFormat: "novella" | "novel" | "series";
  targetLengthWords: number;
  masterBrief: {
    premise: string;
    readerPromise: string;
    endingPromise: string;
    thematicCore: string;
    authorIntent: string;
    currentFocus: string;
    storyArchitecture: string[];
  };
  marketBrief: {
    amazonGoal: string;
    categoryLane: string;
    hook: string;
    seriesPotential: string;
    coverDirection: string;
    publishingGuardrails: string[];
  };
  writerConstitution: string[];
  masterBriefRuntime: BookRuntimeContext;
  writerRulesRuntime: BookRuntimeContext;
  threatModel: {
    lockedFacts: BookLockedFacts;
  };
  memory: BookMemoryBackbone;
  draftEngine: BookDraftEngine;
  amazonOps: AmazonOps;
};

export type BookDraftEngine = {
  mode: "local";
  targetSceneWordsMin: number;
  targetSceneWordsMax: number;
  styleProfileVersion: string;
  marketProfileVersion: string;
  jobs: BookDraftJob[];
};

export type BookDraftJob = {
  id: string;
  sceneId: string;
  sceneTitle: string;
  createdAt: string;
  updatedAt: string;
  provider: BookJobProvider;
  mode: BookJobMode;
  modelName: string | null;
  status: "ready" | "accepted";
  acceptedAt: string | null;
  outline: string[];
  draftText: string;
  rewriteText: string;
  rewriteNotes: string[];
  extractedState: DraftExtractionState;
  stateDiff: BookStateDiff | null;
  stateDiffStatus: BookStateDiffStatus;
  stages: BookDraftStageRuns;
  contextSnapshot: {
    contextPackId: string | null;
    memorySyncedAt: string | null;
    chapterTitle: string;
    sceneSummary: string;
    relevantCodexTitles: string[];
    relevantCharacterNames: string[];
    activeThreadLabels: string[];
  };
};

export type BookHumanEditLearningStatus = "included" | "excluded" | "needs_review";

export type BookHumanEditExample = {
  id: string;
  sceneId: string;
  sceneTitle: string;
  draftJobId: string;
  provider: BookJobProvider;
  modelName: string | null;
  categoryLane: string;
  sourceText: string;
  editedText: string;
  sourceWordCount: number;
  editedWordCount: number;
  diffSummary: {
    summary: string;
    changedChars: number;
    wordDelta: number;
    sourcePreview: string;
    editedPreview: string;
  };
  editTags: string[];
  learningStatus: BookHumanEditLearningStatus;
  excludedReason: string | null;
  learningWeight: number;
  acceptedAt: string | null;
  capturedAt: string;
  updatedAt: string;
};

export type BookMemoryBackbone = {
  lastSyncedAt: string | null;
  canonLedger: BookCanonFact[];
  characterLedger: BookCharacterState[];
  objectLedger: BookObjectState[];
  knowledgeLedger: BookKnowledgeState[];
  promiseLedger: BookPromiseState[];
  openThreads: BookOpenThread[];
  sceneCards: BookSceneCard[];
  contextPacks: BookContextPack[];
  lockedFacts: BookLockedFacts;
  continuityGuardrails: string[];
  proseTechniqueProfile: BookProseTechniqueProfile;
  continuityNotes: string[];
  humanEditExamples: BookHumanEditExample[];
};

export type BookCommonLockedFacts = {
  protagonistNames: string[];
  antagonistNames: string[];
  institutionNames: string[];
  keyObjectNames: string[];
  fixedLocations: string[];
  fixedDates: string[];
};

export type BookDomesticSuspenseThrillerLockedFacts = {
  childName: string | null;
  coparentName: string | null;
  institutionName: string | null;
  incidentDate: string | null;
  incidentTime: string | null;
  notificationTime: string | null;
  firstOfficeTime: string | null;
  documentedPickupPerson: string | null;
  alibiLocation: string | null;
  alibiWindow: string | null;
};

export type BookYaSuperheroOriginLockedFacts = {
  teamMemberNames: string[];
  substanceName: string | null;
  aiCompanionName: string | null;
  experimentLocation: string | null;
  organizationName: string | null;
  triggerEvent: string | null;
  accidentMechanism: string | null;
  powerOrigin: string | null;
};

export type BookLockedFactProfiles = {
  domestic_suspense_thriller: BookDomesticSuspenseThrillerLockedFacts;
  ya_superhero_origin: BookYaSuperheroOriginLockedFacts;
};

export type BookLockedFacts = {
  common: BookCommonLockedFacts;
  profiles: BookLockedFactProfiles;
};

export type BookProseTechniqueProfile = {
  narrativeIntent: string;
  povDistance: string;
  tensionMode: string;
  expositionMode: string;
  sensoryWeight: string;
  interiorityMode: string;
  sentenceDynamics: {
    baseline: string;
    underStress: string;
    fragmentation: string;
  };
  sceneHooks: {
    opening: string;
    ending: string;
  };
  dialogueMode: string;
  revealPattern: string;
  anchorPolicy: string;
  techniqueRules: string[];
  antiImitationRules: string[];
};

export type BookRuntimeContext = {
  lockedFacts: BookLockedFacts;
  continuityGuardrails: string[];
  proseTechniqueProfile: BookProseTechniqueProfile;
};

export type BookCanonFact = {
  entryId: string;
  title: string;
  kind: WorldBibleEntry["kind"] | "scene_fact" | "foreshadowing";
  summary: string;
  mentionCount: number;
  sceneIds: string[];
  importance: "high" | "medium" | "low";
  status: "active" | "watch" | "resolved";
};

export type BookCharacterState = {
  id: string;
  characterEntryId: string;
  characterName: string;
  currentState: string;
  innerShift: string;
  agenda: string;
  updatedFromSceneId: string;
  updatedAt: string;
  snapshots: BookCharacterStateSnapshot[];
};

export type BookCharacterStateSnapshot = {
  id: string;
  scope: "baseline" | "scene" | "chapter";
  sortOrder: number;
  sourceSceneId: string | null;
  sourceChapterId: string | null;
  sourceLabel: string;
  currentState: string;
  innerShift: string;
  agenda: string;
  capturedAt: string;
};

export type BookObjectState = {
  id: string;
  objectEntryId: string;
  objectName: string;
  currentHolderCharacterName: string | null;
  currentLocationName: string | null;
  condition: string;
  knownByCharacterNames: string[];
  lastSeenSceneId: string | null;
  updatedAt: string;
};

export type BookKnowledgeState = {
  id: string;
  proposition: string;
  truthStatus: "true" | "false" | "unknown" | "contested";
  knownByCharacterNames: string[];
  believedByCharacterNames: string[];
  hiddenFromCharacterNames: string[];
  readerState: "unknown" | "suspected" | "confirmed";
  sourceSceneId: string | null;
  revealSceneId: string | null;
};

export type BookPromiseState = {
  id: string;
  label: string;
  kind: "mystery" | "emotional" | "object" | "relationship" | "plot" | "thematic";
  status: "open" | "reinforced" | "partially_paid" | "paid" | "dropped";
  setupSceneId: string | null;
  reinforcementSceneIds: string[];
  plannedPayoffSceneId: string | null;
  actualPayoffSceneId: string | null;
  logicalPayoff: string;
  emotionalPayoff: string;
};

export type BookObjectStateChange = {
  objectName: string;
  fromHolderCharacterName?: string | null;
  toHolderCharacterName?: string | null;
  fromLocationName?: string | null;
  toLocationName?: string | null;
  conditionChange?: string | null;
  evidenceQuote: string;
  confidence: number;
};

export type BookStateObjectCandidate = {
  objectName: string;
  sourceField: string;
  hardness: "hard" | "soft";
  sceneId: string;
};

export type BookStateDiff = {
  sceneId: string;
  objectChanges: BookObjectStateChange[];
  knowledgeChanges: BookKnowledgeState[];
  promiseUpdates: BookPromiseState[];
  characterStateUpdates: string[];
  relationshipNotes: string[];
  proposedCanonFacts: string[];
  sceneLocalDetails: string[];
  conflicts: string[];
  requiresHumanReview: boolean;
};

export type BookStateDiffStatus = "none" | "pending" | "approved" | "rejected" | "approved_manual";

export type BookStateDiffValidationResult = {
  valid: boolean;
  conflicts: string[];
  requiresHumanReview: boolean;
};

export type BookOpenThread = {
  id: string;
  label: string;
  detail: string;
  sourceSceneId: string;
  sourceSceneTitle: string;
  status: "active" | "watch" | "resolved";
  priority: "high" | "medium" | "low";
  payoffSceneId: string | null;
};

export type BookSceneCardDirectives = {
  pov: string | null;
  location: string | null;
  timeAnchor: string | null;
  objective: string | null;
  opening: string | null;
  coreAction: string | null;
  dramaticBeat: string | null;
  ending: string | null;
  closingLine: string | null;
  custom: Array<{
    key: string;
    value: string;
  }>;
};

export type BookSceneCard = {
  sceneId: string;
  sceneTitle: string;
  actTitle: string;
  chapterTitle: string;
  summary: string;
  excerpt: string;
  orderLabel: string;
  chapterGoal: string;
  directives: BookSceneCardDirectives;
  outline: string[];
};

export type BookContextPack = {
  id: string;
  sceneId: string;
  preparedAt: string;
  stablePrefixSignature: string;
  previousSceneIds: string[];
  nextSceneId: string | null;
  relevantCanonEntryIds: string[];
  relevantCharacterStateIds: string[];
  activeThreadIds: string[];
  runtimeContext: BookRuntimeContext;
};

export type DraftExtractionState = {
  newCanonFacts: string[];
  characterStateUpdates: string[];
  openThreadsCreated: string[];
  openThreadsResolved: string[];
  foreshadowingAdded: string[];
  continuityRisks: string[];
  styleDriftNotes: string[];
  memorySync: DraftMemorySyncState;
};

export type DraftMemorySyncStatus = "pending" | "approved" | "rejected";
export type DraftMemorySyncItemKind = "canon_fact" | "character_state" | "foreshadowing";

export type DraftMemorySyncItem = {
  id: string;
  kind: DraftMemorySyncItemKind;
  value: string;
  status: DraftMemorySyncStatus;
  createdAt: string;
  reviewedAt: string | null;
};

export type DraftMemorySyncState = {
  items: DraftMemorySyncItem[];
};

export type AmazonOps = {
  penName: string;
  subtitle: string;
  seriesName: string;
  volumeNumber: string;
  description: string;
  keywords: string[];
  categories: string[];
  audienceTags: string[];
  aiDisclosure: "generated" | "assisted" | "human_led";
  launchChecklist: {
    manuscriptReady: boolean;
    coverReady: boolean;
    blurbReady: boolean;
    keywordsReady: boolean;
    categoriesReady: boolean;
    aiDisclosureReady: boolean;
  };
};

export type WorldBibleEntry = {
  id: string;
  title: string;
  kind: "character" | "location" | "object" | "theme";
  summary: string;
};

export type StoryVariable = {
  id: string;
  key: string;
  label: string;
  type: "boolean" | "enum" | "number";
  defaultValue: boolean | string | number;
};

export type StoryAct = {
  id: string;
  title: string;
  order: number;
  chapters: StoryChapter[];
};

export type StoryChapter = {
  id: string;
  actId: string;
  title: string;
  order: number;
  scenes: StoryScene[];
  wordCount: number;
};

export type StoryScene = {
  id: string;
  chapterId: string;
  title: string;
  order: number;
  label: string;
  summary: string;
  wordCount: number;
  blocks: SceneBlock[];
  choices: StoryChoice[];
};

export type SceneBlock = {
  id: string;
  kind: "paragraph";
  text: string;
};

export type StoryChoice = {
  id: string;
  label: string;
  toSceneId: string;
  conditions: ChoiceCondition[];
  effects: ChoiceEffect[];
};

export type ChoiceCondition = {
  variableKey: string;
  equals: boolean | string | number;
};

export type ChoiceEffect = {
  variableKey: string;
  setTo: boolean | string | number;
};

export type SceneContext = {
  act: StoryAct;
  chapter: StoryChapter;
  scene: StoryScene;
};

export type InsertActResult = {
  story: StoryDocument;
  actId: string;
  chapterId: string;
  sceneId: string;
};

export type InsertChapterResult = {
  story: StoryDocument;
  chapterId: string;
  sceneId: string;
};

export type InsertSceneResult = {
  story: StoryDocument;
  sceneId: string;
};

export type BookDraftPreparationIssue = {
  level: "blocking" | "warning";
  message: string;
};

export function defineStory<T extends StoryDocument>(story: T): T {
  return story;
}

export function isBookStory(story: Pick<StoryDocument, "mode">) {
  return story.mode === "book";
}

export function isBranchingStory(story: Pick<StoryDocument, "mode">) {
  return story.mode === "branching";
}

export function normalizeBookRuleList(value: unknown, fallback: readonly string[]) {
  const nextRules = Array.isArray(value)
    ? value
        .filter(function (entry): entry is string {
          return typeof entry === "string";
        })
        .map(function (entry) {
          return entry.trim();
        })
        .filter(Boolean)
    : [];

  if (!nextRules.length) {
    return fallback.slice();
  }

  if (
    nextRules.length === LEGACY_BOOK_WRITER_CONSTITUTION.length &&
    nextRules.every(function (rule, index) {
      return rule === LEGACY_BOOK_WRITER_CONSTITUTION[index];
    })
  ) {
    return DEFAULT_BOOK_WRITER_CONSTITUTION.slice();
  }

  return nextRules;
}

export function createEmptyBookSceneCardDirectives(): BookSceneCardDirectives {
  return {
    pov: null,
    location: null,
    timeAnchor: null,
    objective: null,
    opening: null,
    coreAction: null,
    dramaticBeat: null,
    ending: null,
    closingLine: null,
    custom: []
  };
}

export function normalizeBookSceneCardDirectives(value: unknown): BookSceneCardDirectives {
  const fallback = createEmptyBookSceneCardDirectives();
  const record = value && typeof value === "object" ? (value as Partial<BookSceneCardDirectives>) : null;
  const custom = Array.isArray(record?.custom)
    ? record.custom
        .filter(function (
          entry
        ): entry is {
          key: string;
          value: string;
        } {
          return Boolean(entry) && typeof entry === "object";
        })
        .map(function (entry) {
          return {
            key: typeof entry.key === "string" ? entry.key.trim() : "",
            value: typeof entry.value === "string" ? entry.value.trim() : ""
          };
        })
        .filter(function (entry) {
          return Boolean(entry.key) && Boolean(entry.value);
        })
    : [];

  return {
    pov: typeof record?.pov === "string" ? record.pov : fallback.pov,
    location: typeof record?.location === "string" ? record.location : fallback.location,
    timeAnchor: typeof record?.timeAnchor === "string" ? record.timeAnchor : fallback.timeAnchor,
    objective: typeof record?.objective === "string" ? record.objective : fallback.objective,
    opening: typeof record?.opening === "string" ? record.opening : fallback.opening,
    coreAction: typeof record?.coreAction === "string" ? record.coreAction : fallback.coreAction,
    dramaticBeat: typeof record?.dramaticBeat === "string" ? record.dramaticBeat : fallback.dramaticBeat,
    ending: typeof record?.ending === "string" ? record.ending : fallback.ending,
    closingLine: typeof record?.closingLine === "string" ? record.closingLine : fallback.closingLine,
    custom
  };
}

export function createDefaultBookMemoryBackbone(): BookMemoryBackbone {
  return {
    lastSyncedAt: null,
    canonLedger: [],
    characterLedger: [],
    objectLedger: [],
    knowledgeLedger: [],
    promiseLedger: [],
    openThreads: [],
    sceneCards: [],
    contextPacks: [],
    lockedFacts: createEmptyBookLockedFacts(),
    continuityGuardrails: [],
    proseTechniqueProfile: createDefaultBookProseTechniqueProfile(),
    continuityNotes: [],
    humanEditExamples: []
  };
}

export function createEmptyBookStateDiff(sceneId = ""): BookStateDiff {
  return {
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
  };
}

export function normalizeBookStateDiff(
  value: unknown,
  fallbackSceneId = ""
): BookStateDiff | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Partial<BookStateDiff>;
  const sceneId = typeof record.sceneId === "string" && record.sceneId.trim()
    ? record.sceneId.trim()
    : fallbackSceneId;

  return {
    sceneId,
    objectChanges: normalizeBookObjectStateChanges(record.objectChanges),
    knowledgeChanges: normalizeBookKnowledgeStates(record.knowledgeChanges),
    promiseUpdates: normalizeBookPromiseStates(record.promiseUpdates),
    characterStateUpdates: normalizeDraftExtractArray(record.characterStateUpdates),
    relationshipNotes: normalizeDraftExtractArray(record.relationshipNotes),
    proposedCanonFacts: normalizeDraftExtractArray(record.proposedCanonFacts),
    sceneLocalDetails: normalizeDraftExtractArray(record.sceneLocalDetails),
    conflicts: normalizeDraftExtractArray(record.conflicts),
    requiresHumanReview:
      typeof record.requiresHumanReview === "boolean"
        ? record.requiresHumanReview
        : normalizeDraftExtractArray(record.conflicts).length > 0
  };
}

export function normalizeBookStateDiffStatus(
  value: unknown,
  fallback: BookStateDiffStatus = "none"
): BookStateDiffStatus {
  if (
    value === "none" ||
    value === "pending" ||
    value === "approved" ||
    value === "rejected" ||
    value === "approved_manual"
  ) {
    return value;
  }

  return fallback;
}

export function normalizeBookObjectStates(value: unknown): BookObjectState[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(function (entry): entry is Partial<BookObjectState> {
      return Boolean(entry) && typeof entry === "object";
    })
    .map(function (entry) {
      return {
        id: typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : createUuid(),
        objectEntryId:
          typeof entry.objectEntryId === "string" && entry.objectEntryId.trim()
            ? entry.objectEntryId.trim()
            : "",
        objectName: typeof entry.objectName === "string" ? entry.objectName.trim() : "",
        currentHolderCharacterName:
          typeof entry.currentHolderCharacterName === "string" && entry.currentHolderCharacterName.trim()
            ? entry.currentHolderCharacterName.trim()
            : null,
        currentLocationName:
          typeof entry.currentLocationName === "string" && entry.currentLocationName.trim()
            ? entry.currentLocationName.trim()
            : null,
        condition:
          typeof entry.condition === "string" && entry.condition.trim()
            ? entry.condition.trim()
            : "unknown",
        knownByCharacterNames: normalizeDraftExtractArray(entry.knownByCharacterNames),
        lastSeenSceneId:
          typeof entry.lastSeenSceneId === "string" && entry.lastSeenSceneId.trim()
            ? entry.lastSeenSceneId.trim()
            : null,
        updatedAt:
          typeof entry.updatedAt === "string" && entry.updatedAt.trim()
            ? entry.updatedAt.trim()
            : new Date().toISOString()
      };
    })
    .filter(function (entry) {
      return Boolean(entry.objectName);
    });
}

export function normalizeBookKnowledgeStates(value: unknown): BookKnowledgeState[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(function (entry): entry is Partial<BookKnowledgeState> {
      return Boolean(entry) && typeof entry === "object";
    })
    .map(function (entry) {
      return {
        id: typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : createUuid(),
        proposition:
          typeof entry.proposition === "string" && entry.proposition.trim()
            ? entry.proposition.trim()
            : "",
        truthStatus: normalizeBookTruthStatus(entry.truthStatus),
        knownByCharacterNames: normalizeDraftExtractArray(entry.knownByCharacterNames),
        believedByCharacterNames: normalizeDraftExtractArray(entry.believedByCharacterNames),
        hiddenFromCharacterNames: normalizeDraftExtractArray(entry.hiddenFromCharacterNames),
        readerState: normalizeBookReaderState(entry.readerState),
        sourceSceneId:
          typeof entry.sourceSceneId === "string" && entry.sourceSceneId.trim()
            ? entry.sourceSceneId.trim()
            : null,
        revealSceneId:
          typeof entry.revealSceneId === "string" && entry.revealSceneId.trim()
            ? entry.revealSceneId.trim()
            : null
      };
    })
    .filter(function (entry) {
      return Boolean(entry.proposition);
    });
}

export function normalizeBookPromiseStates(value: unknown): BookPromiseState[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(function (entry): entry is Partial<BookPromiseState> {
      return Boolean(entry) && typeof entry === "object";
    })
    .map(function (entry) {
      return {
        id: typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : createUuid(),
        label: typeof entry.label === "string" && entry.label.trim() ? entry.label.trim() : "",
        kind: normalizeBookPromiseKind(entry.kind),
        status: normalizeBookPromiseStatus(entry.status),
        setupSceneId:
          typeof entry.setupSceneId === "string" && entry.setupSceneId.trim()
            ? entry.setupSceneId.trim()
            : null,
        reinforcementSceneIds: normalizeDraftExtractArray(entry.reinforcementSceneIds),
        plannedPayoffSceneId:
          typeof entry.plannedPayoffSceneId === "string" && entry.plannedPayoffSceneId.trim()
            ? entry.plannedPayoffSceneId.trim()
            : null,
        actualPayoffSceneId:
          typeof entry.actualPayoffSceneId === "string" && entry.actualPayoffSceneId.trim()
            ? entry.actualPayoffSceneId.trim()
            : null,
        logicalPayoff:
          typeof entry.logicalPayoff === "string" ? entry.logicalPayoff.trim() : "",
        emotionalPayoff:
          typeof entry.emotionalPayoff === "string" ? entry.emotionalPayoff.trim() : ""
      };
    })
    .filter(function (entry) {
      return Boolean(entry.label);
    });
}

function normalizeBookObjectStateChanges(value: unknown): BookObjectStateChange[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(function (entry): entry is Partial<BookObjectStateChange> {
      return Boolean(entry) && typeof entry === "object";
    })
    .map(function (entry) {
      return {
        objectName: typeof entry.objectName === "string" ? entry.objectName.trim() : "",
        fromHolderCharacterName:
          typeof entry.fromHolderCharacterName === "string" && entry.fromHolderCharacterName.trim()
            ? entry.fromHolderCharacterName.trim()
            : null,
        toHolderCharacterName:
          typeof entry.toHolderCharacterName === "string" && entry.toHolderCharacterName.trim()
            ? entry.toHolderCharacterName.trim()
            : null,
        fromLocationName:
          typeof entry.fromLocationName === "string" && entry.fromLocationName.trim()
            ? entry.fromLocationName.trim()
            : null,
        toLocationName:
          typeof entry.toLocationName === "string" && entry.toLocationName.trim()
            ? entry.toLocationName.trim()
            : null,
        conditionChange:
          typeof entry.conditionChange === "string" && entry.conditionChange.trim()
            ? entry.conditionChange.trim()
            : null,
        evidenceQuote:
          typeof entry.evidenceQuote === "string" ? entry.evidenceQuote.trim() : "",
        confidence:
          typeof entry.confidence === "number" && Number.isFinite(entry.confidence)
            ? Math.min(1, Math.max(0, entry.confidence))
            : 0
      };
    })
    .filter(function (entry) {
      return Boolean(entry.objectName);
    });
}

export function createDefaultBookProseTechniqueProfile(): BookProseTechniqueProfile {
  return {
    narrativeIntent:
      "Schreibe als zugkraeftige, lesbare Szenenprosa: konkret, nah, beweglich und ohne Autorenmasken.",
    povDistance: "close",
    tensionMode: "scene_pressure_from_consequence",
    expositionMode: "embedded_only",
    sensoryWeight: "medium",
    interiorityMode: "micro_reactions",
    sentenceDynamics: {
      baseline: "controlled_medium",
      underStress: "tighten_and_shorten",
      fragmentation: "occasional_only"
    },
    sceneHooks: {
      opening: "disturbance_first",
      ending: "image_or_reversal"
    },
    dialogueMode: "subtext_and_pressure",
    revealPattern: "withhold_then_ground",
    anchorPolicy: "each_scene_needs_a_concrete_anchor",
    techniqueRules: [
      "Beginne mit veraenderter Lage, Handlung oder Beziehung statt mit Vorerklaerung.",
      "Fuehre Wahrnehmung, Handlung und Mikroreaktion enger als abstrakte Reflexion.",
      "Exposition nur unter Bewegung, Konflikt oder Gegenstandsdruck einlassen.",
      "Nach sichtbarer Veraenderung, Entscheidung oder neuem Bild zuegig beenden."
    ],
    antiImitationRules: [
      "Keine erkennbaren Anleihen bei einzelnen Autorinnen, Autoren oder Comp Titles.",
      "Keine markanten Phrasen, Satzmuster oder Signaturbilder aus Referenztexten uebernehmen.",
      "Technik nur auf hoher Abstraktion verwenden: Szenenwirkung bauen, nicht Stimmen kopieren."
    ]
  };
}

export function normalizeBookProseTechniqueProfile(value: unknown): BookProseTechniqueProfile {
  const fallback = createDefaultBookProseTechniqueProfile();
  const record =
    value && typeof value === "object" ? (value as Partial<BookProseTechniqueProfile>) : null;
  const sentenceDynamics =
    record?.sentenceDynamics && typeof record.sentenceDynamics === "object"
      ? record.sentenceDynamics
      : null;
  const sceneHooks =
    record?.sceneHooks && typeof record.sceneHooks === "object" ? record.sceneHooks : null;

  return {
    narrativeIntent:
      typeof record?.narrativeIntent === "string" && record.narrativeIntent.trim()
        ? record.narrativeIntent.trim()
        : fallback.narrativeIntent,
    povDistance:
      typeof record?.povDistance === "string" && record.povDistance.trim()
        ? record.povDistance.trim()
        : fallback.povDistance,
    tensionMode:
      typeof record?.tensionMode === "string" && record.tensionMode.trim()
        ? record.tensionMode.trim()
        : fallback.tensionMode,
    expositionMode:
      typeof record?.expositionMode === "string" && record.expositionMode.trim()
        ? record.expositionMode.trim()
        : fallback.expositionMode,
    sensoryWeight:
      typeof record?.sensoryWeight === "string" && record.sensoryWeight.trim()
        ? record.sensoryWeight.trim()
        : fallback.sensoryWeight,
    interiorityMode:
      typeof record?.interiorityMode === "string" && record.interiorityMode.trim()
        ? record.interiorityMode.trim()
        : fallback.interiorityMode,
    sentenceDynamics: {
      baseline:
        typeof sentenceDynamics?.baseline === "string" && sentenceDynamics.baseline.trim()
          ? sentenceDynamics.baseline.trim()
          : fallback.sentenceDynamics.baseline,
      underStress:
        typeof sentenceDynamics?.underStress === "string" && sentenceDynamics.underStress.trim()
          ? sentenceDynamics.underStress.trim()
          : fallback.sentenceDynamics.underStress,
      fragmentation:
        typeof sentenceDynamics?.fragmentation === "string" && sentenceDynamics.fragmentation.trim()
          ? sentenceDynamics.fragmentation.trim()
          : fallback.sentenceDynamics.fragmentation
    },
    sceneHooks: {
      opening:
        typeof sceneHooks?.opening === "string" && sceneHooks.opening.trim()
          ? sceneHooks.opening.trim()
          : fallback.sceneHooks.opening,
      ending:
        typeof sceneHooks?.ending === "string" && sceneHooks.ending.trim()
          ? sceneHooks.ending.trim()
          : fallback.sceneHooks.ending
    },
    dialogueMode:
      typeof record?.dialogueMode === "string" && record.dialogueMode.trim()
        ? record.dialogueMode.trim()
        : fallback.dialogueMode,
    revealPattern:
      typeof record?.revealPattern === "string" && record.revealPattern.trim()
        ? record.revealPattern.trim()
        : fallback.revealPattern,
    anchorPolicy:
      typeof record?.anchorPolicy === "string" && record.anchorPolicy.trim()
        ? record.anchorPolicy.trim()
        : fallback.anchorPolicy,
    techniqueRules: normalizeBookRuleList(record?.techniqueRules, fallback.techniqueRules),
    antiImitationRules: normalizeBookRuleList(
      record?.antiImitationRules,
      fallback.antiImitationRules
    )
  };
}

export function createEmptyBookRuntimeContext(): BookRuntimeContext {
  return {
    lockedFacts: createEmptyBookLockedFacts(),
    continuityGuardrails: [],
    proseTechniqueProfile: createDefaultBookProseTechniqueProfile()
  };
}

export function normalizeBookRuntimeContext(value: unknown): BookRuntimeContext {
  const fallback = createEmptyBookRuntimeContext();
  const record = value && typeof value === "object" ? (value as Partial<BookRuntimeContext>) : null;

  return {
    lockedFacts: normalizeBookLockedFacts(record?.lockedFacts),
    continuityGuardrails: Array.isArray(record?.continuityGuardrails)
      ? record.continuityGuardrails
          .filter(function (entry): entry is string {
            return typeof entry === "string";
          })
          .map(function (entry) {
            return entry.trim();
          })
          .filter(Boolean)
      : fallback.continuityGuardrails,
    proseTechniqueProfile: normalizeBookProseTechniqueProfile(record?.proseTechniqueProfile)
  };
}

export function createDefaultAssistantWorkspace(): AssistantWorkspace {
  return {
    preferences: {
      provider: "auto",
      outputMode: "chat",
      modelSelection: createDefaultAssistantModelSelection()
    },
    threads: [],
    artifacts: []
  };
}

export function createDefaultAssistantModelSelection(): AssistantModelSelection {
  return {
    openai: "",
    anthropic: ""
  };
}

export function createDefaultAssistantContextSelection(
  scope: AssistantContextScope = "project",
  ids?: Partial<AssistantContextSelection>
): AssistantContextSelection {
  return {
    scope,
    actId: ids?.actId ?? null,
    chapterId: ids?.chapterId ?? null,
    sceneId: ids?.sceneId ?? null
  };
}

export function normalizeAssistantWorkspace(value: unknown): AssistantWorkspace {
  const fallback = createDefaultAssistantWorkspace();
  const candidate = value && typeof value === "object" ? (value as Partial<AssistantWorkspace>) : null;

  return {
    preferences: {
      provider: normalizeAssistantProvider(candidate?.preferences?.provider),
      outputMode: normalizeAssistantOutputMode(candidate?.preferences?.outputMode),
      modelSelection: normalizeAssistantModelSelection(candidate?.preferences?.modelSelection)
    },
    threads: Array.isArray(candidate?.threads)
      ? candidate.threads
          .filter(function (thread): thread is AssistantThread {
            return Boolean(thread) && typeof thread === "object";
          })
          .map(normalizeAssistantThread)
      : fallback.threads,
    artifacts: Array.isArray(candidate?.artifacts)
      ? candidate.artifacts
          .filter(function (artifact): artifact is AssistantArtifact {
            return Boolean(artifact) && typeof artifact === "object";
          })
          .map(normalizeAssistantArtifact)
      : fallback.artifacts
  };
}

export function createDefaultBookBlueprint(title = "Untitled Book"): BookBlueprint {
  return {
    priority: "primary",
    activePhase: "phase_1_foundation",
    engineMode: "default",
    targetFormat: "novel",
    targetLengthWords: 70000,
    masterBrief: {
      premise: "",
      readerPromise: "",
      endingPromise: "",
      thematicCore: "",
      authorIntent: "",
      currentFocus: "",
      storyArchitecture: DEFAULT_BOOK_STORY_ARCHITECTURE.slice()
    },
    marketBrief: {
      amazonGoal: "",
      categoryLane: "",
      hook: "",
      seriesPotential: "",
      coverDirection: "",
      publishingGuardrails: DEFAULT_BOOK_PUBLISHING_GUARDRAILS.slice()
    },
    writerConstitution: DEFAULT_BOOK_WRITER_CONSTITUTION.slice(),
    masterBriefRuntime: createEmptyBookRuntimeContext(),
    writerRulesRuntime: createEmptyBookRuntimeContext(),
    threatModel: {
      lockedFacts: createEmptyBookLockedFacts()
    },
    memory: createDefaultBookMemoryBackbone(),
    draftEngine: {
      mode: "local",
      targetSceneWordsMin: 900,
      targetSceneWordsMax: 1400,
      styleProfileVersion: "rewrite_length_control_v2",
      marketProfileVersion: "rewrite_length_control_v2",
      jobs: []
    },
    amazonOps: {
      penName: "",
      subtitle: "",
      seriesName: "",
      volumeNumber: "",
      description: "",
      keywords: [],
      categories: [],
      audienceTags: [],
      aiDisclosure: "assisted",
      launchChecklist: {
        manuscriptReady: false,
        coverReady: false,
        blurbReady: false,
        keywordsReady: false,
        categoriesReady: false,
        aiDisclosureReady: false
      }
    }
  };
}

export function getAllScenes(story: StoryDocument) {
  return story.acts.flatMap(function (act) {
    return act.chapters.flatMap(function (chapter) {
      return chapter.scenes;
    });
  });
}

export function countWords(value: string) {
  const words = value.trim().match(/\S+/g);
  return words ? words.length : 0;
}

export function countSceneWords(scene: Pick<StoryScene, "summary" | "blocks">) {
  return countWords(
    [scene.summary]
      .concat(
        scene.blocks.map(function (block) {
          return block.text;
        })
      )
      .join(" ")
  );
}

export function withDraftMemorySync(
  extractedState: Omit<DraftExtractionState, "memorySync"> | DraftExtractionState,
  options?: {
    fallbackCreatedAt?: string | null;
    defaultStatus?: DraftMemorySyncStatus;
  }
): DraftExtractionState {
  const fallbackCreatedAt = options?.fallbackCreatedAt || new Date().toISOString();
  const defaultStatus = options?.defaultStatus || "pending";
  const base = {
    newCanonFacts: normalizeDraftExtractArray(extractedState.newCanonFacts),
    characterStateUpdates: normalizeDraftExtractArray(extractedState.characterStateUpdates),
    openThreadsCreated: normalizeDraftExtractArray(extractedState.openThreadsCreated),
    openThreadsResolved: normalizeDraftExtractArray(extractedState.openThreadsResolved),
    foreshadowingAdded: normalizeDraftExtractArray(extractedState.foreshadowingAdded),
    continuityRisks: normalizeDraftExtractArray(extractedState.continuityRisks),
    styleDriftNotes: normalizeDraftExtractArray(extractedState.styleDriftNotes)
  };

  return {
    ...base,
    memorySync: normalizeDraftMemorySyncState(
      "memorySync" in extractedState ? extractedState.memorySync : null,
      base,
      {
        fallbackCreatedAt,
        defaultStatus
      }
    )
  };
}

function normalizeDraftMemorySyncState(
  value: DraftMemorySyncState | null,
  extractedState: Omit<DraftExtractionState, "memorySync">,
  options: {
    fallbackCreatedAt: string;
    defaultStatus: DraftMemorySyncStatus;
  }
): DraftMemorySyncState {
  const existingItems = Array.isArray(value?.items)
    ? value.items
        .filter(function (item): item is DraftMemorySyncItem {
          return Boolean(item) && typeof item === "object";
        })
        .map(function (item) {
          return normalizeDraftMemorySyncItem(item, options.fallbackCreatedAt, options.defaultStatus);
        })
    : [];
  const existingByKey = new Map<string, DraftMemorySyncItem>();

  existingItems.forEach(function (item) {
    existingByKey.set(createDraftMemorySyncKey(item.kind, item.value), item);
  });

  const seededItems = createDraftMemorySyncSeedItems(extractedState, options).map(function (item) {
    return existingByKey.get(createDraftMemorySyncKey(item.kind, item.value)) ?? item;
  });

  return {
    items: seededItems
  };
}

function createDraftMemorySyncSeedItems(
  extractedState: Omit<DraftExtractionState, "memorySync">,
  options: {
    fallbackCreatedAt: string;
    defaultStatus: DraftMemorySyncStatus;
  }
): DraftMemorySyncItem[] {
  return [
    createDraftMemorySyncItemsForKind(
      extractedState.newCanonFacts,
      "canon_fact",
      options
    ),
    createDraftMemorySyncItemsForKind(
      extractedState.characterStateUpdates,
      "character_state",
      options
    ),
    createDraftMemorySyncItemsForKind(
      extractedState.foreshadowingAdded,
      "foreshadowing",
      options
    )
  ].flat();
}

function createDraftMemorySyncItemsForKind(
  values: string[],
  kind: DraftMemorySyncItemKind,
  options: {
    fallbackCreatedAt: string;
    defaultStatus: DraftMemorySyncStatus;
  }
): DraftMemorySyncItem[] {
  return values.map(function (value) {
    return {
      id: createUuid(),
      kind,
      value,
      status: options.defaultStatus,
      createdAt: options.fallbackCreatedAt,
      reviewedAt: options.defaultStatus === "pending" ? null : options.fallbackCreatedAt
    };
  });
}

function normalizeDraftMemorySyncItem(
  value: DraftMemorySyncItem,
  fallbackCreatedAt: string,
  defaultStatus: DraftMemorySyncStatus
): DraftMemorySyncItem {
  return {
    id: typeof value.id === "string" && value.id.trim() ? value.id : createUuid(),
    kind: normalizeDraftMemorySyncKind(value.kind),
    value: typeof value.value === "string" ? value.value.trim() : "",
    status: normalizeDraftMemorySyncStatus(value.status, defaultStatus),
    createdAt:
      typeof value.createdAt === "string" && value.createdAt.trim()
        ? value.createdAt
        : fallbackCreatedAt,
    reviewedAt:
      typeof value.reviewedAt === "string" && value.reviewedAt.trim()
        ? value.reviewedAt
        : normalizeDraftMemorySyncStatus(value.status, defaultStatus) === "pending"
          ? null
          : fallbackCreatedAt
  };
}

function normalizeDraftMemorySyncKind(value: unknown): DraftMemorySyncItemKind {
  if (value === "canon_fact" || value === "character_state" || value === "foreshadowing") {
    return value;
  }

  return "canon_fact";
}

function normalizeDraftMemorySyncStatus(
  value: unknown,
  fallback: DraftMemorySyncStatus
): DraftMemorySyncStatus {
  if (value === "pending" || value === "approved" || value === "rejected") {
    return value;
  }

  return fallback;
}

function normalizeDraftExtractArray(value: string[] | undefined) {
  return Array.isArray(value)
    ? value
        .map(function (entry) {
          return typeof entry === "string" ? entry.trim() : "";
        })
        .filter(Boolean)
    : [];
}

function normalizeBookTruthStatus(value: unknown): BookKnowledgeState["truthStatus"] {
  if (value === "true" || value === "false" || value === "unknown" || value === "contested") {
    return value;
  }

  return "unknown";
}

function normalizeBookReaderState(value: unknown): BookKnowledgeState["readerState"] {
  if (value === "unknown" || value === "suspected" || value === "confirmed") {
    return value;
  }

  return "unknown";
}

function normalizeBookPromiseKind(value: unknown): BookPromiseState["kind"] {
  if (
    value === "mystery" ||
    value === "emotional" ||
    value === "object" ||
    value === "relationship" ||
    value === "plot" ||
    value === "thematic"
  ) {
    return value;
  }

  return "plot";
}

function normalizeBookPromiseStatus(value: unknown): BookPromiseState["status"] {
  if (
    value === "open" ||
    value === "reinforced" ||
    value === "partially_paid" ||
    value === "paid" ||
    value === "dropped"
  ) {
    return value;
  }

  return "open";
}

function createDraftMemorySyncKey(kind: DraftMemorySyncItemKind, value: string) {
  return `${kind}::${value.trim().toLowerCase()}`;
}

export function normalizeStoryWordCounts(story: StoryDocument): StoryDocument {
  const acts = story.acts.map(function (act) {
    const chapters = act.chapters.map(function (chapter) {
      const scenes = chapter.scenes.map(function (scene) {
        return {
          ...scene,
          wordCount: countSceneWords(scene)
        };
      });

      return {
        ...chapter,
        scenes,
        wordCount: scenes.reduce(function (sum, scene) {
          return sum + scene.wordCount;
        }, 0)
      };
    });

    return {
      ...act,
      chapters
    };
  });

  return {
    ...story,
    acts
  };
}

export function findSceneContext(
  story: StoryDocument,
  sceneId: string
): SceneContext | null {
  for (const act of story.acts) {
    for (const chapter of act.chapters) {
      for (const scene of chapter.scenes) {
        if (scene.id === sceneId) {
          return {
            act,
            chapter,
            scene
          };
        }
      }
    }
  }

  return null;
}

export function updateSceneInStory(
  story: StoryDocument,
  sceneId: string,
  updater: (scene: StoryScene) => StoryScene
) {
  let hasChanged = false;

  const acts = story.acts.map(function (act) {
    let actChanged = false;

    const chapters = act.chapters.map(function (chapter) {
      let chapterChanged = false;

      const scenes = chapter.scenes.map(function (scene) {
        if (scene.id !== sceneId) {
          return scene;
        }

        hasChanged = true;
        actChanged = true;
        chapterChanged = true;

        const nextScene = updater(scene);

        return {
          ...nextScene,
          wordCount: countSceneWords(nextScene)
        };
      });

      if (!chapterChanged) {
        return chapter;
      }

      return {
        ...chapter,
        scenes,
        wordCount: scenes.reduce(function (sum, scene) {
          return sum + scene.wordCount;
        }, 0)
      };
    });

    if (!actChanged) {
      return act;
    }

    return {
      ...act,
      chapters
    };
  });

  if (!hasChanged) {
    return story;
  }

  return {
    ...story,
    acts
  };
}

export function countStoryStats(story: StoryDocument) {
  const chapters = story.acts.flatMap(function (act) {
    return act.chapters;
  });
  const scenes = getAllScenes(story);
  const choiceCount = isBranchingStory(story)
    ? scenes.reduce(function (sum, scene) {
        return sum + scene.choices.length;
      }, 0)
    : 0;

  return {
    actCount: story.acts.length,
    chapterCount: chapters.length,
    sceneCount: scenes.length,
    choiceCount,
    wordCount: scenes.reduce(function (sum, scene) {
      return sum + countSceneWords(scene);
    }, 0)
  };
}

export function normalizeBookDraftTargets(
  targetSceneWordsMin: number,
  targetSceneWordsMax: number
) {
  const safeMin = Number.isFinite(targetSceneWordsMin)
    ? Math.max(250, Math.round(targetSceneWordsMin))
    : 900;
  const safeMax = Number.isFinite(targetSceneWordsMax)
    ? Math.max(350, Math.round(targetSceneWordsMax))
    : 1400;

  if (safeMax <= safeMin) {
    return {
      targetSceneWordsMin: safeMin,
      targetSceneWordsMax: safeMin + 250
    };
  }

  return {
    targetSceneWordsMin: safeMin,
    targetSceneWordsMax: safeMax
  };
}

export function analyzeBookDraftPreparation(
  story: StoryDocument,
  sceneId: string,
  targetSceneWordsMin: number,
  targetSceneWordsMax: number
): BookDraftPreparationIssue[] {
  const sceneContext = findSceneContext(story, sceneId);
  const issues: BookDraftPreparationIssue[] = [];
  const normalizedTargets = normalizeBookDraftTargets(targetSceneWordsMin, targetSceneWordsMax);

  if (!sceneContext) {
    return [
      {
        level: "blocking",
        message: "Für den Book-Job ist aktuell keine gültige Szene ausgewählt."
      }
    ];
  }

  if (targetSceneWordsMin !== normalizedTargets.targetSceneWordsMin || targetSceneWordsMax !== normalizedTargets.targetSceneWordsMax) {
    issues.push({
      level: "warning",
      message: `Der Zielbereich wurde technisch bereinigt auf ${normalizedTargets.targetSceneWordsMin}-${normalizedTargets.targetSceneWordsMax} Wörter.`
    });
  }

  if (countWords(sceneContext.scene.summary) < 12) {
    issues.push({
      level: "blocking",
      message: "Die Szenen-Summary ist zu dünn. Für belastbare Draft-Jobs braucht die Szene erst einen klaren Beat-, Konflikt- und Ergebnis-Satz."
    });
  }

  if (!story.book.masterBrief.premise.trim()) {
    issues.push({
      level: "blocking",
      message: "Die Prämisse fehlt. Ohne klaren Stoffkern driftet der Buch-Job zu schnell in generische Prosa."
    });
  }

  if (!story.book.masterBrief.readerPromise.trim()) {
    issues.push({
      level: "warning",
      message: "Reader Promise fehlt. Dadurch bleibt die Ton- und Marktsteuerung unnötig weich."
    });
  }

  if (!story.book.marketBrief.hook.trim()) {
    issues.push({
      level: "warning",
      message: "Commercial Hook fehlt. Der Draft hat dann weniger Zug und endet oft schwächer."
    });
  }

  if (story.book.writerConstitution.length < 3) {
    issues.push({
      level: "warning",
      message: "Die Writer Constitution ist sehr kurz. Für stabile Premium-Drafts sollte sie mehr als nur Basisregeln tragen."
    });
  }

  if (story.worldBible.length === 0) {
    issues.push({
      level: "warning",
      message: "Es gibt noch keine World-Bible-Einträge. Der Draft kann laufen, aber Kanon und Figurenanker bleiben fragiler."
    });
  }

  return issues;
}

export function appendActToStory(story: StoryDocument): InsertActResult {
  const actOrder = story.acts.length + 1;
  const actId = createLocalId("act");
  const chapterId = createLocalId("chapter");
  const sceneId = createLocalId("scene");

  const nextScene = createEmptyScene(chapterId, sceneId, 1);
  const nextChapter: StoryChapter = {
    id: chapterId,
    actId,
    title: `Chapter ${1}`,
    order: 1,
    scenes: [nextScene],
    wordCount: nextScene.wordCount
  };

  const nextAct: StoryAct = {
    id: actId,
    title: `Act ${actOrder}`,
    order: actOrder,
    chapters: [nextChapter]
  };

  return {
    story: {
      ...story,
      acts: story.acts.concat(nextAct)
    },
    actId,
    chapterId,
    sceneId
  };
}

export function appendChapterToAct(
  story: StoryDocument,
  actId: string
): InsertChapterResult {
  let insertedChapterId = "";
  let insertedSceneId = "";

  const acts = story.acts.map(function (act) {
    if (act.id !== actId) {
      return act;
    }

    const chapterOrder = act.chapters.length + 1;
    const chapterId = createLocalId("chapter");
    const sceneId = createLocalId("scene");
    const nextScene = createEmptyScene(chapterId, sceneId, 1);

    insertedChapterId = chapterId;
    insertedSceneId = sceneId;

    return {
      ...act,
      chapters: act.chapters.concat({
        id: chapterId,
        actId,
        title: `Chapter ${chapterOrder}`,
        order: chapterOrder,
        scenes: [nextScene],
        wordCount: nextScene.wordCount
      })
    };
  });

  return {
    story: {
      ...story,
      acts
    },
    chapterId: insertedChapterId,
    sceneId: insertedSceneId
  };
}

export function appendSceneToChapter(
  story: StoryDocument,
  chapterId: string
): InsertSceneResult {
  let insertedSceneId = "";

  const acts = story.acts.map(function (act) {
    const chapters = act.chapters.map(function (chapter) {
      if (chapter.id !== chapterId) {
        return chapter;
      }

      const sceneOrder = chapter.scenes.length + 1;
      const sceneId = createLocalId("scene");
      const nextScene = createEmptyScene(chapterId, sceneId, sceneOrder);

      insertedSceneId = sceneId;

      return {
        ...chapter,
        scenes: chapter.scenes.concat(nextScene),
        wordCount: chapter.scenes.reduce(function (sum, scene) {
          return sum + scene.wordCount;
        }, 0) + nextScene.wordCount
      };
    });

    return {
      ...act,
      chapters
    };
  });

  return {
    story: {
      ...story,
      acts
    },
    sceneId: insertedSceneId
  };
}

export function createEmptyStoryDocument(
  storyId: string,
  workspaceId: string,
  title = "New Novel"
): StoryDocument {

  return {
    id: storyId,
    workspaceId,
    title,
    authorName: "",
    status: "draft",
    mode: "book",
    meta: {
      genre: "",
      language: "de",
      audience: "Adult"
    },
    book: createDefaultBookBlueprint(title),
    assistant: createDefaultAssistantWorkspace(),
    worldBible: [],
    variables: [],
    acts: []
  };
}

function normalizeAssistantThread(thread: AssistantThread): AssistantThread {
  const now = new Date().toISOString();
  const legacySceneId = typeof (thread as { sceneId?: unknown }).sceneId === "string"
    ? ((thread as { sceneId?: string }).sceneId ?? null)
    : null;

  return {
    id: typeof thread.id === "string" && thread.id ? thread.id : createUuid(),
    title: typeof thread.title === "string" && thread.title.trim() ? thread.title.trim() : "Neues Gespräch",
    summary: typeof thread.summary === "string" ? thread.summary : "",
    context: normalizeAssistantContextSelection(thread.context, legacySceneId),
    createdAt:
      typeof thread.createdAt === "string" && thread.createdAt ? thread.createdAt : now,
    updatedAt:
      typeof thread.updatedAt === "string" && thread.updatedAt ? thread.updatedAt : now,
    messages: Array.isArray(thread.messages)
      ? thread.messages
          .filter(function (message): message is AssistantMessage {
            return Boolean(message) && typeof message === "object";
          })
          .map(normalizeAssistantMessage)
      : []
  };
}

function normalizeAssistantMessage(message: AssistantMessage): AssistantMessage {
  const legacySceneId = typeof (message as { sceneId?: unknown }).sceneId === "string"
    ? ((message as { sceneId?: string }).sceneId ?? null)
    : null;

  return {
    id: typeof message.id === "string" && message.id ? message.id : createUuid(),
    role: message.role === "assistant" ? "assistant" : "user",
    content: typeof message.content === "string" ? message.content : "",
    createdAt:
      typeof message.createdAt === "string" && message.createdAt
        ? message.createdAt
        : new Date().toISOString(),
    outputMode: normalizeAssistantOutputMode(message.outputMode),
    provider: normalizeAssistantProvider(message.provider),
    modelName: typeof message.modelName === "string" && message.modelName ? message.modelName : null,
    context: normalizeAssistantContextSelection(message.context, legacySceneId),
    artifactId: typeof message.artifactId === "string" && message.artifactId ? message.artifactId : null
  };
}

function normalizeAssistantArtifact(artifact: AssistantArtifact): AssistantArtifact {
  const now = new Date().toISOString();
  const legacySceneId = typeof (artifact as { sceneId?: unknown }).sceneId === "string"
    ? ((artifact as { sceneId?: string }).sceneId ?? null)
    : null;

  return {
    id: typeof artifact.id === "string" && artifact.id ? artifact.id : createUuid(),
    threadId: typeof artifact.threadId === "string" ? artifact.threadId : "",
    sourceMessageId:
      typeof artifact.sourceMessageId === "string" && artifact.sourceMessageId
        ? artifact.sourceMessageId
        : null,
    title:
      typeof artifact.title === "string" && artifact.title.trim()
        ? artifact.title.trim()
        : "Unbenanntes Dokument",
    kind: artifact.kind === "regie" ? "regie" : "note",
    format: "markdown",
    summary: typeof artifact.summary === "string" ? artifact.summary : "",
    content: typeof artifact.content === "string" ? artifact.content : "",
    context: normalizeAssistantContextSelection(artifact.context, legacySceneId),
    createdAt:
      typeof artifact.createdAt === "string" && artifact.createdAt ? artifact.createdAt : now,
    updatedAt:
      typeof artifact.updatedAt === "string" && artifact.updatedAt ? artifact.updatedAt : now
  };
}

function normalizeAssistantProvider(value: unknown): AssistantProvider {
  if (
    value === "auto" ||
    value === "openai" ||
    value === "anthropic" ||
    value === "local"
  ) {
    return value;
  }

  return "auto";
}

function normalizeAssistantOutputMode(value: unknown): AssistantOutputMode {
  if (value === "regie" || value === "note") {
    return value;
  }

  return "chat";
}

function normalizeAssistantModelSelection(value: unknown): AssistantModelSelection {
  const candidate =
    value && typeof value === "object" ? (value as Partial<AssistantModelSelection>) : null;

  return {
    openai: typeof candidate?.openai === "string" ? candidate.openai : "",
    anthropic: typeof candidate?.anthropic === "string" ? candidate.anthropic : ""
  };
}

function normalizeAssistantContextSelection(
  value: unknown,
  legacySceneId?: string | null
): AssistantContextSelection {
  const candidate =
    value && typeof value === "object" ? (value as Partial<AssistantContextSelection>) : null;
  const sceneId =
    typeof candidate?.sceneId === "string" && candidate.sceneId
      ? candidate.sceneId
      : legacySceneId ?? null;
  const chapterId =
    typeof candidate?.chapterId === "string" && candidate.chapterId ? candidate.chapterId : null;
  const actId = typeof candidate?.actId === "string" && candidate.actId ? candidate.actId : null;
  const scope =
    candidate?.scope === "act" ||
    candidate?.scope === "chapter" ||
    candidate?.scope === "scene" ||
    candidate?.scope === "project"
      ? candidate.scope
      : sceneId
        ? "scene"
        : "project";

  return {
    scope,
    actId,
    chapterId,
    sceneId
  };
}

function createEmptyScene(chapterId: string, sceneId: string, order: number): StoryScene {
  return {
    id: sceneId,
    chapterId,
    title: `Scene ${order}`,
    order,
    label: "New Scene",
    summary: "",
    wordCount: 0,
    blocks: [
      {
        id: createUuid(),
        kind: "paragraph",
        text: ""
      }
    ],
    choices: []
  };
}

function createLocalId(_prefix: string) {
  return createUuid();
}

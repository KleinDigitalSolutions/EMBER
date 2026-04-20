import { createUuid } from "@/lib/id";

export type StoryStatus = "draft" | "playtest" | "submitted";
export type StoryMode = "book" | "branching";
export type BookJobProvider = "openai" | "anthropic" | "gemini" | "local";
export type BookJobMode = "remote" | "local_fallback";
export type BookDraftStageId =
  | "context"
  | "outline"
  | "draft"
  | "extract"
  | "continuity"
  | "rewrite";
export type BookDraftStageStatus = "completed" | "failed" | "skipped";
export type BookDraftStageRun = {
  status: BookDraftStageStatus;
  provider: BookJobProvider;
  modelName: string | null;
  updatedAt: string | null;
  notes: string[];
};
export type BookDraftStageRuns = {
  context: BookDraftStageRun;
  outline: BookDraftStageRun;
  draft: BookDraftStageRun;
  extract: BookDraftStageRun;
  continuity: BookDraftStageRun;
  rewrite: BookDraftStageRun;
};

export const LEGACY_BOOK_WRITER_CONSTITUTION = [
  "Jede Szene braucht Ziel, Widerstand, Wendung und Nachhall.",
  "Exposition bleibt knapp und wird nur dramatisch verdient platziert.",
  "Dialog muss Information tragen oder Spannung verschieben.",
  "Kanon geht vor Improvisation; Luecken werden markiert statt erfunden."
] as const;

export const DEFAULT_BOOK_STORY_ARCHITECTURE = [
  "Akt 1: Setup. Fuehre Figur, Welt und zentrales Problem ein und ende mit dem ausloesenden Ereignis.",
  "Akt 2: Konfrontation. Lass den Widerstand wachsen, setze einen klaren Midpoint-Turn und ende in einer scheinbar hoffnungslosen Lage.",
  "Akt 3: Aufloesung. Liefere Klimax, Konsequenzen und einen befriedigenden Schluss fuer Plot und Emotion.",
  "Tracke Wollen vs. Brauchen: Das sichtbare Ziel zieht die erste Haelfte, die tiefere innere Notwendigkeit loest die zweite Haelfte."
] as const;

export const DEFAULT_BOOK_WRITER_CONSTITUTION = [
  "Jede Szene braucht Ziel, Widerstand, Wendung und Nachhall.",
  "Steige spaet in die Szene ein und verlasse sie frueh, sobald der dramatische Punkt gesetzt ist.",
  "Zeige Emotion ueber Verhalten, Koerper, Handlung und sinnliche Details statt sie nur zu benennen.",
  "Dialog ist dramatische Verdichtung; jede Zeile muss Konflikt, Information oder Machtbalance verschieben.",
  "Starker Dialog traegt Subtext: Was Figuren sagen und was sie meinen, darf auseinanderliegen.",
  "Negative Regel: Figuren erklaeren ihre Emotion nicht essayistisch; sie reagieren konkret, treffen Entscheidungen und tragen die Spannung ueber Handlung.",
  "Negative Regel: Hauptfiguren klingen nie generisch, passiv-aggressiv oder austauschbar; jede Stimme bleibt klar, gerichtsfest und wiedererkennbar.",
  "Pacing wird bewusst gesteuert: kurze Saetze fuer Druck, laengere fuer Reflexion und Nachhall.",
  "Kapitel und Szenen enden nach Moeglichkeit mit einem klaren Haken, einer offenen Reibung oder einer neuen Drohung, nicht mit weichem Auslaufen.",
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

export type AssistantProvider = "auto" | "openai" | "anthropic" | "gemini" | "local";
export type AssistantOutputMode = "chat" | "regie";
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
  gemini: string;
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
  targetFormat: "novella" | "novel" | "series";
  targetLengthWords: number;
  masterBrief: {
    premise: string;
    readerPromise: string;
    endingPromise: string;
    thematicCore: string;
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
  memory: BookMemoryBackbone;
  draftEngine: BookDraftEngine;
  amazonOps: AmazonOps;
};

export type BookDraftEngine = {
  mode: "local";
  targetSceneWordsMin: number;
  targetSceneWordsMax: number;
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
  stages: BookDraftStageRuns;
  contextSnapshot: {
    contextPackId: string;
    memorySyncedAt: string | null;
    chapterTitle: string;
    sceneSummary: string;
    relevantCodexTitles: string[];
    relevantCharacterNames: string[];
    activeThreadLabels: string[];
  };
};

export type BookMemoryBackbone = {
  lastSyncedAt: string | null;
  canonLedger: BookCanonFact[];
  characterLedger: BookCharacterState[];
  openThreads: BookOpenThread[];
  sceneCards: BookSceneCard[];
  contextPacks: BookContextPack[];
  continuityNotes: string[];
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

export type BookSceneCard = {
  sceneId: string;
  sceneTitle: string;
  actTitle: string;
  chapterTitle: string;
  summary: string;
  excerpt: string;
  orderLabel: string;
  chapterGoal: string;
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
};

export type DraftExtractionState = {
  newCanonFacts: string[];
  characterStateUpdates: string[];
  openThreadsCreated: string[];
  openThreadsResolved: string[];
  foreshadowingAdded: string[];
  continuityRisks: string[];
  styleDriftNotes: string[];
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

export function createDefaultBookMemoryBackbone(): BookMemoryBackbone {
  return {
    lastSyncedAt: null,
    canonLedger: [],
    characterLedger: [],
    openThreads: [],
    sceneCards: [],
    contextPacks: [],
    continuityNotes: []
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
    anthropic: "",
    gemini: ""
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
    targetFormat: "novel",
    targetLengthWords: 70000,
    masterBrief: {
      premise: "",
      readerPromise: "",
      endingPromise: "",
      thematicCore: "",
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
    memory: createDefaultBookMemoryBackbone(),
    draftEngine: {
      mode: "local",
      targetSceneWordsMin: 900,
      targetSceneWordsMax: 1400,
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
    value === "gemini" ||
    value === "local"
  ) {
    return value;
  }

  return "auto";
}

function normalizeAssistantOutputMode(value: unknown): AssistantOutputMode {
  return value === "regie" ? "regie" : "chat";
}

function normalizeAssistantModelSelection(value: unknown): AssistantModelSelection {
  const candidate =
    value && typeof value === "object" ? (value as Partial<AssistantModelSelection>) : null;

  return {
    openai: typeof candidate?.openai === "string" ? candidate.openai : "",
    anthropic: typeof candidate?.anthropic === "string" ? candidate.anthropic : "",
    gemini: typeof candidate?.gemini === "string" ? candidate.gemini : ""
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

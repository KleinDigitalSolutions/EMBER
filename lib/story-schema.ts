import { createUuid } from "@/lib/id";

export type StoryStatus = "draft" | "playtest" | "submitted";
export type StoryMode = "book" | "branching";
export type BookJobProvider = "openai" | "anthropic" | "gemini" | "local";
export type BookJobMode = "remote" | "local_fallback";

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
  "Pacing wird bewusst gesteuert: kurze Saetze fuer Druck, laengere fuer Reflexion und Nachhall.",
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
  worldBible: WorldBibleEntry[];
  variables: StoryVariable[];
  acts: StoryAct[];
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

export function createDefaultBookBlueprint(title = "Untitled Book"): BookBlueprint {
  return {
    priority: "primary",
    activePhase: "phase_1_foundation",
    targetFormat: "novel",
    targetLengthWords: 70000,
    masterBrief: {
      premise: `${title} braucht noch eine klare Marktprämisse.`,
      readerPromise: "",
      endingPromise: "",
      thematicCore: "",
      storyArchitecture: DEFAULT_BOOK_STORY_ARCHITECTURE.slice()
    },
    marketBrief: {
      amazonGoal: "Schnell validierbarer Genretitel mit sauberem Serienpotenzial.",
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
        id: `${sceneId}_block_1`,
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

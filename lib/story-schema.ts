export type StoryStatus = "draft" | "playtest" | "submitted";

export type StoryDocument = {
  id: string;
  workspaceId: string;
  title: string;
  authorName: string;
  status: StoryStatus;
  meta: {
    genre: string;
    language: string;
    audience: string;
  };
  worldBible: WorldBibleEntry[];
  variables: StoryVariable[];
  acts: StoryAct[];
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

  return {
    actCount: story.acts.length,
    chapterCount: chapters.length,
    sceneCount: scenes.length,
    choiceCount: scenes.reduce(function (sum, scene) {
      return sum + scene.choices.length;
    }, 0),
    wordCount: scenes.reduce(function (sum, scene) {
      return sum + scene.wordCount;
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

function createLocalId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

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

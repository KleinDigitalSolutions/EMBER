(function () {
  const STORY = window.EMBER_STORY;

  if (!STORY) {
    throw new Error("EMBER_STORY ist nicht geladen.");
  }

  const STORAGE_KEY = "ember-progress-v1";
  const app = document.getElementById("app");
  const sceneIndexMap = new Map(
    STORY.scenes.map(function (scene, index) {
      return [scene.id, index];
    })
  );
  const sceneIdSet = new Set(sceneIndexMap.keys());
  const endingIdSet = new Set(Object.keys(STORY.endings));
  const reducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timings = {
    fade: reducedMotion ? 0 : 180,
    chapterHold: reducedMotion ? 30 : 1850
  };

  let chapterTimerId = 0;
  let navigationLocked = false;
  let runtime = loadRuntime();

  function getInitialRuntime() {
    return {
      screen: "start",
      currentSceneId: STORY.startSceneId,
      currentEndingId: null,
      chapterCardFor: STORY.startSceneId,
      flags: {}
    };
  }

  function sanitizeRuntime(candidate) {
    const fallback = getInitialRuntime();

    if (!candidate || typeof candidate !== "object") {
      return fallback;
    }

    const safeFlags =
      candidate.flags && typeof candidate.flags === "object" && !Array.isArray(candidate.flags)
        ? candidate.flags
        : {};

    const safeSceneId = sceneIdSet.has(candidate.currentSceneId)
      ? candidate.currentSceneId
      : STORY.startSceneId;
    const safeChapterId = sceneIdSet.has(candidate.chapterCardFor)
      ? candidate.chapterCardFor
      : safeSceneId;
    const safeEndingId = endingIdSet.has(candidate.currentEndingId)
      ? candidate.currentEndingId
      : null;

    const allowedScreens = new Set(["start", "intro", "chapter", "scene", "ending"]);
    const safeScreen = allowedScreens.has(candidate.screen)
      ? candidate.screen
      : fallback.screen;

    return {
      screen: safeScreen,
      currentSceneId: safeSceneId,
      currentEndingId: safeEndingId,
      chapterCardFor: safeChapterId,
      flags: safeFlags
    };
  }

  function loadRuntime() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return getInitialRuntime();
      }

      return sanitizeRuntime(JSON.parse(raw));
    } catch (error) {
      return getInitialRuntime();
    }
  }

  function saveRuntime() {
    if (runtime.screen === "start") {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(runtime));
  }

  function clearChapterTimer() {
    if (chapterTimerId) {
      window.clearTimeout(chapterTimerId);
      chapterTimerId = 0;
    }
  }

  function getScene(sceneId) {
    const sceneIndex = sceneIndexMap.get(sceneId);
    return typeof sceneIndex === "number" ? STORY.scenes[sceneIndex] : null;
  }

  function getCurrentScene() {
    if (runtime.screen === "chapter") {
      return getScene(runtime.chapterCardFor);
    }

    return getScene(runtime.currentSceneId);
  }

  function getEnding() {
    return STORY.endings[runtime.currentEndingId] || null;
  }

  function matchesState(condition) {
    if (!condition) {
      return true;
    }

    return Object.keys(condition).every(function (key) {
      return runtime.flags[key] === condition[key];
    });
  }

  function getVisibleBlocks(blocks) {
    return blocks.filter(function (block) {
      const passesWhen = matchesState(block.when);
      const passesUnless = block.unless ? !matchesState(block.unless) : true;
      return passesWhen && passesUnless;
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function fadeTo(update) {
    if (navigationLocked) {
      return;
    }

    navigationLocked = true;
    clearChapterTimer();
    app.classList.add("is-fading-out");

    const commit = function () {
      update();
      render();
      scrollViewportToTop();
      window.requestAnimationFrame(function () {
        app.classList.remove("is-fading-out");
        navigationLocked = false;
      });
    };

    if (!timings.fade) {
      commit();
      return;
    }

    window.setTimeout(commit, timings.fade);
  }

  function startApp() {
    fadeTo(function () {
      runtime.screen = "intro";
      runtime.currentEndingId = null;
      runtime.currentSceneId = STORY.startSceneId;
      runtime.chapterCardFor = STORY.startSceneId;
    });
  }

  function beginStory() {
    fadeTo(function () {
      runtime.screen = "chapter";
      runtime.currentEndingId = null;
      runtime.currentSceneId = STORY.startSceneId;
      runtime.chapterCardFor = STORY.startSceneId;
      runtime.flags = {};
    });
  }

  function restartStory() {
    clearChapterTimer();
    window.localStorage.removeItem(STORAGE_KEY);
    runtime = getInitialRuntime();
    render();
    scrollViewportToTop();
  }

  function scrollViewportToTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function scheduleChapterAdvance(sceneId) {
    clearChapterTimer();
    chapterTimerId = window.setTimeout(function () {
      fadeTo(function () {
        runtime.screen = "scene";
        runtime.currentSceneId = sceneId;
        runtime.currentEndingId = null;
      });
    }, timings.chapterHold);
  }

  function moveToNext(nextId) {
    const currentScene = getScene(runtime.currentSceneId);

    if (endingIdSet.has(nextId)) {
      runtime.screen = "ending";
      runtime.currentEndingId = nextId;
      return;
    }

    const nextScene = getScene(nextId);

    if (!nextScene) {
      return;
    }

    const chapterChanged =
      !currentScene ||
      currentScene.chapterKey !== nextScene.chapterKey;

    runtime.currentSceneId = nextScene.id;
    runtime.currentEndingId = null;

    if (chapterChanged) {
      runtime.screen = "chapter";
      runtime.chapterCardFor = nextScene.id;
      return;
    }

    runtime.screen = "scene";
  }

  function applyChoice(choice) {
    fadeTo(function () {
      runtime.flags = Object.assign({}, runtime.flags, choice.set || {});
      moveToNext(choice.next);
    });
  }

  function renderStart() {
    return `
      <section class="view view--start">
        <div class="start-backdrop" aria-hidden="true">
          <img
            class="start-backdrop-media"
            src="./Cover.png"
            alt="Düstere Kapelle im Wald bei Kerzenlicht"
            loading="eager"
          />
        </div>
        <div class="start-content">
          <div class="start-cover-copy">
            <p class="eyebrow">Interaktive Story</p>
            <h1 class="display-title">${escapeHtml(STORY.meta.appTitle)}</h1>
            <p class="subtitle">${escapeHtml(STORY.meta.appSubtitle)}</p>
          </div>
          <div class="actions">
            <button class="button" data-action="start" data-autofocus="true">Eintreten</button>
          </div>
        </div>
      </section>
    `;
  }

  function renderIntro() {
    return `
      <section class="view view--intro">
        <p class="eyebrow">Story Intro</p>
        <h2 class="story-title">${escapeHtml(STORY.meta.storyTitle)}</h2>
        <div class="tag-row">
          ${STORY.meta.tags
            .map(function (tag) {
              return `<span class="tag">${escapeHtml(tag)}</span>`;
            })
            .join("")}
        </div>
        <p class="lede">${escapeHtml(STORY.meta.storyDescription)}</p>
        <p class="ambient-note">Fortschritt wird lokal auf diesem Gerät gespeichert.</p>
        <div class="actions">
          <button class="button" data-action="begin" data-autofocus="true">Kapitel I beginnen</button>
        </div>
      </section>
    `;
  }

  function renderChapter(scene) {
    return `
      <section class="view view--chapter">
        <div class="chapter-stack">
          <p class="eyebrow chapter-eyebrow">${escapeHtml(scene.chapterCard.eyebrow)}</p>
          <h2 class="chapter-title chapter-title--reveal" data-text="${escapeHtml(
            scene.chapterCard.title
          )}">${escapeHtml(scene.chapterCard.title)}</h2>
        </div>
      </section>
    `;
  }

  function renderScene(scene) {
    const sceneIndex = sceneIndexMap.get(scene.id) || 0;
    const totalScenes = STORY.scenes.length;
    const progressPercent = ((sceneIndex + 1) / totalScenes) * 100;
    const paragraphs = getVisibleBlocks(scene.blocks)
      .map(function (block) {
        return `<p>${escapeHtml(block.text)}</p>`;
      })
      .join("");
    const choices = scene.choices
      .map(function (choice, index) {
        return `
          <button class="button button--ghost" data-action="choice" data-choice-index="${index}">
            ${escapeHtml(choice.label)}
          </button>
        `;
      })
      .join("");

    const imageLabelMarkup =
      scene.imageLabel && !scene.hideImageLabel
        ? `<p class="visual-label">${escapeHtml(scene.imageLabel)}</p>`
        : "";
    const mediaMarkup = scene.imageSrc
      ? `<img class="visual-media" src="${escapeHtml(scene.imageSrc)}" alt="${escapeHtml(
          scene.imageAlt || scene.sceneTitle
        )}" loading="eager" style="object-position: ${escapeHtml(
          scene.imagePosition || "center"
        )};" />`
      : "";
    const visualAriaLabel = scene.imageAlt || scene.imageLabel || scene.sceneTitle;

    return `
      <section class="view">
        <div class="scene-layout">
          <div class="scene-topline">
            <p class="eyebrow">${escapeHtml(scene.chapter)}</p>
            <span class="scene-index">Szene ${sceneIndex + 1}/${totalScenes}</span>
          </div>

          <section class="visual visual--${escapeHtml(scene.visual)}" aria-label="${escapeHtml(
            visualAriaLabel
          )}">
            ${mediaMarkup}
            <div class="visual-copy">
              <p class="eyebrow">Szene</p>
              <h2 class="visual-title">${escapeHtml(scene.sceneTitle)}</h2>
              ${imageLabelMarkup}
            </div>
          </section>

          <div class="story-copy">${paragraphs}</div>

          <div class="choices">${choices}</div>

          <div class="progress" aria-hidden="true">
            <div class="progress-meta">
              <span>Fortschritt</span>
              <span>${sceneIndex + 1}/${totalScenes}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderEnding(ending) {
    return `
      <section class="view view--ending">
        <p class="eyebrow">Abschluss</p>
        <h2 class="ending-title">${escapeHtml(ending.title)}</h2>
        <div class="ending-copy">
          ${ending.paragraphs
            .map(function (paragraph) {
              return `<p>${escapeHtml(paragraph)}</p>`;
            })
            .join("")}
        </div>
        <div class="actions">
          <button class="button" data-action="restart" data-autofocus="true">Neu beginnen</button>
        </div>
      </section>
    `;
  }

  function render() {
    clearChapterTimer();
    app.classList.toggle("app-shell--start", runtime.screen === "start");
    document.body.classList.toggle("body--no-scroll", runtime.screen === "start");

    switch (runtime.screen) {
      case "intro":
        app.innerHTML = renderIntro();
        break;
      case "chapter": {
        const chapterScene = getScene(runtime.chapterCardFor) || getScene(STORY.startSceneId);
        app.innerHTML = renderChapter(chapterScene);
        scheduleChapterAdvance(chapterScene.id);
        break;
      }
      case "scene": {
        const scene = getCurrentScene() || getScene(STORY.startSceneId);
        app.innerHTML = renderScene(scene);
        break;
      }
      case "ending": {
        const ending = getEnding() || STORY.endings.endingA;
        app.innerHTML = renderEnding(ending);
        break;
      }
      case "start":
      default:
        app.innerHTML = renderStart();
        break;
    }

    saveRuntime();
    scrollViewportToTop();

    window.requestAnimationFrame(function () {
      const autofocusTarget = app.querySelector("[data-autofocus='true']");
      if (autofocusTarget) {
        autofocusTarget.focus();
      }
    });
  }

  app.addEventListener("click", function (event) {
    const target = event.target.closest("[data-action]");

    if (!target || navigationLocked) {
      return;
    }

    const action = target.getAttribute("data-action");

    if (action === "start") {
      startApp();
      return;
    }

    if (action === "begin") {
      beginStory();
      return;
    }

    if (action === "restart") {
      restartStory();
      return;
    }

    if (action === "choice") {
      const scene = getCurrentScene();
      const choiceIndex = Number(target.getAttribute("data-choice-index"));
      const choice = scene && scene.choices ? scene.choices[choiceIndex] : null;

      if (choice) {
        applyChoice(choice);
      }
    }
  });

  window.addEventListener("keydown", function (event) {
    if (runtime.screen !== "start" || event.key !== "Enter" || navigationLocked) {
      return;
    }

    event.preventDefault();
    startApp();
  });

  render();
})();

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

  const storefrontStories = [
    {
      title: STORY.meta.appTitle,
      subtitle: STORY.meta.storyTitle,
      description: STORY.meta.storyDescription,
      tags: STORY.meta.tags,
      imageSrc: "./Cover.png",
      imageAlt: "Düstere Kapelle im Wald bei Kerzenlicht",
      status: "Aktiv",
      available: true,
      action: "start"
    },
    {
      title: "Ascheprotokoll",
      subtitle: "Mystery Novella",
      description: "Eine Ermittlungsakte mit geschwärzten Seiten, gelöschten Namen und einem Brand ohne Quelle.",
      tags: ["Noir", "Archiv"],
      imageSrc: "./Ascheprotokoll.png",
      imageAlt: "Ascheprotokoll Cover mit verbrannter Ermittlungsakte",
      imagePosition: "center 4%",
      status: "Demnächst",
      available: false
    },
    {
      title: "Das Glashaus",
      subtitle: "Psychologischer Thriller",
      description: "Ein Wochenendhaus im Schnee, eine Kamera zu viel und eine Nacht, die im Material fehlt.",
      tags: ["Thriller", "Isolation"],
      imageSrc: "./DasGlashaus.png",
      imageAlt: "Das Glashaus Cover mit Haus im Schnee und Kamera im Vordergrund",
      imagePosition: "center 4%",
      status: "Platzhalter",
      available: false
    },
    {
      title: "Die vierte Glocke",
      subtitle: "Folk Horror",
      description: "Ein Dorf hört jede Nacht denselben Glockenschlag, obwohl der Turm seit Jahren leer steht.",
      tags: ["Okkult", "Dorf"],
      imageSrc: "./DieverlasseneGlockeimNebel.png",
      imageAlt: "Die vierte Glocke Cover mit verlassenem Turm im Schneenebel",
      imagePosition: "center 4%",
      status: "Später",
      available: false
    }
  ];

  function hasMeaningfulProgress() {
    return (
      runtime.currentEndingId !== null ||
      runtime.currentSceneId !== STORY.startSceneId ||
      Object.keys(runtime.flags).length > 0 ||
      runtime.screen === "intro" ||
      runtime.screen === "chapter" ||
      runtime.screen === "scene" ||
      runtime.screen === "ending"
    );
  }

  function getProgressLabel() {
    if (runtime.currentEndingId) {
      return "Finale erreicht";
    }

    if (runtime.screen === "chapter" || runtime.screen === "scene") {
      const currentScene =
        runtime.screen === "chapter"
          ? getScene(runtime.chapterCardFor)
          : getScene(runtime.currentSceneId);

      if (currentScene) {
        return currentScene.chapterCard.eyebrow + " • " + currentScene.sceneTitle;
      }
    }

    if (runtime.screen === "intro") {
      return "Intro geöffnet";
    }

    return "Kapitel I bereit";
  }

  function renderStoreCard(story, isFeatured) {
    const classNames = [
      "store-card",
      isFeatured ? "store-card--featured" : "store-card--compact",
      story.available ? "store-card--active" : "store-card--locked"
    ].join(" ");
    const mediaMarkup = story.imageSrc
      ? `<img class="store-card-media" src="${escapeHtml(story.imageSrc)}" alt="${escapeHtml(
          story.imageAlt || story.title
        )}" loading="${isFeatured ? "eager" : "lazy"}" style="object-position: ${escapeHtml(
          story.imagePosition || "center"
        )};" />`
      : '<div class="store-card-media store-card-media--placeholder" aria-hidden="true"></div>';
    const tagsMarkup = (story.tags || [])
      .map(function (tag) {
        return `<span class="tag">${escapeHtml(tag)}</span>`;
      })
      .join("");
    const buttonLabel = story.available
      ? hasMeaningfulProgress()
        ? "Öffnen"
        : "Ansehen"
      : "Gesperrt";

    return `
      <article class="${classNames}">
        <div class="store-card-visual">
          ${mediaMarkup}
          <span class="store-card-status-badge">${escapeHtml(story.status)}</span>
        </div>
        <div class="store-card-copy">
          <p class="eyebrow">${escapeHtml(story.subtitle)}</p>
          <h2 class="${isFeatured ? "store-card-title store-card-title--hero" : "store-card-title"}">${escapeHtml(
            story.title
          )}</h2>
          <p class="store-card-description">${escapeHtml(story.description)}</p>
          <div class="tag-row">${tagsMarkup}</div>
          <div class="store-card-footer">
            <span class="store-card-meta">${escapeHtml(
              story.available ? getProgressLabel() : "Noch nicht freigeschaltet"
            )}</span>
            <button
              class="button${story.available && isFeatured ? " button--solid" : ""}"
              ${story.available ? `data-action="${escapeHtml(story.action)}"` : "disabled"}
            >
              ${escapeHtml(buttonLabel)}
            </button>
          </div>
        </div>
      </article>
    `;
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
    });
  }

  function resumeApp() {
    fadeTo(function () {
      if (runtime.currentEndingId) {
        runtime.screen = "ending";
      } else {
        runtime.screen = "scene";
      }
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
    const featuredStory = storefrontStories[0];
    const storeCards = storefrontStories
      .map(function (story) {
        return renderStoreCard(story, false);
      })
      .join("");
    const primaryLabel = hasMeaningfulProgress() ? "Fortsetzen" : "Ansehen";
    const secondaryLabel = hasMeaningfulProgress() ? "Neu starten" : "Direkt starten";
    const primaryAction = hasMeaningfulProgress() ? "resume" : "start";

    return `
      <section class="view view--start">
        <div class="store-shell">
          <section class="store-hero">
            <div class="store-hero-backdrop" aria-hidden="true">
              <img
                class="store-hero-image"
                src="./Cover.png"
                alt="Düstere Kapelle im Wald bei Kerzenlicht"
                loading="eager"
              />
            </div>
            <header class="store-hero-topbar">
              <div class="store-wordmark">EMBER</div>
            </header>
            <div class="store-hero-copy">
              <p class="eyebrow">EMBER Originals</p>
              <h1 class="display-title display-title--store">${escapeHtml(featuredStory.subtitle)}</h1>
              <p class="store-hero-subtitle">Stories, in denen deine Entscheidungen Konsequenzen haben</p>
              <div class="tag-row">
                ${featuredStory.tags
                  .map(function (tag) {
                    return `<span class="tag">${escapeHtml(tag)}</span>`;
                  })
                  .join("")}
              </div>
              <p class="lede">${escapeHtml(featuredStory.description)}</p>
              <div class="store-hero-meta">
                <span class="store-hero-pill">${escapeHtml(featuredStory.status)}</span>
                <span class="store-hero-status">${escapeHtml(getProgressLabel())}</span>
                <span class="store-hero-status">1 Story freigeschaltet</span>
              </div>
              <div class="actions actions--hero">
                <button class="button button--solid" data-action="${primaryAction}" data-autofocus="true">${escapeHtml(
                  primaryLabel
                )}</button>
                <button class="button button--ghost" data-action="begin">${escapeHtml(
                  secondaryLabel
                )}</button>
              </div>
            </div>
          </section>

          <section class="store-section">
            <div class="store-section-heading">
              <div>
                <p class="eyebrow">Auswahl</p>
                <h2 class="store-section-title">Storys im Store</h2>
              </div>
              <p class="store-section-copy">Nur ${escapeHtml(
                STORY.meta.appTitle
              )} ist derzeit aktiv. Die übrigen Karten bleiben vorerst Platzhalter.</p>
            </div>
            <div class="store-grid">${storeCards}</div>
          </section>

          <footer class="site-footer">
            <div class="footer-container">
              <ul class="footer-links">
                <li class="footer-link-item"><a class="footer-link" href="#">Häufig gestellte Fragen (FAQ)</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Mitgliedschaft kündigen</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Hilfe-Center</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Konto</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Medien-Center</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Anlegerbeziehungen</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Karriere</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">EMBER Shop</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Geschenkkarten einlösen</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Geschenkkarten kaufen</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">So können Sie EMBER ansehen</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Nutzungsbedingungen</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Datenschutz</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Cookie-Einstellungen</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Impressum</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Kontakt</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Geschwindigkeitstest</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Gesetzliche Garantie</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Rechtliche Hinweise</a></li>
                <li class="footer-link-item"><a class="footer-link" href="#">Nur auf EMBER</a></li>
              </ul>
              <div class="footer-badges-container">
                <p class="footer-badges-label">Demnächst verfügbar</p>
                <div class="footer-badges">
                  <a href="#" class="footer-badge">
                    <img src="./Download_on_the_App_Store_Badge.svg" alt="Download on the App Store">
                  </a>
                  <a href="#" class="footer-badge">
                    <img src="./Google_Play_Store_badge_EN.svg" alt="Get it on Google Play">
                  </a>
                </div>
              </div>
            </div>
          </footer>

          <nav class="app-tabbar" aria-label="iOS Tab Bar">
            <button class="app-tab" type="button">
              <span class="app-tab-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M3.5 10.5 12 4l8.5 6.5" />
                  <path d="M6.5 9.5V20h11V9.5" />
                  <path d="M10 20v-5h4v5" />
                </svg>
              </span>
              <span class="app-tab-label">Home</span>
            </button>
            <button class="app-tab app-tab--active" type="button">
              <span class="app-tab-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <rect x="4" y="4" width="6" height="6" rx="1.5" />
                  <rect x="14" y="4" width="6" height="6" rx="1.5" />
                  <rect x="4" y="14" width="6" height="6" rx="1.5" />
                  <rect x="14" y="14" width="6" height="6" rx="1.5" />
                </svg>
              </span>
              <span class="app-tab-label">Store</span>
            </button>
            <button class="app-tab" type="button">
              <span class="app-tab-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M6.5 5.5h8.75A2.25 2.25 0 0 1 17.5 7.75V18.5H8.75A2.25 2.25 0 0 0 6.5 20.75Z" />
                  <path d="M6.5 6v14.75" />
                  <path d="M9.25 8.25h5.75" />
                </svg>
              </span>
              <span class="app-tab-label">Bibliothek</span>
            </button>
            <button class="app-tab" type="button">
              <span class="app-tab-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="8" r="3.25" />
                  <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
                </svg>
              </span>
              <span class="app-tab-label">Account</span>
            </button>
          </nav>
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
          <button class="button button--ghost" data-action="restart">Zur Auswahl</button>
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
    document.body.classList.remove("body--no-scroll");

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

    if (action === "resume") {
      resumeApp();
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

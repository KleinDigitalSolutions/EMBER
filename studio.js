(function () {
  const project = {
    acts: [
      {
        id: "act-1",
        title: "Act 1",
        chapters: [
          {
            id: "chapter-1",
            title: "Chapter 1",
            words: 156,
            scenes: [
              {
                id: "scene-1",
                title: "Scene 1",
                words: 156,
                summary:
                  "Als Adrian Petrescu an diesem verregneten Mittwochabend Jonas Falks Büro betrat, kam nicht nur ein Fall herein.",
                label: "Label"
              },
              {
                id: "scene-2",
                title: "Scene 2",
                words: 0,
                summary: "Add summary...",
                label: "Label"
              }
            ]
          }
        ]
      }
    ],
    codexEntries: []
  };

  const state = {
    mode: "plan",
    view: "grid",
    search: "",
    selectedSceneId: "scene-1"
  };

  const storyBoard = document.getElementById("story-board");
  const boardStats = document.getElementById("board-stats");
  const codexList = document.getElementById("codex-list");
  const sceneSearch = document.getElementById("scene-search");

  function getAllScenes() {
    return project.acts.flatMap(function (act) {
      return act.chapters.flatMap(function (chapter) {
        return chapter.scenes;
      });
    });
  }

  function filterScenes(scenes) {
    if (!state.search.trim()) {
      return scenes;
    }

    const query = state.search.trim().toLowerCase();

    return scenes.filter(function (scene) {
      return (
        scene.title.toLowerCase().includes(query) ||
        scene.summary.toLowerCase().includes(query) ||
        scene.label.toLowerCase().includes(query)
      );
    });
  }

  function renderCodex() {
    codexList.innerHTML = project.codexEntries
      .map(function (entry) {
        return [
          '<article class="codex-row">',
          "<h3>" + entry.title + "</h3>",
          "<p>" + entry.text + "</p>",
          "</article>"
        ].join("");
      })
      .join("");
  }

  function renderStats() {
    const act = project.acts[0];
    const chapter = act.chapters[0];
    boardStats.innerHTML =
      '<span>1 chapter</span><span>-</span><span>' +
      chapter.words +
      " words</span>";
  }

  function renderBoard() {
    storyBoard.dataset.view = state.view;

    if (state.view === "grid") {
      storyBoard.innerHTML = project.acts
        .map(function (act) {
          return renderActGrid(act);
        })
        .join("");
      bindSceneSelection();
      return;
    }

    if (state.view === "matrix") {
      storyBoard.innerHTML = getAllScenes()
        .filter(function (scene) {
          return filterScenes([scene]).length > 0;
        })
        .map(function (scene) {
          return [
            '<button class="matrix-card" type="button" data-scene-id="' + scene.id + '">',
            "<h3>" + scene.title + "</h3>",
            "<p>" + scene.summary + "</p>",
            '<div class="matrix-card__meta">' +
              scene.words +
              " words · " +
              scene.label +
              "</div>",
            "</button>"
          ].join("");
        })
        .join("");
      bindSceneSelection();
      return;
    }

    storyBoard.innerHTML = getAllScenes()
      .filter(function (scene) {
        return filterScenes([scene]).length > 0;
      })
      .map(function (scene) {
        return [
          '<button class="outline-card" type="button" data-scene-id="' + scene.id + '">',
          "<h3>" + scene.title + "</h3>",
          "<p>" + scene.summary + "</p>",
          '<div class="outline-card__meta">' +
            scene.words +
            " words · " +
            scene.label +
            "</div>",
          "</button>"
        ].join("");
      })
      .join("");
    bindSceneSelection();
  }

  function renderActGrid(act) {
    return [
      '<section class="act-stack">',
      act.chapters
        .map(function (chapter) {
          return renderChapter(chapter);
        })
        .join(""),
      "</section>"
    ].join("");
  }

  function renderChapter(chapter) {
    const visibleScenes = filterScenes(chapter.scenes);

    return [
      '<article class="chapter-shell">',
      '<div class="chapter-topline">',
      '<button class="chapter-add" type="button">+ New Chapter</button>',
      '<button class="square-button" type="button" aria-label="Edit chapter">',
      '<span class="mini-icon mini-icon--gear"></span>',
      "</button>",
      '<span class="chapter-meta">' + chapter.words + " words</span>",
      "</div>",
      '<div class="chapter-head">',
      "<h3>" + chapter.title + "</h3>",
      '<span class="chapter-wordcount">' + chapter.words + " words</span>",
      "</div>",
      '<div class="scene-list">',
      visibleScenes.map(renderSceneRow).join(""),
      "</div>",
      '<button class="chapter-new-scene" type="button">+ New Scene</button>',
      "</article>"
    ].join("");
  }

  function renderSceneRow(scene) {
    const activeClass = scene.id === state.selectedSceneId ? " scene-row--active" : "";
    const wordText = scene.words ? scene.words + " words" : "0 words";

    return [
      '<button class="scene-row' + activeClass + '" type="button" data-scene-id="' + scene.id + '">',
      '<div class="scene-row__head">',
      '<span class="scene-title">' + scene.title + " - " + wordText + "</span>",
      '<span class="ghost-icon-button scene-row__action" aria-hidden="true">',
      '<span class="mini-icon mini-icon--gear"></span>',
      "</span>",
      "</div>",
      '<p class="scene-summary">' + scene.summary + "</p>",
      '<span class="scene-label">' + scene.label + "</span>",
      "</button>"
    ].join("");
  }

  function bindControls() {
    document.querySelectorAll(".pill-button[data-mode]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.mode = button.getAttribute("data-mode");
        document.querySelectorAll(".pill-button[data-mode]").forEach(function (candidate) {
          candidate.classList.toggle("pill-button--active", candidate === button);
        });
      });
    });

    document.querySelectorAll(".pill-button[data-view]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.view = button.getAttribute("data-view");
        document.querySelectorAll(".pill-button[data-view]").forEach(function (candidate) {
          candidate.classList.toggle("pill-button--active", candidate === button);
        });
        renderBoard();
      });
    });

    sceneSearch.addEventListener("input", function (event) {
      state.search = event.target.value;
      renderBoard();
    });
  }

  function bindSceneSelection() {
    storyBoard.querySelectorAll("[data-scene-id]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.selectedSceneId = button.getAttribute("data-scene-id");
        renderBoard();
      });
    });
  }

  function renderAll() {
    renderCodex();
    renderStats();
    renderBoard();
  }

  renderAll();
  bindControls();
})();

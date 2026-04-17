"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PatchPanel } from "@/components/studio/patch-panel";
import { PlaytestPanel } from "@/components/studio/playtest-panel";
import { ReviewPanel } from "@/components/studio/review-panel";
import { SceneEditor } from "@/components/studio/scene-editor";
import { loadStudioDraft, saveStudioDraft } from "@/lib/studio-storage";
import {
  appendActToStory,
  appendChapterToAct,
  appendSceneToChapter,
  countStoryStats,
  findSceneContext,
  updateSceneInStory,
  type StoryAct,
  type StoryChapter,
  type StoryDocument,
  type StoryStatus,
  type StoryScene
} from "@/lib/story-schema";

type ViewMode = "grid" | "matrix" | "outline";
type AuthorMode = "plan" | "write" | "playtest" | "chat" | "review";
type SaveState = "idle" | "saved" | "error";

const AUTHOR_MODES: AuthorMode[] = ["plan", "write", "playtest", "chat", "review"];
const VIEW_MODES: ViewMode[] = ["grid", "matrix", "outline"];

export function StudioWorkspace({ story }: { story: StoryDocument }) {
  const [draftStory, setDraftStory] = useState(story);
  const [authorMode, setAuthorMode] = useState<AuthorMode>("plan");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [showOutlineComposer, setShowOutlineComposer] = useState(false);
  const [outlineDraft, setOutlineDraft] = useState(DEFAULT_OUTLINE_TEMPLATE);
  const [outlineError, setOutlineError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [selectedSceneId, setSelectedSceneId] = useState(
    story.acts[0]?.chapters[0]?.scenes[0]?.id ?? ""
  );
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const stats = useMemo(function () {
    return countStoryStats(draftStory);
  }, [draftStory]);

  useEffect(function () {
    const snapshot = loadStudioDraft(story.id);

    if (!snapshot) {
      setHasLoadedDraft(true);
      return;
    }

    setDraftStory(snapshot.draftStory);
    setSelectedSceneId(snapshot.selectedSceneId);

    if (isAuthorMode(snapshot.authorMode)) {
      setAuthorMode(snapshot.authorMode);
    }

    if (isViewMode(snapshot.viewMode)) {
      setViewMode(snapshot.viewMode);
    }

    setLastSavedAt(snapshot.savedAt);
    setSaveState("saved");
    setHasLoadedDraft(true);
  }, [story.id]);

  useEffect(
    function () {
      if (!hasLoadedDraft) {
        return;
      }

      const timeoutId = window.setTimeout(function () {
        const snapshot = persistStudioDraft({
          storyId: story.id,
          draftStory,
          selectedSceneId,
          authorMode,
          viewMode
        });

        if (snapshot) {
          setLastSavedAt(snapshot.savedAt);
          setSaveState("saved");
          return;
        }

        setSaveState("error");
      }, 350);

      return function () {
        window.clearTimeout(timeoutId);
      };
    },
    [authorMode, draftStory, hasLoadedDraft, selectedSceneId, story.id, viewMode]
  );

  const filteredActs = useMemo(function () {
    return draftStory.acts
      .map(function (act) {
        const chapters = act.chapters
          .map(function (chapter) {
            const scenes = chapter.scenes.filter(function (scene) {
              if (!search.trim()) {
                return true;
              }

              const query = search.trim().toLowerCase();

              return (
                scene.title.toLowerCase().includes(query) ||
                scene.summary.toLowerCase().includes(query) ||
                scene.label.toLowerCase().includes(query) ||
                scene.blocks.some(function (block) {
                  return block.text.toLowerCase().includes(query);
                })
              );
            });

            return {
              ...chapter,
              scenes
            };
          })
          .filter(function (chapter) {
            return chapter.scenes.length > 0;
          });

        return {
          ...act,
          chapters
        };
      })
      .filter(function (act) {
        return act.chapters.length > 0;
      });
  }, [draftStory.acts, search]);

  const visibleScenes = useMemo(function () {
    return filteredActs.flatMap(function (act) {
      return act.chapters.flatMap(function (chapter) {
        return chapter.scenes;
      });
    });
  }, [filteredActs]);

  useEffect(
    function () {
      if (!visibleScenes.length) {
        return;
      }

      const hasSelectedScene = visibleScenes.some(function (scene) {
        return scene.id === selectedSceneId;
      });

      if (!hasSelectedScene) {
        setSelectedSceneId(visibleScenes[0].id);
      }
    },
    [selectedSceneId, visibleScenes]
  );

  const selectedSceneContext = useMemo(function () {
    return selectedSceneId ? findSceneContext(draftStory, selectedSceneId) : null;
  }, [draftStory, selectedSceneId]);

  const selectedScene = selectedSceneContext?.scene ?? null;

  function updateSelectedScene(updater: (scene: StoryScene) => StoryScene) {
    if (!selectedSceneId) {
      return;
    }

    setDraftStory(function (currentStory) {
      return updateSceneInStory(currentStory, selectedSceneId, updater);
    });
  }

  function updateStoryStatus(status: StoryStatus) {
    setDraftStory(function (currentStory) {
      return {
        ...currentStory,
        status
      };
    });
  }

  function handleManualSave() {
    const snapshot = persistStudioDraft({
      storyId: story.id,
      draftStory,
      selectedSceneId,
      authorMode,
      viewMode
    });

    if (snapshot) {
      setLastSavedAt(snapshot.savedAt);
      setSaveState("saved");
      return;
    }

    setSaveState("error");
  }

  function handleAddAct() {
    let nextSceneId = "";

    setDraftStory(function (currentStory) {
      const result = appendActToStory(currentStory);
      nextSceneId = result.sceneId;
      return result.story;
    });

    setSearch("");

    if (nextSceneId) {
      setSelectedSceneId(nextSceneId);
      setAuthorMode("write");
    }
  }

  function handleAddChapter(actId: string) {
    let nextSceneId = "";

    setDraftStory(function (currentStory) {
      const result = appendChapterToAct(currentStory, actId);
      nextSceneId = result.sceneId;
      return result.story;
    });

    setSearch("");

    if (nextSceneId) {
      setSelectedSceneId(nextSceneId);
      setAuthorMode("write");
    }
  }

  function handleAddScene(chapterId: string) {
    let nextSceneId = "";

    setDraftStory(function (currentStory) {
      const result = appendSceneToChapter(currentStory, chapterId);
      nextSceneId = result.sceneId;
      return result.story;
    });

    setSearch("");

    if (nextSceneId) {
      setSelectedSceneId(nextSceneId);
      setAuthorMode("write");
    }
  }

  function handleCreateFromOutline() {
    try {
      const nextActs = buildActsFromOutline(outlineDraft);
      const nextSelectedSceneId = nextActs[0]?.chapters[0]?.scenes[0]?.id ?? "";

      setDraftStory(function (currentStory) {
        return {
          ...currentStory,
          acts: nextActs
        };
      });

      setOutlineError(null);
      setShowOutlineComposer(false);
      setSearch("");

      if (nextSelectedSceneId) {
        setSelectedSceneId(nextSelectedSceneId);
        setAuthorMode("write");
      }
    } catch (error) {
      setOutlineError(error instanceof Error ? error.message : "Outline konnte nicht gelesen werden.");
    }
  }

  function handleImportClick() {
    importInputRef.current?.click();
  }

  async function handleImportFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      const nextStory = normalizeImportedStory(parsed, story);
      const nextSelectedSceneId = nextStory.acts[0]?.chapters[0]?.scenes[0]?.id ?? "";

      setDraftStory(nextStory);
      setImportError(null);
      setShowOutlineComposer(false);
      setSearch("");

      if (nextSelectedSceneId) {
        setSelectedSceneId(nextSelectedSceneId);
        setAuthorMode("write");
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Import fehlgeschlagen.");
    } finally {
      event.target.value = "";
    }
  }

  function handleExport() {
    if (typeof window === "undefined") {
      return;
    }

    const payload = JSON.stringify(draftStory, null, 2);
    const blob = new window.Blob([payload], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement("a");

    link.href = url;
    link.download = `${slugify(draftStory.title || story.id)}.json`;
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="studio-shell">
      <aside className="rail" aria-label="Hauptnavigation">
        <button className="rail-button" type="button" aria-label="Zurück">
          <span className="rail-icon rail-icon--back" />
        </button>
        <button className="rail-button" type="button" aria-label="Workspace">
          <span className="rail-icon rail-icon--panel" />
        </button>
        <button className="rail-button rail-button--active" type="button" aria-label="Codex">
          <span className="rail-icon rail-icon--book" />
        </button>
      </aside>

      <aside className="sidebar">
        <header className="sidebar-header">
          <div className="sidebar-header__icons">
            <button className="mini-icon-button" type="button" aria-label="Zurück">
              <span className="mini-icon mini-icon--back" />
            </button>
            <button className="mini-icon-button" type="button" aria-label="Settings">
              <span className="mini-icon mini-icon--gear" />
            </button>
          </div>
          <div className="sidebar-project">
            <h1>{draftStory.title}</h1>
            <p>
              {draftStory.authorName} · {formatStoryStatus(draftStory.status)}
            </p>
          </div>
        </header>

        <nav className="sidebar-tabs" aria-label="Bereiche">
          <button className="sidebar-tab sidebar-tab--active" type="button">
            Codex
          </button>
          <button className="sidebar-tab" type="button">
            Snippets
          </button>
          <button className="sidebar-tab" type="button">
            Chats
          </button>
        </nav>

        <div className="sidebar-toolbar">
          <label className="search-field">
            <span className="search-icon" />
            <input type="search" placeholder="Search all entries..." />
          </label>
          <button className="flat-button" type="button">
            + New Entry
          </button>
          <button className="square-button" type="button" aria-label="Optionen">
            <span className="mini-icon mini-icon--gear" />
          </button>
        </div>

        <section className="sidebar-empty">
          <h2>YOUR CODEX IS EMPTY</h2>
          <p>
            The Codex stores information about the world your story takes place
            in, its inhabitants and more.
          </p>
          <p className="sidebar-empty__hint">
            Create a new entry by clicking the button above.
          </p>
        </section>

        <div className="sidebar-codex-list">
          {story.worldBible.slice(0, 3).map(function (entry) {
            return (
              <article key={entry.id} className="codex-row">
                <h3>{entry.title}</h3>
                <p>{entry.summary}</p>
              </article>
            );
          })}
        </div>

        <footer className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar" />
            <span className="usage-pill">1/5</span>
          </div>
          <div className="sidebar-footer__links">
            <button className="footer-link" type="button">
              Help
            </button>
            <button className="footer-link" type="button">
              Prompts
            </button>
            <button className="footer-link" type="button" onClick={handleExport}>
              Export
            </button>
            <button className="footer-link" type="button" onClick={handleManualSave}>
              Save
            </button>
          </div>
        </footer>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <div className="pill-group" aria-label="Mode">
              {AUTHOR_MODES.map(function (mode) {
                return (
                  <button
                    key={mode}
                    className={
                      "pill-button" + (authorMode === mode ? " pill-button--active" : "")
                    }
                    onClick={function () {
                      setAuthorMode(mode);
                    }}
                    type="button"
                  >
                    {capitalize(mode)}
                  </button>
                );
              })}
            </div>

            <div className="pill-group pill-group--view" aria-label="View">
              {VIEW_MODES.map(function (mode) {
                return (
                  <button
                    key={mode}
                    className={
                      "pill-button" + (viewMode === mode ? " pill-button--active" : "")
                    }
                    onClick={function () {
                      setViewMode(mode);
                    }}
                    type="button"
                  >
                    {capitalize(mode)}
                  </button>
                );
              })}
            </div>

            <span className="filter-label">FILTER:</span>

            <label className="search-field search-field--topbar">
              <span className="search-icon" />
              <input
                type="search"
                placeholder="Search scenes..."
                value={search}
                onChange={function (event) {
                  setSearch(event.target.value);
                }}
              />
            </label>
          </div>

          <div className="topbar-actions">
            <span className={"story-status-pill story-status-pill--" + draftStory.status}>
              {formatStoryStatus(draftStory.status)}
            </span>
            <span
              className={
                "save-indicator" +
                (saveState === "saved"
                  ? " save-indicator--saved"
                  : saveState === "error"
                    ? " save-indicator--error"
                    : "")
              }
            >
              {formatSaveState(lastSavedAt, saveState)}
            </span>
            <Link href="/story" className="flat-button topbar-link">
              Story testen
            </Link>
            <button className="view-toggle" type="button">
              {capitalize(authorMode)}
            </button>
          </div>
        </header>

        <section className="board-area">
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only-input"
            onChange={handleImportFile}
          />

          <div className="workspace-panels">
            <div className="board-panel">
              <div className="board-meta">
                <div className="board-meta__title-wrap">
                  <button className="ghost-icon-button" type="button" aria-label="Reorder">
                    <span className="mini-icon mini-icon--drag" />
                  </button>
                  <h2 className="board-title">
                    {filteredActs[0]?.title ?? draftStory.acts[0]?.title}
                  </h2>
                </div>
                <div className="board-meta__stats">
                  <span>{stats.chapterCount} chapters</span>
                  <span>-</span>
                  <span>{stats.wordCount.toLocaleString("de-DE")} words</span>
                  <span>-</span>
                  <span>{stats.choiceCount} choices</span>
                </div>
              </div>

              <div className="board-canvas">
                {visibleScenes.length ? (
                  <div className="story-board" data-view={viewMode}>
                    {viewMode === "grid"
                      ? filteredActs.map(function (act) {
                          return (
                            <ActGrid
                              key={act.id}
                              act={act}
                              selectedSceneId={selectedSceneId}
                              onSelectScene={setSelectedSceneId}
                              onAddChapter={handleAddChapter}
                              onAddScene={handleAddScene}
                            />
                          );
                        })
                      : visibleScenes.map(function (scene) {
                          return viewMode === "matrix" ? (
                            <button
                              key={scene.id}
                              className="matrix-card"
                              onClick={function () {
                                setSelectedSceneId(scene.id);
                              }}
                              type="button"
                            >
                              <h3>{scene.title}</h3>
                              <p>{scene.summary}</p>
                              <div className="matrix-card__meta">
                                {scene.wordCount} words · {scene.label}
                              </div>
                            </button>
                          ) : (
                            <button
                              key={scene.id}
                              className="outline-card"
                              onClick={function () {
                                setSelectedSceneId(scene.id);
                              }}
                              type="button"
                            >
                              <h3>{scene.title}</h3>
                              <p>{scene.summary}</p>
                              <div className="outline-card__meta">
                                {scene.wordCount} words · {scene.label}
                              </div>
                            </button>
                          );
                        })}
                  </div>
                ) : (
                  <div className="board-empty-state">
                    <strong>Keine Szenen im aktuellen Filter</strong>
                    <p>
                      Passe die Suche an, um Szenen wieder einzublenden oder eine
                      andere Szene zu bearbeiten.
                    </p>
                  </div>
                )}
              </div>

              <div className="board-footer">
                <button className="flat-button" type="button" onClick={handleAddAct}>
                  + Add Act
                </button>
                <button
                  className="flat-button"
                  type="button"
                  onClick={function () {
                    setShowOutlineComposer(function (currentState) {
                      return !currentState;
                    });
                    setOutlineError(null);
                    setImportError(null);
                  }}
                >
                  Create from Outline
                </button>
                <button className="flat-button" type="button" onClick={handleImportClick}>
                  Import
                </button>
                <button className="flat-button" type="button">
                  Actions
                </button>
              </div>

              {showOutlineComposer ? (
                <section className="outline-composer">
                  <div className="outline-composer__head">
                    <div>
                      <strong>Outline Composer</strong>
                      <p>
                        Schreibe Zeilen mit `Act:`, `Chapter:` und `Scene:`. Andere
                        Zeilen werden als Szenentitel gelesen.
                      </p>
                    </div>
                    <div className="outline-composer__actions">
                      <button className="flat-button" type="button" onClick={handleCreateFromOutline}>
                        Outline anwenden
                      </button>
                      <button
                        className="flat-button"
                        type="button"
                        onClick={function () {
                          setOutlineDraft(DEFAULT_OUTLINE_TEMPLATE);
                          setOutlineError(null);
                        }}
                      >
                        Vorlage laden
                      </button>
                    </div>
                  </div>

                  <textarea
                    className="editor-textarea outline-composer__textarea"
                    value={outlineDraft}
                    onChange={function (event) {
                      setOutlineDraft(event.target.value);
                    }}
                  />

                  {outlineError ? (
                    <p className="outline-composer__feedback outline-composer__feedback--error">
                      {outlineError}
                    </p>
                  ) : (
                    <p className="outline-composer__feedback">
                      Der aktuelle Draft wird durch die neue Outline-Struktur ersetzt.
                    </p>
                  )}
                </section>
              ) : null}

              {importError ? (
                <section className="outline-composer outline-composer--compact">
                  <p className="outline-composer__feedback outline-composer__feedback--error">
                    {importError}
                  </p>
                </section>
              ) : null}

              {selectedScene ? (
                <section className="studio-status-bar">
                  <div>
                    <strong>{selectedScene.title}</strong>
                    <span>{selectedScene.summary}</span>
                  </div>
                  <div className="studio-status-bar__meta">
                    <span>{selectedScene.label}</span>
                    <span>{selectedScene.wordCount} words</span>
                    <span>{selectedScene.choices.length} choices</span>
                  </div>
                </section>
              ) : null}
            </div>

            {authorMode === "playtest" ? (
              <PlaytestPanel story={draftStory} selectedSceneId={selectedSceneId} />
            ) : authorMode === "chat" ? (
              <PatchPanel
                story={draftStory}
                sceneContext={selectedSceneContext}
                onUpdateScene={updateSelectedScene}
              />
            ) : authorMode === "review" ? (
              <ReviewPanel
                story={draftStory}
                onUpdateStatus={updateStoryStatus}
                onSelectScene={setSelectedSceneId}
              />
            ) : (
              <SceneEditor
                story={draftStory}
                sceneContext={selectedSceneContext}
                onUpdateScene={updateSelectedScene}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ActGrid({
  act,
  selectedSceneId,
  onSelectScene,
  onAddChapter,
  onAddScene
}: {
  act: StoryAct;
  selectedSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onAddChapter: (actId: string) => void;
  onAddScene: (chapterId: string) => void;
}) {
  return (
    <section className="act-stack">
      {act.chapters.map(function (chapter) {
        return (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            selectedSceneId={selectedSceneId}
            onSelectScene={onSelectScene}
            onAddChapter={onAddChapter}
            onAddScene={onAddScene}
          />
        );
      })}
    </section>
  );
}

function ChapterCard({
  chapter,
  selectedSceneId,
  onSelectScene,
  onAddChapter,
  onAddScene
}: {
  chapter: StoryChapter;
  selectedSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onAddChapter: (actId: string) => void;
  onAddScene: (chapterId: string) => void;
}) {
  return (
    <article className="chapter-shell">
      <div className="chapter-topline">
        <button
          className="chapter-add"
          type="button"
          onClick={function () {
            onAddChapter(chapter.actId);
          }}
        >
          + New Chapter
        </button>
        <button className="square-button" type="button" aria-label="Edit chapter">
          <span className="mini-icon mini-icon--gear" />
        </button>
        <span className="chapter-meta">{chapter.wordCount} words</span>
      </div>
      <div className="chapter-head">
        <h3>{chapter.title}</h3>
        <span className="chapter-wordcount">{chapter.wordCount} words</span>
      </div>
      <div className="scene-list">
        {chapter.scenes.map(function (scene) {
          return (
            <SceneRow
              key={scene.id}
              scene={scene}
              isActive={scene.id === selectedSceneId}
              onSelectScene={onSelectScene}
            />
          );
        })}
      </div>
      <button
        className="chapter-new-scene"
        type="button"
        onClick={function () {
          onAddScene(chapter.id);
        }}
      >
        + New Scene
      </button>
    </article>
  );
}

function SceneRow({
  scene,
  isActive,
  onSelectScene
}: {
  scene: StoryScene;
  isActive: boolean;
  onSelectScene: (sceneId: string) => void;
}) {
  return (
    <button
      className={"scene-row" + (isActive ? " scene-row--active" : "")}
      onClick={function () {
        onSelectScene(scene.id);
      }}
      type="button"
    >
      <div className="scene-row__head">
        <span className="scene-title">
          {scene.title} - {scene.wordCount} words
        </span>
        <span className="ghost-icon-button scene-row__action" aria-hidden="true">
          <span className="mini-icon mini-icon--gear" />
        </span>
      </div>
      <p className="scene-summary">{scene.summary}</p>
      <span className="scene-label">{scene.label}</span>
    </button>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isAuthorMode(value: string): value is AuthorMode {
  return AUTHOR_MODES.includes(value as AuthorMode);
}

function isViewMode(value: string): value is ViewMode {
  return VIEW_MODES.includes(value as ViewMode);
}

function persistStudioDraft({
  storyId,
  draftStory,
  selectedSceneId,
  authorMode,
  viewMode
}: {
  storyId: string;
  draftStory: StoryDocument;
  selectedSceneId: string;
  authorMode: AuthorMode;
  viewMode: ViewMode;
}) {
  try {
    return saveStudioDraft(storyId, {
      draftStory,
      selectedSceneId,
      authorMode,
      viewMode
    });
  } catch {
    return null;
  }
}

function formatSaveState(lastSavedAt: string | null, saveState: SaveState) {
  if (saveState === "error") {
    return "Lokales Speichern fehlgeschlagen";
  }

  if (!lastSavedAt) {
    return "Noch nicht gespeichert";
  }

  const formatter = new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return `Gespeichert ${formatter.format(new Date(lastSavedAt))}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatStoryStatus(status: StoryStatus) {
  if (status === "playtest") {
    return "Playtest";
  }

  if (status === "submitted") {
    return "Submitted";
  }

  return "Draft";
}

const DEFAULT_OUTLINE_TEMPLATE = [
  "Act: Act 1",
  "Chapter: Chapter 1",
  "Scene: Opening Image",
  "Scene: First Decision",
  "",
  "Act: Act 2",
  "Chapter: Chapter 2",
  "Scene: Consequence"
].join("\n");

function buildActsFromOutline(outlineDraft: string) {
  const lines = outlineDraft
    .split(/\r?\n/)
    .map(function (line) {
      return line.trim();
    })
    .filter(Boolean);

  if (!lines.length) {
    throw new Error("Die Outline ist leer.");
  }

  const acts: StoryAct[] = [];
  let currentAct: StoryAct | null = null;
  let currentChapter: StoryChapter | null = null;

  lines.forEach(function (line) {
    const actMatch = line.match(/^act(?:\s*\d+)?\s*[:\-]\s*(.+)$/i);
    const chapterMatch = line.match(/^chapter(?:\s*\d+)?\s*[:\-]\s*(.+)$/i);
    const sceneMatch = line.match(/^(?:scene|beat)(?:\s*\d+)?\s*[:\-]\s*(.+)$/i);

    if (actMatch) {
      currentAct = {
        id: createLocalId("act"),
        title: actMatch[1].trim() || `Act ${acts.length + 1}`,
        order: acts.length + 1,
        chapters: []
      };
      acts.push(currentAct);
      currentChapter = null;
      return;
    }

    if (chapterMatch) {
      if (!currentAct) {
        currentAct = {
          id: createLocalId("act"),
          title: `Act ${acts.length + 1}`,
          order: acts.length + 1,
          chapters: []
        };
        acts.push(currentAct);
      }

      currentChapter = {
        id: createLocalId("chapter"),
        actId: currentAct.id,
        title: chapterMatch[1].trim() || `Chapter ${currentAct.chapters.length + 1}`,
        order: currentAct.chapters.length + 1,
        scenes: [],
        wordCount: 0
      };

      currentAct.chapters.push(currentChapter);
      return;
    }

    const sceneTitle = (sceneMatch?.[1] ?? line).trim();

    if (!currentAct) {
      currentAct = {
        id: createLocalId("act"),
        title: `Act ${acts.length + 1}`,
        order: acts.length + 1,
        chapters: []
      };
      acts.push(currentAct);
    }

    if (!currentChapter) {
      currentChapter = {
        id: createLocalId("chapter"),
        actId: currentAct.id,
        title: `Chapter ${currentAct.chapters.length + 1}`,
        order: currentAct.chapters.length + 1,
        scenes: [],
        wordCount: 0
      };
      currentAct.chapters.push(currentChapter);
    }

    const nextScene = createOutlineScene(currentChapter.id, sceneTitle, currentChapter.scenes.length + 1);

    currentChapter.scenes.push(nextScene);
  });

  const normalizedActs = acts
    .map(function (act) {
      const chapters = act.chapters
        .filter(function (chapter) {
          return chapter.scenes.length > 0;
        })
        .map(function (chapter, chapterIndex) {
          const scenes = chapter.scenes.map(function (scene, sceneIndex) {
            return {
              ...scene,
              order: sceneIndex + 1
            };
          });

          return {
            ...chapter,
            order: chapterIndex + 1,
            wordCount: scenes.reduce(function (sum, scene) {
              return sum + scene.wordCount;
            }, 0),
            scenes
          };
        });

      return {
        ...act,
        order: act.order,
        chapters
      };
    })
    .filter(function (act) {
      return act.chapters.length > 0;
    });

  if (!normalizedActs.length) {
    throw new Error("Die Outline enthält keine verwertbaren Szenen.");
  }

  return normalizedActs;
}

function createOutlineScene(chapterId: string, title: string, order: number): StoryScene {
  return {
    id: createLocalId("scene"),
    chapterId,
    title: title || `Scene ${order}`,
    order,
    label: "Outline Draft",
    summary: "",
    wordCount: 0,
    blocks: [
      {
        id: createLocalId("block"),
        kind: "paragraph",
        text: ""
      }
    ],
    choices: []
  };
}

function normalizeImportedStory(value: unknown, fallbackStory: StoryDocument): StoryDocument {
  if (!isStoryDocument(value)) {
    throw new Error("Die JSON-Datei hat nicht das erwartete Story-Format.");
  }

  return {
    ...value,
    id: fallbackStory.id,
    workspaceId: fallbackStory.workspaceId
  };
}

function isStoryDocument(value: unknown): value is StoryDocument {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as StoryDocument;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.workspaceId === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.authorName === "string" &&
    typeof candidate.status === "string" &&
    Boolean(candidate.meta) &&
    Array.isArray(candidate.worldBible) &&
    Array.isArray(candidate.variables) &&
    Array.isArray(candidate.acts)
  );
}

function createLocalId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

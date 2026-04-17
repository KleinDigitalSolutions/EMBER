"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PlaytestPanel } from "@/components/studio/playtest-panel";
import { ReviewPanel } from "@/components/studio/review-panel";
import { SceneEditor } from "@/components/studio/scene-editor";
import { loadStudioDraft, saveStudioDraft } from "@/lib/studio-storage";
import {
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
  const [selectedSceneId, setSelectedSceneId] = useState(
    story.acts[0]?.chapters[0]?.scenes[0]?.id ?? ""
  );
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

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
                <button className="flat-button" type="button">
                  + Add Act
                </button>
                <button className="flat-button" type="button">
                  Create from Outline
                </button>
                <button className="flat-button" type="button">
                  Import
                </button>
                <button className="flat-button" type="button">
                  Actions
                </button>
              </div>

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
  onSelectScene
}: {
  act: StoryAct;
  selectedSceneId: string;
  onSelectScene: (sceneId: string) => void;
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
          />
        );
      })}
    </section>
  );
}

function ChapterCard({
  chapter,
  selectedSceneId,
  onSelectScene
}: {
  chapter: StoryChapter;
  selectedSceneId: string;
  onSelectScene: (sceneId: string) => void;
}) {
  return (
    <article className="chapter-shell">
      <div className="chapter-topline">
        <button className="chapter-add" type="button">
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
      <button className="chapter-new-scene" type="button">
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

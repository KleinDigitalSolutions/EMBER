"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookBlueprintPanel } from "@/components/studio/book-blueprint-panel";
import { BookWriterPanel } from "@/components/studio/book-writer-panel";
import { PatchPanel } from "@/components/studio/patch-panel";
import { PlaytestPanel } from "@/components/studio/playtest-panel";
import { ReviewPanel } from "@/components/studio/review-panel";
import { SceneEditor } from "@/components/studio/scene-editor";
import { syncStoryBookArtifacts } from "@/lib/book-engine";
import { createUuid, isUuid } from "@/lib/id";
import {
  appendActToStory,
  appendChapterToAct,
  appendSceneToChapter,
  countStoryStats,
  createDefaultBookBlueprint,
  findSceneContext,
  isBranchingStory,
  normalizeBookRuleList,
  updateSceneInStory,
  type StoryAct,
  type StoryChapter,
  type StoryDocument,
  type StoryLibraryEntry,
  type StoryMode,
  type StoryStatus,
  type StoryScene,
  type WorldBibleEntry
} from "@/lib/story-schema";

type ViewMode = "grid" | "matrix" | "outline";
type AuthorMode = "plan" | "book" | "write" | "playtest" | "chat" | "review";
type SidebarMode = "library" | "codex";
type SaveState = "idle" | "saving" | "saved" | "error";

const BOOK_AUTHOR_MODES: AuthorMode[] = ["plan", "book", "review"];
const BRANCHING_AUTHOR_MODES: AuthorMode[] = ["write", "playtest", "chat", "review"];
const VIEW_MODES: ViewMode[] = ["grid", "matrix", "outline"];

export function StudioWorkspace({
  story,
  stories
}: {
  story: StoryDocument;
  stories: StoryLibraryEntry[];
}) {
  const router = useRouter();
  const [draftStory, setDraftStory] = useState(function () {
    return syncStoryBookArtifacts(story);
  });
  const [authorMode, setAuthorMode] = useState<AuthorMode>(getDefaultAuthorMode(story.mode));
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("library");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryStories, setLibraryStories] = useState(stories);
  const [libraryActionId, setLibraryActionId] = useState<string | null>(null);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [codexSearch, setCodexSearch] = useState("");
  const [showOutlineComposer, setShowOutlineComposer] = useState(false);
  const [outlineDraft, setOutlineDraft] = useState(DEFAULT_OUTLINE_TEMPLATE);
  const [outlineError, setOutlineError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [selectedCodexEntryId, setSelectedCodexEntryId] = useState(
    story.worldBible[0]?.id ?? ""
  );
  const [selectedSceneId, setSelectedSceneId] = useState(
    story.acts[0]?.chapters[0]?.scenes[0]?.id ?? ""
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const lastPersistedPayloadRef = useRef(JSON.stringify(syncStoryBookArtifacts(story)));
  const pendingPersistRef = useRef<{
    story: StoryDocument;
    payload: string;
  } | null>(null);
  const isPersistingRef = useRef(false);

  const stats = useMemo(function () {
    return countStoryStats(draftStory);
  }, [draftStory]);
  const availableAuthorModes = useMemo(function () {
    return getAuthorModesForStory(draftStory.mode);
  }, [draftStory.mode]);
  const filteredLibraryStories = useMemo(function () {
    const query = librarySearch.trim().toLowerCase();

    return libraryStories.filter(function (entry) {
      if (!query) {
        return true;
      }

      return (
        entry.title.toLowerCase().includes(query) ||
        entry.authorName.toLowerCase().includes(query) ||
        formatStoryModeLabel(entry.mode).toLowerCase().includes(query)
      );
    });
  }, [librarySearch, libraryStories]);

  const filteredCodexEntries = useMemo(function () {
    const query = codexSearch.trim().toLowerCase();

    return draftStory.worldBible.filter(function (entry) {
      if (!query) {
        return true;
      }

      return (
        entry.title.toLowerCase().includes(query) ||
        entry.summary.toLowerCase().includes(query) ||
        entry.kind.toLowerCase().includes(query)
      );
    });
  }, [codexSearch, draftStory.worldBible]);

  const selectedCodexEntry =
    draftStory.worldBible.find(function (entry) {
      return entry.id === selectedCodexEntryId;
    }) ?? null;

  useEffect(
    function () {
      setLibraryStories(stories);
    },
    [stories]
  );

  useEffect(
    function () {
      const nextStory = syncStoryBookArtifacts(story);

      setDraftStory(nextStory);
      setAuthorMode(getDefaultAuthorMode(nextStory.mode));
      setSelectedCodexEntryId(nextStory.worldBible[0]?.id ?? "");
      setSelectedSceneId(nextStory.acts[0]?.chapters[0]?.scenes[0]?.id ?? "");
      setLastSavedAt(null);
      setSaveState("idle");
      setLibraryError(null);
      setLibraryActionId(null);
      pendingPersistRef.current = null;
      lastPersistedPayloadRef.current = JSON.stringify(nextStory);
    },
    [story]
  );

  useEffect(
    function () {
      if (!availableAuthorModes.includes(authorMode)) {
        setAuthorMode(getDefaultAuthorMode(draftStory.mode));
      }
    },
    [authorMode, availableAuthorModes, draftStory.mode]
  );

  useEffect(
    function () {
      const payload = JSON.stringify(draftStory);

      if (payload === lastPersistedPayloadRef.current) {
        return;
      }

      setSaveState("saving");

      const timeoutId = window.setTimeout(function () {
        enqueuePersist(draftStory, payload);
      }, 1200);

      return function () {
        window.clearTimeout(timeoutId);
      };
    },
    [draftStory]
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

  useEffect(
    function () {
      if (!draftStory.worldBible.length) {
        if (selectedCodexEntryId) {
          setSelectedCodexEntryId("");
        }
        return;
      }

      const hasSelectedCodexEntry = draftStory.worldBible.some(function (entry) {
        return entry.id === selectedCodexEntryId;
      });

      if (!hasSelectedCodexEntry) {
        setSelectedCodexEntryId(draftStory.worldBible[0].id);
      }
    },
    [draftStory.worldBible, selectedCodexEntryId]
  );

  const selectedSceneContext = useMemo(function () {
    return selectedSceneId ? findSceneContext(draftStory, selectedSceneId) : null;
  }, [draftStory, selectedSceneId]);

  const selectedScene = selectedSceneContext?.scene ?? null;

  async function flushPersistQueue() {
    if (isPersistingRef.current) {
      return;
    }

    isPersistingRef.current = true;

    try {
      while (pendingPersistRef.current) {
        const nextPersist = pendingPersistRef.current;
        pendingPersistRef.current = null;
        setSaveState("saving");

        try {
          const snapshot = await persistStudioStoryRemote(nextPersist.story);
          lastPersistedPayloadRef.current = nextPersist.payload;
          setLastSavedAt(snapshot.savedAt);
          setSaveState(pendingPersistRef.current ? "saving" : "saved");
        } catch {
          setSaveState("error");
        }
      }
    } finally {
      isPersistingRef.current = false;

      if (pendingPersistRef.current) {
        void flushPersistQueue();
      }
    }
  }

  function enqueuePersist(storySnapshot: StoryDocument, payload: string) {
    pendingPersistRef.current = {
      story: storySnapshot,
      payload
    };

    void flushPersistQueue();
  }

  function commitStoryUpdate(updater: (story: StoryDocument) => StoryDocument) {
    setDraftStory(function (currentStory) {
      return syncStoryBookArtifacts(updater(currentStory));
    });
  }

  function updateSelectedScene(updater: (scene: StoryScene) => StoryScene) {
    if (!selectedSceneId) {
      return;
    }

    commitStoryUpdate(function (currentStory) {
      return updateSceneInStory(currentStory, selectedSceneId, updater);
    });
  }

  function updateDraftStory(updater: (story: StoryDocument) => StoryDocument) {
    commitStoryUpdate(function (currentStory) {
      return updater(currentStory);
    });
  }

  function updateStoryStatus(status: StoryStatus) {
    commitStoryUpdate(function (currentStory) {
      return {
        ...currentStory,
        status
      };
    });
  }

  function toggleStoryMode() {
    commitStoryUpdate(function (currentStory) {
      const nextMode: StoryMode = currentStory.mode === "book" ? "branching" : "book";
      return {
        ...currentStory,
        mode: nextMode
      };
    });
  }

  async function persistDraftIfDirty() {
    const normalizedStory = syncStoryBookArtifacts(draftStory);
    const payload = JSON.stringify(normalizedStory);

    if (payload === lastPersistedPayloadRef.current && !pendingPersistRef.current) {
      return true;
    }

    setSaveState("saving");
    pendingPersistRef.current = null;

    try {
      const snapshot = await persistStudioStoryRemote(normalizedStory);
      lastPersistedPayloadRef.current = payload;
      setLastSavedAt(snapshot.savedAt);
      setSaveState("saved");
      return true;
    } catch (error) {
      setSaveState("error");
      setLibraryError(
        error instanceof Error ? error.message : "Projekt konnte nicht nach Supabase gespeichert werden."
      );
      return false;
    }
  }

  async function handleNewProject() {
    setLibraryError(null);
    setLibraryActionId("create");

    try {
      const canContinue = await persistDraftIfDirty();

      if (!canContinue) {
        return;
      }

      const created = await createStudioStoryRemote(draftStory.workspaceId);

      setLibraryStories(function (currentStories) {
        return [created.summary].concat(
          currentStories.filter(function (entry) {
            return entry.id !== created.summary.id;
          })
        );
      });
      setSidebarMode("library");
      setIsSidebarCollapsed(false);
      router.push(`/studio?storyId=${created.storyId}`);
    } catch (error) {
      setLibraryError(error instanceof Error ? error.message : "Neues Projekt konnte nicht angelegt werden.");
    } finally {
      setLibraryActionId(null);
    }
  }

  async function handleSelectLibraryStory(nextStoryId: string) {
    if (nextStoryId === draftStory.id) {
      return;
    }

    setLibraryError(null);
    setLibraryActionId(nextStoryId);

    try {
      const canContinue = await persistDraftIfDirty();

      if (!canContinue) {
        return;
      }

      router.push(`/studio?storyId=${nextStoryId}`);
    } finally {
      setLibraryActionId(null);
    }
  }

  async function handleDeleteProject(targetStoryId: string) {
    const targetStory = libraryStories.find(function (entry) {
      return entry.id === targetStoryId;
    });
    const targetLabel = targetStory?.title || "dieses Projekt";

    if (!window.confirm(`"${targetLabel}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      return;
    }

    setLibraryError(null);
    setLibraryActionId(`delete:${targetStoryId}`);

    try {
      await deleteStudioStoryRemote(targetStoryId);

      const remainingStories = libraryStories.filter(function (entry) {
        return entry.id !== targetStoryId;
      });

      setLibraryStories(remainingStories);

      if (targetStoryId === draftStory.id) {
        const nextStoryId = remainingStories[0]?.id ?? null;
        router.push(nextStoryId ? `/studio?storyId=${nextStoryId}` : "/studio");
      }
    } catch (error) {
      setLibraryError(error instanceof Error ? error.message : "Projekt konnte nicht gelöscht werden.");
    } finally {
      setLibraryActionId(null);
    }
  }

  function handleManualSave() {
    const normalizedStory = syncStoryBookArtifacts(draftStory);
    const payload = JSON.stringify(normalizedStory);

    if (payload === lastPersistedPayloadRef.current && !pendingPersistRef.current) {
      setSaveState("saved");
      return;
    }

    setSaveState("saving");
    enqueuePersist(normalizedStory, payload);
  }

  function handleCreateCodexEntry() {
    const nextEntry: WorldBibleEntry = {
      id: createLocalId("wb"),
      title: "Neue Codex-Karte",
      kind: "character",
      summary: ""
    };

    commitStoryUpdate(function (currentStory) {
      return {
        ...currentStory,
        worldBible: currentStory.worldBible.concat(nextEntry)
      };
    });

    setSelectedCodexEntryId(nextEntry.id);
    setCodexSearch("");
  }

  function updateSelectedCodexEntry(updater: (entry: WorldBibleEntry) => WorldBibleEntry) {
    if (!selectedCodexEntryId) {
      return;
    }

    commitStoryUpdate(function (currentStory) {
      return {
        ...currentStory,
        worldBible: currentStory.worldBible.map(function (entry) {
          return entry.id === selectedCodexEntryId ? updater(entry) : entry;
        })
      };
    });
  }

  function handleDeleteCodexEntry() {
    if (!selectedCodexEntryId) {
      return;
    }

    commitStoryUpdate(function (currentStory) {
      return {
        ...currentStory,
        worldBible: currentStory.worldBible.filter(function (entry) {
          return entry.id !== selectedCodexEntryId;
        })
      };
    });
  }

  function handleAddAct() {
    let nextSceneId = "";

    commitStoryUpdate(function (currentStory) {
      const result = appendActToStory(currentStory);
      nextSceneId = result.sceneId;
      return result.story;
    });

    setSearch("");

    if (nextSceneId) {
      setSelectedSceneId(nextSceneId);
      setAuthorMode("book");
    }
  }

  function handleAddChapter(actId: string) {
    let nextSceneId = "";

    commitStoryUpdate(function (currentStory) {
      const result = appendChapterToAct(currentStory, actId);
      nextSceneId = result.sceneId;
      return result.story;
    });

    setSearch("");

    if (nextSceneId) {
      setSelectedSceneId(nextSceneId);
      setAuthorMode("book");
    }
  }

  function handleAddScene(chapterId: string) {
    let nextSceneId = "";

    commitStoryUpdate(function (currentStory) {
      const result = appendSceneToChapter(currentStory, chapterId);
      nextSceneId = result.sceneId;
      return result.story;
    });

    setSearch("");

    if (nextSceneId) {
      setSelectedSceneId(nextSceneId);
      setAuthorMode("book");
    }
  }

  function handleCreateFromOutline() {
    try {
      const nextActs = buildActsFromOutline(outlineDraft);
      const nextSelectedSceneId = nextActs[0]?.chapters[0]?.scenes[0]?.id ?? "";

      commitStoryUpdate(function (currentStory) {
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
        setAuthorMode("book");
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

      setDraftStory(syncStoryBookArtifacts(nextStory));
      setImportError(null);
      setShowOutlineComposer(false);
      setSearch("");

      if (nextSelectedSceneId) {
        setSelectedSceneId(nextSelectedSceneId);
        setAuthorMode("book");
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
    <div className={"studio-shell" + (isSidebarCollapsed ? " studio-shell--collapsed" : "")}>
      <aside className="rail" aria-label="Hauptnavigation">
        <button
          className="rail-button rail-button--toggle"
          type="button"
          aria-label="Sidebar umschalten"
          title={isSidebarCollapsed ? "Sidebar öffnen" : "Sidebar einklappen"}
          onClick={function () {
            setIsSidebarCollapsed(function (current) {
              return !current;
            });
          }}
        >
          <span className={"rail-icon" + (isSidebarCollapsed ? " rail-icon--forward" : " rail-icon--back")} />
        </button>

        <div className="rail-spacer" />

        <button
          className={"rail-button" + (sidebarMode === "library" ? " rail-button--active" : "")}
          type="button"
          aria-label="Bibliothek"
          title="Projektbibliothek"
          onClick={function () {
            setSidebarMode("library");
            setIsSidebarCollapsed(false);
          }}
        >
          <span className="rail-icon rail-icon--panel" />
        </button>

        <button
          className="rail-button rail-button--plus"
          type="button"
          aria-label="Neues Projekt"
          title="Ein neues Buch oder eine Story starten"
          onClick={function () {
            void handleNewProject();
          }}
        >
          <span className="rail-icon rail-icon--plus" />
        </button>

        <div className="rail-divider" />

        <button
          className={"rail-button" + (sidebarMode === "codex" ? " rail-button--active" : "")}
          type="button"
          aria-label="Codex"
          title="Worldbuilding und Codex"
          onClick={function () {
            setSidebarMode("codex");
            setIsSidebarCollapsed(false);
          }}
        >
          <span className="rail-icon rail-icon--book" />
        </button>
      </aside>

      <aside className="sidebar">
        <header className="sidebar-header">
          <div className="sidebar-project">
            <span className="landing-kicker">
              {sidebarMode === "library" ? "Projektbibliothek" : "Codex"}
            </span>
            <h1>{sidebarMode === "library" ? "Projekte" : draftStory.title}</h1>
            <p>
              {sidebarMode === "library"
                ? `${libraryStories.length} Projekte in Supabase`
                : `${draftStory.authorName || "Ohne Autor"} · ${formatStoryStatus(draftStory.status)}`}
            </p>
          </div>
        </header>

        <nav className="sidebar-tabs" aria-label="Bereiche">
          <button
            className={"sidebar-tab" + (sidebarMode === "library" ? " sidebar-tab--active" : "")}
            type="button"
            onClick={function () {
              setSidebarMode("library");
            }}
          >
            Bibliothek
          </button>
          <button
            className={"sidebar-tab" + (sidebarMode === "codex" ? " sidebar-tab--active" : "")}
            type="button"
            onClick={function () {
              setSidebarMode("codex");
            }}
          >
            Codex
          </button>
        </nav>

        <div className="sidebar-toolbar">
          <label className="search-field">
            <span className="search-icon" />
            <input
              type="search"
              placeholder={sidebarMode === "library" ? "Projekte suchen..." : "Codex durchsuchen..."}
              value={sidebarMode === "library" ? librarySearch : codexSearch}
              onChange={function (event) {
                if (sidebarMode === "library") {
                  setLibrarySearch(event.target.value);
                  return;
                }

                setCodexSearch(event.target.value);
              }}
            />
          </label>
          {sidebarMode === "library" ? (
            <button
              className="flat-button"
              type="button"
              onClick={function () {
                void handleNewProject();
              }}
              disabled={libraryActionId === "create"}
            >
              {libraryActionId === "create" ? "Lädt..." : "+ Projekt"}
            </button>
          ) : (
            <button className="flat-button" type="button" onClick={handleCreateCodexEntry}>
              + Eintrag
            </button>
          )}
          {sidebarMode === "library" ? (
            <span className="square-button square-button--info" aria-hidden="true">
              {libraryStories.length}
            </span>
          ) : (
            <button
              className="square-button"
              type="button"
              aria-label="Optionen"
              title="Noch nicht aktiv"
              disabled
            >
              <span className="mini-icon mini-icon--gear" />
            </button>
          )}
        </div>

        {sidebarMode === "library" ? (
          <>
            <section className="sidebar-library-summary">
              <div className="sidebar-library-summary__card">
                <strong>{draftStory.title || "Unbenanntes Projekt"}</strong>
                <span>
                  {formatStoryModeLabel(draftStory.mode)} · {formatStoryStatus(draftStory.status)}
                </span>
              </div>
              {libraryError ? <p className="sidebar-inline-error">{libraryError}</p> : null}
            </section>

            <div className="sidebar-library-list">
              {filteredLibraryStories.map(function (entry) {
                const isActive = entry.id === draftStory.id;
                const isDeleting = libraryActionId === `delete:${entry.id}`;
                const isOpening = libraryActionId === entry.id;

                return (
                  <article
                    key={entry.id}
                    className={"project-row" + (isActive ? " project-row--active" : "")}
                  >
                    <button
                      className="project-row__open"
                      type="button"
                      onClick={function () {
                        void handleSelectLibraryStory(entry.id);
                      }}
                      disabled={isOpening || isDeleting}
                    >
                      <div className="project-row__head">
                        <h3>{entry.title || "Unbenanntes Projekt"}</h3>
                        {isActive ? <span className="project-row__active-pill">Aktiv</span> : null}
                      </div>
                      <p>{entry.authorName || "Ohne Autor"}</p>
                      <div className="project-row__meta">
                        <span>{formatStoryModeLabel(entry.mode)}</span>
                        <span>{formatStoryStatus(entry.status)}</span>
                        <span>{formatLibraryTimestamp(entry.updatedAt)}</span>
                      </div>
                    </button>
                    <button
                      className="project-row__delete"
                      type="button"
                      onClick={function () {
                        void handleDeleteProject(entry.id);
                      }}
                      disabled={isDeleting || libraryActionId === "create"}
                    >
                      {isDeleting ? "..." : "Löschen"}
                    </button>
                  </article>
                );
              })}

              {!filteredLibraryStories.length ? (
                <article className="project-row project-row--empty">
                  <h3>Keine Treffer</h3>
                  <p>Die Suche findet aktuell kein Projekt.</p>
                </article>
              ) : null}
            </div>
          </>
        ) : selectedCodexEntry ? (
          <>
            <section className="codex-editor">
              <div className="codex-editor__head">
                <div>
                  <h2>Codex-Eintrag</h2>
                  <p>{selectedCodexEntry.id}</p>
                </div>
                <button className="scene-block-card__remove" type="button" onClick={handleDeleteCodexEntry}>
                  Entfernen
                </button>
              </div>

              <label className="editor-field">
                <span>Titel</span>
                <input
                  className="editor-input"
                  type="text"
                  value={selectedCodexEntry.title}
                  onChange={function (event) {
                    updateSelectedCodexEntry(function (entry) {
                      return {
                        ...entry,
                        title: event.target.value
                      };
                    });
                  }}
                />
              </label>

              <label className="editor-field">
                <span>Typ</span>
                <select
                  className="editor-input editor-select"
                  value={selectedCodexEntry.kind}
                  onChange={function (event) {
                    updateSelectedCodexEntry(function (entry) {
                      return {
                        ...entry,
                        kind: event.target.value as WorldBibleEntry["kind"]
                      };
                    });
                  }}
                >
                  <option value="character">Character</option>
                  <option value="location">Location</option>
                  <option value="object">Object</option>
                  <option value="theme">Theme</option>
                </select>
              </label>

              <label className="editor-field">
                <span>Summary</span>
                <textarea
                  className="editor-textarea codex-editor__textarea"
                  value={selectedCodexEntry.summary}
                  onChange={function (event) {
                    updateSelectedCodexEntry(function (entry) {
                      return {
                        ...entry,
                        summary: event.target.value
                      };
                    });
                  }}
                />
              </label>
            </section>

            <div className="sidebar-codex-list">
              {filteredCodexEntries.map(function (entry) {
                return (
                  <button
                    key={entry.id}
                    className={
                      "codex-row" + (entry.id === selectedCodexEntryId ? " codex-row--active" : "")
                    }
                    type="button"
                    onClick={function () {
                      setSelectedCodexEntryId(entry.id);
                    }}
                  >
                    <h3>{entry.title}</h3>
                    <p>{entry.summary}</p>
                  </button>
                );
              })}

              {!filteredCodexEntries.length ? (
                <article className="codex-row codex-row--empty">
                  <h3>Keine Treffer</h3>
                  <p>Die aktuelle Suche findet keine Codex-Einträge.</p>
                </article>
              ) : null}
            </div>
          </>
        ) : (
          <section className="sidebar-empty">
            <h2>Dein Codex ist leer</h2>
            <p>Hier sammelst du Figuren, Orte, Objekte und Themen deiner Story.</p>
            <p className="sidebar-empty__hint">Lege oben den ersten Eintrag an.</p>
          </section>
        )}

        <footer className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar" />
            <span className="usage-pill">Lokal</span>
          </div>
          <div className="sidebar-footer__links">
            <button className="footer-link" type="button" onClick={handleExport}>
              Exportieren
            </button>
            <button className="footer-link" type="button" onClick={handleManualSave}>
              Speichern
            </button>
          </div>
        </footer>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <div className="pill-group pill-group--mode-switch" aria-label="Engine Mode">
              <button
                className={
                  "pill-button pill-button--mode" + (draftStory.mode === "book" ? " pill-button--active" : "")
                }
                onClick={toggleStoryMode}
                type="button"
                title="Lineare Book Engine (Amazon Fokus)"
              >
                Books
              </button>
              <button
                className={
                  "pill-button pill-button--mode" + (draftStory.mode === "branching" ? " pill-button--active" : "")
                }
                onClick={toggleStoryMode}
                type="button"
                title="Interaktive Ember Engine (Choice Fokus)"
              >
                Ember
              </button>
            </div>

            <div className="pill-group" aria-label="Mode">
              {availableAuthorModes.map(function (mode) {
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
                    title={getAuthorModeTooltip(mode)}
                  >
                    {formatAuthorModeLabel(mode)}
                  </button>
                );
              })}
            </div>

            {authorMode !== "book" ? (
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
            ) : null}

            {authorMode !== "book" ? <span className="filter-label">FILTER:</span> : null}

            {authorMode !== "book" ? (
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
            ) : null}
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
            {isBranchingStory(draftStory) ? (
              <Link href="/story" className="flat-button topbar-link">
                Story testen
              </Link>
            ) : null}
            <span className="view-toggle" aria-hidden="true">
              {formatAuthorModeLabel(authorMode)}
            </span>
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

          {authorMode === "book" ? (
            <BookWriterPanel
              story={draftStory}
              sceneContext={selectedSceneContext}
              selectedSceneId={selectedSceneId}
              onSelectScene={setSelectedSceneId}
              onAddAct={handleAddAct}
              onAddChapter={handleAddChapter}
              onAddScene={handleAddScene}
              onUpdateScene={updateSelectedScene}
              onUpdateStory={updateDraftStory}
              onOpenBranchEditor={function () {
                setAuthorMode("write");
              }}
            />
          ) : (
            <div className="workspace-panels">
              <div className="board-panel">
                <div className="board-meta">
                  <div className="board-meta__title-wrap">
                    <button
                      className="ghost-icon-button"
                      type="button"
                      aria-label="Reorder"
                      title="Noch nicht aktiv"
                      disabled
                    >
                      <span className="mini-icon mini-icon--drag" />
                    </button>
                    <h2 className="board-title">
                      {filteredActs[0]?.title ?? draftStory.acts[0]?.title}
                    </h2>
                  </div>
                  <div className="board-meta__stats">
                    <span>{stats.chapterCount} Kapitel</span>
                    <span>-</span>
                    <span>{stats.wordCount.toLocaleString("de-DE")} Wörter</span>
                    {isBranchingStory(draftStory) ? (
                      <>
                        <span>-</span>
                        <span>{stats.choiceCount} Choices</span>
                      </>
                    ) : null}
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
                  <button className="flat-button" type="button" title="Noch nicht aktiv" disabled>
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
                      {isBranchingStory(draftStory) ? (
                        <span>{selectedScene.choices.length} choices</span>
                      ) : null}
                    </div>
                  </section>
                ) : null}
              </div>

              {authorMode === "plan" ? (
                <BookBlueprintPanel
                  story={draftStory}
                  selectedSceneId={selectedSceneId}
                  onSelectScene={setSelectedSceneId}
                  onUpdateStory={updateDraftStory}
                />
              ) : authorMode === "playtest" ? (
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
          )}
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

function formatAuthorModeLabel(mode: AuthorMode) {
  switch (mode) {
    case "plan":
      return "Plan";
    case "book":
      return "Book";
    case "write":
      return "Branch";
    case "playtest":
      return "Playtest";
    case "chat":
      return "Patch";
    case "review":
      return "Review";
    default:
      return capitalize(mode);
  }
}

function getAuthorModeTooltip(mode: AuthorMode) {
  switch (mode) {
    case "plan":
      return "Strategische Planung: Prämisse, Stilregeln und Markt-Ausrichtung festlegen.";
    case "book":
      return "Schreib-Studio: Szenen entwerfen, Entwürfe generieren und den Text verfeinern.";
    case "write":
      return "Interaktiver Editor: Verzweigungen (Choices) und Story-Logik bearbeiten.";
    case "playtest":
      return "Vorschau: Die Story aus der Sicht eines Lesers testen.";
    case "chat":
      return "KI-Patching: Gezielte Änderungen am Text über KI-Vorschläge vornehmen.";
    case "review":
      return "Qualitätskontrolle: Kontinuität prüfen und Veröffentlichungs-Check durchführen.";
    default:
      return "";
  }
}

function getAuthorModesForStory(mode: StoryMode): AuthorMode[] {
  return mode === "branching" ? BRANCHING_AUTHOR_MODES : BOOK_AUTHOR_MODES;
}

function getDefaultAuthorMode(mode: StoryMode): AuthorMode {
  return mode === "branching" ? "write" : "book";
}

function isViewMode(value: string): value is ViewMode {
  return VIEW_MODES.includes(value as ViewMode);
}

async function persistStudioStoryRemote(draftStory: StoryDocument) {
  const response = await fetch(`/api/stories/${draftStory.id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(draftStory)
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof payload.error === "string" ? payload.error : "Remote saving failed."
    );
  }

  return {
    savedAt:
      typeof payload.savedAt === "string" ? payload.savedAt : new Date().toISOString()
  };
}

async function createStudioStoryRemote(workspaceId: string) {
  const response = await fetch("/api/stories", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      workspaceId
    })
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof payload.error === "string" ? payload.error : "Story creation failed."
    );
  }

  return payload as {
    storyId: string;
    summary: StoryLibraryEntry;
  };
}

async function deleteStudioStoryRemote(storyId: string) {
  const response = await fetch(`/api/stories/${storyId}`, {
    method: "DELETE"
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof payload.error === "string" ? payload.error : "Story delete failed."
    );
  }
}

function formatSaveState(lastSavedAt: string | null, saveState: SaveState) {
  if (saveState === "saving") {
    return "Speichert nach Supabase...";
  }

  if (saveState === "error") {
    return "Supabase-Speichern fehlgeschlagen";
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
    return "Eingereicht";
  }

  return "Entwurf";
}

function formatStoryModeLabel(mode: StoryMode) {
  return mode === "branching" ? "Ember" : "Buch";
}

function formatLibraryTimestamp(value: string) {
  if (!value) {
    return "ohne Datum";
  }

  const timestamp = new Date(value);

  if (Number.isNaN(timestamp.getTime())) {
    return "ohne Datum";
  }

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(timestamp);
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

  const normalizedBook = normalizeBookBlueprint(value.book, value.title)
  const storyMode = normalizeStoryMode(value.mode, fallbackStory.mode)

  return {
    ...value,
    id: fallbackStory.id,
    workspaceId: fallbackStory.workspaceId,
    mode: storyMode,
    worldBible: normalizeImportedWorldBible(value.worldBible),
    variables: normalizeImportedVariables(value.variables),
    acts: normalizeImportedActs(value.acts),
    book: {
      ...normalizedBook,
      memory: createDefaultBookBlueprint(value.title).memory,
      draftEngine: {
        ...normalizedBook.draftEngine,
        jobs: []
      }
    }
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
    (typeof candidate.mode === "undefined" || typeof candidate.mode === "string") &&
    Boolean(candidate.meta) &&
    Array.isArray(candidate.worldBible) &&
    Array.isArray(candidate.variables) &&
    Array.isArray(candidate.acts)
  );
}

function createLocalId(prefix: string) {
  return createUuid();
}

function normalizeImportedWorldBible(worldBible: StoryDocument["worldBible"]) {
  return worldBible.map(function (entry) {
    return {
      ...entry,
      id: isUuid(entry.id) ? entry.id : createLocalId("world_bible")
    };
  });
}

function normalizeImportedVariables(variables: StoryDocument["variables"]) {
  return variables.map(function (variable) {
    return {
      ...variable,
      id: isUuid(variable.id) ? variable.id : createLocalId("variable")
    };
  });
}

function normalizeImportedActs(acts: StoryDocument["acts"]) {
  const sceneIdMap = new Map<string, string>();

  acts.forEach(function (act) {
    act.chapters.forEach(function (chapter) {
      chapter.scenes.forEach(function (scene) {
        sceneIdMap.set(scene.id, isUuid(scene.id) ? scene.id : createLocalId("scene"));
      });
    });
  });

  return acts.map(function (act, actIndex) {
    const actId = isUuid(act.id) ? act.id : createLocalId("act");

    const chapters = act.chapters.map(function (chapter, chapterIndex) {
      const chapterId = isUuid(chapter.id) ? chapter.id : createLocalId("chapter");

      const scenes = chapter.scenes.map(function (scene, sceneIndex) {
        const sceneId = sceneIdMap.get(scene.id) ?? createLocalId("scene");

        return {
          ...scene,
          id: sceneId,
          chapterId,
          order: sceneIndex + 1,
          blocks: scene.blocks.map(function (block) {
            return {
              ...block,
              id: isUuid(block.id) ? block.id : createLocalId("block")
            };
          }),
          choices: (scene.choices ?? []).map(function (choice) {
            return {
              ...choice,
              id: isUuid(choice.id) ? choice.id : createLocalId("choice"),
              toSceneId: sceneIdMap.get(choice.toSceneId) ?? sceneId
            };
          })
        };
      });

      return {
        ...chapter,
        id: chapterId,
        actId,
        order: chapterIndex + 1,
        scenes
      };
    });

    return {
      ...act,
      id: actId,
      order: actIndex + 1,
      chapters
    };
  });
}

function normalizeStoryMode(value: unknown, fallback: StoryMode): StoryMode {
  if (value === "book" || value === "branching") {
    return value;
  }

  return fallback;
}

function normalizeBookBlueprint(
  value: unknown,
  title: string
): StoryDocument["book"] {
  const fallback = createDefaultBookBlueprint(title);

  if (!value || typeof value !== "object") {
    return fallback;
  }

  const candidate = value as Partial<StoryDocument["book"]>;

  return {
    priority: candidate.priority === "secondary" ? "secondary" : fallback.priority,
    activePhase: isBookPhase(candidate.activePhase) ? candidate.activePhase : fallback.activePhase,
    targetFormat:
      candidate.targetFormat === "novella" ||
      candidate.targetFormat === "novel" ||
      candidate.targetFormat === "series"
        ? candidate.targetFormat
        : fallback.targetFormat,
    targetLengthWords:
      typeof candidate.targetLengthWords === "number"
        ? candidate.targetLengthWords
        : fallback.targetLengthWords,
    masterBrief: {
      premise:
        typeof candidate.masterBrief?.premise === "string"
          ? candidate.masterBrief.premise
          : fallback.masterBrief.premise,
      readerPromise:
        typeof candidate.masterBrief?.readerPromise === "string"
          ? candidate.masterBrief.readerPromise
          : fallback.masterBrief.readerPromise,
      endingPromise:
        typeof candidate.masterBrief?.endingPromise === "string"
          ? candidate.masterBrief.endingPromise
          : fallback.masterBrief.endingPromise,
      thematicCore:
        typeof candidate.masterBrief?.thematicCore === "string"
          ? candidate.masterBrief.thematicCore
          : fallback.masterBrief.thematicCore,
      storyArchitecture: normalizeBookRuleList(
        candidate.masterBrief?.storyArchitecture,
        fallback.masterBrief.storyArchitecture
      )
    },
    marketBrief: {
      amazonGoal:
        typeof candidate.marketBrief?.amazonGoal === "string"
          ? candidate.marketBrief.amazonGoal
          : fallback.marketBrief.amazonGoal,
      categoryLane:
        typeof candidate.marketBrief?.categoryLane === "string"
          ? candidate.marketBrief.categoryLane
          : fallback.marketBrief.categoryLane,
      hook:
        typeof candidate.marketBrief?.hook === "string"
          ? candidate.marketBrief.hook
          : fallback.marketBrief.hook,
      seriesPotential:
        typeof candidate.marketBrief?.seriesPotential === "string"
          ? candidate.marketBrief.seriesPotential
          : fallback.marketBrief.seriesPotential,
      coverDirection:
        typeof candidate.marketBrief?.coverDirection === "string"
          ? candidate.marketBrief.coverDirection
          : fallback.marketBrief.coverDirection,
      publishingGuardrails: normalizeBookRuleList(
        candidate.marketBrief?.publishingGuardrails,
        fallback.marketBrief.publishingGuardrails
      )
    },
    writerConstitution: normalizeBookRuleList(
      candidate.writerConstitution,
      fallback.writerConstitution
    ),
    memory: normalizeBookMemoryBackbone(candidate.memory, fallback.memory),
    draftEngine: {
      mode: "local",
      targetSceneWordsMin:
        typeof candidate.draftEngine?.targetSceneWordsMin === "number"
          ? candidate.draftEngine.targetSceneWordsMin
          : fallback.draftEngine.targetSceneWordsMin,
      targetSceneWordsMax:
        typeof candidate.draftEngine?.targetSceneWordsMax === "number"
          ? candidate.draftEngine.targetSceneWordsMax
          : fallback.draftEngine.targetSceneWordsMax,
      jobs:
        Array.isArray(candidate.draftEngine?.jobs) &&
        candidate.draftEngine.jobs.every(function (job) {
          return Boolean(job) && typeof job === "object";
        })
          ? candidate.draftEngine.jobs
          : fallback.draftEngine.jobs
    },
    amazonOps: {
      penName:
        typeof candidate.amazonOps?.penName === "string"
          ? candidate.amazonOps.penName
          : fallback.amazonOps.penName,
      subtitle:
        typeof candidate.amazonOps?.subtitle === "string"
          ? candidate.amazonOps.subtitle
          : fallback.amazonOps.subtitle,
      seriesName:
        typeof candidate.amazonOps?.seriesName === "string"
          ? candidate.amazonOps.seriesName
          : fallback.amazonOps.seriesName,
      volumeNumber:
        typeof candidate.amazonOps?.volumeNumber === "string"
          ? candidate.amazonOps.volumeNumber
          : fallback.amazonOps.volumeNumber,
      description:
        typeof candidate.amazonOps?.description === "string"
          ? candidate.amazonOps.description
          : fallback.amazonOps.description,
      keywords:
        Array.isArray(candidate.amazonOps?.keywords) &&
        candidate.amazonOps.keywords.every(function (item) {
          return typeof item === "string";
        })
          ? candidate.amazonOps.keywords
          : fallback.amazonOps.keywords,
      categories:
        Array.isArray(candidate.amazonOps?.categories) &&
        candidate.amazonOps.categories.every(function (item) {
          return typeof item === "string";
        })
          ? candidate.amazonOps.categories
          : fallback.amazonOps.categories,
      audienceTags:
        Array.isArray(candidate.amazonOps?.audienceTags) &&
        candidate.amazonOps.audienceTags.every(function (item) {
          return typeof item === "string";
        })
          ? candidate.amazonOps.audienceTags
          : fallback.amazonOps.audienceTags,
      aiDisclosure:
        candidate.amazonOps?.aiDisclosure === "generated" ||
        candidate.amazonOps?.aiDisclosure === "assisted" ||
        candidate.amazonOps?.aiDisclosure === "human_led"
          ? candidate.amazonOps.aiDisclosure
          : fallback.amazonOps.aiDisclosure,
      launchChecklist: {
        manuscriptReady:
          typeof candidate.amazonOps?.launchChecklist?.manuscriptReady === "boolean"
            ? candidate.amazonOps.launchChecklist.manuscriptReady
            : fallback.amazonOps.launchChecklist.manuscriptReady,
        coverReady:
          typeof candidate.amazonOps?.launchChecklist?.coverReady === "boolean"
            ? candidate.amazonOps.launchChecklist.coverReady
            : fallback.amazonOps.launchChecklist.coverReady,
        blurbReady:
          typeof candidate.amazonOps?.launchChecklist?.blurbReady === "boolean"
            ? candidate.amazonOps.launchChecklist.blurbReady
            : fallback.amazonOps.launchChecklist.blurbReady,
        keywordsReady:
          typeof candidate.amazonOps?.launchChecklist?.keywordsReady === "boolean"
            ? candidate.amazonOps.launchChecklist.keywordsReady
            : fallback.amazonOps.launchChecklist.keywordsReady,
        categoriesReady:
          typeof candidate.amazonOps?.launchChecklist?.categoriesReady === "boolean"
            ? candidate.amazonOps.launchChecklist.categoriesReady
            : fallback.amazonOps.launchChecklist.categoriesReady,
        aiDisclosureReady:
          typeof candidate.amazonOps?.launchChecklist?.aiDisclosureReady === "boolean"
            ? candidate.amazonOps.launchChecklist.aiDisclosureReady
            : fallback.amazonOps.launchChecklist.aiDisclosureReady
      }
    }
  };
}

function normalizeBookMemoryBackbone(
  value: unknown,
  fallback: StoryDocument["book"]["memory"]
): StoryDocument["book"]["memory"] {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const candidate = value as Partial<StoryDocument["book"]["memory"]>;

  return {
    lastSyncedAt:
      typeof candidate.lastSyncedAt === "string" ? candidate.lastSyncedAt : fallback.lastSyncedAt,
    canonLedger: Array.isArray(candidate.canonLedger) ? candidate.canonLedger : fallback.canonLedger,
    characterLedger:
      Array.isArray(candidate.characterLedger) ? candidate.characterLedger : fallback.characterLedger,
    openThreads: Array.isArray(candidate.openThreads) ? candidate.openThreads : fallback.openThreads,
    sceneCards: Array.isArray(candidate.sceneCards) ? candidate.sceneCards : fallback.sceneCards,
    contextPacks:
      Array.isArray(candidate.contextPacks) ? candidate.contextPacks : fallback.contextPacks,
    continuityNotes:
      Array.isArray(candidate.continuityNotes) ? candidate.continuityNotes : fallback.continuityNotes
  };
}

function isBookPhase(value: unknown): value is StoryDocument["book"]["activePhase"] {
  return (
    value === "phase_1_foundation" ||
    value === "phase_2_memory" ||
    value === "phase_3_drafting" ||
    value === "phase_4_continuity" ||
    value === "phase_5_market"
  );
}

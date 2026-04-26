"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookBlueprintPanel } from "@/components/studio/book-blueprint-panel";
import { BookWriterPanel } from "@/components/studio/book-writer-panel";
import { ChatWorkspace } from "@/components/studio/chat-workspace";
import { PatchPanel } from "@/components/studio/patch-panel";
import { PlaytestPanel } from "@/components/studio/playtest-panel";
import { ReviewPanel } from "@/components/studio/review-panel";
import { SceneEditor } from "@/components/studio/scene-editor";
import { syncStoryBookArtifacts } from "@/lib/book-engine";
import { createUuid, isUuid } from "@/lib/id";
import {
  appendAssistantArtifact,
  appendAssistantMessage,
  appendAssistantThread,
  buildThreadSummary,
  createAssistantArtifact,
  createAssistantMessage,
  createAssistantThread,
  deriveThreadTitleFromPrompt,
  getAssistantArtifact,
  getAssistantThread,
  updateAssistantPreferences,
  updateAssistantThread
} from "@/lib/story-assistant";
import {
  appendActToStory,
  appendChapterToAct,
  appendSceneToChapter,
  createDefaultAssistantContextSelection,
  normalizeAssistantWorkspace,
  countStoryStats,
  createDefaultBookBlueprint,
  findSceneContext,
  isBranchingStory,
  normalizeBookDraftTargets,
  normalizeBookRuleList,
  updateSceneInStory,
  type StoryAct,
  type StoryChapter,
  type StoryDocument,
  type StoryLibraryEntry,
  type StoryMode,
  type SceneContext,
  type StoryStatus,
  type StoryScene,
  type WorldBibleEntry,
  type AssistantContextSelection,
  type AssistantOutputMode
} from "@/lib/story-schema";

type ViewMode = "grid" | "matrix" | "outline";
type AuthorMode = "plan" | "book" | "write" | "playtest" | "patch" | "review";
type SidebarMode = "library" | "chat" | "codex";
type PlanLayoutMode = "split" | "focus";
type SaveState = "idle" | "saving" | "saved" | "error";
type StoryUpdateGuardMode = "none" | "book";

const BOOK_AUTHOR_MODES: AuthorMode[] = ["plan", "book", "review"];
const BRANCHING_AUTHOR_MODES: AuthorMode[] = ["write", "playtest", "patch", "review"];
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [planLayoutMode, setPlanLayoutMode] = useState<PlanLayoutMode>("focus");
  const [search, setSearch] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryStories, setLibraryStories] = useState(stories);
  const [libraryActionId, setLibraryActionId] = useState<string | null>(null);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [assistantSearch, setAssistantSearch] = useState("");
  const [assistantError, setAssistantError] = useState<string | null>(null);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [codexSearch, setCodexSearch] = useState("");
  const [showOutlineComposer, setShowOutlineComposer] = useState(false);
  const [outlineDraft, setOutlineDraft] = useState(DEFAULT_OUTLINE_TEMPLATE);
  const [outlineError, setOutlineError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [selectedAssistantThreadId, setSelectedAssistantThreadId] = useState(
    story.assistant.threads[0]?.id ?? ""
  );
  const [selectedAssistantArtifactId, setSelectedAssistantArtifactId] = useState(
    story.assistant.artifacts[0]?.id ?? ""
  );
  const [selectedCodexEntryId, setSelectedCodexEntryId] = useState(
    story.worldBible[0]?.id ?? ""
  );
  const [selectedSceneId, setSelectedSceneId] = useState(
    story.acts[0]?.chapters[0]?.scenes[0]?.id ?? ""
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
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
  const latestDraftJob = useMemo(function () {
    return draftStory.book.draftEngine.jobs.reduce(function (latestJob, currentJob) {
      if (!latestJob) {
        return currentJob;
      }

      return currentJob.updatedAt.localeCompare(latestJob.updatedAt) > 0 ? currentJob : latestJob;
    }, null as StoryDocument["book"]["draftEngine"]["jobs"][number] | null);
  }, [draftStory.book.draftEngine.jobs]);
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
  const filteredAssistantThreads = useMemo(function () {
    const query = assistantSearch.trim().toLowerCase();

    return draftStory.assistant.threads
      .slice()
      .sort(function (left, right) {
        return right.updatedAt.localeCompare(left.updatedAt);
      })
      .filter(function (thread) {
        if (!query) {
          return true;
        }

        return (
          thread.title.toLowerCase().includes(query) ||
          thread.summary.toLowerCase().includes(query) ||
          thread.messages.some(function (message) {
            return message.content.toLowerCase().includes(query);
          }) ||
          draftStory.assistant.artifacts.some(function (artifact) {
            return (
              artifact.threadId === thread.id &&
              (artifact.title.toLowerCase().includes(query) ||
                artifact.summary.toLowerCase().includes(query))
            );
          })
        );
      });
  }, [assistantSearch, draftStory.assistant.artifacts, draftStory.assistant.threads]);

  const selectedCodexEntry =
    draftStory.worldBible.find(function (entry) {
      return entry.id === selectedCodexEntryId;
    }) ?? null;
  const activeLibraryEntry =
    libraryStories.find(function (entry) {
      return entry.id === draftStory.id;
    }) ?? null;
  const selectedAssistantThread = selectedAssistantThreadId
    ? getAssistantThread(draftStory, selectedAssistantThreadId)
    : null;
  const selectedAssistantArtifact = selectedAssistantArtifactId
    ? getAssistantArtifact(draftStory, selectedAssistantArtifactId)
    : null;
  const footerStatus = latestDraftJob ? formatFooterStatus(latestDraftJob.mode) : null;

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
      setSelectedAssistantThreadId(nextStory.assistant.threads[0]?.id ?? "");
      setSelectedAssistantArtifactId(nextStory.assistant.artifacts[0]?.id ?? "");
      setSelectedCodexEntryId(nextStory.worldBible[0]?.id ?? "");
      setSelectedSceneId(nextStory.acts[0]?.chapters[0]?.scenes[0]?.id ?? "");
      setLastSavedAt(null);
      setSaveState("idle");
      setSaveError(null);
      setLibraryError(null);
      setAssistantError(null);
      setAssistantSearch("");
      setIsAssistantLoading(false);
      setLibraryActionId(null);
      setIsMobileSidebarOpen(false);
      pendingPersistRef.current = null;
      lastPersistedPayloadRef.current = JSON.stringify(nextStory);
    },
    [story]
  );

  useEffect(function () {
    if (typeof window === "undefined") {
      return;
    }

    if (!window.matchMedia("(max-width: 980px)").matches) {
      return;
    }

    const previousOverflow = window.document.body.style.overflow;

    if (isMobileSidebarOpen) {
      window.document.body.style.overflow = "hidden";
    }

    return function () {
      window.document.body.style.overflow = previousOverflow;
    };
  }, [isMobileSidebarOpen]);

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
      setSaveError(null);

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

  useEffect(
    function () {
      if (!draftStory.assistant.threads.length) {
        if (selectedAssistantThreadId) {
          setSelectedAssistantThreadId("");
        }
        return;
      }

      const hasSelectedThread = draftStory.assistant.threads.some(function (thread) {
        return thread.id === selectedAssistantThreadId;
      });

      if (!hasSelectedThread) {
        setSelectedAssistantThreadId(draftStory.assistant.threads[0].id);
      }
    },
    [draftStory.assistant.threads, selectedAssistantThreadId]
  );

  useEffect(
    function () {
      if (!draftStory.assistant.artifacts.length) {
        if (selectedAssistantArtifactId) {
          setSelectedAssistantArtifactId("");
        }
        return;
      }

      const hasSelectedArtifact = draftStory.assistant.artifacts.some(function (artifact) {
        return artifact.id === selectedAssistantArtifactId;
      });

      if (!hasSelectedArtifact) {
        const artifactForThread = draftStory.assistant.artifacts.find(function (artifact) {
          return artifact.threadId === selectedAssistantThreadId;
        });

        setSelectedAssistantArtifactId(artifactForThread?.id ?? draftStory.assistant.artifacts[0].id);
      }
    },
    [draftStory.assistant.artifacts, selectedAssistantArtifactId, selectedAssistantThreadId]
  );

  const selectedSceneContext = useMemo(function () {
    return selectedSceneId ? findSceneContext(draftStory, selectedSceneId) : null;
  }, [draftStory, selectedSceneId]);

  const selectedScene = selectedSceneContext?.scene ?? null;
  const isChatSidebar = sidebarMode === "chat";
  const isPlanFocusMode = !isChatSidebar && authorMode === "plan" && planLayoutMode === "focus";
  const defaultAssistantContext = selectedSceneContext
    ? createAssistantContextSelectionFromSceneContext(selectedSceneContext)
    : createDefaultAssistantContextSelection();

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
        setSaveError(null);

        try {
          const snapshot = await persistStudioStoryRemote(nextPersist.story);
          lastPersistedPayloadRef.current = JSON.stringify(snapshot.story);
          setDraftStory(function (currentStory) {
            return JSON.stringify(currentStory) === nextPersist.payload ? snapshot.story : currentStory;
          });
          setLastSavedAt(snapshot.savedAt);
          setSaveError(null);
          setSaveState(pendingPersistRef.current ? "saving" : "saved");
        } catch (error) {
          setSaveError(
            error instanceof Error ? error.message : "Projekt konnte nicht nach Supabase gespeichert werden."
          );
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

  function commitStoryUpdate(
    updater: (story: StoryDocument) => StoryDocument,
    options?: {
      guardMode?: StoryUpdateGuardMode;
      source?: string;
    }
  ) {
    setDraftStory(function (currentStory) {
      const nextStory = updater(currentStory);
      const syncedStory = syncStoryBookArtifacts(nextStory);

      if (options?.guardMode === "book") {
        return guardBookPanelStoryState(currentStory, syncedStory, options.source ?? "book");
      }

      return syncedStory;
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

  function updateBookDraftStory(updater: (story: StoryDocument) => StoryDocument, source: string) {
    commitStoryUpdate(
      function (currentStory) {
        return updater(currentStory);
      },
      {
        guardMode: "book",
        source
      }
    );
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
    setSaveError(null);
    pendingPersistRef.current = null;

    try {
      const snapshot = await persistStudioStoryRemote(normalizedStory);
      lastPersistedPayloadRef.current = JSON.stringify(snapshot.story);
      setDraftStory(function (currentStory) {
        return JSON.stringify(currentStory) === payload ? snapshot.story : currentStory;
      });
      setLastSavedAt(snapshot.savedAt);
      setSaveError(null);
      setSaveState("saved");
      return true;
    } catch (error) {
      setSaveState("error");
      setSaveError(
        error instanceof Error ? error.message : "Projekt konnte nicht nach Supabase gespeichert werden."
      );
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
      setIsMobileSidebarOpen(false);
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

      setIsMobileSidebarOpen(false);
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
        setIsMobileSidebarOpen(false);
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
    setSaveError(null);
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

  function handleCreateAssistantThread() {
    const nextThread = createAssistantThread(
      selectedSceneContext ? `Szene: ${selectedSceneContext.scene.title}` : "Neues Gespräch",
      defaultAssistantContext
    );

    commitStoryUpdate(function (currentStory) {
      return appendAssistantThread(currentStory, nextThread);
    });

    setSelectedAssistantThreadId(nextThread.id);
    setSelectedAssistantArtifactId("");
    setAssistantSearch("");
    setSidebarMode("chat");
    setIsSidebarCollapsed(false);
    setIsMobileSidebarOpen(false);
  }

  async function handleSubmitAssistantPrompt(params: {
    prompt: string;
    outputMode: AssistantOutputMode;
    contextSelection: AssistantContextSelection;
  }) {
    const baseThread =
      selectedAssistantThread ??
      createAssistantThread(
        deriveThreadTitleFromPrompt(params.prompt),
        params.contextSelection
      );
    const userMessage = createAssistantMessage({
      role: "user",
      content: params.prompt,
      outputMode: params.outputMode,
      provider: draftStory.assistant.preferences.provider,
      context: params.contextSelection
    });
    let nextStory = draftStory;

    if (!selectedAssistantThread) {
      nextStory = appendAssistantThread(nextStory, baseThread);
    }

    nextStory = appendAssistantMessage(nextStory, baseThread.id, userMessage);

    if (!selectedAssistantThread) {
      nextStory = updateAssistantThread(nextStory, baseThread.id, function (thread) {
        return {
          ...thread,
          title: deriveThreadTitleFromPrompt(params.prompt)
        };
      });
    }

    setDraftStory(syncStoryBookArtifacts(nextStory));
    setSelectedAssistantThreadId(baseThread.id);
    setAssistantError(null);
    setIsAssistantLoading(true);

    try {
      const response = await fetch("/api/story-chat", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          story: nextStory,
          threadId: baseThread.id,
          provider: nextStory.assistant.preferences.provider,
          modelSelection: nextStory.assistant.preferences.modelSelection,
          outputMode: params.outputMode,
          contextSelection: params.contextSelection
        })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(typeof payload.error === "string" ? payload.error : "Story-Chat fehlgeschlagen.");
      }

      const assistantArtifact = payload.artifact
        ? createAssistantArtifact({
            threadId: baseThread.id,
            title: payload.artifact.title,
            kind: payload.artifact.kind,
            summary: payload.artifact.summary,
            content: payload.artifact.content,
            context: params.contextSelection
          })
        : null;
      const assistantMessage = createAssistantMessage({
        role: "assistant",
        content: payload.reply,
        outputMode: params.outputMode,
        provider: payload.provider,
        modelName: payload.modelName,
        context: params.contextSelection,
        artifactId: assistantArtifact?.id ?? null
      });

      setDraftStory(function (currentStory) {
        let updatedStory = appendAssistantMessage(currentStory, baseThread.id, assistantMessage);

        if (assistantArtifact) {
          updatedStory = appendAssistantArtifact(updatedStory, assistantArtifact);
        }

        updatedStory = updateAssistantThread(updatedStory, baseThread.id, function (thread) {
          const nextTitle =
            thread.title === "Neues Gespräch" || thread.title.startsWith("Szene:")
              ? payload.suggestedThreadTitle || deriveThreadTitleFromPrompt(params.prompt)
              : thread.title;

          return {
            ...thread,
            title: nextTitle,
            summary: buildThreadSummary(thread.messages.concat(assistantMessage)),
            context:
              thread.context.scope === "project" && params.contextSelection.scope !== "project"
                ? params.contextSelection
                : thread.context
          };
        });

        return syncStoryBookArtifacts(updatedStory);
      });

      if (assistantArtifact) {
        setSelectedAssistantArtifactId(assistantArtifact.id);
      }

      setAssistantError(payload.warning ?? null);
    } catch (error) {
      setAssistantError(error instanceof Error ? error.message : "Story-Chat fehlgeschlagen.");
    } finally {
      setIsAssistantLoading(false);
    }
  }

  function handleUpdateAssistantPreferences(
    updater: (preferences: StoryDocument["assistant"]["preferences"]) => StoryDocument["assistant"]["preferences"]
  ) {
    commitStoryUpdate(function (currentStory) {
      return updateAssistantPreferences(currentStory, updater);
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

  function handleCreateFirstScene() {
    let nextSceneId = "";

    commitStoryUpdate(function (currentStory) {
      const firstAct = currentStory.acts[0];

      if (!firstAct) {
        const result = appendActToStory(currentStory);
        nextSceneId = result.sceneId;
        return result.story;
      }

      const firstChapter = firstAct.chapters[0];

      if (!firstChapter) {
        const result = appendChapterToAct(currentStory, firstAct.id);
        nextSceneId = result.sceneId;
        return result.story;
      }

      if (!firstChapter.scenes.length) {
        const result = appendSceneToChapter(currentStory, firstChapter.id);
        nextSceneId = result.sceneId;
        return result.story;
      }

      nextSceneId = firstChapter.scenes[0].id;
      return currentStory;
    });

    setSearch("");

    if (nextSceneId) {
      setSelectedSceneId(nextSceneId);
      setAuthorMode("book");
    }
  }

  function handleDeleteAct(actId: string) {
    if (!window.confirm("Bist du sicher? Dieser Akt und alle enthaltenen Kapitel und Szenen werden unwiderruflich gelöscht.")) {
      return;
    }

    commitStoryUpdate(function (currentStory) {
      return {
        ...currentStory,
        acts: currentStory.acts.filter(function (act) {
          return act.id !== actId;
        })
      };
    });
  }

  function handleDeleteChapter(chapterId: string) {
    if (!window.confirm("Bist du sicher? Dieses Kapitel und alle enthaltenen Szenen werden unwiderruflich gelöscht.")) {
      return;
    }

    commitStoryUpdate(function (currentStory) {
      return {
        ...currentStory,
        acts: currentStory.acts.map(function (act) {
          return {
            ...act,
            chapters: act.chapters.filter(function (chapter) {
              return chapter.id !== chapterId;
            })
          };
        })
      };
    });
  }

  function handleDeleteScene(sceneId: string) {
    if (!window.confirm("Bist du sicher? Diese Szene wird unwiderruflich gelöscht.")) {
      return;
    }

    commitStoryUpdate(function (currentStory) {
      const nextStory = {
        ...currentStory,
        acts: currentStory.acts.map(function (act) {
          return {
            ...act,
            chapters: act.chapters.map(function (chapter) {
              return {
                ...chapter,
                scenes: chapter.scenes.filter(function (scene) {
                  return scene.id !== sceneId;
                })
              };
            })
          };
        })
      };

      if (selectedSceneId === sceneId) {
        setSelectedSceneId("");
      }

      return nextStory;
    });
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
    <div
      className={
        "studio-shell" +
        (isSidebarCollapsed ? " studio-shell--collapsed" : "") +
        (isMobileSidebarOpen ? " studio-shell--mobile-sidebar-open" : "")
      }
    >
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
          className={"rail-button" + (sidebarMode === "chat" ? " rail-button--active" : "")}
          type="button"
          aria-label="Chat"
          title="Brainstorming und Regie"
          onClick={function () {
            setSidebarMode("chat");
            setIsSidebarCollapsed(false);
          }}
        >
          <span className="rail-icon rail-icon--chat" />
        </button>

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

        <div className="rail-spacer" />

        <Link
          href="/studio/guide"
          className="rail-button"
          title="Regie-Guide & Hilfe"
        >
          <span className="rail-icon rail-icon--help" />
        </Link>
      </aside>

      <aside className="sidebar">
        <header className="sidebar-header">
          <div className="sidebar-project">
            <span className="landing-kicker">
              {sidebarMode === "library"
                ? "Projektbibliothek"
                : sidebarMode === "chat"
                  ? "Assistant"
                  : "Codex"}
            </span>
            <h1>
              {sidebarMode === "library"
                ? "Projekte"
                : sidebarMode === "chat"
                  ? "Chat"
                  : draftStory.title}
            </h1>
            {sidebarMode === "library" ? null : sidebarMode === "chat" ? (
              <p>Brainstorming, Fragen und Regie-Dokumente für {draftStory.title}</p>
            ) : (
              <p>{`${draftStory.authorName || "Ohne Autor"} · ${formatStoryStatus(draftStory.status)}`}</p>
            )}
          </div>
          <div className="sidebar-header__actions">
            <button
              className="mobile-sidebar-close"
              type="button"
              aria-label="Sidebar schließen"
              onClick={function () {
                setIsMobileSidebarOpen(false);
              }}
            >
              <span className="mini-icon mini-icon--close" />
            </button>
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
            className={"sidebar-tab" + (sidebarMode === "chat" ? " sidebar-tab--active" : "")}
            type="button"
            onClick={function () {
              setSidebarMode("chat");
            }}
          >
            Chat
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
              placeholder={
                sidebarMode === "library"
                  ? "Projekte suchen..."
                  : sidebarMode === "chat"
                    ? "Threads durchsuchen..."
                    : "Codex durchsuchen..."
              }
              value={
                sidebarMode === "library"
                  ? librarySearch
                  : sidebarMode === "chat"
                    ? assistantSearch
                    : codexSearch
              }
              onChange={function (event) {
                if (sidebarMode === "library") {
                  setLibrarySearch(event.target.value);
                  return;
                }

                if (sidebarMode === "chat") {
                  setAssistantSearch(event.target.value);
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
          ) : sidebarMode === "chat" ? (
            <button className="flat-button" type="button" onClick={handleCreateAssistantThread}>
              + Thread
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
          ) : sidebarMode === "chat" ? (
            <span className="square-button square-button--info" aria-hidden="true">
              {draftStory.assistant.threads.length}
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
                  {getLibraryProjectDetails(
                    draftStory.authorName,
                    activeLibraryEntry?.updatedAt ?? lastSavedAt ?? ""
                  ).summary}
                </span>
              </div>
              {libraryError ? <p className="sidebar-inline-error">{libraryError}</p> : null}
            </section>

            <div className="sidebar-library-list">
              {filteredLibraryStories.map(function (entry) {
                const isActive = entry.id === draftStory.id;
                const isDeleting = libraryActionId === `delete:${entry.id}`;
                const isOpening = libraryActionId === entry.id;
                const projectDetails = getLibraryProjectDetails(entry.authorName, entry.updatedAt);

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
                      <p>{projectDetails.subtitle}</p>
                      {projectDetails.meta ? (
                        <div className="project-row__meta">
                          <span>{projectDetails.meta}</span>
                        </div>
                      ) : null}
                    </button>
                    <button
                      className="project-row__delete"
                      type="button"
                      onClick={function () {
                        void handleDeleteProject(entry.id);
                      }}
                      disabled={isDeleting || libraryActionId === "create"}
                      title="Projekt dauerhaft löschen"
                    >
                      {isDeleting ? "..." : <span className="mini-icon mini-icon--trash" />}
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
        ) : sidebarMode === "chat" ? (
          <>
            <section className="sidebar-library-summary">
              <div className="sidebar-library-summary__card">
                <strong>{selectedAssistantThread?.title || "Neues Gespräch"}</strong>
                <span>
                  {selectedAssistantThread
                    ? `${selectedAssistantThread.messages.length} Nachrichten · ${
                        draftStory.assistant.artifacts.filter(function (artifact) {
                          return artifact.threadId === selectedAssistantThread.id;
                        }).length
                      } Dokumente`
                    : "Noch kein Thread aktiv"}
                </span>
              </div>
              {assistantError ? <p className="sidebar-inline-error">{assistantError}</p> : null}
            </section>

            <div className="sidebar-chat-section">
              <div className="sidebar-section-label">Threads</div>
              <div className="sidebar-codex-list">
                {filteredAssistantThreads.map(function (thread) {
                  return (
                    <button
                      key={thread.id}
                      className={
                        "codex-row" + (thread.id === selectedAssistantThreadId ? " codex-row--active" : "")
                      }
                      type="button"
                      onClick={function () {
                        setSelectedAssistantThreadId(thread.id);
                        const firstArtifact = draftStory.assistant.artifacts.find(function (artifact) {
                          return artifact.threadId === thread.id;
                        });
                        setSelectedAssistantArtifactId(firstArtifact?.id ?? "");
                      }}
                    >
                      <h3>{thread.title}</h3>
                      <p>{thread.summary || "Noch keine Assistant-Antwort."}</p>
                    </button>
                  );
                })}

                {!filteredAssistantThreads.length ? (
                  <article className="codex-row codex-row--empty">
                    <h3>Keine Treffer</h3>
                    <p>Die aktuelle Suche findet keinen Chat-Thread.</p>
                  </article>
                ) : null}
              </div>
            </div>

            <div className="sidebar-chat-section">
              <div className="sidebar-section-label">Dokumente</div>
              <div className="sidebar-codex-list">
                {draftStory.assistant.artifacts
                  .filter(function (artifact) {
                    return selectedAssistantThread ? artifact.threadId === selectedAssistantThread.id : true;
                  })
                  .slice()
                  .sort(function (left, right) {
                    return right.updatedAt.localeCompare(left.updatedAt);
                  })
                  .map(function (artifact) {
                    return (
                      <button
                        key={artifact.id}
                        className={
                          "codex-row" + (artifact.id === selectedAssistantArtifactId ? " codex-row--active" : "")
                        }
                        type="button"
                        onClick={function () {
                          setSelectedAssistantArtifactId(artifact.id);
                        }}
                      >
                        <h3>{artifact.title}</h3>
                        <p>{artifact.summary}</p>
                      </button>
                    );
                  })}

                {!draftStory.assistant.artifacts.filter(function (artifact) {
                  return selectedAssistantThread ? artifact.threadId === selectedAssistantThread.id : true;
                }).length ? (
                  <article className="codex-row codex-row--empty">
                    <h3>Noch keine Dokumente</h3>
                    <p>Stelle eine Frage im Modus `Regie`, um ein speicherbares Dokument zu erzeugen.</p>
                  </article>
                ) : null}
              </div>
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
            {footerStatus ? (
              <span className={"usage-pill usage-pill--" + footerStatus.tone}>
                {footerStatus.label}
              </span>
            ) : (
              <span className="usage-pill usage-pill--idle">Bereit</span>
            )}
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
      <button
        className="mobile-sidebar-backdrop"
        type="button"
        aria-label="Sidebar schließen"
        onClick={function () {
          setIsMobileSidebarOpen(false);
        }}
      />

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-sidebar-toggle"
              type="button"
              aria-label="Projektmenü öffnen"
              onClick={function () {
                setIsMobileSidebarOpen(true);
              }}
            >
              <span className="mini-icon mini-icon--menu" />
              <span>
                {sidebarMode === "library" ? "Projekte" : sidebarMode === "chat" ? "Chat" : "Codex"}
              </span>
            </button>

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

            {!isChatSidebar ? (
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
            ) : (
              <div className="pill-group" aria-label="Assistant Workspace">
                <span className="pill-button pill-button--active">Assistant</span>
              </div>
            )}

            {!isChatSidebar && authorMode === "plan" ? (
              <div className="pill-group pill-group--view" aria-label="Plan Layout">
                <button
                  className={
                    "pill-button" + (planLayoutMode === "split" ? " pill-button--active" : "")
                  }
                  onClick={function () {
                    setPlanLayoutMode("split");
                  }}
                  type="button"
                >
                  Split
                </button>
                <button
                  className={
                    "pill-button" + (planLayoutMode === "focus" ? " pill-button--active" : "")
                  }
                  onClick={function () {
                    setPlanLayoutMode("focus");
                  }}
                  type="button"
                >
                  Focus
                </button>
              </div>
            ) : null}

            {!isChatSidebar && authorMode !== "book" && !isPlanFocusMode ? (
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

            {!isChatSidebar && authorMode !== "book" && !isPlanFocusMode ? (
              <span className="filter-label">FILTER:</span>
            ) : null}

            {!isChatSidebar && authorMode !== "book" && !isPlanFocusMode ? (
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
              title={saveError ?? undefined}
            >
              {formatSaveState(lastSavedAt, saveState, saveError)}
            </span>
            {isBranchingStory(draftStory) ? (
              <Link href="/story" className="flat-button topbar-link">
                Story testen
              </Link>
            ) : null}
            <span className="view-toggle" aria-hidden="true">
              {isChatSidebar ? "Chat" : formatAuthorModeLabel(authorMode)}
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

          {isChatSidebar ? (
            <ChatWorkspace
              story={draftStory}
              selectedThread={selectedAssistantThread}
              selectedArtifactId={selectedAssistantArtifact?.id ?? null}
              selectedSceneContext={selectedSceneContext}
              isLoading={isAssistantLoading}
              error={assistantError}
              onSubmit={handleSubmitAssistantPrompt}
              onSelectArtifact={setSelectedAssistantArtifactId}
              onCreateThread={handleCreateAssistantThread}
              onUpdatePreferences={handleUpdateAssistantPreferences}
            />
          ) : authorMode === "book" ? (
            <BookWriterPanel
              story={draftStory}
              sceneContext={selectedSceneContext}
              selectedSceneId={selectedSceneId}
              saveLabel={formatSaveState(lastSavedAt, saveState, saveError)}
              onSelectScene={setSelectedSceneId}
              onManualSave={handleManualSave}
              onCreateFirstScene={handleCreateFirstScene}
              onAddAct={handleAddAct}
              onAddChapter={handleAddChapter}
              onAddScene={handleAddScene}
              onDeleteAct={handleDeleteAct}
              onDeleteChapter={handleDeleteChapter}
              onDeleteScene={handleDeleteScene}
              onUpdateScene={updateSelectedScene}
              onUpdateStory={function (updater) {
                updateBookDraftStory(updater, "book-writer-panel");
              }}
              onOpenBranchEditor={function () {
                setAuthorMode("write");
              }}
            />
          ) : authorMode === "plan" && planLayoutMode === "focus" ? (
            <div className="plan-focus-shell">
              <BookBlueprintPanel
                story={draftStory}
                selectedSceneId={selectedSceneId}
                onSelectScene={setSelectedSceneId}
                onUpdateStory={function (updater) {
                  updateBookDraftStory(updater, "book-blueprint-panel");
                }}
                layoutMode="focus"
              />
            </div>
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
                  onUpdateStory={function (updater) {
                    updateBookDraftStory(updater, "book-blueprint-panel");
                  }}
                  layoutMode="docked"
                />
              ) : authorMode === "playtest" ? (
                <PlaytestPanel story={draftStory} selectedSceneId={selectedSceneId} />
              ) : authorMode === "patch" ? (
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

function createAssistantContextSelectionFromSceneContext(
  sceneContext: SceneContext
): AssistantContextSelection {
  return createDefaultAssistantContextSelection("scene", {
    actId: sceneContext.act.id,
    chapterId: sceneContext.chapter.id,
    sceneId: sceneContext.scene.id
  });
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
    case "patch":
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
    case "patch":
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

function guardBookPanelStoryState(
  previousStory: StoryDocument,
  nextStory: StoryDocument,
  source: string
): StoryDocument {
  const restoredSegments: string[] = [];
  let guardedWorldBible = nextStory.worldBible;
  let guardedDraftJobs = nextStory.book.draftEngine.jobs;
  let guardedMemory = nextStory.book.memory;

  if (previousStory.worldBible.length > 0 && nextStory.worldBible.length === 0) {
    guardedWorldBible = previousStory.worldBible;
    restoredSegments.push("worldBible");
  }

  if (
    previousStory.book.draftEngine.jobs.length > 0 &&
    nextStory.book.draftEngine.jobs.length === 0
  ) {
    guardedDraftJobs = previousStory.book.draftEngine.jobs;
    restoredSegments.push("draftJobs");
  }

  if (
    previousStory.book.memory.canonLedger.length > 0 &&
    nextStory.book.memory.canonLedger.length === 0
  ) {
    guardedMemory = {
      ...guardedMemory,
      canonLedger: previousStory.book.memory.canonLedger
    };
    restoredSegments.push("canonLedger");
  }

  if (
    previousStory.book.memory.characterLedger.length > 0 &&
    nextStory.book.memory.characterLedger.length === 0
  ) {
    guardedMemory = {
      ...guardedMemory,
      characterLedger: previousStory.book.memory.characterLedger
    };
    restoredSegments.push("characterLedger");
  }

  if (
    previousStory.book.memory.openThreads.length > 0 &&
    nextStory.book.memory.openThreads.length === 0
  ) {
    guardedMemory = {
      ...guardedMemory,
      openThreads: previousStory.book.memory.openThreads
    };
    restoredSegments.push("openThreads");
  }

  if (
    previousStory.book.memory.sceneCards.length > 0 &&
    nextStory.book.memory.sceneCards.length === 0
  ) {
    guardedMemory = {
      ...guardedMemory,
      sceneCards: previousStory.book.memory.sceneCards
    };
    restoredSegments.push("sceneCards");
  }

  if (
    previousStory.book.memory.contextPacks.length > 0 &&
    nextStory.book.memory.contextPacks.length === 0
  ) {
    guardedMemory = {
      ...guardedMemory,
      contextPacks: previousStory.book.memory.contextPacks
    };
    restoredSegments.push("contextPacks");
  }

  if (
    previousStory.book.memory.continuityNotes.length > 0 &&
    nextStory.book.memory.continuityNotes.length === 0
  ) {
    guardedMemory = {
      ...guardedMemory,
      continuityNotes: previousStory.book.memory.continuityNotes
    };
    restoredSegments.push("continuityNotes");
  }

  if (!restoredSegments.length) {
    return nextStory;
  }

  console.warn("[EMBER] Prevented suspicious book-state drop during local update.", {
    source,
    storyId: nextStory.id,
    restoredSegments,
    previousCounts: {
      worldBible: previousStory.worldBible.length,
      draftJobs: previousStory.book.draftEngine.jobs.length,
      canonLedger: previousStory.book.memory.canonLedger.length,
      characterLedger: previousStory.book.memory.characterLedger.length,
      openThreads: previousStory.book.memory.openThreads.length,
      sceneCards: previousStory.book.memory.sceneCards.length,
      contextPacks: previousStory.book.memory.contextPacks.length
    },
    nextCounts: {
      worldBible: nextStory.worldBible.length,
      draftJobs: nextStory.book.draftEngine.jobs.length,
      canonLedger: nextStory.book.memory.canonLedger.length,
      characterLedger: nextStory.book.memory.characterLedger.length,
      openThreads: nextStory.book.memory.openThreads.length,
      sceneCards: nextStory.book.memory.sceneCards.length,
      contextPacks: nextStory.book.memory.contextPacks.length
    }
  });

  return {
    ...nextStory,
    worldBible: guardedWorldBible,
    book: {
      ...nextStory.book,
      draftEngine: {
        ...nextStory.book.draftEngine,
        jobs: guardedDraftJobs
      },
      memory: guardedMemory
    }
  };
}

async function persistStudioStoryRemote(draftStory: StoryDocument) {
  const response = await fetch(`/api/stories/${draftStory.id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(draftStory)
  });
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      payload && typeof payload.error === "string" ? payload.error : "Remote saving failed."
    );
  }

  return {
    story: payload?.story as StoryDocument,
    savedAt:
      typeof payload?.savedAt === "string" ? payload.savedAt : new Date().toISOString()
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

async function readJsonResponse(response: Response) {
  const raw = await response.text();

  if (!raw.trim()) {
    return null;
  }

  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {
      error: raw.trim()
    };
  }
}

function formatSaveState(lastSavedAt: string | null, saveState: SaveState, saveError?: string | null) {
  if (saveState === "saving") {
    return "Speichert nach Supabase...";
  }

  if (saveState === "error") {
    return saveError ? `Supabase-Fehler: ${saveError}` : "Supabase-Speichern fehlgeschlagen";
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

function getLibraryProjectDetails(authorName?: string | null, updatedAt?: string) {
  const normalizedAuthor = authorName?.trim();
  const formattedTimestamp = formatLibraryTimestamp(updatedAt || "");
  const hasTimestamp = formattedTimestamp !== "ohne Datum";

  return {
    summary: [normalizedAuthor, hasTimestamp ? formattedTimestamp : null].filter(Boolean).join(" · ") || "Ohne Autor",
    subtitle: normalizedAuthor || (hasTimestamp ? formattedTimestamp : "Ohne Autor"),
    meta: normalizedAuthor && hasTimestamp ? formattedTimestamp : null
  };
}

function formatFooterStatus(mode: StoryDocument["book"]["draftEngine"]["jobs"][number]["mode"]) {
  if (mode === "remote") {
    return {
      label: "Remote",
      tone: "remote"
    };
  }

  return {
    label: "Lokal",
    tone: "local"
  };
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
    assistant: normalizeAssistantWorkspace(value.assistant),
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
  const normalizedDraftTargets = normalizeBookDraftTargets(
    typeof candidate.draftEngine?.targetSceneWordsMin === "number"
      ? candidate.draftEngine.targetSceneWordsMin
      : fallback.draftEngine.targetSceneWordsMin,
    typeof candidate.draftEngine?.targetSceneWordsMax === "number"
      ? candidate.draftEngine.targetSceneWordsMax
      : fallback.draftEngine.targetSceneWordsMax
  );

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
      targetSceneWordsMin: normalizedDraftTargets.targetSceneWordsMin,
      targetSceneWordsMax: normalizedDraftTargets.targetSceneWordsMax,
      styleProfileVersion:
        typeof candidate.draftEngine?.styleProfileVersion === "string" &&
        candidate.draftEngine.styleProfileVersion.trim()
          ? candidate.draftEngine.styleProfileVersion
          : fallback.draftEngine.styleProfileVersion,
      marketProfileVersion:
        typeof candidate.draftEngine?.marketProfileVersion === "string" &&
        candidate.draftEngine.marketProfileVersion.trim()
          ? candidate.draftEngine.marketProfileVersion
          : fallback.draftEngine.marketProfileVersion,
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
      Array.isArray(candidate.characterLedger)
        ? candidate.characterLedger.map(function (entry) {
            if (!entry || typeof entry !== "object") {
              return entry;
            }

            const record = entry as {
              snapshots?: unknown;
            };

            return {
              ...entry,
              snapshots: Array.isArray(record.snapshots) && record.snapshots.length
                ? record.snapshots
                    .filter(function (snapshot): snapshot is Record<string, unknown> {
                      return Boolean(snapshot) && typeof snapshot === "object";
                    })
                    .map(function (snapshot, index) {
                      return {
                        id: typeof snapshot.id === "string" ? snapshot.id : `snapshot_${index + 1}`,
                        scope:
                          snapshot.scope === "baseline" ||
                          snapshot.scope === "scene" ||
                          snapshot.scope === "chapter"
                            ? snapshot.scope
                            : "scene",
                        sortOrder:
                          typeof snapshot.sortOrder === "number" ? snapshot.sortOrder : index + 1,
                        sourceSceneId:
                          typeof snapshot.sourceSceneId === "string"
                            ? snapshot.sourceSceneId
                            : null,
                        sourceChapterId:
                          typeof snapshot.sourceChapterId === "string"
                            ? snapshot.sourceChapterId
                            : null,
                        sourceLabel:
                          typeof snapshot.sourceLabel === "string" ? snapshot.sourceLabel : "",
                        currentState:
                          typeof snapshot.currentState === "string" ? snapshot.currentState : "",
                        innerShift:
                          typeof snapshot.innerShift === "string" ? snapshot.innerShift : "",
                        agenda: typeof snapshot.agenda === "string" ? snapshot.agenda : "",
                        capturedAt:
                          typeof snapshot.capturedAt === "string" ? snapshot.capturedAt : ""
                      };
                    })
                : [
                    {
                      id:
                        typeof (entry as { id?: unknown }).id === "string"
                          ? `${(entry as { id: string }).id}_baseline`
                          : "snapshot_1",
                      scope: "baseline" as const,
                      sortOrder: 0,
                      sourceSceneId:
                        typeof (entry as { updatedFromSceneId?: unknown }).updatedFromSceneId === "string"
                          ? ((entry as { updatedFromSceneId: string }).updatedFromSceneId || null)
                          : null,
                      sourceChapterId: null,
                      sourceLabel: "Legacy Snapshot",
                      currentState:
                        typeof (entry as { currentState?: unknown }).currentState === "string"
                          ? (entry as { currentState: string }).currentState
                          : "",
                      innerShift:
                        typeof (entry as { innerShift?: unknown }).innerShift === "string"
                          ? (entry as { innerShift: string }).innerShift
                          : "",
                      agenda:
                        typeof (entry as { agenda?: unknown }).agenda === "string"
                          ? (entry as { agenda: string }).agenda
                          : "",
                      capturedAt:
                        typeof (entry as { updatedAt?: unknown }).updatedAt === "string"
                          ? (entry as { updatedAt: string }).updatedAt
                          : ""
                    }
                  ]
            };
          })
        : fallback.characterLedger,
    openThreads: Array.isArray(candidate.openThreads) ? candidate.openThreads : fallback.openThreads,
    sceneCards: Array.isArray(candidate.sceneCards)
      ? candidate.sceneCards.map(function (sceneCard) {
          if (!sceneCard || typeof sceneCard !== "object") {
            return sceneCard;
          }

          const record = sceneCard as {
            outline?: unknown;
          };

          return {
            ...sceneCard,
            outline:
              Array.isArray(record.outline) && record.outline.every(function (entry) {
                return typeof entry === "string";
              })
                ? record.outline
                : []
          };
        })
      : fallback.sceneCards,
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

"use client";

import { useEffect, useMemo, useState } from "react";
import { BookJobModelFields } from "@/components/studio/book-job-model-fields";
import { BookStateDiffReview } from "@/components/studio/book-state-diff-review";
import {
  analyzeBookDraftReadiness,
  acceptDraftJobToScene,
  BOOK_DRAFT_STAGE_SEQUENCE,
  buildAmazonLaunchPackage,
  buildCanonLedger,
  buildCharacterLedger,
  approveBookStateDiffItem,
  buildOpenThreads,
  buildSceneContextPacket,
  buildTimelineBeats,
  getDraftJobAcceptanceBlockers,
  getDraftJobsForScene,
  rejectBookStateDiffItem,
  updateDraftJobMemorySyncKindStatus,
  updateDraftJobMemorySyncStatus,
  upsertDraftJob,
  type BookStateDiffItemKind,
  type BookReviewQueueItem
} from "@/lib/book-engine";
import {
  BOOK_JOB_MODEL_STORAGE_KEY,
  BOOK_JOB_PROVIDER_STORAGE_KEY,
  buildBookJobModelOverrides,
  createEmptyBookJobModelSelection,
  isBookJobProviderOption,
  parseBookJobModelSelection,
  type BookJobModelKey,
  type BookJobProviderOption
} from "@/lib/book-job-models";
import {
  BOOK_ENGINE_MODE_OPTIONS,
  formatBookEngineModeLabel,
  isBookEngineMode
} from "@/lib/book-engine-modes";
import {
  approveBookStateDiff,
  rejectBookStateDiff
} from "@/lib/book-state-validator";
import {
  analyzeBookDraftPreparation,
  countStoryStats,
  isBranchingStory,
  normalizeBookDraftTargets,
  type DraftMemorySyncItem,
  type DraftMemorySyncItemKind,
  type BookDraftJob,
  type StoryChapter,
  type StoryDocument
} from "@/lib/story-schema";

export function BookBlueprintPanel({
  story,
  selectedSceneId,
  onSelectScene,
  onUpdateStory,
  layoutMode = "docked"
}: {
  story: StoryDocument;
  selectedSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onUpdateStory: (updater: (story: StoryDocument) => StoryDocument) => void;
  layoutMode?: "docked" | "focus";
}) {
  const stats = useMemo(function () {
    return countStoryStats(story);
  }, [story]);
  const canonLedger = useMemo(function () {
    return buildCanonLedger(story);
  }, [story]);
  const characterLedger = useMemo(function () {
    return buildCharacterLedger(story);
  }, [story]);
  const timeline = useMemo(function () {
    return buildTimelineBeats(story);
  }, [story]);
  const openThreads = useMemo(function () {
    return buildOpenThreads(story);
  }, [story]);
  const contextPacket = useMemo(function () {
    return buildSceneContextPacket(story, selectedSceneId);
  }, [selectedSceneId, story]);
  const normalizedDraftTargets = useMemo(function () {
    return normalizeBookDraftTargets(
      story.book.draftEngine.targetSceneWordsMin,
      story.book.draftEngine.targetSceneWordsMax
    );
  }, [story.book.draftEngine.targetSceneWordsMax, story.book.draftEngine.targetSceneWordsMin]);
  const draftPreparationIssues = useMemo(function () {
    if (!selectedSceneId) {
      return [];
    }

    return analyzeBookDraftPreparation(
      story,
      selectedSceneId,
      story.book.draftEngine.targetSceneWordsMin,
      story.book.draftEngine.targetSceneWordsMax
    );
  }, [
    selectedSceneId,
    story,
    story.book.draftEngine.targetSceneWordsMax,
    story.book.draftEngine.targetSceneWordsMin
  ]);
  const blockingDraftPreparationIssues = draftPreparationIssues.filter(function (issue) {
    return issue.level === "blocking";
  });
  const warningDraftPreparationIssues = draftPreparationIssues.filter(function (issue) {
    return issue.level === "warning";
  });
  const draftJobs = useMemo(function () {
    return selectedSceneId ? getDraftJobsForScene(story, selectedSceneId) : [];
  }, [selectedSceneId, story]);
  const memorySyncJobs = useMemo(function () {
    return story.book.draftEngine.jobs.filter(function (job) {
      return job.extractedState.memorySync.items.length > 0;
    });
  }, [story]);
  const memorySyncCounts = useMemo(function () {
    return story.book.draftEngine.jobs.reduce(
      function (acc, job) {
        job.extractedState.memorySync.items.forEach(function (item) {
          acc.total += 1;
          acc[item.status] += 1;
        });

        return acc;
      },
      {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      }
    );
  }, [story]);
  const draftAudit = useMemo(function () {
    return analyzeBookDraftReadiness(story);
  }, [story]);
  const launchPackage = useMemo(function () {
    return buildAmazonLaunchPackage(story);
  }, [story]);
  const [jobProvider, setJobProvider] = useState<BookJobProviderOption>("auto");
  const [jobModels, setJobModels] = useState(createEmptyBookJobModelSelection);
  const [jobStatus, setJobStatus] = useState<string>("");
  const [isGeneratingJob, setIsGeneratingJob] = useState(false);

  useEffect(function () {
    const storedProvider = window.localStorage.getItem(BOOK_JOB_PROVIDER_STORAGE_KEY);

    if (storedProvider && isBookJobProviderOption(storedProvider)) {
      setJobProvider(storedProvider);
    }

    setJobModels(
      parseBookJobModelSelection(window.localStorage.getItem(BOOK_JOB_MODEL_STORAGE_KEY))
    );
  }, []);

  useEffect(
    function () {
      window.localStorage.setItem(BOOK_JOB_PROVIDER_STORAGE_KEY, jobProvider);
    },
    [jobProvider]
  );

  useEffect(
    function () {
      window.localStorage.setItem(BOOK_JOB_MODEL_STORAGE_KEY, JSON.stringify(jobModels));
    },
    [jobModels]
  );

  const chapters = useMemo(function () {
    return story.acts.flatMap(function (act) {
      return act.chapters.map(function (chapter) {
        return {
          ...chapter,
          actTitle: act.title
        };
      });
    });
  }, [story.acts]);

  function handleModelChange(key: BookJobModelKey, value: string) {
    setJobModels(function (currentModels) {
      return {
        ...currentModels,
        [key]: value
      };
    });
  }

  function handleModelReset(key: BookJobModelKey) {
    setJobModels(function (currentModels) {
      return {
        ...currentModels,
        [key]: ""
      };
    });
  }

  return (
    <aside
      className={"book-panel" + (layoutMode === "focus" ? " book-panel--focus" : "")}
      aria-label="Book Blueprint Panel"
    >
      <div className="book-panel__header">
        <div>
          <span className="scene-editor__eyebrow">Book Engine</span>
          <h3>{formatPhaseLabel(story.book.activePhase)}</h3>
          <p>
            Der Buch-Track lebt innerhalb der Ember-Struktur: Master Brief, Memory Backbone
            und Context Composer steuern dieselben Acts, Kapitel und Szenen.
          </p>
        </div>
        <div className="book-panel__pills">
          <span className="scene-editor__pill">{story.book.activePhase}</span>
          <span className="scene-editor__pill">{story.book.targetFormat}</span>
          <span className="scene-editor__pill">
            {story.book.targetLengthWords.toLocaleString("de-DE")} Woerter
          </span>
        </div>
      </div>

      <div className="book-panel__content">
        <section className="book-card book-card--hero">
          <div className="book-card__head">
            <div>
              <span className="book-card__label">Blueprint Status</span>
              <h4>{story.title || "Untitled Book"}</h4>
            </div>
            <div className="book-card__meta">
              <span>{story.book.priority === "primary" ? "Prioritaet hoch" : "Neben-Track"}</span>
              <span>{stats.chapterCount} Kapitel</span>
              <span>{stats.sceneCount} Szenen</span>
            </div>
          </div>

          <div className="book-engine-control">
            <label className="editor-field">
              <span>Book Engine</span>
              <select
                className="editor-input editor-select"
                value={story.book.engineMode}
                onChange={function (event) {
                  const nextMode = event.target.value;

                  if (!isBookEngineMode(nextMode)) {
                    return;
                  }

                  onUpdateStory(function (currentStory) {
                    return {
                      ...currentStory,
                      book: {
                        ...currentStory.book,
                        engineMode: nextMode
                      }
                    };
                  });
                }}
              >
                {BOOK_ENGINE_MODE_OPTIONS.map(function (option) {
                  return (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          <div className="book-metrics">
            <Metric label="Acts" value={stats.actCount} />
            <Metric label="Kapitel" value={stats.chapterCount} />
            <Metric label="Szenen" value={stats.sceneCount} />
            <Metric label="Engine" value={formatBookEngineModeLabel(story.book.engineMode)} />
            <Metric label="Modus" value={story.mode === "book" ? "Buch" : "Branching"} />
            <Metric label="Woerter" value={stats.wordCount.toLocaleString("de-DE")} />
          </div>
        </section>

        <section className="book-card">
          <div className="book-card__head">
            <div>
              <span className="book-card__label">Phase Control</span>
              <h4>Foundation und Memory Backbone im selben Datenmodell</h4>
            </div>
          </div>

          <div className="book-phase-switch">
            {PHASES.map(function (phase) {
              return (
                <button
                  key={phase.id}
                  className={
                    "flat-button" +
                    (story.book.activePhase === phase.id ? " flat-button--active" : "")
                  }
                  type="button"
                  onClick={function () {
                    onUpdateStory(function (currentStory) {
                      return {
                        ...currentStory,
                        book: {
                          ...currentStory.book,
                          activePhase: phase.id
                        }
                      };
                    });
                  }}
                >
                  {phase.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="book-card">
          <div className="book-card__head">
            <div>
              <span className="book-card__label">Master Brief</span>
              <h4>Produktkern und Leser-Versprechen</h4>
            </div>
          </div>

          <div className="editor-grid">
            <label className="editor-field">
              <span>Titel</span>
              <input
                className="editor-input"
                type="text"
                value={story.title}
                onChange={function (event) {
                  onUpdateStory(function (currentStory) {
                    return {
                      ...currentStory,
                      title: event.target.value
                    };
                  });
                }}
              />
            </label>

            <label className="editor-field">
              <span>Autor</span>
              <input
                className="editor-input"
                type="text"
                value={story.authorName}
                onChange={function (event) {
                  onUpdateStory(function (currentStory) {
                    return {
                      ...currentStory,
                      authorName: event.target.value
                    };
                  });
                }}
              />
            </label>

            <label className="editor-field">
              <span>Format</span>
              <select
                className="editor-input editor-select"
                value={story.book.targetFormat}
                onChange={function (event) {
                  onUpdateStory(function (currentStory) {
                    return {
                      ...currentStory,
                      book: {
                        ...currentStory.book,
                        targetFormat: event.target.value as StoryDocument["book"]["targetFormat"]
                      }
                    };
                  });
                }}
              >
                <option value="novella">Novella</option>
                <option value="novel">Novel</option>
                <option value="series">Series</option>
              </select>
            </label>

            <label className="editor-field">
              <span>Zielumfang</span>
              <input
                className="editor-input"
                type="number"
                min={10000}
                step={5000}
                value={story.book.targetLengthWords}
                onChange={function (event) {
                  const nextValue = Number(event.target.value) || 0;

                  onUpdateStory(function (currentStory) {
                    return {
                      ...currentStory,
                      book: {
                        ...currentStory.book,
                        targetLengthWords: nextValue
                      }
                    };
                  });
                }}
              />
            </label>
          </div>

          <label className="editor-field" title="Der Kern der Geschichte in 1-2 Sätzen. Wer ist der Held, was ist das Problem und was steht auf dem Spiel?">
            <span>Praemisse</span>
            <textarea
              className="editor-textarea"
              value={story.book.masterBrief.premise}
              onChange={function (event) {
                updateMasterBrief(onUpdateStory, story, "premise", event.target.value);
              }}
            />
          </label>

          <label className="editor-field" title="Das emotionale Versprechen an den Leser. Welches Genre-Gefuehl und welche Erwartung werden garantiert?">
            <span>Reader Promise</span>
            <textarea
              className="editor-textarea"
              value={story.book.masterBrief.readerPromise}
              onChange={function (event) {
                updateMasterBrief(onUpdateStory, story, "readerPromise", event.target.value);
              }}
            />
          </label>

          <div className="editor-grid">
            <label className="editor-field" title="Wie wird der Leser entlassen? (Z.B. 'Gerechtigkeit siegt, aber mit einem bitteren Beigeschmack').">
              <span>Ending Promise</span>
              <textarea
                className="editor-textarea"
                value={story.book.masterBrief.endingPromise}
                onChange={function (event) {
                  updateMasterBrief(onUpdateStory, story, "endingPromise", event.target.value);
                }}
              />
            </label>

            <label className="editor-field" title="Worauf will die Story wirklich hinaus? (Z.B. 'Die Kosten von blinder Loyalität').">
              <span>Thematic Core</span>
              <textarea
                className="editor-textarea"
                value={story.book.masterBrief.thematicCore}
                onChange={function (event) {
                  updateMasterBrief(onUpdateStory, story, "thematicCore", event.target.value);
                }}
              />
            </label>
          </div>

          <label className="editor-field" title="Langfristige Autorenabsicht: Was soll dieses Buch bleiben, auch wenn einzelne Szenen neu gedraftet werden?">
            <span>Author Intent</span>
            <textarea
              className="editor-textarea"
              value={story.book.masterBrief.authorIntent}
              onChange={function (event) {
                updateMasterBrief(onUpdateStory, story, "authorIntent", event.target.value);
              }}
            />
          </label>

          <label className="editor-field" title="Kurzfristiger Fokus fuer die naechsten 1-3 Szenen. Weiche Steuerung, kein harter Szenenbefehl.">
            <span>Current Focus</span>
            <textarea
              className="editor-textarea"
              value={story.book.masterBrief.currentFocus}
              onChange={function (event) {
                updateMasterBrief(onUpdateStory, story, "currentFocus", event.target.value);
              }}
            />
          </label>

          <EditableStringListSection
            label="Architecture Guide"
            title="Strukturanker fuer Plot und Figurenbogen"
            items={story.book.masterBrief.storyArchitecture}
            onUpdate={function (nextItems) {
              onUpdateStory(function (currentStory) {
                return {
                  ...currentStory,
                  book: {
                    ...currentStory.book,
                    masterBrief: {
                      ...currentStory.book.masterBrief,
                      storyArchitecture: nextItems
                    }
                  }
                };
              });
            }}
          />
        </section>

        <section className="book-card">
          <div className="book-card__head">
            <div>
              <span className="book-card__label">Market Brief</span>
              <h4>Positionierung ohne die Story-Struktur zu verlassen</h4>
            </div>
          </div>

          <label className="editor-field">
            <span>Amazon Goal</span>
            <textarea
              className="editor-textarea"
              value={story.book.marketBrief.amazonGoal}
              onChange={function (event) {
                updateMarketBrief(onUpdateStory, "amazonGoal", event.target.value);
              }}
            />
          </label>

          <div className="editor-grid">
            <label className="editor-field">
              <span>Category Lane</span>
              <input
                className="editor-input"
                type="text"
                value={story.book.marketBrief.categoryLane}
                onChange={function (event) {
                  updateMarketBrief(onUpdateStory, "categoryLane", event.target.value);
                }}
              />
            </label>

            <label className="editor-field">
              <span>Commercial Hook</span>
              <input
                className="editor-input"
                type="text"
                value={story.book.marketBrief.hook}
                onChange={function (event) {
                  updateMarketBrief(onUpdateStory, "hook", event.target.value);
                }}
              />
            </label>
          </div>

          <div className="editor-grid">
            <label className="editor-field">
              <span>Series Potential</span>
              <textarea
                className="editor-textarea"
                value={story.book.marketBrief.seriesPotential}
                onChange={function (event) {
                  updateMarketBrief(onUpdateStory, "seriesPotential", event.target.value);
                }}
              />
            </label>

            <label className="editor-field">
              <span>Cover Direction</span>
              <textarea
                className="editor-textarea"
                value={story.book.marketBrief.coverDirection}
                onChange={function (event) {
                  updateMarketBrief(onUpdateStory, "coverDirection", event.target.value);
                }}
              />
            </label>
          </div>

          <EditableStringListSection
            label="Publishing Guardrails"
            title="Markt- und Qualitaetsregeln fuer Packaging und Lesbarkeit"
            items={story.book.marketBrief.publishingGuardrails}
            onUpdate={function (nextItems) {
              onUpdateStory(function (currentStory) {
                return {
                  ...currentStory,
                  book: {
                    ...currentStory.book,
                    marketBrief: {
                      ...currentStory.book.marketBrief,
                      publishingGuardrails: nextItems
                    }
                  }
                };
              });
            }}
          />
        </section>

        <section className="book-card">
          <div className="book-card__head">
            <div>
              <span className="book-card__label">Memory Sync Queue</span>
              <h4>Extrahierte Facts und Character-Shifts bewusst freigeben</h4>
            </div>
          </div>

          <div className="book-metrics">
            <Metric label="Pending" value={memorySyncCounts.pending} />
            <Metric label="Approved" value={memorySyncCounts.approved} />
            <Metric label="Rejected" value={memorySyncCounts.rejected} />
            <Metric label="Total Extracts" value={memorySyncCounts.total} />
          </div>

          {memorySyncJobs.length ? (
            <div className="book-job-list">
              {memorySyncJobs.map(function (job) {
                return (
                  <MemorySyncJobCard
                    key={`memory_sync_${job.id}`}
                    job={job}
                    onUpdateStory={onUpdateStory}
                  />
                );
              })}
            </div>
          ) : (
            <article className="book-thread-card book-thread-card--empty">
              <strong>Keine Memory-Sync-Items vorhanden</strong>
              <p>
                Neue Canon-Facts, Foreshadowing-Hinweise und Character-Shifts landen hier,
                sobald ein Draft-Job Extract-Daten liefert.
              </p>
            </article>
          )}
        </section>

        <section className="book-card">
          <div className="book-card__head">
            <div>
              <span className="book-card__label">Memory Backbone</span>
              <h4>Canon Ledger, Timeline und offene Threads</h4>
            </div>
          </div>

          <div className="book-metrics">
            <Metric label="Codex" value={canonLedger.length} />
            <Metric label="Character States" value={characterLedger.length} />
            <Metric
              label="Aktive Threads"
              value={
                openThreads.filter(function (thread) {
                  return thread.status === "active";
                }).length
              }
            />
            <Metric label="Timeline Beats" value={timeline.length} />
            <Metric
              label="Context Packs"
              value={story.book.memory.contextPacks.length}
            />
          </div>

          <div className="book-context-grid">
            <div className="book-context-stack">
              <strong>Canon Ledger</strong>
              <div className="book-ledger-list">
                {canonLedger.map(function (entry) {
                  return (
                    <article key={entry.entryId} className="book-ledger-card">
                      <div className="book-ledger-card__head">
                        <strong>{entry.title}</strong>
                        <span>{entry.kind}</span>
                      </div>
                      <p>{entry.summary || "Kein Summary hinterlegt."}</p>
                      <div className="book-card__meta">
                        <span>{entry.mentionCount} Szenen</span>
                        <span>{entry.importance}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="book-context-stack">
              <strong>Character Ledger</strong>
              <div className="book-thread-list">
                {characterLedger.length ? (
                  characterLedger.map(function (entry) {
                    const latestSnapshot = entry.snapshots[entry.snapshots.length - 1] ?? null;

                    return (
                      <article key={entry.id} className="book-thread-card">
                        <div className="book-thread-card__head">
                          <strong>{entry.characterName}</strong>
                          <span>{entry.updatedFromSceneId || "global"}</span>
                        </div>
                        <p>{entry.currentState}</p>
                        <span className="book-thread-card__meta">
                          {entry.innerShift}
                          {latestSnapshot
                            ? ` · ${formatCharacterSnapshotLabel(latestSnapshot)} · ${entry.snapshots.length} Snapshots`
                            : ""}
                        </span>
                      </article>
                    );
                  })
                ) : (
                  <article className="book-thread-card book-thread-card--empty">
                    <strong>Keine Character States synchronisiert</strong>
                    <p>Der Memory-Backbone hat aktuell noch keine extrahierten Figurenzustaende.</p>
                  </article>
                )}
              </div>

              <strong>Open Threads</strong>
              <div className="book-thread-list">
                {openThreads.length ? (
                  openThreads.map(function (thread) {
                    return (
                      <article key={thread.id} className="book-thread-card">
                        <div className="book-thread-card__head">
                          <strong>{thread.label}</strong>
                          <span>{thread.status}</span>
                        </div>
                        <p>{thread.detail}</p>
                        <span className="book-thread-card__meta">
                          Quelle: {thread.sourceSceneTitle}
                        </span>
                      </article>
                    );
                  })
                ) : (
                  <article className="book-thread-card book-thread-card--empty">
                    <strong>Keine offenen Threads erkannt</strong>
                    <p>
                      Der lokale Heuristik-Layer sieht aktuell keine markanten offenen Fragen
                      {isBranchingStory(story) ? " oder Branching-Folgen." : "."}
                    </p>
                  </article>
                )}
              </div>
            </div>

            <div className="book-context-stack">
              <strong>Persistenz</strong>
              <div className="book-mini-list">
                <article className="book-mini-card">
                  <strong>Letzte Synchronisation</strong>
                  <p>{formatTimestamp(story.book.memory.lastSyncedAt)}</p>
                </article>
                <article className="book-mini-card">
                  <strong>Vorbereitete Packs</strong>
                  <p>{story.book.memory.contextPacks.length}</p>
                </article>
                <article className="book-mini-card">
                  <strong>Continuity Notes</strong>
                  <p>{story.book.memory.continuityNotes.length}</p>
                </article>
              </div>
            </div>

          </div>
        </section>

        <section className="book-card">
          <div className="book-card__head">
            <div>
              <span className="book-card__label">Scene Context Composer</span>
              <h4>Gezielter Prompt-Kontext statt Volltext-Ladung</h4>
            </div>
          </div>

          {contextPacket ? (
            <div className="book-context-grid">
              <div className="book-context-stack">
                <strong>Aktuelle Szene</strong>
                <div className="book-ledger-card">
                  <div className="book-ledger-card__head">
                    <strong>{contextPacket.dynamicContext.sceneTitle}</strong>
                    <span>{contextPacket.dynamicContext.chapterTitle}</span>
                  </div>
                  <p>{contextPacket.dynamicContext.sceneSummary || "Keine Summary hinterlegt."}</p>
                  <span className="book-thread-card__meta">
                    {contextPacket.dynamicContext.actTitle} · Pack{" "}
                    {contextPacket.dynamicContext.contextPackId || "ohne ID"}
                  </span>
                </div>

                <strong>Scene-Card Direktiven</strong>
                <div className="book-mini-list">
                  {contextPacket.dynamicContext.sceneCardOutline.length ? (
                    contextPacket.dynamicContext.sceneCardOutline.map(function (step, index) {
                      return (
                        <article key={`${contextPacket.sceneId}_outline_${index}`} className="book-mini-card">
                          <strong>{formatSceneCardDirectiveLabel(step, index)}</strong>
                          <p>{step}</p>
                        </article>
                      );
                    })
                  ) : (
                    <article className="book-mini-card">
                      <strong>Keine Scene-Card Direktiven vorhanden</strong>
                      <p>Die Scene Card wird aktuell aus Summary, Excerpt und Kapitelziel abgeleitet.</p>
                    </article>
                  )}
                </div>

                <strong>Vorher</strong>
                <div className="book-mini-list">
                  {contextPacket.dynamicContext.previousBeats.length ? (
                    contextPacket.dynamicContext.previousBeats.map(function (beat) {
                      return (
                        <article key={beat.sceneId} className="book-mini-card">
                          <strong>{beat.sceneTitle}</strong>
                          <p>{beat.summary || beat.excerpt || "Kein Kontext."}</p>
                        </article>
                      );
                    })
                  ) : (
                    <article className="book-mini-card">
                      <strong>Keine vorherigen Beats</strong>
                    </article>
                  )}
                </div>

                <strong>Danach</strong>
                {contextPacket.dynamicContext.nextBeatTitle ? (
                  <article className="book-mini-card">
                    <strong>{contextPacket.dynamicContext.nextBeatTitle}</strong>
                  </article>
                ) : (
                  <article className="book-mini-card">
                    <strong>Kein Folge-Beat vorhanden</strong>
                  </article>
                )}
              </div>

              <div className="book-context-stack">
                <strong>Relevanter Codex</strong>
                <div className="book-mini-list">
                  {contextPacket.dynamicContext.relevantCodex.map(function (entry) {
                    return (
                      <article key={entry.entryId} className="book-mini-card">
                        <strong>{entry.title}</strong>
                        <p>{entry.summary || "Kein Summary hinterlegt."}</p>
                      </article>
                    );
                  })}
                </div>

                <strong>Relevante Character States</strong>
                <div className="book-mini-list">
                  {contextPacket.dynamicContext.relevantCharacterStates.length ? (
                    contextPacket.dynamicContext.relevantCharacterStates.map(function (entry) {
                      const recentSnapshots = entry.snapshots.slice(-2);

                      return (
                        <article key={entry.id} className="book-mini-card">
                          <strong>{entry.characterName}</strong>
                          <p>{entry.currentState}</p>
                          <span className="book-thread-card__meta">
                            {recentSnapshots.map(function (snapshot) {
                              return formatCharacterSnapshotLabel(snapshot);
                            }).join(" | ") || "Kein Snapshot-Verlauf"}
                          </span>
                        </article>
                      );
                    })
                  ) : (
                    <article className="book-mini-card">
                      <strong>Keine Character States im Pack</strong>
                    </article>
                  )}
                </div>

                <strong>Aktive Threads fuer den Job</strong>
                <div className="book-mini-list">
                  {contextPacket.dynamicContext.activeThreads.length ? (
                    contextPacket.dynamicContext.activeThreads.map(function (thread) {
                      return (
                        <article key={thread.id} className="book-mini-card">
                          <strong>{thread.label}</strong>
                          <p>{thread.detail}</p>
                        </article>
                      );
                    })
                  ) : (
                    <article className="book-mini-card">
                      <strong>Keine Thread-Hinweise</strong>
                    </article>
                  )}
                </div>

                <strong>Extractor Template</strong>
                <pre className="book-code-block">
                  {JSON.stringify(contextPacket.extractorTemplate, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <article className="book-thread-card book-thread-card--empty">
              <strong>Keine Szene ausgewaehlt</strong>
              <p>Waehle links eine Szene, um den komponierten Kontext zu sehen.</p>
            </article>
          )}
        </section>

        <section className="book-card">
          <div className="book-card__head">
            <div>
              <span className="book-card__label">Amazon Ops</span>
              <h4>KDP-Metadaten und Launch-Paket im Projektzustand</h4>
            </div>
            <div className="book-card__actions">
              <button
                className="flat-button"
                type="button"
                onClick={function () {
                  exportStoryAsMarkdown(story);
                }}
              >
                Manuskript Markdown
              </button>
              <button
                className="flat-button"
                type="button"
                onClick={function () {
                  exportLaunchPackage(story, launchPackage);
                }}
              >
                Launch-Paket exportieren
              </button>
            </div>
          </div>

          <div className="book-metrics">
            <Metric label="Readiness" value={`${launchPackage.readinessScore}%`} />
            <Metric label="Keywords" value={launchPackage.keywords.length} />
            <Metric label="Kategorien" value={launchPackage.categories.length} />
            <Metric label="AI Disclosure" value={launchPackage.aiDisclosure} />
          </div>

          <div className="editor-grid">
            <label className="editor-field">
              <span>Pen Name</span>
              <input
                className="editor-input"
                type="text"
                value={story.book.amazonOps.penName}
                onChange={function (event) {
                  updateAmazonOps(onUpdateStory, "penName", event.target.value);
                }}
              />
            </label>

            <label className="editor-field">
              <span>Subtitle</span>
              <input
                className="editor-input"
                type="text"
                value={story.book.amazonOps.subtitle}
                onChange={function (event) {
                  updateAmazonOps(onUpdateStory, "subtitle", event.target.value);
                }}
              />
            </label>

            <label className="editor-field">
              <span>Series Name</span>
              <input
                className="editor-input"
                type="text"
                value={story.book.amazonOps.seriesName}
                onChange={function (event) {
                  updateAmazonOps(onUpdateStory, "seriesName", event.target.value);
                }}
              />
            </label>

            <label className="editor-field">
              <span>Volume</span>
              <input
                className="editor-input"
                type="text"
                value={story.book.amazonOps.volumeNumber}
                onChange={function (event) {
                  updateAmazonOps(onUpdateStory, "volumeNumber", event.target.value);
                }}
              />
            </label>
          </div>

          <label className="editor-field">
            <span>Description / Blurb</span>
            <textarea
              className="editor-textarea"
              value={story.book.amazonOps.description}
              onChange={function (event) {
                updateAmazonOps(onUpdateStory, "description", event.target.value);
              }}
            />
          </label>

          <div className="editor-grid">
            <label className="editor-field">
              <span>Keywords</span>
              <textarea
                className="editor-textarea"
                value={story.book.amazonOps.keywords.join(", ")}
                onChange={function (event) {
                  updateAmazonListField(onUpdateStory, "keywords", event.target.value);
                }}
              />
            </label>

            <label className="editor-field">
              <span>Categories</span>
              <textarea
                className="editor-textarea"
                value={story.book.amazonOps.categories.join(", ")}
                onChange={function (event) {
                  updateAmazonListField(onUpdateStory, "categories", event.target.value);
                }}
              />
            </label>
          </div>

          <div className="editor-grid">
            <label className="editor-field">
              <span>Audience Tags</span>
              <textarea
                className="editor-textarea"
                value={story.book.amazonOps.audienceTags.join(", ")}
                onChange={function (event) {
                  updateAmazonListField(onUpdateStory, "audienceTags", event.target.value);
                }}
              />
            </label>

            <label className="editor-field">
              <span>AI Disclosure</span>
              <select
                className="editor-input editor-select"
                value={story.book.amazonOps.aiDisclosure}
                onChange={function (event) {
                  onUpdateStory(function (currentStory) {
                    return {
                      ...currentStory,
                      book: {
                        ...currentStory.book,
                        amazonOps: {
                          ...currentStory.book.amazonOps,
                          aiDisclosure: event.target.value as StoryDocument["book"]["amazonOps"]["aiDisclosure"]
                        }
                      }
                    };
                  });
                }}
              >
                <option value="generated">Generated</option>
                <option value="assisted">Assisted</option>
                <option value="human_led">Human-led</option>
              </select>
            </label>
          </div>

          <div className="book-checklist-grid">
            {Object.entries(story.book.amazonOps.launchChecklist).map(function ([key, value]) {
              return (
                <label key={key} className="book-checklist-item">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={function (event) {
                      onUpdateStory(function (currentStory) {
                        return {
                          ...currentStory,
                          book: {
                            ...currentStory.book,
                            amazonOps: {
                              ...currentStory.book.amazonOps,
                              launchChecklist: {
                                ...currentStory.book.amazonOps.launchChecklist,
                                [key]: event.target.checked
                              }
                            }
                          }
                        };
                      });
                    }}
                  />
                  <span>{formatChecklistLabel(key)}</span>
                </label>
              );
            })}
          </div>

          <pre className="book-code-block">
            {JSON.stringify(launchPackage, null, 2)}
          </pre>
        </section>

        <section className="book-card">
          <div className="book-card__head">
            <div>
              <span className="book-card__label">Draft Engine</span>
              <h4>Job-Flow: context → outline → draft → extract → continuity → rewrite</h4>
            </div>
            <div className="book-card__actions">
              <select
                className="editor-input editor-select book-provider-select"
                value={jobProvider}
                onChange={function (event) {
                  const nextProvider = event.target.value;

                  if (isBookJobProviderOption(nextProvider)) {
                    setJobProvider(nextProvider);
                  }
                }}
              >
                <option value="auto">Auto</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
              <button
                className="flat-button"
                type="button"
                disabled={!selectedSceneId || !contextPacket || isGeneratingJob || blockingDraftPreparationIssues.length > 0}
                onClick={async function () {
                  if (!selectedSceneId || !contextPacket || blockingDraftPreparationIssues.length) {
                    if (blockingDraftPreparationIssues.length) {
                      setJobStatus(blockingDraftPreparationIssues[0].message);
                    }
                    return;
                  }

                  setIsGeneratingJob(true);
                  setJobStatus("");

                  try {
                    const response = await fetch("/api/book-jobs", {
                      method: "POST",
                      headers: {
                        "content-type": "application/json"
                      },
                      body: JSON.stringify({
                        sceneId: selectedSceneId,
                        packet: contextPacket,
                        provider: jobProvider,
                        modelOverrides: buildBookJobModelOverrides(jobModels),
                        targetSceneWordsMin: normalizedDraftTargets.targetSceneWordsMin,
                        targetSceneWordsMax: normalizedDraftTargets.targetSceneWordsMax
                      })
                    });
                    const payload = await response.json();

                    if (!response.ok) {
                      throw new Error(
                        typeof payload.error === "string"
                          ? payload.error
                          : "Book job request failed."
                      );
                    }

                    onUpdateStory(function (currentStory) {
                      return upsertDraftJob(currentStory, payload.job as BookDraftJob);
                    });

                    setJobStatus(
                      payload.warning
                        ? `${payload.provider}: ${payload.warning}`
                        : `Job erzeugt via ${payload.provider} · ${(payload.job as BookDraftJob).modelName || "ohne Modell-ID"}.`
                    );
                  } catch (error) {
                    setJobStatus(
                      error instanceof Error ? error.message : "Book job request failed."
                    );
                  } finally {
                    setIsGeneratingJob(false);
                  }
                }}
              >
                {isGeneratingJob ? "Generiert..." : "Job fuer Szene erzeugen"}
              </button>
            </div>
          </div>

          <BookJobModelFields
            provider={jobProvider}
            models={jobModels}
            onChangeModel={handleModelChange}
            onResetModel={handleModelReset}
          />

          <div className="editor-grid">
            <label className="editor-field">
              <span>Zielbereich Minimum</span>
              <input
                className="editor-input"
                type="number"
                min={250}
                step={50}
                value={story.book.draftEngine.targetSceneWordsMin}
                onChange={function (event) {
                  const nextValue = Number(event.target.value) || 0;

                  onUpdateStory(function (currentStory) {
                    const normalizedTargets = normalizeBookDraftTargets(
                      nextValue,
                      currentStory.book.draftEngine.targetSceneWordsMax
                    );

                    return {
                      ...currentStory,
                      book: {
                        ...currentStory.book,
                        draftEngine: {
                          ...currentStory.book.draftEngine,
                          targetSceneWordsMin: normalizedTargets.targetSceneWordsMin,
                          targetSceneWordsMax: normalizedTargets.targetSceneWordsMax
                        }
                      }
                    };
                  });
                }}
              />
            </label>

            <label className="editor-field">
              <span>Zielbereich Maximum</span>
              <input
                className="editor-input"
                type="number"
                min={300}
                step={50}
                value={story.book.draftEngine.targetSceneWordsMax}
                onChange={function (event) {
                  const nextValue = Number(event.target.value) || 0;

                  onUpdateStory(function (currentStory) {
                    const normalizedTargets = normalizeBookDraftTargets(
                      currentStory.book.draftEngine.targetSceneWordsMin,
                      nextValue
                    );

                    return {
                      ...currentStory,
                      book: {
                        ...currentStory.book,
                        draftEngine: {
                          ...currentStory.book.draftEngine,
                          targetSceneWordsMin: normalizedTargets.targetSceneWordsMin,
                          targetSceneWordsMax: normalizedTargets.targetSceneWordsMax
                        }
                      }
                    };
                  });
                }}
              />
            </label>
          </div>

          {blockingDraftPreparationIssues.length ? (
            <div className="book-mini-list">
              {blockingDraftPreparationIssues.map(function (issue) {
                return (
                  <article key={issue.message} className="book-mini-card">
                    <strong>Blocker</strong>
                    <p>{issue.message}</p>
                  </article>
                );
              })}
            </div>
          ) : null}

          {!blockingDraftPreparationIssues.length && warningDraftPreparationIssues.length ? (
            <div className="book-mini-list">
              {warningDraftPreparationIssues.map(function (issue) {
                return (
                  <article key={issue.message} className="book-mini-card">
                    <strong>Hinweis</strong>
                    <p>{issue.message}</p>
                  </article>
                );
              })}
            </div>
          ) : null}

          {jobStatus ? <p className="book-inline-status">{jobStatus}</p> : null}

          {draftJobs.length ? (
            <div className="book-job-list">
              {draftJobs.map(function (job) {
                return (
                  <DraftJobCard
                    key={job.id}
                    job={job}
                    onApproveStateDiff={function () {
                      let approved = false;
                      let conflicts: string[] = [];

                      onUpdateStory(function (currentStory) {
                        const nextStory = approveBookStateDiff(currentStory, job.id);
                        const reviewedJob = nextStory.book.draftEngine.jobs.find(function (candidate) {
                          return candidate.id === job.id;
                        });
                        approved = reviewedJob?.stateDiffStatus === "approved";
                        conflicts = reviewedJob?.stateDiff?.conflicts ?? [];
                        return nextStory;
                      });
                      setJobStatus(
                        approved
                          ? "StateDiff angenommen und in den Memory Backbone übernommen."
                          : conflicts[0] || "StateDiff bleibt pending, weil die Validierung Review verlangt."
                      );
                    }}
                    onRejectStateDiff={function () {
                      onUpdateStory(function (currentStory) {
                        return rejectBookStateDiff(currentStory, job.id);
                      });
                      setJobStatus("StateDiff verworfen. Der Draft bleibt erhalten, der State wird nicht kanonisch.");
                    }}
                    onApproveStateDiffItem={function (kind, index) {
                      onUpdateStory(function (currentStory) {
                        return approveBookStateDiffItem(currentStory, {
                          jobId: job.id,
                          kind,
                          index
                        });
                      });
                      setJobStatus("StateDiff-Zeile angenommen.");
                    }}
                    onRejectStateDiffItem={function (kind, index) {
                      onUpdateStory(function (currentStory) {
                        return rejectBookStateDiffItem(currentStory, {
                          jobId: job.id,
                          kind,
                          index
                        });
                      });
                      setJobStatus("StateDiff-Zeile verworfen.");
                    }}
                    onAccept={function () {
                      let accepted = false;
                      let blockers: string[] = [];

                      onUpdateStory(function (currentStory) {
                        blockers = getDraftJobAcceptanceBlockers(currentStory, job.id);

                        if (blockers.length) {
                          return currentStory;
                        }

                        const result = acceptDraftJobToScene(currentStory, job.id);
                        accepted = Boolean(result);
                        return result ? result.story : currentStory;
                      });
                      setJobStatus(
                        accepted
                          ? "Rewrite in Szene uebernommen."
                          : blockers[0] || "Rewrite wurde nicht uebernommen."
                      );
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <article className="book-thread-card book-thread-card--empty">
              <strong>Noch kein Draft-Job fuer diese Szene</strong>
              <p>
                Der lokale Flow erstellt pro Szene einen persistenten Job mit Outline,
                Rohdraft, Extraktion und Rewrite-Fassung.
              </p>
            </article>
          )}
        </section>

        <section className="book-card">
          <div className="book-card__head">
            <div>
              <span className="book-card__label">Continuity Audit</span>
              <h4>Lokaler Readiness-Pass auf Basis der Draft-Jobs</h4>
            </div>
          </div>

          <div className="book-metrics">
            <Metric label="Accepted Jobs" value={draftAudit.acceptedJobs} />
            <Metric label="Pending Jobs" value={draftAudit.pendingJobs} />
            <Metric label="Uncovered Scenes" value={draftAudit.uncoveredSceneCount} />
            <Metric label="Blocker" value={draftAudit.continuityBlockers.length} />
            <Metric label="Review Queue" value={draftAudit.reviewQueue.length} />
            <Metric label="Propagation Debt" value={draftAudit.propagationDebtCount} />
          </div>

          <div className="book-context-stack">
            <strong>Review Queue</strong>
            <div className="book-mini-list">
              {draftAudit.reviewQueue.length ? (
                draftAudit.reviewQueue.map(function (item) {
                  return (
                    <article key={item.id} className="book-mini-card">
                      <strong>{formatReviewQueueItemLabel(item)}</strong>
                      <p>{item.sceneTitle ? `${item.sceneTitle}: ${item.message}` : item.message}</p>
                    </article>
                  );
                })
              ) : (
                <article className="book-mini-card">
                  <strong>Keine offenen Review-Items</strong>
                </article>
              )}
            </div>
          </div>

          <div className="book-context-grid">
            <div className="book-context-stack">
              <strong>Continuity Blocker</strong>
              <div className="book-mini-list">
                {draftAudit.continuityBlockers.length ? (
                  draftAudit.continuityBlockers.map(function (item, index) {
                    return (
                      <article key={`blocker_${index}`} className="book-mini-card">
                        <p>{item}</p>
                      </article>
                    );
                  })
                ) : (
                  <article className="book-mini-card">
                    <strong>Keine lokalen Blocker</strong>
                  </article>
                )}
              </div>
            </div>

            <div className="book-context-stack">
              <strong>Quality + Market Warnings</strong>
              <div className="book-mini-list">
                {draftAudit.qualityWarnings.concat(draftAudit.marketWarnings).length ? (
                  draftAudit.qualityWarnings
                    .concat(draftAudit.marketWarnings)
                    .map(function (item, index) {
                      return (
                        <article key={`warning_${index}`} className="book-mini-card">
                          <p>{item}</p>
                        </article>
                      );
                    })
                ) : (
                  <article className="book-mini-card">
                    <strong>Keine unmittelbaren Warnungen</strong>
                  </article>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="book-card">
          <div className="book-card__head">
            <div>
              <span className="book-card__label">Writer Constitution</span>
              <h4>Regeln fuer Drafting und spaetere Modell-Orchestrierung</h4>
            </div>
            <button
              className="flat-button"
              type="button"
              onClick={function () {
                onUpdateStory(function (currentStory) {
                  return {
                    ...currentStory,
                    book: {
                      ...currentStory.book,
                      writerConstitution: currentStory.book.writerConstitution.concat("")
                    }
                  };
                });
              }}
            >
              + Regel
            </button>
          </div>

          <div className="book-rule-list">
            {story.book.writerConstitution.map(function (rule, index) {
              return (
                <article key={`rule_${index}`} className="book-rule-card">
                  <span className="book-rule-card__index">{index + 1}</span>
                  <textarea
                    className="editor-textarea"
                    value={rule}
                    onChange={function (event) {
                      onUpdateStory(function (currentStory) {
                        return {
                          ...currentStory,
                          book: {
                            ...currentStory.book,
                            writerConstitution: currentStory.book.writerConstitution.map(function (
                              currentRule,
                              currentIndex
                            ) {
                              return currentIndex === index ? event.target.value : currentRule;
                            })
                          }
                        };
                      });
                    }}
                  />
                  <button
                    className="scene-block-card__remove"
                    type="button"
                    disabled={story.book.writerConstitution.length === 1}
                    onClick={function () {
                      onUpdateStory(function (currentStory) {
                        if (currentStory.book.writerConstitution.length === 1) {
                          return currentStory;
                        }

                        return {
                          ...currentStory,
                          book: {
                            ...currentStory.book,
                            writerConstitution: currentStory.book.writerConstitution.filter(
                              function (_, currentIndex) {
                                return currentIndex !== index;
                              }
                            )
                          }
                        };
                      });
                    }}
                  >
                    Entfernen
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="book-card">
          <div className="book-card__head">
            <div>
              <span className="book-card__label">Architecture Sync</span>
              <h4>Acts, Kapitel und Szenen bleiben der operative Unterbau</h4>
            </div>
          </div>

          <div className="book-architecture-list">
            {chapters.map(function (chapter) {
              return (
                <ChapterArchitectureCard
                  key={chapter.id}
                  chapter={chapter}
                  selectedSceneId={selectedSceneId}
                  onSelectScene={onSelectScene}
                />
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}

function ChapterArchitectureCard({
  chapter,
  selectedSceneId,
  onSelectScene
}: {
  chapter: StoryChapter & { actTitle: string };
  selectedSceneId: string;
  onSelectScene: (sceneId: string) => void;
}) {
  return (
    <article className="book-architecture-card">
      <div className="book-architecture-card__head">
        <div>
          <strong>{chapter.title}</strong>
          <p>
            {chapter.actTitle} · {chapter.wordCount} Woerter
          </p>
        </div>
        <span>{chapter.scenes.length} Szenen</span>
      </div>

      <div className="book-scene-chip-list">
        {chapter.scenes.map(function (scene) {
          return (
            <button
              key={scene.id}
              className={
                "book-scene-chip" + (scene.id === selectedSceneId ? " book-scene-chip--active" : "")
              }
              type="button"
              onClick={function () {
                onSelectScene(scene.id);
              }}
            >
              <strong>{scene.title}</strong>
              <span>{scene.label || "Ohne Label"}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="book-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function DraftJobCard({
  job,
  onApproveStateDiff,
  onRejectStateDiff,
  onApproveStateDiffItem,
  onRejectStateDiffItem,
  onAccept
}: {
  job: BookDraftJob;
  onApproveStateDiff: () => void;
  onRejectStateDiff: () => void;
  onApproveStateDiffItem: (kind: BookStateDiffItemKind, index: number) => void;
  onRejectStateDiffItem: (kind: BookStateDiffItemKind, index: number) => void;
  onAccept: () => void;
}) {
  return (
    <article className="book-job-card">
      <div className="book-job-card__head">
        <div>
          <span className="book-card__label">Scene Job</span>
          <h4>{job.sceneTitle}</h4>
          <p>
            {job.contextSnapshot.chapterTitle} · {formatTimestamp(job.updatedAt)}
          </p>
        </div>
        <div className="book-card__meta">
          <span>{job.status}</span>
          <span>State: {formatStateDiffStatusShort(job.stateDiffStatus)}</span>
          <span>{job.contextSnapshot.relevantCodexTitles.length} Codex</span>
          <span>{job.contextSnapshot.relevantCharacterNames?.length ?? 0} Character States</span>
        </div>
      </div>

      <div className="book-context-grid">
        <div className="book-context-stack">
          <strong>Stages</strong>
          <div className="book-mini-list">
            {BOOK_DRAFT_STAGE_SEQUENCE.map(function (stageId) {
              const stage = job.stages[stageId];

              return (
                <article key={`${job.id}_${stageId}`} className="book-mini-card">
                  <strong>{formatDraftStageLabel(stageId)}</strong>
                  <p>
                    {formatProviderLabel(stage.provider)} · {stage.status}
                    {stage.modelName ? ` · ${stage.modelName}` : ""}
                  </p>
                </article>
              );
            })}
          </div>

          <strong>Outline</strong>
          <div className="book-mini-list">
            {formatDraftOutlineForDisplay(job.outline).map(function (step, index) {
              return (
                <article key={`${job.id}_outline_${index}`} className="book-mini-card">
                  <strong>Beat {index + 1}</strong>
                  <p>{step}</p>
                </article>
              );
            })}
          </div>

          <strong>Extract</strong>
          <pre className="book-code-block">
            {JSON.stringify(
              {
                newCanonFacts: job.extractedState.newCanonFacts,
                characterStateUpdates: job.extractedState.characterStateUpdates,
                openThreadsCreated: job.extractedState.openThreadsCreated,
                foreshadowingAdded: job.extractedState.foreshadowingAdded,
                continuityRisks: job.extractedState.continuityRisks
              },
              null,
              2
            )}
          </pre>

          <strong>State Review</strong>
          <BookStateDiffReview
            job={job}
            compact
            onApprove={onApproveStateDiff}
            onReject={onRejectStateDiff}
            onApproveItem={onApproveStateDiffItem}
            onRejectItem={onRejectStateDiffItem}
          />
        </div>

        <div className="book-context-stack">
          <strong>Draft</strong>
          <pre className="book-code-block">{job.draftText}</pre>

          <strong>Continuity</strong>
          <pre className="book-code-block">
            {JSON.stringify(
              {
                continuityRisks: job.extractedState.continuityRisks,
                styleDriftNotes: job.extractedState.styleDriftNotes,
                stageNotes: job.stages.continuity.notes
              },
              null,
              2
            )}
          </pre>

          <strong>Rewrite Notes</strong>
          <div className="book-mini-list">
            {job.rewriteNotes.map(function (note, index) {
              return (
                <article key={`${job.id}_note_${index}`} className="book-mini-card">
                  <p>{note}</p>
                </article>
              );
            })}
          </div>

          <strong>Rewrite Draft</strong>
          <pre className="book-code-block">{job.rewriteText}</pre>
        </div>
      </div>

      <div className="book-job-card__footer">
        <button className="flat-button" type="button" onClick={onAccept}>
          Rewrite in Szene uebernehmen
        </button>
      </div>
    </article>
  );
}

function MemorySyncJobCard({
  job,
  onUpdateStory
}: {
  job: BookDraftJob;
  onUpdateStory: (updater: (story: StoryDocument) => StoryDocument) => void;
}) {
  const counts = countMemorySyncStatuses(job.extractedState.memorySync.items);

  return (
    <article className="book-job-card">
      <div className="book-job-card__head">
        <div>
          <span className="book-card__label">Memory Sync</span>
          <h4>{job.sceneTitle}</h4>
          <p>
            {job.contextSnapshot.chapterTitle} · {formatTimestamp(job.updatedAt)}
          </p>
        </div>
        <div className="book-card__meta">
          <span>{counts.pending} pending</span>
          <span>{counts.approved} approved</span>
          <span>{counts.rejected} rejected</span>
        </div>
      </div>

      <div className="book-context-grid">
        {MEMORY_SYNC_KIND_SEQUENCE.map(function (kind) {
          const items = job.extractedState.memorySync.items.filter(function (item) {
            return item.kind === kind;
          });
          const pendingItems = items.filter(function (item) {
            return item.status === "pending";
          });

          if (!items.length) {
            return null;
          }

          return (
            <div key={`${job.id}_${kind}`} className="book-context-stack">
              <div className="book-card__head">
                <div>
                  <strong>{formatMemorySyncKindLabel(kind)}</strong>
                  <p>{pendingItems.length} pending</p>
                </div>
                <div className="book-card__actions">
                  <button
                    className="flat-button"
                    type="button"
                    disabled={pendingItems.length === 0}
                    onClick={function () {
                      onUpdateStory(function (currentStory) {
                        return updateDraftJobMemorySyncKindStatus(currentStory, {
                          jobId: job.id,
                          kind,
                          status: "approved",
                          onlyPending: true
                        });
                      });
                    }}
                  >
                    Pending annehmen
                  </button>
                  <button
                    className="flat-button"
                    type="button"
                    disabled={pendingItems.length === 0}
                    onClick={function () {
                      onUpdateStory(function (currentStory) {
                        return updateDraftJobMemorySyncKindStatus(currentStory, {
                          jobId: job.id,
                          kind,
                          status: "rejected",
                          onlyPending: true
                        });
                      });
                    }}
                  >
                    Pending ablehnen
                  </button>
                </div>
              </div>

              <div className="book-mini-list">
                {items.map(function (item) {
                  return (
                    <article key={item.id} className="book-mini-card">
                      <strong>{item.value}</strong>
                      <p>
                        Status: {formatMemorySyncStatusLabel(item.status)}
                        {item.reviewedAt ? ` · ${formatTimestamp(item.reviewedAt)}` : ""}
                      </p>
                      <div className="book-card__actions">
                        <button
                          className="flat-button"
                          type="button"
                          disabled={item.status === "approved"}
                          onClick={function () {
                            onUpdateStory(function (currentStory) {
                              return updateDraftJobMemorySyncStatus(currentStory, {
                                jobId: job.id,
                                itemId: item.id,
                                status: "approved"
                              });
                            });
                          }}
                        >
                          Annehmen
                        </button>
                        <button
                          className="flat-button"
                          type="button"
                          disabled={item.status === "rejected"}
                          onClick={function () {
                            onUpdateStory(function (currentStory) {
                              return updateDraftJobMemorySyncStatus(currentStory, {
                                jobId: job.id,
                                itemId: item.id,
                                status: "rejected"
                              });
                            });
                          }}
                        >
                          Ablehnen
                        </button>
                        <button
                          className="flat-button"
                          type="button"
                          disabled={item.status === "pending"}
                          onClick={function () {
                            onUpdateStory(function (currentStory) {
                              return updateDraftJobMemorySyncStatus(currentStory, {
                                jobId: job.id,
                                itemId: item.id,
                                status: "pending"
                              });
                            });
                          }}
                        >
                          Zurueckstellen
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function formatDraftStageLabel(stageId: (typeof BOOK_DRAFT_STAGE_SEQUENCE)[number]) {
  if (stageId === "context") {
    return "Context";
  }

  if (stageId === "beat_plan") {
    return "Beat Plan";
  }

  if (stageId === "draft") {
    return "Draft";
  }

  if (stageId === "rewrite") {
    return "Rewrite";
  }

  if (stageId === "length_control") {
    return "Length Control";
  }

  if (stageId === "extract") {
    return "Extract";
  }

  if (stageId === "continuity") {
    return "Continuity";
  }

  return "Quality Eval";
}

function formatStateDiffStatusShort(status: BookDraftJob["stateDiffStatus"]) {
  if (status === "approved" || status === "approved_manual") {
    return "approved";
  }

  if (status === "rejected") {
    return "rejected";
  }

  if (status === "pending") {
    return "pending";
  }

  return "none";
}

function formatSceneCardDirectiveLabel(step: string, index: number) {
  const separatorIndex = step.indexOf(":");

  if (separatorIndex === -1) {
    return `Direktive ${index + 1}`;
  }

  const key = normalizeOutlineDirectiveKey(step.slice(0, separatorIndex));
  const label = SCENE_CARD_DIRECTIVE_LABELS[key];

  return label || `Direktive ${index + 1}`;
}

function formatDraftOutlineForDisplay(outline: string[]) {
  const steps = outline
    .map(formatDraftOutlineStepForDisplay)
    .filter(Boolean);

  return steps.length ? steps : ["Keine erzählerische Outline gespeichert."];
}

function formatDraftOutlineStepForDisplay(step: string) {
  const normalized = step
    .trim()
    .replace(/^Beat\s+\d+\s*:\s*/i, "")
    .replace(/\s*\(\d+W,\s*Payoff:.+\)$/i, "")
    .trim();

  if (!normalized) {
    return "";
  }

  const separatorIndex = normalized.indexOf(":");

  if (separatorIndex === -1) {
    return normalized;
  }

  const rawKey = normalized.slice(0, separatorIndex).trim();
  const value = normalized.slice(separatorIndex + 1).trim();
  const key = normalizeOutlineDirectiveKey(rawKey);

  if (!value || OUTLINE_CONTEXT_ONLY_KEYS.has(key)) {
    return "";
  }

  const label = OUTLINE_NARRATIVE_LABELS[key];

  return label ? `${label}: ${value}` : `${rawKey}: ${value}`;
}

function normalizeOutlineDirectiveKey(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

const OUTLINE_CONTEXT_ONLY_KEYS = new Set([
  "pov",
  "ort",
  "location",
  "uhrzeit",
  "time_anchor",
  "timeanchor",
  "zeit",
  "ziel",
  "objective",
  "setup"
]);

const OUTLINE_NARRATIVE_LABELS: Record<string, string> = {
  oeffnung: "Oeffnung",
  offnung: "Oeffnung",
  opening: "Einstieg",
  einstieg: "Einstieg",
  druck: "Reibung",
  core_action: "Kernaktion",
  coreaction: "Kernaktion",
  kern_aktion: "Kernaktion",
  kernaktion: "Kernaktion",
  dramatic_beat: "Veraenderung",
  dramaticbeat: "Veraenderung",
  beat: "Veraenderung",
  ending: "Ende",
  ende: "Ende",
  ausgang: "Ausgang",
  closing_line: "Schlussbild",
  closingline: "Schlussbild",
  letzter_satz: "Schlussbild",
  letztersatz: "Schlussbild"
};

const SCENE_CARD_DIRECTIVE_LABELS: Record<string, string> = {
  pov: "POV",
  ort: "Ort",
  location: "Ort",
  uhrzeit: "Zeit",
  time_anchor: "Zeit",
  timeanchor: "Zeit",
  ziel: "Ziel",
  objective: "Ziel",
  ...OUTLINE_NARRATIVE_LABELS
};

function EditableStringListSection({
  label,
  title,
  items,
  onUpdate
}: {
  label: string;
  title: string;
  items: string[];
  onUpdate: (nextItems: string[]) => void;
}) {
  return (
    <div className="book-context-stack">
      <div className="book-card__head">
        <div>
          <span className="book-card__label">{label}</span>
          <h4>{title}</h4>
        </div>
        <button
          className="flat-button"
          type="button"
          onClick={function () {
            onUpdate(items.concat(""));
          }}
        >
          + Regel
        </button>
      </div>

      <div className="book-rule-list">
        {items.map(function (item, index) {
          return (
            <article key={`${label}_${index}`} className="book-rule-card">
              <span className="book-rule-card__index">{index + 1}</span>
              <textarea
                className="editor-textarea"
                value={item}
                onChange={function (event) {
                  onUpdate(
                    items.map(function (currentItem, currentIndex) {
                      return currentIndex === index ? event.target.value : currentItem;
                    })
                  );
                }}
              />
              <button
                className="scene-block-card__remove"
                type="button"
                disabled={items.length === 1}
                onClick={function () {
                  if (items.length === 1) {
                    return;
                  }

                  onUpdate(
                    items.filter(function (_, currentIndex) {
                      return currentIndex !== index;
                    })
                  );
                }}
              >
                Entfernen
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function updateMasterBrief(
  onUpdateStory: (updater: (story: StoryDocument) => StoryDocument) => void,
  story: StoryDocument,
  key: "premise" | "readerPromise" | "endingPromise" | "thematicCore" | "authorIntent" | "currentFocus",
  value: string
) {
  onUpdateStory(function (currentStory) {
    return {
      ...currentStory,
      book: {
        ...currentStory.book,
        masterBrief: {
          ...currentStory.book.masterBrief,
          [key]: value
        }
      }
    };
  });
}

function formatReviewQueueItemLabel(item: BookReviewQueueItem) {
  const severity = item.severity === "blocker" ? "Blocker" : "Warnung";

  if (item.kind === "continuity") {
    return `${severity} · Continuity`;
  }

  if (item.kind === "propagation") {
    return `${severity} · Propagation`;
  }

  if (item.kind === "market") {
    return `${severity} · Market`;
  }

  return `${severity} · Quality`;
}

function updateMarketBrief(
  onUpdateStory: (updater: (story: StoryDocument) => StoryDocument) => void,
  key: "amazonGoal" | "categoryLane" | "hook" | "seriesPotential" | "coverDirection",
  value: string
) {
  onUpdateStory(function (currentStory) {
    return {
      ...currentStory,
      book: {
        ...currentStory.book,
        marketBrief: {
          ...currentStory.book.marketBrief,
          [key]: value
        }
      }
    };
  });
}

function updateAmazonOps(
  onUpdateStory: (updater: (story: StoryDocument) => StoryDocument) => void,
  key: keyof Omit<StoryDocument["book"]["amazonOps"], "launchChecklist" | "keywords" | "categories" | "audienceTags" | "aiDisclosure">,
  value: string
) {
  onUpdateStory(function (currentStory) {
    return {
      ...currentStory,
      book: {
        ...currentStory.book,
        amazonOps: {
          ...currentStory.book.amazonOps,
          [key]: value
        }
      }
    };
  });
}

function updateAmazonListField(
  onUpdateStory: (updater: (story: StoryDocument) => StoryDocument) => void,
  key: "keywords" | "categories" | "audienceTags",
  value: string
) {
  const items = value
    .split(",")
    .map(function (item) {
      return item.trim();
    })
    .filter(Boolean);

  onUpdateStory(function (currentStory) {
    return {
      ...currentStory,
      book: {
        ...currentStory.book,
        amazonOps: {
          ...currentStory.book.amazonOps,
          [key]: items
        }
      }
    };
  });
}

const PHASES: Array<{ id: StoryDocument["book"]["activePhase"]; label: string }> = [
  { id: "phase_1_foundation", label: "Phase 1" },
  { id: "phase_2_memory", label: "Phase 2" },
  { id: "phase_3_drafting", label: "Phase 3" },
  { id: "phase_4_continuity", label: "Phase 4" },
  { id: "phase_5_market", label: "Phase 5" }
];

const MEMORY_SYNC_KIND_SEQUENCE: DraftMemorySyncItemKind[] = [
  "canon_fact",
  "character_state",
  "foreshadowing"
];

function formatPhaseLabel(phase: StoryDocument["book"]["activePhase"]) {
  if (phase === "phase_2_memory") {
    return "Phase 2 · Memory Backbone";
  }

  if (phase === "phase_3_drafting") {
    return "Phase 3 · Draft Engine";
  }

  if (phase === "phase_4_continuity") {
    return "Phase 4 · Continuity";
  }

  if (phase === "phase_5_market") {
    return "Phase 5 · Market Ops";
  }

  return "Phase 1 · Foundation";
}

function countMemorySyncStatuses(items: DraftMemorySyncItem[]) {
  return items.reduce(
    function (acc, item) {
      acc[item.status] += 1;
      return acc;
    },
    {
      pending: 0,
      approved: 0,
      rejected: 0
    }
  );
}

function formatMemorySyncKindLabel(kind: DraftMemorySyncItemKind) {
  if (kind === "character_state") {
    return "Character Shifts";
  }

  if (kind === "foreshadowing") {
    return "Foreshadowing";
  }

  return "Canon Facts";
}

function formatMemorySyncStatusLabel(status: DraftMemorySyncItem["status"]) {
  if (status === "approved") {
    return "approved";
  }

  if (status === "rejected") {
    return "rejected";
  }

  return "pending";
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return "noch nicht synchronisiert";
  }

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatProviderLabel(provider: BookDraftJob["provider"]) {
  if (provider === "openai") {
    return "OpenAI";
  }

  if (provider === "anthropic") {
    return "Anthropic";
  }

  return "Local";
}

function formatChecklistLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, function (match) {
      return match.toUpperCase();
    });
}

function formatCharacterSnapshotLabel(
  snapshot: StoryDocument["book"]["memory"]["characterLedger"][number]["snapshots"][number]
) {
  const scopeLabel =
    snapshot.scope === "chapter"
      ? "Kapitel"
      : snapshot.scope === "scene"
        ? "Szene"
        : "Baseline";

  return `${scopeLabel}: ${snapshot.sourceLabel || snapshot.currentState}`;
}

function exportLaunchPackage(story: StoryDocument, launchPackage: ReturnType<typeof buildAmazonLaunchPackage>) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = JSON.stringify(
    {
      storyId: story.id,
      title: story.title,
      exportedAt: new Date().toISOString(),
      launchPackage
    },
    null,
    2
  );
  const blob = new window.Blob([payload], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = window.document.createElement("a");

  link.href = url;
  link.download = `${story.id}_amazon_launch_package.json`;
  window.document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function exportStoryAsMarkdown(story: StoryDocument) {
  if (typeof window === "undefined") {
    return;
  }

  const markdown = buildStoryMarkdownExport(story);
  const blob = new window.Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = window.document.createElement("a");

  link.href = url;
  link.download = `${slugifyFilename(story.title || "ember-book")}.md`;
  window.document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function buildStoryMarkdownExport(story: StoryDocument) {
  const lines = [
    `# ${story.title || "Untitled Book"}`,
    story.authorName ? `Von ${story.authorName}` : "",
    "",
    "## Manuskript",
    ""
  ].filter(function (line, index, source) {
    return line || source[index - 1] !== "";
  });

  story.acts.forEach(function (act) {
    lines.push(`## ${act.title}`, "");

    act.chapters.forEach(function (chapter) {
      lines.push(`### ${chapter.title}`, "");

      chapter.scenes.forEach(function (scene) {
        const sceneText = scene.blocks
          .map(function (block) {
            return block.text.trim();
          })
          .filter(Boolean)
          .join("\n\n");

        if (sceneText) {
          lines.push(sceneText, "");
        }
      });
    });
  });

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

function slugifyFilename(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "ember-book";
}

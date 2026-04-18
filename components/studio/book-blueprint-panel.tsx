"use client";

import { useMemo, useState } from "react";
import {
  analyzeBookDraftReadiness,
  acceptDraftJobToScene,
  buildAmazonLaunchPackage,
  buildCanonLedger,
  buildOpenThreads,
  buildSceneContextPacket,
  buildTimelineBeats,
  getDraftJobsForScene,
  upsertDraftJob
} from "@/lib/book-engine";
import {
  countStoryStats,
  type BookDraftJob,
  type StoryChapter,
  type StoryDocument
} from "@/lib/story-schema";

export function BookBlueprintPanel({
  story,
  selectedSceneId,
  onSelectScene,
  onUpdateStory
}: {
  story: StoryDocument;
  selectedSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onUpdateStory: (updater: (story: StoryDocument) => StoryDocument) => void;
}) {
  const stats = useMemo(function () {
    return countStoryStats(story);
  }, [story]);
  const canonLedger = useMemo(function () {
    return buildCanonLedger(story);
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
  const draftJobs = useMemo(function () {
    return selectedSceneId ? getDraftJobsForScene(story, selectedSceneId) : [];
  }, [selectedSceneId, story]);
  const draftAudit = useMemo(function () {
    return analyzeBookDraftReadiness(story);
  }, [story]);
  const launchPackage = useMemo(function () {
    return buildAmazonLaunchPackage(story);
  }, [story]);
  const [jobProvider, setJobProvider] = useState<"auto" | "openai" | "anthropic" | "local">("auto");
  const [jobStatus, setJobStatus] = useState<string>("");
  const [isGeneratingJob, setIsGeneratingJob] = useState(false);

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

  return (
    <aside className="book-panel" aria-label="Book Blueprint Panel">
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

          <div className="book-metrics">
            <Metric label="Acts" value={stats.actCount} />
            <Metric label="Kapitel" value={stats.chapterCount} />
            <Metric label="Szenen" value={stats.sceneCount} />
            <Metric label="Choices" value={stats.choiceCount} />
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

          <label className="editor-field">
            <span>Praemisse</span>
            <textarea
              className="editor-textarea"
              value={story.book.masterBrief.premise}
              onChange={function (event) {
                updateMasterBrief(onUpdateStory, story, "premise", event.target.value);
              }}
            />
          </label>

          <label className="editor-field">
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
            <label className="editor-field">
              <span>Ending Promise</span>
              <textarea
                className="editor-textarea"
                value={story.book.masterBrief.endingPromise}
                onChange={function (event) {
                  updateMasterBrief(onUpdateStory, story, "endingPromise", event.target.value);
                }}
              />
            </label>

            <label className="editor-field">
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
        </section>

        <section className="book-card">
          <div className="book-card__head">
            <div>
              <span className="book-card__label">Market Brief</span>
              <h4>Amazon-Track ohne die Story-Struktur zu verlassen</h4>
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
              label="Relevant fuer Szene"
              value={contextPacket?.dynamicContext.relevantCodex.length ?? 0}
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
                      Der lokale Heuristik-Layer sieht aktuell keine Choices oder
                      markanten offenen Fragen.
                    </p>
                  </article>
                )}
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
                    {contextPacket.dynamicContext.actTitle}
                  </span>
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
                {contextPacket.dynamicContext.nextBeat ? (
                  <article className="book-mini-card">
                    <strong>{contextPacket.dynamicContext.nextBeat.sceneTitle}</strong>
                    <p>
                      {contextPacket.dynamicContext.nextBeat.summary ||
                        contextPacket.dynamicContext.nextBeat.excerpt ||
                        "Kein Ausblick hinterlegt."}
                    </p>
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
              <h4>Lokaler Job-Flow: outline → draft → extract → rewrite</h4>
            </div>
            <div className="book-card__actions">
              <select
                className="editor-input editor-select book-provider-select"
                value={jobProvider}
                onChange={function (event) {
                  setJobProvider(event.target.value as typeof jobProvider);
                }}
              >
                <option value="auto">Auto</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="local">Local</option>
              </select>
              <button
                className="flat-button"
                type="button"
                disabled={!selectedSceneId || isGeneratingJob}
                onClick={async function () {
                  if (!selectedSceneId) {
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
                        story,
                        sceneId: selectedSceneId,
                        provider: jobProvider
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
                        : `Job erzeugt via ${payload.provider}.`
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
                    return {
                      ...currentStory,
                      book: {
                        ...currentStory.book,
                        draftEngine: {
                          ...currentStory.book.draftEngine,
                          targetSceneWordsMin: nextValue
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
                    return {
                      ...currentStory,
                      book: {
                        ...currentStory.book,
                        draftEngine: {
                          ...currentStory.book.draftEngine,
                          targetSceneWordsMax: nextValue
                        }
                      }
                    };
                  });
                }}
              />
            </label>
          </div>

          {jobStatus ? <p className="book-inline-status">{jobStatus}</p> : null}

          {draftJobs.length ? (
            <div className="book-job-list">
              {draftJobs.map(function (job) {
                return (
                  <DraftJobCard
                    key={job.id}
                    job={job}
                    onAccept={function () {
                      onUpdateStory(function (currentStory) {
                        const result = acceptDraftJobToScene(currentStory, job.id);
                        return result ? result.story : currentStory;
                      });
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
  onAccept
}: {
  job: BookDraftJob;
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
          <span>{job.contextSnapshot.relevantCodexTitles.length} Codex</span>
        </div>
      </div>

      <div className="book-context-grid">
        <div className="book-context-stack">
          <strong>Outline</strong>
          <div className="book-mini-list">
            {job.outline.map(function (step, index) {
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
                continuityRisks: job.extractedState.continuityRisks
              },
              null,
              2
            )}
          </pre>
        </div>

        <div className="book-context-stack">
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

function updateMasterBrief(
  onUpdateStory: (updater: (story: StoryDocument) => StoryDocument) => void,
  story: StoryDocument,
  key: keyof StoryDocument["book"]["masterBrief"],
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

function updateMarketBrief(
  onUpdateStory: (updater: (story: StoryDocument) => StoryDocument) => void,
  key: keyof StoryDocument["book"]["marketBrief"],
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

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatChecklistLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, function (match) {
      return match.toUpperCase();
    });
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

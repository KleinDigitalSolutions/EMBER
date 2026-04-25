"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
  BOOK_DRAFT_STAGE_SEQUENCE,
  acceptDraftJobToScene,
  buildTimelineBeats,
  buildSceneContextPacket,
  getDraftJobsForScene,
  upsertDraftJob
} from "@/lib/book-engine";
import { createUuid } from "@/lib/id";
import {
  BOOK_JOB_PROVIDER_STORAGE_KEY,
  isBookJobProviderOption,
  type BookJobProviderOption
} from "@/lib/book-job-models";
import {
  analyzeBookDraftPreparation,
  countSceneWords,
  countStoryStats,
  countWords,
  normalizeBookDraftTargets,
  type BookDraftJob,
  type SceneContext,
  type StoryAct,
  type StoryChapter,
  type StoryDocument,
  type StoryScene
} from "@/lib/story-schema";

type AiPanelView =
  | "draft"
  | "rewrite"
  | "friction"
  | "outline"
  | "notes"
  | "extract"
  | "continuity";

const PROVIDER_OPTIONS: Array<{ id: BookJobProviderOption; label: string; detail: string }> = [
  { id: "anthropic", label: "Opus 4.7", detail: "Standard" },
  { id: "duo", label: "Duo", detail: "später testen" }
];

const DIRECTOR_PRESETS = [
  "Spannung enger ziehen und mit klarer Eskalation enden.",
  "Mehr Innenleben und emotionale Reibung der Hauptfigur zeigen.",
  "Sinnliche Details und räumliche Klarheit stärker ausarbeiten.",
  "Prosa straffen, Wiederholungen schneiden und Tempo erhöhen.",
  "Starke Bilder schützen, Nachdeutungen streichen und weniger erklären.",
  "KI-Glättung reduzieren: mehr Reibung, weniger perfekte Bedeutungssätze.",
  "Szene früher nach dem stärksten Bild oder Turn enden lassen.",
  "Abstrakte Emotionen durch konkrete Handlung, Objekt oder Körperdetail ersetzen."
];

const AI_PANEL_VIEWS: Array<{ id: AiPanelView; label: string }> = [
  { id: "draft", label: "Draft" },
  { id: "rewrite", label: "Rewrite" },
  { id: "friction", label: "Friction" },
  { id: "extract", label: "Extract" },
  { id: "continuity", label: "Continuity" },
  { id: "notes", label: "Notes" },
  { id: "outline", label: "Outline" }
];

export function BookWriterPanel({
  story,
  sceneContext,
  selectedSceneId,
  saveLabel,
  onSelectScene,
  onManualSave,
  onCreateFirstScene,
  onAddAct,
  onAddChapter,
  onAddScene,
  onDeleteAct,
  onDeleteChapter,
  onDeleteScene,
  onUpdateScene,
  onUpdateStory,
  onOpenBranchEditor
}: {
  story: StoryDocument;
  sceneContext: SceneContext | null;
  selectedSceneId: string;
  saveLabel: string;
  onSelectScene: (sceneId: string) => void;
  onManualSave: () => void;
  onCreateFirstScene: () => void;
  onAddAct: () => void;
  onAddChapter: (actId: string) => void;
  onAddScene: (chapterId: string) => void;
  onDeleteAct: (actId: string) => void;
  onDeleteChapter: (chapterId: string) => void;
  onDeleteScene: (sceneId: string) => void;
  onUpdateScene: (updater: (scene: StoryScene) => StoryScene) => void;
  onUpdateStory: (updater: (story: StoryDocument) => StoryDocument) => void;
  onOpenBranchEditor: () => void;
}) {
  const [jobProvider, setJobProvider] = useState<BookJobProviderOption>("anthropic");
  const [jobStatus, setJobStatus] = useState("");
  const [isGeneratingJob, setIsGeneratingJob] = useState(false);
  const [activePanelView, setActivePanelView] = useState<AiPanelView>("rewrite");
  const [selectedJobId, setSelectedJobId] = useState("");

  useEffect(function () {
    const storedProvider = window.localStorage.getItem(BOOK_JOB_PROVIDER_STORAGE_KEY);

    if (
      storedProvider &&
      isBookJobProviderOption(storedProvider) &&
      PROVIDER_OPTIONS.some(function (option) {
        return option.id === storedProvider;
      })
    ) {
      setJobProvider(storedProvider);
    }
  }, []);

  useEffect(
    function () {
      window.localStorage.setItem(BOOK_JOB_PROVIDER_STORAGE_KEY, jobProvider);
    },
    [jobProvider]
  );

  const stats = useMemo(function () {
    return countStoryStats(story);
  }, [story]);

  const chapterWordCount = useMemo(function () {
    if (!sceneContext) {
      return 0;
    }

    return sceneContext.chapter.scenes.reduce(function (total, scene) {
      return total + countSceneWords(scene);
    }, 0);
  }, [sceneContext]);

  const contextPacket = useMemo(function () {
    if (!sceneContext) {
      return null;
    }

    return buildSceneContextPacket(story, sceneContext.scene.id);
  }, [sceneContext, story]);
  const normalizedDraftTargets = useMemo(function () {
    return normalizeBookDraftTargets(
      story.book.draftEngine.targetSceneWordsMin,
      story.book.draftEngine.targetSceneWordsMax
    );
  }, [story.book.draftEngine.targetSceneWordsMax, story.book.draftEngine.targetSceneWordsMin]);
  const draftPreparationIssues = useMemo(function () {
    if (!sceneContext) {
      return [];
    }

    return analyzeBookDraftPreparation(
      story,
      sceneContext.scene.id,
      story.book.draftEngine.targetSceneWordsMin,
      story.book.draftEngine.targetSceneWordsMax
    );
  }, [
    sceneContext,
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
    if (!sceneContext) {
      return [];
    }

    return getDraftJobsForScene(story, sceneContext.scene.id);
  }, [sceneContext, story]);

  useEffect(
    function () {
      if (!draftJobs.length) {
        setSelectedJobId("");
        return;
      }

      setSelectedJobId(function (currentJobId) {
        const matchingJob = draftJobs.find(function (job) {
          return job.id === currentJobId;
        });

        return matchingJob ? matchingJob.id : draftJobs[0].id;
      });
    },
    [draftJobs]
  );

  const firstSceneId = useMemo(function () {
    return findFirstSceneId(story);
  }, [story.acts]);

  const directorNote = useMemo(function () {
    if (!sceneContext) {
      return "";
    }

    const sceneCard = story.book.memory.sceneCards.find(function (entry) {
      return entry.sceneId === sceneContext.scene.id;
    });

    const directorEntry = sceneCard?.directives.custom.find(function (entry) {
      return entry.key === "director_note";
    });

    return directorEntry?.value ?? "";
  }, [sceneContext, story.book.memory.sceneCards]);

  if (!sceneContext) {
    return (
      <section className="book-writer-shell">
        <div className="book-writer-empty">
          <span className="scene-editor__eyebrow">Writer</span>
          <h3>Keine Szene ausgewählt</h3>
          <p>
            {firstSceneId
              ? "Öffne die erste Szene, um weiterzuschreiben."
              : "Es gibt noch keine Szene. Lege zuerst Akt 1, Kapitel 1 und Szene 1 an."}
          </p>
          <div className="book-writer-empty__actions">
            {firstSceneId ? (
              <button
                className="flat-button flat-button--active"
                type="button"
                onClick={function () {
                  onSelectScene(firstSceneId);
                }}
              >
                Erste Szene öffnen
              </button>
            ) : (
              <button
                className="flat-button flat-button--active"
                type="button"
                onClick={onCreateFirstScene}
              >
                Erste Szene anlegen
              </button>
            )}
          </div>
          <p className="book-writer-empty__hint">
            Eine neue Codex-Karte ist nur Worldbuilding. Szenen legst du hier im Writer an.
          </p>
        </div>
      </section>
    );
  }

  const scene = sceneContext.scene;
  const liveWordCount = countSceneWords(scene);
  const latestJob = draftJobs[0] ?? null;
  const activeJob =
    draftJobs.find(function (job) {
      return job.id === selectedJobId;
    }) ?? latestJob;
  const sceneIndex = sceneContext.chapter.scenes.findIndex(function (candidate) {
    return candidate.id === scene.id;
  });
  const previousScene = sceneIndex > 0 ? sceneContext.chapter.scenes[sceneIndex - 1] : null;
  const nextScene =
    sceneIndex >= 0 && sceneIndex < sceneContext.chapter.scenes.length - 1
      ? sceneContext.chapter.scenes[sceneIndex + 1]
      : null;

  async function handleGenerateJob() {
    if (!contextPacket || blockingDraftPreparationIssues.length) {
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
          sceneId: scene.id,
          packet: contextPacket,
          provider: jobProvider,
          targetSceneWordsMin: normalizedDraftTargets.targetSceneWordsMin,
          targetSceneWordsMax: normalizedDraftTargets.targetSceneWordsMax,
          directorNote
        })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof payload.error === "string" ? payload.error : "Book job request failed."
        );
      }

      onUpdateStory(function (currentStory) {
        return upsertDraftJob(currentStory, payload.job as BookDraftJob);
      });

      setActivePanelView("rewrite");
      const job = payload.job as BookDraftJob;
      setSelectedJobId(job.id);
      const executionLabel = formatExecutionModeLabel((payload.job as BookDraftJob).mode);
      setJobStatus(
        payload.warning
          ? `${formatProviderLabel(payload.provider)} · ${executionLabel}: ${payload.warning}`
          : `Job erzeugt via ${formatProviderLabel(payload.provider)} · ${executionLabel} · ${job.modelName || "ohne Modell-ID"}.`
      );
    } catch (error) {
      setJobStatus(error instanceof Error ? error.message : "Book job request failed.");
    } finally {
      setIsGeneratingJob(false);
    }
  }

  function handleAcceptJob(jobId: string, source: "rewrite" | "literary_friction" = "rewrite") {
    onUpdateStory(function (currentStory) {
      const result = acceptDraftJobToScene(currentStory, jobId, { source });
      return result ? result.story : currentStory;
    });

    setJobStatus(
      source === "literary_friction"
        ? "Friction-Draft in die aktuelle Szene übernommen."
        : "Rewrite in die aktuelle Szene übernommen."
    );
  }

  return (
    <section className="book-writer-shell" aria-label="Writer">
      <aside className="book-writer-nav">
        <div className="book-writer-nav__header">
          <span className="scene-editor__eyebrow">Manuskript</span>
          <h3>{story.title || "Untitled Book"}</h3>
          <p>
            {stats.wordCount.toLocaleString("de-DE")} Wörter · {stats.chapterCount} Kapitel ·{" "}
            {stats.sceneCount} Szenen
          </p>
        </div>

        <div className="book-writer-nav__acts">
          {story.acts.map(function (act) {
            return (
              <BookActNav
                key={act.id}
                act={act}
                selectedSceneId={selectedSceneId}
                onSelectScene={onSelectScene}
                onAddChapter={onAddChapter}
                onAddScene={onAddScene}
                onDeleteAct={onDeleteAct}
                onDeleteChapter={onDeleteChapter}
                onDeleteScene={onDeleteScene}
              />
            );
          })}
        </div>

        <div className="book-writer-nav__footer">
          <button className="flat-button" type="button" onClick={onAddAct}>
            + Act
          </button>
          {story.mode === "branching" ? (
            <button className="flat-button" type="button" onClick={onOpenBranchEditor}>
              Branch öffnen
            </button>
          ) : null}
        </div>
      </aside>

      <main className="book-writer-manuscript">
        <div className="book-writer-manuscript__topline">
          <span>{sceneContext.act.title}</span>
          <span>{sceneContext.chapter.title}</span>
          <span>{liveWordCount} Wörter</span>
        </div>

        <section className="book-writer-mobile-scenes" aria-label="Szenen im Kapitel">
          <div className="book-writer-mobile-scenes__head">
            <strong>{sceneContext.chapter.title}</strong>
            <span>{sceneContext.chapter.scenes.length} Szenen</span>
          </div>
          <div className="book-writer-mobile-scenes__list">
            {sceneContext.chapter.scenes.map(function (chapterScene) {
              const isActive = chapterScene.id === scene.id;

              return (
                <button
                  key={chapterScene.id}
                  className={
                    "book-writer-mobile-scenes__chip" +
                    (isActive ? " book-writer-mobile-scenes__chip--active" : "")
                  }
                  type="button"
                  onClick={function () {
                    onSelectScene(chapterScene.id);
                  }}
                >
                  <strong>{chapterScene.title}</strong>
                  <span>{chapterScene.wordCount} Wörter</span>
                </button>
              );
            })}
            <button
              className="book-writer-mobile-scenes__chip book-writer-mobile-scenes__chip--add"
              type="button"
              onClick={function () {
                onAddScene(scene.chapterId);
              }}
            >
              <strong>+ Szene</strong>
              <span>{sceneContext.chapter.title}</span>
            </button>
          </div>
        </section>

        <article className="book-writer-document">
          <header className="book-writer-document__header">
            <span className="book-writer-document__kicker">{sceneContext.act.title}</span>
            <h1>{sceneContext.chapter.title}</h1>
            <div className="book-writer-document__scene-meta">
              <span>{scene.title || `Szene ${scene.order}`}</span>
              <span>{scene.label || "ohne Label"}</span>
            </div>
          </header>

          <section className="book-writer-document__inspector">
            <label className="editor-field" title="Der interne Name der Szene (z.B. 'Jonas findet das Notizbuch').">
              <span>Szenentitel</span>
              <input
                className="editor-input"
                type="text"
                value={scene.title}
                onChange={function (event) {
                  onUpdateScene(function (currentScene) {
                    return {
                      ...currentScene,
                      title: event.target.value
                    };
                  });
                }}
              />
            </label>

            <label className="editor-field" title="Ein kurzes Schlagwort zur Einordnung (z.B. 'POV: LEON', 'Action', 'Twist').">
              <span>Label</span>
              <input
                className="editor-input"
                type="text"
                value={scene.label}
                onChange={function (event) {
                  onUpdateScene(function (currentScene) {
                    return {
                      ...currentScene,
                      label: event.target.value
                    };
                  });
                }}
              />
            </label>

            <label className="editor-field book-writer-document__summary" title="Die wichtigste Grundlage für die KI. Beschreibe hier kurz, was in der Szene passiert (Beats, Konflikt, Ergebnis).">
              <span>Summary</span>
              <textarea
                className="editor-textarea editor-textarea--summary"
                value={scene.summary}
                onChange={function (event) {
                  onUpdateScene(function (currentScene) {
                    return {
                      ...currentScene,
                      summary: event.target.value
                    };
                  });
                }}
              />
            </label>
          </section>

          <div className="book-writer-document__flow">
            {scene.blocks.map(function (block, index) {
              return (
                <article key={block.id} className="book-writer-paragraph">
                  <div className="book-writer-paragraph__meta">
                    <span>Absatz {index + 1}</span>
                    <span>{countWords(block.text)} Wörter</span>
                    <button
                      className="scene-block-card__remove"
                      type="button"
                      disabled={scene.blocks.length === 1}
                      onClick={function () {
                        onUpdateScene(function (currentScene) {
                          if (currentScene.blocks.length === 1) {
                            return currentScene;
                          }

                          return {
                            ...currentScene,
                            blocks: currentScene.blocks.filter(function (candidate) {
                              return candidate.id !== block.id;
                            })
                          };
                        });
                      }}
                    >
                      Entfernen
                    </button>
                  </div>

                  <textarea
                    className="book-writer-paragraph__textarea"
                    value={block.text}
                    placeholder="Schreibe hier den fortlaufenden Buchtext."
                    onChange={function (event) {
                      onUpdateScene(function (currentScene) {
                        return {
                          ...currentScene,
                          blocks: currentScene.blocks.map(function (candidate) {
                            if (candidate.id !== block.id) {
                              return candidate;
                            }

                            return {
                              ...candidate,
                              text: event.target.value
                            };
                          })
                        };
                      });
                    }}
                  />
                </article>
              );
            })}

            <div className="book-writer-document__actions">
              <button
                className="flat-button"
                type="button"
                onClick={function () {
                  onUpdateScene(function (currentScene) {
                    return {
                      ...currentScene,
                      blocks: currentScene.blocks.concat({
                        id: createBlockId(),
                        kind: "paragraph",
                        text: ""
                      })
                    };
                  });
                }}
              >
                + Absatz
              </button>
              <button className="flat-button" type="button" onClick={function () {
                onAddScene(scene.chapterId);
              }}>
                + Szene
              </button>
            </div>
          </div>
        </article>
      </main>

      <aside className="book-writer-rail">
        <section className="book-writer-card">
          <div className="book-writer-card__head">
            <div>
              <span className="scene-editor__eyebrow">Kontext</span>
              <h4>Schreibfokus</h4>
            </div>
          </div>

          <div className="book-writer-context-grid">
            <article className="book-mini-card">
              <strong>Vorher</strong>
              <p>{previousScene?.summary || "Diese Szene eröffnet den aktuellen Abschnitt."}</p>
            </article>
            <article className="book-mini-card">
              <strong>Nachher</strong>
              <p>{nextScene?.summary || "Nach dieser Szene endet der aktuelle Abschnitt."}</p>
            </article>
          </div>
        </section>

        <section className="book-writer-card book-writer-card--ai">
          <div className="book-writer-card__head">
            <div>
              <span className="scene-editor__eyebrow">AI Copilot</span>
              <h4>Opus 4.7</h4>
            </div>
          </div>

          <div className="book-writer-provider-grid">
            {PROVIDER_OPTIONS.map(function (option) {
              return (
                <button
                  key={option.id}
                  className={
                    "book-writer-provider" +
                    (jobProvider === option.id ? " book-writer-provider--active" : "")
                  }
                  type="button"
                  title={getProviderTooltip(option.id)}
                  onClick={function () {
                    setJobProvider(option.id);
                  }}
                >
                  <strong>{option.label}</strong>
                  <span>{option.detail}</span>
                </button>
              );
            })}
          </div>

          <div className="editor-grid">
            <label className="editor-field" title="Minimale Ziel-Wortzahl für diese Szene.">
              <span>Ziel min</span>
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

            <label className="editor-field" title="Maximale Ziel-Wortzahl für diese Szene.">
              <span>Ziel max</span>
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

          <label className="editor-field" title="Deine direkten Befehle an die KI für diesen spezifischen Durchlauf (z.B. 'Mehr Nebel', 'Klaus soll nervöser wirken').">
            <span>Regieanweisung</span>
            <textarea
              className="editor-textarea book-writer-director-note"
              value={directorNote}
              placeholder="Mehr Spannung, dichterer Stil, klarere Raumwahrnehmung."
              onChange={function (event) {
                const nextDirectorNote = event.target.value;

                onUpdateStory(function (currentStory) {
                  return updateSceneCardDirectorNote(currentStory, scene.id, nextDirectorNote);
                });
              }}
            />
          </label>

          <div className="book-writer-preset-row">
            {DIRECTOR_PRESETS.map(function (preset) {
              return (
                <button
                  key={preset}
                  className="book-writer-preset"
                  type="button"
                  onClick={function () {
                    onUpdateStory(function (currentStory) {
                      return updateSceneCardDirectorNote(currentStory, scene.id, preset);
                    });
                  }}
                >
                  {preset}
                </button>
              );
            })}
          </div>

          <div className="book-card__actions">
            <button
              className="flat-button flat-button--active"
              type="button"
              disabled={!contextPacket || isGeneratingJob || blockingDraftPreparationIssues.length > 0}
              onClick={handleGenerateJob}
            >
              {isGeneratingJob ? "Generiert..." : "Szene entwerfen"}
            </button>
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

          {jobStatus ? <p className="book-writer-status">{jobStatus}</p> : null}
        </section>

        <section className="book-writer-card">
          <div className="book-writer-card__head">
            <div>
              <span className="scene-editor__eyebrow">Output</span>
              <h4>Job für diese Szene</h4>
            </div>
            {activeJob ? (
              <div className="book-writer-job-meta">
                <span>{formatProviderLabel(activeJob.provider)}</span>
                <span>{formatExecutionModeLabel(activeJob.mode)}</span>
                <span>{activeJob.status}</span>
              </div>
            ) : null}
          </div>

          {activeJob ? (
            <>
              {draftJobs.length > 1 ? (
                <div className="pill-group" aria-label="Job history">
                  {draftJobs.map(function (job) {
                    return (
                      <button
                        key={job.id}
                        className={
                          "pill-button" + (activeJob.id === job.id ? " pill-button--active" : "")
                        }
                        type="button"
                        onClick={function () {
                          setSelectedJobId(job.id);
                        }}
                      >
                        {formatProviderLabel(job.provider)} · {formatJobTimestamp(job.updatedAt)}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <div className="pill-group" aria-label="AI panel view">
                {AI_PANEL_VIEWS.map(function (view) {
                  return (
                    <button
                      key={view.id}
                      className={
                        "pill-button" + (activePanelView === view.id ? " pill-button--active" : "")
                      }
                      type="button"
                      onClick={function () {
                        setActivePanelView(view.id);
                      }}
                    >
                      {view.label}
                    </button>
                  );
                })}
              </div>

              <div className="book-mini-list">
                {BOOK_DRAFT_STAGE_SEQUENCE.map(function (stageId) {
                  const stage = activeJob.stages[stageId];

                  return (
                    <article key={stageId} className="book-mini-card">
                      <strong>{formatStageLabel(stageId)}</strong>
                      <p>
                        {formatProviderLabel(stage.provider)} · {stage.status}
                        {stage.modelName ? ` · ${stage.modelName}` : ""}
                      </p>
                    </article>
                  );
                })}
              </div>

              {activePanelView === "draft" ? (
                <pre className="book-code-block book-writer-output">{activeJob.draftText}</pre>
              ) : activePanelView === "rewrite" ? (
                <pre className="book-code-block book-writer-output">{activeJob.rewriteText}</pre>
              ) : activePanelView === "friction" ? (
                <LiteraryFrictionPanel job={activeJob} />
              ) : activePanelView === "extract" ? (
                <div className="book-mini-list">
                  {buildExtractCards(activeJob).map(function (card) {
                    return (
                      <article key={card.title} className="book-mini-card">
                        <strong>{card.title}</strong>
                        <p>{card.content}</p>
                      </article>
                    );
                  })}
                </div>
              ) : activePanelView === "continuity" ? (
                <div className="book-mini-list">
                  {buildContinuityCards(activeJob).map(function (card) {
                    return (
                      <article key={card.title} className="book-mini-card">
                        <strong>{card.title}</strong>
                        <p>{card.content}</p>
                      </article>
                    );
                  })}
                </div>
              ) : activePanelView === "notes" ? (
                <div className="book-mini-list">
                  {activeJob.rewriteNotes.map(function (note, index) {
                    return (
                      <article key={`${activeJob.id}_note_${index}`} className="book-mini-card">
                        <p>{note}</p>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="book-mini-list">
                  {activeJob.outline.map(function (step, index) {
                    return (
                      <article key={`${activeJob.id}_outline_${index}`} className="book-mini-card">
                        <strong>Beat {index + 1}</strong>
                        <p>{step}</p>
                      </article>
                    );
                  })}
                </div>
              )}

              <div className="book-card__actions">
                <button
                  className="flat-button flat-button--active"
                  type="button"
                  onClick={function () {
                    handleAcceptJob(activeJob.id, "rewrite");
                  }}
                >
                  {activeJob.status === "accepted"
                    ? "Rewrite erneut übernehmen"
                    : "Rewrite übernehmen"}
                </button>
              </div>
            </>
          ) : (
            <article className="book-thread-card book-thread-card--empty">
              <strong>Noch kein KI-Job</strong>
              <p>
                Die Mitte bleibt dein Schreibbereich. Die KI ergänzt nur rechts als Werkzeugspur.
                Ohne API-Key landet der erste Lauf im lokalen Fallback.
              </p>
            </article>
          )}
        </section>
      </aside>

      <div className="book-writer-mobile-bar" aria-label="Schnellaktionen">
        <div className="book-writer-mobile-bar__status">
          <strong>{scene.title || `Szene ${scene.order}`}</strong>
          <span>
            {liveWordCount} Wörter · {saveLabel}
          </span>
        </div>
        <div className="book-writer-mobile-bar__actions">
          <button className="flat-button" type="button" onClick={onManualSave}>
            Speichern
          </button>
          <button
            className="flat-button"
            type="button"
            onClick={function () {
              onAddScene(scene.chapterId);
            }}
          >
            + Szene
          </button>
          <button
            className="flat-button flat-button--active"
            type="button"
            disabled={!contextPacket || isGeneratingJob}
            onClick={handleGenerateJob}
          >
            {isGeneratingJob ? "Läuft..." : "AI-Job"}
          </button>
        </div>
      </div>
    </section>
  );
}

function updateSceneCardDirectorNote(
  story: StoryDocument,
  sceneId: string,
  directorNote: string
) {
  const trimmedDirectorNote = directorNote.trim();
  const nextSceneCards = (story.book.memory.sceneCards.length
    ? story.book.memory.sceneCards
    : buildTimelineBeats(story)
  ).map(function (sceneCard) {
    if (sceneCard.sceneId !== sceneId) {
      return sceneCard;
    }

    const custom = sceneCard.directives.custom.filter(function (entry) {
      return entry.key !== "director_note";
    });
    const outline = sceneCard.outline.filter(function (line) {
      return !line.startsWith("director_note:");
    });

    if (trimmedDirectorNote) {
      custom.push({
        key: "director_note",
        value: trimmedDirectorNote
      });
      outline.push(`director_note: ${trimmedDirectorNote}`);
    }

    return {
      ...sceneCard,
      directives: {
        ...sceneCard.directives,
        custom
      },
      outline
    };
  });

  return {
    ...story,
    book: {
      ...story.book,
      memory: {
        ...story.book.memory,
        sceneCards: nextSceneCards
      }
    }
  };
}

function BookActNav({
  act,
  selectedSceneId,
  onSelectScene,
  onAddChapter,
  onAddScene,
  onDeleteAct,
  onDeleteChapter,
  onDeleteScene
}: {
  act: StoryAct;
  selectedSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onAddChapter: (actId: string) => void;
  onAddScene: (chapterId: string) => void;
  onDeleteAct: (actId: string) => void;
  onDeleteChapter: (chapterId: string) => void;
  onDeleteScene: (sceneId: string) => void;
}) {
  return (
    <section className="book-writer-nav__act">
      <div className="book-writer-nav__act-head">
        <h4>{act.title}</h4>
        <div className="book-writer-nav__actions">
          <button className="flat-button" type="button" onClick={function () {
            onAddChapter(act.id);
          }}>
            + Kapitel
          </button>
          <button
            className="sidebar-row-delete"
            type="button"
            title="Akt löschen"
            onClick={function () {
              onDeleteAct(act.id);
            }}
          >
            ×
          </button>
        </div>
      </div>

      <div className="book-writer-nav__chapter-list">
        {act.chapters.map(function (chapter) {
          return (
            <BookChapterNav
              key={chapter.id}
              chapter={chapter}
              selectedSceneId={selectedSceneId}
              onSelectScene={onSelectScene}
              onAddScene={onAddScene}
              onDeleteChapter={onDeleteChapter}
              onDeleteScene={onDeleteScene}
            />
          );
        })}
      </div>
    </section>
  );
}

function BookChapterNav({
  chapter,
  selectedSceneId,
  onSelectScene,
  onAddScene,
  onDeleteChapter,
  onDeleteScene
}: {
  chapter: StoryChapter;
  selectedSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onAddScene: (chapterId: string) => void;
  onDeleteChapter: (chapterId: string) => void;
  onDeleteScene: (sceneId: string) => void;
}) {
  return (
    <article className="book-writer-nav__chapter">
      <div className="book-writer-nav__chapter-head">
        <strong>{chapter.title}</strong>
        <div className="book-writer-nav__actions">
          <button className="flat-button" type="button" onClick={function () {
            onAddScene(chapter.id);
          }}>
            + Szene
          </button>
          <button
            className="sidebar-row-delete"
            type="button"
            title="Kapitel löschen"
            onClick={function () {
              onDeleteChapter(chapter.id);
            }}
          >
            ×
          </button>
        </div>
      </div>

      <div className="book-writer-nav__scene-list">
        {chapter.scenes.map(function (scene) {
          const isActive = scene.id === selectedSceneId;

          return (
            <div
              key={scene.id}
              className={
                "book-writer-nav__scene-row" +
                (isActive ? " book-writer-nav__scene-row--active" : "")
              }
            >
              <button
                className="book-writer-nav__scene"
                type="button"
                onClick={function () {
                  onSelectScene(scene.id);
                }}
              >
                <span>{scene.title}</span>
                <small>{scene.wordCount} Wörter</small>
              </button>
              <button
                className="sidebar-row-delete"
                type="button"
                title="Szene löschen"
                onClick={function () {
                  onDeleteScene(scene.id);
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function buildExtractCards(job: BookDraftJob) {
  return [
    {
      title: "Canon",
      content: job.extractedState.newCanonFacts.join(" | ") || "Keine neuen Canon-Facts."
    },
    {
      title: "Character State",
      content:
        job.extractedState.characterStateUpdates.join(" | ") || "Keine Character-Updates erkannt."
    },
    {
      title: "Open Threads",
      content:
        job.extractedState.openThreadsCreated.join(" | ") || "Keine neuen offenen Fäden erkannt."
    },
    {
      title: "Resolved Threads",
      content:
        job.extractedState.openThreadsResolved.join(" | ") ||
        "Keine aufgeloesten offenen Fäden erkannt."
    },
    {
      title: "Foreshadowing",
      content:
        job.extractedState.foreshadowingAdded.join(" | ") || "Kein neues Foreshadowing erkannt."
    }
  ];
}

function LiteraryFrictionPanel({ job }: { job: BookDraftJob }) {
  const report = job.literaryFrictionReport;

  if (!report) {
    return (
      <article className="book-mini-card">
        <strong>Kein Friction-Report</strong>
        <p>Für diesen Job liegt noch kein separater Literary-Friction-Pass vor.</p>
      </article>
    );
  }

  const scoreCards = [
    { title: "Image Strength", content: `${report.scores.imageStrength}/5` },
    { title: "Body Truth", content: `${report.scores.bodyTruth}/5` },
    { title: "Ambiguity", content: `${report.scores.ambiguity}/5` },
    { title: "Anti-Explanation", content: `${report.scores.antiExplanation}/5` },
    { title: "Sentence Variety", content: `${report.scores.sentenceVariety}/5` },
    { title: "Ending Strength", content: `${report.scores.endingStrength}/5` },
    { title: "Anti-Smoothness", content: `${report.scores.antiSmoothness}/5` },
    { title: "Voice Specificity", content: `${report.scores.voiceSpecificity}/5` }
  ];
  const detailCards = [
    {
      title: "Schutzstellen",
      content: report.protect.join(" | ") || "Keine Schutzstellen markiert."
    },
    {
      title: "Streichkandidaten",
      content: report.cutCandidates.join(" | ") || "Keine Streichkandidaten markiert."
    },
    {
      title: "Übererklärung",
      content: report.overExplanation.join(" | ") || "Keine offene Übererklärung markiert."
    },
    {
      title: "Musterwarnungen",
      content: report.patternWarnings.join(" | ") || "Keine Musterwarnungen markiert."
    },
    {
      title: "Abstraktionsdruck",
      content: report.abstractionFlags.join(" | ") || "Keine Abstraktionsmarker markiert."
    },
    {
      title: "Schlussprüfung",
      content: report.endingAssessment || "Kein separates Schluss-Assessment."
    },
    {
      title: "Mikro-Eingriffe",
      content: report.microEdits.join(" | ") || "Keine Mikro-Eingriffe notiert."
    }
  ];

  return (
    <div className="book-context-stack">
      <strong>Quality Scores</strong>
      <div className="book-mini-list">
        {scoreCards.map(function (card) {
          return (
            <article key={card.title} className="book-mini-card">
              <strong>{card.title}</strong>
              <p>{card.content}</p>
            </article>
          );
        })}
      </div>

      <strong>Friction Findings</strong>
      <div className="book-mini-list">
        {detailCards.map(function (card) {
          return (
            <article key={card.title} className="book-mini-card">
              <strong>{card.title}</strong>
              <p>{card.content}</p>
            </article>
          );
        })}
      </div>

      <strong>Revision</strong>
      <div className="book-mini-list">
        <article className="book-mini-card">
          <strong>Status</strong>
          <p>{report.needsRevision ? "Revision empfohlen." : "Kein Text-Eingriff nötig."}</p>
        </article>
        {job.literaryFrictionNotes?.length ? (
          <article className="book-mini-card">
            <strong>Stage Notes</strong>
            <p>{job.literaryFrictionNotes.join(" | ")}</p>
          </article>
        ) : null}
      </div>

      {job.literaryFrictionText ? (
        <Fragment>
          <strong>Friction Draft</strong>
          <pre className="book-code-block book-writer-output">{job.literaryFrictionText}</pre>
        </Fragment>
      ) : null}
    </div>
  );
}

function buildContinuityCards(job: BookDraftJob) {
  return [
    {
      title: "Continuity Risks",
      content:
        job.extractedState.continuityRisks.join(" | ") || "Keine unmittelbaren Continuity-Risiken."
    },
    {
      title: "Style Drift",
      content:
        job.extractedState.styleDriftNotes.join(" | ") || "Keine Style-Drift-Hinweise erkannt."
    },
    {
      title: "Stage Notes",
      content: job.stages.continuity.notes.join(" | ") || "Keine weiteren Continuity-Notizen."
    }
  ];
}

function findFirstSceneId(story: StoryDocument) {
  for (const act of story.acts) {
    for (const chapter of act.chapters) {
      const firstSceneId = chapter.scenes[0]?.id;

      if (firstSceneId) {
        return firstSceneId;
      }
    }
  }

  return "";
}

function formatProviderLabel(provider: BookDraftJob["provider"] | BookJobProviderOption) {
  if (provider === "openai") {
    return "OpenAI";
  }

  if (provider === "anthropic") {
    return "Anthropic";
  }

  if (provider === "duo") {
    return "Duo";
  }

  if (provider === "gemini") {
    return "Gemini";
  }

  if (provider === "groq") {
    return "Groq";
  }

  if (provider === "local") {
    return "Lokal";
  }

  return "Auto";
}

function getProviderTooltip(provider: BookJobProviderOption) {
  switch (provider) {
    case "anthropic":
      return "Alle normalen Book-Job-Stufen laufen fest über Claude Opus 4.7.";
    case "duo":
      return "Claude Opus schreibt die szenische Erstfassung. GPT 5.5 übernimmt Struktur-, Continuity-, Quality- und Literary-Friction-Pass.";
    default:
      return "";
  }
}

function formatExecutionModeLabel(mode: BookDraftJob["mode"]) {
  return mode === "remote" ? "Remote" : "Lokaler Fallback";
}

function formatJobTimestamp(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatStageLabel(stageId: (typeof BOOK_DRAFT_STAGE_SEQUENCE)[number]) {
  if (stageId === "context") {
    return "Kontext";
  }

  if (stageId === "beat_plan") {
    return "Beat-Plan";
  }

  if (stageId === "draft") {
    return "Entwurf";
  }

  if (stageId === "rewrite") {
    return "Rewrite";
  }

  if (stageId === "length_control") {
    return "Längensteuerung";
  }

  if (stageId === "extract") {
    return "Extrakt";
  }

  if (stageId === "continuity") {
    return "Kontinuität";
  }

  if (stageId === "literary_friction") {
    return "Literary Friction";
  }

  return "Quality Eval";
}

function createBlockId() {
  return createUuid();
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { BookJobModelFields } from "@/components/studio/book-job-model-fields";
import {
  BOOK_DRAFT_STAGE_SEQUENCE,
  acceptDraftJobToScene,
  buildSceneContextPacket,
  getDraftJobAcceptanceBlockers,
  getDraftJobsForScene,
  upsertDraftJob
} from "@/lib/book-engine";
import { createUuid } from "@/lib/id";
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
  analyzeBookDraftPreparation,
  countSceneWords,
  countStoryStats,
  countWords,
  normalizeBookDraftTargets,
  type BookDraftJob,
  type BookHumanEditLearningStatus,
  type SceneContext,
  type StoryAct,
  type StoryChapter,
  type StoryDocument,
  type StoryScene
} from "@/lib/story-schema";

type AiPanelView = "draft" | "rewrite" | "outline" | "notes" | "extract" | "continuity";

const PROVIDER_OPTIONS: Array<{ id: BookJobProviderOption; label: string; detail: string }> = [
  { id: "auto", label: "Auto", detail: "empfohlen" },
  { id: "openai", label: "OpenAI", detail: "präzise" },
  { id: "anthropic", label: "Anthropic", detail: "nuanciert" }
];

const DIRECTOR_PRESETS = [
  "Spannung enger ziehen und mit klarer Eskalation enden.",
  "Mehr Innenleben und emotionale Reibung der Hauptfigur zeigen.",
  "Sinnliche Details und räumliche Klarheit stärker ausarbeiten.",
  "Prosa straffen, Wiederholungen schneiden und Tempo erhöhen."
];

const AI_PANEL_VIEWS: Array<{ id: AiPanelView; label: string }> = [
  { id: "draft", label: "Draft" },
  { id: "rewrite", label: "Final" },
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
  const [jobProvider, setJobProvider] = useState<BookJobProviderOption>("auto");
  const [jobModels, setJobModels] = useState(createEmptyBookJobModelSelection);
  const [jobStatus, setJobStatus] = useState("");
  const [isGeneratingJob, setIsGeneratingJob] = useState(false);
  const [directorNote, setDirectorNote] = useState("");
  const [activePanelView, setActivePanelView] = useState<AiPanelView>("rewrite");

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

  const firstSceneId = useMemo(function () {
    return findFirstSceneId(story);
  }, [story.acts]);

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
  const humanEditExamples = story.book.memory.humanEditExamples.filter(function (example) {
    return example.sceneId === scene.id;
  });
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
          workspaceId: story.workspaceId,
          provider: jobProvider,
          modelOverrides: buildBookJobModelOverrides(jobModels),
          targetSceneWordsMin: normalizedDraftTargets.targetSceneWordsMin,
          targetSceneWordsMax: normalizedDraftTargets.targetSceneWordsMax,
          directorNote,
          humanEditLearningStatuses: story.book.memory.humanEditExamples.map(function (example) {
            return {
              id: example.id,
              learningStatus: example.learningStatus
            };
          })
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

  function handleAcceptJob(jobId: string) {
    let accepted = false;
    let blockers: string[] = [];

    flushSync(function () {
      onUpdateStory(function (currentStory) {
        blockers = getDraftJobAcceptanceBlockers(currentStory, jobId);

        if (blockers.length) {
          return currentStory;
        }

        const result = acceptDraftJobToScene(currentStory, jobId);
        accepted = Boolean(result);
        return result ? result.story : currentStory;
      });
    });

    setJobStatus(
      accepted
        ? "Finaler Job-Text in die aktuelle Szene übernommen. Human Edit Memory wird beim Speichern erfasst, wenn du danach bearbeitest."
        : blockers[0] || "Job-Text wurde nicht übernommen."
    );
  }

  function handleHumanEditLearningStatus(
    exampleId: string,
    learningStatus: BookHumanEditLearningStatus
  ) {
    const now = new Date().toISOString();

    onUpdateStory(function (currentStory) {
      return {
        ...currentStory,
        book: {
          ...currentStory.book,
          memory: {
            ...currentStory.book.memory,
            humanEditExamples: currentStory.book.memory.humanEditExamples.map(function (example) {
              if (example.id !== exampleId) {
                return example;
              }

              return {
                ...example,
                learningStatus,
                excludedReason: learningStatus === "excluded" ? "Manuell ausgeschlossen." : null,
                updatedAt: now
              };
            })
          }
        }
      };
    });
  }

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
              <h4>OpenAI, Anthropic, Gemini, Groq</h4>
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

          <BookJobModelFields
            provider={jobProvider}
            models={jobModels}
            onChangeModel={handleModelChange}
            onResetModel={handleModelReset}
          />

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
                setDirectorNote(event.target.value);
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
                    setDirectorNote(preset);
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
            {latestJob ? (
              <div className="book-writer-job-meta">
                <span>{formatProviderLabel(latestJob.provider)}</span>
                <span>{formatExecutionModeLabel(latestJob.mode)}</span>
                <span>{latestJob.status}</span>
              </div>
            ) : null}
          </div>

          {latestJob ? (
            <>
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
                  const stage = latestJob.stages[stageId];

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
                <pre className="book-code-block book-writer-output">{latestJob.draftText}</pre>
              ) : activePanelView === "rewrite" ? (
                <pre className="book-code-block book-writer-output">{latestJob.rewriteText}</pre>
              ) : activePanelView === "extract" ? (
                <div className="book-mini-list">
                  {buildExtractCards(latestJob).map(function (card) {
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
                  {buildContinuityCards(latestJob).map(function (card) {
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
                  {latestJob.rewriteNotes.map(function (note, index) {
                    return (
                      <article key={`${latestJob.id}_note_${index}`} className="book-mini-card">
                        <p>{note}</p>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="book-mini-list">
                  {formatDraftOutlineForDisplay(latestJob.outline).map(function (step, index) {
                    return (
                      <article key={`${latestJob.id}_outline_${index}`} className="book-mini-card">
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
                    handleAcceptJob(latestJob.id);
                  }}
                >
                  {latestJob.status === "accepted"
                    ? "Final erneut übernehmen"
                    : "Final übernehmen"}
                </button>
              </div>

              <section className="book-mini-card">
                <strong>Human Edit Memory</strong>
                <p>
                  Wird beim Speichern aus dem Unterschied zwischen übernommenem Job-Text und
                  deinem finalen Szenentext erfasst.
                </p>
                {humanEditExamples.length ? (
                  <div className="book-mini-list">
                    {humanEditExamples.map(function (example) {
                      const isIncluded = example.learningStatus === "included";

                      return (
                        <article key={example.id} className="book-thread-card">
                          <strong>{formatHumanEditStatusLabel(example.learningStatus)}</strong>
                          <p>{example.diffSummary.summary}</p>
                          <p>
                            {example.diffSummary.wordDelta > 0 ? "+" : ""}
                            {example.diffSummary.wordDelta} Wörter ·{" "}
                            {example.editTags.length ? example.editTags.join(", ") : "keine Tags"}
                          </p>
                          <div className="book-card__actions">
                            <button
                              className={"flat-button" + (isIncluded ? " flat-button--active" : "")}
                              type="button"
                              onClick={function () {
                                handleHumanEditLearningStatus(example.id, "included");
                              }}
                            >
                              Lernen aktiv
                            </button>
                            <button
                              className={"flat-button" + (!isIncluded ? " flat-button--active" : "")}
                              type="button"
                              onClick={function () {
                                handleHumanEditLearningStatus(example.id, "excluded");
                              }}
                            >
                              Nicht lernen
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p>Noch kein gespeichertes Human-Edit-Beispiel für diese Szene.</p>
                )}
              </section>
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

  if (provider === "local") {
    return "Lokal";
  }

  return "Auto";
}

function getProviderTooltip(provider: BookJobProviderOption) {
  switch (provider) {
    case "auto":
      return "Wählt automatisch das beste verfügbare Modell für die aktuelle Aufgabe.";
    case "openai":
      return "Nutzt OpenAI Modelle (z.B. GPT-5) für präzise und strukturierte Texte.";
    case "anthropic":
      return "Nutzt Anthropic Modelle (Claude) für besonders nuancierte und literarische Prosa.";
    default:
      return "";
  }
}

function formatExecutionModeLabel(mode: BookDraftJob["mode"]) {
  return mode === "remote" ? "Remote" : "Lokaler Fallback";
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

  return "Quality Eval";
}

function formatHumanEditStatusLabel(status: BookHumanEditLearningStatus) {
  if (status === "excluded") {
    return "Vom Learning ausgeschlossen";
  }

  if (status === "needs_review") {
    return "Review nötig";
  }

  return "Learning aktiv";
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
  druck: "Druck",
  core_action: "Kernaktion",
  coreaction: "Kernaktion",
  kern_aktion: "Kernaktion",
  kernaktion: "Kernaktion",
  dramatic_beat: "Wendung",
  dramaticbeat: "Wendung",
  beat: "Wendung",
  ending: "Ende",
  ende: "Ende",
  ausgang: "Ausgang",
  closing_line: "Schlussbild",
  closingline: "Schlussbild",
  letzter_satz: "Schlussbild",
  letztersatz: "Schlussbild"
};

function createBlockId() {
  return createUuid();
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { BookJobModelFields } from "@/components/studio/book-job-model-fields";
import {
  BOOK_DRAFT_STAGE_SEQUENCE,
  acceptDraftJobToScene,
  buildSceneContextPacket,
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
  countSceneWords,
  countStoryStats,
  countWords,
  type BookDraftJob,
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
  { id: "anthropic", label: "Anthropic", detail: "nuanciert" },
  { id: "gemini", label: "Gemini", detail: "schnell" },
  { id: "local", label: "Local", detail: "Fallback" }
];

const DIRECTOR_PRESETS = [
  "Spannung enger ziehen und mit klarer Eskalation enden.",
  "Mehr Innenleben und emotionale Reibung der Hauptfigur zeigen.",
  "Sinnliche Details und räumliche Klarheit stärker ausarbeiten.",
  "Prosa straffen, Wiederholungen schneiden und Tempo erhöhen."
];

const AI_PANEL_VIEWS: Array<{ id: AiPanelView; label: string }> = [
  { id: "draft", label: "Draft" },
  { id: "rewrite", label: "Rewrite" },
  { id: "extract", label: "Extract" },
  { id: "continuity", label: "Continuity" },
  { id: "notes", label: "Notes" },
  { id: "outline", label: "Outline" }
];

export function BookWriterPanel({
  story,
  sceneContext,
  selectedSceneId,
  onSelectScene,
  onAddAct,
  onAddChapter,
  onAddScene,
  onUpdateScene,
  onUpdateStory,
  onOpenBranchEditor
}: {
  story: StoryDocument;
  sceneContext: SceneContext | null;
  selectedSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onAddAct: () => void;
  onAddChapter: (actId: string) => void;
  onAddScene: (chapterId: string) => void;
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

  const draftJobs = useMemo(function () {
    if (!sceneContext) {
      return [];
    }

    return getDraftJobsForScene(story, sceneContext.scene.id);
  }, [sceneContext, story]);

  const firstSceneId = useMemo(function () {
    return story.acts[0]?.chapters[0]?.scenes[0]?.id ?? "";
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
              <button className="flat-button flat-button--active" type="button" onClick={onAddAct}>
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
  const sceneIndex = sceneContext.chapter.scenes.findIndex(function (candidate) {
    return candidate.id === scene.id;
  });
  const previousScene = sceneIndex > 0 ? sceneContext.chapter.scenes[sceneIndex - 1] : null;
  const nextScene =
    sceneIndex >= 0 && sceneIndex < sceneContext.chapter.scenes.length - 1
      ? sceneContext.chapter.scenes[sceneIndex + 1]
      : null;

  async function handleGenerateJob() {
    if (!contextPacket) {
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
          modelOverrides: buildBookJobModelOverrides(jobModels),
          targetSceneWordsMin: story.book.draftEngine.targetSceneWordsMin,
          targetSceneWordsMax: story.book.draftEngine.targetSceneWordsMax,
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
    onUpdateStory(function (currentStory) {
      const result = acceptDraftJobToScene(currentStory, jobId);
      return result ? result.story : currentStory;
    });

    setJobStatus("Rewrite in die aktuelle Szene übernommen.");
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
              <h4>OpenAI, Anthropic, Gemini</h4>
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

          <p className="book-writer-status">
            Ohne API-Key oder bei Provider-Fehlern wird der Copilot als lokaler Fallback ausgeführt.
          </p>

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
              disabled={!contextPacket || isGeneratingJob}
              onClick={handleGenerateJob}
            >
              {isGeneratingJob ? "Generiert..." : "Szene entwerfen"}
            </button>
          </div>

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
                  {latestJob.outline.map(function (step, index) {
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
    </section>
  );
}

function BookActNav({
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
    <section className="book-writer-nav__act">
      <div className="book-writer-nav__act-head">
        <h4>{act.title}</h4>
        <button className="flat-button" type="button" onClick={function () {
          onAddChapter(act.id);
        }}>
          + Kapitel
        </button>
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
  onAddScene
}: {
  chapter: StoryChapter;
  selectedSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onAddScene: (chapterId: string) => void;
}) {
  return (
    <article className="book-writer-nav__chapter">
      <div className="book-writer-nav__chapter-head">
        <strong>{chapter.title}</strong>
        <button className="flat-button" type="button" onClick={function () {
          onAddScene(chapter.id);
        }}>
          + Szene
        </button>
      </div>

      <div className="book-writer-nav__scene-list">
        {chapter.scenes.map(function (scene) {
          return (
            <button
              key={scene.id}
              className={
                "book-writer-nav__scene" +
                (scene.id === selectedSceneId ? " book-writer-nav__scene--active" : "")
              }
              type="button"
              onClick={function () {
                onSelectScene(scene.id);
              }}
            >
              <span>{scene.title}</span>
              <small>{scene.wordCount} Wörter</small>
            </button>
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

function formatProviderLabel(provider: BookDraftJob["provider"] | BookJobProviderOption) {
  if (provider === "openai") {
    return "OpenAI";
  }

  if (provider === "anthropic") {
    return "Anthropic";
  }

  if (provider === "gemini") {
    return "Gemini";
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
    case "gemini":
      return "Nutzt Google Gemini Modelle für extrem schnelle Antworten und große Kontexte.";
    case "local":
      return "Führt den Job lokal aus (nur für Tests oder bei fehlenden API-Keys).";
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

  if (stageId === "outline") {
    return "Outline";
  }

  if (stageId === "draft") {
    return "Entwurf";
  }

  if (stageId === "extract") {
    return "Extrakt";
  }

  if (stageId === "continuity") {
    return "Kontinuität";
  }

  return "Rewrite";
}

function createBlockId() {
  return createUuid();
}

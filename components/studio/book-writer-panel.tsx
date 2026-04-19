"use client";

import { useEffect, useMemo, useState } from "react";
import {
  acceptDraftJobToScene,
  buildSceneContextPacket,
  getDraftJobsForScene,
  upsertDraftJob
} from "@/lib/book-engine";
import { createUuid } from "@/lib/id";
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

type JobProviderOption = "auto" | "openai" | "anthropic" | "gemini" | "local";
type AiPanelView = "rewrite" | "outline" | "notes" | "extract";

const PROVIDER_OPTIONS: Array<{ id: JobProviderOption; label: string; detail: string }> = [
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
  { id: "rewrite", label: "Rewrite" },
  { id: "outline", label: "Outline" },
  { id: "notes", label: "Notes" },
  { id: "extract", label: "Extract" }
];
const BOOK_JOB_PROVIDER_STORAGE_KEY = "ember-book-job-provider";

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
  const [jobProvider, setJobProvider] = useState<JobProviderOption>("auto");
  const [jobStatus, setJobStatus] = useState("");
  const [isGeneratingJob, setIsGeneratingJob] = useState(false);
  const [directorNote, setDirectorNote] = useState("");
  const [activePanelView, setActivePanelView] = useState<AiPanelView>("rewrite");

  useEffect(function () {
    const storedProvider = window.localStorage.getItem(BOOK_JOB_PROVIDER_STORAGE_KEY);

    if (
      storedProvider === "auto" ||
      storedProvider === "openai" ||
      storedProvider === "anthropic" ||
      storedProvider === "gemini" ||
      storedProvider === "local"
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

  const draftJobs = useMemo(function () {
    if (!sceneContext) {
      return [];
    }

    return getDraftJobsForScene(story, sceneContext.scene.id);
  }, [sceneContext, story]);

  if (!sceneContext) {
    return (
      <section className="book-writer-shell">
        <div className="book-writer-empty">
          <span className="scene-editor__eyebrow">Book Writer</span>
          <h3>Keine Szene ausgewählt</h3>
          <p>Wähle links eine Szene aus, um in der Mitte im Manuskriptmodus zu schreiben.</p>
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
      const executionLabel = formatExecutionModeLabel((payload.job as BookDraftJob).mode);
      setJobStatus(
        payload.warning
          ? `${formatProviderLabel(payload.provider)} · ${executionLabel}: ${payload.warning}`
          : `Job erzeugt via ${formatProviderLabel(payload.provider)} · ${executionLabel}.`
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

  return (
    <section className="book-writer-shell" aria-label="Book Writer">
      <aside className="book-writer-nav">
        <div className="book-writer-nav__header">
          <span className="scene-editor__eyebrow">Full Manuscript</span>
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
            <label className="editor-field">
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

            <label className="editor-field">
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

            <label className="editor-field book-writer-document__summary">
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

          <div className="editor-grid">
            <label className="editor-field">
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

            <label className="editor-field">
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

          <label className="editor-field">
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

              {activePanelView === "rewrite" ? (
                <pre className="book-code-block book-writer-output">{latestJob.rewriteText}</pre>
              ) : activePanelView === "outline" ? (
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
                  {buildExtractCards(latestJob).map(function (card) {
                    return (
                      <article key={card.title} className="book-mini-card">
                        <strong>{card.title}</strong>
                        <p>{card.content}</p>
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
      title: "Continuity Risks",
      content:
        job.extractedState.continuityRisks.join(" | ") || "Keine unmittelbaren Continuity-Risiken."
    }
  ];
}

function formatProviderLabel(provider: BookDraftJob["provider"] | JobProviderOption) {
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
    return "Local";
  }

  return "Auto";
}

function formatExecutionModeLabel(mode: BookDraftJob["mode"]) {
  return mode === "remote" ? "Remote" : "Lokaler Fallback";
}

function createBlockId() {
  return createUuid();
}

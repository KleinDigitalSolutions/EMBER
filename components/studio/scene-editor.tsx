"use client";

import { useMemo } from "react";
import {
  countSceneWords,
  countWords,
  getAllScenes,
  type ChoiceCondition,
  type ChoiceEffect,
  type SceneContext,
  type StoryChoice,
  type StoryDocument,
  type StoryScene,
  type StoryVariable
} from "@/lib/story-schema";
import { createUuid } from "@/lib/id";

export function SceneEditor({
  story,
  sceneContext,
  onUpdateScene
}: {
  story: StoryDocument;
  sceneContext: SceneContext | null;
  onUpdateScene: (updater: (scene: StoryScene) => StoryScene) => void;
}) {
  const allScenes = useMemo(function () {
    return getAllScenes(story);
  }, [story]);

  const sceneIndex = useMemo(function () {
    return new Map(
      allScenes.map(function (scene) {
        return [scene.id, scene];
      })
    );
  }, [allScenes]);

  if (!sceneContext) {
    return (
      <aside className="scene-editor scene-editor--empty">
        <div className="scene-editor__empty">
          <span className="scene-editor__eyebrow">Scene Editor</span>
          <h3>Keine Szene ausgewählt</h3>
          <p>
            Wähle links eine Szene aus, um Titel, Summary, Absatzblöcke und
            Decision Slots zu bearbeiten.
          </p>
        </div>
      </aside>
    );
  }

  const scene = sceneContext.scene;
  const liveWordCount = countSceneWords(scene);
  const decisionHealth = getDecisionHealth(scene);
  const availableTargetScenes = allScenes.filter(function (candidate) {
    return candidate.id !== scene.id;
  });

  return (
    <aside className="scene-editor" aria-label="Scene Editor">
      <div className="scene-editor__header">
        <div>
          <span className="scene-editor__eyebrow">Scene Editor</span>
          <h3>{scene.title || "Untitled Scene"}</h3>
          <p>
            {sceneContext.act.title} · {sceneContext.chapter.title}
          </p>
        </div>
        <div className="scene-editor__pills">
          <span className="scene-editor__pill">{scene.id}</span>
          <span className="scene-editor__pill">{liveWordCount} Wörter</span>
          <span className="scene-editor__pill">{scene.choices.length} Choices</span>
        </div>
      </div>

      <div className="scene-editor__content">
        <section className="scene-editor__section">
          <div className="scene-editor__section-head">
            <div>
              <h4>Szene</h4>
              <p>Metadaten und inhaltlicher Fokus der aktuellen Szene.</p>
            </div>
          </div>

          <div className="editor-grid">
            <label className="editor-field">
              <span>Titel</span>
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
          </div>

          <label className="editor-field">
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

        <section className="scene-editor__section">
          <div className="scene-editor__section-head">
            <div>
              <h4>Absätze</h4>
              <p>Das eigentliche Scene Writing bleibt blockbasiert im Schema.</p>
            </div>
            <button
              className="flat-button"
              type="button"
              onClick={function () {
                onUpdateScene(function (currentScene) {
                  return {
                    ...currentScene,
                    blocks: currentScene.blocks.concat({
                      id: createBlockId(currentScene),
                      kind: "paragraph",
                      text: ""
                    })
                  };
                });
              }}
            >
              + Absatz
            </button>
          </div>

          <div className="scene-block-stack">
            {scene.blocks.map(function (block, index) {
              return (
                <article key={block.id} className="scene-block-card">
                  <div className="scene-block-card__head">
                    <div>
                      <strong>Absatz {index + 1}</strong>
                      <span>{countWords(block.text)} Wörter</span>
                    </div>
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
                    className="editor-textarea editor-textarea--block"
                    value={block.text}
                    placeholder="Schreibe hier den eigentlichen Szenentext."
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
          </div>
        </section>

        <section className="scene-editor__section">
          <div className="scene-editor__section-head">
            <div>
              <h4>Decision Slots</h4>
              <p>
                Choices werden jetzt direkt auf Szenenebene bearbeitet, inklusive
                Zielpfad, Conditions und Effects.
              </p>
            </div>
            <button
              className="flat-button"
              type="button"
              onClick={function () {
                onUpdateScene(function (currentScene) {
                  const fallbackTarget =
                    currentScene.choices[0]?.toSceneId ??
                    availableTargetScenes[0]?.id ??
                    currentScene.id;

                  return {
                    ...currentScene,
                    choices: currentScene.choices.concat({
                      id: createChoiceId(currentScene),
                      label: "",
                      toSceneId: fallbackTarget,
                      conditions: [],
                      effects: []
                    })
                  };
                });
              }}
            >
              + Decision Slot
            </button>
          </div>

          <article className="decision-health-card">
            <div className="decision-health-card__head">
              <strong>{decisionHealth.title}</strong>
              <span className={"decision-health-card__badge decision-health-card__badge--" + decisionHealth.tone}>
                {decisionHealth.badge}
              </span>
            </div>
            <p>{decisionHealth.description}</p>
          </article>

          {scene.choices.length ? (
            <div className="scene-choice-stack">
              {scene.choices.map(function (choice, index) {
                return (
                  <article key={choice.id} className="scene-choice-card scene-choice-card--editor">
                    <div className="scene-choice-card__head">
                      <div>
                        <strong>Choice {index + 1}</strong>
                        <span>
                          Ziel: {sceneIndex.get(choice.toSceneId)?.title ?? choice.toSceneId}
                        </span>
                      </div>
                      <button
                        className="scene-block-card__remove"
                        type="button"
                        onClick={function () {
                          onUpdateScene(function (currentScene) {
                            return {
                              ...currentScene,
                              choices: currentScene.choices.filter(function (candidate) {
                                return candidate.id !== choice.id;
                              })
                            };
                          });
                        }}
                      >
                        Entfernen
                      </button>
                    </div>

                    <div className="editor-grid">
                      <label className="editor-field">
                        <span>Choice Text</span>
                        <input
                          className="editor-input"
                          type="text"
                          value={choice.label}
                          placeholder="Was sieht der Leser als Entscheidung?"
                          onChange={function (event) {
                            updateChoice(choice.id, onUpdateScene, function (currentChoice) {
                              return {
                                ...currentChoice,
                                label: event.target.value
                              };
                            });
                          }}
                        />
                      </label>

                      <label className="editor-field">
                        <span>Zielszene</span>
                        <select
                          className="editor-input editor-select"
                          value={choice.toSceneId}
                          onChange={function (event) {
                            updateChoice(choice.id, onUpdateScene, function (currentChoice) {
                              return {
                                ...currentChoice,
                                toSceneId: event.target.value
                              };
                            });
                          }}
                        >
                          {availableTargetScenes.map(function (candidate) {
                            return (
                              <option key={candidate.id} value={candidate.id}>
                                {candidate.title} ({candidate.id})
                              </option>
                            );
                          })}
                        </select>
                      </label>
                    </div>

                    <div className="scene-choice-card__rules scene-choice-card__rules--editor">
                      <RuleEditor
                        title="Conditions"
                        emptyLabel="Diese Choice ist immer sichtbar."
                        items={choice.conditions}
                        variables={story.variables}
                        onAdd={function () {
                          updateChoice(choice.id, onUpdateScene, function (currentChoice) {
                            return {
                              ...currentChoice,
                              conditions: currentChoice.conditions.concat(
                                createCondition(story.variables)
                              )
                            };
                          });
                        }}
                        onRemove={function (itemIndex) {
                          updateChoice(choice.id, onUpdateScene, function (currentChoice) {
                            return {
                              ...currentChoice,
                              conditions: currentChoice.conditions.filter(function (_, indexValue) {
                                return indexValue !== itemIndex;
                              })
                            };
                          });
                        }}
                        onUpdate={function (itemIndex, nextItem) {
                          updateChoice(choice.id, onUpdateScene, function (currentChoice) {
                            return {
                              ...currentChoice,
                              conditions: currentChoice.conditions.map(function (item, indexValue) {
                                return indexValue === itemIndex ? nextItem : item;
                              })
                            };
                          });
                        }}
                        formatPreview={function (item) {
                          return formatCondition(item, story.variables);
                        }}
                        getValue={function (item) {
                          return item.equals;
                        }}
                        getVariableKey={function (item) {
                          return item.variableKey;
                        }}
                        createNext={function (variableKey, value) {
                          return {
                            variableKey,
                            equals: value
                          };
                        }}
                      />

                      <RuleEditor
                        title="Effects"
                        emptyLabel="Diese Choice setzt aktuell keine Flags."
                        items={choice.effects}
                        variables={story.variables}
                        onAdd={function () {
                          updateChoice(choice.id, onUpdateScene, function (currentChoice) {
                            return {
                              ...currentChoice,
                              effects: currentChoice.effects.concat(createEffect(story.variables))
                            };
                          });
                        }}
                        onRemove={function (itemIndex) {
                          updateChoice(choice.id, onUpdateScene, function (currentChoice) {
                            return {
                              ...currentChoice,
                              effects: currentChoice.effects.filter(function (_, indexValue) {
                                return indexValue !== itemIndex;
                              })
                            };
                          });
                        }}
                        onUpdate={function (itemIndex, nextItem) {
                          updateChoice(choice.id, onUpdateScene, function (currentChoice) {
                            return {
                              ...currentChoice,
                              effects: currentChoice.effects.map(function (item, indexValue) {
                                return indexValue === itemIndex ? nextItem : item;
                              })
                            };
                          });
                        }}
                        formatPreview={function (item) {
                          return formatEffect(item, story.variables);
                        }}
                        getValue={function (item) {
                          return item.setTo;
                        }}
                        getVariableKey={function (item) {
                          return item.variableKey;
                        }}
                        createNext={function (variableKey, value) {
                          return {
                            variableKey,
                            setTo: value
                          };
                        }}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="scene-choice-empty">
              <strong>Noch keine Entscheidung</strong>
              <p>
                Diese Szene endet aktuell linear. Lege einen Decision Slot an,
                wenn hier ein echter Leser-Entscheidungspunkt entstehen soll.
              </p>
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}

function RuleEditor<T extends ChoiceCondition | ChoiceEffect>({
  title,
  emptyLabel,
  items,
  variables,
  onAdd,
  onRemove,
  onUpdate,
  formatPreview,
  getValue,
  getVariableKey,
  createNext
}: {
  title: string;
  emptyLabel: string;
  items: T[];
  variables: StoryVariable[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, nextItem: T) => void;
  formatPreview: (item: T) => string;
  getValue: (item: T) => boolean | string | number;
  getVariableKey: (item: T) => string;
  createNext: (variableKey: string, value: boolean | string | number) => T;
}) {
  return (
    <div className="scene-choice-card__rule-group scene-choice-card__rule-group--editor">
      <div className="scene-choice-card__rule-toolbar">
        <span>{title}</span>
        <button className="scene-choice-card__add-rule" type="button" onClick={onAdd}>
          + Regel
        </button>
      </div>

      {items.length ? (
        <div className="scene-rule-stack">
          {items.map(function (item, index) {
            const variable =
              variables.find(function (candidate) {
                return candidate.key === getVariableKey(item);
              }) ?? variables[0];

            const variableKey = variable?.key ?? getVariableKey(item);
            const ruleValue = getValue(item);

            return (
              <article key={title + "_" + index} className="scene-rule-card">
                <div className="scene-rule-card__head">
                  <strong>{formatPreview(item)}</strong>
                  <button
                    className="scene-block-card__remove"
                    type="button"
                    onClick={function () {
                      onRemove(index);
                    }}
                  >
                    Entfernen
                  </button>
                </div>

                <div className="scene-rule-card__controls">
                  <label className="editor-field">
                    <span>Variable</span>
                    <select
                      className="editor-input editor-select"
                      value={variableKey}
                      onChange={function (event) {
                        const nextVariable =
                          variables.find(function (candidate) {
                            return candidate.key === event.target.value;
                          }) ?? variable;

                        onUpdate(
                          index,
                          createNext(
                            nextVariable.key,
                            normalizeValueForVariable(nextVariable, nextVariable.defaultValue)
                          )
                        );
                      }}
                    >
                      {variables.map(function (candidate) {
                        return (
                          <option key={candidate.id} value={candidate.key}>
                            {candidate.label}
                          </option>
                        );
                      })}
                    </select>
                  </label>

                  <label className="editor-field">
                    <span>Wert</span>
                    <input
                      className="editor-input"
                      type={getInputType(variable)}
                      value={String(ruleValue)}
                      onChange={function (event) {
                        onUpdate(
                          index,
                          createNext(
                            variableKey,
                            normalizeValueForVariable(variable, event.target.value)
                          )
                        );
                      }}
                    />
                  </label>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p>{emptyLabel}</p>
      )}
    </div>
  );
}

function updateChoice(
  choiceId: string,
  onUpdateScene: (updater: (scene: StoryScene) => StoryScene) => void,
  updater: (choice: StoryChoice) => StoryChoice
) {
  onUpdateScene(function (currentScene) {
    return {
      ...currentScene,
      choices: currentScene.choices.map(function (choice) {
        return choice.id === choiceId ? updater(choice) : choice;
      })
    };
  });
}

function getDecisionHealth(scene: StoryScene) {
  if (!scene.choices.length) {
    return {
      title: "Lineare Szene",
      badge: "Kein Slot",
      tone: "muted",
      description:
        "Aktuell gibt es hier keinen Leserentscheid. Das ist in Ordnung, wenn die Szene nur Setup, Payoff oder Verdichtung leisten soll."
    };
  }

  const uniqueTargetCount = new Set(
    scene.choices.map(function (choice) {
      return choice.toSceneId;
    })
  ).size;

  if (scene.choices.length > 1 && uniqueTargetCount === 1) {
    return {
      title: "Möglicher Fake-Choice",
      badge: "Warnung",
      tone: "warning",
      description:
        "Mehrere Choices führen aktuell in dieselbe Zielszene. Das kann bewusst sein, wirkt aber schnell wie eine kosmetische Auswahl ohne Konsequenz."
    };
  }

  if (scene.choices.length === 1) {
    return {
      title: "Single Exit",
      badge: "Linear+",
      tone: "muted",
      description:
        "Die Szene hat nur einen Ausgang. Gut für Flow-Kontrolle, aber noch kein echter Entscheidungsmoment."
    };
  }

  if (scene.choices.length === 2) {
    return {
      title: "Klarer Entscheidungspunkt",
      badge: "Gut",
      tone: "positive",
      description:
        "Zwei Choices sind meist gut lesbar und dramaturgisch stark, solange Conditions und Effects zu spürbaren Konsequenzen führen."
    };
  }

  return {
    title: "Breite Verzweigung",
    badge: "Komplex",
    tone: "warning",
    description:
      "Viele Choices erhöhen die Branch-Kosten. Prüfe, ob alle Optionen wirklich unterschiedlich sind oder ob du später wieder sauber konvergieren musst."
  };
}

function createBlockId(scene: StoryScene) {
  return createUuid();
}

function createChoiceId(scene: StoryScene) {
  return createUuid();
}

function createCondition(variables: StoryVariable[]): ChoiceCondition {
  const variable = variables[0];

  return {
    variableKey: variable.key,
    equals: normalizeValueForVariable(variable, variable.defaultValue)
  };
}

function createEffect(variables: StoryVariable[]): ChoiceEffect {
  const variable = variables[0];

  return {
    variableKey: variable.key,
    setTo: normalizeValueForVariable(variable, variable.defaultValue)
  };
}

function formatCondition(condition: ChoiceCondition, variables: StoryVariable[]) {
  return (
    lookupVariableLabel(variables, condition.variableKey) +
    " = " +
    formatStoryValue(condition.equals)
  );
}

function formatEffect(effect: ChoiceEffect, variables: StoryVariable[]) {
  return (
    lookupVariableLabel(variables, effect.variableKey) +
    " -> " +
    formatStoryValue(effect.setTo)
  );
}

function lookupVariableLabel(variables: StoryVariable[], key: string) {
  return (
    variables.find(function (variable) {
      return variable.key === key;
    })?.label ?? key
  );
}

function formatStoryValue(value: boolean | string | number) {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return String(value);
}

function getInputType(variable: StoryVariable | undefined) {
  if (variable?.type === "number") {
    return "number";
  }

  return "text";
}

function normalizeValueForVariable(
  variable: StoryVariable | undefined,
  rawValue: boolean | string | number
) {
  if (!variable) {
    return rawValue;
  }

  if (variable.type === "boolean") {
    if (typeof rawValue === "boolean") {
      return rawValue;
    }

    return String(rawValue).toLowerCase() === "true";
  }

  if (variable.type === "number") {
    if (typeof rawValue === "number") {
      return rawValue;
    }

    const numericValue = Number(rawValue);
    return Number.isFinite(numericValue) ? numericValue : 0;
  }

  return String(rawValue);
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  findSceneContext,
  getAllScenes,
  type ChoiceCondition,
  type ChoiceEffect,
  type StoryChoice,
  type StoryDocument,
  type StoryScene
} from "@/lib/story-schema";

type RuntimeValue = boolean | string | number;
type VariableState = Record<string, RuntimeValue>;
type PlaytestIssueLevel = "error" | "warning" | "info";

type PlaytestStep = {
  sceneId: string;
  choiceId: string | null;
  choiceLabel: string | null;
};

type ChoiceRuntimeState = {
  choice: StoryChoice;
  conditionsMet: boolean;
  hasValidTarget: boolean;
  targetTitle: string;
  reason: string | null;
};

type PlaytestIssue = {
  id: string;
  level: PlaytestIssueLevel;
  title: string;
  detail: string;
};

type RoutePreview = {
  id: string;
  summary: string;
};

type PlaytestAnalysis = {
  sceneCount: number;
  choiceCount: number;
  reachableCount: number;
  endingCount: number;
  branchingCount: number;
  brokenChoiceCount: number;
  issues: PlaytestIssue[];
  routePreviews: RoutePreview[];
};

export function PlaytestPanel({
  story,
  selectedSceneId
}: {
  story: StoryDocument;
  selectedSceneId: string;
}) {
  const scenes = useMemo(function () {
    return getAllScenes(story);
  }, [story]);

  const sceneIndex = useMemo(function () {
    return new Map(
      scenes.map(function (scene) {
        return [scene.id, scene];
      })
    );
  }, [scenes]);

  const initialSceneId = scenes[0]?.id ?? "";

  const initialVariables = useMemo(function () {
    return getInitialVariables(story);
  }, [story]);

  const analysis = useMemo(function () {
    return analyzePlaytest(story);
  }, [story]);

  const [currentSceneId, setCurrentSceneId] = useState(initialSceneId);
  const [variableState, setVariableState] = useState<VariableState>(initialVariables);
  const [history, setHistory] = useState<PlaytestStep[]>([]);

  useEffect(
    function () {
      restartFromScene(initialSceneId);
    },
    [story.id, initialSceneId]
  );

  useEffect(
    function () {
      setVariableState(function (currentState) {
        return syncVariableState(currentState, story);
      });

      if (currentSceneId && sceneIndex.has(currentSceneId)) {
        return;
      }

      if (initialSceneId) {
        restartFromScene(initialSceneId);
      }
    },
    [currentSceneId, initialSceneId, sceneIndex, story]
  );

  const currentContext = useMemo(function () {
    return currentSceneId ? findSceneContext(story, currentSceneId) : null;
  }, [currentSceneId, story]);

  const currentScene = currentContext?.scene ?? null;

  const choices = useMemo(function () {
    if (!currentScene) {
      return [];
    }

    return currentScene.choices.map(function (choice) {
      const conditionsMet = areConditionsMet(choice.conditions, variableState);
      const targetScene = sceneIndex.get(choice.toSceneId);

      return {
        choice,
        conditionsMet,
        hasValidTarget: Boolean(targetScene),
        targetTitle: targetScene?.title ?? "Fehlendes Ziel",
        reason: getChoiceReason(choice, conditionsMet, targetScene?.title ?? null)
      };
    });
  }, [currentScene, sceneIndex, variableState]);

  const availableChoices = choices.filter(function (choiceState) {
    return choiceState.conditionsMet && choiceState.hasValidTarget;
  });

  const changedVariables = story.variables.filter(function (variable) {
    return variableState[variable.key] !== variable.defaultValue;
  });

  const canStartFromSelection = Boolean(selectedSceneId && sceneIndex.has(selectedSceneId));

  function restartFromScene(sceneId: string) {
    setCurrentSceneId(sceneId);
    setVariableState(initialVariables);
    setHistory(
      sceneId
        ? [
            {
              sceneId,
              choiceId: null,
              choiceLabel: null
            }
          ]
        : []
    );
  }

  function handleChoice(choiceState: ChoiceRuntimeState) {
    if (!choiceState.conditionsMet || !choiceState.hasValidTarget) {
      return;
    }

    const nextVariables = applyChoiceEffects(variableState, choiceState.choice.effects);

    setVariableState(nextVariables);
    setCurrentSceneId(choiceState.choice.toSceneId);
    setHistory(function (currentHistory) {
      return currentHistory.concat({
        sceneId: choiceState.choice.toSceneId,
        choiceId: choiceState.choice.id,
        choiceLabel: choiceState.choice.label || "Unbenannte Choice"
      });
    });
  }

  if (!currentScene) {
    return (
      <aside className="playtest-panel playtest-panel--empty">
        <div className="playtest-empty">
          <span className="scene-editor__eyebrow">Playtest</span>
          <h3>Keine Szene zum Testen vorhanden</h3>
          <p>Lege zuerst mindestens eine Szene an, damit der lokale Reader starten kann.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="playtest-panel" aria-label="Playtest Panel">
      <div className="playtest-panel__header">
        <div>
          <span className="scene-editor__eyebrow">Playtest</span>
          <h3>Lokaler Reader für den aktuellen Draft</h3>
          <p>
            Spiele den TypeScript-Draft direkt im Studio durch, ohne den Legacy-Reader
            zu verlassen.
          </p>
        </div>
        <div className="playtest-panel__actions">
          <button
            className="flat-button"
            type="button"
            onClick={function () {
              restartFromScene(initialSceneId);
            }}
          >
            Neu starten
          </button>
          <button
            className="flat-button"
            type="button"
            disabled={!canStartFromSelection}
            onClick={function () {
              if (!selectedSceneId) {
                return;
              }

              restartFromScene(selectedSceneId);
            }}
          >
            Ab Auswahl testen
          </button>
          <Link href="/story" className="flat-button topbar-link">
            Legacy-Reader
          </Link>
        </div>
      </div>

      <div className="playtest-panel__content">
        <section className="playtest-card playtest-card--metrics">
          <div className="playtest-metrics">
            <Metric label="Szenen" value={analysis.sceneCount} />
            <Metric label="Erreichbar" value={`${analysis.reachableCount}/${analysis.sceneCount}`} />
            <Metric label="Enden" value={analysis.endingCount} />
            <Metric label="Branches" value={analysis.branchingCount} />
            <Metric label="Choice-Fehler" value={analysis.brokenChoiceCount} />
          </div>

          <div className="playtest-issues">
            {analysis.issues.length ? (
              analysis.issues.slice(0, 6).map(function (issue) {
                return (
                  <article
                    key={issue.id}
                    className={`playtest-issue playtest-issue--${issue.level}`}
                  >
                    <strong>{issue.title}</strong>
                    <p>{issue.detail}</p>
                  </article>
                );
              })
            ) : (
              <article className="playtest-issue playtest-issue--positive">
                <strong>Keine statischen Playtest-Blocker</strong>
                <p>Alle Choice-Ziele und Variable-Referenzen sind im aktuellen Draft auflösbar.</p>
              </article>
            )}
          </div>

          {analysis.routePreviews.length ? (
            <div className="playtest-route-list">
              <span className="playtest-card__label">Beispielpfade</span>
              {analysis.routePreviews.map(function (route) {
                return (
                  <div key={route.id} className="playtest-route">
                    {route.summary}
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>

        <section className="playtest-card">
          <div className="playtest-card__head">
            <div>
              <span className="playtest-card__label">Aktuelle Szene</span>
              <h4>{currentScene.title || "Untitled Scene"}</h4>
            </div>
            <div className="playtest-card__meta">
              <span>{currentContext?.act.title}</span>
              <span>{currentContext?.chapter.title}</span>
              <span>{history.length - 1} Schritte</span>
            </div>
          </div>

          <p className="playtest-scene-summary">{currentScene.summary || "Keine Summary hinterlegt."}</p>

          <div className="playtest-scene-blocks">
            {currentScene.blocks.map(function (block) {
              return (
                <p key={block.id} className="playtest-scene-block">
                  {block.text.trim() || "Leerer Absatzblock"}
                </p>
              );
            })}
          </div>

          <div className="playtest-choice-stack">
            {choices.length ? (
              choices.map(function (choiceState) {
                return (
                  <button
                    key={choiceState.choice.id}
                    className="playtest-choice"
                    disabled={!choiceState.conditionsMet || !choiceState.hasValidTarget}
                    onClick={function () {
                      handleChoice(choiceState);
                    }}
                    type="button"
                  >
                    <div>
                      <strong>{choiceState.choice.label || "Unbenannte Choice"}</strong>
                      <span>{choiceState.targetTitle}</span>
                    </div>
                    <p>{choiceState.reason ?? "Choice ist spielbar."}</p>
                  </button>
                );
              })
            ) : (
              <div className="playtest-terminal">
                <strong>Terminale Szene</strong>
                <p>Diese Szene hat aktuell keine weiteren Choices und beendet den Run hier.</p>
              </div>
            )}

            {choices.length && !availableChoices.length ? (
              <div className="playtest-terminal">
                <strong>Keine spielbare Choice verfügbar</strong>
                <p>
                  Alle vorhandenen Choices sind aktuell durch Conditions blockiert oder
                  zeigen auf fehlende Ziele.
                </p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="playtest-card">
          <div className="playtest-card__head">
            <div>
              <span className="playtest-card__label">Session-Zustand</span>
              <h4>Variablen und Verlauf</h4>
            </div>
          </div>

          <div className="playtest-variable-list">
            {story.variables.length ? (
              story.variables.map(function (variable) {
                const isChanged = variableState[variable.key] !== variable.defaultValue;

                return (
                  <div
                    key={variable.id}
                    className={
                      "playtest-variable" + (isChanged ? " playtest-variable--changed" : "")
                    }
                  >
                    <strong>{variable.label}</strong>
                    <span>
                      {formatValue(variableState[variable.key])} · Default{" "}
                      {formatValue(variable.defaultValue)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="playtest-card__empty">Für diesen Draft sind noch keine Variablen definiert.</p>
            )}
          </div>

          {changedVariables.length ? (
            <p className="playtest-card__note">
              Geänderte Variablen:{" "}
              {changedVariables
                .map(function (variable) {
                  return variable.label;
                })
                .join(", ")}
            </p>
          ) : (
            <p className="playtest-card__note">Der Run liegt noch auf dem Default-Zustand.</p>
          )}

          <div className="playtest-history">
            {history.map(function (step, index) {
              const scene = sceneIndex.get(step.sceneId);

              return (
                <div key={`${step.sceneId}-${index}`} className="playtest-history__row">
                  <span className="playtest-history__step">{index + 1}</span>
                  <div>
                    <strong>{scene?.title ?? step.sceneId}</strong>
                    <p>
                      {step.choiceLabel
                        ? `via ${step.choiceLabel}`
                        : index === 0
                          ? "Startpunkt"
                          : "Direkter Sprung"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="playtest-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getInitialVariables(story: StoryDocument): VariableState {
  return Object.fromEntries(
    story.variables.map(function (variable) {
      return [variable.key, variable.defaultValue];
    })
  );
}

function syncVariableState(currentState: VariableState, story: StoryDocument) {
  const nextState = getInitialVariables(story);

  story.variables.forEach(function (variable) {
    if (Object.prototype.hasOwnProperty.call(currentState, variable.key)) {
      nextState[variable.key] = currentState[variable.key];
    }
  });

  return nextState;
}

function areConditionsMet(conditions: ChoiceCondition[], variableState: VariableState) {
  return conditions.every(function (condition) {
    return variableState[condition.variableKey] === condition.equals;
  });
}

function applyChoiceEffects(variableState: VariableState, effects: ChoiceEffect[]) {
  return effects.reduce(function (currentState, effect) {
    return {
      ...currentState,
      [effect.variableKey]: effect.setTo
    };
  }, variableState);
}

function getChoiceReason(
  choice: StoryChoice,
  conditionsMet: boolean,
  targetTitle: string | null
) {
  if (!targetTitle) {
    return "Choice-Ziel fehlt im aktuellen Draft.";
  }

  if (!conditionsMet) {
    if (!choice.conditions.length) {
      return "Choice ist derzeit nicht verfügbar.";
    }

    return choice.conditions
      .map(function (condition) {
        return `${condition.variableKey} = ${formatValue(condition.equals)}`;
      })
      .join(" · ");
  }

  return `Weiter zu ${targetTitle}`;
}

function formatValue(value: RuntimeValue | undefined) {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return String(value ?? "undefined");
}

function analyzePlaytest(story: StoryDocument): PlaytestAnalysis {
  const scenes = getAllScenes(story);
  const sceneIndex = new Map(
    scenes.map(function (scene) {
      return [scene.id, scene];
    })
  );
  const variableKeys = new Set(
    story.variables.map(function (variable) {
      return variable.key;
    })
  );
  const issues: PlaytestIssue[] = [];
  const startScene = scenes[0] ?? null;
  const reachableSceneIds = new Set<string>();

  if (startScene) {
    traverseScenes(startScene.id, sceneIndex, reachableSceneIds);
  }

  let brokenChoiceCount = 0;

  scenes.forEach(function (scene) {
    if (!scene.summary.trim()) {
      issues.push({
        id: `${scene.id}-summary`,
        level: "warning",
        title: `${scene.title}: Summary fehlt`,
        detail: "Die Szene ist spielbar, aber im Grid und im Review schwer einzuordnen."
      });
    }

    if (!scene.blocks.some(function (block) {
      return block.text.trim();
    })) {
      issues.push({
        id: `${scene.id}-blocks`,
        level: "warning",
        title: `${scene.title}: Kein Szenentext`,
        detail: "Mindestens ein Absatzblock ist leer. Der Run stoppt hier inhaltlich fast ohne Text."
      });
    }

    scene.choices.forEach(function (choice, index) {
      if (!choice.label.trim()) {
        issues.push({
          id: `${scene.id}-${choice.id}-label`,
          level: "warning",
          title: `${scene.title}: Choice ${index + 1} ohne Label`,
          detail: "Im Reader wäre diese Entscheidung unverständlich."
        });
      }

      if (!sceneIndex.has(choice.toSceneId)) {
        brokenChoiceCount += 1;
        issues.push({
          id: `${scene.id}-${choice.id}-target`,
          level: "error",
          title: `${scene.title}: Choice-Ziel fehlt`,
          detail: `Die Choice zeigt auf ${choice.toSceneId}, aber diese Szene existiert nicht.`
        });
      }

      choice.conditions.forEach(function (condition, conditionIndex) {
        if (!variableKeys.has(condition.variableKey)) {
          issues.push({
            id: `${scene.id}-${choice.id}-condition-${conditionIndex}`,
            level: "error",
            title: `${scene.title}: Unbekannte Condition-Variable`,
            detail: `${condition.variableKey} ist nicht im Story-Schema definiert.`
          });
        }
      });

      choice.effects.forEach(function (effect, effectIndex) {
        if (!variableKeys.has(effect.variableKey)) {
          issues.push({
            id: `${scene.id}-${choice.id}-effect-${effectIndex}`,
            level: "error",
            title: `${scene.title}: Unbekannte Effect-Variable`,
            detail: `${effect.variableKey} ist nicht im Story-Schema definiert.`
          });
        }
      });
    });
  });

  scenes
    .filter(function (scene) {
      return startScene && !reachableSceneIds.has(scene.id);
    })
    .forEach(function (scene) {
      issues.push({
        id: `${scene.id}-unreachable`,
        level: "info",
        title: `${scene.title}: Derzeit unerreichbar`,
        detail: "Vom aktuellen Startpunkt führt kein statischer Pfad in diese Szene."
      });
    });

  return {
    sceneCount: scenes.length,
    choiceCount: scenes.reduce(function (sum, scene) {
      return sum + scene.choices.length;
    }, 0),
    reachableCount: reachableSceneIds.size,
    endingCount: scenes.filter(function (scene) {
      return scene.choices.length === 0;
    }).length,
    branchingCount: scenes.filter(function (scene) {
      return scene.choices.length > 1;
    }).length,
    brokenChoiceCount,
    issues,
    routePreviews: startScene ? collectRoutePreviews(startScene, sceneIndex) : []
  };
}

function traverseScenes(
  sceneId: string,
  sceneIndex: Map<string, StoryScene>,
  reachableSceneIds: Set<string>
) {
  if (reachableSceneIds.has(sceneId)) {
    return;
  }

  reachableSceneIds.add(sceneId);

  const scene = sceneIndex.get(sceneId);

  if (!scene) {
    return;
  }

  scene.choices.forEach(function (choice) {
    if (!sceneIndex.has(choice.toSceneId)) {
      return;
    }

    traverseScenes(choice.toSceneId, sceneIndex, reachableSceneIds);
  });
}

function collectRoutePreviews(
  startScene: StoryScene,
  sceneIndex: Map<string, StoryScene>
): RoutePreview[] {
  const routes: RoutePreview[] = [];

  function walk(scene: StoryScene, path: string[], depth: number) {
    if (routes.length >= 4) {
      return;
    }

    const nextPath = path.concat(scene.title);
    const validChoices = scene.choices.filter(function (choice) {
      return sceneIndex.has(choice.toSceneId);
    });

    if (!validChoices.length) {
      routes.push({
        id: `${scene.id}-${depth}`,
        summary: nextPath.join(" -> ")
      });
      return;
    }

    if (depth >= 5) {
      routes.push({
        id: `${scene.id}-${depth}`,
        summary: nextPath.join(" -> ") + " -> ..."
      });
      return;
    }

    validChoices.forEach(function (choice) {
      const nextScene = sceneIndex.get(choice.toSceneId);

      if (!nextScene || nextPath.includes(nextScene.title)) {
        return;
      }

      walk(nextScene, nextPath, depth + 1);
    });
  }

  walk(startScene, [], 0);

  return routes;
}

"use client";

import {
  countStoryStats,
  getAllScenes,
  isBranchingStory,
  type StoryDocument,
  type StoryStatus
} from "@/lib/story-schema";

type ReviewIssueLevel = "error" | "warning" | "info";

type ReviewIssue = {
  id: string;
  level: ReviewIssueLevel;
  title: string;
  detail: string;
  sceneId?: string;
};

type ReviewAnalysis = {
  gatePassed: boolean;
  readinessScore: number;
  blockerCount: number;
  warningCount: number;
  infoCount: number;
  issues: ReviewIssue[];
};

type ContinuityAnalysis = {
  anchoredSceneCount: number;
  unanchoredSceneCount: number;
  unusedWorldBibleCount: number;
  orphanedVariableCount: number;
  unresolvedSetupCount: number;
  findings: ReviewIssue[];
};

type SubmissionReviewerMemo = {
  verdict: "ready" | "needs_work";
  headline: string;
  summary: string;
  hookAssessment: string;
  audienceAssessment: string;
  branchAssessment: string;
  riskAssessment: string;
  marketFitAssessment: string;
};

export function ReviewPanel({
  story,
  onUpdateStatus,
  onSelectScene
}: {
  story: StoryDocument;
  onUpdateStatus: (status: StoryStatus) => void;
  onSelectScene: (sceneId: string) => void;
}) {
  const stats = countStoryStats(story);
  const analysis = analyzeStoryForReview(story);
  const continuity = analyzeContinuity(story);
  const memo = buildSubmissionReviewerMemo(story, analysis, continuity);
  const blockers = analysis.issues.filter(function (issue) {
    return issue.level === "error";
  });
  const warnings = analysis.issues.filter(function (issue) {
    return issue.level === "warning";
  });
  const infos = analysis.issues.filter(function (issue) {
    return issue.level === "info";
  });

  return (
    <aside className="review-panel" aria-label="Review Panel">
      <div className="review-panel__header">
        <div>
          <span className="scene-editor__eyebrow">Review</span>
          <h3>Lokales Submission Gate</h3>
          <p>
            Prüft Pflichtfelder, Story-Struktur und Reader-Risiken, bevor der Draft
            lokal als eingereicht markiert wird.
          </p>
        </div>
        <div className="review-panel__actions">
          <button
            className="flat-button"
            type="button"
            onClick={function () {
              onUpdateStatus("draft");
            }}
          >
            Als Draft
          </button>
          <button
            className="flat-button"
            type="button"
            onClick={function () {
              onUpdateStatus("playtest");
            }}
          >
            Playtest fertig
          </button>
          <button
            className="flat-button"
            type="button"
            disabled={!analysis.gatePassed}
            onClick={function () {
              onUpdateStatus("submitted");
            }}
          >
            Für Review einreichen
          </button>
        </div>
      </div>

      <div className="review-panel__content">
        <section className="review-card review-card--hero">
          <div className="review-card__head">
            <div>
              <span className="review-card__label">Submission Report</span>
              <h4>{story.title || "Untitled Story"}</h4>
            </div>
            <div className="review-card__meta">
              <span>{formatStoryStatus(story.status)}</span>
              <span>{analysis.gatePassed ? "Gate offen" : "Gate blockiert"}</span>
            </div>
          </div>

          <div className="review-score">
            <div className="review-score__value">{analysis.readinessScore}</div>
            <div className="review-score__copy">
              <strong>Readiness Score</strong>
              <p>
                {analysis.gatePassed
                  ? "Der Draft erfüllt aktuell die lokalen Submission-Mindestregeln."
                  : "Vor der Einreichung müssen erst alle Blocker entfernt werden."}
              </p>
            </div>
          </div>

          <div className="review-metrics">
            <Metric label="Blocker" value={analysis.blockerCount} tone="error" />
            <Metric label="Warnungen" value={analysis.warningCount} tone="warning" />
            <Metric label="Hinweise" value={analysis.infoCount} tone="info" />
            <Metric label="Szenen" value={stats.sceneCount} />
            {isBranchingStory(story) ? (
              <Metric label="Choices" value={stats.choiceCount} />
            ) : (
              <Metric label="Modus" value="Buch" />
            )}
            <Metric label="Wörter" value={stats.wordCount.toLocaleString("de-DE")} />
          </div>
        </section>

        <section className="review-card">
          <div className="review-card__head">
            <div>
              <span className="review-card__label">Store-Readiness</span>
              <h4>Pflichtfelder und Story-Rahmen</h4>
            </div>
          </div>

          <div className="review-detail-grid">
            <div className="review-detail">
              <strong>Autor</strong>
              <span>{story.authorName || "Fehlt"}</span>
            </div>
            <div className="review-detail">
              <strong>Genre</strong>
              <span>{story.meta.genre || "Fehlt"}</span>
            </div>
            <div className="review-detail">
              <strong>Sprache</strong>
              <span>{story.meta.language || "Fehlt"}</span>
            </div>
            <div className="review-detail">
              <strong>Zielgruppe</strong>
              <span>{story.meta.audience || "Fehlt"}</span>
            </div>
            <div className="review-detail">
              <strong>World Bible</strong>
              <span>{story.worldBible.length} Einträge</span>
            </div>
            <div className="review-detail">
              <strong>Variablen</strong>
              <span>{story.variables.length} definiert</span>
            </div>
          </div>
        </section>

        <section className="review-card">
          <div className="review-card__head">
            <div>
              <span className="review-card__label">Continuity Report</span>
              <h4>
                {isBranchingStory(story)
                  ? "Weltanker, Flags und offene Setups"
                  : "Weltanker, offene Fragen und Szenenkohärenz"}
              </h4>
            </div>
          </div>

          <div className="review-metrics">
            <Metric label="Anker-Szenen" value={continuity.anchoredSceneCount} />
            <Metric label="Ohne Anker" value={continuity.unanchoredSceneCount} tone="info" />
            <Metric label="Ungenutzte Codex" value={continuity.unusedWorldBibleCount} tone="warning" />
            <Metric label="Orphan Flags" value={continuity.orphanedVariableCount} tone="warning" />
            <Metric label="Offene Setups" value={continuity.unresolvedSetupCount} tone="warning" />
            <Metric label="Findings" value={continuity.findings.length} />
          </div>

          {continuity.findings.length ? (
            <div className="review-issue-list">
              {continuity.findings.map(function (finding) {
                return (
                  <article
                    key={finding.id}
                    className={`review-issue review-issue--${finding.level}`}
                  >
                    <div className="review-issue__copy">
                      <strong>{finding.title}</strong>
                      <p>{finding.detail}</p>
                    </div>
                    {finding.sceneId ? (
                      <button
                        className="flat-button review-issue__action"
                        type="button"
                        onClick={function () {
                          onSelectScene(finding.sceneId!);
                        }}
                      >
                        Szene öffnen
                      </button>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="review-success">
              <strong>Keine lokalen Continuity-Auffälligkeiten</strong>
              <p>World Bible, Szenenanker und Variablenfluss wirken im aktuellen Draft konsistent.</p>
            </div>
          )}
        </section>

        <section className="review-card review-card--memo">
          <div className="review-card__head">
            <div>
              <span className="review-card__label">Submission Reviewer</span>
              <h4>Lokales Reviewer-Memo</h4>
            </div>
            <div className="review-card__meta">
              <span
                className={
                  "review-verdict" +
                  (memo.verdict === "ready"
                    ? " review-verdict--ready"
                    : " review-verdict--needs-work")
                }
              >
                {memo.verdict === "ready" ? "Store-tauglich" : "Überarbeiten"}
              </span>
            </div>
          </div>

          <div className="review-memo">
            <div className="review-memo__intro">
              <strong>{memo.headline}</strong>
              <p>{memo.summary}</p>
            </div>

            <div className="review-detail-grid">
              <div className="review-detail">
                <strong>Hook</strong>
                <span>{memo.hookAssessment}</span>
              </div>
              <div className="review-detail">
                <strong>Audience Fit</strong>
                <span>{memo.audienceAssessment}</span>
              </div>
              <div className="review-detail">
                <strong>Branching</strong>
                <span>{memo.branchAssessment}</span>
              </div>
              <div className="review-detail">
                <strong>Risiko</strong>
                <span>{memo.riskAssessment}</span>
              </div>
              <div className="review-detail">
                <strong>Market Fit</strong>
                <span>{memo.marketFitAssessment}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="review-card">
          <div className="review-card__head">
            <div>
              <span className="review-card__label">Gate Findings</span>
              <h4>Blocker zuerst beheben</h4>
            </div>
          </div>

          {analysis.issues.length ? (
            <div className="review-issue-list">
              {analysis.issues.map(function (issue) {
                return (
                  <article
                    key={issue.id}
                    className={`review-issue review-issue--${issue.level}`}
                  >
                    <div className="review-issue__copy">
                      <strong>{issue.title}</strong>
                      <p>{issue.detail}</p>
                    </div>
                    {issue.sceneId ? (
                      <button
                        className="flat-button review-issue__action"
                        type="button"
                        onClick={function () {
                          onSelectScene(issue.sceneId!);
                        }}
                      >
                        Szene öffnen
                      </button>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="review-success">
              <strong>Keine offenen Findings</strong>
              <p>Der Draft ist lokal bereit für den nächsten Review-Schritt.</p>
            </div>
          )}
        </section>

        <section className="review-card">
          <div className="review-card__head">
            <div>
              <span className="review-card__label">Empfohlene Reihenfolge</span>
              <h4>Nächste Schritte</h4>
            </div>
          </div>

          <div className="review-next-steps">
            <div className="review-next-step">
              <strong>1. Blocker schließen</strong>
              <p>
                {blockers.length
                  ? blockers[0].title
                  : "Keine strukturellen Blocker mehr offen."}
              </p>
            </div>
            <div className="review-next-step">
              <strong>2. Warnungen reduzieren</strong>
              <p>
                {warnings.length
                  ? warnings[0].title
                  : "Die Warnungsebene ist für den Moment sauber."}
              </p>
            </div>
            <div className="review-next-step">
              <strong>3. Einreichung setzen</strong>
              <p>
                {analysis.gatePassed
                  ? "Der Button „Für Review einreichen“ kann jetzt lokal gesetzt werden."
                  : "Sobald die Blocker verschwinden, lässt sich der Draft lokal einreichen."}
              </p>
            </div>
            <div className="review-next-step">
              <strong>4. Hinweise sichten</strong>
              <p>
                {infos.length
                  ? infos[0].title
                  : "Keine zusätzlichen Hinweise aus dem lokalen Compiler."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}

function Metric({
  label,
  value,
  tone
}: {
  label: string;
  value: string | number;
  tone?: "error" | "warning" | "info";
}) {
  return (
    <div className={"review-metric" + (tone ? ` review-metric--${tone}` : "")}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function analyzeStoryForReview(story: StoryDocument): ReviewAnalysis {
  const issues: ReviewIssue[] = [];
  const scenes = getAllScenes(story);
  const branchingEnabled = isBranchingStory(story);
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

  if (!story.title.trim()) {
    issues.push({
      id: "story-title",
      level: "error",
      title: "Story-Titel fehlt",
      detail: "Ohne Titel kann der Draft weder im Store noch in der Review-Queue geführt werden."
    });
  }

  if (!story.authorName.trim()) {
    issues.push({
      id: "story-author",
      level: "error",
      title: "Autorname fehlt",
      detail: "Der Draft braucht einen sichtbaren Autorbezug."
    });
  }

  if (!story.meta.genre.trim()) {
    issues.push({
      id: "story-genre",
      level: "error",
      title: "Genre fehlt",
      detail: "Das Submission Gate erwartet ein Genre für Positionierung und Store-Filter."
    });
  }

  if (!story.meta.language.trim()) {
    issues.push({
      id: "story-language",
      level: "error",
      title: "Sprache fehlt",
      detail: "Die Story-Sprache muss im Metadatenblock gepflegt sein."
    });
  }

  if (!story.meta.audience.trim()) {
    issues.push({
      id: "story-audience",
      level: "error",
      title: "Zielgruppe fehlt",
      detail: "Ohne Zielgruppe bleibt der Store-Kontext zu unklar."
    });
  }

  if (!story.worldBible.length) {
    issues.push({
      id: "world-bible-empty",
      level: "warning",
      title: "World Bible ist leer",
      detail: "Der Draft hat noch keine Welt- oder Figurenanker für spätere Review-Checks."
    });
  }

  if (!scenes.length) {
    issues.push({
      id: "story-scenes-empty",
      level: "error",
      title: "Keine Szenen vorhanden",
      detail: "Ohne Szenen kann der Draft nicht getestet oder eingereicht werden."
    });
  }

  const reachableSceneIds = new Set<string>();
  const startScene = scenes[0] ?? null;

  if (branchingEnabled && startScene) {
    collectReachableScenes(startScene.id, sceneIndex, reachableSceneIds);
  }

  scenes.forEach(function (scene) {
    if (!scene.title.trim()) {
      issues.push({
        id: `${scene.id}-title`,
        level: "error",
        title: `Szene ${scene.id} ohne Titel`,
        detail: "Jede Szene braucht einen Titel für Navigation, Review und Debugging.",
        sceneId: scene.id
      });
    }

    if (!scene.summary.trim()) {
      issues.push({
        id: `${scene.id}-summary`,
        level: "error",
        title: `${scene.title || scene.id}: Summary fehlt`,
        detail: "Die Szene braucht eine kurze Summary für Grid, Review und Submission Report.",
        sceneId: scene.id
      });
    }

    if (!scene.blocks.some(function (block) {
      return block.text.trim();
    })) {
      issues.push({
        id: `${scene.id}-blocks`,
        level: "error",
        title: `${scene.title || scene.id}: Kein Szenentext`,
        detail: "Mindestens ein Absatzblock muss echten Text enthalten.",
        sceneId: scene.id
      });
    }

    if (branchingEnabled) {
      if (!scene.choices.length) {
        issues.push({
          id: `${scene.id}-ending`,
          level: "info",
          title: `${scene.title || scene.id}: Terminale Szene`,
          detail: "Diese Szene beendet aktuell einen Pfad ohne weitere Entscheidung.",
          sceneId: scene.id
        });
      }

      scene.choices.forEach(function (choice, index) {
        if (!choice.label.trim()) {
          issues.push({
            id: `${scene.id}-${choice.id}-label`,
            level: "error",
            title: `${scene.title || scene.id}: Choice ${index + 1} ohne Label`,
            detail: "Im Reader wäre diese Entscheidung ohne Label nicht verständlich.",
            sceneId: scene.id
          });
        }

        if (!sceneIndex.has(choice.toSceneId)) {
          issues.push({
            id: `${scene.id}-${choice.id}-target`,
            level: "error",
            title: `${scene.title || scene.id}: Choice-Ziel fehlt`,
            detail: `Die Choice verweist auf ${choice.toSceneId}, aber diese Szene existiert nicht.`,
            sceneId: scene.id
          });
        }

        choice.conditions.forEach(function (condition, conditionIndex) {
          if (!variableKeys.has(condition.variableKey)) {
            issues.push({
              id: `${scene.id}-${choice.id}-condition-${conditionIndex}`,
              level: "error",
              title: `${scene.title || scene.id}: Unbekannte Condition-Variable`,
              detail: `${condition.variableKey} ist im Story-Schema nicht definiert.`,
              sceneId: scene.id
            });
          }
        });

        choice.effects.forEach(function (effect, effectIndex) {
          if (!variableKeys.has(effect.variableKey)) {
            issues.push({
              id: `${scene.id}-${choice.id}-effect-${effectIndex}`,
              level: "error",
              title: `${scene.title || scene.id}: Unbekannte Effect-Variable`,
              detail: `${effect.variableKey} ist im Story-Schema nicht definiert.`,
              sceneId: scene.id
            });
          }
        });
      });
    }
  });

  if (branchingEnabled) {
    scenes
      .filter(function (scene) {
        return startScene && !reachableSceneIds.has(scene.id);
      })
      .forEach(function (scene) {
        issues.push({
          id: `${scene.id}-unreachable`,
          level: "warning",
          title: `${scene.title || scene.id}: Derzeit unerreichbar`,
          detail: "Vom Startpunkt führt aktuell kein statischer Pfad in diese Szene.",
          sceneId: scene.id
        });
      });

    if (!scenes.some(function (scene) {
      return scene.choices.length === 0;
    })) {
      issues.push({
        id: "story-no-ending",
        level: "error",
        title: "Kein Ende vorhanden",
        detail: "Mindestens eine terminale Szene ist nötig, damit ein Run sauber enden kann."
      });
    }

    if (!scenes.some(function (scene) {
      return scene.choices.length > 1;
    })) {
      issues.push({
        id: "story-no-branching",
        level: "warning",
        title: "Keine echte Verzweigung",
        detail: "Aktuell gibt es keine Szene mit mehr als einer Choice."
      });
    }
  }

  if (countStoryStats(story).wordCount < 120) {
    issues.push({
      id: "story-short",
      level: "warning",
      title: "Sehr kurzer Draft",
      detail: "Für eine belastbare Review ist der aktuelle Textumfang noch sehr klein."
    });
  }

  const blockerCount = issues.filter(function (issue) {
    return issue.level === "error";
  }).length;
  const warningCount = issues.filter(function (issue) {
    return issue.level === "warning";
  }).length;
  const infoCount = issues.filter(function (issue) {
    return issue.level === "info";
  }).length;

  return {
    gatePassed: blockerCount === 0,
    readinessScore: Math.max(0, 100 - blockerCount * 18 - warningCount * 6 - infoCount * 2),
    blockerCount,
    warningCount,
    infoCount,
    issues
  };
}

function analyzeContinuity(story: StoryDocument): ContinuityAnalysis {
  const scenes = getAllScenes(story);
  const branchingEnabled = isBranchingStory(story);
  const textByScene = new Map(
    scenes.map(function (scene) {
      return [
        scene.id,
        [scene.summary]
          .concat(
            scene.blocks.map(function (block) {
              return block.text;
            })
          )
          .join(" ")
          .toLowerCase()
      ];
    })
  );
  const findings: ReviewIssue[] = [];
  const usedVariableKeys = new Set<string>();
  const checkedVariableKeys = new Set<string>();
  const setupWithoutPayoffKeys = new Set<string>();

  const worldBibleMentions = story.worldBible.map(function (entry) {
    const normalizedTitle = entry.title.toLowerCase();
    const titleTokens = normalizedTitle
      .split(/\s+/)
      .filter(function (token) {
        return token.length > 3;
      });

    const mentionedSceneIds = scenes
      .filter(function (scene) {
        const sceneText = textByScene.get(scene.id) ?? "";

        return (
          sceneText.includes(normalizedTitle) ||
          titleTokens.some(function (token) {
            return sceneText.includes(token);
          })
        );
      })
      .map(function (scene) {
        return scene.id;
      });

    return {
      entry,
      mentionedSceneIds
    };
  });

  const anchoredSceneIds = new Set<string>();

  worldBibleMentions.forEach(function (item) {
    if (!item.mentionedSceneIds.length) {
      findings.push({
        id: `${item.entry.id}-unused`,
        level: "warning",
        title: `${item.entry.title}: Kein Szenenanker`,
        detail: "Der Codex-Eintrag wird aktuell in keiner Szenen-Summary oder keinem Szenentext referenziert."
      });
      return;
    }

    item.mentionedSceneIds.forEach(function (sceneId) {
      anchoredSceneIds.add(sceneId);
    });
  });

  scenes.forEach(function (scene) {
    if (!anchoredSceneIds.has(scene.id) && scene.wordCount > 0) {
      findings.push({
        id: `${scene.id}-no-anchor`,
        level: "info",
        title: `${scene.title || scene.id}: Keine Codex-Verankerung`,
        detail: "In dieser Szene taucht aktuell kein klarer World-Bible-Anker auf.",
        sceneId: scene.id
      });
    }

    if (branchingEnabled) {
      scene.choices.forEach(function (choice) {
        choice.conditions.forEach(function (condition) {
          usedVariableKeys.add(condition.variableKey);
          checkedVariableKeys.add(condition.variableKey);
        });

        choice.effects.forEach(function (effect) {
          usedVariableKeys.add(effect.variableKey);
        });
      });
    }
  });

  if (branchingEnabled) {
    story.variables.forEach(function (variable) {
      const isUsedInConditions = scenes.some(function (scene) {
        return scene.choices.some(function (choice) {
          return choice.conditions.some(function (condition) {
            return condition.variableKey === variable.key;
          });
        });
      });
      const isUsedInEffects = scenes.some(function (scene) {
        return scene.choices.some(function (choice) {
          return choice.effects.some(function (effect) {
            return effect.variableKey === variable.key;
          });
        });
      });

      if (!isUsedInConditions && !isUsedInEffects) {
        findings.push({
          id: `${variable.id}-orphan`,
          level: "warning",
          title: `${variable.label}: Variable ohne Einsatz`,
          detail: "Die Variable ist definiert, wird aber aktuell weder gesetzt noch abgefragt."
        });
        return;
      }

      if (isUsedInEffects && !isUsedInConditions) {
        setupWithoutPayoffKeys.add(variable.key);
        findings.push({
          id: `${variable.id}-setup-without-payoff`,
          level: "warning",
          title: `${variable.label}: Setup ohne Payoff`,
          detail: "Die Variable wird gesetzt, aber nirgends in Conditions wieder geprüft."
        });
      }

      if (!isUsedInEffects && isUsedInConditions && variable.defaultValue === false) {
        findings.push({
          id: `${variable.id}-check-without-setup`,
          level: "info",
          title: `${variable.label}: Check ohne sichtbaren Setup-Pfad`,
          detail: "Die Variable wird geprüft, aber im aktuellen Draft nicht aktiv gesetzt. Das kann gewollt sein, sollte aber bewusst sein."
        });
      }
      });
  }

  return {
    anchoredSceneCount: anchoredSceneIds.size,
    unanchoredSceneCount: scenes.filter(function (scene) {
      return scene.wordCount > 0 && !anchoredSceneIds.has(scene.id);
    }).length,
    unusedWorldBibleCount: worldBibleMentions.filter(function (item) {
      return item.mentionedSceneIds.length === 0;
    }).length,
    orphanedVariableCount: branchingEnabled
      ? story.variables.filter(function (variable) {
          return !usedVariableKeys.has(variable.key);
        }).length
      : 0,
    unresolvedSetupCount: branchingEnabled ? setupWithoutPayoffKeys.size : 0,
    findings
  };
}

function buildSubmissionReviewerMemo(
  story: StoryDocument,
  analysis: ReviewAnalysis,
  continuity: ContinuityAnalysis
): SubmissionReviewerMemo {
  const stats = countStoryStats(story);
  const openingScene = getAllScenes(story)[0] ?? null;
  const branchingEnabled = isBranchingStory(story);
  const hasClearHook =
    Boolean(openingScene?.summary.trim()) &&
    Boolean(openingScene?.blocks.some(function (block) {
      return block.text.trim();
    }));
  const isAudienceDefined = Boolean(story.meta.genre.trim() && story.meta.audience.trim());
  const continuityRisk =
    continuity.unusedWorldBibleCount +
    continuity.orphanedVariableCount +
    continuity.unresolvedSetupCount;
  const isReady = analysis.gatePassed && continuityRisk < 3;

  return {
    verdict: isReady ? "ready" : "needs_work",
    headline: isReady
      ? "Der Draft ist lokal nah an einer einreichbaren Form."
      : "Der Draft hat eine erkennbare Richtung, braucht aber noch kuratorische Schärfung.",
    summary: buildReviewerSummary(story, analysis, continuity),
    hookAssessment: hasClearHook
      ? "Die Eröffnung liefert bereits genug Konfliktmaterial für einen kuratierten Hook."
      : "Die Eröffnung ist noch zu unbestimmt; Hook und Stakes sollten im ersten Beat klarer werden.",
    audienceAssessment: isAudienceDefined
      ? `${story.meta.genre} für ${story.meta.audience} ist lesbar positioniert.`
      : "Genre und Zielgruppe sind noch nicht scharf genug beschrieben.",
    branchAssessment: branchingEnabled
      ? stats.choiceCount > 1
        ? "Es gibt bereits sichtbare Verzweigung; jetzt zählt eher Konsequenz als Menge."
        : "Die Story wirkt noch zu linear für einen starken Branching-Pitch."
      : "Das Projekt läuft im Buchmodus; bewertet werden Kapitelzug, Lesefluss und Kontinuität statt Choice-Dichte.",
    riskAssessment:
      continuityRisk === 0
        ? "Aktuell fallen keine lokalen Continuity-Risiken auf."
        : continuityRisk < 3
          ? "Es gibt einige Continuity-Risiken, aber sie sind noch gut überschaubar."
          : "Mehrere Continuity-Risiken könnten Review und Leserführung sichtbar schwächen.",
    marketFitAssessment:
      stats.wordCount >= 250 && stats.sceneCount >= 3
        ? "Als Premium-Prototype wirkt der Umfang zumindest plausibel genug für eine interne Sichtung."
        : "Für einen Premium-Eindruck ist der Draft noch sehr knapp und eher als internes Prototype-Stadium lesbar."
  };
}

function buildReviewerSummary(
  story: StoryDocument,
  analysis: ReviewAnalysis,
  continuity: ContinuityAnalysis
) {
  const parts = [
    `${story.title || "Der Draft"} hat ${analysis.blockerCount} Blocker`,
    `${analysis.warningCount} Warnungen`,
    `${continuity.findings.length} Continuity-Findings`
  ];

  if (analysis.gatePassed) {
    parts.push("und besteht das lokale Submission Gate");
  } else {
    parts.push("und besteht das lokale Submission Gate noch nicht");
  }

  return parts.join(", ") + ".";
}

function collectReachableScenes(
  sceneId: string,
  sceneIndex: Map<string, StoryDocument["acts"][number]["chapters"][number]["scenes"][number]>,
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
    if (sceneIndex.has(choice.toSceneId)) {
      collectReachableScenes(choice.toSceneId, sceneIndex, reachableSceneIds);
    }
  });
}

function formatStoryStatus(status: StoryStatus) {
  if (status === "playtest") {
    return "Playtest";
  }

  if (status === "submitted") {
    return "Submitted";
  }

  return "Draft";
}

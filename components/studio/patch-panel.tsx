"use client";

import { useMemo, useState } from "react";
import {
  countSceneWords,
  getAllScenes,
  type SceneContext,
  type StoryDocument,
  type StoryScene
} from "@/lib/story-schema";

type PatchSuggestion = {
  id: string;
  kind: "summary" | "paragraph" | "choice" | "label";
  title: string;
  rationale: string;
  preview: string;
  apply: (scene: StoryScene) => StoryScene;
};

export function PatchPanel({
  story,
  sceneContext,
  onUpdateScene
}: {
  story: StoryDocument;
  sceneContext: SceneContext | null;
  onUpdateScene: (updater: (scene: StoryScene) => StoryScene) => void;
}) {
  const [activePatchId, setActivePatchId] = useState<string>("");
  const [lastAppliedPatchId, setLastAppliedPatchId] = useState<string>("");

  const suggestions = useMemo(function () {
    if (!sceneContext) {
      return [];
    }

    return buildPatchSuggestions(story, sceneContext);
  }, [sceneContext, story]);

  const activePatch =
    suggestions.find(function (suggestion) {
      return suggestion.id === activePatchId;
    }) ?? suggestions[0] ?? null;

  if (!sceneContext) {
    return (
      <aside className="patch-panel patch-panel--empty">
        <div className="patch-empty">
          <span className="scene-editor__eyebrow">Patch Lab</span>
          <h3>Keine Szene ausgewählt</h3>
          <p>Wähle links eine Szene aus, um lokale Patch-Vorschläge zu erzeugen und direkt anzuwenden.</p>
        </div>
      </aside>
    );
  }

  const scene = sceneContext.scene;

  return (
    <aside className="patch-panel" aria-label="Patch Panel">
      <div className="patch-panel__header">
        <div>
          <span className="scene-editor__eyebrow">Patch Lab</span>
          <h3>Lokale AI-Patch-Werkbank</h3>
          <p>
            Regelbasierte Vorschläge für Hook, Szenentext, Choice-Struktur und
            Labeling. Jeder Patch bleibt explizit und einzeln anwendbar.
          </p>
        </div>
        <div className="patch-panel__pills">
          <span className="scene-editor__pill">{scene.id}</span>
          <span className="scene-editor__pill">{countSceneWords(scene)} Wörter</span>
          <span className="scene-editor__pill">{suggestions.length} Patches</span>
        </div>
      </div>

      <div className="patch-panel__content">
        <section className="patch-card patch-card--intro">
          <div className="patch-card__head">
            <div>
              <span className="patch-card__label">Szene im Fokus</span>
              <h4>{scene.title || "Untitled Scene"}</h4>
            </div>
            {lastAppliedPatchId ? (
              <span className="patch-status">Zuletzt angewendet: {lastAppliedPatchId}</span>
            ) : (
              <span className="patch-status">Noch kein Patch angewendet</span>
            )}
          </div>

          <div className="patch-scene-meta">
            <div className="patch-scene-meta__item">
              <strong>Summary</strong>
              <p>{scene.summary || "Keine Summary hinterlegt."}</p>
            </div>
            <div className="patch-scene-meta__item">
              <strong>Choice-Slots</strong>
              <p>{scene.choices.length ? `${scene.choices.length} vorhanden` : "Noch keine Choices"}</p>
            </div>
            <div className="patch-scene-meta__item">
              <strong>Label</strong>
              <p>{scene.label || "Kein Label gesetzt"}</p>
            </div>
          </div>
        </section>

        <section className="patch-card">
          <div className="patch-card__head">
            <div>
              <span className="patch-card__label">Patch Queue</span>
              <h4>Direkt anwendbare Vorschläge</h4>
            </div>
          </div>

          <div className="patch-list">
            {suggestions.map(function (suggestion) {
              return (
                <button
                  key={suggestion.id}
                  className={
                    "patch-list__item" +
                    (activePatch?.id === suggestion.id ? " patch-list__item--active" : "")
                  }
                  onClick={function () {
                    setActivePatchId(suggestion.id);
                  }}
                  type="button"
                >
                  <strong>{suggestion.title}</strong>
                  <span>{suggestion.kind}</span>
                  <p>{suggestion.rationale}</p>
                </button>
              );
            })}
          </div>
        </section>

        {activePatch ? (
          <section className="patch-card patch-card--preview">
            <div className="patch-card__head">
              <div>
                <span className="patch-card__label">Patch Preview</span>
                <h4>{activePatch.title}</h4>
              </div>
              <div className="patch-card__actions">
                <button
                  className="flat-button"
                  type="button"
                  onClick={function () {
                    onUpdateScene(activePatch.apply);
                    setLastAppliedPatchId(activePatch.title);
                  }}
                >
                  Patch anwenden
                </button>
                <button
                  className="flat-button"
                  type="button"
                  onClick={function () {
                    setActivePatchId("");
                  }}
                >
                  Auswahl zurücksetzen
                </button>
              </div>
            </div>

            <div className="patch-preview">
              <strong>Warum dieser Patch</strong>
              <p>{activePatch.rationale}</p>
              <strong>Vorschau</strong>
              <p>{activePatch.preview}</p>
            </div>
          </section>
        ) : null}
      </div>
    </aside>
  );
}

function buildPatchSuggestions(story: StoryDocument, sceneContext: SceneContext) {
  const scene = sceneContext.scene;
  const allScenes = getAllScenes(story);
  const targetScene = allScenes.find(function (candidate) {
    return candidate.id !== scene.id;
  });
  const patches: PatchSuggestion[] = [];

  patches.push({
    id: "patch-summary-hook",
    kind: "summary",
    title: "Hook im Summary schärfen",
    rationale:
      "Das Review-Gate und das Grid profitieren von einer Summary, die Konflikt und Konsequenz früher sichtbar macht.",
    preview: buildSummaryPatchPreview(scene),
    apply: function (currentScene) {
      return {
        ...currentScene,
        summary: buildSummaryPatchText(currentScene)
      };
    }
  });

  patches.push({
    id: "patch-add-paragraph",
    kind: "paragraph",
    title: "Atmosphärischen Absatz ergänzen",
    rationale:
      "Ein zusätzlicher Absatz hilft, wenn die Szene funktional angelegt ist, aber noch wenig sensorische Dichte hat.",
    preview: buildParagraphPatchText(scene),
    apply: function (currentScene) {
      return {
        ...currentScene,
        blocks: currentScene.blocks.concat({
          id: `${currentScene.id}_patch_block_${currentScene.blocks.length + 1}`,
          kind: "paragraph",
          text: buildParagraphPatchText(currentScene)
        })
      };
    }
  });

  patches.push({
    id: "patch-label",
    kind: "label",
    title: "Szenenlabel präzisieren",
    rationale:
      "Generische Labels erschweren Orientierung in Outline, Review und Matrix. Ein funktionales Label ist für spätere Navigation wertvoll.",
    preview: buildLabelPatchText(scene),
    apply: function (currentScene) {
      return {
        ...currentScene,
        label: buildLabelPatchText(currentScene)
      };
    }
  });

  if (targetScene) {
    patches.push({
      id: "patch-choice",
      kind: "choice",
      title: "Zusätzliche Choice vorschlagen",
      rationale:
        "Wenn die Szene linear bleibt, kann ein vorgeschlagener Entscheidungspunkt beim Branching-Prototyping helfen.",
      preview: `Neue Choice: "${buildChoiceLabel(scene)}" -> ${targetScene.title}`,
      apply: function (currentScene) {
        if (
          currentScene.choices.some(function (choice) {
            return choice.toSceneId === targetScene.id && choice.label === buildChoiceLabel(currentScene);
          })
        ) {
          return currentScene;
        }

        return {
          ...currentScene,
          choices: currentScene.choices.concat({
            id: `${currentScene.id}_patch_choice_${currentScene.choices.length + 1}`,
            label: buildChoiceLabel(currentScene),
            toSceneId: targetScene.id,
            conditions: [],
            effects: []
          })
        };
      }
    });
  }

  return patches;
}

function buildSummaryPatchText(scene: StoryScene) {
  const base = scene.summary.trim() || `${scene.title} verschiebt das Kräfteverhältnis der Szene.`;

  if (base.includes("wodurch")) {
    return base;
  }

  return `${trimSentence(base)} wodurch der Druck auf die nächste Entscheidung spürbar steigt.`;
}

function buildSummaryPatchPreview(scene: StoryScene) {
  return buildSummaryPatchText(scene);
}

function buildParagraphPatchText(scene: StoryScene) {
  const title = scene.title || "Die Szene";
  const label = scene.label && scene.label !== "Label" ? scene.label : "den Kipppunkt";

  return `${title} zieht den Moment nicht breit, sondern lässt eine kurze, präzise Irritation stehen: Die Figur merkt, dass ${label.toLowerCase()} nicht mehr nur Hintergrund ist, sondern unmittelbare Konsequenz trägt.`;
}

function buildLabelPatchText(scene: StoryScene) {
  const title = scene.title.trim();

  if (!title) {
    return "Konflikt öffnet sich";
  }

  return `${title} / Wendepunkt`;
}

function buildChoiceLabel(scene: StoryScene) {
  const basis = scene.summary.trim() || scene.title.trim() || "Den nächsten Schritt wählen";

  return `Auf ${extractLeadPhrase(basis)} reagieren`;
}

function extractLeadPhrase(value: string) {
  const cleaned = value
    .replace(/[.,:;!?]/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join(" ");

  return cleaned || "die Lage";
}

function trimSentence(value: string) {
  return value.replace(/[.?!]\s*$/, "");
}

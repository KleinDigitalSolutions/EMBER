"use client";

import type { BookStateDiffItemKind } from "@/lib/book-engine";
import type {
  BookDraftJob,
  BookObjectStateChange,
  BookPromiseState,
  BookStateDiff,
  BookStateDiffStatus
} from "@/lib/story-schema";

type BookStateDiffReviewProps = {
  job: BookDraftJob;
  onApprove?: () => void;
  onReject?: () => void;
  onApproveItem?: (kind: BookStateDiffItemKind, index: number) => void;
  onRejectItem?: (kind: BookStateDiffItemKind, index: number) => void;
  compact?: boolean;
};

export function BookStateDiffReview({
  job,
  onApprove,
  onReject,
  onApproveItem,
  onRejectItem,
  compact = false
}: BookStateDiffReviewProps) {
  const diff = job.stateDiff;
  const status = job.stateDiffStatus;

  if (!diff) {
    return (
      <article className="book-state-diff-panel">
        <strong>State Review</strong>
        <p>Für diesen Job wurde kein StateDiff gespeichert.</p>
      </article>
    );
  }

  const sections = buildStateDiffSections(diff);
  const hasChanges = sections.some(function (section) {
    return section.items.length > 0;
  });
  const canReview = status === "pending";

  return (
    <section className="book-state-diff-panel">
      <div className="book-card__head">
        <div>
          <strong>State Review</strong>
          <p>{formatStateDiffStatus(status, diff)}</p>
        </div>
        <div className="book-card__meta">
          <span>{countStateDiffItems(diff)} Änderung(en)</span>
          {diff.requiresHumanReview ? <span>Review nötig</span> : <span>Clean</span>}
        </div>
      </div>

      {diff.conflicts.length ? (
        <div className="book-mini-list">
          {diff.conflicts.map(function (conflict) {
            return (
              <article key={conflict} className="book-mini-card">
                <strong>Konflikt</strong>
                <p>{conflict}</p>
              </article>
            );
          })}
        </div>
      ) : null}

      {hasChanges ? (
        <div className="book-mini-list">
          {sections.map(function (section) {
            if (!section.items.length) {
              return null;
            }

            return (
              <article key={section.title} className="book-mini-card">
                <strong>{section.title}</strong>
                <ul className="book-state-diff-list">
                  {section.items.slice(0, compact ? 4 : 12).map(function (item) {
                    return (
                      <li key={`${section.title}_${item.index}`} className="book-state-diff-list__item">
                        <span>{item.text}</span>
                        {canReview && (onApproveItem || onRejectItem) ? (
                          <span className="book-state-diff-list__actions">
                            <button
                              className="flat-button"
                              type="button"
                              disabled={!onApproveItem}
                              onClick={function () {
                                onApproveItem?.(section.kind, item.index);
                              }}
                            >
                              Annehmen
                            </button>
                            <button
                              className="flat-button"
                              type="button"
                              disabled={!onRejectItem}
                              onClick={function () {
                                onRejectItem?.(section.kind, item.index);
                              }}
                            >
                              Verwerfen
                            </button>
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
                {compact && section.items.length > 4 ? (
                  <p>{section.items.length - 4} weitere Änderung(en) im vollständigen Job.</p>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <p>Dieser Job schlägt keine kanonischen Änderungen vor.</p>
      )}

      <div className="book-card__actions">
        <button
          className={"flat-button" + (status === "approved" ? " flat-button--active" : "")}
          type="button"
          disabled={!canReview || !onApprove}
          onClick={onApprove}
        >
          State annehmen
        </button>
        <button
          className={"flat-button" + (status === "rejected" ? " flat-button--active" : "")}
          type="button"
          disabled={!canReview || !onReject}
          onClick={onReject}
        >
          Verwerfen
        </button>
      </div>
    </section>
  );
}

function buildStateDiffSections(diff: BookStateDiff) {
  return [
    {
      kind: "proposedCanonFacts" as const,
      title: "Canon",
      items: diff.proposedCanonFacts.map(toReviewItem)
    },
    {
      kind: "objectChanges" as const,
      title: "Objekte",
      items: diff.objectChanges.map(function (item, index) {
        return toReviewItem(formatObjectChange(item), index);
      })
    },
    {
      kind: "knowledgeChanges" as const,
      title: "Wissen",
      items: diff.knowledgeChanges.map(function (entry) {
        const knownBy = entry.knownByCharacterNames.length
          ? ` · weiß: ${entry.knownByCharacterNames.join(", ")}`
          : "";
        const hiddenFrom = entry.hiddenFromCharacterNames.length
          ? ` · verborgen vor: ${entry.hiddenFromCharacterNames.join(", ")}`
          : "";
        return `${entry.proposition}${knownBy}${hiddenFrom} · Leser: ${entry.readerState}`;
      }).map(toReviewItem)
    },
    {
      kind: "promiseUpdates" as const,
      title: "Promises",
      items: diff.promiseUpdates.map(function (item, index) {
        return toReviewItem(formatPromiseUpdate(item), index);
      })
    },
    {
      kind: "characterStateUpdates" as const,
      title: "Character State",
      items: diff.characterStateUpdates.map(toReviewItem)
    },
    {
      kind: "relationshipNotes" as const,
      title: "Beziehungen",
      items: diff.relationshipNotes.map(toReviewItem)
    },
    {
      kind: "sceneLocalDetails" as const,
      title: "Szenenlokal",
      items: diff.sceneLocalDetails.map(toReviewItem)
    }
  ];
}

function toReviewItem(text: string, index: number) {
  return { text, index };
}

function formatObjectChange(change: BookObjectStateChange) {
  const movement = [
    change.fromHolderCharacterName ? `von ${change.fromHolderCharacterName}` : "",
    change.fromLocationName ? `aus ${change.fromLocationName}` : "",
    change.toHolderCharacterName ? `zu ${change.toHolderCharacterName}` : "",
    change.toLocationName ? `nach ${change.toLocationName}` : ""
  ].filter(Boolean).join(" ");
  const condition = change.conditionChange ? ` · ${change.conditionChange}` : "";
  const evidence = change.evidenceQuote ? ` · Beleg: ${change.evidenceQuote}` : "";

  return `${change.objectName}${movement ? `: ${movement}` : ""}${condition}${evidence}`;
}

function formatPromiseUpdate(promise: BookPromiseState) {
  const payoff =
    promise.status === "paid"
      ? ` · logisch: ${promise.logicalPayoff || "fehlt"} · emotional: ${promise.emotionalPayoff || "fehlt"}`
      : "";

  return `${promise.label}: ${promise.status}${payoff}`;
}

function countStateDiffItems(diff: BookStateDiff) {
  return (
    diff.objectChanges.length +
    diff.knowledgeChanges.length +
    diff.promiseUpdates.length +
    diff.characterStateUpdates.length +
    diff.relationshipNotes.length +
    diff.proposedCanonFacts.length +
    diff.sceneLocalDetails.length
  );
}

function formatStateDiffStatus(status: BookStateDiffStatus, diff: BookStateDiff) {
  if (status === "approved" || status === "approved_manual") {
    return "Angenommen. Diese Änderungen sind Teil des Memory Backbone.";
  }

  if (status === "rejected") {
    return "Verworfen. Der Draft-Text bleibt Text, aber diese Änderungen werden nicht kanonisch.";
  }

  if (diff.conflicts.length) {
    return "Pending mit Konflikten. Erst prüfen, dann bewusst entscheiden.";
  }

  return "Pending. Draft ist Text; erst angenommener State wird Wahrheit.";
}

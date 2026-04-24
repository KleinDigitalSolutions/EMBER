"use client";

import { useEffect, useRef, useState } from "react";

export type SampleReaderSceneMeta = {
  id: string;
  label: string;
  title: string;
};

type SampleReaderControlsProps = {
  sampleId: string;
  scenes: SampleReaderSceneMeta[];
};

type ReaderCookieState = {
  version: 1;
  bookmarkSceneId?: string;
  lastSceneId?: string;
  updatedAt?: string;
};

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getReaderCookieName(sampleId: string) {
  return `ember-sample-reader-${sampleId}`;
}

function readReaderState(sampleId: string): ReaderCookieState | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookieName = getReaderCookieName(sampleId);
  const cookieEntry = document.cookie
    .split("; ")
    .find(function (entry) {
      return entry.startsWith(`${cookieName}=`);
    });

  if (!cookieEntry) {
    return null;
  }

  try {
    const value = decodeURIComponent(cookieEntry.slice(cookieName.length + 1));
    const parsed = JSON.parse(value) as ReaderCookieState;
    return parsed && parsed.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

function writeReaderState(sampleId: string, state: ReaderCookieState) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = [
    `${getReaderCookieName(sampleId)}=${encodeURIComponent(JSON.stringify(state))}`,
    `Max-Age=${COOKIE_MAX_AGE}`,
    "Path=/",
    "SameSite=Lax"
  ].join("; ");
}

function formatBookmarkLabel(scene: SampleReaderSceneMeta | null) {
  if (!scene) {
    return "Kein Lesezeichen gespeichert";
  }

  return `${scene.label} · ${scene.title}`;
}

export function SampleReaderControls({
  sampleId,
  scenes
}: SampleReaderControlsProps) {
  const [activeSceneId, setActiveSceneId] = useState(scenes[0]?.id ?? "");
  const [readerState, setReaderState] = useState<ReaderCookieState | null>(null);
  const [isSceneSheetOpen, setIsSceneSheetOpen] = useState(false);
  const [bookmarkFeedbackVisible, setBookmarkFeedbackVisible] = useState(false);
  const stateRef = useRef<ReaderCookieState | null>(null);
  const readyToPersistRef = useRef(false);
  const bookmarkFeedbackTimerRef = useRef<number | null>(null);

  function persistState(nextState: ReaderCookieState) {
    stateRef.current = nextState;
    setReaderState(nextState);
    writeReaderState(sampleId, nextState);
  }

  function showBookmarkFeedback() {
    setBookmarkFeedbackVisible(true);

    if (bookmarkFeedbackTimerRef.current) {
      window.clearTimeout(bookmarkFeedbackTimerRef.current);
    }

    bookmarkFeedbackTimerRef.current = window.setTimeout(function () {
      setBookmarkFeedbackVisible(false);
      bookmarkFeedbackTimerRef.current = null;
    }, 1400);
  }

  function scrollToScene(sceneId: string, behavior: ScrollBehavior = "smooth") {
    if (!sceneId) {
      return;
    }

    const target = document.getElementById(sceneId);
    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior,
      block: "start"
    });
    setActiveSceneId(sceneId);
    window.history.replaceState(null, "", `#${sceneId}`);
    setIsSceneSheetOpen(false);
  }

  useEffect(function bootstrapReaderState() {
    const state = readReaderState(sampleId);
    stateRef.current = state;
    setReaderState(state);

    const hashTarget = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    const restoredTarget = hashTarget || state?.bookmarkSceneId || state?.lastSceneId || "";

    window.requestAnimationFrame(function () {
      if (restoredTarget) {
        scrollToScene(restoredTarget, "auto");
      }

      readyToPersistRef.current = true;
    });
  }, [sampleId]);

  useEffect(function cleanupBookmarkFeedbackTimer() {
    return function cleanupTimer() {
      if (bookmarkFeedbackTimerRef.current) {
        window.clearTimeout(bookmarkFeedbackTimerRef.current);
      }
    };
  }, []);

  useEffect(
    function observeScenes() {
      if (!scenes.length) {
        return;
      }

      const observer = new IntersectionObserver(
        function handleSceneEntries(entries) {
          const visibleEntry = entries
            .filter(function (entry) {
              return entry.isIntersecting;
            })
            .sort(function (left, right) {
              if (right.intersectionRatio !== left.intersectionRatio) {
                return right.intersectionRatio - left.intersectionRatio;
              }

              return Math.abs(left.boundingClientRect.top) - Math.abs(right.boundingClientRect.top);
            })[0];

          if (visibleEntry) {
            setActiveSceneId(visibleEntry.target.id);
          }
        },
        {
          rootMargin: "-12% 0px -68% 0px",
          threshold: [0.15, 0.35, 0.6]
        }
      );

      scenes.forEach(function (scene) {
        const element = document.getElementById(scene.id);
        if (element) {
          observer.observe(element);
        }
      });

      return function cleanupObserver() {
        observer.disconnect();
      };
    },
    [scenes]
  );

  useEffect(
    function persistLastScene() {
      if (!readyToPersistRef.current || !activeSceneId) {
        return;
      }

      if (stateRef.current?.lastSceneId === activeSceneId) {
        return;
      }

      persistState({
        ...stateRef.current,
        version: 1,
        lastSceneId: activeSceneId,
        updatedAt: new Date().toISOString()
      });
    },
    [activeSceneId, sampleId]
  );

  const activeSceneIndex = Math.max(
    scenes.findIndex(function (scene) {
      return scene.id === activeSceneId;
    }),
    0
  );
  const activeScene = scenes[activeSceneIndex] ?? null;
  const previousScene = activeSceneIndex > 0 ? scenes[activeSceneIndex - 1] : null;
  const nextScene =
    activeSceneIndex >= 0 && activeSceneIndex < scenes.length - 1
      ? scenes[activeSceneIndex + 1]
      : null;
  const bookmarkScene =
    scenes.find(function (scene) {
      return scene.id === readerState?.bookmarkSceneId;
    }) ?? null;

  function handleBookmarkSave() {
    if (!activeScene) {
      return;
    }

    persistState({
      ...stateRef.current,
      version: 1,
      bookmarkSceneId: activeScene.id,
      lastSceneId: activeScene.id,
      updatedAt: new Date().toISOString()
    });
    showBookmarkFeedback();
  }

  function handleBookmarkClear() {
    if (!stateRef.current?.bookmarkSceneId) {
      return;
    }

    persistState({
      ...stateRef.current,
      version: 1,
      bookmarkSceneId: undefined,
      updatedAt: new Date().toISOString()
    });
  }

  return (
    <>
      <aside className="sample-reader__rail" aria-label="Lese-Navigation">
        <section className="sample-reader__panel">
          <p className="sample-reader__panel-kicker">Lesestatus</p>
          <strong className="sample-reader__panel-title">
            {activeScene ? `${activeScene.label} von ${scenes.length}` : "Leseprobe"}
          </strong>
          <p className="sample-reader__panel-copy">
            {activeScene ? activeScene.title : "Die aktuelle Szene wird beim Scrollen erkannt."}
          </p>
          <div className="sample-reader__progress-bar" aria-hidden="true">
            <span
              className="sample-reader__progress-fill"
              style={{ width: `${((activeSceneIndex + 1) / Math.max(scenes.length, 1)) * 100}%` }}
            />
          </div>
          <div className="sample-reader__nav-row">
            <button
              className="sample-reader__action"
              type="button"
              onClick={function () {
                if (previousScene) {
                  scrollToScene(previousScene.id);
                }
              }}
              disabled={!previousScene}
            >
              Zurück
            </button>
            <button
              className="sample-reader__action sample-reader__action--primary"
              type="button"
              onClick={function () {
                if (nextScene) {
                  scrollToScene(nextScene.id);
                }
              }}
              disabled={!nextScene}
            >
              Weiter
            </button>
          </div>
        </section>

        <section className="sample-reader__panel">
          <p className="sample-reader__panel-kicker">Lesezeichen</p>
          <strong className="sample-reader__panel-title">Im Browser gespeichert</strong>
          <p className="sample-reader__panel-copy">{formatBookmarkLabel(bookmarkScene)}</p>
          <div className="sample-reader__bookmark-actions">
            <button
              className={
                "sample-reader__action sample-reader__action--primary" +
                (bookmarkFeedbackVisible ? " sample-reader__action--success" : "")
              }
              type="button"
              onClick={handleBookmarkSave}
            >
              {bookmarkFeedbackVisible ? "Gemerkt" : "Lesezeichen setzen"}
            </button>
            <button
              className="sample-reader__action"
              type="button"
              onClick={function () {
                if (bookmarkScene) {
                  scrollToScene(bookmarkScene.id);
                }
              }}
              disabled={!bookmarkScene}
            >
              Zur Marke
            </button>
            <button
              className="sample-reader__action sample-reader__action--subtle"
              type="button"
              onClick={handleBookmarkClear}
              disabled={!bookmarkScene}
            >
              Löschen
            </button>
          </div>
          <p className="sample-reader__feedback" aria-live="polite">
            {bookmarkFeedbackVisible ? "Aktuelle Szene wurde gespeichert." : "\u00A0"}
          </p>
        </section>

        <section className="sample-reader__panel">
          <div className="sample-reader__panel-head">
            <div>
              <p className="sample-reader__panel-kicker">Szenen</p>
              <strong className="sample-reader__panel-title">Direkt springen</strong>
            </div>
            <button
              className="sample-reader__inline-button"
              type="button"
              onClick={function () {
                setIsSceneSheetOpen(true);
              }}
            >
              Übersicht
            </button>
          </div>
          <div className="sample-reader__scene-list" role="list">
            {scenes.map(function (scene) {
              const isActive = scene.id === activeSceneId;
              return (
                <button
                  key={scene.id}
                  className={
                    "sample-reader__scene-link" +
                    (isActive ? " sample-reader__scene-link--active" : "")
                  }
                  type="button"
                  onClick={function () {
                    scrollToScene(scene.id);
                  }}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span>{scene.label}</span>
                  <strong>{scene.title}</strong>
                </button>
              );
            })}
          </div>
        </section>
      </aside>

      <nav className="sample-reader__mobile-dock" aria-label="Mobile Lese-Navigation">
        <button
          className="sample-reader__mobile-button"
          type="button"
          onClick={function () {
            setIsSceneSheetOpen(true);
          }}
        >
          Inhalt
        </button>
        <button
          className={
            "sample-reader__mobile-button" +
            (bookmarkFeedbackVisible ? " sample-reader__mobile-button--success" : "")
          }
          type="button"
          onClick={handleBookmarkSave}
        >
          {bookmarkFeedbackVisible ? "Gemerkt" : "Merken"}
        </button>
        <div className="sample-reader__mobile-progress" aria-live="polite">
          {activeScene ? activeScene.label : "Szene"}
        </div>
        <button
          className="sample-reader__mobile-button sample-reader__mobile-button--primary"
          type="button"
          onClick={function () {
            if (nextScene) {
              scrollToScene(nextScene.id);
              return;
            }

            if (bookmarkScene) {
              scrollToScene(bookmarkScene.id);
            }
          }}
        >
          {nextScene ? "Weiter" : "Zur Marke"}
        </button>
      </nav>

      {isSceneSheetOpen ? (
        <div
          className="sample-reader__sheet-backdrop"
          role="presentation"
          onClick={function () {
            setIsSceneSheetOpen(false);
          }}
        >
          <section
            className="sample-reader__sheet"
            aria-label="Szenenübersicht"
            onClick={function (event) {
              event.stopPropagation();
            }}
          >
            <div className="sample-reader__sheet-head">
              <div>
                <p className="sample-reader__panel-kicker">Szenenübersicht</p>
                <strong className="sample-reader__panel-title">Direkt springen</strong>
              </div>
              <button
                className="sample-reader__inline-button"
                type="button"
                onClick={function () {
                  setIsSceneSheetOpen(false);
                }}
              >
                Schließen
              </button>
            </div>

            <div className="sample-reader__sheet-actions">
              <button
                className={
                  "sample-reader__action sample-reader__action--primary" +
                  (bookmarkFeedbackVisible ? " sample-reader__action--success" : "")
                }
                type="button"
                onClick={handleBookmarkSave}
              >
                {bookmarkFeedbackVisible ? "Gemerkt" : "Aktuelle Szene merken"}
              </button>
              <button
                className="sample-reader__action"
                type="button"
                onClick={function () {
                  if (bookmarkScene) {
                    scrollToScene(bookmarkScene.id);
                  }
                }}
                disabled={!bookmarkScene}
              >
                Zum Lesezeichen
              </button>
            </div>

            <div className="sample-reader__sheet-list" role="list">
              {scenes.map(function (scene) {
                const isActive = scene.id === activeSceneId;
                return (
                  <button
                    key={scene.id}
                    className={
                      "sample-reader__scene-link" +
                      (isActive ? " sample-reader__scene-link--active" : "")
                    }
                    type="button"
                    onClick={function () {
                      scrollToScene(scene.id);
                    }}
                    aria-current={isActive ? "location" : undefined}
                  >
                    <span>{scene.label}</span>
                    <strong>{scene.title}</strong>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

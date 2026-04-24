import type { CSSProperties } from "react";

import {
  SampleReaderControls,
  type SampleReaderSceneMeta
} from "@/components/sample-reader-controls";

export type SampleReaderScene = {
  id: string;
  kicker: string;
  title: string;
  summary: string;
  paragraphs: string[];
};

export type SampleReaderTheme = {
  accent: string;
  accentSoft: string;
  accentGlow: string;
  surface: string;
  railSurface: string;
};

type SampleReaderProps = {
  sampleId: string;
  title: string;
  description: string;
  heroKicker: string;
  heroTitle: string;
  heroSummary: string;
  scenes: SampleReaderScene[];
  continuationTitle: string;
  continuationCopy: string;
  theme: SampleReaderTheme;
};

export function SampleReader({
  sampleId,
  title,
  description,
  heroKicker,
  heroTitle,
  heroSummary,
  scenes,
  continuationTitle,
  continuationCopy,
  theme
}: SampleReaderProps) {
  const sceneMeta: SampleReaderSceneMeta[] = scenes.map(function (scene, index) {
    return {
      id: scene.id,
      label: `Szene ${index + 1}`,
      title: scene.title
    };
  });

  const themeStyle = {
    "--sample-accent": theme.accent,
    "--sample-accent-soft": theme.accentSoft,
    "--sample-accent-glow": theme.accentGlow,
    "--sample-surface": theme.surface,
    "--sample-rail-surface": theme.railSurface
  } as CSSProperties;

  return (
    <main className="reader-shell sample-reader" style={themeStyle}>
      <header className="reader-topbar sample-reader__topbar">
        <div>
          <p className="reader-eyebrow">EMBER Leseprobe</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>

      <div className="sample-reader__layout">
        <article className="sample-reader__article">
          <section className="sample-reader__hero sample-reader__hero--lead">
            <p className="reader-eyebrow">{heroKicker}</p>
            <h2>{heroTitle}</h2>
            <p>{heroSummary}</p>
          </section>

          {scenes.map(function (scene, index) {
            const nextScene = scenes[index + 1] ?? null;
            const repeatsHeroLead =
              index === 0 &&
              scene.title === heroTitle &&
              scene.summary === heroSummary &&
              scene.kicker === "Buchprobe · Szene 1" &&
              heroKicker.startsWith("Buchprobe · Szenen");

            return (
              <section
                key={scene.id}
                id={scene.id}
                className="sample-reader__scene-block"
                aria-label={`${scene.kicker} – ${scene.title}`}
              >
                {repeatsHeroLead ? null : (
                  <div className="sample-reader__hero">
                    <p className="reader-eyebrow">{scene.kicker}</p>
                    <h2>{scene.title}</h2>
                    <p>{scene.summary}</p>
                  </div>
                )}

                <section className="sample-reader__scene">
                  {scene.paragraphs.map(function (paragraph, paragraphIndex) {
                    return <p key={`${scene.id}-p-${paragraphIndex}`}>{paragraph}</p>;
                  })}
                </section>

                {nextScene ? (
                  <div className="sample-reader__interlude" aria-hidden="true">
                    <span>Nächste Sequenz</span>
                    <strong>{nextScene.title}</strong>
                  </div>
                ) : null}
              </section>
            );
          })}

          <section className="sample-reader__divider">
            <p className="reader-eyebrow">Fortsetzung folgt</p>
            <h3>{continuationTitle}</h3>
            <p>{continuationCopy}</p>
          </section>
        </article>

        <SampleReaderControls sampleId={sampleId} scenes={sceneMeta} />
      </div>
    </main>
  );
}

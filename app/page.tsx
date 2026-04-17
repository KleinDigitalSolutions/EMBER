import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing-shell">
      <section className="landing-panel">
        <p className="landing-kicker">EMBER Studio Foundations</p>
        <h1>Authoring engine before marketplace plumbing.</h1>
        <p className="landing-copy">
          This app now has a typed studio foundation, a canonical story schema,
          and local fixture data we can evolve into real authoring workflows.
        </p>
        <div className="landing-actions">
          <Link href="/studio" className="landing-button landing-button--primary">
            Open Studio
          </Link>
          <Link href="/studio" className="landing-button">
            Open Typed Foundation
          </Link>
        </div>
      </section>
    </main>
  );
}

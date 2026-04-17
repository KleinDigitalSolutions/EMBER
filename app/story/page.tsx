import Link from "next/link";

export default function StoryPage() {
  return (
    <main className="reader-shell">
      <header className="reader-topbar">
        <div>
          <p className="reader-eyebrow">EMBER Reader</p>
          <h1>Story direkt testen</h1>
        </div>
        <div className="reader-actions">
          <Link href="/" className="landing-button">
            Store öffnen
          </Link>
          <Link href="/studio" className="landing-button">
            Zurück ins Studio
          </Link>
          <a
            href="/legacy/index.html?view=story"
            className="landing-button landing-button--primary"
            target="_blank"
            rel="noreferrer"
          >
            Im Tab öffnen
          </a>
        </div>
      </header>

      <iframe
        className="reader-frame"
        src="/legacy/index.html?view=story"
        title="EMBER Story Reader"
      />
    </main>
  );
}

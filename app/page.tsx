import Link from "next/link";

export default function HomePage() {
  return (
    <main className="reader-shell">
      <header className="reader-topbar">
        <div>
          <p className="reader-eyebrow">EMBER Store</p>
          <h1>Kuratiertes Story-Regal</h1>
        </div>
        <div className="reader-actions">
          <Link href="/story" className="landing-button landing-button--primary">
            Direkt zur Story
          </Link>
          <Link href="/studio" className="landing-button">
            Studio öffnen
          </Link>
        </div>
      </header>

      <iframe
        className="reader-frame"
        src="/legacy/index.html?view=store"
        title="EMBER Storefront"
      />
    </main>
  );
}

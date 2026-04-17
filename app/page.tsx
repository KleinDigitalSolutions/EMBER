import Link from "next/link";

export default function HomePage() {
  return (
    <main className="reader-shell">
      <iframe
        className="reader-frame"
        src="/legacy/index.html?view=store"
        title="EMBER Storefront"
      />
    </main>
  );
}

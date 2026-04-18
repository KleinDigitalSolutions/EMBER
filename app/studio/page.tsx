import Link from "next/link"
import { StudioWorkspace } from "@/components/studio/studio-workspace"
import { loadStudioStory } from "@/lib/server/studio-story-service"

type StudioPageProps = {
  searchParams?: Promise<{
    storyId?: string
  }>
}

export default async function StudioPage({ searchParams }: StudioPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const story = await loadStudioStory(resolvedSearchParams?.storyId ?? null)

  if (!story) {
    return (
      <main className="reader-shell">
        <section className="reader-topbar">
          <div>
            <p className="reader-eyebrow">EMBER Studio</p>
            <h1>Keine Buch-Story in Supabase gefunden</h1>
            <p>
              Lege zuerst einen Workspace und eine Story in der Datenbank an oder übergib
              `?storyId=...`, damit das Studio ein echtes Buchprojekt laden kann.
            </p>
          </div>
          <div className="reader-actions">
            <Link href="/" className="landing-button">
              Store öffnen
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return <StudioWorkspace story={story} />
}

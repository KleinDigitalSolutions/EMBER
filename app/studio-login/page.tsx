import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  parseStudioGateRedirectTarget,
  STUDIO_GATE_COOKIE_NAME,
  verifyStudioGateCookieValue
} from "@/lib/studio-gate"

type StudioLoginPageProps = {
  searchParams?: Promise<{
    error?: string
    next?: string
  }>
}

export default async function StudioLoginPage({ searchParams }: StudioLoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const nextTarget = parseStudioGateRedirectTarget(resolvedSearchParams?.next)
  const cookieStore = await cookies()
  const isAuthenticated = await verifyStudioGateCookieValue(
    cookieStore.get(STUDIO_GATE_COOKIE_NAME)?.value ?? null
  )

  if (isAuthenticated) {
    redirect(nextTarget)
  }

  const hasError = resolvedSearchParams?.error === "1"

  return (
    <main className="studio-login-shell">
      <section className="studio-login-card">
        <div className="studio-login-copy">
          <p className="reader-eyebrow">EMBER Studio</p>
          <h1>Studio gesperrt</h1>
          <p>
            Dieser Bereich ist intern geschützt. Nur freigegebene Zugänge dürfen
            das Studio öffnen.
          </p>
        </div>

        <form className="studio-login-form" method="post" action="/api/studio-auth/login">
          <input type="hidden" name="next" value={nextTarget} />

          <label className="studio-login-field">
            <span className="studio-login-label">Benutzername</span>
            <input
              className="studio-login-input"
              type="text"
              name="username"
              autoComplete="username"
              required
            />
          </label>

          <label className="studio-login-field">
            <span className="studio-login-label">Passwort</span>
            <input
              className="studio-login-input"
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </label>

          {hasError ? (
            <p className="studio-login-error">Benutzername oder Passwort ist falsch.</p>
          ) : null}

          <div className="studio-login-actions">
            <button type="submit" className="landing-button landing-button--primary">
              Studio öffnen
            </button>
            <Link href="/" className="landing-button">
              Zurück zum Store
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}

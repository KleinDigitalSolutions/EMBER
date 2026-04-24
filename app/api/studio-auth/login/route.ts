import { NextResponse } from "next/server"
import {
  createStudioGateCookieValue,
  getStudioGateMaxAgeSeconds,
  isStudioGateCredentialMatch,
  parseStudioGateRedirectTarget,
  STUDIO_GATE_COOKIE_NAME
} from "@/lib/studio-gate"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const formData = await request.formData()
  const username = String(formData.get("username") ?? "")
  const password = String(formData.get("password") ?? "")
  const nextTarget = parseStudioGateRedirectTarget(formData.get("next"))

  if (!isStudioGateCredentialMatch(username, password)) {
    const redirectUrl = new URL("/studio-login", request.url)
    redirectUrl.searchParams.set("error", "1")

    if (nextTarget !== "/studio") {
      redirectUrl.searchParams.set("next", nextTarget)
    }

    return NextResponse.redirect(redirectUrl, { status: 303 })
  }

  const response = NextResponse.redirect(new URL(nextTarget, request.url), {
    status: 303
  })

  response.cookies.set({
    name: STUDIO_GATE_COOKIE_NAME,
    value: await createStudioGateCookieValue(username),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getStudioGateMaxAgeSeconds()
  })

  return response
}

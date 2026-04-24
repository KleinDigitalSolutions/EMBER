import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  parseStudioGateRedirectTarget,
  STUDIO_GATE_COOKIE_NAME,
  verifyStudioGateCookieValue
} from "@/lib/studio-gate"

function isApiPath(pathname: string) {
  return pathname.startsWith("/api/")
}

export async function middleware(request: NextRequest) {
  const cookieValue = request.cookies.get(STUDIO_GATE_COOKIE_NAME)?.value ?? null
  const isAuthenticated = await verifyStudioGateCookieValue(cookieValue)

  if (isAuthenticated) {
    return NextResponse.next()
  }

  if (isApiPath(request.nextUrl.pathname)) {
    return NextResponse.json(
      {
        error: "Studio login required."
      },
      { status: 401 }
    )
  }

  const loginUrl = new URL("/studio-login", request.url)
  const nextTarget = parseStudioGateRedirectTarget(
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  )

  loginUrl.searchParams.set("next", nextTarget)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    "/studio/:path*",
    "/api/stories/:path*",
    "/api/book-jobs/:path*",
    "/api/story-chat/:path*"
  ]
}

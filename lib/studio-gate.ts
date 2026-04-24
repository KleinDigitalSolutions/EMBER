export const STUDIO_GATE_COOKIE_NAME = "ember_studio_gate"

const DEFAULT_STUDIO_GATE_USERNAME = "admin"
const DEFAULT_STUDIO_GATE_PASSWORD = "Schwarzefee99?"
const DEFAULT_STUDIO_GATE_MAX_AGE_SECONDS = 60 * 60 * 24 * 14

type StudioGatePayload = {
  u: string
  exp: number
}

export function getStudioGateUsername() {
  return process.env.STUDIO_GATE_USERNAME || DEFAULT_STUDIO_GATE_USERNAME
}

export function getStudioGatePassword() {
  return process.env.STUDIO_GATE_PASSWORD || DEFAULT_STUDIO_GATE_PASSWORD
}

export function getStudioGateMaxAgeSeconds() {
  return DEFAULT_STUDIO_GATE_MAX_AGE_SECONDS
}

function getStudioGateSecret() {
  return (
    process.env.STUDIO_GATE_SECRET ||
    `ember-studio-gate:${getStudioGateUsername()}:${getStudioGatePassword()}`
  )
}

function stringToBytes(value: string) {
  return new TextEncoder().encode(value)
}

function bytesToBinary(bytes: Uint8Array) {
  let output = ""

  for (const byte of bytes) {
    output += String.fromCharCode(byte)
  }

  return output
}

function binaryToBytes(value: string) {
  return Uint8Array.from(value, function (character) {
    return character.charCodeAt(0)
  })
}

function toBase64Url(value: string) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padding = (4 - (normalized.length % 4)) % 4

  return atob(normalized + "=".repeat(padding))
}

function encodePayload(payload: StudioGatePayload) {
  return toBase64Url(JSON.stringify(payload))
}

function decodePayload(value: string) {
  const parsed = JSON.parse(fromBase64Url(value)) as Partial<StudioGatePayload>

  if (typeof parsed.u !== "string" || typeof parsed.exp !== "number") {
    return null
  }

  return {
    u: parsed.u,
    exp: parsed.exp
  }
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false
  }

  let mismatch = 0

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return mismatch === 0
}

async function signValue(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    stringToBytes(getStudioGateSecret()),
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign("HMAC", key, stringToBytes(value))

  return toBase64Url(bytesToBinary(new Uint8Array(signature)))
}

export function isStudioGateCredentialMatch(username: string, password: string) {
  return username === getStudioGateUsername() && password === getStudioGatePassword()
}

export function parseStudioGateRedirectTarget(candidate: unknown) {
  if (typeof candidate !== "string") {
    return "/studio"
  }

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/studio"
  }

  return candidate
}

export async function createStudioGateCookieValue(username: string) {
  const payload = encodePayload({
    u: username,
    exp: Date.now() + getStudioGateMaxAgeSeconds() * 1000
  })

  const signature = await signValue(payload)

  return `${payload}.${signature}`
}

export async function verifyStudioGateCookieValue(rawValue: string | null | undefined) {
  if (!rawValue) {
    return false
  }

  const parts = rawValue.split(".")

  if (parts.length !== 2) {
    return false
  }

  const [payload, signature] = parts
  const expectedSignature = await signValue(payload)

  if (!safeEqual(signature, expectedSignature)) {
    return false
  }

  const decodedPayload = decodePayload(payload)

  if (!decodedPayload) {
    return false
  }

  if (decodedPayload.u !== getStudioGateUsername()) {
    return false
  }

  return decodedPayload.exp > Date.now()
}

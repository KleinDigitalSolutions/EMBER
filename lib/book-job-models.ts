export type BookJobProviderOption = "auto" | "openai" | "anthropic" | "gemini" | "groq" | "duo" | "local";
export type BookJobModelKey = "openai" | "anthropic" | "anthropicContinuity" | "gemini" | "groq";

export type BookJobModelSelection = Record<BookJobModelKey, string>;
export type BookJobModelOverrides = Partial<BookJobModelSelection>;

export const BOOK_JOB_PROVIDER_STORAGE_KEY = "ember_book_job_provider";
export const BOOK_JOB_MODEL_STORAGE_KEY = "ember_book_job_models";

export const DEFAULT_BOOK_JOB_MODELS: Record<BookJobModelKey, string> = {
  openai: "gpt-5.4-pro",
  anthropic: "claude-opus-4-7",
  anthropicContinuity: "claude-opus-4-7",
  gemini: "gemini-2.5-flash",
  groq: "llama-3.1-8b-instant"
};

export const BOOK_JOB_MODEL_PRESETS: Record<BookJobModelKey, string[]> = {
  openai: ["gpt-5.5", "gpt-5.4-pro", "gpt-5.4-thinking", "gpt-5.4-mini"],
  anthropic: ["claude-opus-4-7", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"],
  anthropicContinuity: ["claude-haiku-4-5-20251001", "claude-sonnet-4-6", "claude-opus-4-7"],
  gemini: ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.5-pro"],
  groq: ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "qwen/qwen3-32b"]
};

const LEGACY_GEMINI_MODEL_ALIASES: Record<string, string> = {
  "gemini-1.5-flash": "gemini-2.5-flash",
  "gemini-2.0-flash-exp": "gemini-2.5-flash",
  "gemini-3.1-pro": "gemini-2.5-pro",
  "gemini-3.1-flash-lite": "gemini-2.5-flash-lite"
};

export function sanitizeGeminiModelId(value: string | undefined | null) {
  const trimmed = value?.trim() || "";

  if (!trimmed) {
    return "";
  }

  return LEGACY_GEMINI_MODEL_ALIASES[trimmed] || trimmed;
}

export function createEmptyBookJobModelSelection(): BookJobModelSelection {
  return {
    openai: "",
    anthropic: "",
    anthropicContinuity: "",
    gemini: "",
    groq: ""
  };
}

export function parseBookJobModelSelection(value: string | null): BookJobModelSelection {
  try {
    const parsed = value ? JSON.parse(value) : {};
    return {
      openai: typeof parsed.openai === "string" ? parsed.openai : "",
      anthropic: typeof parsed.anthropic === "string" ? parsed.anthropic : "",
      anthropicContinuity:
        parsed.anthropicContinuity === "claude-haiku-4-5-20251001"
          ? "claude-opus-4-7"
          : typeof parsed.anthropicContinuity === "string"
            ? parsed.anthropicContinuity
            : "",
      gemini: sanitizeGeminiModelId(typeof parsed.gemini === "string" ? parsed.gemini : ""),
      groq: typeof parsed.groq === "string" ? parsed.groq : ""
    };
  } catch {
    return createEmptyBookJobModelSelection();
  }
}

export function buildBookJobModelOverrides(selection: BookJobModelSelection): BookJobModelOverrides {
  const overrides: BookJobModelOverrides = {};

  if (selection.openai) overrides.openai = selection.openai;
  if (selection.anthropic) overrides.anthropic = selection.anthropic;
  if (selection.anthropicContinuity) overrides.anthropicContinuity = selection.anthropicContinuity;
  if (selection.gemini) overrides.gemini = selection.gemini;
  if (selection.groq) overrides.groq = selection.groq;

  return overrides;
}

export function resolveBookJobModelValue(
  overrideValue: string | undefined,
  environmentValue: string | undefined | null,
  fallbackValue: string
) {
  const override = overrideValue?.trim();

  if (override) {
    return override;
  }

  const environment = environmentValue?.trim();

  if (environment) {
    return environment;
  }

  return fallbackValue;
}

export function isBookJobProviderOption(value: string): value is BookJobProviderOption {
  return (
    value === "auto" ||
    value === "openai" ||
    value === "anthropic" ||
    value === "gemini" ||
    value === "duo" ||
    value === "groq" ||
    value === "local"
  );
}

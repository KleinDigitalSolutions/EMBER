export type BookJobProviderOption = "auto" | "openai" | "anthropic" | "gemini" | "local";
export type BookJobRemoteProvider = Exclude<BookJobProviderOption, "auto" | "local">;
export type BookJobModelKey = "openai" | "anthropic" | "anthropicContinuity" | "gemini";
export type BookJobModelSelection = Record<BookJobModelKey, string>;
export type BookJobModelOverrides = Partial<BookJobModelSelection>;

export const BOOK_JOB_PROVIDER_STORAGE_KEY = "ember-book-job-provider";
export const BOOK_JOB_MODEL_STORAGE_KEY = "ember-book-job-models-v1";

export const DEFAULT_BOOK_JOB_MODELS: BookJobModelSelection = {
  openai: "gpt-5.4",
  anthropic: "claude-sonnet-4-6",
  anthropicContinuity: "claude-3-5-haiku-20241022",
  gemini: "gemini-2.5-flash"
};

export const BOOK_JOB_MODEL_PRESETS: Record<BookJobModelKey, string[]> = {
  openai: [DEFAULT_BOOK_JOB_MODELS.openai],
  anthropic: [DEFAULT_BOOK_JOB_MODELS.anthropic, "claude-opus-4-6"],
  anthropicContinuity: [
    DEFAULT_BOOK_JOB_MODELS.anthropicContinuity,
    DEFAULT_BOOK_JOB_MODELS.anthropic
  ],
  gemini: [DEFAULT_BOOK_JOB_MODELS.gemini]
};

export function createEmptyBookJobModelSelection(): BookJobModelSelection {
  return {
    openai: "",
    anthropic: "",
    anthropicContinuity: "",
    gemini: ""
  };
}

export function isBookJobProviderOption(value: string): value is BookJobProviderOption {
  return (
    value === "auto" ||
    value === "openai" ||
    value === "anthropic" ||
    value === "gemini" ||
    value === "local"
  );
}

export function parseBookJobModelSelection(value: string | null): BookJobModelSelection {
  if (!value) {
    return createEmptyBookJobModelSelection();
  }

  try {
    const parsed = JSON.parse(value) as Partial<Record<BookJobModelKey, unknown>>;

    return {
      openai: typeof parsed.openai === "string" ? parsed.openai : "",
      anthropic: typeof parsed.anthropic === "string" ? parsed.anthropic : "",
      anthropicContinuity:
        typeof parsed.anthropicContinuity === "string" ? parsed.anthropicContinuity : "",
      gemini: typeof parsed.gemini === "string" ? parsed.gemini : ""
    };
  } catch {
    return createEmptyBookJobModelSelection();
  }
}

export function buildBookJobModelOverrides(
  models: BookJobModelSelection
): BookJobModelOverrides | undefined {
  const overrides: BookJobModelOverrides = {};

  (Object.keys(models) as BookJobModelKey[]).forEach(function (key) {
    const value = models[key].trim();

    if (value) {
      overrides[key] = value;
    }
  });

  return Object.keys(overrides).length ? overrides : undefined;
}

export function resolveBookJobModelValue(
  overrideValue: string | undefined,
  envValue: string | undefined,
  fallbackValue: string
) {
  return overrideValue?.trim() || envValue?.trim() || fallbackValue;
}

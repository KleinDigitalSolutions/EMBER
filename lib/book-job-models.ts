export type BookJobProviderOption = "auto" | "openai" | "anthropic";
export type BookJobModelKey = "openai" | "anthropic" | "anthropicContinuity";

export type BookJobModelSelection = Record<BookJobModelKey, string>;
export type BookJobModelOverrides = Partial<BookJobModelSelection>;

export const BOOK_JOB_PROVIDER_STORAGE_KEY = "ember_book_job_provider";
export const BOOK_JOB_MODEL_STORAGE_KEY = "ember_book_job_models";

export const DEFAULT_BOOK_JOB_MODELS: Record<BookJobModelKey, string> = {
  openai: "gpt-5.4",
  anthropic: "claude-sonnet-4-6",
  anthropicContinuity: "claude-sonnet-4-6"
};

export const BOOK_JOB_MODEL_PRESETS: Record<BookJobModelKey, string[]> = {
  openai: ["gpt-5.5", "gpt-5.4", "gpt-5.4-mini"],
  anthropic: ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"],
  anthropicContinuity: ["claude-haiku-4-5-20251001", "claude-sonnet-4-6", "claude-opus-4-6"]
};

export function createEmptyBookJobModelSelection(): BookJobModelSelection {
  return {
    openai: "",
    anthropic: "",
    anthropicContinuity: ""
  };
}

export function parseBookJobModelSelection(value: string | null): BookJobModelSelection {
  try {
    const parsed = value ? JSON.parse(value) : {};
    return {
      openai: typeof parsed.openai === "string" ? normalizeKnownModelAlias(parsed.openai) ?? "" : "",
      anthropic: typeof parsed.anthropic === "string" ? normalizeKnownModelAlias(parsed.anthropic) ?? "" : "",
      anthropicContinuity:
        parsed.anthropicContinuity === "claude-haiku-4-5-20251001"
          ? "claude-sonnet-4-6"
          : typeof parsed.anthropicContinuity === "string"
            ? normalizeKnownModelAlias(parsed.anthropicContinuity) ?? ""
            : ""
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

  return overrides;
}

export function resolveBookJobModelValue(
  overrideValue: string | undefined,
  environmentValue: string | undefined | null,
  fallbackValue: string
) {
  const override = normalizeKnownModelAlias(overrideValue?.trim());

  if (override) {
    return override;
  }

  const environment = normalizeKnownModelAlias(environmentValue?.trim());

  if (environment) {
    return environment;
  }

  return fallbackValue;
}

function normalizeKnownModelAlias(value: string | undefined) {
  if (value === "claude-opus-4-7") {
    return "claude-opus-4-6";
  }

  if (value === "gpt-5.4-pro" || value === "gpt-5.4-thinking") {
    return "gpt-5.4";
  }

  return value;
}

export function isBookJobProviderOption(value: string): value is BookJobProviderOption {
  return (
    value === "auto" ||
    value === "openai" ||
    value === "anthropic"
  );
}

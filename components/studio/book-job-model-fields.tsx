import {
  BOOK_JOB_MODEL_PRESETS,
  DEFAULT_BOOK_JOB_MODELS,
  type BookJobModelKey,
  type BookJobModelSelection,
  type BookJobProviderOption
} from "@/lib/book-job-models";

const MODEL_FIELD_COPY: Record<
  BookJobModelKey,
  { label: string; hint: string; resetLabel: string }
> = {
  openai: {
    label: "OpenAI Modell-ID",
    hint: "Hauptmodell für Generierung",
    resetLabel: "Env/Default"
  },
  anthropic: {
    label: "Anthropic Modell-ID",
    hint: "Hauptmodell für literarische Qualität",
    resetLabel: "Env/Default"
  },
  anthropicContinuity: {
    label: "Anthropic Continuity-ID",
    hint: "Modell für Kontinuitäts-Checks",
    resetLabel: "Env/Default"
  },
  gemini: {
    label: "Gemini Modell-ID",
    hint: "Modell für schnelles Iterieren",
    resetLabel: "Env/Default"
  },
  groq: {
    label: "Groq Modell-ID",
    hint: "Modell für schnelle Testläufe über Groq",
    resetLabel: "Env/Default"
  }
};

const DUO_DEFAULT_MODELS: Partial<Record<BookJobModelKey, string>> = {
  anthropic: "claude-opus-4-7",
  openai: "gpt-5.5"
};

export function BookJobModelFields(props: {
  provider: BookJobProviderOption;
  models: BookJobModelSelection;
  onChangeModel: (key: BookJobModelKey, value: string) => void;
  onResetModel: (key: BookJobModelKey) => void;
}) {
  const visibleKeys = getVisibleModelKeys(props.provider);

  if (!visibleKeys.length) {
    return null;
  }

  return (
    <div className="book-model-config" style={{ borderRadius: 0 }}>
      <div className="book-model-config__head">
        <strong>Modelle</strong>
        <span>
          {props.provider === "auto"
            ? "Auto-Modus nutzt die Standardeinstellungen."
            : props.provider === "duo"
              ? "Opus schreibt die Erstfassung, GPT übernimmt Struktur-, Continuity-, Quality- und Friction-Pässe."
              : "Wähle das Modell für diesen Provider aus."}
        </span>
      </div>

      <div className="book-model-grid">
        {visibleKeys.map(function (key) {
          const copy = getModelFieldCopy(props.provider, key);
          const value = props.models[key];
          const presets = BOOK_JOB_MODEL_PRESETS[key];
          const defaultValue = getDefaultModelForProvider(props.provider, key);

          return (
            <label key={key} className="editor-field book-model-field">
              <span>{copy.label}</span>
              <div className="book-dropdown-group">
                <select
                  className="editor-input editor-select"
                  style={{ borderRadius: 0 }}
                  value={value || ""}
                  onChange={function (event) {
                    const nextValue = event.target.value;
                    if (nextValue === "default") {
                      props.onResetModel(key);
                    } else {
                      props.onChangeModel(key, nextValue);
                    }
                  }}
                >
                  <option value="default">{defaultValue}</option>
                  {presets.map(function (preset) {
                    if (preset === defaultValue) {
                      return null;
                    }

                    return (
                      <option key={preset} value={preset}>
                        {preset}
                      </option>
                    );
                  })}
                </select>
              </div>
              <small className="book-model-field__hint">{copy.hint}</small>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function getVisibleModelKeys(provider: BookJobProviderOption) {
  if (provider === "duo") {
    return ["anthropic", "openai"] as BookJobModelKey[];
  }

  if (provider === "openai") {
    return ["openai"] as BookJobModelKey[];
  }

  if (provider === "anthropic") {
    return ["anthropic", "anthropicContinuity"] as BookJobModelKey[];
  }

  if (provider === "gemini") {
    return ["gemini"] as BookJobModelKey[];
  }

  if (provider === "groq") {
    return ["groq"] as BookJobModelKey[];
  }

  if (provider === "auto") {
    return ["openai", "anthropic", "anthropicContinuity", "gemini", "groq"] as BookJobModelKey[];
  }

  return [];
}

function getDefaultModelForProvider(provider: BookJobProviderOption, key: BookJobModelKey) {
  if (provider === "duo" && DUO_DEFAULT_MODELS[key]) {
    return DUO_DEFAULT_MODELS[key] as string;
  }

  return DEFAULT_BOOK_JOB_MODELS[key];
}

function getModelFieldCopy(provider: BookJobProviderOption, key: BookJobModelKey) {
  if (provider !== "duo") {
    return MODEL_FIELD_COPY[key];
  }

  if (key === "anthropic") {
    return {
      label: "Opus Writer",
      hint: "Szenische Erstfassung mit Prosa, Dialog und Körperlichkeit",
      resetLabel: "Duo-Default"
    };
  }

  if (key === "openai") {
    return {
      label: "GPT Prüfpässe",
      hint: "Beat-Plan, Rewrite, Continuity, Quality und Literary Friction",
      resetLabel: "Duo-Default"
    };
  }

  return MODEL_FIELD_COPY[key];
}

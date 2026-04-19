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
  }
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
            : "Wähle das Modell für diesen Provider aus."}
        </span>
      </div>

      <div className="book-model-grid">
        {visibleKeys.map(function (key) {
          const copy = MODEL_FIELD_COPY[key];
          const value = props.models[key];
          const presets = BOOK_JOB_MODEL_PRESETS[key];

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
                  <option value="default">{copy.resetLabel} ({DEFAULT_BOOK_JOB_MODELS[key]})</option>
                  {presets.map(function (preset) {
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
  if (provider === "openai") {
    return ["openai"] as BookJobModelKey[];
  }

  if (provider === "anthropic") {
    return ["anthropic", "anthropicContinuity"] as BookJobModelKey[];
  }

  if (provider === "gemini") {
    return ["gemini"] as BookJobModelKey[];
  }

  if (provider === "auto") {
    return ["openai", "anthropic", "anthropicContinuity", "gemini"] as BookJobModelKey[];
  }

  return [];
}

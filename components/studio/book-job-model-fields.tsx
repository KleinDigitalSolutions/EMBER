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
    hint: "Leer = OPENAI_BOOK_MODEL oder gpt-5.4.",
    resetLabel: "Env/Default"
  },
  anthropic: {
    label: "Anthropic Modell-ID",
    hint: "Leer = ANTHROPIC_BOOK_MODEL oder claude-sonnet-4-6.",
    resetLabel: "Env/Default"
  },
  anthropicContinuity: {
    label: "Anthropic Continuity-ID",
    hint: "Leer = ANTHROPIC_CONTINUITY_MODEL oder claude-3-5-haiku-20241022.",
    resetLabel: "Env/Default"
  },
  gemini: {
    label: "Gemini Modell-ID",
    hint: "Leer = GEMINI_BOOK_MODEL oder gemini-2.5-flash.",
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
    <div className="book-model-config">
      <div className="book-model-config__head">
        <strong>Modelle</strong>
        <span>
          {props.provider === "auto"
            ? "Auto berücksichtigt die gespeicherten Overrides des Providers, der den Job übernimmt."
            : "Freie Modell-IDs werden direkt an den ausgewählten Provider übergeben."}
        </span>
      </div>

      <div className="book-model-grid">
        {visibleKeys.map(function (key) {
          const copy = MODEL_FIELD_COPY[key];
          const value = props.models[key];

          return (
            <label key={key} className="editor-field book-model-field">
              <span>{copy.label}</span>
              <input
                className="editor-input"
                type="text"
                value={value}
                placeholder={DEFAULT_BOOK_JOB_MODELS[key]}
                onChange={function (event) {
                  props.onChangeModel(key, event.target.value);
                }}
              />
              <small className="book-model-field__hint">{copy.hint}</small>
              <div className="book-model-preset-row">
                {BOOK_JOB_MODEL_PRESETS[key].map(function (preset) {
                  return (
                    <button
                      key={preset}
                      className={
                        "book-model-preset" +
                        (value.trim() === preset ? " book-model-preset--active" : "")
                      }
                      type="button"
                      onClick={function () {
                        props.onChangeModel(key, preset);
                      }}
                    >
                      {preset}
                    </button>
                  );
                })}

                <button
                  className="book-model-preset"
                  type="button"
                  onClick={function () {
                    props.onResetModel(key);
                  }}
                >
                  {copy.resetLabel}
                </button>
              </div>
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

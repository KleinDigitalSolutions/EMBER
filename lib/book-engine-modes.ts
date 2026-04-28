export type BookEngineMode = "default" | "ya_superhero_origin" | "domestic_suspense_thriller";

export const BOOK_ENGINE_MODE_OPTIONS: Array<{
  id: BookEngineMode;
  label: string;
}> = [
  { id: "default", label: "Default" },
  { id: "ya_superhero_origin", label: "YA Superhelden-Origin" },
  { id: "domestic_suspense_thriller", label: "Domestic-Suspense-Thriller" }
];

export function isBookEngineMode(value: unknown): value is BookEngineMode {
  return BOOK_ENGINE_MODE_OPTIONS.some(function (option) {
    return option.id === value;
  });
}

export function formatBookEngineModeLabel(value: BookEngineMode) {
  return BOOK_ENGINE_MODE_OPTIONS.find(function (option) {
    return option.id === value;
  })?.label ?? "Default";
}

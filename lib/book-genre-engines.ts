import type { BookEngineMode } from "@/lib/book-engine-modes";
import { buildDomesticSuspenseThrillerEnginePrompt } from "@/lib/book-genre-engine-domestic-thriller";
import { buildYaSuperheroOriginEnginePrompt } from "@/lib/book-genre-engine-ya-superhero";

export function buildGenreEnginePrompt(mode: BookEngineMode) {
  switch (mode) {
    case "ya_superhero_origin":
      return buildYaSuperheroOriginEnginePrompt();
    case "domestic_suspense_thriller":
      return buildDomesticSuspenseThrillerEnginePrompt();
    default:
      return "";
  }
}

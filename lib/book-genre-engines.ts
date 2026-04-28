import type { BookEngineMode } from "@/lib/book-engine-modes";

export function buildGenreEnginePrompt(mode: BookEngineMode) {
  switch (mode) {
    case "ya_superhero_origin":
      return buildYaSuperheroOriginEnginePrompt();
    default:
      return "";
  }
}

function buildYaSuperheroOriginEnginePrompt() {
  return [
    "GENRE ENGINE: YA-Superhelden-Origin.",
    "Priorisiere Teenager-Reibung, konkrete Szene und Beziehungsspannung vor Lore-Erklaerung.",
    "Erklaerungen zu Technik, Kraeften oder Institutionen duerfen die soziale, koerperliche oder praktische Szene nicht ueberholen.",
    "Kraefte zeigen sich zuerst klein, stoerend und unkontrolliert: als Problem, Kosten, Risiko, Peinlichkeit oder Beziehungsspannung, bevor sie nuetzlich werden.",
    "Das Team darf nicht sofort kompetent sein. Missverstaendnisse, Reibung, falsches Timing und ungleich verteilter Mut gehoeren zum Genre.",
    "Technik, Kraefte, Mentorfiguren und Institutionen duerfen Plotprobleme nie bequem loesen. Jede Hilfe braucht Grenze, Kosten, Risiko oder Folgeproblem.",
    "Die Organisation eskaliert diskret und plausibel: erst Beobachtung, Nachfragen, Druck und Zugriff; offene Konfrontation kommt erst spaeter.",
    "Humor entsteht aus Verhalten, Timing und Figuren-Eigenheiten. Er darf Gefahr nicht entwerten und Figuren nicht zu Witzen machen.",
    "Erzaehlerkommentare bleiben punktuell. Sie geben Farbe, aber werden nicht zur Dauerpointe, Dauererklaerung oder ironischen Distanz zur Szene.",
    "Schreibe keine fertige Superhelden-Kompetenz zu frueh. Jede neue Faehigkeit muss erst verstanden, falsch benutzt oder emotional bezahlt werden."
  ].join("\n");
}

import type { BookEngineMode } from "./book-engine-modes";
import {
  type BookLockedFacts,
  type BookProseTechniqueProfile
} from "./story-schema";

export type DomesticSuspenseThrillerSignals = {
  isDomesticSuspense: boolean;
  alltagsnah: boolean;
  noThrillerLoudness: boolean;
  matches: boolean;
};

export function detectDomesticSuspenseThrillerSignals(normalizedSignals: string): DomesticSuspenseThrillerSignals {
  const isDomesticSuspense =
    normalizedSignals.includes("domestic suspense") ||
    normalizedSignals.includes("psychological thriller");
  const alltagsnah =
    normalizedSignals.includes("alltags") ||
    normalizedSignals.includes("routine") ||
    normalizedSignals.includes("institution") ||
    normalizedSignals.includes("verwaltungs");
  const noThrillerLoudness =
    normalizedSignals.includes("ohne thrillerlarm") ||
    normalizedSignals.includes("keine thrillershow") ||
    normalizedSignals.includes("nicht wie tech-thriller") ||
    normalizedSignals.includes("nicht wie ein thrillerbeweis");

  return {
    isDomesticSuspense,
    alltagsnah,
    noThrillerLoudness,
    matches: isDomesticSuspense || alltagsnah
  };
}

export function buildDomesticSuspenseThrillerEnginePrompt() {
  const profile = buildDomesticSuspenseThrillerProseTechniqueProfile({
    alltagsnah: true,
    noThrillerLoudness: true
  });

  return [
    "GENRE ENGINE: Domestic-Suspense-Thriller.",
    "",
    "Diese Regeln sind verbindlich fuer Falllogik, Beweisfuehrung, Alltagsdruck, Institutionen und psychologische Eskalation.",
    "",
    "GRUNDSPUR:",
    profile.narrativeIntent,
    "Druck entsteht aus dokumentierten Stoerungen, sozialer Glaubwuerdigkeit, Zugriff, Verfahren, Beziehungen und konkreten Alltagszeichen.",
    "Keine laute Thrillershow, wenn ein Gegenstand, ein Dokument, ein Zeitpunkt oder ein sozialer Blick den Horror bereits traegt.",
    "",
    "FALL- UND BEWEISLOGIK:",
    "Trenne Verdacht, Beweis, Dokumentation, Erinnerung und soziale Wirkung.",
    "Ein Beweisbild darf nicht automatisch eine Erklaerung liefern.",
    "Alibi, Benachrichtigung, Uhrzeit, Dokument, Institution und Zuständigkeit sind harte Druckmittel, wenn sie im Projekt gesetzt sind.",
    "Keine Zufallsaufloesung: Jede neue Sicherheit muss aus Szene, Dokument, Beziehung oder vorherigem Setup kommen.",
    "",
    "SZENENFUEHRUNG:",
    ...profile.techniqueRules,
    "",
    "ANTI-IMITATION UND TON:",
    ...profile.antiImitationRules
  ].join("\n");
}

export function buildDomesticSuspenseThrillerProseTechniqueProfile(params: {
  alltagsnah?: boolean;
  noThrillerLoudness?: boolean;
} = {}): BookProseTechniqueProfile {
  const alltagsnah = params.alltagsnah ?? true;
  const noThrillerLoudness = params.noThrillerLoudness ?? false;

  return {
    narrativeIntent:
      "Alltagsnahe psychologische Suspense: dokumentierte Stoerung, sozialer Druck und ruhiger Verlust von Zugriff statt lauter Schauwerte.",
    povDistance: "tight_close",
    tensionMode: "progressive_escalation",
    expositionMode: "embedded_only",
    sensoryWeight: "medium_high",
    interiorityMode: "micro_reactions",
    sentenceDynamics: {
      baseline: "controlled_medium",
      underStress: "shorter_and_tighter",
      fragmentation: "occasional_under_peak_stress"
    },
    sceneHooks: {
      opening: "disturbance_first",
      ending: "proof_image_or_status_threat"
    },
    dialogueMode: "subtext_and_procedural_friction",
    revealPattern: "withhold_then_validate",
    anchorPolicy: "every_scene_needs_a_concrete_object_or_document_anchor",
    techniqueRules: uniqueStrings(
      [
        "Beginne so nah wie moeglich am ersten realen Angriff oder Stoermoment.",
        "Fuehre Spannung ueber Dokumente, Objekte, Routinen und soziale Reaktionen statt ueber Showeffekte.",
        "Backstory nur unter Bewegung; Vergangenheit kommt in kleinen spaeten Einsprengseln, nie als Bremsblock.",
        "Innenleben ueber Koerper, Wahrnehmung, Mikroentscheidung und kurzen Deutungsdruck tragen.",
        "Satzlaenge unter Druck sichtbar verdichten, ohne in abgehackte Dauerstakkati zu kippen.",
        "Nach Proof-Image, Evidenzturn oder klarem Machtwechsel sofort oder sehr frueh aus der Szene gehen.",
        "Dialog muss Vertrauen, Verfahren, Zugriff oder Machtbalance verschieben."
      ].concat(
        noThrillerLoudness
          ? [
              "Keine Thriller-Hysterie: Druck bleibt ruhig, plausibel und institutionell lesbar.",
              "Nicht ueberbauen. Wenn ein Gegenstand oder Satz den Horror traegt, nicht nochmal aufdrehen."
            ]
          : []
      )
    ),
    antiImitationRules: uniqueStrings(
      [
        "Keine Stilkopie einzelner Autorinnen, Autoren oder Comp Titles.",
        "Keine markanten Phrasen, Setzungen oder Signaturbilder aus Referenztexten uebernehmen.",
        "Tempo und Hooks ueber eigene Satzentscheidungen und Szenenlogik herstellen, nicht ueber erkennbare Fremdstimme."
      ].concat(
        alltagsnah
          ? [
              "Bedrohung ueber Alltagsbeweise, Verfahren und soziale Reibung tragen, nicht ueber grelle Thrillerornamente."
            ]
          : []
      )
    )
  };
}

export function buildDomesticSuspenseLockedFactHardConstraints(params: {
  engineMode: BookEngineMode;
  lockedFacts: BookLockedFacts;
  sceneText: string;
  containsTerm: (normalizedText: string, rawTerm: string) => boolean;
}) {
  const lockedFacts = params.lockedFacts;
  const sceneText = params.sceneText;
  const containsTerm = params.containsTerm;
  const hasDomesticLockedFacts = Boolean(
    lockedFacts.childName ||
    lockedFacts.coparentName ||
    lockedFacts.incidentDate ||
    lockedFacts.incidentTime ||
    lockedFacts.notificationTime ||
    lockedFacts.firstOfficeTime ||
    lockedFacts.evaAlibiLocation ||
    lockedFacts.evaAlibiWindow ||
    lockedFacts.documentedPickupPerson
  );
  const constraints: string[] = [];
  const shouldUseDomesticConstraints =
    params.engineMode === "domestic_suspense_thriller" ||
    (params.engineMode === "default" && hasDomesticLockedFacts);

  if (!shouldUseDomesticConstraints) {
    return constraints;
  }

  if (
    lockedFacts.institutionName &&
    (containsTerm(sceneText, lockedFacts.institutionName) || containsTerm(sceneText, "kita"))
  ) {
    constraints.push(
      `Locked Fact - Kita: ${lockedFacts.institutionName}. Wenn die Einrichtung namentlich auftaucht, muss sie so heissen.`
    );
  }

  if (
    lockedFacts.incidentDate &&
    (
      containsTerm(sceneText, lockedFacts.incidentDate) ||
      containsTerm(sceneText, "datum") ||
      containsTerm(sceneText, "vortag") ||
      containsTerm(sceneText, "app-eintrag") ||
      containsTerm(sceneText, "abschlussvermerk")
    )
  ) {
    constraints.push(`Locked Fact - Vorfallsdatum: ${lockedFacts.incidentDate}.`);
  }

  if (
    lockedFacts.incidentTime &&
    (
      containsTerm(sceneText, lockedFacts.incidentTime) ||
      containsTerm(sceneText, "abhol") ||
      containsTerm(sceneText, "app-eintrag") ||
      containsTerm(sceneText, "abschlussvermerk")
    )
  ) {
    constraints.push(`Locked Fact - Dokumentierte Abholzeit: ${lockedFacts.incidentTime} Uhr.`);
  }

  if (
    lockedFacts.notificationTime &&
    (
      containsTerm(sceneText, lockedFacts.notificationTime) ||
      containsTerm(sceneText, "app") ||
      containsTerm(sceneText, "benachrichtigung")
    )
  ) {
    constraints.push(`Locked Fact - App-Benachrichtigung: ${lockedFacts.notificationTime} Uhr.`);
  }

  if (
    lockedFacts.firstOfficeTime &&
    (
      containsTerm(sceneText, lockedFacts.firstOfficeTime) ||
      containsTerm(sceneText, "leitungsbuero") ||
      containsTerm(sceneText, "petra")
    )
  ) {
    constraints.push(`Locked Fact - Leitungsbuero-Zeit: ${lockedFacts.firstOfficeTime} Uhr.`);
  }

  if (
    lockedFacts.evaAlibiLocation &&
    (
      containsTerm(sceneText, lockedFacts.evaAlibiLocation) ||
      containsTerm(sceneText, "nachweisbar") ||
      containsTerm(sceneText, "kundentermin") ||
      containsTerm(sceneText, "alibi")
    )
  ) {
    constraints.push(`Locked Fact - Alibi-Ort: ${lockedFacts.evaAlibiLocation}.`);
  }

  if (
    lockedFacts.evaAlibiWindow &&
    (
      containsTerm(sceneText, lockedFacts.evaAlibiWindow) ||
      containsTerm(sceneText, "kundentermin") ||
      containsTerm(sceneText, "alibi") ||
      containsTerm(sceneText, "termin")
    )
  ) {
    constraints.push(`Locked Fact - Alibi-Zeitfenster: ${lockedFacts.evaAlibiWindow}.`);
  }

  if (
    lockedFacts.documentedPickupPerson &&
    (
      containsTerm(sceneText, lockedFacts.documentedPickupPerson) ||
      containsTerm(sceneText, "dokumentierte abholperson") ||
      containsTerm(sceneText, "abholperson") ||
      containsTerm(sceneText, "app-eintrag") ||
      containsTerm(sceneText, "abschlussvermerk") ||
      containsTerm(sceneText, "abholbuch") ||
      containsTerm(sceneText, "protokoll")
    )
  ) {
    constraints.push(`Locked Fact - Dokumentierte Abholperson: ${lockedFacts.documentedPickupPerson}.`);
  }

  return constraints;
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map(function (value) {
    return value.trim();
  }).filter(Boolean)));
}

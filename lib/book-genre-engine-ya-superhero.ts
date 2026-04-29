import type { BookEngineMode } from "./book-engine-modes";
import type {
  BookCommonLockedFacts,
  BookYaSuperheroOriginLockedFacts
} from "./story-schema";

export type YaSuperheroOriginLockedFactInput = {
  engineMode: BookEngineMode;
  characters: Array<{
    name: string;
    role: string;
  }>;
  signalText: string;
};

export function deriveYaSuperheroOriginLockedFacts(params: YaSuperheroOriginLockedFactInput): {
  common: Partial<BookCommonLockedFacts>;
  profile: BookYaSuperheroOriginLockedFacts;
} {
  const teamMemberNames = deriveYaSuperheroTeamMemberNames(params.characters, params.engineMode);

  if (params.engineMode !== "ya_superhero_origin") {
    return {
      common: {},
      profile: createEmptyYaSuperheroOriginLockedFacts()
    };
  }

  return {
    common: {
      protagonistNames: teamMemberNames,
      institutionNames: deriveInstitutionNames(params.signalText),
      keyObjectNames: uniqueStrings([
        deriveSubstanceName(params.signalText),
        deriveAiCompanionName(params.signalText)
      ].filter(function (value): value is string {
        return Boolean(value);
      }))
    },
    profile: {
      teamMemberNames,
      substanceName: deriveSubstanceName(params.signalText),
      aiCompanionName: deriveAiCompanionName(params.signalText),
      experimentLocation: deriveInstitutionNames(params.signalText)[0] ?? null,
      organizationName: deriveOrganizationName(params.signalText),
      triggerEvent: findSentence(params.signalText, /\b(?:energieentladung|entlaedt|entlädt|getroffen|ausgesetzt|exponiert|aktivierung)\b/i),
      accidentMechanism: findSentence(params.signalText, /\b(?:entlaedt|entlädt|trifft|getroffen|ausgesetzt|exponiert)\b/i),
      powerOrigin: findSentence(params.signalText, /\b(?:kraefte|kräfte|power|powers)\b.*\b(?:nebeneffekt|unfall|experiment|kontakt|ausgesetzt|exponiert)\b/i)
    }
  };
}

export function buildYaSuperheroOriginEnginePrompt() {
  return [
    "GENRE ENGINE: YA-Superhelden-Origin.",
    "",
    "Diese Regeln sind verbindlich fuer Szenenaufbau, Erzählerhaltung, Kraefte, Teamdynamik und Eskalation.",
    "",
    "FIGUREN UND TEAM:",
    "Priorisiere Teenager-Reibung, konkrete Szene und Beziehungsspannung vor Lore-Erklaerung.",
    "Das Team darf nicht sofort kompetent, harmonisch oder heldenhaft wirken.",
    "Missverstaendnisse, falsches Timing, Peinlichkeit, Ausweichen, Trotz und ungleich verteilter Mut gehoeren zum Genre.",
    "Jede Szene soll zeigen, dass die Figuren noch Jugendliche sind: sozial, koerperlich, emotional und praktisch.",
    "",
    "KRAEFTE:",
    "Kraefte zeigen sich zuerst klein, stoerend und unkontrolliert.",
    "Kraefte erzeugen zuerst Problem, Kosten, Risiko, Peinlichkeit oder Beziehungsspannung, bevor sie nuetzlich werden.",
    "Schreibe keine fertige Superhelden-Kompetenz zu frueh.",
    "Jede neue Faehigkeit muss erst missverstanden, falsch benutzt, gefuerchtet oder emotional bezahlt werden.",
    "Kraefte duerfen Probleme nicht bequem loesen. Jede Loesung braucht Grenze, Nebenwirkung, Risiko oder Folgeproblem.",
    "",
    "TECHNIK, MENTOREN, INSTITUTIONEN:",
    "Technik, KI-Assistenten, Mentorfiguren und Institutionen duerfen keine Allzweckloesungen sein.",
    "Wenn sie helfen, dann begrenzt: durch fehlende Daten, falsche Annahmen, Zeitdruck, Zugriffsbeschraenkung, Akku, Angst, Risiko oder soziale Konsequenzen.",
    "Erklaerungen zu Technik, Kraeften oder Institutionen duerfen die Szene nicht ueberholen.",
    "Erklaere nur so viel, wie die Figur in diesem Moment brauchen, fuehlen oder missverstehen kann.",
    "",
    "ORGANISATION / BEDROHUNG:",
    "Die Bedrohung soll durch konkrete Entscheidungen einzelner Verantwortlicher spuerbar werden, nicht nur durch abstrakte Institutionen.",
    "Die Organisation eskaliert diskret und plausibel.",
    "Beginne mit Beobachtung, Auswertung, Nachfragen, Druck, Zugriff und Konsequenzen.",
    "Offene Konfrontation, Entfuehrung oder Kampf kommen erst spaeter, wenn die Lage bereits enger geworden ist.",
    "Die Organisation soll nicht gesichtslos wirken: Entscheidungen sollen ueber konkrete Menschen, Motive, Druck und Verantwortung spuerbar werden.",
    "",
    "ERZAEHLER:",
    "Nutze einen auktorialen Erzaehler: keine Ich-Figur, sondern eine klare externe Stimme.",
    "Der Erzaehler darf zwischen Figuren wechseln und Dinge wissen, die die Jugendlichen selbst noch nicht wissen.",
    "Der Erzaehler bleibt meistens nah, ernst und szenisch. Er kommentiert nur punktuell.",
    "Erzaehlerkommentare sind kurze Beobachtungen aus Verhalten, Timing und Figuren-Eigenheiten, keine langen Witze und keine Meta-Erklaerungen.",
    "Der Erzaehler darf Figuren liebevoll aufziehen, aber nie vorfuehren oder verachten.",
    "Bei impulsiven, chaotischen Figuren darf der Erzaehler haeufiger mit einer 'wirklich jetzt?'-Energie kommentieren.",
    "Diese Kommentare sollen wie ein kurzes Augenrollen wirken: trocken, beobachtend, nicht boshaft.",
    "Bei stillen oder verletzlichen Figuren kommentiert der Erzaehler seltener und leiser, damit diese Momente mehr Gewicht haben.",
    "Bei kontrollierten, ehrgeizigen Figuren darf der Erzaehler ihre Fehler etwas spaeter oder sanfter benennen, ohne sie zu entschuldigen.",
    "Der Erzaehler darf Situationen kommentieren, wenn Verhalten und Timing es tragen, aber nicht jede Szene braucht einen Kommentar.",
    "Erzaehlerkommentare duerfen Farbe geben, aber nicht zur Dauerpointe, Dauererklaerung oder ironischen Distanz zur Szene werden.",
    "",
    "HUMOR UND TON:",
    "Humor entsteht aus Verhalten, Timing, Kontrast und Figuren-Eigenheiten.",
    "Humor darf Gefahr nicht entwerten.",
    "Figuren duerfen lustig sein, aber nicht zu Witzen reduziert werden.",
    "Der Ton bleibt modern, konkret, emotional lesbar und filmisch, ohne generische Superhelden-Pose.",
    "",
    "WUNSCH UND ANGST:",
    "Kraefte sollen nicht nur Belastung sein. Erlaube kurze Momente von Staunen, Rausch, Freude oder Wunschfantasie.",
    "Diese Momente duerfen aber nicht lange ungebrochen bleiben: Auf Staunen folgt Unsicherheit, Grenze, Risiko oder soziale Konsequenz.",
    "Die Figuren duerfen sich besonders fuehlen, muessen aber lernen, dass besonders sein nicht dasselbe ist wie bereit sein.",
    "EMOTIONALE KONSEQUENZ:",
    "Nach Kraefteinsatz, Gefahr oder Eskalation muss eine emotionale Folge sichtbar bleiben.",
    "Zeige nicht nur was passiert ist, sondern was es zwischen den Figuren veraendert: Vertrauen, Scham, Angst, Stolz, Schuld oder Naehe.",
    "Action ist nur dann stark, wenn sie Beziehungen, Selbstbild oder Geheimhaltung veraendert.",
    "GEHEIMNIS UND DOPPELLEBEN:",
    "Die Kraefte erzeugen Doppelleben-Druck: Schule, Familie, Freundschaften und Alltag duerfen nicht einfach pausieren.",
    "Geheimhaltung soll soziale Kosten haben: Ausreden, verpasste Termine, Luegen, Schuldgefuehle, Misstrauen oder peinliche Situationen.",
    "Superhelden-Handlung darf den Teenager-Alltag nicht ersetzen, sondern muss mit ihm kollidieren.",
    "ANTI-KLISCHEE:",
    "Vermeide sofortige Meisterschaft, glatte Teamchemie, reine Lore-Infodumps, allwissende Technik, Mentor-Deus-ex-machina und generische Heldensprueche.",
    "Wenn eine Szene zu sauber, zu erklaerend oder zu kompetent wirkt, fuege soziale Reibung, Unsicherheit, Kosten oder eine konkrete koerperliche/praktische Begrenzung hinzu."
  ].join("\n");
}

function createEmptyYaSuperheroOriginLockedFacts(): BookYaSuperheroOriginLockedFacts {
  return {
    teamMemberNames: [],
    substanceName: null,
    aiCompanionName: null,
    experimentLocation: null,
    organizationName: null,
    triggerEvent: null,
    accidentMechanism: null,
    powerOrigin: null
  };
}

function deriveYaSuperheroTeamMemberNames(
  characters: YaSuperheroOriginLockedFactInput["characters"],
  engineMode: BookEngineMode
) {
  if (engineMode !== "ya_superhero_origin") {
    return [];
  }

  return uniqueStrings(characters
    .filter(function (character) {
      const normalizedName = normalizeText(character.name);
      const normalizedRole = normalizeText(character.role);

      if (!character.name.trim()) {
        return false;
      }

      if (/^(?:dr|prof)\.?\s+/.test(normalizedName)) {
        return false;
      }

      return !/ki|assistenz|leiter|organisation|gegenkraft|mentor|erwachsen/.test(normalizedRole);
    })
    .map(function (character) {
      return character.name;
    })
    .slice(0, 6));
}

function matchSingle(value: string, pattern: RegExp) {
  return value.match(pattern)?.[1]?.trim() ?? null;
}

function deriveInstitutionNames(value: string) {
  const names: string[] = [];
  const patterns = [
    /\b(?:im|ins|in das|in den|am|zum|zur)\s+([A-ZÄÖÜ][\p{L}0-9 .'-]+?(?:Science Center|Wissenschaftszentrum|Forschungszentrum|Institut|Institute|Labor|Lab|University|College|High School|Academy|Akademie|Zentrum|Center))\b/gu,
    /\b(?:Schauplatz|Ausflugsschauplatz|Experimentort|Laborstandort|Forschungsort|Ort):\s*([A-ZÄÖÜ][^\n.;]+)/gu
  ];

  patterns.forEach(function (pattern) {
    for (const match of value.matchAll(pattern)) {
      const candidate = cleanFactName(match[1]);
      if (candidate) {
        names.push(candidate);
      }
    }
  });

  return uniqueStrings(names);
}

function deriveSubstanceName(value: string) {
  const directMatch = matchSingle(
    value,
    /\b([A-ZÄÖÜ][\p{L}0-9-]+(?:\s+[A-ZÄÖÜ0-9][\p{L}0-9-]+){0,5})\s+ist\s+(?:eine|ein|der|die|das)?[^.]*\b(?:Substanz|Materie|Material|Serum|Stoff|Element|Ressource)\b/iu
  );

  if (directMatch) {
    return cleanFactName(directMatch);
  }

  const substanceSentence = findSentence(
    value,
    /\b(?:substanz|materie|material|serum|stoff|element|ressource)\b/i
  );

  if (!substanceSentence) {
    return null;
  }

  return (
    matchSingle(
      substanceSentence,
      /^([A-ZÄÖÜ][\p{L}0-9-]+(?:\s+[A-ZÄÖÜ0-9][\p{L}0-9-]+){0,5})\s+ist\s+/u
    ) ||
    matchSingle(
      substanceSentence,
      /\b(?:Name|Bezeichnung|Arbeitstitel)\s*:\s*([A-ZÄÖÜ][\p{L}0-9 .'-]{1,60})/u
    )
  );
}

function deriveAiCompanionName(value: string) {
  const directMatch = matchSingle(
    value,
    /\b([A-ZÄÖÜ][\p{L}0-9. -]{1,40})\s+ist\s+[^.]*\b(?:assistenz-ki|ki-assistent|ki|ai|kuenstliche intelligenz|künstliche intelligenz)\b/iu
  );

  if (directMatch) {
    return cleanFactName(directMatch);
  }

  const aiSentence = findSentence(
    value,
    /\b(?:assistenz-ki|ki-assistent|ki|ai|kuenstliche intelligenz|künstliche intelligenz)\b/i
  );

  if (!aiSentence) {
    return null;
  }

  return (
    matchSingle(
      aiSentence,
      /^([A-ZÄÖÜ][\p{L}0-9. -]{1,40})\s+ist\s+/u
    ) ||
    matchSingle(
      aiSentence,
      /\b(?:Name|Bezeichnung|Projektname)\s*:\s*([A-ZÄÖÜ][\p{L}0-9. -]{1,40})/u
    )
  );
}

function deriveOrganizationName(value: string) {
  const organizationSentence = findSentence(
    value,
    /\b(?:organisation|auftraggeber|investoren|projektstruktur|forschungsorganisation)\b/i
  );

  if (!organizationSentence || /\[FEHLT:/i.test(organizationSentence)) {
    return null;
  }

  return matchSingle(
    organizationSentence,
    /^([A-ZÄÖÜ][\p{L}0-9. '&-]{2,80})\s+(?:will|kontrolliert|betreibt|finanziert|leitet)\b/u
  );
}

function findSentence(value: string, pattern: RegExp) {
  const normalized = value.replace(/\s+/g, " ");
  const sentences = normalized.match(/[^.!?]+[.!?]?/g) ?? [];

  return sentences.map(function (sentence) {
    return sentence.trim();
  }).find(function (sentence) {
    return pattern.test(sentence);
  }) ?? null;
}

function cleanFactName(value: string) {
  const cleaned = value
    .replace(/\s+/g, " ")
    .replace(/[,;:.]+$/g, "")
    .trim();
  const nestedInstitution = cleaned.match(
    /\b(?:im|ins|in das|in den|am|zum|zur)\s+([A-ZÄÖÜ][\p{L}0-9 .'-]+?(?:Science Center|Wissenschaftszentrum|Forschungszentrum|Institut|Institute|Labor|Lab|University|College|High School|Academy|Akademie|Zentrum|Center))$/u
  );

  return nestedInstitution?.[1]?.trim() || cleaned || null;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map(function (value) {
    return value.trim();
  }).filter(Boolean)));
}

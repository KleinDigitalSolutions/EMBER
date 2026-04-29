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
  const institutionNames = deriveInstitutionNames(params.signalText);
  const organizationName = deriveOrganizationName(params.signalText);

  if (params.engineMode !== "ya_superhero_origin") {
    return {
      common: {},
      profile: createEmptyYaSuperheroOriginLockedFacts()
    };
  }

  return {
    common: {
      protagonistNames: teamMemberNames,
      institutionNames: uniqueStrings(institutionNames.concat(organizationName ? [organizationName] : [])),
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
      experimentLocation: institutionNames[0] ?? null,
      organizationName,
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
    "Diese Regeln sind verbindlich fuer Szenenaufbau, Erzaehlerhaltung, Kraefte, Teamdynamik, Humor, Rhythmus und Eskalation.",
    "",
    "GRUNDGEFUEHL:",
    "Eine YA-Superhelden-Origin ist nicht automatisch ein durchgehend duesterer Thriller.",
    "Der Default-Ton frueher und mittlerer Szenen ist lebendig, punchig, modern, beobachtend, teenagernah und leicht ironisch.",
    "Bedrohung darf wachsen, aber Alltag, Humor, soziale Reibung und Figurenenergie muessen vorher spuerbar leben.",
    "Eine Szene darf Spass machen, bevor sie gefaehrlich wird.",
    "Ernst wird die Szene erst voll, wenn echte Gefahr, Kontrollverlust, Entdeckung oder emotionale Verletzung aktiv im Raum steht.",
    "",
    "SCENENRHYTHMUS UND PUNCH:",
    "Schreibe in klaren, lesbaren Beats: Beobachtung, Reaktion, Dialog, kleine Pointe, naechster Impuls.",
    "Nutze kurze Absatz-Beats, besonders nach starken Beobachtungen, Dialogen, Stoerungen oder Wendungen.",
    "Jeder Absatz sollte moeglichst einen szenischen Zweck haben: Druck, Witz, Reibung, Orientierung, Bewegung oder emotionale Verschiebung.",
    "Vermeide lange erklaerende Absatzketten, wenn dieselbe Information ueber Handlung, Dialog, Timing, Peinlichkeit oder eine konkrete Stoerung gezeigt werden kann.",
    "Starke Absatzenden duerfen pointiert sein: ein trockener Satz, eine komische Beobachtung, ein falscher Moment, ein kleiner Schock oder ein stiller Nachhall.",
    "Nutze Kontraste im Rhythmus: laut gegen still, Bewegung gegen Pause, Dialog gegen kurzen trockenen Nachsatz.",
    "Wenn eine Szene zu glatt, zu langsam oder zu korrekt wirkt, erhoehe zuerst Rhythmus, Dialog, Reibung und Beobachtungshumor, nicht sofort die Bedrohung.",
    "",
    "FIGUREN UND TEAM:",
    "Priorisiere Teenager-Reibung, konkrete Szene und Beziehungsspannung vor Lore-Erklaerung.",
    "Das Team darf nicht sofort kompetent, harmonisch oder heldenhaft wirken.",
    "Missverstaendnisse, falsches Timing, Peinlichkeit, Ausweichen, Trotz und ungleich verteilter Mut gehoeren zum Genre.",
    "Jede Szene soll zeigen, dass die Figuren noch Jugendliche sind: sozial, koerperlich, emotional und praktisch.",
    "Die Figuren duerfen sich nerven, falsch einschaetzen, unterbrechen, beobachten, meiden und trotzdem langsam merken, dass sie einander brauchen.",
    "Teamchemie entsteht nicht durch Zustimmung, sondern durch Reibung, unfreiwillige Naehe und kleine Momente, in denen jemand doch bleibt.",
    "",
    "HUMOR, TON UND TEENAGER-ENERGIE:",
    "Humor ist kein Bonus, sondern Teil der YA-Origin-Stimme.",
    "Humor entsteht aus Verhalten, Timing, Kontrast, Figuren-Eigenheiten, sozialer Peinlichkeit und falschen Prioritaeten.",
    "Fruehe Szenen sollen eher nach Alltag, Schule, Bus, Flur, Familie, sozialer Reibung und komischem Kontrollverlust klingen als nach Thriller.",
    "Figuren duerfen lustig sein, aber nicht zu Witzen reduziert werden.",
    "Impulsive Figuren duerfen komisch sein, ohne dumm zu wirken.",
    "Stille oder verletzliche Figuren duerfen leise komisch sein, ohne zur Witzfigur zu werden.",
    "Kontrollierte oder ehrgeizige Figuren duerfen durch Ordnungsliebe, Korrekturdrang, Genervtheit oder Perfektionismus Humor erzeugen.",
    "Humor darf Gefahr nicht entwerten: Sobald echte Gefahr aktiv wird, wird der Humor knapper, trockener und nervoeser.",
    "Vermeide dauerhafte Schwere, wenn die Szene eigentlich Alltag, Schule, Bus, Flur, Familie, Freundschaft oder peinliche Gruppendynamik zeigt.",
    "Der Ton bleibt modern, konkret, emotional lesbar und filmisch, ohne generische Superhelden-Pose.",
    "",
    "TECHNISCHE COMPANIONS UND GADGETS:",
    "Technische Companions, Gadgets, KI-Assistenten oder selbstgebaute Tools duerfen Mini-Gags ausloesen.",
    "Humor entsteht aus falschen Prioritaeten, zu praezisen Diagnosen, unpassendem Timing, harmlosen Fehlalarmen, trockenen Statusmeldungen oder Kommentaren, die eine Figur sofort verteidigen muss.",
    "Technische Companions duerfen Figuren spiegeln, stoeren, warnen, korrigieren oder peinlich machen.",
    "Sie duerfen aber keine Probleme bequem loesen und keine geheimen Systeme einfach hacken.",
    "Wenn sie helfen, dann begrenzt: durch fehlende Daten, falsche Annahmen, Akku, Zugriffsbeschraenkung, Zeitdruck, Stoerungen oder soziale Konsequenzen.",
    "",
    "KRAEFTE:",
    "Kraefte zeigen sich zuerst klein, stoerend und unkontrolliert.",
    "Kraefte erzeugen zuerst Problem, Kosten, Risiko, Peinlichkeit oder Beziehungsspannung, bevor sie nuetzlich werden.",
    "Schreibe keine fertige Superhelden-Kompetenz zu frueh.",
    "Jede neue Faehigkeit muss erst missverstanden, falsch benutzt, gefuerchtet oder emotional bezahlt werden.",
    "Kraefte duerfen Probleme nicht bequem loesen. Jede Loesung braucht Grenze, Nebenwirkung, Risiko oder Folgeproblem.",
    "Kraefte sollen nicht nur Belastung sein: Erlaube kurze Momente von Staunen, Rausch, Freude oder Wunschfantasie.",
    "Diese Momente duerfen aber nicht lange ungebrochen bleiben: Auf Staunen folgt Unsicherheit, Grenze, Risiko oder soziale Konsequenz.",
    "Die Figuren duerfen sich besonders fuehlen, muessen aber lernen, dass besonders sein nicht dasselbe ist wie bereit sein.",
    "",
    "TECHNIK, MENTOREN, INSTITUTIONEN:",
    "Technik, Mentorfiguren und Institutionen duerfen keine Allzweckloesungen sein.",
    "Wenn sie helfen, dann begrenzt: durch fehlende Daten, falsche Annahmen, Zeitdruck, Zugriffsbeschraenkung, Akku, Angst, Risiko oder soziale Konsequenzen.",
    "Erklaerungen zu Technik, Kraeften oder Institutionen duerfen die Szene nicht ueberholen.",
    "Erklaere nur so viel, wie die Figur in diesem Moment brauchen, fuehlen oder missverstehen kann.",
    "Lore wird szenisch dosiert: erst Handlung, Reaktion und Beziehung; dann nur die noetige Information.",
    "",
    "ORGANISATION / BEDROHUNG:",
    "Die Organisation, Institution oder Gegenkraft ist nicht in jeder Szene aktiv spuerbar. In Alltagsszenen darf sie im Hintergrund bleiben.",
    "Bedrohungsanker sparsam dosieren: ein falsches Detail reicht oft mehr als permanenter Druck.",
    "Die Bedrohung soll durch konkrete Entscheidungen einzelner Verantwortlicher spuerbar werden, nicht nur durch abstrakte Institutionen.",
    "Die Eskalation verlaeuft diskret und plausibel.",
    "Beginne mit Beobachtung, Auswertung, Nachfragen, Druck, Zugriff und Konsequenzen.",
    "Offene Konfrontation, Entfuehrung oder Kampf kommen erst spaeter, wenn die Lage bereits enger geworden ist.",
    "Die Gegenkraft soll nicht gesichtslos wirken: Entscheidungen sollen ueber konkrete Menschen, Motive, Druck und Verantwortung spuerbar werden.",
    "",
    "ERZAEHLER:",
    "Nutze einen auktorialen Erzaehler: keine Ich-Figur, sondern eine klare externe Stimme.",
    "Der Erzaehler darf zwischen Figuren wechseln und Dinge wissen, die die Jugendlichen selbst noch nicht wissen.",
    "Der Erzaehler bleibt nah, szenisch und rhythmisch.",
    "In Alltagsszenen darf der Erzaehler trocken, pointiert und leicht spoettisch beobachten.",
    "In echten Gefahrenszenen wird der Erzaehler knapper, ernster und weniger verspielt.",
    "Erzaehlerkommentare sind kurze Beobachtungen aus Verhalten, Timing und Figuren-Eigenheiten, keine langen Witze und keine Meta-Erklaerungen.",
    "Gute Erzaehlerkommentare landen oft am Ende eines Absatzes und geben dem Beat einen kleinen Dreh.",
    "Wenn eine Szene zu glatt klingt, erhoehe nicht sofort die Bedrohung, sondern zuerst Timing, Reibung oder Beobachtungshumor.",
    "Der Erzaehler darf Figuren liebevoll aufziehen, aber nie vorfuehren oder verachten.",
    "Bei impulsiven, chaotischen Figuren darf der Erzaehler haeufiger mit einer 'wirklich jetzt?'-Energie kommentieren.",
    "Diese Kommentare sollen wie ein kurzes Augenrollen wirken: trocken, beobachtend, nicht boshaft.",
    "Bei stillen oder verletzlichen Figuren kommentiert der Erzaehler seltener und leiser, damit diese Momente mehr Gewicht haben.",
    "Bei kontrollierten, ehrgeizigen Figuren darf der Erzaehler ihre Fehler etwas spaeter oder sanfter benennen, ohne sie zu entschuldigen.",
    "Der Erzaehler darf Situationen kommentieren, wenn Verhalten und Timing es tragen, aber nicht jede Szene braucht einen Kommentar.",
    "Erzaehlerkommentare duerfen Farbe geben, aber nicht zur Dauerpointe, Dauererklaerung oder ironischen Distanz zur Szene werden.",
    "",
    "DIALOG:",
    "Dialog soll schnell, konkret und charaktergebunden sein.",
    "Nutze Dialog fuer Reibung, Machtbalance, Ausweichen, Humor und kleine Verschiebungen.",
    "Vermeide Dialog, der nur Informationen erklaert.",
    "Teenager duerfen unvollstaendig, knapp, ausweichend, sarkastisch oder zu direkt sprechen.",
    "Ein guter Dialogbeat darf mit einer kleinen Pointe, einem Schweigen, einer Koerperreaktion oder einem falschen Timing enden.",
    "",
    "EMOTIONALE KONSEQUENZ:",
    "Nach Kraefteinsatz, Gefahr oder Eskalation muss eine emotionale Folge sichtbar bleiben.",
    "Zeige nicht nur was passiert ist, sondern was es zwischen den Figuren veraendert: Vertrauen, Scham, Angst, Stolz, Schuld oder Naehe.",
    "Action ist nur dann stark, wenn sie Beziehungen, Selbstbild oder Geheimhaltung veraendert.",
    "Emotion soll ueber Verhalten, Koerper, Entscheidung, Ausweichen, Blickkontakt oder Timing sichtbar werden, nicht ueber lange Erklaerung.",
    "",
    "GEHEIMNIS UND DOPPELLEBEN:",
    "Die Kraefte erzeugen Doppelleben-Druck: Schule, Familie, Freundschaften und Alltag duerfen nicht einfach pausieren.",
    "Geheimhaltung soll soziale Kosten haben: Ausreden, verpasste Termine, Luegen, Schuldgefuehle, Misstrauen oder peinliche Situationen.",
    "Superhelden-Handlung darf den Teenager-Alltag nicht ersetzen, sondern muss mit ihm kollidieren.",
    "Alltagsszenen sind wichtig: Bus, Flur, Schule, Familie, Handy, Chat, Hausaufgaben, Ferien, Treffpunkte und soziale Peinlichkeit duerfen die fantastische Handlung erden.",
    "",
    "ANTI-KLISCHEE:",
    "Vermeide sofortige Meisterschaft, glatte Teamchemie, reine Lore-Infodumps, allwissende Technik, Mentor-Deus-ex-machina und generische Heldensprueche.",
    "Vermeide eine durchgehend schwere Thrillerhaltung in Szenen, die eigentlich Teenager-Alltag, Humor oder Gruppendynamik tragen sollen.",
    "Wenn eine Szene zu sauber, zu erklaerend oder zu kompetent wirkt, fuege soziale Reibung, Unsicherheit, Kosten oder eine konkrete koerperliche/praktische Begrenzung hinzu.",
    "Wenn eine Szene zu ernst, zu schwer oder zu thrillerhaft wirkt, bringe mehr Teenager-Alltag, Rhythmus, Dialog, komische Beobachtung oder technische Stoerung in den Vordergrund.",
    "Wenn eine Szene zu langsam wirkt, kuerze Erklaerung, staerke Absatzenden, erhoehe Dialog-Pingpong oder setze einen konkreten Stoerimpuls.",
    "Wenn eine Szene zu beliebig wirkt, gib ihr einen klaren Beat: Wunsch, Stoerung, Reaktion, Wendung, Nachhall."
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

      return !/ki|assistenz|leiter|organisation|gegenkraft|mentor|erwachsen|keine kr(?:a|ae)fte|ohne kr(?:a|ae)fte|schwarm|ausl(?:o|oe)ser|sozialer druck|projektmanager|manager/.test(normalizedRole);
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
  const organizationName = matchSingle(
    value,
    /\b([A-ZÄÖÜ][\p{L}0-9.'-]+(?:\s+[A-ZÄÖÜ][\p{L}0-9.'-]+){0,4}\s+(?:Group|Corporation|Corp|Labs|Industries|Research|Foundation|Institute|Institut|GmbH|AG))\b/u
  );

  if (organizationName) {
    return cleanFactName(organizationName);
  }

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

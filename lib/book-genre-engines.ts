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

# EMBER Regie-Anleitung — Pipeline-kompatible Vorlage

> Zweck: Diese Datei ist die Vorlage fuer Agents, wenn sie aus Autorennotizen eine neue EMBER-Regie erstellen sollen.
> Wichtig: Nicht diese Datei direkt importieren. Erst alle Platzhalter durch projektspezifischen Inhalt ersetzen.
> Kompatibel mit: `scripts/bootstrap-book-from-regie.ts`, Master Brief, Market Brief, Writer Constitution, Scene Cards, Canon Facts, Character State Ledger, Open Threads, typed StateDiff.

---

## AGENTEN-AUFTRAG

Wenn der Nutzer sagt: "Erstelle eine Regie fuer dieses Buch", baue die neue Regie in genau dieser Markdown-Struktur.

Die Pipeline liest aktuell keine freie YAML-Datei. Sie erwartet:

- exakt benannte Top-Level-Sektionen wie `MASTER BRIEF`, `MARKET BRIEF`, `WORLD BIBLE`, `CANON FACTS (Initial — Stand: vor Kapitel 1)`, `CHARACTER STATE LEDGER`, `OPEN THREADS (Initial)` und `ACTS & KAPITEL — SCENE CARDS`
- den Master Brief und Market Brief als Markdown-Tabelle mit `Feld` und `Inhalt`
- Canon Facts und Open Threads als gueltige `json`-Codebloecke
- Character State Ledger als einzelne `### Figur`-Abschnitte mit gueltigem `json`-Codeblock
- Scene Cards unter `### ACT ...` und `#### Kapitel ...` als einfacher gefenceter Key-Value-Block

Scene-Card-Regel: Innerhalb des gefenceten Blocks nur einfache Zeilen `key: value` verwenden. Keine YAML-Listen, keine verschachtelten Objekte, keine `>`-Mehrzeiler, keine Kommentare im Block.

---

## KOMPATIBILITAETSREGELN

### Harte Felder

Diese Felder duerfen nicht fehlen, wenn sie fuer die Szene bekannt sind:

- `pov`
- `ort` oder `location`
- `uhrzeit` oder `timeAnchor`
- harte Kontinuitaetsanker nur bei echter Pflicht: `object_anchor`, `prop_anchor`, `locked_object`, `locked_material`
- Canon-Namen und Locked Facts muessen konsistent zur Regie bleiben

### Weiche Scene-Intention-Felder

Diese Felder steuern die Szene, aber sie sind keine Prosa-Befehle:

- `situation`: Was ist schon falsch, wenn die Szene beginnt?
- `want`: Was will die POV-Figur jetzt konkret?
- `pressure`: Wer oder was macht dieses Wollen schwer?
- `material`: 1-3 konkrete Dinge, Dokumente, Orte, Routinen oder soziale Verfahren
- `turn`: Was kippt in Wissen, Zugriff, Beziehung, Status, Risiko oder Selbstbild?
- `irreversible_change`: Was kann danach nicht mehr so sein wie vorher?
- `thread`: Welche offene Frage oder Laufbahn wird bewegt?
- `avoid`: Welche Fehlfassung soll die Szene vermeiden?
- `aftertaste`: Was bleibt am Ende spuerbar, ohne als These erklaert zu werden?
- `ending_type`: Rhythmus-Metadatum fuer Audits, kein Schlussatzauftrag

`proof_object`, `beweisobjekt`, `alltagswaffe`, `kindmoment` und `mila_kindmoment` sind weiche Material-/Drucksignale. Sie duerfen nicht als harte Objektpflicht missbraucht werden.

`required_material` ist Legacy. Neue Regien verwenden `locked_material` nur dann, wenn das Material echte Kontinuitaet schuetzt.

### Review-only Material

Arc, Payoff, Taeterwissen, spaetere Wahrheit und "stellt sich heraus"-Informationen gehoeren nicht in World Bible Summary und nicht in Scene Cards.

Solches Material gehoert in:

- Character State Ledger
- Open Threads
- Loss Ladder / Act Map
- Capability Map des Drucksystems
- Review-Notizen ausserhalb der Scene-Card-Codebloecke

---

## AUFBAU EINER NEUEN REGIE

1. Rohnotizen sichern und Widersprueche markieren.
2. Hook, Prämisse, Reader Promise und thematischen Kern destillieren.
3. Zentrale Druckmechanik bestimmen: Person, Institution, Beziehung, Weltregel, Krankheit, Schuld, Begehren, Magie, Politik oder sozialer Status.
4. Canon Facts nur mit unveraenderlichen Wahrheiten befuellen.
5. World Bible nur mit Gegenwartszustand, sichtbarer Funktion und aktueller Ordnung befuellen.
6. Character State Ledger mit Wunde, Verhalten unter Druck, Speech Pattern und Arc-Material befuellen.
7. Open Threads als dramaturgische Fragen mit Status und Payoff-Akt schreiben.
8. Act Map / Loss Ladder knapp schreiben: Was verliert die Hauptfigur pro Akt? Was wird unmoeglich?
9. Scene Cards schreiben: jede Szene braucht Situation, Want, Pressure, Material, Turn und irreversible Veraenderung.
10. Ending Types ueber Szenen variieren. Nicht drei oder mehr Szenen hintereinander denselben Ending-Typ verwenden.
11. Continuity Guardrails mit neuen Figurnamen, Objektfarben und kanonischen Begriffen aktualisieren.
12. Keine veralteten Provider-Annahmen einbauen: Book-Jobs laufen remote ueber OpenAI oder Anthropic; `local_fallback` ist Sicherheitsweg, kein Modellurteil.

---

# EMBER Story Document — „[ARBEITSTITEL]"

> Format: EMBER Book Blueprint v2
> Autor: [AUTOR]
> Stand: [DATUM]
> Kompatibel mit: Master Brief, Market Brief, Writer Constitution, Scene Cards, Canon Facts, Character State Ledger, Open Threads, typed StateDiff.

---

## MASTER BRIEF

| Feld | Inhalt |
|---|---|
| **Prämisse** | [Ein Satz: Hauptfigur, zentrale Stoerung, konkretes Ziel, Druck oder Verlust.] |
| **Reader Promise** | [Welche Leseerfahrung entsteht? Konkretes Gefuehl, konkrete Drucklogik, kein reines Genre-Label.] |
| **Ending Promise** | [Welche Art Einloesung wird versprochen? Keine finale Aufloesung spoilern, aber klare Negativgrenzen setzen.] |
| **Thematischer Kern** | [Was verhandelt das Buch unter der Handlung? Keine Moralpredigt.] |
| **Author Intent** | [Langfristiges Buchversprechen als weiche Prompt-Steuerung.] |
| **Current Focus** | [Naechste 1-3 Szenen: worauf soll die Pipeline besonders achten?] |
| **Arbeitstitel** | [ARBEITSTITEL] |
| **Genre** | [Genre / Subgenre / Ton] |
| **Ziel-Wortanzahl** | [z.B. 60.000-70.000 Woerter] |
| **POV-Strategie** | [z.B. nahe dritte Person auf Hauptfigur; keine Taeter-POV; keine allwissende Erklaerstimme.] |

---

## MARKET BRIEF

| Feld | Inhalt |
|---|---|
| **Amazon Goal** | [Ziel fuer Positionierung, Lesesog, Format, Standalone/Reihe.] |
| **Category Lane** | [Kategorie / Subgenre / Regalplatz.] |
| **Comp Titles** | [Vergleichstitel und klare Negativgrenzen.] |
| **Commercial Hook** | [Ein Satz, der den Kaufimpuls erklaert.] |
| **Serienpotenzial** | [Kein / mittel / hoch, mit Begruendung.] |
| **Cover-Richtung** | [Motivlogik, Stimmung, Negativgrenzen.] |

### Marktentscheidung

- [Regel 1 fuer Lesesog, Einstieg oder Positionierung.]
- [Regel 2 fuer Genreversprechen.]
- [Regel 3 fuer Negativgrenze.]

---

## WRITER CONSTITUTION

- [Stilregel 1: konkrete Handlung vor abstrakter Erklaerung.]
- [Stilregel 2: POV, Ton und Distanz.]
- [Stilregel 3: Dialog verschiebt Zugriff, Vertrauen, Status, Naehe oder Risiko.]
- [Stilregel 4: Gegenkraft bleibt plausibel und zahlt Kosten.]
- [Stilregel 5: Jede Szene veraendert Wissen, Zugriff, Loyalitaet, Status, Risiko, Beweislage, Naehe oder Selbstbild.]
- [Stilregel 6: Keine Aufloesungsleaks, keine allwissende Erklaerstimme.]
- [Stilregel 7: Wortbereiche sind bevorzugte Rahmen, keine harte Zielerfuellung.]

---

## WORLD BIBLE

World Bible enthaelt nur Gegenwartszustand, sichtbare Funktion, soziale Ordnung, Orte, Institutionen, Objekte und Weltregeln. Keine spaetere Wahrheit, keine geheimen Motivationen, keine Finale-Erklaerung.

### Setting

- **Ort:** [Ort, Zeit, gesellschaftlicher Rahmen.]
- **Hauptschauplaetze:** [3-7 zentrale Orte.]
- **Atmosphaere:** [Konkrete Oberflaeche: Licht, Material, Routinen, Gerueche, Verwaltung, Koerper, Gegenstaende.]

### Zentrales Drucksystem

- **Name / Funktion:** [Person, Institution, Familie, Vertrag, Hof, Magie, Krankheit, Beziehung, politisches System.]
- **Wie wirkt der Druck aktuell sichtbar?** [Gegenwartszustand.]
- **Welche Zugriffe sind plausibel?** [Nur sichtbare oder herleitbare Machtmittel.]
- **Welche Grenzen hat das Drucksystem?** [Keine Allmacht.]

### Wiederkehrende Objekte und Routinen

- **[Objekt/Routine 1]:** [Aktuelle Funktion, Farbe falls relevant, Besitzer, Ort.]
- **[Objekt/Routine 2]:** [Aktuelle Funktion.]
- **[Objekt/Routine 3]:** [Aktuelle Funktion.]

---

## CANON FACTS (Initial — Stand: vor Kapitel 1)

```json
{
  "canon_facts": [
    {
      "id": "CF001",
      "fact": "[Unveraenderliche Wahrheit ueber Hauptfigur, Ausgangslage oder Weltregel.]",
      "status": "aktiv"
    },
    {
      "id": "CF002",
      "fact": "[Unveraenderliche Wahrheit ueber zentrale Beziehung, Institution, Objekt oder Konflikt.]",
      "status": "aktiv"
    },
    {
      "id": "CF003",
      "fact": "[Unveraenderliche Negativgrenze: Was ist nicht die Loesung oder nicht die Weltregel?]",
      "status": "aktiv"
    }
  ]
}
```

---

## CHARACTER STATE LEDGER

### [HAUPTFIGUR NAME] — „[Funktion]"
```json
{
  "character_id": "PROTAGONIST",
  "name": "[HAUPTFIGUR NAME]",
  "role": "[Soziale Rolle und Funktion im Buch]",
  "background": "[Gegenwartsnahe Vorgeschichte, nur so viel wie fuer aktuelles Verhalten noetig.]",
  "wunde": {
    "was_passiert_ist": "[Praegendes Ereignis oder Mangel.]",
    "was_es_heute_macht": "[Wie formt es aktuelles Handeln unter Druck?]",
    "was_er_niemals_tut": "[Klare Grenze der Figur.]",
    "arc_abschluss": "[Welche Bewegung muss die Figur bis zum Ende schaffen? Keine konkrete Finale-Mechanik spoilern.]"
  },
  "initial_state": {
    "physisch": "[Koerperlicher Ausgangszustand.]",
    "psychisch": "[Psychischer Ausgangszustand.]",
    "verhaeltnis_zum_konflikt": "[Wie liest die Figur die Stoerung am Anfang?]",
    "verhaeltnis_zur_gegenkraft": "[Aktueller Stand.]"
  },
  "speech_pattern": "[Satzlaenge, Direktheit, Ausweichmuster, Fachsprache, Humor, Hoeflichkeit, Haerte.]",
  "arc": [
    {
      "phase": "Act 1",
      "state": "[Irrtum, Schutzstrategie oder falsche Sicherheit am Anfang.]"
    },
    {
      "phase": "Act 2",
      "state": "[Was erkennt oder verliert die Figur?]"
    },
    {
      "phase": "Act 3",
      "state": "[Was muss sie aktiv zurueckerobern, opfern oder entscheiden?]"
    }
  ]
}
```

### [GEGENKRAFT NAME] — „[Funktion]"
```json
{
  "character_id": "PRESSURE",
  "name": "[GEGENKRAFT NAME]",
  "role": "[Person, Institution, System, Beziehung oder innere Logik mit aeusserer Wirkung]",
  "background": "[Warum ist diese Gegenkraft plausibel in der Welt der Hauptfigur?]",
  "wunde": {
    "was_passiert_ist": "[Mangel, Verlust, Fehlannahme oder alte Kraenkung.]",
    "was_es_heute_macht": "[Wie wird daraus aktueller Druck?]",
    "was_er_niemals_tut": "[Grenze: Was kann oder tut diese Gegenkraft nicht?]",
    "arc_abschluss": "[Welche Funktion hat die Gegenkraft bis zum Ende?]"
  },
  "initial_state": {
    "sichtbar": "[Wie wirkt die Gegenkraft fuer andere?]",
    "verdeckt": "[Welche Logik treibt sie, ohne Finalewissen zu verraten?]",
    "zugriff": "[Welche plausiblen Zugriffe existieren bereits?]"
  },
  "speech_pattern": "[Wie spricht diese Kraft/Figur unter Druck?]",
  "funktion_im_buch": "[Welche Gegenlogik bildet sie zur Hauptfigur?]",
  "kern": "[Was will sie erhalten, erzwingen, beweisen, schuetzen oder verhindern?]",
  "was_unklar_bleibt": "[Welche Frage darf spaeter erst schaerfer werden?]"
}
```

### [SCHLUESSELFIGUR NAME] — „[Funktion]"
```json
{
  "character_id": "KEY_RELATION",
  "name": "[SCHLUESSELFIGUR NAME]",
  "role": "[Beziehung zur Hauptfigur und dramaturgische Funktion]",
  "background": "[Warum hat diese Figur eigene Logik und eigene Kosten?]",
  "wunde": {
    "was_passiert_ist": "[Praegung oder Konflikt.]",
    "was_es_heute_macht": "[Wie handelt sie deshalb jetzt?]",
    "was_er_niemals_tut": "[Grenze.]",
    "arc_abschluss": "[Welche Entscheidung oder Verschiebung wird spaeter sichtbar?]"
  },
  "initial_state": {
    "loyalitaet": "[Woran orientiert sich die Figur?]",
    "druckverhalten": "[Wie reagiert sie unter Druck?]"
  },
  "speech_pattern": "[Stimme, Direktheit, Ausweichen, Laenge.]"
}
```

---

## CONTINUITY GUARDRAILS (Arbeitsstand Entwurf)

### Namens- und Funktionsschutz

- [Vorname Nachname] bleibt immer [volle Funktion / Beziehung].
- [Vorname Nachname] darf nicht in [falsche Funktion] umcodiert werden.
- Wenn ein Vorname im Draft auftaucht, muss der Nachname und die Funktion zur Regie passen.

### Objektfarben und harte Objektanker

- [Farbe Objekt von Figur] bleibt [Farbe] und gehoert zu [Figur/Ort].
- [Objekt] darf nur dann den Besitzer, Zustand oder Ort wechseln, wenn die Szene das sichtbar veraendert.

### Produktionsregeln

- Keine Aufloesungsleaks in World Bible oder Scene Card.
- Keine Gegenkraft ohne plausible Wissensquelle.
- Keine Szene darf nur wiederholen, dass die Lage schlimm ist.
- Nach hoechstens zwei Informations- oder Beweisszenen braucht es eine reale Folge fuer Zugriff, Loyalitaet, Status, Beziehung, Routine oder Risiko.

---

## OPEN THREADS (Initial)

```json
{
  "open_threads": [
    {
      "id": "OT001",
      "thread": "[Zentrale dramaturgische Frage in einem Satz.]",
      "status": "offen",
      "payoff_act": "Act 3"
    },
    {
      "id": "OT002",
      "thread": "[Beziehungs-, Objekt-, Weltregel- oder Verdachtsfrage.]",
      "status": "offen",
      "payoff_act": "Act 2"
    },
    {
      "id": "OT003",
      "thread": "[Weitere Frage, die wiederkehren und eskalieren soll.]",
      "status": "offen",
      "payoff_act": "Act 3"
    }
  ]
}
```

---

## LOSS LADDER / ACT MAP

### Act 1 — [Titel]

- **Startglaube:** [Was glaubt die Hauptfigur noch?]
- **Erster Verlust:** [Zugriff, Status, Beziehung, Sicherheit, Wissen, Ort, Koerper, Objekt.]
- **Neue Lesart:** [Was muss am Ende von Act 1 anders lesbar sein?]
- **Was unbewiesen bleibt:** [Welche Frage bleibt offen?]

### Act 2 — [Titel]

- **Vertiefung:** [Wie wird der Druck systemischer, naeher oder teurer?]
- **Kosten:** [Was verliert die Hauptfigur wiederholt, aber variiert?]
- **Falsche Sicherheit:** [Welche Loesung scheint moeglich, traegt aber nicht?]
- **Act-2-Kippmoment:** [Welche irreversible Verschiebung oeffnet Act 3?]

### Act 3 — [Titel]

- **Rueckeroberung:** [Was muss aktiv gewonnen, bewiesen, bezahlt oder losgelassen werden?]
- **Negativgrenzen:** [Kein Wunderfund, kein Geständnis als Abkuerzung, keine ungesetzte Loesung.]
- **Einloesung:** [Welche Reader-Promise-Linie wird emotional und logisch bezahlt?]

---

## ACTS & KAPITEL — SCENE CARDS

Pipeline-Hinweis: Scene Cards werden maschinell gelesen. Halte die Werte kurz, konkret und einzeilig. Wenn ein Wert laenger sein muss, schreibe trotzdem eine einzige Zeile.

### ACT 1 — „[Act-Titel]"

#### Kapitel 1: „[Kapitel-Titel]"

```
Scene Card
id: SC_1_1
title: [Kapitel-Titel]
pov: [Vorname Nachname]
ort: [Konkreter Ort]
uhrzeit: [Zeitanker, z.B. Montagmorgen oder drei Stunden nach SC_1_0]
objective: [Konkretes Szenenziel in einem Satz]
situation: [Was ist schon falsch, wenn die Szene beginnt?]
want: [Was will die POV-Figur jetzt konkret tun?]
pressure: [Wer oder was macht das Wollen schwer?]
material: [1-3 konkrete Dinge, Dokumente, Routinen oder Koerperdetails]
turn: [Was kippt in Wissen, Zugriff, Beziehung, Status, Risiko oder Selbstbild?]
irreversible_change: [Was kann nach dieser Szene nicht mehr so sein wie vorher?]
thread: [OT001 oder kurze offene Frage]
avoid: [Fehlfassung vermeiden, z.B. nicht erklaeren, sondern ueber Objekt/Dialog/Handlung zeigen]
aftertaste: [Schlusswirkung ohne Satzdiktat]
ending_type: [access_loss | relationship_shift | proof_turn | deadline_shift | moral_reframe | social_exposure | quiet_countermove | choice_cost]
word_target_min: 1000
word_target_max: 1500
```

Review-only Notiz fuer Menschen: [Setup, Payoff, spaetere Wahrheit oder Regiehinweis hier schreiben, aber nicht in den Codeblock.]

#### Kapitel 2: „[Kapitel-Titel]"

```
Scene Card
id: SC_1_2
title: [Kapitel-Titel]
pov: [Vorname Nachname]
ort: [Konkreter Ort]
uhrzeit: [Zeitanker]
objective: [Konkretes Szenenziel]
situation: [Konkreter Ausgangsdruck]
want: [Spielbares Ziel]
pressure: [Konkretes Hindernis]
material: [1-3 konkrete Materialien]
turn: [Konkrete Verschiebung]
irreversible_change: [Direkte Folge]
thread: [OT001/OT002]
avoid: [Fehlfassung]
aftertaste: [Schlusswirkung]
ending_type: [anderer Typ als Kapitel 1, wenn moeglich]
word_target_min: 1000
word_target_max: 1500
```

### ACT 2 — „[Act-Titel]"

#### Kapitel 3: „[Kapitel-Titel]"

```
Scene Card
id: SC_2_1
title: [Kapitel-Titel]
pov: [Vorname Nachname]
ort: [Konkreter Ort]
uhrzeit: [Zeitanker]
objective: [Konkretes Szenenziel]
situation: [Was ist bereits instabil?]
want: [Konkretes Ziel]
pressure: [Hindernis oder Gegenkraft mit plausibler Quelle]
material: [1-3 konkrete Materialien]
turn: [Verschiebung]
irreversible_change: [Neue Kosten oder verlorener Zugriff]
thread: [OT002/OT003]
avoid: [Fehlfassung]
aftertaste: [Schlusswirkung]
ending_type: [variiert]
word_target_min: 1000
word_target_max: 1500
```

### ACT 3 — „[Act-Titel]"

#### Kapitel 4: „[Kapitel-Titel]"

```
Scene Card
id: SC_3_1
title: [Kapitel-Titel]
pov: [Vorname Nachname]
ort: [Konkreter Ort]
uhrzeit: [Zeitanker]
objective: [Konkretes Szenenziel]
situation: [Ausgangsdruck]
want: [Aktive Entscheidung oder Handlung]
pressure: [Letztes Hindernis mit gesetzten Kosten]
material: [Vorher gesetztes Material, nicht Wunderfund]
turn: [Was kippt endgueltig?]
irreversible_change: [Welche alte Ordnung endet?]
thread: [OT001/OT003]
avoid: [Keine Triumphprosa, keine ungedeckte Aufloesung]
aftertaste: [Emotionale Einloesung ohne These]
ending_type: [Einloesungstyp, nicht monoton]
word_target_min: 1000
word_target_max: 1600
```

---

## WRITER-SUMMARIES — KAPITEL 1 BIS [N]

Diese Sektion ist Human-/Review-Hilfe. Sie ersetzt keine Scene Cards.

### Kapitel 1 — „[Kapitel-Titel]"

**Writer Summary**

[3-6 Saetze: Was passiert kausal, was kostet es, welche Folge oeffnet die naechste Szene?]

**Director Note**

[Optional: Ton, Tempo, besondere Fehlspur. Keine langen Ersatz-Scene-Cards.]

### Kapitel 2 — „[Kapitel-Titel]"

**Writer Summary**

[3-6 Saetze.]

**Director Note**

[Optional.]

---

## OPERATIVE HINWEISE FUER EMBER

- Vor jedem Draft die passende Scene Card pruefen.
- Harte Fakten in Canon, Locked Facts oder harten Objektankern halten.
- Weiche Dramaturgie in `situation`, `want`, `pressure`, `material`, `turn`, `irreversible_change`, `avoid` und `aftertaste` halten.
- Review-only Wissen ausserhalb der Codebloecke halten.
- Wenn eine Szene nur mit langer Director Note funktioniert, fehlt meistens etwas in der Scene Card.
- StateDiff nach Drafts konservativ behandeln: `sceneLocalDetails` bleiben lokal; `proposedCanonFacts` werden erst nach ausdruecklicher Approval Canon.

### Minimaler Director-Note-Block

```text
Fokus: [konkreter Lauf-Fokus fuer diese Szene]
Nicht tun: [Fehlfassung]
Material: [1-3 Dinge, falls im Draft zu schwach]
Ende: [Wirkung, kein Satzdiktat]
```

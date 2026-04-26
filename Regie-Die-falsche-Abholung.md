# EMBER Story Document — „Die falsche Abholung"
> Format: EMBER Book Blueprint v2 | Stand: 2026-04-22
> Autor: Özgür Azap
> Kompatibel mit: Master Brief, Market Brief, Writer Constitution, Scene Cards, Canon Facts, Character State Ledger, Open Threads
> Hinweis: Diese Regie ist auf Regie-zu-Blueprint Sync ausgelegt. Namen und Orte können später geändert werden, die Funktionslogik der Figuren aber nicht.

---

## AGENT ONBOARDING — Lies das zuerst

> Diese Sektion ist für neue Agents und alle, die neu ins Projekt einsteigen. Sie erklärt, wie diese Datei mit der aktuellen EMBER-Pipeline zusammenarbeitet. Ohne diese Sektion ist die Datei nur Dramaturgie; mit ihr wird sie zu einer belastbaren Produktionsgrundlage.

### Was diese Datei ist

Diese Regie-Datei ist gleichzeitig:
- **Narratives Steuerwerk**: Prämisse, Stil, Charaktere, Dramaturgie, Beweislogik
- **Produktionsgrundlage**: Scene Cards, Canon und Charakterzustände definieren, was eine gute Szene materiell und dramaturgisch tragen muss
- **Agenten-Referenz**: Diese Datei ist das Paradebeispiel dafür, wie EMBER-Regie aussehen soll, wenn daraus gute Szenen entstehen sollen

EMBER liest Teile dieser Datei maschinell. Der Rest bleibt menschlich lesbar und dient als Stilanker, Kontinuitätsreferenz und Dramaturgie-Regie. Die aktuelle Pipeline ist bewusst schlanker als frühere Versuche: kein aktiver Beat-Plan im Schreiblauf, kein automatischer Rewrite-Pass, keine mikrogesteuerte Satzregie. Gute Szenen entstehen deshalb nicht mehr aus eng geführter Prompt-Polizei, sondern aus sauberem Material, präziser Szenenfunktion und klaren Alltagsankern.

### Was die aktuelle Pipeline wirklich mitnimmt

Die aktuelle Standardpipeline arbeitet in dieser Reihenfolge:
- Sie baut aus Story, Scene Card, Canon, Character Ledger und Open Threads einen schlanken Szenenkontext.
- Sie generiert einen direkten Prosa-Draft ohne separaten Beat-Plan-Call und ohne Rewrite-Pass.
- Danach folgen nur noch technische und qualitative Nachläufe: Length-Control, State-Extraction, Continuity-Audit, Quality-Eval.

Wichtig daraus:
- Eine Scene Card ist heute **keine Satz-für-Satz-Komposition**, sondern eine **klare Szenenfunktion mit harten Faktenankern**.
- Felder wie `opening`, `dramaticBeat`, `ending` oder `closingLine` sind **Orientierung**, nicht Formulierungsdiktat.
- Gute Regie beschreibt deshalb nicht die perfekte spätere Prosa, sondern die **richtige Situation, das richtige Beweisobjekt, den richtigen sozialen Druck und den richtigen Verlust**.

### Welche Scene-Card-Felder hart, weich oder rein menschlich sind

| Feld | Pipeline-Funktion | Konsequenz bei Fehlen/Fehler |
|---|---|---|
| `pov` | Harte Laufzeit-Constraint. | Ohne POV-Lock droht Perspektivdrift. |
| `ort` / `location` | Harte Laufzeit-Constraint. | Ohne klaren Ort wird die Szene räumlich weich. |
| `uhrzeit` / `timeAnchor` | Harte Laufzeit-Constraint. | Fehlt sie, verliert der Ablauf Präzision. |
| `proof_object` | Harter Materialanker plus Continuity-Guard. | Fehlt oder driftet, verliert die Szene ihren überprüfbaren Kern. |
| `alltagswaffe`, `kindmoment`, `object_anchor`, `prop_anchor` | Harte Material-/Kindheitsanker. | Fehlen sie, wird Alltagsdruck zu abstrakt oder symbolisch. |
| `word_target_min` / `word_target_max` | Wortzielsteuerung. | Fehlen sie, greift der Pipeline-Default. |
| `coreAction` | Harte Handlungsorientierung. | Fehlt sie, fehlt der Handlungskern. |
| `objective`, `reversal`, `dramaticBeat`, `opening`, `ending`, `closingLine` | Weiche Szenenführung. Dienen dem Verständnis der Szene, nicht dem Diktat einzelner Sätze. | Fehlen sie, wird die Szene oft ungenauer oder flacher, aber nicht automatisch unbrauchbar. |
| `bad_version_risk`, `revision_focus`, `scene_promise`, `pressure_clock` usw. | Menschliche Produktionshilfe. | Hilft Agents, den Sinn der Szene zu verstehen und typische Fehlfassungen zu vermeiden. |

**Fusionskapitel-Regel (Kapitel 17, 23, 27):** Diese Kapitel brauchen zwingend `word_target_min: 1700` und `word_target_max: 1950` in der Scene Card. Fehlen diese Felder, greift der Pipeline-Default und die Fusionskapitel werden zu kurz.

### Sections-Übersicht: Was wozu dient

| Sektion | Zweck | Pipeline-relevant? |
|---|---|---|
| MASTER BRIEF | Prämisse, Genre, POV-Strategie | Nein — menschlicher Kontext |
| MARKET BRIEF | Vermarktungsziele, Comp Titles | Nein — menschlicher Kontext |
| WRITER CONSTITUTION | Stilregeln Positiv/Negativ | Nein — Stilanker für Reviews |
| WORLD BIBLE | Setting, Soziale Lage, Noras Zugriffslogik | Nein — Stilanker und Continuity-Referenz |
| CANON FACTS | Unveränderliche Buchwahrheiten mit IDs | Indirekt — Continuity-Basis |
| CHARACTER STATE LEDGER | Wunde, Arc, Speech Pattern pro Figur | Nein — Stilanker |
| VOICE PACK | Satzebene-Führung pro Figur mit Positiv/Verboten-Mustern | Nein — Stilanker |
| PROSA BENCHMARK | Konkrete Prosabeispiele als Stilanker | Nein — Stilanker |
| CONTINUITY GUARDRAILS | Namensschutz, Produktionsregeln | **Ja** — treibt `auditSceneContinuityGuards` live |
| NORA CAPABILITY MAP | Plausibilitätsgrenzen für Noras Zugriff | Nein — menschlich |
| NORA COST LEDGER | Nora-Erfolge mit Restfehlern und Payoffs pro Kapitel | Nein — Dramaturgie-Referenz |
| OPEN THREADS | Dramaturgische Fragebögen mit Payoff-Acts | Nein — menschlich |
| PROOF LADDER | Act-Struktur, Evidenz-Progression, interne Zeitachse | Nein — Dramaturgie-Referenz |
| ACTS & KAPITEL — SCENE CARDS | Szenenebene-Konfiguration pro Kapitel | **Ja** — zentrale Produktions- und Laufzeitgrundlage |
| WRITER-SUMMARIES | Verdichtete Handlungs-Summaries + Director Notes | Nein — Human-Writer-Starthilfe |
| OPERATIVE HINWEISE FUER EMBER | Checkliste + Copy-Paste-Blöcke für die Writer-UI | Ja — operative Hilfe, aber kein Ersatz für gute Scene Cards |

### Wie CONTINUITY GUARDRAILS die Pipeline beeinflusst

Die Sektion `CONTINUITY GUARDRAILS` treibt den Guard `auditSceneContinuityGuards` direkt. Dieser Guard läuft nach jeder Draft-Generierung und prüft:
- **Namensdrift**: Erscheinen die Kernfiguren unter falschen Namen?
- **Farbdrift**: Werden Farbanker (z.B. gelber Becher) falsch verwendet?
- **Proof-Object-Guard**: Ist das `proof_object` der Scene Card im Draft sichtbar?

Diese Guards sind heute in erster Linie **Qualitäts- und Kontinuitätssignale**. Sie sollen Probleme sichtbar machen, nicht Prosa ersetzen. Wenn die CONTINUITY GUARDRAILS veraltete Figuren oder falsche Namen enthalten, produzieren sie systematisch falsche Warnungen. Diese Sektion muss bei jedem neuen Buch vollständig ersetzt werden.

### Wie gute Scene Cards im schlanken System aussehen

Im aktuellen System gilt:
- Schreibe keine Scene Card, die schon wie die fertige Szene klingt.
- Schreibe eine Scene Card so, dass ein guter Agent sofort versteht:
  - Was will die Figur in dieser Szene?
  - Wodurch wird das konkret, überprüfbar und alltagsnah?
  - Was kippt sozial, institutionell oder emotional?
  - Was kostet die Szene Eva real?
  - Welches Objekt oder welcher Routinedetaildruck macht die Szene unverwechselbar?

Eine starke Scene Card liefert:
- **klare Handlung**
- **klare Verlust- oder Beweisbewegung**
- **konkrete Alltagsobjekte**
- **plausiblen sozialen Druck**
- **genug Freiheit für lebendige Prosa**

Eine schwache Scene Card liefert:
- nur Stimmung
- nur Erklärpsychologie
- nur „spannende" Behauptungen ohne Objekt
- einen perfekten Schlusssatz, statt eine belastbare Situation
- zu viel Mikroregie auf Satzebene

### Template-Anleitung für ein neues Buch

Kopiere diese Datei und gehe in dieser Reihenfolge vor:

1. **MASTER BRIEF + MARKET BRIEF** vollständig ersetzen.
2. **WORLD BIBLE** neu schreiben: Setting, soziale Konstellation, Bedrohungslogik des neuen Antagonisten.
3. **CHARACTER STATE LEDGER + VOICE PACK + PROSA BENCHMARK** für neue Figuren neu schreiben.
4. **CANON FACTS** mit den unveränderlichen Wahrheiten des neuen Buchs befüllen.
5. **OPEN THREADS** mit den zentralen dramaturgischen Fragebögen neu schreiben.
6. **CONTINUITY GUARDRAILS** mit den neuen Figurnamen und Schutzregeln ersetzen — diese treiben die Guards direkt.
7. **NORA CAPABILITY MAP / COST LEDGER** durch eine äquivalente Antagonisten-Map ersetzen.
8. **PROOF LADDER** neu strukturieren: Was weiß wer in welchem Act?
9. **SCENE CARDS** neu schreiben. Zwingend sauber sein müssen: `id`, `pov`, `ort/location`, `uhrzeit/timeAnchor`, `coreAction`, `proof_object`. Für Fusionskapitel zusätzlich: `word_target_min`, `word_target_max`.
10. **Scene Cards entgiften**: `opening`, `dramaticBeat`, `ending`, `closingLine` nicht als Formulierungszwang schreiben, sondern als szenische Orientierung.
11. **OPERATIVE HINWEISE FUER EMBER** zuletzt anpassen. Die Director Note darf die Regie ergänzen, aber niemals schlechte Scene Cards reparieren sollen.

### Häufige Fehlerquellen für neue Agents

- **`proof_object` zu abstrakt**: Wenn der Wert ein Konzept statt eines konkreten Dings/Namens/Dokuments ist (z.B. „Vertrauen" statt „Namensetiketten und alter Freigabelink"), kann der Guard nicht matchen. Immer konkrete, suchbare Begriffe verwenden.
- **`word_target_min`/`word_target_max` vergessen**: Ohne diese Felder in der Scene Card greift der Pipeline-Default. Fusionskapitel werden dann zu kurz.
- **CONTINUITY GUARDRAILS nicht aktualisiert**: Diese Sektion enthält sonst alte Figurnamen und produziert falsche Warnungen.
- **Scene Cards nicht als Fenced-Code-Block**: Die Pipeline parsed Scene Cards als Key-Value-Blöcke innerhalb von ` ``` `…` ``` `. Einrückung (2 Spaces) und `: ` als Trennzeichen müssen konsistent sein.
- **Director Note vs. Scene Card verwechseln**: Die `directorNote` in der Writer-UI ist nur Zusatzsteuerung für einen Lauf. Die Scene Card bleibt die eigentliche Produktionsgrundlage.
- **zu schöne Scene Cards schreiben**: Wenn eine Karte bereits wie perfekte Prosa klingt, wird sie als Regie oft schlechter, nicht besser. Agents brauchen präzise Situation, nicht vorgefertigte Literatur.
- **fehlender Alltagsdruck**: Ohne reale Routinen, Gegenstände, Listen, Kleidung, Kinderlogik oder institutionelle Kleinmechanik verliert das System genau das Material, aus dem gute Szenen entstehen.

---

## MASTER BRIEF

| Feld | Inhalt |
|---|---|
| **Prämisse** | Eine getrennt lebende Mutter sieht in der Kita-App den Vermerk, sie habe ihre Tochter bereits gestern abgeholt. Die Videoaufnahme, eine Unterschrift und mehrere alltägliche Routinen sprechen gegen ihre Erinnerung. Je genauer sie prüft, desto klarer wird, dass niemand einfach ihr Kind entführen will, sondern ihre Zurechnungsfähigkeit, ihre Glaubwürdigkeit und am Ende ihre Rolle als Mutter ersetzt. |
| **Reader Promise** | Ein psychologischer Thriller mit domestic-suspense-Zug: Kita, App, Ex-Partner, Nachbarschaft, Notfallkontakte und die banalen Wege eines Elternalltags werden zur Waffe. Der Leser soll sich permanent fragen, ob hier ein dokumentierter Identitätsangriff, eine sorgfältig gebaute Rufzerstörung oder eine persönliche Übernahme läuft. |
| **Ending Promise** | Kein Wahn-Twist, keine gespaltene Persönlichkeit, kein billiger Technikzauber. Die Wahrheit ist real, geplant und menschlich nah. Die Bedrohung kommt nicht von einem fremden Monster, sondern von einer Frau, die zu nah in den Alltag hineingelassen wurde und aus Fürsorge Besitz gemacht hat. |
| **Thematischer Kern** | Elternschaft ist nicht nur Liebe, sondern auch Deutungshoheit. Wer einer Mutter ihre Erinnerung, ihre Zuverlässigkeit und ihre Alltagsbeweise nimmt, greift nicht ein Kind an, sondern die Person, die dieses Kind vor der Welt vertreten darf. |
| **Arbeitstitel** | Die falsche Abholung |
| **Genre** | Psychological Thriller / Domestic Suspense |
| **Ziel-Wortanzahl** | 60.000-68.000 Wörter |
| **POV-Strategie** | Nahe, kontrollierte dritte Person auf Eva. Kein Täter-POV. Keine Mila-Kapitel. Keine Rückblicke aus Noras Perspektive. |

---

## MARKET BRIEF

| Feld | Inhalt |
|---|---|
| **Amazon Goal** | Standalone-Debüt mit hoher Kindle- und Paperback-Tauglichkeit, klarer Hook in einem Satz, starker Serienmöglichkeit für spätere Mutter/Alltagsspannungsstoffe |
| **Category Lane** | Psychological Thriller > Domestic Suspense > Crime Thriller |
| **Comp Titles** | Freida McFadden für Zug und kurze Kapitel, Claire Douglas für Alltagsbedrohung, Lisa Jewell für Nahbereichs-Paranoia, Sebastian Fitzek als Negativgrenze: Tempo ja, aber ohne billige Überkonstruktion |
| **Commercial Hook** | Was, wenn die Kita dir bestätigt, du hättest dein Kind gestern abgeholt und die Videoaufnahme tatsächlich dich zeigt, obwohl du sicher weißt, nie dort gewesen zu sein? |
| **Serienpotenzial** | Mittel. Das Buch muss als Einzelband vollständig funktionieren, kann aber bei Erfolg eine lose Reihe von Alltagsbedrohungs-Thrillern rund um Verfahrenslogik, Familie und Wahrnehmung eröffnen. |
| **Cover-Richtung** | Kein Blut. Kein Messer. Kein schreiendes Kind. Stattdessen Glas der Kita-Tür, reflektierte Mutterfigur, Kinderzeichnung, Abholschild, neutraler Flur, leicht entstellte Spiegelung. |

### Marktentscheidung für das Debüt
- Kapitel 1 muss den Hook sofort real und konkret machen.
- Die Bedrohung muss in jedem Werbetext in einem Satz erklärbar sein.
- Kein Ermittlerroman. Kein Polizeiverfahrensbuch. Der Sog kommt aus Alltagsbeweisen, nicht aus Spurensicherungshandwerk.
- Das Kind ist emotionaler Kern, aber nie sentimentales Plotwerkzeug.
- Die Auflösung muss rückwirkend alle kleinen Alltagsdetails erklären können.
- Die Spannung liegt früh nicht primär im Täterrätsel, sondern im Beweis- und Machtkampf um Glaubwürdigkeit.
- Für das Debüt zählt nicht nur Plotqualität, sondern Lesesog pro Kapitel. Der Mittelteil wird auf Wiederholungsresistenz und Weglegerisiko hin gebaut.

### Best-Practice-Umsetzung für Commercial Suspense
- Einstieg so nah wie möglich am ersten realen Angriff. Keine zwei bis drei Einleitungskapitel vor dem eigentlichen Thriller-Motor.
- Backstory nur unter Bewegung. Vergangenheit wird in kleinen, späten Einsprengseln gegeben, nie als Bremsblock vor dem Konflikt.
- Der Roman denkt in Kausalketten, nicht in Ereignisreihen: nicht `und dann`, sondern `deshalb` oder `aber`.
- Jede Szene braucht ein lesbares Mini-Getriebe: Ziel, Motivation, Entscheidung, Aktion, Hindernis.
- Im Mittelteil gilt Folgenpflicht: Neue Evidenz ist nur dann stark, wenn sie Zugriff, Vertrauen, Routine oder Status real verschiebt.
- Commercial-Pacing bedeutet nicht Lärm, sondern Weglassen: Alles, was nur bestätigt, wird gekürzt, fusioniert oder gestrichen.
- Kurze Kapitel helfen nur dann, wenn ihre Funktion unterscheidbar ist. Kapitelduplikate schaden mehr als längere, schärfere Kapitel.

---

## WRITER CONSTITUTION

### Stilregeln (Positiv)
- Nahe dritte Person auf Eva. Keine allwissende Erklärstimme.
- Kurze bis mittlere Kapitel: Normalbereich 1.000-1.500 Wörter, einzelne Schlüsselszenen bis etwa 1.700 Wörter; Kapitel 17, 23 und 27 dürfen als Fusionskapitel bei Bedarf 1.700-1.950 Wörter erreichen.
- Jedes Kapitel endet mit einer konkreten offenen Konsequenz, nicht bloss mit Unruhe.
- Im Mittelteil darf Evidenz nie Selbstzweck werden. Spätestens nach zwei Indizkapiteln muss ein Kapitel zeigen, was Eva konkret verliert, was Mila übernimmt oder wie Institutionen und Beziehungen sich neu gegen Eva ordnen.
- Bedrohung entsteht aus normalen Dingen: App, Klingeln, Wechselkleidung, Trinkflasche, Vollmacht, Unterschrift, Nachricht, Stimme, Blick einer Erzieherin.
- Exposition darf nur unter Druck vorkommen.
- Dialoge müssen Vertrauen verschieben, Zweifel sähen oder Zugriff auf Mila verändern.
- Jede Szene muss mindestens eines verändern: Beweislage, Glaubwürdigkeit, Zugriff aufs Kind, Alltagsroutine oder Loyalität.
- Hinweise werden klein, materiell und rückprüfbar gesetzt.
- Die Prosa bleibt klar, lesbar, zugespitzt, nicht literarisch versunken.
- Emotion wird über Handlung, Körper, Sprache und Fehlentscheidungen sichtbar, nicht erklärt.
- Der Leser soll jede Szene unmittelbar auf Mila, Eva oder Zugriffslinien beziehen können.
- Aussenfiguren bleiben glaubhaft. Niemand ist nur Plotmaschine.
- Simon darf nicht nur skeptisch spiegeln. Seine Schutzentscheidungen müssen Eva real etwas kosten.
- Nora gewinnt über Plausibilität, Restzugriff und Geduld, nicht über Omnipotenz. Jeder grössere Erfolg hinterlässt kleinen Verschleiss, Restfehler oder einen enger werdenden Handlungskorridor.

### Stilregeln (Negativ — verboten)
- Kein Täter-POV.
- Kein Wahn- oder Psychose-Twist.
- Keine plötzliche Hightech-Verschwörung, die den Alltagsstoff entwertet.
- Keine inkompetente Kita als billiger Plotmotor.
- Kein Ex-Mann als Standardböswicht, wenn die Regie etwas Komplexeres will.
- Keine Erklärungsmonologe über Trauma statt Handlung.
- Keine Rückblenden, die nur Informationen nachreichen, die man spannender in der Gegenwart zeigen kann.
- Keine sentimental ausgeschlachteten Kind-Szenen.
- Keine Polizei, die alles lächerlich macht; Skepsis ja, Karikatur nein.
- Keine Auflösung, bei der die Wahrheit nur durch ein letztes Gestandnis statt durch vorher gelegte Beweise sichtbar wird.
- Keine Serie von Kapiteln, in denen nur "noch ein Beweisobjekt" hinzukommt.
- Keine Täterin, die sich wie eine perfekte Alltags-Genialtäterin ohne Restfehler, Kosten oder Gegenreaktion bewegt.

### Hook-Regel
- Kapitel 1 beginnt mit der realen Behauptung der Kita, nicht mit Vorgeschichte.
- Die erste Leitfrage lautet nicht: "Wurde Mila entführt?" sondern: "Wie kann es Beweise dafür geben, dass Eva etwas getan hat, was sie sicher nicht getan hat?"
- Der Stoff ist früh kein klassisches Whodunit, sondern ein Suspense-Roman über Beweisbarkeit, Alltagsmacht und die ruhigere, glaubwürdigere Frau.

### Ende-Regel
- Die Wahrheit muss materiell belegbar werden: Kontaktlisten, App-Logik, Gewohnheiten, Handschrift, Zeitpunkt, Beobachtung.
- Unklar bleiben darf, wie nah Nora psychisch vor dem totalen Übergriff schon war.
- Klar werden muss, dass sie Mila nicht zufällig wollte, sondern Evas Alltag systematisch studiert und besetzt hat.
- Der letzte Satz ist ein Konkretheitsbild aus Evas Rückgewinnung von Alltag, keine These über Mutterschaft.

### X-Ray-Pflicht für jede Revision
- Vor jedem grossen Überarbeitungslauf ein Kapitel-X-Ray mit genau einem Satz pro Kapitel:
  `Eva will X, tut Y, verliert oder gewinnt Z.`
- Wenn ein Kapitel in diesem Format keinen klaren Verlust, Gewinn oder Richtungswechsel hat, ist es Kandidat für Fusion oder Streichung.
- Wenn zwei benachbarte Kapitel denselben Satzbau ergeben, tun sie sehr wahrscheinlich dieselbe Arbeit.

---

## WORLD BIBLE

### Setting
- **Ort:** Deutschland, Gegenwart. Mittelgroße westdeutsche Stadt.
- **Hauptschauplätze:** Kita "Sonnengarten", Evas Altbauwohnung, gemeinsamer Innenhof, Parkplatz vor der Kita, Simons neue Wohnung, ein kleines Polizeikommissariat, Kinderarztpraxis.
- **Sekundäre Räume:** Hausflur, Spielplatz, Elternabendraum, Supermarkt, Tiefgarage, Waschkuche, Treppenhaus.
- **Atmosphäre:** Frühlingslicht, Glas, Schlüssel, Stofftaschen, nasse Jacken, Thermobecher, Elternhektik, Verwaltungsfreundlichkeit mit kaltem Kern.

### Alltagsrealismus-Anker
- Die Kita ist nicht fahrlassig, sondern alltagsbelastet, routiniert und auf Vertrauen gebaut.
- Abholung läuft über Mischung aus Wiedererkennen, App-Eintrag, Notfallkontakt und geübter Praxis.
- Eva ist getrennt lebend, organisiert, aber müde und dadurch an einzelnen Stellen angreifbar, nicht irrational.
- Simon ist kein Schurke. Er liebt Mila, denkt aber zuerst in Stabilität und juristischem Risiko.
- Nora hatte legitimen Alltagszugang: als enge Freundin, Hofnachbarin und zeitweise eingetragene Notfallkontaktperson.
- Die Gefahr wirkt deshalb glaubhaft, weil sie aus bereits erlaubter Nähe entsteht.

### Die Kita — Sonnengarten
- Kleine private Einrichtung mit guter Reputation und engem Elternkontakt.
- Kamera deckt Eingang und Garderobenbereich ab, aber nicht jeden Winkel lückenlos.
- Abholungen werden dokumentiert, aber die Kultur bleibt persönlich, nicht wie am Flughafen.
- Leitung und Erzieherinnen wollen Mila schützen, müssen aber auf dokumentierte Vorgänge reagieren.

### Die soziale Lage
- Eva lebt seit acht Monaten getrennt von Simon.
- Mila pendelt zwischen zwei Haushalten, braucht klare Routinen.
- Nora ist über den Hof, später über Mila, in Evas Alltag gerutscht.
- Die engsten Bedrohungen kommen aus Hilfe, Entlastung und Verfügbarkeit.

### Noras drei Zugriffssysteme
- **Frühere legitime Nähe:** Mila-Wissen, Kleidung, Sprachmuster, Wohnung, Schlüssel, Routinen.
- **Administrativer Restzugriff:** alte Listen, Vollmachten, Helferdienste, offene Mappen, Drucker, Kontaktwege.
- **Sozialer Vertrauensvorschuss:** Simon, Kita-Kultur, Arztpraxis, Nachbarschaft, ruhiges Auftreten.
- Jeder spätere Zugriff muss aus mindestens einer dieser drei Linien ableitbar sein; Nora darf nichts können, das nicht daraus logisch folgt.

### Die Wahrheit unter dem Hook
- Es gibt keinen Doppelgänger im fantastischen Sinn.
- Nora hat Evas Routinen über Monate studiert und an entscheidenden Punkten mit legal wirkenden Hilfsrollen kombiniert.
- Ihr Ziel ist nicht der einmalige Zugriff, sondern der schrittweise Beweis, dass Eva unzuverlässig, überfordert oder instabil wirkt.
- Die "falsche Abholung" ist Auftakt und Testlauf eines größeren Ersetzungsmusters.

### Eröffnungsmechanik für Kapitel 1
- Eva sieht am späten Nachmittag in der Kita-App einen verspätet synchronisierten Abschlussvermerk vom Vortag: Mila sei um 15:42 Uhr von ihr abgeholt worden.
- Mila ist zu diesem Zeitpunkt physisch bei Simon im regulären Umgang; deshalb entsteht kein akuter Vermisstenfall, sondern zunächst ein dokumentierter Identitätsangriff.
- Eva ruft die Kita an, weil sie den Vorgang für einen falschen Eintrag oder eine Verwechslung hält.
- Erst im Gespräch und vor Ort wird klar, dass nicht bloss ein App-Fehler vorliegt, sondern ein real protokollierter Abholvorgang mit Wiedererkennen, Garderobenszene und Unterschrift.
- Genau deshalb eskaliert die Lage zuerst als Glaubwürdigkeits- und Beweisproblem, nicht als sofortiger Polizeialarm.

---

## CANON FACTS (Initial — Stand: vor Kapitel 1)

```json
{
  "canon_facts": [
    {
      "id": "CF001",
      "fact": "Eva Berger, 35, lebt getrennt von ihrem Mann Simon und organisiert den Alltag ihrer Tochter Mila zwischen zwei Haushalten.",
      "status": "aktiv"
    },
    {
      "id": "CF002",
      "fact": "Mila Berger ist sechs Jahre alt und besucht die private Kita Sonnengarten.",
      "status": "aktiv"
    },
    {
      "id": "CF003",
      "fact": "Die Kita dokumentiert Abholungen über gelebte Routine, App-Einträge und Notfallkontaktlisten, aber nicht über ein ausfallsicheres Hochsicherheitsverfahren.",
      "status": "aktiv"
    },
    {
      "id": "CF004",
      "fact": "Nora Seidel ist Hofnachbarin, enge Vertraute von Eva und war zeitweise offiziell als Notfallkontakt für Mila hinterlegt.",
      "status": "aktiv — verdecktes Risiko"
    },
    {
      "id": "CF005",
      "fact": "Simon Berger will Mila schützen und reagiert auf Unsicherheiten eher mit Kontrolle als mit Vertrauen.",
      "status": "aktiv"
    },
    {
      "id": "CF006",
      "fact": "Eva führt ihren Alltag über feste Routinen, analoge Listen und ein Handy, das sie im Stress oft offen herumliegen lässt.",
      "status": "aktiv"
    },
    {
      "id": "CF007",
      "fact": "Nora hat in einem früheren Sorge- und Jugendamtskonflikt gelernt, wie stark Zuverlässigkeit, Dokumentation und ruhiges Auftreten über Glaubwürdigkeit entscheiden.",
      "status": "subtext"
    },
    {
      "id": "CF008",
      "fact": "Die Trennung von Simon ist nicht eskaliert, aber noch nicht beruhigt genug, um in einer Krisensituation automatisch Vertrauen zu erzeugen.",
      "status": "aktiv"
    },
    {
      "id": "CF009",
      "fact": "Die falsche Abholung ist kein isolierter Zufall, sondern der erste sichtbare Eingriff in Evas Alltag.",
      "status": "Countdown-Anker"
    }
  ]
}
```

---

## CHARACTER STATE LEDGER

### Eva Berger — „Die Mutter"
```json
{
  "character_id": "EVA",
  "name": "Eva Berger",
  "role": "Getrennt lebende Mutter, Projektmanagerin in Teilzeit",
  "background": "Eva lebt seit acht Monaten getrennt von Simon. Sie funktioniert über Listen, Zeitfenster und die Überzeugung, dass Alltag stabil bleibt, wenn man ihn nur sauber genug organisiert.",
  "wunde": {
    "was_passiert_ist": "Die Trennung war nicht laut, aber erschütternd. Simon warf ihr keine Untreue, sondern Unzuverlässigkeit vor. Genau dieser Vorwurf wirkt bis heute nach.",
    "was_es_heute_macht": "Eva verteidigt sich über Kontrolle. Wenn ihre Erinnerung oder ihr Ablauf angezweifelt wird, wird sie schneller, härter und damit für andere nicht glaubwürdiger, sondern nervöser.",
    "was_er_niemals_tut": "Sie gibt ungern zu, dass sie Hilfe braucht oder eine Lücke in ihrer Routine übersehen hat.",
    "arc_abschluss": "Eva lernt nicht, perfekt zu werden, sondern erkennt, dass sie Alltag nicht nur organisieren, sondern auch gegen Vereinnahmung verteidigen muss."
  },
  "initial_state": {
    "physisch": "angespannt, funktional, oft übermüdet",
    "psychisch": "wach, reizbar, kontrolliert, untergründig schamempfindlich",
    "verhältnis_zur_arbeit": "Arbeit ist Taktung und Selbstbeweis zugleich",
    "verhältnis_zu_mila": "liebend, aufmerksam, manchmal zu hastig",
    "verhältnis_zu_nora": "vertrauensvoll, dankbar, an einzelnen Stellen schon zu offen"
  },
  "speech_pattern": "klar, schnell, im Stress zu präzise; wenn sie sich verteidigt, klingt sie härter als beabsichtigt",
  "arc": [
    {"phase": "Act 1", "state": "Eva will einen Fehler in einem einzelnen Vorgang finden und glaubt noch an ein Missverständnis."},
    {"phase": "Act 2", "state": "Sie erkennt, dass jemand nicht ein Ereignis, sondern ihr Alltagsbild manipuliert."},
    {"phase": "Act 3", "state": "Sie begreift, dass sie nicht nur Mila schützen, sondern ihre Rolle als verlässliche Mutter aktiv zurückerobern muss."}
  ]
}
```

### Nora Seidel — „Die Vertraute"
```json
{
  "character_id": "NORA",
  "name": "Nora Seidel",
  "role": "Hofnachbarin, Freundin, frühere Notfallkontaktperson",
  "background": "Nora ist zuverlässig, ruhig, präsent und scheinbar genau die Art von erwachsener Hilfe, die nach einer Trennung Gold wert ist. Sie kennt Abholwege, Lieblingsjacken, Uhrzeiten, Kinderarzttermine und die Logik von Formularen.",
  "wunde": {
    "was_passiert_ist": "Nora hat vor Jahren nach einer Suchtphase ihren eigenen Sohn an den Vater verloren. Sie ist inzwischen stabil, aber das Gefühl, als Mutter nicht mehr als glaubwürdig zu gelten, hat sich in ihr festgesetzt.",
    "was_es_heute_macht": "Sie verwechselt Fürsorge mit Anspruch. Wo Eva überlastet wirkt, liest Nora keine Grenze, sondern eine Einladung zur Übernahme.",
    "was_er_niemals_tut": "Sie verliert nie sichtbar die Kontrolle, solange andere zusehen.",
    "arc_abschluss": "Nora wird nicht als irrsinnige Ausnahme entlarvt, sondern als Frau, die aus Demütigung und Selbstgerechtigkeit eine minutiös geplante Ersetzung baut."
  },
  "initial_state": {
    "physisch": "ruhig, gepflegt, unauffällig",
    "psychisch": "hochkontrolliert, aufmerksam, geduldig",
    "verhältnis_zu_eva": "offiziell loyal, innerlich prüfend",
    "verhältnis_zu_mila": "warm, verlässlich, leicht zu präsent",
    "verhältnis_zu_struktur": "sie vertraut Papier, Listen und beobachtbarer Routine mehr als spontanen Gefühlen"
  },
  "funktion_im_buch": "Nicht die laute Täterin, sondern die Frau, die den Alltag besser liest als alle anderen und dadurch fast unsichtbar eindringt.",
  "kern": "Nora will nicht nur in Milas Nähe sein. Sie will beweisen, dass sie die verlässlichere Mutter wäre.",
  "was_unklar_bleibt": "Ab welchem Punkt aus gekränkter Fürsorge bewusste Vernichtungsbereitschaft geworden ist.",
  "speech_pattern": "leise, verbindlich, nie zu lang; Fragen klingen bei ihr wie Hilfeangebote"
}
```

### Simon Berger — „Der Vater"
```json
{
  "character_id": "SIMON",
  "name": "Simon Berger",
  "role": "Evas Ex-Mann und Milas Vater",
  "background": "Simon lebt seit der Trennung in einer kleineren Wohnung auf der anderen Rheinseite. Er ist kein Gegner, aber jemand, der Unsicherheit sofort in Absicherung übersetzt. Seit einem fiebrigen Kita-Nachmittag, an dem Eva im Arbeitschaos erst verspätet erreichbar war, hängt in ihm der Gedanke fest, dass Instabilität bei Mila nie wieder unbemerkt wachsen darf.",
  "wunde": {
    "was_passiert_ist": "Die Trennung liess ihn mit dem Gefühl zurück, Eva habe Belastung zu lange ausgesessen statt sie rechtzeitig zu benennen. Der alte Kita-Anruf mit der fiebrigen Mila wurde für ihn zum stillen Beweis, dass gute Absichten ohne saubere Abläufe zu spät kommen können.",
    "was_es_heute_macht": "Wenn Mila betroffen sein könnte, vertraut er eher Dokumenten, geregelten Übergaben und vernünftigen Dritten als Evas spontaner Version der Lage. Genau das macht ihn für Nora anschlussfähig.",
    "was_er_niemals_tut": "Er wird Mila nicht bewusst als Druckmittel missbrauchen und Eva nicht offen demütigen.",
    "arc_abschluss": "Simon muss erkennen, dass seine Ordnung Nora mitgetragen hat. Erst als er seine Schutzlogik als Einfallstor begreift, kann er sich klar auf Evas Seite stellen."
  },
  "initial_state": {
    "physisch": "geordnet, sachlich, angespannt",
    "psychisch": "beschützend, skeptisch, konfliktmüde",
    "verhältnis_zu_eva": "nicht feindlich, aber schnell misstrauisch",
    "verhältnis_zu_mila": "liebevoll, regelorientiert, in kleinen Handgriffen sichtbar",
    "verhältnis_zu_nora": "dankbar für Hilfe, solange sie Mila entlastet und Abläufe stabil hält"
  },
  "speech_pattern": "kurz, verfahrensnah, kontrolliert; unter Druck enger statt lauter",
  "vaterhandlungen": [
    "legt Mila abends die Socken für den nächsten Morgen bereit",
    "macht ihr Brotdose und Abendbrot lieber selbst, wenn er nervös ist",
    "liest Nachrichten zweimal, bevor er reagiert"
  ],
  "arc": [
    {"phase": "Act 1", "state": "Simon hält die Lage für gefährlich, aber noch erklärbar, und baut aus Schutz eine Übergangsordnung, die Eva real Zugriff kostet."},
    {"phase": "Act 2", "state": "Er glaubt Eva in kurzen Momenten sichtbar mehr als Nora, rudert aus Angst vor Instabilität aber wieder auf Verwaltung, Vorsicht und Ordnung zurück."},
    {"phase": "Act 3", "state": "Er versteht, dass sein Stabilitätsreflex Nora mitgestützt hat, schämt sich dafür und kippt vom Filterkanal zum Mitwisser und Verbündeten."}
  ]
}
```

### Petra Löwen — „Die Leitung"
```json
{
  "character_id": "PETRA",
  "name": "Petra Löwen",
  "role": "Leiterin der Kita Sonnengarten",
  "funktion": "Institutioneller Druckpunkt ohne Schurkenfunktion",
  "kern": "Petra will Mila schützen, das Team decken und sich auf dokumentierbare Vorgänge verlassen. Gerade dadurch wird sie für Eva zeitweise zur Gegenspielerin."
}
```

### Mila Berger — „Das Kind im Zentrum"
```json
{
  "character_id": "MILA",
  "name": "Mila Berger",
  "role": "Tochter, sechs Jahre alt",
  "funktion": "Emotionaler Kern und realer Einsatz des Buches",
  "kern": "Mila ist kein Plotobjekt. Sie registriert Spannungen, orientiert sich an Wiederholung und vertraut den Erwachsenen, die ruhig wirken."
}
```

---

## VOICE PACK

Diese Sektion ist nicht für Backstory, sondern für Mikroführung in Satz, Wahrnehmung und Dialog. Wenn ein Draft auf Plotebene funktioniert, aber sprachlich zu generisch wird, gilt diese Sektion vor allen späteren Schönformulierungen.

### EVA
- Eva beobachtet zuerst Abweichung, Takt, Objekt, Reihenfolge. Gefühl kommt später, wenn überhaupt.
- Ihre Sätze werden unter Druck nicht poetischer, sondern genauer und kürzer.
- Sie benennt Dinge oft über Funktion: Schlüssel, Eintrag, Wechselkleidung, Rückruf, Ausdruck, Liste.
- Sie deutet Nora nicht früh als Monster, sondern als Frau, die zu viel Zugriff hat.
- Sie denkt in Ketten: Wer wusste was, wann, woher, mit welchem legitimen Restzugang.
- Wenn Eva etwas nicht glaubt, prüft sie erst Material, dann Erinnerung, erst später Intuition.
- Gute Eva-Sätze tragen über Differenz, Unstimmigkeit, Verwaltungsrest, falsches Alltagsdetail.
- Schlechte Eva-Sätze erklären ihre Panik, moralische Wahrheit oder die Bedeutung eines Moments aus.

Positive Muster:
- `Die Uhrzeit stand da, als wäre sie unstrittig.`
- `Der Mantel war ihrer. Der Gang nicht ganz.`
- `Nora sagte es, als hätte der Satz schon länger in ihrer Tasche gelegen.`

Verbotene Drift:
- Keine langen Innenmonologe über Mutterschaft.
- Keine Metaphern, die den Schmerz schöner machen als die Lage.
- Kein Satz nach dem Muster: `Jetzt verstand sie, dass ...`

### NORA
- Nora spricht knapp, hilfreich, leicht entlastend. Ihre Fragen klingen wie Ordnungshilfe.
- Sie behauptet nie grob. Sie schiebt Formulierungen so, dass andere den Schluss selbst ziehen.
- Sie benutzt Routinevokabular: `ich übernehme`, `ich kann schnell`, `wenn es hilft`, `ich war eh dort`, `mach du erst mal`.
- Sie wird nie melodramatisch und nie offen kalt, solange andere im Raum sind.
- Ihre Bedrohung liegt in korrektem Timing, nicht in bösen Sätzen.
- Sie kennt Details, aber legt sie oft nebenbei ab, als wären sie selbstverständlich.
- Gute Nora-Dialoge entlasten und besetzen dabei unbemerkt Position.
- Schlechte Nora-Dialoge klingen villainhaft, zu pointiert oder zu bewusst doppeldeutig.

Positive Muster:
- `Ich kann Mila kurz nehmen, wenn du erst das mit Petra klären willst.`
- `Komisch, gestern hatte sie den gelben Becher doch noch in der Hand.`
- `Ich dachte, Simon weiß das längst.`

Verbotene Drift:
- Kein offenes Drohen.
- Keine psychoanalytische Selbstauskunft.
- Kein Satz, der Nora früh als klare Täterin markiert, wenn noch soziale Plausibilität nötig ist.

### SIMON
- Simon spricht verfahrensnah. Er will Ablage, Abfolge, Plausibilität.
- Er beruhigt nicht über Gefühl, sondern über Ordnungsschritte.
- Seine Sätze werden unter Druck nicht lauter, sondern enger.
- Er versucht, Widerspruch zu neutralisieren, nicht ihn emotional auszutragen.
- Gute Simon-Zeilen klingen nach Absicherung, nicht nach Dominanz.
- Schlechte Simon-Zeilen klingen zynisch, richterlich oder ex-männlich verbittert.

Positive Muster:
- `Schick mir bitte alles, was du hast, in der Reihenfolge.`
- `Ich sage nicht, dass du dich irrst. Ich sage, wir müssen wissen, woran es hängt.`
- `Wenn es einen Eintrag gibt, müssen wir den zuerst sauber kriegen.`

Verbotene Drift:
- Kein kalter Familienrechts-Sound.
- Keine grossen Trennungsabrechnungen mitten in Beweisszenen.
- Keine Dialogzeilen, die ihn heimlich zum Antagonisten umcodieren.

### PETRA
- Petra spricht institutionell präzise, aber nie feindselig.
- Sie vermeidet Spekulation und hält sich an Vorgänge, Sichtbares, Dokumentiertes.
- Ihre Höflichkeit bleibt echt. Gerade deshalb kann sie hart wirken.
- Sie schützt Team und Kind über Verfahren, nicht über Intuition.
- Gute Petra-Zeilen sind klar, knapp und ohne soziale Schärfe.
- Schlechte Petra-Zeilen klingen belehrend, defensiv aggressiv oder nach Plotfunktion.

Positive Muster:
- `Ich sage nicht, dass es so war. Ich sage, dass es so protokolliert ist.`
- `Wir müssen ab jetzt anders sichern, bis wir das geklärt haben.`
- `Für mich ist im Moment entscheidend, was belegbar ist.`

Verbotene Drift:
- Keine kalte Kita-Bürokratie als Karikatur.
- Keine böswillige Mutter-Bewertung.
- Keine Szene, in der Petra plotbequem plötzlich alles versteht.

### MIKROREGELN FUER DIALOG UND ABSATZENDE
- Dialogzeilen sollen Macht, Vertrauen, Verfahren oder Zugriff verschieben. Kein atmosphärisches Füllgespräch.
- Nach der stärksten Objektbeobachtung, dem stärksten Beweisbild oder einem leisen Machtkipp endet der Absatz oder die Szene. Kein Nacherklären.
- Wenn eine Figur einen Satz sagt, der schon eine neue Lesart etabliert, folgt kein zweiter Satz, der dieselbe Wirkung ausdeutet.
- Kapitelschlüsse bevorzugen Material, Restsignal, Verwaltungsdetail oder kleine soziale Verrutschung statt grosser Pointe.

---

## PROSA BENCHMARK

Diese Sektion ist Stilanker, kein Ersatz für Szene oder Regie. Wenn ein Draft funktional richtig, aber spürbar mechanisch wirkt, wird gegen diese Muster gegengelesen.

### Eva unter Druck
Eva las den Eintrag ein zweites Mal, nicht weil er sich ändern würde, sondern weil ihr Kopf noch nach dem kleinen Fehler suchte, aus dem sich alles zurückdrehen ließ. 15:42 Uhr. Abholung bestätigt. Ihr Name stand daneben, ordentlich, endgültig, in derselben sachlichen Schrift, mit der die App sonst auch an Ausflüge und Gummistiefel erinnerte. Gestern um 15:42 Uhr war sie nachweisbar in Frankfurt gewesen. Heute saß sie im Büro ihrer Heimatstadt und starrte auf einen Satz, der wirkte, als hätte die Welt sich längst entschieden und sie nur verspätet informiert. Nicht die Panik kam zuerst. Nur dieser trockene Gedanke: Das kann nicht protokolliert da stehen.

### Nora im Hilfsmodus
Nora trat nie auf, als gehöre ihr etwas. Genau das machte sie so schwer abzuwehren. Sie stellte die Tasche ab, als wäre sie zufällig ohnehin in der Hand gewesen, und fragte nicht, ob sie helfen solle, sondern was gerade schneller wäre. Ihre Stimme war leise genug, um niemanden vorzuführen, und bestimmt genug, dass andere unmerklich einen Schritt zurücktraten. Wenn sie Milas Schal richtete, wirkte das nicht wie Besitz, sondern wie Aufmerksamkeit. Sie nahm nie Raum. Sie ordnete ihn nur so, dass man erst später merkte, wie viel davon nun ihr gehörte.

### Simon zwischen Schutz und Misstrauen
Simon hörte Eva zu, wie er immer zuhörte, wenn er Angst bekam: zu ruhig, zu gerade, mit diesem Blick auf den Tisch statt direkt auf ihr Gesicht. Er wollte ihr glauben. Man sah es daran, dass er nicht sofort widersprach, sondern einzelne Punkte noch einmal in die richtige Reihenfolge bringen wollte, als ließe sich Wahrheit durch saubere Ablage retten. Gleichzeitig hielt er Mila schon im Kopf von allem fern, was nach Unruhe roch. Er war kein Mann der Drohung. Er war gefährlicher. Er war ein Mann, der Fürsorge in Verfahren übersetzte, sobald Gefühle ihn überforderten.

### Petra als korrekte Institution ohne Kälte
Petra sprach nie so, als müsse Eva sich schämen. Gerade deshalb tat es weh, wenn sie beim Dokument blieb. Sie faltete keine Hände, senkte nicht mitleidig die Stimme und machte aus der Lage kein Drama, das ihr selbst gefiel. Sie sagte, was vorlag, was nicht reichte und was sie ab jetzt anders sichern musste. In einer anderen Geschichte wäre sie die verständnisvolle Helferin. In dieser hier war sie die Frau, die ein Kind schützen musste, auch wenn das bedeutete, einer Mutter mit höflicher Präzision zu zeigen, wie wenig an einem Gefühl belegbar war.

### Mini-Checkliste
- Klingt die Szene wie gelebter Alltag oder wie Beweisabwicklung?
- Sagt eine Figur nur, was die Regie braucht?
- Endet das Kapitel mit Folge statt nur mit Unruhe?
- Ist Nora plausibel begrenzt?
- Ist Mila Kind statt Symbol?
- Ist Simon spezifisch statt bloß skeptisch?

---

## CONTINUITY GUARDRAILS (Arbeitsstand Entwurf)

Diese Sektion ist nicht für Dramaturgie da, sondern gegen Drift in der Produktion. Solange keine globale Umbenennung beschlossen wird, gelten die folgenden Angaben als gesperrter Arbeitsstand.

### Namens- und Funktionsschutz
- `Eva Berger` bleibt die Hauptfigur und Mutter von `Mila Berger`.
- `Nora Seidel` bleibt die enge Vertraute und spätere Täterin. Diese Funktion darf nicht auf den Ex-Mann umgeschrieben werden.
- `Simon Berger` ist nicht der verdeckte Hauptgegner.
- `Petra Löwen` bleibt institutionell korrekt, nicht böswillig.
- `Sonnengarten` bleibt die Kita. Nicht später stillschweigend zu Schule, Hort oder Krippe umdeuten.

### Produktionsregeln für die Beweislogik
- Jede spätere Enthüllung muss auf einem frühen Alltagsdetail beruhen.
- `Nora` darf keine übernatürliche Allwissenheit haben. Alles, was sie weiss, muss aus Nähe, Beobachtung, Zugriff oder früherem legitimen Kontakt stammen.
- Die Videoaufnahme darf stark wirken, aber nicht technisch unfehlbar sein.
- `Mila` darf Nora bereits mögen, aber nicht plötzlich wie eine Ersatzmutter behandeln, ohne dass die Regie es vorbereitet.
- Jede institutionelle Reaktion muss für Aussenstehende nachvollziehbar bleiben.

### Szenische Plausibilitätswächter
- Kapitel 1 und 2 dürfen sich nicht doppeln. Kapitel 1 endet auf dem Standbild und dem ersten Schock. Kapitel 2 zeigt, warum halb sauberes Material sozial und institutionell trotzdem reicht.
- Mantelfarbe, Uhrzeiten, Eva-Orte und Mila-Orte bleiben konsistent. Der dokumentierte Abholzeitpunkt ist 15:42 Uhr.
- Für den Draft gilt: Gestern um 15:42 Uhr war Eva nachweisbar in Frankfurt. Heute um 16:18 Uhr sieht sie den verspäteten App-Eintrag in ihrer Heimatstadt, fährt zur Kita und sitzt um 16:42 Uhr im Leitungsbüro.
- Jede Scene Card muss intern wissen: Wo ist Mila? Wer glaubt aktuell, wer Mila holen darf? Wer hat gerade welchen Kanal?
- Nora darf nach dem Vorfall kein unkontrolliertes Kita-Innenfoto von Mila erhalten. Wenn sie ein Detail bekommt, dann über Simon, Petra, den Elternverteiler, alte Freigaben oder eine plausible Weiterleitung.
- Drucker-, Scan- und Listenfunde brauchen nachvollziehbare Vorarbeit: alter Druckjob, Rückseitenblatt, Druckhistorie, offen herumliegende Helfermappe oder früherer legitimer Zugriff.
- Arztpraxis, Kita, Polizei, Datenschutz und Abholregeln müssen realistisch wirken, auch wenn sie nicht juristisch ausbuchstabiert werden.
- Nora darf nicht in jedem Kapitel perfekt getaktet erscheinen. Manchmal liegt sie minimal zu früh, zu spät, zu allgemein oder an einem Detail daneben.
- Simon handelt aus Schutzlogik, nicht aus Besitzanspruch. Wenn er Zugriff verschiebt, dann über plausible Übergangsregeln, nicht über strafende Machtausübung.
- Mila bezeugt nichts bewusst. Ihre Sätze, Griffe und Verwechslungen sind kindliche Orientierung an Wiederholung, keine Plot-Erklärungen.

### Merksatz für EMBER
> Kanon in den `Codex`. Alltagsbeweise in die `Scene Card`. Einmalige Steuerung in die `Regieanweisung`.

---

## NORA CAPABILITY MAP

Nora wirkt nur dann stark, wenn ihr Zugriff realistisch bleibt. Diese Map begrenzt sie und macht sie gleichzeitig gefährlicher, weil alles aus legitimer Nähe, Beobachtung und liegengebliebenem Alltag kommt.

### Was Nora glaubhaft wissen kann
- Abholzeiten, Bringrhythmen, Kleidungswechsel, Brotdosenlogik, Trinkbecher, typische Stressfenster von Eva.
- Namen, Funktionen und Tonlagen der Kita-Mitarbeitenden durch frühere Übergaben und Nachbarschaftsnähe.
- Welche Listen, Ausdrucke, Freigaben und Notfallkontakte im Umlauf waren oder früher einmal gültig waren.
- Simons Stabilitätslogik, weil er auf vernünftige Hilfe anspringt, solange sie Mila entlastet.
- Wie Eva spricht, schreibt, absagt und improvisiert, weil Nora über Jahre genug Alltagsmaterial gesehen hat.

### Woher Nora dieses Wissen hat
- Frühere legitime Notfallfunktion.
- Regelmässige Nachbarschaftsnähe im Hof, im Treppenhaus, bei Bring- und Abholmomenten.
- Chats, Fotos, Listenreste, alte Ausdrucke, liegengebliebene Zettel, geteilte Orga.
- Frühere echte Hilfesituationen, in denen Eva dankbar, unachtsam oder unter Zeitdruck war.
- Beobachtung statt Techniktrick. Nora sammelt, merkt sich, legt ab.

### Was Nora operativ tun kann
- Sich in bestehende Routinen einschieben, wenn jemand bereits an ihre Hilfsrolle gewöhnt ist.
- Frühere Dokumente, Freigaben oder Kontaktlisten länger nutzen, als andere glauben.
- Sprache, Kleidung, Gegenstände und Timing so angleichen, dass für Aussenstehende Plausibilität reicht.
- Simon und Kita nicht manipulieren wie eine Genialtäterin, sondern deren Ordnungsbedürfnis bedienen.
- Materielle Doppelungen herstellen: zweite Jacke, zweite Tasche, zweite Version eines Nachmittags.

### Was Nora nicht können darf
- Keine technische Wunderfähigkeit, kein Hacking, keine lückenlose digitale Überwachung.
- Kein unerklärtes Wissen über intime Gespräche, bei denen sie nicht anwesend war und keinen realen Restzugang hatte.
- Keine perfekte Imitation über Wochen ohne kleine Verrutschungen.
- Keine offene Gewalt, solange das Buch auf sozialer Ersetzung basiert.
- Keine institutionelle Allmacht. Polizei, Kita und Simon müssen für sie nur lange genug in die falsche Richtung lesen, nicht blind alles schlucken.

### Rote Linien für Embers Driftkontrolle
- Wenn Nora etwas weiss, muss der Draft implizit mittragen, woher.
- Wenn Nora zu früh zu unheimlich wirkt, fehlt soziale Tarnung.
- Wenn Nora zu perfekt wirkt, fehlt menschlicher Restfehler.
- Wenn ein neuer Nora-Zugriff keine Folge für Evas Status, Milas Routine oder institutionelle Vorsicht auslöst, ist die Szene noch nicht weit genug.
- Wenn Nora wie ein Thrillergehirn wirkt, zurück auf Nachbarschaft, Routine, Dokument und Timing.

---

## NORA COST LEDGER

| Kapitel | Nora-Erfolg | Nutzen für Nora | Kosten / Restfehler | Späterer Payoff |
| --- | --- | --- | --- | --- |
| 1-2 | Falsche Abholung, Video, Unterschrift | Nora setzt früh die Lesart, dass dokumentierte Routine gegen Eva reicht | Das Material ist nur halb sauber; Gesicht und Stimme sind nicht voll eindeutig, die Unterschrift basiert auf älteren Gewohnheiten | Kapitel 25 und 37 verbinden alte Signatur, Zeitfenster und Verwaltungskette |
| 4-5 | Alte Notfallliste und Vollmacht bleiben wirksam | Frühere Legitimität schützt Noras Nähe vor sofortigem Alarm | Dieselben alten Listen beweisen später, wie lang Restzugriffe offenstanden | Kapitel 19, 27 und 37 machen den Altzugriff institutionell lesbar |
| 9 | Wohnung- und Schlüsselzugriff | Nora konnte Dinge kopieren, legen und nachsortieren | Der Schlosswechsel kappt künftigen physischen Zugriff | Kapitel 27 zeigt, wie legitime Hilfe zum Einfallstor wurde |
| 10 | Waldtag, Regenhose, Vorabwissen | Nora wirkt vorbereitet und mütterlich präsent, bevor Eva reagieren kann | Alter Helferchat und Planungsliste markieren eine konkrete Quelle | Kapitel 19 und 37 zeigen, dass Nora nur über zurückgelassene Systeme wusste |
| 11 | Stimme und alte Sprachformeln | Nora kann Evas kurze Alltagsformulierungen sozial plausibel spiegeln | Die Formeln stammen aus sammelbaren Altaufnahmen | Kapitel 25 belegt, dass Nora archivierte Versionen von Eva nutzt |
| 16 | Simon als Filterkanal | Nora muss Eva nicht direkt verdrängen, solange Simon sie als ruhige Hilfe mitführt | Simon hört, liest und leitet mit; damit bleibt eine Zeugenlinie gegen Nora bestehen | Kapitel 26 und 33 kippen über genau diesen Kanal |
| 13 | Dienstagstasche und imitierte Mutterroutine | Nora besetzt Milas Körpernähe und Evas Stil | Ein falsches Wort in der Notiz verrät die fremde Hand im Vertrauten | Kapitel 27 ordnet die Tasche als Teil der Hilfekette |
| 14 / 19 / 37 | Drucker-, Listen- und Formularspuren | Nora nutzt offene Verwaltungsreste statt offene Gewalt | Druckhistorie, Rückseitenblatt und Helfermappen machen ihren Zugriff später prüfbar | Kapitel 37 zieht daraus den harten aktuellen Gegenwartsbeweis |
| 23 | Praxis und Kinderarzt | Nora wirkt in einem zweiten Vertrauensraum plausibler als Eva | Praxisnotiz und kleiner Etikettfehler bleiben administrativ rückverfolgbar | Kapitel 27 und 37 machen aus der Plausibilität eine Kette |
| 23 | Zweite Jacke und doppelte Versorgung | Doppelte Fürsorge sieht nach Vernunft statt nach Besitz aus | Beschriftung, Größe und Routinefehler markieren die Dopplung als gebaut | Kapitel 41 zeigt die materielle Rückeroberung |
| 26 | Falschinformationstest | Nora versucht, ihren Kanal über Simon weiter auszunutzen | Die direkte Reaktion auf isolierte Info macht aus Simons Vorsicht Mitwissen | Kapitel 33 baut darauf auf |
| 17 | Familienalbum und digitaler Restzugriff | Nora besitzt alte Bilder, Notizen und Sprachreste ohne Hacking | Eva kappt geteilte Alben und schließt einen stillen Zugriff | Nora muss später stärker über Institutionen und Simon arbeiten |
| 35 | Noras Wohnung und vorab ausgefüllte Ausflugserklärung | Nora zeigt ihre moralische und organisatorische Parallelordnung | Eva fotografiert statt eskaliert; das Blatt wird zum ruhigen Gegenbeweis | Kapitel 37 übersetzt den halbharten Fund in belastbares Material |
| 37 | Vorabmail und Druckhistorie | Nora wollte den Ausflug als nächste saubere Übernahme nutzen | Druckjob, Entwurfszeit und Materialraumzugang verdichten sich zur Kette gegen sie | Kapitel 38 stoppt Nora im öffentlichen Alltagsraum |

---

## OPEN THREADS (Initial)

```json
{
  "open_threads": [
    {
      "id": "OT001",
      "thread": "Wie kann es eine glaubhafte Dokumentation dafür geben, dass Eva Mila abgeholt hat, obwohl Eva sicher nicht dort war?",
      "status": "offen",
      "payoff_act": "Act 1/2"
    },
    {
      "id": "OT002",
      "thread": "Wer kennt Evas Routinen, Codes, Kleidung und Bewegungen genau genug, um sie alltagsnah zu imitieren?",
      "status": "offen",
      "payoff_act": "Act 2"
    },
    {
      "id": "OT003",
      "thread": "Wird Simon im Zweifel Eva glauben oder die Seite wählen, die für Mila stabiler wirkt?",
      "status": "offen",
      "payoff_act": "Act 2/3"
    },
    {
      "id": "OT004",
      "thread": "Will die Täterin nur einen einzelnen Zugriff auf Mila oder systematisch Evas Mutterrolle besetzen?",
      "status": "offen",
      "payoff_act": "Act 3"
    },
    {
      "id": "OT005",
      "thread": "Ab welchem Punkt wird aus Hilfe, die man annehmen durfte, eine gezielte Infiltration des eigenen Lebens?",
      "status": "offen",
      "payoff_act": "Act 3"
    },
    {
      "id": "OT006",
      "thread": "Wann kippt der Kampf von einzelnen Beweisen in den realen Verlust von Evas Mutterautorität und wie holt sie diese vor anderen zurück?",
      "status": "offen",
      "payoff_act": "Act 2/3"
    }
  ]
}
```

---

## PROOF LADDER

Diese Treppe ordnet nicht den Plot, sondern die Verschiebung von Beweis, Lesart und Glaubwürdigkeit. Jede neue Stufe muss etwas Früheres umcodieren, nicht nur zusätzlich illustrieren.

### Act 1 - Irrtum wird zu Muster
| Bereich | Vorgabe |
| --- | --- |
| Neue harte Fakten | App-Eintrag, Videoausschnitt, Unterschrift, alte Reserve-Liste, frühere Vollmacht |
| Falsche Anfangslesart | technischer Fehler oder chaotische Kita-Kommunikation |
| Neue Lesart nach Act 1 | Es gab einen realen alltagsnahen Zugriff, der Evas Spur benutzt hat |
| Wer glaubt was | Eva glaubt an gezielte Verschiebung; Petra an dokumentationspflichtige Unklarheit; Simon an gefährliche, aber noch erklärbare Schieflage |
| Was unbewiesen bleiben muss | Dass Nora die Täterin ist und dass der Zugriff systematisch geplant ist |

### Act 2 - Zugriff wird zu Ersetzung
| Bereich | Vorgabe |
| --- | --- |
| Neue harte Fakten | doppelte Gegenstände, Sprachreste, alte Freigaben, falsche Alltagskenntnisse, Familienalbum/Fotofreigaben, Druckerspur, Zugriff auf Orga-Reste, entzogene oder umgeleitete Kontaktkanäle |
| Falsche Zwischenlesart | Nora ist nur zu präsent oder zu hilfreich; Eva reagiert über |
| Neue Lesart nach Act 2 | Jemand baut aus früherer Hilfe eine zweite, sozial glaubwürdige Version von Mutterschaft und erzielt damit schon reale Folgen für Zugriff, Routinen und Loyalität |
| Wer glaubt was | Eva erkennt Muster; Simon spürt, dass seine Vorsicht Nora mitstützt; Petra bleibt formal vorsichtig, reagiert aber auf Struktur; Mila folgt Wiederholung statt Wahrheit |
| Was unbewiesen bleiben muss | Der institutionell belastbare Vollbeweis und das volle Motivmass |

### Act 3 - Ersetzung wird nachweisbar
| Bereich | Vorgabe |
| --- | --- |
| Neue harte Fakten | kleine Unmöglichkeitsfenster, Signaturfehler, Kalenderabgleich, Wohnungsfund, Mail-/Druckkette, kohärente Beweiskette aus mehreren alltagsnahen Resten und aktuellen Verfahrensfolgen daraus |
| Falsche Vor-Endlesart | Es reicht für Verdacht, aber nicht für Eingriff |
| Neue Lesart nach Act 3 | Nora hat nicht punktuell geholfen, sondern systematisch Position, Glaubwürdigkeit und Mutterroutine besetzt; dieselben Institutionen, die Eva vorher ausdünnten, müssen ihre Lesart jetzt revidieren |
| Wer glaubt was | Simon und Petra sehen das Muster jetzt mit; Institutionen reagieren auf Kette statt auf Einzelreiz; Eva gewinnt Autorität nicht privat, sondern sichtbar zurück |
| Was bis zum Schluss gelten muss | Kein Wunderfund, kein Gestandnis als Abkürzung, keine bösartige Karikatur statt sozial glaubhafter Täterlogik |

### Rhythmusregel für Act 2 und Act 3
- Nach spätestens zwei Kapiteln mit neuer Evidenz braucht es ein Kapitel, in dem diese Evidenz direkte Folge erzeugt: weniger Zugriff, weniger Vertrauen, veränderte Routine, institutionelle Vorsicht oder einen Gegenzug.
- Kein Kapitel darf nur bestätigen, was der Leser ohnehin schon weiss. Jede Wiederholung muss teurer, öffentlicher oder irreversibler werden.
- Simon-, Petra- und Mila-Szenen sind keine Pausen vom Plot, sondern die Orte, an denen Beweise Konsequenzen bekommen.
- Simon braucht in Act 2 mindestens einen kurzen Moment echten Glaubens, aus dem er aus Vorsicht wieder zurückrudert.
- Mila muss in Act 2 mindestens zweimal als Kind im gegenwärtigen Vollzug sichtbar werden.
- Kapitel 35 darf nicht die erste Stelle sein, an der Noras Moral logisch lesbar wird. Spätestens in zwei früheren Szenen müssen bereits ihre Prioritäten sichtbar werden.

### Interne Zeitachse für Act 2
- Kapitel 16: Montagmorgen, erste Woche bei Simon beginnt.
- Kapitel 17: Montagabend bis Nacht, Beobachtung und digitaler Restzugriff.
- Kapitel 18-19: Dienstag später Vormittag bis Mittag, Nora-Vergangenheit und administrativer Zugang.
- Kapitel 20-21: Dienstagabend bis später Abend, erster kleiner Fehler plus institutionelle Sackgasse.
- Kapitel 22: Mittwoch, Eva geht in die aktive Gegenstrategie.
- Kapitel 23: Donnerstagmittag bis Abend, Kinderarzt und doppelte Versorgung.
- Kapitel 24-26: Freitag Nacht, Vormittag, Nachmittag. Schlaflosigkeit, Signatur, Falschinfo-Test.
- Kapitel 27: Samstag Tag und Abend, Rueckwaertsarchiv und Midpoint-Erkenntnis.

### Kapitelweise Leitfragen für Scene Cards
- Welcher neue Fakt liegt am Ende materiell oder sozial belastbar im Raum?
- Welche frühere Lesart wird dadurch schwächer?
- Wessen Glaubwürdigkeit steigt, wessen sinkt?
- Was darf der Leser jetzt vermuten, aber noch nicht sicher wissen?
- Welches kleine Restdetail kann später als Rückbeweis tragen?
- Was kostet dieses Kapitel Eva konkret?
- Würde zwischen diesem Kapitel und dem vorherigen eher deshalb oder aber stehen? Wenn nur und dann passt, ist die Kette zu weich.

### Produktionsbeschluss für die Straffung
- Zielkorridor für das Debüt: 40 bis 42 Kapitel bei 60.000 bis 68.000 Wörtern.
- Act 2 wird als 12-Kapitel-Block geschrieben.
- Vorrang haben Fusionskapitel mit doppelter Funktion.
- Jede Scene Card trägt eine Leserfrage und eine konkrete Folge. Wenn eines von beidem fehlt, ist die Szene noch nicht draftfähig.
- Kapitel 17, 23 und 27 dürfen im Draft länger werden als der Durchschnitt, etwa 1.700 bis 1.950 Wörter. Diese Fusionskapitel dürfen nicht aus Kürzungsdisziplin gehetzt werden.

### Empfohlene Fusionsachsen für Act 2
- `Kapitel 17 "Gespeicherter Alltag"` bündelt Hofbeobachtung, Etikettenreste und Familienalbum.
- `Kapitel 23 "Doppelte Versorgung"` bündelt Praxis und zweite Jacke.
- `Kapitel 27 "Nicht unzuverlässig, sondern ersetzt"` bündelt Chatarchiv und Midpoint-Erkenntnis.
- Diese Fusionsachsen sind Produktionsvorgaben, keine blössen Optionen. Wenn später einzelne Kapitel getrennt bleiben, müssen sie nachweisbar unterschiedliche Funktionen behalten.

---
## ACTS & KAPITEL — SCENE CARDS

> **Pipeline-Hinweis für Agents**: Scene Cards werden maschinell von EMBER gelesen. Im aktuellen System sind `pov`, `ort/location`, `uhrzeit/timeAnchor`, `coreAction`, `proof_object` und harte Objekt-/Kindanker die wichtigsten Laufzeitfaktoren. `opening`, `reversal`, `dramaticBeat`, `ending` und `closingLine` bleiben wichtige Regiehilfen, sollen aber nicht als Formulierungszwang missverstanden werden. `word_target_min`/`word_target_max` überschreiben den Pipeline-Default. Alle weiteren Felder helfen Agents, die Szene richtig zu lesen und Fehlfassungen zu vermeiden. Vollständige Feldbeschreibung: siehe Sektion AGENT ONBOARDING oben.

### ACT 1 — „Der Eintrag"
> Eröffnungs-Dokument: Kita-App: „Abholung bestätigt — Mila Berger, 15:42 Uhr.“

#### Kapitel 1: „Gestern"
```
Scene Card
  id: SC_1_1
  pov: EVA
  ort: Büro / Auto / Kita-Eingang
  uhrzeit: 16:18 Uhr
  ziel: Den Hook ohne Vorlauf real machen und Evas Alibi hart setzen.
  opening: Heute um 16:18 Uhr sitzt Eva in ihrem Büro in der Heimatstadt, als in der Kita-App ein verspätet synchronisierter Abschlussvermerk vom Vortag auftaucht. Gestern um 15:42 Uhr war sie nachweisbar bei einem Kundentermin in Frankfurt.
  reader_pulse: Wie kann es diesen Eintrag geben, wenn Eva gestern nachweisbar in Frankfurt war?
  main_question: Wie kann es diesen Eintrag geben, wenn Eva gestern nachweisbar in Frankfurt war?
  objective: Eva will den offensichtlichen Irrtum sofort korrigieren.
  szenenantrieb: Eva will einen banalen Verwaltungsfehler aus der Welt schaffen und riskiert, dass ein protokollierter Vorgang sie selbst zur fraglichen Person macht.
  scene_promise: Eva will einen banalen Verwaltungsfehler korrigieren, fährt sofort zur Kita und verliert die sichere Fehlerlesart, aber die protokollierte Wirklichkeit kippt schon gegen sie.
  wissensgrenze: Eva kennt nur den verspäteten Eintrag und vermutet einen App- oder Kita-Fehler. Sie darf noch nicht wissen, dass bereits ein zweites, sozial glaubhaftes Mutterbild im Raum steht.
  information_gap: Wer hat Eva imitiert, und wie weit ist dieser Vorgang schon sozial und dokumentarisch abgesichert?
  pressure_clock: Wenn Eva nicht sofort reagiert, verfestigt sich der Eintrag vom möglichen App-Fehler zur offiziellen Wahrheit.
  beziehungsdruck: Eva braucht von Petra sofortigen Zweifel am Vorgang; Petra braucht einen belastbaren Grund, die eigene Dokumentation infrage zu stellen.
  coreAction: Eva sieht den Vermerk, ruft sofort in der Kita an und fährt aus dem Büro direkt dorthin. Nicht die Gegenwart ist ihr Alibi, sondern der nachweisbare Frankfurt-Termin zur dokumentierten Abholzeit am Vortag.
  false_reading: Alles spricht zunächst für einen banalen Synchronisations- oder Verwaltungsfehler.
  dramaticBeat: Petra sagt nicht „Vielleicht ist das falsch“, sondern, dass der Vorgang real protokolliert wurde.
  reversal: Aus dem vermuteten App-Fehler wird ein real protokollierter Abholvorgang.
  konkrete_folge: Aus einem App-Eintrag wird noch am selben Nachmittag ein institutionelles Problem; Eva verliert die Möglichkeit, es als bloßen Technikfehler abzutun.
  cost: Eva verliert sofort die Entlastung eines bloßen Technikfehlers.
  status_shift: Petra hält sich an die Dokumentation; Eva muss erstmals gegen ihre eigene Spur argumentieren.
  ending: Auf dem stillstehenden Kamerabild sieht Eva eine Frau im gleichen Mantel wie sie.
  ending_type: Object Intrusion
  new_question: Wenn der Eintrag real protokolliert ist, wie weit reicht die zweite Eva bereits in den Alltag hinein?
  bad_version_risk: Die Szene würde schwach, wenn sie nur Schock liefert und den Frankfurt-Anker oder Petras dokumentierte Gegenposition weich lässt.
  revision_focus: Hook, Alibi, App-Eintrag und Petras ruhige Gegenwahrheit müssen ohne Nachdeutung tragen.
  endzustand_hook: Der Leser muss mit dem stillstehenden Bild einer zweiten Eva aus der Szene gehen, nicht mit abstrakter Verwirrung.
  proof_object: App-Eintrag 15:42 Uhr
  beweisobjekt: App-Eintrag 15:42 Uhr
  alltagswaffe: Wiedererkennen im Routinemodus
  setup: CF001, CF002, CF003, CF009, OT001
```

#### Kapitel 2: „Das Bild"
```
Scene Card
  id: SC_1_2
  pov: EVA
  ort: Kita-Leitungsbüro
  uhrzeit: 16:42 Uhr
  ziel: Zeigen, warum halb sauberes Material sozial trotzdem reicht.
  reader_pulse: Wie kann dieses Material reichen, obwohl es nicht eindeutig ist?
  main_question: Wie kann dieses Material reichen, obwohl es nicht eindeutig ist?
  objective: Eva will beweisen, dass die Aufnahme sie nur oberflächlich ähnelt.
  szenenantrieb: Eva sucht die Lücke im Beweis und riskiert, dass gerade die Unschärfe für den Alltag genügt.
  scene_promise: Eva will die Lücke im Bildbeweis finden, prüft Material und Übergabemoment und verliert soziale Glaubwürdigkeit, aber die Dokumentation wirkt gerade wegen ihrer Unschärfe alltagstauglich.
  wissensgrenze: Eva weiß jetzt, dass es Bildmaterial, Unterschrift und einen ruhigen Garderobenmoment gibt.
  information_gap: Welches Detail im Material reicht im Alltag bereits aus, obwohl das Gesicht nicht sauber lesbar ist?
  pressure_clock: Wenn Eva hier keine Lücke findet, wird aus unscharfem Material ein belastbarer Vorwand für weitere Schutzmaßnahmen.
  beziehungsdruck: Eva braucht von Petra ein Einfallstor für Zweifel; Petra muss Kind und Einrichtung absichern.
  coreAction: Petra zeigt ihr Videoausschnitt, Unterschrift, den gelben Becher und den kurzen Übergabemoment, in dem Mila ohne Widerstand mitgeht.
  false_reading: Halbsauberes Material müsste für ernsthafte Folgen eigentlich nicht reichen.
  dramaticBeat: Das Gesicht ist nicht eindeutig, aber Mantel, Becher, Haltung und Routine genügen, um Eva sozial zu beschädigen.
  reversal: Gerade die alltagsnahe Unschärfe macht den Vorgang sozial glaubwürdig statt unbrauchbar.
  konkrete_folge: Petra muss Simon einbeziehen; Evas Mutterrolle wird erstmals zu einem dokumentierten Risiko für andere.
  cost: Eva verliert den Schutz, sich auf die Bildunschärfe zurückziehen zu können.
  status_shift: Petra bewegt den Fall aus dem internen Gespräch in eine formale Schutzlogik mit Simon.
  ending: Petra bittet Eva ruhig, Simon vor ihr selbst zu informieren.
  ending_type: Institutional Lock
  new_question: Wenn dieses Material schon reicht, welche alltäglichen Details werden als Nächstes noch gegen Eva arbeiten?
  bad_version_risk: Die Szene würde schwach, wenn das Video wie ein perfekter Thriller-Beweis wirkt statt wie alltagsplausibles Halbwissen mit Folgen.
  revision_focus: Sozialen Beweis über Routine, Becher, Haltung und Petras Vernunft tragen; keine Thriller-Überhitzung.
  endzustand_hook: Nicht das Video selbst, sondern Petras ruhige Bitte, Simon einzubeziehen, muss die Szene in institutionellen Druck kippen.
  proof_object: Videoausschnitt, Unterschrift und gelber Becher
  beweisobjekt: Videoausschnitt, Unterschrift und gelber Becher
  false_friend_signal: Genau in diesem Moment meldet sich Nora mit einer scheinbar warmen Nachfrage.
  setup: CF003, CF004, CF006, OT001, OT003
```

#### Kapitel 3: „Bitte fahr nicht allein"
```
Scene Card
  id: SC_1_3
  pov: EVA
  ort: Parkplatz vor der Kita / Auto
  uhrzeit: 17:05 Uhr
  ziel: Simon und Nora als gegensätzliche Vertrauensangebote setzen.
  reader_pulse: Wem klingt Hilfe gerade glaubwürdiger als Wahrheit?
  main_question: Wem klingt Hilfe gerade glaubwürdiger als Wahrheit?
  objective: Eva will Simon sichern, ohne kleiner zu wirken als die Lage.
  szenenantrieb: Eva will Simon als Verbündeten halten und riskiert, dass Nora durch weichere Hilfe sofort plausibler wirkt.
  scene_promise: Eva will Simon als Verbündeten halten, drängt auf Vertrauen und verliert Deutungshoheit, aber Nora besetzt den Raum schneller und weicher als sie.
  wissensgrenze: Eva merkt, dass Nora zu schnell zu viel weiß, kann es aber noch nicht erklären.
  information_gap: Woher hat Nora schon jetzt so präzises Wissen über Petras Wortlaut und den Ablauf?
  pressure_clock: Wenn Simon jetzt in Verfahren statt in Beziehung denkt, wird Nora zur plausibleren Entlastungsfigur.
  beziehungsdruck: Eva braucht Vertrauen; Simon will Mila schützen; Nora will als natürliche Entlastung im Raum stehen.
  coreAction: Simon reagiert besorgt und verfahrensnah, Nora sofort warm und verfügbar.
  false_reading: Nora wirkt zunächst bloß aufmerksam und gut informiert, nicht gefährlich.
  dramaticBeat: Nora sagt den Wortlaut von Petras Nachricht nach, obwohl Eva ihn ihr noch nicht genannt hat.
  reversal: Aus warmer Hilfe wird ein erster nachprüfbarer Hinweis auf unzulässig frühes Wissen.
  konkrete_folge: Nora steht nicht mehr nur als Freundin im Raum, sondern als frühe Alternativstimme; Simon beginnt, die Lage in Verfahren statt in Beziehung zu denken.
  cost: Eva verliert emotionalen Vorsprung bei Simon.
  status_shift: Nora steigt von Helferin zur plausiblen Alternativstimme auf; Simon verschiebt sich Richtung Verfahrenslogik.
  ending: Zuhause liegt in Milas Fach ein zweiter Haargummi, den Eva nicht eingepackt hat.
  ending_type: Object Intrusion
  new_question: Wie viele kleine Alltagsdinge laufen schon doppelt, ohne dass Eva sie bemerkt hat?
  bad_version_risk: Die Szene würde schwach, wenn Nora hier schon offen täterhaft klingt oder Simon zu früh eindeutig kippt.
  revision_focus: Nora weich, Simon verfahrensnah und den Haargummi als stillen Nachstoß statt als große Pointe setzen.
  proof_object: Petras Wortlaut plus zweiter Haargummi
  alltagswaffe: Sofortige Verfügbarkeit als Vertrauenssignal
  setup: CF004, CF005, CF006, OT002, OT003, OT005
```

#### Kapitel 4: „Die Liste"
```
Scene Card
  id: SC_1_4
  pov: EVA
  ort: Wohnung / Küchentisch / Innenhof
  uhrzeit: Abend
  ziel: Den Verdacht vom Einzelereignis in ein belastbares Muster kippen.
  reader_pulse: Wie viel von Noras Nähe ist noch alte Hilfe und wie viel schon Zugriff?
  main_question: Wie viel von Noras Nähe ist noch alte Hilfe und wie viel schon Zugriff?
  objective: Eva will den Fehler in ihren Unterlagen finden.
  szenenantrieb: Eva will einen administrativen Restfehler finden und riskiert, dass aus der Suche nach Entlastung ein erstes Muster gegen Nora wird.
  scene_promise: Eva will einen Restfehler finden, prüft ihre Unterlagen und gewinnt ein erstes Muster, aber dieses Muster zieht Nora aus der Hilfe in den aktiven Zugriff.
  wissensgrenze: Eva weiß, dass Nora noch auf alten Listen auftaucht, ahnt aber noch nicht die Breite der Dopplung.
  information_gap: Wie viele alte Listen, Wege und Garderobendetails stehen Nora noch offen?
  pressure_clock: Wenn Eva den Restzugriff nicht jetzt erkennt, verlagert sich der Angriff endgültig vom Einzelfall ins Zuhause.
  beziehungsdruck: Eva will Abstand; Nora drängt sich über praktische Hilfe weiter in Evas Nahraum.
  coreAction: Eva prüft App, Kalender, Ausdrucke und Notfallkontakte und entdeckt Nora auf einer alten Reserve-Liste.
  false_reading: Vielleicht ist Nora nur versehentlich nie sauber aus alten Abläufen entfernt worden.
  dramaticBeat: Im Hof nennt Nora ein Detail aus Milas Garderobe, das sie offiziell nicht gesehen haben dürfte.
  reversal: Aus möglicher Altlisten-Schlamperei wird ein aktiver, gegenwärtiger Nahraum-Zugriff.
  konkrete_folge: Eva erkennt einen realen Restzugriff; ihr Zuhause wird zum zweiten Tatort neben der Kita.
  cost: Eva verliert die Illusion, ihr Zuhause sei außerhalb des Problems.
  status_shift: Nora gewinnt als unsichtbare Mitleserin und Mitordnerin Gewicht; Eva wird in ihrem eigenen Raum reaktiv.
  ending: An Evas Garderobenhaken hängt bereits Milas Ersatzjacke.
  ending_type: Object Intrusion
  new_question: Wenn Nora schon im Zuhause mitliest, welche anderen Alltagswege hat Eva noch offen gelassen?
  bad_version_risk: Die Szene würde schwach, wenn sie nur Detektivfleiß zeigt und den Hofmoment oder die Jacke nicht als Gegenwartszugriff wirken lässt.
  revision_focus: Aus Altlisten und Garderobendetail ein erstes Muster machen; keine Küchen-Detektivshow.
  proof_object: Alte Reserve-Liste mit Notfallkontakt
  beweisobjekt: Alte Reserve-Liste mit Notfallkontakt
  false_friend_signal: Hilfe kommt ungefragt und wirkt trotzdem plausibel
  setup: CF004, CF006, CF007, OT002, OT005
```

#### Kapitel 5: „Schriftlich"
```
Scene Card
  id: SC_1_5
  pov: EVA
  ort: Kita / Büro Petra Löwen
  uhrzeit: nächster Morgen
  ziel: Schrift als Schutz und Waffe zugleich zeigen.
  reader_pulse: Was nützt Formalität, wenn alte Formalität schon gegen Eva arbeitet?
  main_question: Was nützt Formalität, wenn alte Formalität schon gegen Eva arbeitet?
  objective: Eva will die schriftliche Sicherung als Schutz nutzen.
  szenenantrieb: Eva sucht formalen Halt und riskiert, dass genau dieselbe Formalkette ihre Position weiter ausdünnt.
  scene_promise: Eva will sich über Schrift schützen, stößt auf alte Vollmachten und verliert Handlungsspielraum, aber dieselbe Formalkette stärkt die Gegenseite weiter.
  wissensgrenze: Eva ahnt, dass alte Vollmachten und Formulare gegen sie arbeiten können.
  information_gap: Welche Altformulare und Berechtigungen werden später noch gegen Eva lesbar bleiben?
  pressure_clock: Wenn Eva hier vorschnell handelt oder zögert, bleibt Nora entweder offen im System oder wird zu früh gewarnt.
  beziehungsdruck: Eva braucht Schutz ohne Verdachtsgestus; Petra braucht Sauberkeit; Simon und Nora würden einen überstürzten Ausschluss als Panik lesen.
  coreAction: Petra zeigt die alte Vollmacht und erklärt neue Vorsichtsmaßnahmen. Eva streicht Nora noch nicht offiziell, weil sie den offenen Kanal erst sehen und Nora nicht warnen will.
  false_reading: Formalität müsste Eva hier eigentlich absichern, wenn alle sauber arbeiten.
  dramaticBeat: Petra fragt sachlich, warum Nora in älteren Unterlagen noch immer als Berechtigte auftaucht.
  reversal: Genau der formale Schutzraum zeigt, wie lange alte Formalität schon gegen Eva mitläuft.
  konkrete_folge: Eva wird formell beobachtbarer, ohne dass Nora schon sichtbar verloren hätte; offizielles Zögern verhindert plotbequemen Sofortausschluss.
  cost: Eva kann Nora noch nicht sauber und sofort aus dem System schneiden.
  status_shift: Petra verschiebt die Lage in ein beobachtetes Verfahren; Nora bleibt vorerst formal mitschreibbar.
  ending: Auf dem Rückweg sieht Eva Nora mit Milas gebasteltem Fensterbild.
  ending_type: Social Reframe
  new_question: Wie viele Dinge trägt Nora schon so selbstverständlich mit sich, dass niemand sie mehr als Überschreitung liest?
  bad_version_risk: Die Szene würde schwach, wenn Petra bürokratisch-böse wirkt oder der Sofortausschluss plotbequem alles löst.
  revision_focus: Petra professionell halten, Schrift als doppelte Waffe zeigen und Noras Fensterbild als stillen Nachdruck setzen.
  proof_object: Frühere Vollmacht
  beweisobjekt: Frühere Vollmacht
  alltagswaffe: Schriftform als Glaubwürdigkeitsfilter
  setup: CF003, CF004, OT001, OT002, OT005
```

#### Kapitel 6: „Verlegt"
```
Scene Card
  id: SC_1_6
  pov: EVA
  ort: Wohnung / Kinderarztpraxis / Supermarkt
  uhrzeit: Mittag bis früher Abend
  ziel: Zeigen, dass der Eingriff nicht auf die Kita begrenzt ist.
  reader_pulse: Wie viele banale Spuren ergeben zusammen bereits einen zweiten Alltag?
  main_question: Wie viele banale Spuren ergeben zusammen bereits einen zweiten Alltag?
  objective: Eva will prüfen, ob auch andere Alltagsstellen berührt sind.
  szenenantrieb: Eva will den Vorfall auf die Kita begrenzen und riskiert, dass stattdessen ein zweiter Tageslauf sichtbar wird.
  scene_promise: Eva will den Vorfall auf die Kita begrenzen, prüft andere Alltagsstellen und verliert den Trost des Einzelereignisses, aber der zweite Tageslauf greift bereits über mehrere Systeme.
  wissensgrenze: Eva erkennt eine Ausweitung, kennt aber noch nicht die Systematik.
  information_gap: Über welche Kette wurden Arzt, Rezept und Supermarkt schon in Noras Zugriff gezogen?
  pressure_clock: Wenn Eva die Ausweitung nicht schnell begreift, wird aus dem Kita-Vorfall ein umfassendes Alltagssystem gegen sie.
  beziehungsdruck: Eva braucht von Simon gemeinsames Faktensammeln; Simon hilft, ohne sich schon auf ihre Deutung festzulegen.
  coreAction: Ein Arzttermin ist verschoben, ein Rezept schon abgeholt, eine Kassiererin verwechselt Eva mit „gestern mit Mila“.
  false_reading: Vielleicht sind diese Spuren bloß verstreute Missverständnisse und keine zusammenhängende Struktur.
  dramaticBeat: Simon ruft selbst in der Praxis an und bestätigt wenigstens die Terminverschiebung.
  reversal: Aus losem Verdacht wird ein Fremdeingriff, den Simon erstmals selbst mitprüft.
  konkrete_folge: Simon erlebt erstmals einen überprüfbaren Fremdeingriff, bleibt aber vorsichtig; Evas Isolation wird dadurch glaubwürdiger statt kleiner.
  cost: Eva verliert die Möglichkeit, das Problem lokal auf die Kita zu begrenzen.
  status_shift: Simon rückt einen Schritt näher an Evas Wahrnehmung, ohne ihr schon voll zu folgen.
  ending: Simon fragt, ob Eva ganz sicher sei, sich nicht zu täuschen.
  ending_type: Moral Reframe
  new_question: Wenn selbst überprüfbare Fremdspuren Simon nicht kippen lassen, was muss noch passieren, damit er Eva glaubt?
  bad_version_risk: Die Szene würde schwach, wenn sie nur weitere Merkwürdigkeiten sammelt, aber Simons überprüfenden Anruf und den Preis seiner Vorsicht nicht spürbar macht.
  revision_focus: Die Kumulierung klein halten, aber kausal; Horror über Verdichtung, nicht über Spektakel.
  proof_object: Verschobener Arzttermin und abgeholtes Rezept
  beweisobjekt: Verschobener Arzttermin und abgeholtes Rezept
  ersetzungsmoment: Ein zweiter Tageslauf existiert neben Evas eigenem
  setup: CF005, CF006, OT001, OT003, OT004
```

#### Kapitel 7: „Stabil"
```
Scene Card
  id: SC_1_7
  pov: EVA
  ort: Simon Wohnung / Spielplatz davor
  uhrzeit: später Nachmittag
  ziel: Simon als vernünftige, gefährliche Schutzlogik bauen.
  reader_pulse: Was verliert Eva konkret, wenn Simon vernünftig handelt?
  main_question: Was verliert Eva konkret, wenn Simon vernünftig handelt?
  objective: Eva will Simon auf ihre Seite holen.
  szenenantrieb: Eva will Simon als Schutzmacht gewinnen und riskiert, dass seine Mila-Logik Nora noch plausibler macht.
  scene_promise: Eva will Simon als Schutzmacht gewinnen, sucht seine Rückendeckung und verliert direkten Alltagszugriff, aber Simons Vernunft baut Nora ungewollt mit auf.
  wissensgrenze: Eva ahnt noch nicht, wie sehr Simon Wiederholung schon als Stabilität liest.
  information_gap: Wie weit hat Simon Wiederholung bereits mit Sicherheit verwechselt?
  pressure_clock: Wenn Simon jetzt Ruhe über Wahrheit stellt, verschiebt sich die Mutterrolle praktisch gegen Eva.
  beziehungsdruck: Eva braucht Glauben; Simon braucht Ruhe für Mila; Nora braucht nur einen kleinen glaubwürdigen Auftritt.
  coreAction: Simon macht Mila ein Abendbrot, legt ihr die Socken für morgen bereit und spricht mit Eva über eine vorübergehend klarere Bring- und Holstruktur.
  false_reading: Eine Woche klare Linie klingt wie fürsorgliche Übergangslogik, nicht wie Entzug.
  dramaticBeat: Nora erscheint ruhig am Spielplatz, Mila begrüßt sie mit geübter Selbstverständlichkeit.
  reversal: Simons vernünftiger Schutzrahmen macht Nora im selben Moment noch plausibler.
  konkrete_folge: Simon schlägt vor, vorerst alle Abholungen selbst zu übernehmen; Eva verliert direkten Alltagszugriff, nicht aus Bosheit, sondern aus Schutzlogik.
  cost: Eva verliert Mila nicht juristisch, aber praktisch aus dem täglichen Zugriff.
  status_shift: Simon wird zum stabilen Hauptkanal; Eva rutscht in die Position des Risikos.
  ending: Simon sagt, eine Woche klare Linie könne Mila beruhigen.
  ending_type: Access Loss
  new_question: Wenn Simon jetzt schon den Alltag an sich zieht, wie schnell kann Nora sich in diesem neuen System festsetzen?
  bad_version_risk: Die Szene würde schwach, wenn Simon kalt-bösartig klingt statt plausibel fürsorglich und gerade deshalb gefährlich.
  revision_focus: Schutzlogik teuer machen, Nora sozial plausibel halten und Milas Selbstverständlichkeit nicht sentimentalisieren.
  proof_object: Simons Vorschlag einer klaren Bring- und Holstruktur
  alltagswaffe: Stabilität wirkt glaubwürdiger als Erschöpfung
  false_friend_signal: Nora entschuldigt sich dafür, „gerade unpraktisch im Weg“ zu sein, bleibt aber stehen
  setup: CF004, CF005, CF008, OT003, OT004
```

#### Kapitel 8: „Die Akte über Nora"
```
Scene Card
  id: SC_1_8
  pov: EVA
  ort: Café / Handyrecherche / Polizeidienststelle
  uhrzeit: Abend
  ziel: Nora als Gefahr konkret machen, ohne sie schon zu entzaubern.
  reader_pulse: Was ist gefährlicher als offene Feindseligkeit? Eine Frau mit Aktenlogik.
  main_question: Was ist gefährlicher als offene Feindseligkeit? Eine Frau mit Aktenlogik.
  objective: Eva will eine harte Linie finden, die ihren Verdacht legitimiert.
  szenenantrieb: Eva will aus Bauchgefühl eine belastbare Verdachtslinie machen und riskiert, dass gerade das lückenhafte Wissen Nora realistischer macht.
  scene_promise: Eva will aus Bauchgefühl eine belastbare Verdachtslinie machen, sucht externe Bestätigung und gewinnt eine gefährlichere Lesart, aber gerade das bruchstückhafte Wissen macht Nora realistischer statt kleiner.
  wissensgrenze: Eva ahnt Verwaltungslogik, aber weder Motiv noch vollen Plan.
  information_gap: Welche frühere Erfahrung erklärt Noras Gegenwartslogik, ohne sie schon psychologisch fertig zu machen?
  pressure_clock: Wenn Eva hier keine belastbare Lesart findet, bleibt Nora sozial nur die lästige Helferin.
  beziehungsdruck: Eva braucht von außen einen Satz, der ihren Verdacht trägt; die Außenwelt gibt ihr nur Splitter.
  coreAction: Eine frühere Bekannte aus dem Beratungsumfeld nennt keinen Fall, aber dieselbe Logik: Bei Nora wirkte immer alles sauberer als auf der anderen Seite.
  false_reading: Nora könnte nur übergriffige Hilfsbereitschaft sein und nicht gezielte Gefahr.
  dramaticBeat: Nicht ein offizielles Dokument, sondern die Wiederholung eines alten Urteils trifft Eva.
  reversal: Eva sucht harte Aktenlinie und findet stattdessen eine gefährlichere soziale Logik.
  konkrete_folge: Nora wird für Eva zur gezielten Gegnerin, nicht mehr zur bloß aufdringlichen Helferin; Evas Blick auf frühere Hilfe kippt.
  cost: Eva verliert die bequeme Lesart einer bloß nervigen Freundin.
  status_shift: In Evas Kopf steigt Nora zur strukturellen Gegnerin auf; Hilfe wird rückwärts verdächtig.
  ending: Zuhause steht Milas gespülte Brotdose auf Evas Ablage, obwohl Mila seit morgens bei Simon ist.
  ending_type: Object Intrusion
  new_question: Wenn Nora sogar Abwesenheit nachbearbeitet, wie lange ordnet sie Evas Alltag schon rückwärts mit?
  bad_version_risk: Die Szene würde schwach, wenn sie Nora mit einer bequemen Enthüllung erklärt statt ihre Logik nur schärfer und bedrohlicher zu machen.
  revision_focus: Splitter statt Exposé; der Brotdosen-Schlag muss härter sitzen als jede Recherche-Info.
  proof_object: Indirekter Hinweis auf früheren Sorgekonflikt
  beweisobjekt: Indirekter Hinweis auf früheren Sorgekonflikt
  ersetzungsmoment: Nora verwertet Abwesenheit nach
  setup: CF007, OT002, OT004, OT005
```

#### Kapitel 9: „Der Ersatzschlüssel"
```
Scene Card
  id: SC_1_9
  pov: EVA
  ort: Wohnung / Keller / Hausflur
  uhrzeit: später Abend
  ziel: Physischen Zugriff plausibel machen und zugleich begrenzen.
  reader_pulse: Wie spät ist Grenzziehung, wenn längst nicht mehr der Schlüssel das Hauptproblem ist?
  main_question: Wie spät ist Grenzziehung, wenn längst nicht mehr der Schlüssel das Hauptproblem ist?
  objective: Eva will prüfen, ob Nora noch mehr Zutritt hatte, als sie zugibt.
  szenenantrieb: Eva will physischen Zutritt ausschließen und riskiert, dass der Schlosswechsel nur zeigt, wie spät sie reagiert.
  scene_promise: Eva will physischen Zutritt kappen, durchsucht Keller und Unterlagen und gewinnt eine konkrete Grenze, aber der Fund zeigt, wie spät sie erst reagiert.
  wissensgrenze: Eva weiß, dass es früher legitimen Zutritt gab, nicht aber, was davon längst kopiert wurde.
  information_gap: Was blieb von früherem Zutritt übrig, selbst wenn der Schlüssel heute gewechselt wird?
  pressure_clock: Wenn Eva jetzt keine Grenze zieht, bleibt körperlicher Zugriff als stille Reserve im Raum.
  beziehungsdruck: Eva will Grenzen nachziehen; Nora lässt selbst diese Grenzziehung übertrieben wirken.
  coreAction: Eva durchsucht Schlüsselbrett, Notfallmappe und Umzugskisten und wechselt noch in derselben Nacht den Schließzylinder.
  false_reading: Ein Schlosswechsel könnte das Problem scheinbar lösen, wenn der Schlüssel der Hauptkanal wäre.
  dramaticBeat: Das beschriftete Reservesäckchen im Keller wurde einmal geöffnet und neu verknotet.
  reversal: Der Schutzakt belegt nicht Sicherheit, sondern nachträglich, wie real der frühere Zugriff schon war.
  konkrete_folge: Künftiger physischer Zugriff wird gekappt; das zwingt Nora später stärker über soziale und institutionelle Kanäle zu gehen.
  cost: Eva merkt, dass eine späte materielle Grenze die bereits kopierten Routinen nicht zurückholt.
  status_shift: Nora verliert physischen Spielraum, behält aber soziale und institutionelle Waffen.
  ending: Nora fragt im Flur freundlich, ob bei Eva auch seit Tagen das Schloss klemme.
  ending_type: Quiet Countermove
  new_question: Wenn der Schlüssel nicht mehr die Hauptwaffe ist, über welche ruhigeren Kanäle wird Nora nun weitergehen?
  bad_version_risk: Die Szene würde schwach, wenn der Schlosswechsel wie Sieg wirkt statt wie verspätete Schadensbegrenzung.
  revision_focus: Kein Einbruchsthriller; den geöffneten Beutel und Noras Flurfrage als leise Kälte setzen.
  proof_object: Reservesäckchen mit Ersatzschlüssel
  beweisobjekt: Reservesäckchen mit Ersatzschlüssel
  alltagswaffe: Hilfe beim Praktischen erzeugt Zutritt
  setup: CF004, CF006, OT002, OT005
```

#### Kapitel 10: „Elternabend"
```
Scene Card
  id: SC_1_10
  pov: EVA
  ort: Kita / Elternabendraum / alter Helferchat
  uhrzeit: zwei Tage später, 19:30 Uhr
  ziel: Den sozialen Raum gegen Eva kippen und Noras Vorabwissen plausibilisieren.
  reader_pulse: Wie wird aus Elternorganisation eine stille Waffe?
  main_question: Wie wird aus Elternorganisation eine stille Waffe?
  objective: Eva will dort erscheinen, wo Normalität ihre Verlässlichkeit zeigen müsste.
  szenenantrieb: Eva will Präsenz zurückgewinnen und riskiert, dass Nora über zurückgelassene Kommunikationsreste mehr Zugehörigkeit ausstrahlt als sie.
  scene_promise: Eva will im Elternraum Präsenz zurückgewinnen, erscheint sichtbar und verliert soziale Selbstverständlichkeit, aber Nora besetzt Zugehörigkeit über alte Kommunikationsreste.
  wissensgrenze: Eva vermutet einen sozialen Kanal, kennt ihn aber noch nicht.
  information_gap: Über welchen alten Helfer- oder Elternkanal sitzt Nora noch in der laufenden Organisation?
  pressure_clock: Wenn Nora im Elternraum weiter als praktische Selbstverständlichkeit auftritt, wird Evas Misstrauen wie soziale Überreaktion lesbar.
  beziehungsdruck: Eva will vor anderen Eltern stabil wirken; der Raum liest Instabilität schnell, praktische Hilfe dagegen sofort positiv.
  coreAction: Petra spricht den vorläufigen Waldtag an, legt kurz eine Helferliste und Regenhinweise auf den Beistelltisch, und gleichzeitig ploppt im alten Elternhelferchat eine Rückfrage zu Gummistiefeln auf, in dem Nora nie entfernt wurde.
  false_reading: Elternorganisation wirkt harmlos, solange niemand den alten Kommunikationsrest als Machtkanal liest.
  dramaticBeat: Noch während Eva im Raum sitzt, schreibt Nora, sie habe eine Regenhose für Mila schon bereitgelegt.
  reversal: Aus Elternorganisation wird im selben Moment ein stiller Dominanzzug gegen Eva.
  nora_moral_riss: Nora bewertet Vorbereitung höher als Spontaneität. Für sie ist Vorsorge bereits Liebe.
  konkrete_folge: Eva erkennt eine reale Quelle für Noras Vorabwissen; der Elternraum kippt sozial gegen sie, ohne dass Nora magisch allwissend wirkt.
  cost: Eva verliert auch im Elternraum Normalität und mühelose Zugehörigkeit.
  status_shift: Praktische Entlastung macht Nora sozial größer; Eva wirkt im selben Raum angespannter und erklärungsbedürftiger.
  ending: Vor Evas Tür liegt die gefaltete Regenhose.
  ending_type: Object Intrusion
  new_question: Wie viele scheinbar praktischen Lösungen wird Nora noch vor Eva in den Alltag legen können?
  bad_version_risk: Die Szene würde schwach, wenn der Elternraum boshaft oder mobbig wird statt kühl-praktisch und gerade deshalb gefährlich.
  revision_focus: Helferchat, Vorabwissen und Regenhose als eine Linie lesen; kein Sozialdrama aufblasen.
  proof_object: Vorabwissen zum Waldtag über alten Helferchat
  beweisobjekt: Vorabwissen zum Waldtag über alten Helferchat
  false_friend_signal: praktische Entlastung als Dominanz
  setup: CF003, CF004, OT002, OT004, OT005
```

#### Kapitel 11: „Die Stimme"
```
Scene Card
  id: SC_1_11
  pov: EVA
  ort: Wohnung / Handy / Innenhofbank
  uhrzeit: Nacht
  ziel: Die stimmliche Plausibilität der falschen Abholung alltagsrealistisch erklären.
  reader_pulse: Wie viel von Eva hat Nora gesammelt, ohne dass es auffiel?
  main_question: Wie viel von Eva hat Nora gesammelt, ohne dass es auffiel?
  objective: Eva will verstehen, warum die Erzieherinnen sich so sicher mit dem Wiedererkennen waren.
  szenenantrieb: Eva will die stimmliche Gewissheit entkräften und riskiert, dass gesammelte Intimität schlimmer wirkt als Technik.
  scene_promise: Eva will die stimmliche Gewissheit entkräften, durchsucht alte Aufnahmen und verliert die Entlastung eines technischen Tricks, aber missbrauchte Vertrautheit macht Nora noch näher.
  wissensgrenze: Eva weiß, dass Nora keine Hightech braucht, aber noch nicht alle Quellen ihrer Alltagssätze.
  information_gap: Welche alltäglichen Sprachreste und Wiederholungen hat Nora über Jahre von Eva gesammelt?
  pressure_clock: Wenn Eva diese Quelle nicht versteht, bleibt Noras Wiedererkennen wie Magie statt wie nachvollziehbarer Alltagseingriff.
  beziehungsdruck: Eva kämpft gegen die Erkenntnis, wie oft sie selbst Material geliefert hat.
  coreAction: Eva hört alte Voicemails, Hofvideos und Weiterleitungsnachrichten ab.
  false_reading: Eine so präzise Imitation müsste technisch oder außergewöhnlich raffiniert erzeugt worden sein.
  dramaticBeat: In einer alten Aufnahme bittet Nora sie, einen Kita-Satz „nur kurz noch einmal“ zu sagen.
  reversal: Aus möglicher Technik wird rückwirkend gesammelte Harmlosigkeit als Waffe.
  konkrete_folge: Aus Noras Nähe wird eine nachvollziehbare Stimmquelle; die falsche Abholung wirkt nicht mehr wie Wundertrick, sondern wie missbrauchte Harmlosigkeit.
  cost: Eva verliert den Trost, dass das Ganze nur mit besonderem Trick möglich gewesen wäre.
  status_shift: Nora rückt von unheimlicher Ausnahme zu alltagsnaher, geduldiger Sammlerin auf.
  ending: Im Abholprotokoll steht genau einer dieser kurzen Sätze.
  ending_type: Proof Turn
  new_question: Wenn Nora sogar Evas Satzreste archiviert hat, welche anderen Mikrospuren von ihr benutzt sie noch?
  bad_version_risk: Die Szene würde schwach, wenn sie wie Tech-Thriller klingt statt wie missbrauchte Nähe und Wiederholung.
  revision_focus: Sprachreste, Stimme und Harmlosigkeit zusammenführen; keine Technikmystik aufbauen.
  proof_object: Alte Sprachnachricht mit Originalsatz
  beweisobjekt: Alte Sprachnachricht mit Originalsatz
  alltagswaffe: Vertrautheit wird zur Stimmvorlage
  setup: CF004, CF006, OT001, OT002
```

#### Kapitel 12: „Ein guter Vorschlag"
```
Scene Card
  id: SC_1_12
  pov: EVA
  ort: Telefonate / Simon Küche / Hof
  uhrzeit: nächster Morgen
  ziel: Noras Hilfe in offizielle Vernunft umcodieren.
  reader_pulse: Wann klingt Hilfe so vernünftig, dass sie zur Ersetzung wird?
  main_question: Wann klingt Hilfe so vernünftig, dass sie zur Ersetzung wird?
  objective: Eva will verhindern, dass Hilfe zur Standardmaßnahme wird.
  szenenantrieb: Eva will Noras Hilfe aus dem offiziellen Alltag fernhalten und riskiert, dass Simons pragmatischer Plan sie weiter legitimiert.
  scene_promise: Eva will Nora aus dem offiziellen Alltag fernhalten, wehrt sich gegen Simons Halblösung und verliert formale Deutungshoheit, aber genau der vernünftige Vorschlag normalisiert Nora weiter.
  wissensgrenze: Eva ahnt, dass Simons Halblösung Nora eher festschreibt als stoppt.
  information_gap: Wie tief kann Nora sich über brauchbar klingende Organisation in den Alltag einschreiben?
  pressure_clock: Wenn Noras Hilfe jetzt als saubere Übergangslogik eingeführt wird, kippt Ersatz in Routine.
  beziehungsdruck: Eva braucht Schutz ohne Formalisierung Noras; Simon will Mila sichern und handhabbar bleiben.
  coreAction: Simon schlägt vor, dass Nora bei echten Engpässen einspringen könne, aber nie ohne direkte Bestätigung allein übernehme.
  false_reading: Der Vorschlag klingt wie vernünftige Risikobegrenzung und nicht wie Formalisierung einer Ersatzmutter.
  dramaticBeat: Das klingt vernünftig genug, um Eva schrill wirken zu lassen, obwohl sie die Gefahr klarer sieht.
  reversal: Die scheinbar saubere Schutzlösung arbeitet faktisch für Nora.
  mila_kindmoment: Mila fragt am Telefon, ob „Nora-Montag“ jetzt wieder gilt, als nenne sie etwas so Alltägliches wie Pfannkuchentag.
  nora_moral_riss: Nora hält Wiederholung für Sicherheit. Nicht die richtige Mutter zählt, sondern die verlässliche.
  konkrete_folge: Nora wird organisatorisch normalisiert; Mila benennt die Ersatzroutine selbst.
  cost: Eva verliert nicht nur Einfluss, sondern die Definitionsmacht darüber, was Hilfe noch ist.
  status_shift: Simon stärkt Nora als handhabbaren Reservekanal; Mila bestätigt diese Logik bereits sprachlich.
  ending: Eva merkt, dass sie nun gegen ein brauchbar klingendes Modell kämpft.
  ending_type: Social Reframe
  new_question: Wie stoppt Eva ein Modell, das von außen vernünftiger klingt als ihre eigene Warnung?
  bad_version_risk: Die Szene würde schwach, wenn Simon melodramatisch oder Nora offen triumphierend wirkt statt organisatorisch plausibel.
  revision_focus: Die Vernunft der Halblösung teuer machen; Milas Satz soll härter sein als jede Erklärung.
  proof_object: Simons Halblösung plus Milas „Nora-Montag“
  alltagswaffe: Vorschläge klingen unschuldig, sobald sie organisatorisch sauber sind
  setup: CF004, CF005, CF008, OT003, OT004
```

#### Kapitel 13: „Dienstagstasche"
```
Scene Card
  id: SC_1_13
  pov: EVA
  ort: Simon Wohnung / Kinderzimmer
  uhrzeit: Abend
  ziel: Die imitierte Mutterroutine körperlich sichtbar machen.
  reader_pulse: Wie nah kann eine zweite Mutterhand kommen, ohne bemerkt zu werden?
  main_question: Wie nah kann eine zweite Mutterhand kommen, ohne bemerkt zu werden?
  objective: Eva will Milas Sachen für den nächsten Tag packen und Kontrolle zurückgewinnen.
  szenenantrieb: Eva will über Milas Tasche wieder echte Mutterkontrolle gewinnen und riskiert, dass selbst dieser intime Handgriff doppelt geführt wird.
  scene_promise: Eva will über Milas Tasche Mutterkontrolle zurückholen, prüft Dinge und verliert Intimitätshoheit, aber gerade der kleinste Handgriff ist schon doppelt belegt.
  wissensgrenze: Eva ahnt tiefen Zugriff in Milas Alltagsgegenstände, aber noch nicht dessen Dauer.
  information_gap: Seit wann imitiert Nora nicht nur Abläufe, sondern Ton, Handschriftlogik und Taschendetails?
  pressure_clock: Wenn selbst Milas Tasche nicht mehr eindeutig Evas Raum ist, rückt Ersetzung an Milas Körper.
  beziehungsdruck: Eva braucht von Simon Alarm über das Falsche im Vertrauten; Simon liest lieber Kleinigkeiten.
  coreAction: In Milas Tasche liegen Dinge, die Eva nicht eingepackt hat, aber exakt ihrem Stil ähneln.
  false_reading: Es könnte sich um eine gut gemeinte Reserve oder ein harmloses Versehen handeln.
  dramaticBeat: Der Zettel ist in Evas Handschriftlogik formuliert, benutzt aber ein Wort, das nur Nora sagt.
  reversal: Aus vermeintlicher Kleinigkeitslogik wird ein präziser Imitationsbeweis im intimsten Alltagsraum.
  konkrete_folge: Die Ersetzung rückt von Institutionen an Milas Körper; Eva hat erstmals einen imitierenden Alltagsbeweis in der Hand.
  cost: Eva verliert die Sicherheit, dass Mutterhandgriffe im Kindssystem noch eindeutig ihre sind.
  status_shift: Nora rückt von Helferin zur imitierenden Parallelmutter auf; Simon bleibt zu klein lesend.
  ending: Im Treppenhaus spürt Eva, dass Simon glaubt, sie mache aus Kleinigkeiten zu viel.
  ending_type: Social Reframe
  new_question: Wenn selbst intime Routinen schon doppelt geführt werden, wie lange ist Nora Milas Alltag bereits körperlich nah?
  bad_version_risk: Die Szene würde schwach, wenn sie Dinge fetischisiert statt die fast perfekte Imitation und Simons Verkleinerung zusammen arbeiten zu lassen.
  revision_focus: Tasche, Zettel und Sprachverrutschung müssen den Schlag tragen; kein Symbol-Overkill.
  proof_object: Notizzettel in falscher Handschriftlogik
  beweisobjekt: Notizzettel in falscher Handschriftlogik
  ersetzungsmoment: Die imitierte Mutterroutine taucht an Milas Körper auf
  setup: CF005, CF006, OT001, OT003, OT004
```

#### Kapitel 14: „Protokoll"
```
Scene Card
  id: SC_1_14
  pov: EVA
  ort: Küchentisch / Laptop / Homeoffice-Drucker
  uhrzeit: tiefe Nacht
  ziel: Eva vom Schock in eine aktive Gegenordnung bringen und den Druckerfund plausibilisieren.
  reader_pulse: Was sieht Eva erst, als sie die Lage sauber ordnet?
  main_question: Was sieht Eva erst, als sie die Lage sauber ordnet?
  objective: Eva will alle Vorfälle erstmals chronologisch fassen.
  szenenantrieb: Eva will das Chaos in Reihenfolge zwingen und riskiert, dass die Ordnung das Muster härter macht als jedes Gefühl.
  scene_promise: Eva will Chaos in Reihenfolge zwingen, baut eine Chronologie und gewinnt Struktur, aber gerade diese Ordnung zeigt, wie tief Nora in denselben Verwaltungsresten sitzt.
  wissensgrenze: Eva sieht die Struktur, hat aber noch keinen endgültigen Begriff für Noras Plan.
  information_gap: Welche Materialreste verbinden Evas Gegenordnung direkt mit Noras altem Zugriff?
  pressure_clock: Wenn Eva ihre Vorfälle nicht ordnet, bleibt alles Gefühl; wenn sie sie ordnet, wird das Muster unwiderstehlich hart.
  beziehungsdruck: Eva braucht für sich selbst eine Form von Gegenmacht; Nora bleibt abwesend und trotzdem in jedem Eintrag wirksam.
  coreAction: Eva erstellt ihre Chronologie und druckt sie für Petra aus.
  false_reading: Ordnung könnte Eva endlich beruhigen und die Lage sauberer statt schlimmer machen.
  dramaticBeat: Der Drucker zieht die Rückseite eines alten, liegengebliebenen Testdrucks ein: ein halb abgeschnittener Helferlisten-Rest mit Noras Markierungen und demselben Farbcode, den Eva gerade verwendet. In der Queue steht ein älterer Druckauftrag unter einem damals legitim angelegten Profil.
  reversal: Aus Evas Gegenordnung wird der Beweis, dass selbst derselbe Verwaltungsraum schon von Nora vorbenutzt wurde.
  konkrete_folge: Eva erkennt, dass selbst ihre Gegenordnung an dieselben Verwaltungsreste stößt; der Druckerfund bleibt zufällig und materiell, nicht wie eine perfekte Botschaft.
  cost: Eva verliert auch in ihrer Ordnung den Trost, außerhalb von Noras Restspuren zu arbeiten.
  status_shift: Eva wird handlungsfähiger, aber Nora bleibt zugleich als frühere Mitnutzerin desselben Systems materialisiert.
  ending: Evas Liste und Noras alte Markierung liegen plötzlich auf derselben Seite.
  ending_type: Proof Turn
  new_question: Wenn sogar Evas Gegenordnung auf Noras alte Spuren trifft, welcher Raum war je wirklich unberührt?
  bad_version_risk: Die Szene würde schwach, wenn sie wie Fleiß oder Genialdetektivarbeit wirkt statt wie harte, zufällige Materialkonvergenz.
  revision_focus: Chronologie als Gegenmacht bauen und den Druckerfund klein, unanständig und materiell halten.
  proof_object: Eigenes Chronologie-Protokoll plus alter Druckrest
  beweisobjekt: Eigenes Chronologie-Protokoll plus alter Druckrest
  alltagswaffe: Ordnung gegen Verwischung
  setup: CF006, OT001, OT002, OT005
```

#### Kapitel 15: „Der falsche Nachmittag"
```
Scene Card
  id: SC_1_15
  pov: EVA
  ort: Kita / Wohnung / Simon Auto
  uhrzeit: Freitag
  ziel: Act 1 mit einem plausiblen, kalten Kontrollverlust schließen.
  reader_pulse: Wie weh tut Schutz, wenn er vernünftig klingt?
  main_question: Wie weh tut Schutz, wenn er vernünftig klingt?
  objective: Eva will Petra mit ihrer Chronologie erreichen, bevor Simon eine Übergangsregel erweitert.
  szenenantrieb: Eva will ihre Chronologie rechtzeitig in institutionelle Wirkung übersetzen und riskiert, dass Simon aus Sorge die Alltagshoheit vor ihr verschiebt.
  scene_promise: Eva will ihre Chronologie rechtzeitig wirksam machen, sucht institutionelles Tempo und verliert direkten Zugriff auf Mila, aber Simons Schutzlogik baut Nora die entscheidende Lücke.
  wissensgrenze: Eva weiß, dass Petra sie ernster nimmt, aber nicht schnell genug handeln kann.
  information_gap: Reicht Petras spätes Ernstnehmen noch, oder ist Simons Schutzlogik bereits schneller als jeder formale Schritt?
  pressure_clock: Wenn das Wochenende ohne formale Sicherung beginnt, verschiebt sich Alltagshoheit sofort praktisch gegen Eva.
  beziehungsdruck: Eva braucht von Petra Tempo und von Simon Vertrauen; Simon braucht einen scheinbar sicheren Mila-Alltag.
  coreAction: Petra nimmt die Liste ernst, kann aber vor dem Wochenende nichts formell ändern. Simon weitet ein ohnehin geplantes Umgangswochenende aus und sagt, Mila bleibe bis zur Klärung einige Tage mehr bei ihm.
  false_reading: Wenn die Kita ernsthafter hinschaut, müsste die Lage sich eigentlich zugunsten Evas stabilisieren.
  dramaticBeat: Nicht die Kita, sondern Simon nimmt Eva den direkten Alltagszugriff, weil ihm ihre Lage zu instabil erscheint.
  reversal: Evas stärkster ordnender Zug endet nicht in Schutz, sondern in vernünftigem Kontrollverlust.
  konkrete_folge: Eva verliert den unmittelbaren Zugriff auf Milas nächste Woche; Nora braucht gar keinen formellen Sieg, weil Simon die Lücke selbst baut.
  cost: Eva verliert den direkten Zugriff auf Milas Alltag für die nächste Woche.
  status_shift: Simon wird zum entscheidenden Schutz- und Filterkanal; Nora muss nur im entstandenen Leerraum stehen.
  ending: Als Simon mit Mila wegfährt, hebt Mila den gelben Becher ans Fenster. Erst als der Wagen an der Hofausfahrt ist, tritt Nora mit einer Bäckertüte aus dem Seiteneingang und schaut ihm einen Moment nach.
  ending_type: Access Loss
  new_question: Was macht Nora mit dem offenen Alltag, den Simon nun aus Schutzgründen gegen Eva gebaut hat?
  bad_version_risk: Die Szene würde schwach, wenn sie als Verwaltungsbeschluss endet statt als kalter Alltagsentzug mit Noras stiller Anwesenheit.
  revision_focus: Act-Ende über direkten Zugriffsverlust, gelben Becher und Noras leisen Nachblick tragen; keine Zusatz-Erklärung.
  proof_object: Chronologie-Protokoll plus gelber Becher im Autofenster
  endzustand_hook: Der Act muss auf direktem Kontrollverlust plus Noras stiller Anwesenheit enden, nicht auf einem administrativen Beschluss.
  payoff: OT003
  setup: CF005, CF008, OT001, OT003, OT004
```

---

### ACT 2 — „Die Probe"
> Eröffnungs-Dokument: SMS Simon an Eva: „Bis wir wissen, was hier läuft, brauche ich bei Mila eine klare Linie.“

#### Kapitel 16: „Die Woche bei Simon"
```
Scene Card
  id: SC_2_1
  pov: EVA
  ort: leere Wohnung / Büro / Sprachnachrichten
  uhrzeit: Montagmorgen
  ziel: Eva in Distanz setzen und den Filterkanal plausibel zeigen.
  reader_pulse: Was passiert mit Mutterrolle, wenn jeder Kontakt nur noch vermittelt ankommt?
  main_question: Was passiert mit Mutterrolle, wenn jeder Kontakt nur noch vermittelt ankommt?
  objective: Eva will trotz Milas Abwesenheit handlungsfähig bleiben.
  szenenantrieb: Eva organisiert sich über Arbeit und Nachrichten und riskiert, dass selbst Milas Beruhigung schon über fremde Deutung läuft.
  scene_promise: Eva will trotz Distanz handlungsfähig bleiben, organisiert sich über Arbeit und Nachrichten und verliert direkten Mutterzugriff, aber Nora wird über Simon zum ruhigen Vermittlungskanal.
  wissensgrenze: Eva weiß, dass Nora in Simons System tiefer steckt als zuvor.
  information_gap: Wie tief läuft Nora in Simons Tagesordnung und Kommunikationsstruktur schon mit?
  pressure_clock: Wenn Simon Nora weiter als ruhigen Kanal mitführt, wird Evas Mutterrolle nur noch vermittelt und gefiltert lesbar.
  beziehungsdruck: Eva braucht direkten Zugang zu Mila; Simon filtert aus Schutz; Nora füllt die Lücke mit Selbstverständlichkeit.
  coreAction: Simon schickt Eva eine neutrale Frühstücksaufnahme von Mila, bedankt sich im gleichen Verlauf bei Nora für das extra Pausenbrot und leitet später lieber Noras beruhigende Sprachnachricht weiter, „damit Mila nicht wieder hochfährt“.
  false_reading: Simon organisiert bloß vernünftig und nutzt Nora nur vorübergehend als praktische Entlastung.
  dramaticBeat: Eva merkt, dass nicht die Kita Nora hineingelassen hat, sondern Simon sie als ruhigen Informationskanal mitführt.
  reversal: Der gefährlichste neue Kanal entsteht nicht in der Institution, sondern in Simons Schutzlogik.
  konkrete_folge: Nora materialisiert sich in Simons Telefon und Tagesablauf als Ersatzkontakt; Eva bekommt Mila nur noch vermittelt.
  cost: Eva verliert direkte Alltagsnähe zu Mila.
  status_shift: Simon wird zur Filterinstanz; Nora rückt vom Randkontakt zum vermittelnden Ersatzkanal auf.
  ending: Unter „Mila Schule/Kita“ steht Nora bereits als Notfallkontakt in Simons Handy.
  ending_type: Social Reframe
  new_question: Wenn Simon Nora schon technisch und organisatorisch mitführt, wie bekommt Eva diesen Kanal überhaupt wieder aus dem System?
  bad_version_risk: Die Szene würde schwach, wenn sie nur Leere zeigt und nicht den Preis des gefilterten Zugangs materialisiert.
  revision_focus: Distanz, Vermittlung und Simons ruhige Mitnahme Noras konkret halten; keine Trennungsszene daraus machen.
  proof_object: Notfallkontakt in Simons Handy
  ersetzungsmoment: Informationskanal statt direkter Nähe
  nora_kosten: Je stärker Nora über Simon läuft, desto mehr Zeugenmaterial entsteht später in seinem Verlauf.
  setup: CF004, CF005, OT003, OT004
```

#### Kapitel 17: „Gespeicherter Alltag"
```
Scene Card
  id: SC_2_2
  pov: EVA
  word_target_min: 1700
  word_target_max: 1950
  ort: Innenhof / Fenster / Waschküche / Cloud-Album / Küchentisch
  uhrzeit: Abend bis Nacht
  ziel: Beobachtung und digitalen Restzugriff zu einem gespeicherten Alltag bündeln.
  reader_pulse: Wie lange lebt Nora schon in Evas Alltag mit?
  main_question: Wie lange lebt Nora schon in Evas Alltag mit?
  objective: Eva will wissen, wie viel Nora nicht nur gesehen, sondern gespeichert hat.
  szenenantrieb: Eva will den Radius von Noras Wissen verstehen und riskiert, dass legale alte Freigaben die Bedrohung noch realer machen.
  scene_promise: Eva will den Radius von Noras Wissen verstehen, prüft Hof, Waschküche und Album und gewinnt einen Zugriffsnachweis, aber gerade legale Altfreigaben machen Nora noch realer.
  wissensgrenze: Eva weiß, dass Nora mitgelesen hat, aber noch nicht, wie viel archiviert wurde.
  information_gap: Wie viel von Evas altem Alltag liegt bei Nora nicht nur im Kopf, sondern als gespeichertes Material?
  pressure_clock: Solange alte Freigaben offen bleiben, kann Nora weiterhin aus früherem Vertrauen Gegenwart bauen.
  beziehungsdruck: Eva will Nora endlich als Archivarin ihres Alltags sehen; Nora muss dafür kaum noch aktiv handeln.
  coreAction: Vom Küchenfenster aus beobachtet Eva Noras stille Hofroutine, findet in der Waschküche alte Namensetiketten aus einer Beschriftungsphase wieder und stößt im Familienalbum auf einen nie entfernten Freigabelink, über den Nora Bilder, Kalenderfotos und Kita-Notizen sehen konnte.
  false_reading: Alte Freigaben und Etiketten könnten nur peinliche Altlasten sein und keine aktive Gefahr.
  dramaticBeat: Ein Screenshot von Evas alter Kita-Checkliste beweist keinen Einbruch, sondern liegengebliebenes Vertrauen.
  reversal: Aus dem Wunsch nach heimlichem Hack wird die härtere Wahrheit eines legal gespeicherten Alltags.
  mila_kindmoment: In einem alten Familienclip nennt Mila denselben Becher „der Montagbecher“, ein Wort, das eher nach Noras Ordnung als nach Evas Sprache klingt.
  konkrete_folge: Eva kappt erstmals aktiv Albumfreigaben, ändert Passwörter und schließt einen realen stillen Zugriff.
  cost: Eva verliert die Illusion, ihr alter Alltag sei nur Vergangenheit und nicht Noras Vorratslager.
  status_shift: Nora verliert einen stillen Digitalzugriff; Eva gewinnt erstmals einen echten Rückbauzug.
  ending: Eva begreift, dass Nora nicht nur die Gegenwart kopiert, sondern eine ältere Version von Eva gegen die jetzige verwendet.
  ending_type: Proof Turn
  new_question: Welche älteren Versionen von Eva nutzt Nora noch gegen die heutige Mutterrolle?
  bad_version_risk: Die Szene würde schwach, wenn sie wie Hackerkino oder Datenshow wirkt statt wie gespeicherte Nähe.
  revision_focus: Hofbeobachtung, Etiketten und Albumfreigabe als ein Vorratslager lesen; keine Digitalmystik.
  proof_object: Namensetiketten und alter Freigabelink
  endzustand_hook: Die Szene muss mit der Einsicht enden, dass gespeicherter Alltag Nora keine Magie gab, sondern ein altes, legales Vorratslager.
  beweisobjekt: Namensetiketten und alter Freigabelink
  nora_kosten: Nora verliert den alten Familienalbumzugang und muss später riskanter über Simon und Institutionen gehen.
  setup: CF004, CF006, OT001, OT002, OT005
```

#### Kapitel 18: „Die alte Mutter"
```
Scene Card
  id: SC_2_3
  pov: EVA
  ort: Beratungsstelle / Vorraum
  uhrzeit: später Vormittag
  ziel: Noras Wunde als Gefährdungslogik einführen.
  reader_pulse: Was will Nora wirklich zurückholen, wenn sie Mila nicht bloß „haben“ will?
  main_question: Was will Nora wirklich zurückholen, wenn sie Mila nicht bloß „haben“ will?
  objective: Eva will erfahren, was Nora in ihrem früheren Konflikt wirklich verlor.
  szenenantrieb: Eva sucht Motiv und Gefahrenspur und riskiert, dass Noras Wunde die Gegenwart noch schärfer macht.
  scene_promise: Eva will Motiv und Gefahrenspur lesen, sucht Noras Vergangenheit und gewinnt ein Motivfeld, aber dieses Motiv macht die Gegenwart noch schärfer statt milder.
  wissensgrenze: Eva darf Nora nicht psychologisch fertig erklären.
  information_gap: Welche Wunde treibt Nora an, ohne ihre heutige Gefahr billig zu entschuldigen?
  pressure_clock: Wenn Eva Noras Motiv nicht versteht, bleibt deren Eingriff für andere wie bloße Hilfsnähe lesbar.
  beziehungsdruck: Eva braucht einen Grund, Nora nicht nur als lästige Helferin zu lesen.
  coreAction: Eine frühere Mitarbeiterin sagt wenig, aber genug: Noras Problem war nie Lautstärke, sondern überkontrollierte Verlässlichkeit.
  false_reading: Mehr Motivwissen könnte Nora kleiner oder menschlich harmloser machen.
  dramaticBeat: Der Satz „Nach Aktenlage wirkte die andere Seite stabiler“ trifft Eva wie ein Echo ihrer eigenen Lage.
  reversal: Aus möglicher Entlastung wird eine präzisere Gefährdungslogik gegen Eva.
  konkrete_folge: Nora bekommt für Eva ein klares inneres Motivfeld; der Kampf heißt nun Mutterurteil statt Einzelvorfall.
  cost: Eva verliert die Möglichkeit, Nora als bloß lästige Einzelfallfigur zu lesen.
  status_shift: Der Konflikt verschiebt sich von Zugriff zu Deutungshoheit über Mutterschaft.
  ending: Eva versteht, dass Nora nicht nur Mila, sondern die Deutungshoheit über Mütter angreift.
  ending_type: Moral Reframe
  new_question: Wie baut Nora aus dieser alten Wunde eine neue, alltagsnahe Ersatzordnung gegen Eva?
  bad_version_risk: Die Szene würde schwach, wenn sie Nora therapeutisch erklärt statt ihre Logik nur schärfer und gefährlicher zu machen.
  revision_focus: Vergangenheit nur als Schärfung der Gegenwart verwenden; kein Psychologie-Exkurs.
  proof_object: Beratungsnotiz über stabile Bezugsperson
  beweisobjekt: Beratungsnotiz über stabile Bezugsperson
  setup: CF007, OT004, OT005
```

#### Kapitel 19: „Zugang"
```
Scene Card
  id: SC_2_4
  pov: EVA
  ort: Kita-Büro / Formularschrank
  uhrzeit: Mittag
  ziel: Administrativen Zugriff konkret und realistisch machen.
  reader_pulse: Wo endet freundliche Elternkultur und wo beginnt ein offenes System?
  main_question: Wo endet freundliche Elternkultur und wo beginnt ein offenes System?
  objective: Eva will herausfinden, wie Nora an Formulare, Listen und Fristen kam.
  szenenantrieb: Eva will den Weg von Verdacht zu Formularzugriff schließen und riskiert, dass die Kita selbst als Einfallstor sichtbar wird.
  scene_promise: Eva will den Weg zu Formularzugriff schließen, fragt Petra nach Prozessen und gewinnt einen plausiblen Kanal, aber dieser Kanal macht die Kita selbst zum Einfallstor.
  wissensgrenze: Eva kennt offene Elternkultur als Kanal, nicht aber den später wichtigen Ausflugszugriff.
  information_gap: Welche offenen Helfer- und Formularwege stehen zwischen guter Elternkultur und echtem Missbrauch?
  pressure_clock: Wenn die Kita den Zugriff nicht jetzt strukturell erkennt, bleiben Nora weitere Verwaltungsräume offen.
  beziehungsdruck: Eva braucht von Petra strukturelles Mitsehen; Petra muss einräumen, dass ihre Ordnung zu offen war.
  coreAction: Petra erklärt Helferlisten, Ausflugsmappen und alte Scanabläufe. Während des Gesprächs sieht Eva einen archivierten Druckjob unter Noras altem Helferprofil.
  false_reading: Offene Elternkultur ist sympathisch und organisatorisch praktisch, also ungefährlich.
  dramaticBeat: Petra räumt die offenen Mappen sofort weg und schließt den Schrank erstmals ab.
  reversal: Aus freundlicher Elternkultur wird im selben Moment ein sichtbares offenes System.
  konkrete_folge: Die Kita zieht ihre erste echte Gegenreaktion; Nora verliert einen informellen Verwaltungsraum.
  cost: Eva erkennt, dass selbst gut gemeinte Offenheit Mila angreifbar gemacht hat.
  status_shift: Petra wechselt von defensiver Formalität zu strukturellem Gegenhandeln; Nora verliert einen Zugang.
  ending: Petra sagt nicht „Wir glauben dir“, aber „Das bleibt ab jetzt nicht mehr offen liegen.“
  ending_type: Institutional Lock
  new_question: Welche Kanäle hat Nora noch, wenn der offenste Verwaltungsraum jetzt erstmals geschlossen wird?
  bad_version_risk: Die Szene würde schwach, wenn Petra schuldhaft oder dumm wirkt statt professionell und nachträglich erschrocken.
  revision_focus: Prozesse entzaubern statt dramatisieren; Druckhistorie und abgeschlossener Schrank genügen.
  proof_object: Druckhistorie am Multifunktionsgerät
  beweisobjekt: Druckhistorie am Multifunktionsgerät
  setup: CF003, CF004, OT001, OT002, OT005
```

#### Kapitel 20: „Der erste Fehler"
```
Scene Card
  id: SC_2_5
  pov: EVA
  ort: Simon Wohnung / Küche
  uhrzeit: Abend
  ziel: Nora objektiv stolpern lassen, ohne sie billig zu entzaubern.
  reader_pulse: Reicht ein kleiner Fehler, wenn alle Ruhe mit Kompetenz verwechseln?
  main_question: Reicht ein kleiner Fehler, wenn alle Ruhe mit Kompetenz verwechseln?
  objective: Eva will Simon einen harten kleinen Beweis geben.
  szenenantrieb: Eva beobachtet genau und riskiert, dass selbst dieser Fehler noch entschuldigt wird.
  scene_promise: Eva will Simon einen harten kleinen Beweis geben, beobachtet Nora genau und gewinnt einen Riss, aber derselbe Riss wird aus Vorsicht sofort wieder geglättet.
  wissensgrenze: Eva ahnt die erste echte Rissstelle, erwartet aber noch keinen Kipppunkt.
  information_gap: Reicht ein kleiner sachlicher Fehler, um Simons Schutzlogik endlich gegen Nora zu drehen?
  pressure_clock: Wenn sogar ein sichtbarer Fehler nur entschuldigt wird, wird Noras Ruhe weiter mit Kompetenz verwechselt.
  beziehungsdruck: Eva braucht Alarm statt Beruhigung; Simon will keine Welt akzeptieren, in der seine Schutzlogik Nora mitgebaut hat.
  coreAction: Nora bringt Mila Essen vorbei und stellt selbstverständlich Erdbeerjoghurt auf den Tisch, obwohl Mila ihn nicht verträgt.
  false_reading: Ein kleiner Versorgerfehler könnte bloß menschliches Versehen sein.
  dramaticBeat: Simon fragt zum ersten Mal scharf nach. Für einen Moment glaubt er Eva sichtbar mehr als Nora. Dann zieht er sich wieder auf die Erklärung zurück, Nora habe sich eben vertan.
  reversal: Der erste echte Riss reicht für einen Augenblick Glauben, aber noch nicht für dauerhaftes Kippen.
  mila_kindmoment: Mila schiebt die Schüssel weg und sagt nur: „Ich will den weißen wie immer.“
  nora_moral_riss: Als Nora den Fehler glättet, klingt es nicht nach schlechtem Gewissen, sondern nach dem festen Willen, dass ein geplanter Ablauf nicht an einem Gefühl scheitern darf.
  konkrete_folge: Simon erlebt seinen ersten echten Glaubensmoment und rudert aus Angst vor Instabilität zurück; Evas Einsamkeit wird teurer.
  cost: Eva verliert sogar im Moment des Beinahe-Glaubens wieder Boden.
  status_shift: Simon wankt erstmals sichtbar, stabilisiert sich aber noch einmal zugunsten der ruhigen Erklärung.
  ending: Simon schreibt später: „Es war nur ein Fehler.“
  ending_type: Quiet Countermove
  new_question: Was braucht es noch, wenn selbst ein sichtbarer Fehler Nora nicht dauerhaft entlastet?
  bad_version_risk: Die Szene würde schwach, wenn Nora plump dumm wirkt oder Simon hier schon vollständig kippt.
  revision_focus: Fehler klein halten, Simons kurzes Glauben teuer machen und Mila kindlich statt symbolisch führen.
  proof_object: Falscher Essensbezug plus hastige Korrektur
  beweisobjekt: Falscher Essensbezug plus hastige Korrektur
  setup: CF002, CF004, CF005, OT003
```

#### Kapitel 21: „Nicht jetzt"
```
Scene Card
  id: SC_2_6
  pov: EVA
  ort: Polizeidienststelle / Auto
  uhrzeit: später Abend
  ziel: Eva an die Grenze institutioneller Hilfe führen.
  reader_pulse: Wie hoch ist die offizielle Schwelle, wenn der reale Verlust längst da ist?
  main_question: Wie hoch ist die offizielle Schwelle, wenn der reale Verlust längst da ist?
  objective: Eva will den Fall von merkwürdig zu gefährlich heben.
  szenenantrieb: Eva legt Material vor und riskiert, dass die Schwelle weiter höher liegt als ihr realer Schaden.
  scene_promise: Eva will den Fall offiziell heben, legt Material vor und verliert weiteren Zugriff, aber die institutionelle Schwelle bleibt höher als ihr realer Schaden.
  wissensgrenze: Eva kennt das Muster, aber nicht dessen juristische Übersetzbarkeit.
  information_gap: Welche Form von Beweiskette braucht die Institution, bevor aus Unheimlichkeit Eingriff wird?
  pressure_clock: Wenn die Polizei jetzt nur auf Vorsicht verweist, wird Simon den Alltag noch stärker zentralisieren.
  beziehungsdruck: Eva braucht Rückenwind; die Institution liefert nur Vorsichtslogik, die Simon noch mehr Macht gibt.
  coreAction: Die Beamtin erkennt das Unheimliche, kann aber auf dieser Stufe kein Verfahren aufbauen.
  false_reading: Mehr Material müsste inzwischen reichen, damit die Institution aktiv wird.
  dramaticBeat: Statt einer Anzeige bekommt Eva den Rat, Mila aus offenen Zugriffslinien zu ziehen. Kurz darauf zentralisiert Simon noch mehr Übergaben und Kontakte bei sich.
  reversal: Der institutionelle Rat schützt formal Mila, schwächt aber praktisch Eva weiter.
  konkrete_folge: Simon wird offiziell der stabile Hauptkanal; Evas Zugriff schrumpft weiter, obwohl niemand sie offen verurteilt.
  cost: Eva verliert weiteren Alltagseinfluss genau durch den Rat, der Mila schützen soll.
  status_shift: Institution und Simon verstärken dieselbe Schutzlogik; Eva wird noch stärker zur Randfigur im Alltag.
  ending: Auf dem Parkplatz klebt ein Kinderaufkleber von Milas Brotdose an Evas Rücklicht.
  ending_type: Child Echo
  new_question: Wie soll Eva gegen Nora gewinnen, wenn sogar Vorsichtsmaßnahmen sie selbst weiter ausdünnen?
  bad_version_risk: Die Szene würde schwach, wenn die Polizei lächerlich oder bösartig wirkt statt begrenzt und dadurch fatal.
  revision_focus: Amtliche Begrenzung, Simons Folgereaktion und den Aufkleber als Rückkehr in den Körperraum verbinden.
  proof_object: Kinderaufkleber am Auto
  beweisobjekt: Kinderaufkleber am Auto
  setup: CF002, OT001, OT004, OT005
```

#### Kapitel 22: „Ersatzplan"
```
Scene Card
  id: SC_2_7
  pov: EVA
  ort: Büro / Schreibwarenladen / Wohnung
  uhrzeit: nächster Tag
  ziel: Eva wieder aktiv und strategisch machen.
  reader_pulse: Kann Eva den Alltag zurückerobern, ohne selbst paranoid zu wirken?
  main_question: Kann Eva den Alltag zurückerobern, ohne selbst paranoid zu wirken?
  objective: Eva will einen Gegenplan aufsetzen, der nicht über spontane Reaktion läuft.
  szenenantrieb: Eva will Nora aus vernetzten Kanälen schneiden und riskiert, dass jeder Schritt sie selbst angespannter wirken lässt.
  scene_promise: Eva will Noras Kanäle testen, baut eine kontrollierte Falle und gewinnt einen isolierten Verdachtskanal, aber der Treffer macht Simon fast sicher zum Leck.
  wissensgrenze: Eva ahnt einen oder mehrere Leckkanäle, aber noch nicht die volle Struktur.
  information_gap: Läuft Nora vor allem über Simon oder über mehrere parallele Restkanäle?
  pressure_clock: Wenn Eva die Kanäle jetzt nicht trennt, bleibt jeder kommende Beweis verwischt und Simon verstärkt Nora weiter unbemerkt.
  beziehungsdruck: Eva braucht endlich einen aktiven Zug; Simon bleibt zugleich möglicher Helfer und Schwachstelle.
  coreAction: Eva kauft Papierheft, Einwegtelefon und farbige Marker und streut die erste kontrollierte Falschinformation nur über Simon.
  false_reading: Noras schnelle Nachfrage könnte Zufall, Höflichkeit oder bloße Routine sein.
  dramaticBeat: Nora fragt eine Stunde später, ob sie am Donnerstag „wie besprochen“ einspringen solle.
  reversal: Der aktive Gegenzug liefert nicht nur Verdacht gegen Nora, sondern macht Simon selbst zum wahrscheinlichsten Einfallstor.
  konkrete_folge: Eva hat erstmals einen testbaren Gegenzug; zugleich wird Simon als möglicher Leckweg fast sicher.
  cost: Eva verliert die letzte Entlastung, Simon könne bloß ahnungslos am Rand stehen.
  status_shift: Eva gewinnt taktische Initiative; Simon rückt vom Schutzpartner zum riskanten Übertragungskanal.
  ending: Eva streicht in ihrem Heft den ersten Kanal rot an.
  ending_type: Proof Turn
  new_question: Wenn Simon der Leckweg ist, wie lässt sich mit ihm noch gegen Nora arbeiten, ohne ihr weiter Material zu liefern?
  bad_version_risk: Die Szene würde schwach, wenn sie wie Paranoia-Pinwand oder Agententrick wirkt statt wie nüchterne Alltagsfalle.
  revision_focus: Heft, Marker und isolierte Information konkret halten; die Stärke liegt in der kleinen, überprüfbaren Falle.
  proof_object: Informationsfalle über isolierten Kanal
  beweisobjekt: Informationsfalle über isolierten Kanal
  setup: CF006, OT002, OT004
```

#### Kapitel 23: „Doppelte Versorgung"
```
Scene Card
  id: SC_2_8
  pov: EVA
  word_target_min: 1700
  word_target_max: 1950
  ort: Kinderarztpraxis / Simon Flur / Milas Sachen
  uhrzeit: Donnerstagmittag bis Abend
  ziel: Vertrauensraum und materielles Duplikat zu einem Statusverlust bündeln.
  reader_pulse: Wann wirkt doppelte Fürsorge glaubwürdiger als die echte Mutter?
  main_question: Wann wirkt doppelte Fürsorge glaubwürdiger als die echte Mutter?
  objective: Eva will begreifen, wie weit Nora institutionell und materiell schon als zweite Versorgung mitläuft.
  szenenantrieb: Eva sucht in Praxis und Dingen nach einer neutralen Grenze und riskiert, dass beide Räume Nora erst einmal plausibler machen.
  scene_promise: Eva will sehen, wie weit Nora als zweite Versorgung schon mitläuft, prüft Praxis und Dinge und gewinnt ein Doppelversorgungs-Muster, aber genau dieses Muster macht Evas Status kleiner.
  wissensgrenze: Eva weiß, dass Nora in ihrem Namen handeln konnte, aber nicht, wie breit dieselbe Logik schon läuft.
  information_gap: Wie weit reicht Noras Ersatzsystem schon über Wohnung, Kita und Simon hinaus in neutrale Vertrauensräume?
  pressure_clock: Wenn doppelte Versorgung weiter als vernünftige Reserve gelesen wird, wird Eva Schritt für Schritt zur unpraktischeren Mutter.
  beziehungsdruck: Eva braucht Alarm über Material und Praxisnotiz; Simon liest beides zunächst als vernünftige Reserve.
  coreAction: In der Praxis steht, dass Mila von einer „guten Bekannten der Mutter“ mit mündlicher Zustimmung vorgestellt wurde. Später hängt bei Simon eine fast identische zweite Regenjacke, die Nora für „alle Fälle“ mitgebracht hat.
  false_reading: Praxisvermerk und zweite Jacke könnten nur fürsorgliche Entlastung in einer angespannten Lage sein.
  dramaticBeat: Mila greift automatisch zur falschen Jacke und sagt: „Die bleibt hier, sonst ist morgen falsch.“ Simon sieht den Riss kurz, hängt die Jacke dann aber doch wieder zurück, weil doppelte Versorgung in dieser Lage vernünftig klingt.
  reversal: Gerade die plausibelste Fürsorge macht Nora institutionell und materiell glaubwürdiger als Eva.
  mila_kindmoment: Mila entscheidet nicht symbolisch, sondern aus Gewohnheit zwischen Jacken und Tageslogik.
  konkrete_folge: Evas Status sinkt in Praxis und Simon-System; Simon wird als sicherer Kanal gestärkt.
  cost: Eva verliert nicht nur Vertrauen, sondern sichtbare Selbstverständlichkeit in Praxis und Alltagsmaterial.
  status_shift: Nora rückt von hilfreicher Bekanntenrolle zur plausiblen zweiten Versorgung auf; Simon stabilisiert diese Lesart noch.
  ending: Im Innenfutter steckt ein sauber beschriftetes Etikett mit falschem Datum.
  ending_type: Proof Turn
  new_question: Wie viele Räume hat Nora bereits doppelt eingerichtet, bevor Eva überhaupt den ganzen Radius sieht?
  bad_version_risk: Die Szene würde schwach, wenn Praxis und Jacke bloß schockieren statt denselben Ersatzmechanismus materialisieren.
  revision_focus: Vertrauensraum und materielles Duplikat als ein System lesen; Mila soll aus Gewohnheit handeln, nicht symbolisch kommentieren.
  proof_object: Praxisnotiz plus zweite Jacke mit Etikett
  endzustand_hook: Das Kapitel muss mit dem Gefühl enden, dass Nora inzwischen sogar Vertrauensräume und Dinge zugleich als Versorgungssystem besetzt.
  beweisobjekt: Praxisnotiz plus zweite Jacke mit Etikett
  nora_kosten: Der Praxisvermerk und der Etikettfehler schaffen später verwertbare Rückbeweise.
  setup: CF003, CF004, CF005, OT001, OT002, OT004, OT005
```

#### Kapitel 24: „Die Nacht vor Freitag"
```
Scene Card
  id: SC_2_9
  pov: EVA
  ort: Wohnung / Treppenhaus / Hof
  uhrzeit: späte Nacht
  ziel: Die Eskalation ins Körperliche ziehen, ohne den Alltagsstoff zu verlassen.
  reader_pulse: Wie tief steckt Nora bereits in Evas Takt und Wohnlogik?
  main_question: Wie tief steckt Nora bereits in Evas Takt und Wohnlogik?
  objective: Eva will am Morgen selbst an der Kita sein und nichts dem Zufall überlassen.
  szenenantrieb: Eva will den nächsten Morgen kontrollieren und riskiert, dass gerade die Nacht zeigt, wie tief Nora schon im Rhythmus sitzt.
  scene_promise: Eva will den nächsten Morgen kontrollieren, bereitet alles vor und gewinnt Wachheit, aber die Nacht zeigt, wie tief Nora schon in Wohnlogik und Körpertakt sitzt.
  wissensgrenze: Eva weiß, dass Nora nahe ist, nicht aber, wie viel davon Beobachtung und wie viel Zugriff war.
  information_gap: Wie viel von Noras Nähe ist bloße Beobachtung und wie viel noch aktiver Zugriff in Evas Körperraum?
  pressure_clock: Wenn Eva morgen müde und verwischt in die Beweisphase geht, arbeitet Noras Druck schon vor jedem offiziellen Schritt gegen sie.
  beziehungsdruck: Eva kämpft hier vor allem gegen den von Nora gebauten Druck in Körper und Wohnung.
  coreAction: Eva legt Ausdrucke, Kleidung und Beweise bereit und hört nachts Schritte im Treppenhaus.
  false_reading: Schritte, Schlafmangel und wiederaufgetauchte Dinge könnten als Übermüdung oder Zufall weglesbar bleiben.
  dramaticBeat: Vor ihrer Matte liegt Milas frisch gewaschene Schlafhose, obwohl sie seit Tagen fehlt.
  reversal: Der Versuch, den Morgen zu beherrschen, endet darin, dass Nora die Nacht selbst als Druckraum besetzt.
  konkrete_folge: Nora verschiebt die Bedrohung aus Verwaltung in Körper und Wohnung; Eva geht ohne Schlaf in die nächste Beweisphase.
  cost: Eva verliert körperliche Reserve genau vor der nächsten entscheidenden Beweisrunde.
  status_shift: Nora rückt aus Formularwelt in Evas unmittelbaren Nahbereich; Eva muss unter Schlafmangel handlungsfähig bleiben.
  ending: Zehn Minuten vor Evas Wecker geht bei Nora Licht an; nah genug, um zu treffen, ungenau genug, um nicht allmächtig zu wirken.
  ending_type: Physical Proximity
  new_question: Wenn Nora schon im Nacht- und Treppenhaustakt sitzt, wie offen ist dann der kommende Morgen wirklich?
  bad_version_risk: Die Szene würde schwach, wenn sie wie Stalker-Horror oder Allmachtsinszenierung wirkt statt wie realer, enger Alltagsdruck.
  revision_focus: Schlafhose, Schritte und Licht als konkrete Druckzeichen setzen; keine Paranormalität, keine Tätergenialität.
  proof_object: Wiederaufgetauchte Schlafhose
  beweisobjekt: Wiederaufgetauchte Schlafhose
  setup: CF004, CF006, OT002, OT005
```

#### Kapitel 25: „Die Unterschrift"
```
Scene Card
  id: SC_2_10
  pov: EVA
  ort: Steuerbüro Freundin / Kaffeeküche
  uhrzeit: Freitagvormittag
  ziel: Bauchgefühl in nüchterne Beobachtung überführen.
  reader_pulse: Welche Version von Eva unterschreibt hier eigentlich?
  main_question: Welche Version von Eva unterschreibt hier eigentlich?
  objective: Eva will ihre Vermutung zur imitierten Unterschrift absichern.
  szenenantrieb: Eva sucht einen lesbaren Fachblick und riskiert, dass der Fund Noras Sorgfalt noch unheimlicher macht.
  scene_promise: Eva will ihre Vermutung zur Unterschrift absichern, sucht nüchternen Fachblick und gewinnt einen prüfbaren Formbeweis, aber dieser Beweis zeigt Nora als Archivarin einer älteren Eva.
  wissensgrenze: Eva ahnt archivierte Kopien, kennt aber noch nicht alle alten Versionen von sich.
  information_gap: Aus welchen älteren Formularen und Vollmachten speist Nora ihre Imitation genau?
  pressure_clock: Wenn Eva die Signatur nicht fachlich lesbar macht, bleibt ihr Verdacht gegen Nora bloß Gefühl.
  beziehungsdruck: Eva braucht hier kein Mitleid, sondern Handwerkszeug.
  coreAction: Eine befreundete Buchhalterin zeigt ihr Wiederholungsfehler und alte Schleifen in Routineunterschriften.
  false_reading: Die Unterschrift könnte nur ähnlich wirken, ohne belastbare Rückspur auf ältere Eva-Versionen.
  dramaticBeat: In der Kita-Unterschrift taucht eine Schleife aus Evas alten Vollmachten auf, die sie seit der Trennung selbst nicht mehr nutzt.
  reversal: Aus bloßer Ähnlichkeit wird ein materiell rücklesbarer Archivbeweis.
  konkrete_folge: Eva kann Nora künftig nicht nur der Ähnlichkeit, sondern der Archivarbeit beschuldigen; der Beweis wird schärfer und rückprüfbarer.
  cost: Eva verliert auch im Schriftbild die Gegenwartshoheit über sich selbst.
  status_shift: Evas Verdacht wird fachlich belastbar; Nora verliert den Schutz bloßer Ähnlichkeit.
  ending: Eva versteht, dass Nora eine frühere Eva gegen die jetzige einsetzt.
  ending_type: Proof Turn
  new_question: Welche anderen alten Versionen von Eva hat Nora noch konserviert und gegen die Gegenwart einsatzfähig gemacht?
  bad_version_risk: Die Szene würde schwach, wenn sie grafologisch groß oder übererklärend wird statt auf einem kleinen Handwerksdetail zu landen.
  revision_focus: Fachblick nüchtern halten; die alte Schleife soll den Schlag tragen, nicht eine lange Erkenntnisrede.
  proof_object: Vergleich alte Vollmacht / aktuelle Signatur
  beweisobjekt: Vergleich alte Vollmacht / aktuelle Signatur
  setup: CF004, CF006, OT001, OT002
```

#### Kapitel 26: „Die Probe"
```
Scene Card
  id: SC_2_11
  pov: EVA
  ort: Simon Auto / Handy / Parkplatz
  uhrzeit: Freitagnachmittag
  ziel: Evas Gegenfalle sichtbar arbeiten lassen und Simons Kippen vorbereiten.
  reader_pulse: Wann reicht eine kleine Versuchsanordnung, damit Simon nicht mehr zurück kann?
  main_question: Wann reicht eine kleine Versuchsanordnung, damit Simon nicht mehr zurück kann?
  objective: Eva will testen, ob Nora auf gezielt gestreute Falschinformation reagiert.
  szenenantrieb: Eva streut eine kontrollierte Falschinfo und riskiert, dass der Versuch scheitert oder sie selbst manipulativ wirkt.
  scene_promise: Eva will den Leckweg testen, streut eine kontrollierte Falschinfo und gewinnt eine direkte Reaktion, aber diese Reaktion beweist zugleich, wie nah Nora schon an Simon sitzt.
  wissensgrenze: Eva weiß, dass Simon der einzige offizielle Kanal des Tests ist.
  information_gap: Reicht eine einzelne, isolierte Reaktion, damit Simon seinen Anteil am Problem nicht mehr weglesen kann?
  pressure_clock: Wenn selbst dieser saubere Test Simon nicht kippen lässt, bleibt Nora weiter in seinem Schutzraum verborgen.
  beziehungsdruck: Eva braucht von Simon endlich Mitwissen; Simon steht an der Schwelle, seine Rolle im Problem zu sehen.
  coreAction: Eva lässt über Simon die falsche Info streuen, Mila werde am Montag ungewöhnlich früh abgeholt.
  false_reading: Noras Nachfrage könnte nur Fürsorge oder Kalenderabgleich sein.
  dramaticBeat: Nora fragt exakt nach diesem Fenster, und Simon hört die Nachfrage am Lautsprecher selbst.
  reversal: Der Test soll Nora treffen, zwingt aber vor allem Simon zum Mitsehen.
  konkrete_folge: Simon kann den Leckweg nicht mehr als Zufall lesen; die Romanstatik kippt erstmals sichtbar.
  cost: Eva verliert den letzten Rest einfacher Kommunikation mit Simon; ab jetzt hängt alles an seiner Entscheidung.
  status_shift: Simon kippt aus der Ahnung in belastetes Wissen; Nora verliert den Schutz, für ihn bloß praktisch zu wirken.
  ending: Er sagt: „Wenn du recht hast, ist sie näher dran, als ich dachte.“
  ending_type: Social Reframe
  new_question: Was tut Simon jetzt mit dem Wissen, dass seine eigene Ordnung Nora so nah an Mila gebracht hat?
  bad_version_risk: Die Szene würde schwach, wenn der Test wie Trickkiste wirkt oder Simon zu abrupt komplett umschlägt.
  revision_focus: Lautsprecher-Moment klein und hart halten; der Satz soll aus Simons eigener Scham kommen, nicht aus Plotservice.
  proof_object: Reaktion auf isolierte Falschinformation
  beweisobjekt: Reaktion auf isolierte Falschinformation
  nora_kosten: Noras Zugriff über Simon wird durch ihre eigene Reaktionsgeschwindigkeit lesbar.
  setup: CF005, OT002, OT003, OT004
```

#### Kapitel 27: „Nicht unzuverlässig, sondern ersetzt"
```
Scene Card
  id: SC_2_12
  pov: EVA
  word_target_min: 1700
  word_target_max: 1950
  ort: Chatverläufe / Ausdrucke / Simon Wohnzimmer
  uhrzeit: Samstag Tag und Abend
  ziel: Rückwärtsarchiv und Midpoint-Erkenntnis zu einem Umschaltmoment verschmelzen.
  reader_pulse: Wann wird Hilfe zur Übernahme?
  main_question: Wann wird Hilfe zur Übernahme?
  objective: Eva will Simon nicht mehr Vorfälle, sondern Logik zeigen.
  szenenantrieb: Eva liest alte Hilfen rückwärts und riskiert, dass gerade die Summe vernünftiger Kleinigkeiten die Tragik maximal macht.
  scene_promise: Eva will Simon nicht mehr Vorfälle, sondern Logik zeigen, ordnet alte Hilfen rückwärts und gewinnt ein Muster, aber dieses Muster macht den gemeinsamen Alltag als verdrängte Ersetzung sichtbar.
  wissensgrenze: Eva erkennt nun, dass kaum ein Zugriff spektakulär war, aber alle zusammen Besitz ergeben.
  information_gap: Lässt sich aus lauter vernünftigen Einzelhilfen eine belastbare Ersetzungskette bauen?
  pressure_clock: Wenn Eva und Simon die Summe jetzt nicht als System lesen, bleibt Nora trotz aller Belege im Feld der nützlichen Hilfe.
  beziehungsdruck: Eva braucht von Simon kein Mitleid, sondern Mitsehen; Simon muss seine eigene Mitschuld spüren.
  coreAction: Eva ordnet Chatverläufe, Schlüssel-, Arzt-, Wäsche-, Kita-, Paket- und Abholmomente und baut daraus eine Streichliste für Freigaben, Kontaktwege, Schlüssel und Gewohnheiten. Danach legt sie Simon nicht mehr Vorfälle, sondern Muster vor.
  false_reading: Viele vernünftige Kleinigkeiten bleiben nur lose Hilfsfragmente und ergeben noch kein bewusstes Ersetzungssystem.
  dramaticBeat: Sie sagt sinngemäß nicht mehr „Sie nimmt mir Mila weg“, sondern „Sie schreibt mich aus unserem Alltag heraus.“ Simon widerspricht nicht.
  reversal: Aus einer Sammlung kleiner Hilfen wird eine zusammenhängende Ersatzarchitektur.
  konkrete_folge: Eva und Simon treten erstmals in eine gemeinsame Musterlesart ein; Nora verliert mehrere alte Restzugriffe durch Evas Rückbau.
  cost: Beide verlieren die bequeme Lesart, dass es nur um einzelne Vorfälle oder Missverständnisse ging.
  status_shift: Eva und Simon werden erstmals zu einem gemeinsamen Gegenlager; Nora verliert still mehrere Restkanäle.
  ending: Während sie die letzten Kanäle streichen, schreibt Nora ruhig: „Wenn Mila morgen bei mir frühstücken soll, ich bin da.“
  ending_type: Quiet Countermove
  new_question: Wenn Nora sogar nach dem Musterbruch noch so ruhig bleibt, welcher vorbereitete Zug steht als Nächstes schon bereit?
  bad_version_risk: Die Szene würde schwach, wenn sie wie Diagramm-Erklärung klingt statt wie begriffener Verlust eines ganzen Alltags.
  revision_focus: Muster statt Vortrag; das Entscheidende ist Simons ausbleibender Widerspruch und Noras ruhige Nachricht im selben Moment.
  proof_object: Streichliste aus Chatverläufen, Freigaben und Alltagsmomenten
  endzustand_hook: Der Midpoint muss als begriffener Systemwechsel enden: nicht Unzuverlässigkeit, sondern geplante Ersetzung.
  payoff: OT001, OT002, OT003, OT004, OT005
  nora_kosten: Die archivierte Hilfekette wird zu Noras erster echter Schwachstelle, weil Eva daraus Kanäle schließen kann.
  setup: CF004, CF005, CF006, CF007
```

---

### ACT 3 — „Die Ersetzung"
> Eröffnungs-Dokument: Sprachnachricht Nora an Eva: „Ich wollte nur entlasten. Du klingst seit Tagen nicht wie du selbst.“

#### Kapitel 28: „Die Generalprobe"
```
Scene Card
  id: SC_3_1
  pov: EVA
  ort: Schulweg-Vorbereitung / Innenhof / Straße vor dem Haus
  uhrzeit: früher Montagmorgen
  ziel: Den Plan der Täterin als Wiederholungs- und Übernahmeversuch sichtbar machen.
  reader_pulse: Wie nah ist Nora der offiziellen Normalität schon gekommen?
  main_question: Wie nah ist Nora der offiziellen Normalität schon gekommen?
  objective: Eva will Mila trotz aller Unsicherheit selbst in die Kita bringen.
  szenenantrieb: Eva will den Morgen selbst behaupten und riskiert, dass Nora tägliche Übergabe bereits so oft mitgedacht hat, dass Eva wie die Störung wirkt.
  scene_promise: Eva will den Morgen selbst behaupten, führt Mila Richtung Kita und gewinnt Wachsamkeit, aber Nora hat tägliche Übergabe schon so oft mitgedacht, dass ihre Mitnahme fast normal wirkt.
  wissensgrenze: Eva weiß seit dem Midpoint, dass Nora ersetzt, kennt aber noch nicht die nächste konkrete Bühne.
  information_gap: Wie weit hat Nora offizielle Morgenlogik und Übergaberoutine schon vorausgeprobt?
  pressure_clock: Wenn Nora tägliche Übergaben weiter als Selbstverständlichkeit mitbesetzt, wird Eva selbst am offiziellen Morgen zur Störung.
  beziehungsdruck: Eva will Alltagshoheit; Nora will Wiederholung als Berechtigung; Mila trägt beide Routinen mit.
  coreAction: Noch vor dem Verlassen der Wohnung bietet Nora über Simon an, den Morgen „kurz sauber zu ziehen“. Gleichzeitig tauchen drei kleine Abweichungen in Milas Tasche auf.
  false_reading: Es handelt sich nur um eine letzte praktische Hilfsbereitschaft in einer angespannten Woche.
  dramaticBeat: Eva versteht, dass Nora nicht auf den großen Moment wartet, sondern tägliche Übergaben probt.
  reversal: Aus vermeintlicher Resthilfe wird sichtbar, dass Nora längst eine tägliche Generalprobe gefahren hat.
  konkrete_folge: Eva sieht den Angriff jetzt als Wiederholungsmaschine; Mila denkt Nora bereits als plausible Morgenkonstante mit.
  cost: Eva verliert selbst am gemeinsamen Morgen die Selbstverständlichkeit ihrer Mutterrolle.
  status_shift: Nora rückt an die Schwelle offizieller Normalität; Eva muss ihre eigene Alltagsberechtigung aktiv behaupten.
  ending: Mila fragt im Treppenhaus, warum Nora heute nicht auch mitkommt.
  ending_type: Child Echo
  new_question: Wenn Mila Nora schon als normale Morgenfigur mitdenkt, wie nahe ist die nächste offizielle Übernahme?
  bad_version_risk: Die Szene würde schwach, wenn sie nur Vorahnung liefert statt die Wiederholungslogik konkret in Tasche, Angebot und Kindersatz zu zeigen.
  revision_focus: Kleine Abweichungen und Milas Frage tragen lassen; kein Alarmismus vor dem eigentlichen Zugriff.
  proof_object: Drei kleine Abweichungen in Milas Tasche
  alltagswaffe: Wiederholung erzeugt Berechtigung
  setup: CF004, CF009, OT004, OT005
```

#### Kapitel 29: „Das Wochenende danach"
```
Scene Card
  id: SC_3_2
  pov: EVA
  ort: Simon Wohnung / Balkon
  uhrzeit: später Vormittag
  ziel: Den Preis der Ersetzung im Kind zeigen.
  reader_pulse: Was übernimmt Mila schon, ohne zu verstehen, wem es gehört?
  main_question: Was übernimmt Mila schon, ohne zu verstehen, wem es gehört?
  objective: Eva will Mila Sicherheit geben, ohne sie in Loyalitätskonflikte zu ziehen.
  szenenantrieb: Eva will Mila beruhigen und riskiert, dass selbst Trost und kleine Routinen schon von Nora mitbesetzt sind.
  scene_promise: Eva will Mila beruhigen, hört ihr zu und verliert exklusive Nähe in Sprache und Rhythmus, aber gerade im Trost zeigt sich, wie tief Nora schon ins Kind verlängert wurde.
  wissensgrenze: Eva weiß, dass Sprache und Rhythmus ins Kind hinein verlängert wurden.
  information_gap: Welche von Milas scheinbar eigenen Regeln und Sätzen stammen längst aus Noras Ordnung?
  pressure_clock: Wenn Nora weiter in Milas Sprache sitzt, wird Ersatz zur inneren Gewohnheit und nicht nur zum äußeren Zugriff.
  beziehungsdruck: Eva will Mutter bleiben, ohne Mila gegen Nora auszuspielen.
  coreAction: Mila erzählt beiläufig von Dingen, die sie „mit Nora“ getan hat, die Eva für ihre eigenen Mutter-Tochter-Routinen hielt.
  false_reading: Milas Sätze könnten bloße Phase, Nachahmung oder harmlose Vermischung sein.
  dramaticBeat: Mila benutzt denselben kleinen Befehlston wie Nora.
  reversal: Aus Trostszene wird sichtbar, dass Nora bereits in Milas inneren Alltagsregeln sitzt.
  mila_kindmoment: Mila sagt über ihr Frühstücksei: „Erst ordentlich, dann warm“, als wäre das ein Naturgesetz.
  konkrete_folge: Nora sitzt nun auch in Milas Sprache; Eva verliert Exklusivität bei Beruhigung und Gewohnheit.
  cost: Eva verliert die Sicherheit, dass selbst ihre Beruhigungsroutinen im Kind noch eindeutig ihre sind.
  status_shift: Nora gewinnt innere Präsenz im Kind; Eva muss Beziehung halten, ohne frontal gegen Mila zu gehen.
  ending: Eva steht am Balkon und merkt, dass sogar ihre Beruhigungssätze Konkurrenz haben.
  ending_type: Child Echo
  new_question: Wie bekommt Eva ihre Muttersprache zurück, ohne Mila ausgerechnet gegen deren Gewohnheiten zu führen?
  bad_version_risk: Die Szene würde schwach, wenn sie Mila bedeutungsschwer sprechen lässt statt kindlich und beiläufig.
  revision_focus: Kindersprache klein und selbstverständlich halten; der Schlag entsteht aus Gewohnheit, nicht aus Pathos.
  proof_object: Milas Frühstücksregel und Befehlston
  setup: CF002, CF004, OT004
```

#### Kapitel 30: „Abgemeldet"
```
Scene Card
  id: SC_3_3
  pov: EVA
  ort: Handy / Kita-App / Büro
  uhrzeit: Mittag
  ziel: Eva technisch und sozial weiter aus der Mutterrolle drängen.
  reader_pulse: Wie viel Nähe verschwindet, wenn ein Verwaltungsprozess gegen Eva arbeitet?
  main_question: Wie viel Nähe verschwindet, wenn ein Verwaltungsprozess gegen Eva arbeitet?
  objective: Eva will ihre Zugriffe auf die Kita sichern.
  szenenantrieb: Eva will den technischen Zugriff zurückholen und riskiert, dass ein plausibler Verwaltungsprozess längst gegen sie arbeitet.
  scene_promise: Eva will ihre Kita-Zugriffe sichern, prüft den App-Verlust und gewinnt einen plausiblen Prozesskanal, aber gerade der Prozess schneidet sie sauberer aus der Mutterrolle.
  wissensgrenze: Eva ahnt einen Rückgriff auf frühe Formulare und alte Postfächer.
  information_gap: Welche Alt-Daten und Intimdetails reichen aus, um Verwaltung heute gegen Eva arbeiten zu lassen?
  pressure_clock: Solange Nora über alte Postfächer und Formularwissen noch Prozesse auslösen kann, verliert Eva Nähe ohne sichtbaren Konflikt.
  beziehungsdruck: Eva braucht digitale Selbstverständlichkeit zurück; Verwaltung reagiert auf plausiblere Prozessdaten.
  coreAction: Eva wird aus der Kita-App ausgeloggt. Jemand hat eine manuelle Rücksetzung über ein altes Postfach und ein intimes Detail zum Kuscheltierfach plausibel gemacht.
  false_reading: Ein App-Fehler oder üblicher Rücksetzprozess könnte hinter dem Verlust stecken.
  dramaticBeat: Petra bestätigt, dass die Rückfrage über Alt-Daten und ein vertrautes Alltagsdetail beantwortet wurde.
  reversal: Aus technischem Störfall wird eine sauber prozessierte Ausblendung über alte Nähe.
  konkrete_folge: Eva verliert einen zentralen Informationskanal; alte Formulare arbeiten nun offen gegen ihre aktuelle Mutterrolle.
  cost: Eva verliert unmittelbare Informationsnähe zu Mila ausgerechnet über einen formalen Standardprozess.
  status_shift: Verwaltung liest Nora vorerst als plausibler; Eva wird technisch aus ihrer Selbstverständlichkeit gedrängt.
  ending: Eva starrt auf die alte Mailadresse, die Nora nur aus früheren Formularen kennen kann.
  ending_type: Institutional Lock
  new_question: Welche weiteren formalen Prozesse kann Nora noch über alte Daten und intime Details gegen Eva wenden?
  bad_version_risk: Die Szene würde schwach, wenn sie wie Hackerangriff klingt statt wie korrekter Verwaltungsablauf mit falscher Plausibilität.
  revision_focus: App-Rücksetzung nüchtern halten; der Schock sitzt in Alt-Postfach und Kuscheltierdetail, nicht in Technikdrama.
  proof_object: Manuelle App-Rücksetzung über altes Postfach
  beweisobjekt: Manuelle App-Rücksetzung über altes Postfach
  setup: CF003, CF004, CF006, OT001, OT002
```

#### Kapitel 31: „Petra"
```
Scene Card
  id: SC_3_4
  pov: EVA
  ort: Kita-Leitungsbüro
  uhrzeit: Nachmittag
  ziel: Petra von Blockade in vorsichtige Allianz verschieben.
  reader_pulse: Wann wird aus Skepsis institutionelle Mitverantwortung?
  main_question: Wann wird aus Skepsis institutionelle Mitverantwortung?
  objective: Eva will Petra nicht emotional, sondern strukturell überzeugen.
  szenenantrieb: Eva zeigt Muster statt Panik und riskiert, dass Petra nur kleine Korrekturen wagt.
  scene_promise: Eva will Petra strukturell überzeugen, zeigt Muster und gewinnt vorsichtige Allianz, aber Petra kann ohne frischen Anlass noch keine Totalblockade ziehen.
  wissensgrenze: Eva weiß noch nicht, ob Petra im Ernstfall wirklich gegen Nora hält.
  information_gap: Wie viel institutionelle Gegenwehr ist möglich, bevor ein aktueller Auslöser die volle Blockade legitimiert?
  pressure_clock: Wenn Petra jetzt nur halb reagiert, bleibt der kommende Ausflug ein offenes Zeitfenster für Nora.
  beziehungsdruck: Eva braucht Rückendeckung; Petra braucht prüfbare Muster.
  coreAction: Eva zeigt eine Matrix aus Zugriffen, Terminen, Signaturmustern und Falschinformation.
  false_reading: Muster reichen vielleicht nur für etwas mehr Vorsicht, aber noch nicht für echte Mitverantwortung.
  dramaticBeat: Petra setzt für den Ausflug ab sofort strengere Helferregeln und direkte Gegenzeichnung.
  reversal: Aus skeptischer Distanz wird institutionelle Vorsicht, aber noch keine vollständige Schließung.
  konkrete_folge: Die Kita geht institutionell auf Vorsicht; Nora verliert Bewegungsraum im offiziellen Ablauf.
  cost: Eva bekommt Hilfe, aber noch keine vollständige Sicherheit.
  status_shift: Petra wird vom Prüfstein zur vorsichtigen Verbündeten; Nora verliert offiziellen Bewegungsspielraum.
  ending: Petra warnt trotzdem, dass ohne frischen Anlass noch nicht alles formell blockiert werden kann.
  ending_type: Institutional Lock
  new_question: Welcher aktuelle Anlass wird Nora noch liefern, bevor Petra die Tür ganz schließen darf?
  bad_version_risk: Die Szene würde schwach, wenn Petra plötzlich voll glaubt statt prozesslogisch nur so weit zu gehen, wie sie begründen kann.
  revision_focus: Muster-Matrix und Gegenzeichnung genügen; Petra soll professionell vorsichtig kippen, nicht emotional.
  proof_object: Muster-Matrix aus Vorfällen
  beweisobjekt: Muster-Matrix aus Vorfällen
  setup: CF003, CF004, OT001, OT002, OT005
```

#### Kapitel 32: „Das ruhige Gesicht"
```
Scene Card
  id: SC_3_5
  pov: EVA
  ort: neutrales Dreiergespräch in der Kita
  uhrzeit: später Nachmittag
  ziel: Nora in direkter Gegenüberstellung stark und menschlich lesbar machen.
  reader_pulse: Warum wirkt die ruhigere Frau gefährlicher als die lautere Wahrheit?
  main_question: Warum wirkt die ruhigere Frau gefährlicher als die lautere Wahrheit?
  objective: Eva will Nora vor Petra aus dem ruhigen Skript holen.
  szenenantrieb: Eva konfrontiert Nora und riskiert, dass Noras Ruhe sie selbst aggressiver aussehen lässt.
  scene_promise: Eva will Nora vor Petra aus dem ruhigen Skript holen, konfrontiert sie direkt und verliert soziale Leichtigkeit, aber Noras kontrollierte Moral macht die Gefahr erst sichtbar.
  wissensgrenze: Eva weiß, dass Nora lügt, kennt aber noch nicht deren vollen moralischen Kern.
  information_gap: Worin liegt Noras moralische Rechtfertigung so genau, dass Ruhe für sie glaubwürdiger wirkt als Wahrheit?
  pressure_clock: Wenn Nora ihre Ruhe weiter als Verlässlichkeit ausspielen kann, bleibt selbst institutionelle Vorsicht sozial unsicher.
  beziehungsdruck: Eva braucht sichtbares Rutschen; Nora braucht nur Selbstkontrolle.
  coreAction: Nora bleibt leise, höflich und bietet sogar an, sich zurückzuziehen, „wenn Verlässlichkeit gerade anders organisiert werden soll“.
  false_reading: Noras Selbstzurücknahme beweist Reife und entlastet sie eher, als dass sie etwas verrät.
  dramaticBeat: Gerade ihre Selbstzurücknahme lässt Eva kurz wie die schwerere Person wirken.
  reversal: Der Versuch, Nora bloßzustellen, macht zunächst Eva schwerer lesbar, offenbart aber zugleich Noras kalte Moral.
  nora_moral_riss: In einem harmlosen Satz zeigt Nora, dass für sie Verlässlichkeit wichtiger ist als Bindung.
  konkrete_folge: Petra sieht zum ersten Mal, wie sehr Nora sich über ruhige Moral statt über Hilfe legitimiert; der soziale Raum bleibt dennoch noch offen.
  cost: Eva verliert im direkten Raum wieder soziale Bodenhaftung.
  status_shift: Petra liest Nora jetzt schärfer, aber Nora behält noch die wirksame Oberfläche der Selbstkontrolle.
  ending: In Evas Tasche steckt danach ein Zettel von Nora: „Ich wollte nie gegen dich arbeiten.“
  ending_type: Quiet Countermove
  new_question: Wenn Nora sogar nach offener Konfrontation noch so sauber nachsetzt, wie sieht dann ihr nächster offizieller Zug aus?
  bad_version_risk: Die Szene würde schwach, wenn Nora offen villainhaft oder doppelbödig-zu-klug spricht statt minimal zu ruhig und plausibel.
  revision_focus: Der Riss liegt in Noras Moralformulierung und im Zettel danach; kein Tribunal, keine Entlarvungsrede.
  proof_object: Noras Zettel in Evas Tasche
  alltagswaffe: Selbstkontrolle wirkt glaubwürdig
  setup: CF004, OT003, OT005
```

#### Kapitel 33: „Simon sieht es"
```
Scene Card
  id: SC_3_6
  pov: EVA
  ort: Simon Auto / Parkplatz vor dem Supermarkt
  uhrzeit: Abend
  ziel: Simons Wendepunkt sauber und teuer setzen.
  reader_pulse: Was braucht Simon, um seine eigene Ordnung gegen sich lesen zu müssen?
  main_question: Was braucht Simon, um seine eigene Ordnung gegen sich lesen zu müssen?
  objective: Eva will keinen Trost, sondern Mitdenken.
  szenenantrieb: Eva nimmt den Vergleich ernst und riskiert, dass Simons Kippen zugleich seine Mitschuld freilegt.
  scene_promise: Eva will kein Mitgefühl, sondern Mitdenken, legt Simon den Vergleich vor und gewinnt seinen Bewusstseinswechsel, aber derselbe Wechsel macht seine Mitschuld unausweichlich.
  wissensgrenze: Eva vermutet den ersten klaren Bewusstseinswechsel, aber noch keine sofortige Lösung.
  information_gap: Reicht dieser eine unbestreitbare Vergleich, damit Simon seine eigene Schutzlogik gegen sich liest?
  pressure_clock: Wenn Simon jetzt noch einmal wegliest, geht der Ausflug mit Nora im Hintergrund in die gefährlichste offizielle Phase.
  beziehungsdruck: Eva braucht Erkenntnis statt Verwaltung; Simon muss sich als Teil des Einfallstors sehen.
  coreAction: Simon vergleicht Noras Nachfrage zum Ausflug mit einer Mail, die offiziell erst Stunden später kam.
  false_reading: Auch dieser Zeitvorsprung könnte Zufall, Vorahnung oder ein harmloser Nebensatz gewesen sein.
  dramaticBeat: Er sagt selbst: „Sie wusste etwas, das sie nicht wissen konnte.“
  reversal: Nicht Eva überzeugt Simon, sondern Simons eigener Vergleich kippt seine Ordnung.
  konkrete_folge: Simon kippt vom Filter zum Mitwisser; seine bisherige Schutzlogik wird zur Quelle von Scham und Handlung.
  cost: Simon verliert die Entlastung, Mila mit vernünftiger Ordnung geschützt zu haben.
  status_shift: Simon wechselt vom Leck zum aktiven Mitwisser; Nora verliert ihren wichtigsten glaubenden Puffer.
  ending: Er nimmt Evas Ordner mit und will sich am nächsten Morgen ohne Mila mit ihr treffen.
  ending_type: Social Reframe
  new_question: Wie weit geht Simon jetzt wirklich mit, wenn sein eigenes Mitverschulden Teil derselben Beweiskette ist?
  bad_version_risk: Die Szene würde schwach, wenn Simon pathetisch bekehrt wird statt in einem kleinen, beschämenden Vergleich kippt.
  revision_focus: Der Wendepunkt gehört Simon; Eva darf ihn nicht verbal für die Szene erledigen.
  proof_object: Noras Nachfrage vor offizieller Mail
  payoff: OT003
  setup: CF005, CF008, OT002, OT003
```

#### Kapitel 34: „Vor dem Ausflug"
```
Scene Card
  id: SC_3_7
  pov: EVA
  ort: Küchentisch / Copyshop / Simon Büro
  uhrzeit: nächster Morgen
  ziel: Die finale Gegenmaßnahme als belastbare Ordnung vorbereiten.
  reader_pulse: Reicht saubere Vorbereitung, um dieselbe Verwaltungswelt zurückzudrehen, die Eva geschwächt hat?
  main_question: Reicht saubere Vorbereitung, um dieselbe Verwaltungswelt zurückzudrehen, die Eva geschwächt hat?
  objective: Eva will Beweise so sichern, dass Nora sie nicht wieder in Zweifel ziehen kann.
  szenenantrieb: Eva will aus Material belastbare Reihenfolge machen und riskiert, dass der offizielle Ausflug Nora die nächste Bühne bietet.
  scene_promise: Eva will Beweise belastbar ordnen, baut mit Simon eine Einsatzmappe und gewinnt Struktur, aber derselbe offizielle Ausflug macht die Zeit gegen sie knapp.
  wissensgrenze: Eva weiß, dass der Ausflug entscheidend wird, aber noch nicht, wie frisch der nächste Beweis sein wird.
  information_gap: Reicht die jetzige Ordnung schon, oder braucht es noch einen aktuellen Beweis, damit Petra und Polizei nicht wieder auf Vorsicht stehen bleiben?
  pressure_clock: Wenn die Mappe vor dem Ausflug nicht belastbar steht, bekommt Nora ihre beste offizielle Bühne.
  beziehungsdruck: Eva und Simon müssen erstmals funktional zusammenarbeiten.
  coreAction: Beide ordnen Dokumente, Screenshots, Signaturen und Zeitfenster neu.
  false_reading: Gute Vorbereitung könnte genügen und den nächsten Morgen zu einer bloßen Verwaltungsübung machen.
  dramaticBeat: Sie erkennen, dass der Ausflug die ideale nächste offizielle Übergabe für Nora wäre.
  reversal: Aus ordnender Sicherheit wird akute Deadline.
  konkrete_folge: Aus Beweisfragmenten wird eine gemeinsame Einsatzmappe; Simon arbeitet nun gegen Nora statt unwissentlich für sie.
  cost: Eva und Simon verlieren die Ruhe eines planbaren Vorgehens und müssen in Echtzeit handeln.
  status_shift: Gemeinsame Struktur stärkt Eva und Simon, aber der Ausflug verschiebt die Initiative wieder Richtung Nora.
  ending: Auf Noras Tischkalender gegenüber ist der Ausflugstag rot markiert.
  ending_type: Deadline Shift
  new_question: Kommen Eva und Simon mit Ordnung noch rechtzeitig gegen eine längst vorbereitete offizielle Bühne an?
  bad_version_risk: Die Szene würde schwach, wenn sie nur Vorbereitung stapelt statt die Deadline konkret in den Raum zu ziehen.
  revision_focus: Beweismappe klar und körperlich halten; der rote Kalendereintrag muss den Druckschluss übernehmen.
  proof_object: Konsolidierte Beweismappe
  beweisobjekt: Konsolidierte Beweismappe
  setup: CF003, CF004, CF005, OT001, OT004
```

#### Kapitel 35: „Noras Wohnung"
```
Scene Card
  id: SC_3_8
  pov: EVA
  ort: Noras Wohnung
  uhrzeit: Abend
  ziel: Die moralische Parallelordnung voll sichtbar machen.
  reader_pulse: Was ist schlimmer als Diebstahl? Eine Frau, die Fürsorge in Besitz übersetzt.
  main_question: Was ist schlimmer als Diebstahl? Eine Frau, die Fürsorge in Besitz übersetzt.
  objective: Eva will Nora zum ersten Mal ohne Nachbarschaftsfilter sehen.
  opening: Eva klingelt bei Nora, weil diese behauptet, Milas Trinkflasche und eine Ausflugskopie lägen noch bei ihr. Nora lässt sie sofort hinein, überzeugt davon, in ihrer eigenen geordneten Wohnung moralisch überlegen zu bleiben.
  szenenantrieb: Eva geht in Noras Wohnung und riskiert, dass dort keine Chaosspur, sondern perfekte Ersatznormalität wartet.
  scene_promise: Eva will Nora ohne Nachbarschaftsfilter sehen, betritt ihre Wohnung und gewinnt einen aktuellen Verwaltungsbeweis, aber dort zeigt sich zugleich Noras moralisch geordnete Ersatznormalität.
  wissensgrenze: Eva kennt Noras Logik noch nicht in deren eigenem Satz.
  information_gap: Wie sieht Noras innere Mutterlogik aus, wenn sie nicht improvisiert, sondern in ihrer eigenen Ordnung spricht?
  pressure_clock: Wenn Eva diese Wohnung nur als gruselige Trophäensammlung liest, verpasst sie die eigentliche moralische Gegenordnung, mit der Nora Mila beansprucht.
  beziehungsdruck: Eva braucht den nackten Blick auf Nora; Nora will als verlässlichere Mutter gelesen werden.
  coreAction: In Noras Wohnung stehen Milas Dinge nicht als Trophäen, sondern als fast plausible Parallelordnung: Wechselshirt, Haarspangen, Ausdrucke, Routinen.
  false_reading: Die Wohnung könnte bloß fürsorgliche Übervorsicht oder peinliche Grenzlosigkeit zeigen, nicht ein bewusstes Ersatzsystem.
  dramaticBeat: Nora sagt: „Jemand musste anfangen, für sie verlässlich zu sein.“
  reversal: Aus möglicher Übergriffigkeit wird offene moralische Besitzlogik.
  konkrete_folge: Der Roman kippt endgültig von Entführungsangst zu geplanter Mutterersetzung; Eva hat einen aktuellen halbharten Beweis in der Hand.
  cost: Eva verliert die letzte Resthoffnung, Nora habe ohne eigenes Mutterprogramm nur zu viel geholfen.
  status_shift: Nora legt ihre moralische Gegenordnung offen; Eva gewinnt den aktuellsten Beweis, aber nicht die emotionale Entlastung.
  ending: Auf Noras Tisch liegt eine vorab ausgefüllte Einverständniserklärung für den Kita-Ausflug.
  ending_type: Proof Turn
  new_question: Wie schnell kann Eva diesen aktuellen Beweis in offizielle Wirkung übersetzen, bevor Nora ihn im Ausflugssystem nutzt?
  bad_version_risk: Die Szene würde schwach, wenn die Wohnung wie Gruselkabinett wirkt statt wie erschreckend plausible Parallelordnung.
  revision_focus: Ordnung, Satz und Formular als eine Linie lesen; keine Täterwohnung ausstellen, sondern Ersatznormalität.
  proof_object: Vorab ausgefüllte Ausflugserklärung und abgeheftete Routinen
  endzustand_hook: Die Szene muss mit moralischer Selbstrechtfertigung plus aktuellem Vorab-Beweis enden; das ist der eigentliche Offenbarungsschlag.
  beweisobjekt: Vorab ausgefüllte Ausflugserklärung und abgeheftete Routinen
  closing_line: Eva fotografiert das Blatt, ohne dass ihre Hand zittert.
  nora_kosten: Nora legt ihre Moral offen und lässt einen aktuellen Verwaltungsbeweis sichtbar werden.
  setup: CF004, CF007, OT002, OT004, OT005
```

#### Kapitel 36: „Keine Gestik"
```
Scene Card
  id: SC_3_9
  pov: EVA
  ort: Hausflur / Bad / Küche
  uhrzeit: Nacht
  ziel: Eva nach der Konfrontation nicht brechen, sondern härter werden lassen.
  reader_pulse: Was ist Evas stärkste Gegenmacht, wenn Nora auf ihren Kontrollverlust wartet?
  main_question: Was ist Evas stärkste Gegenmacht, wenn Nora auf ihren Kontrollverlust wartet?
  objective: Eva will verhindern, dass Nora ihre Reaktion gegen sie lesen kann.
  szenenantrieb: Eva sichert ruhig Material und riskiert, dass gerade Selbstbeherrschung jetzt ihr einziges Machtmittel ist.
  scene_promise: Eva will Nora keinen verwertbaren Ausraster geben, sichert ruhig Material und gewinnt Disziplin, aber genau diese Selbstbeherrschung ist jetzt ihr letztes verteidigbares Machtmittel.
  wissensgrenze: Eva weiß, was Nora moralisch denkt, und vermutet den finalen Zug am Morgen.
  information_gap: Reicht Disziplin allein, um den aktuellen Beweis morgen institutionell durchzudrücken?
  pressure_clock: Wenn Eva jetzt kippt oder unsauber wird, kann Nora aus Evas Reaktion sofort wieder Instabilität lesen.
  beziehungsdruck: Eva arbeitet gegen Noras Blick auf sie.
  coreAction: Eva sichert Fotos, Metadaten und Reihenfolgen, informiert Simon und bittet Petra um ein Frühgespräch.
  false_reading: Kontrolle über sich selbst ist nur innere Fassung und verschiebt an der äußeren Lage nichts.
  dramaticBeat: Gerade weil Eva nicht zusammenbricht, merkt sie, wie sehr Nora auf genau dieses Bild gehofft hatte.
  reversal: Was wie passives Sich-Zusammennehmen aussieht, wird zu Evas härtester aktiver Gegenmaßnahme.
  konkrete_folge: Eva verweigert Nora den verwertbaren Ausraster; die nächste Runde beginnt mit Disziplin statt mit Panik.
  cost: Eva darf sich nicht entladen und trägt die ganze Nacht weiter unter Spannung.
  status_shift: Nora verliert das Bild der instabilen Gegenspielerin; Eva kommt kontrolliert in den Finalmorgen.
  ending: Nora schreibt: „Wenn du jetzt klug bist, machst du morgen nichts Unbedachtes.“
  ending_type: Quiet Countermove
  new_question: Kann Eva morgen genauso kontrolliert bleiben, wenn Nora im offiziellen Raum noch einmal ruhig auftritt?
  bad_version_risk: Die Szene würde schwach, wenn sie wie bloßer Zwischenatem wirkt statt wie bewusst verweigerter Kontrollverlust.
  revision_focus: Fotos, Reihenfolge und Nachricht als eine disziplinierte Gegenbewegung halten; keine innere Entladung.
  proof_object: Fotos und Metadaten aus Noras Wohnung
  alltagswaffe: Selbstbeherrschung als Gegenmacht
  setup: CF006, OT004, OT005
```

#### Kapitel 37: „Die Vorabmail"
```
Scene Card
  id: SC_3_10
  pov: EVA
  ort: Kita / Druckerraum / Petra Büro
  uhrzeit: früher Morgen
  ziel: Den harten aktuellen Gegenwartsbeweis für Petra liefern.
  reader_pulse: Wann wird aus einem Foto endlich eine amtstaugliche Kette?
  main_question: Wann wird aus einem Foto endlich eine amtstaugliche Kette?
  objective: Eva will zeigen, dass Nora an den Ausflug gelangte, bevor Eltern informiert wurden.
  szenenantrieb: Eva will aus dem Fotofund einen verwertbaren Beweis machen und riskiert, dass selbst jetzt nur diffuse Plausibilität bleibt.
  scene_promise: Eva will aus dem Fotofund einen amtstauglichen Beweis machen, prüft mit Petra Druck-, Mail- und Raumzugang und gewinnt eine Kette, aber genau diese Kette zeigt, wie nah Nora schon am offiziellen Ablauf war.
  wissensgrenze: Eva weiß, dass die Vorab-Erklärung echt ist, aber noch nicht, wie sich Druck-, Mail- und Raumzugang schließen.
  information_gap: Welche konkrete Verknüpfung macht aus dem Foto mehr als bloßen Verdacht?
  pressure_clock: Wenn die Kette vor dem Ausflug nicht sauber steht, bleibt Petra im Zweifel und Nora kann als Hilfe auftauchen.
  beziehungsdruck: Eva braucht von Petra nicht mehr Mitgefühl, sondern Entschlossenheit.
  coreAction: Petra prüft Entwurfsversand, Druckhistorie, Helferschlüssel und Materialraumzugang.
  false_reading: Selbst das Foto könnte noch als peinlicher Zufall oder harmlose Vorabkenntnis weglesbar bleiben.
  dramaticBeat: Das Foto der Erklärung wird erst durch Druckjob, Entwurfszeit und Raumzugang zum harten aktuellen Beweis.
  reversal: Aus einem halbharten Foto wird eine amtlich belastbare Gegenwartskette.
  konkrete_folge: Petra zieht eine klare Linie für den Morgen; Nora verliert den Schutz des Zweifels im offiziellen Ausflugssystem.
  cost: Eva muss die letzte Stunde vor dem Zugriff ohne Restzweifel und ohne Fehlgriff durchhalten.
  status_shift: Petra wechselt von vorsichtiger Allianz zu entschlossener Amtsposition; Nora verliert den Schutz diffuser Plausibilität.
  ending: Petra sagt: „Wenn sie heute auftaucht, hole ich sie nicht als Hilfe dazu.“
  ending_type: Institutional Lock
  new_question: Wie reagiert Nora, wenn der offizielle Raum sie heute zum ersten Mal nicht als Hilfe, sondern als Risiko liest?
  bad_version_risk: Die Szene würde schwach, wenn sie nur Beweisverwaltung abhakt statt die Kette hart und gegenwärtig zusammenzuschnappen.
  revision_focus: Druckjob, Entwurf und Raumzugang nüchtern halten; keine Ermittlerpose, nur belastbare Verbindung.
  proof_object: Druckjob, Entwurfsmail und Foto der Vorab-Erklärung
  beweisobjekt: Druckjob, Entwurfsmail und Foto der Vorab-Erklärung
  nora_kosten: Noras sauberster Zug produziert die dichteste Beweiskette gegen sie.
  setup: CF003, CF004, OT001, OT002
```

#### Kapitel 38: „Rückholung"
```
Scene Card
  id: SC_3_11
  pov: EVA
  ort: Kita / Ausflugssammelpunkt
  uhrzeit: 07:30 Uhr
  ziel: Die Wahrheit unter Alltagsdruck sichtbar machen und Eva aktiv zurück in ihre Rolle führen.
  reader_pulse: Wer darf in diesem Raum endlich wieder glaubwürdig Mutter sein?
  main_question: Wer darf in diesem Raum endlich wieder glaubwürdig Mutter sein?
  objective: Eva will verhindern, dass Nora die nächste offiziell wirkende Übergabe bekommt.
  szenenantrieb: Eva bringt Beweise und Verbündete zusammen und riskiert, dass Nora sich noch einmal über Ruhe und Alltagsskript herauswindet.
  scene_promise: Eva will Nora die nächste offizielle Übergabe nehmen, bringt Beweise und Verbündete zusammen und gewinnt den Raum zurück, aber bis zum letzten Moment bleibt Nora über Ruhe und Alltagsskript gefährlich plausibel.
  wissensgrenze: Eva weiß genug für den Zugriff, nicht aber, wie Mila im Moment reagieren wird.
  information_gap: Reicht die Beweiskette unter Alltagsdruck wirklich, oder kippt der Raum wieder zugunsten der ruhigeren Frau?
  pressure_clock: Wenn Nora den Ausflugssammelpunkt noch einmal als Hilfe besetzt, wird aus Vorbereitung ein erneuter offizieller Zugriff.
  beziehungsdruck: Eva braucht von Petra Handeln und von Simon sichtbare Rückendeckung; Nora braucht nur einen letzten plausiblen Auftritt.
  coreAction: Mit Fotos, Zeitstempeln, Listen und der Vorab-Erklärung zwingt Eva Petra, nicht mehr auf Eindruck, sondern auf Muster zu schauen.
  false_reading: Nora könnte trotz allem als hilfsbereite, zurecht betroffene Person dastehen und den Raum wieder sozial gewinnen.
  dramaticBeat: Petra spricht Nora vor den anderen Eltern nicht als Helferin, sondern als unberechtigte Beteiligte an.
  reversal: Nicht Nora bekommt den offiziellen Morgen, sondern Eva zieht die Mutterautorität im selben Raum zurück.
  mila_kindmoment: Mila läuft nicht zu Nora, sondern bleibt zwischen Eva und Simon stehen und wartet, wer ihren Namen zuerst ruhig sagt.
  konkrete_folge: Nora verliert ihre soziale Plausibilität öffentlich; Eva gewinnt sichtbare Mutterautorität im selben Alltagsraum zurück, der sie vorher geschwächt hat.
  cost: Eva muss ihren Zugriff unter Blicken und vor Mila zurückholen, ohne Ausbruch und ohne falschen Ton.
  status_shift: Nora verliert die Bühne öffentlich; Eva und Simon stehen erstmals sichtbar auf derselben Seite.
  ending: Mila bleibt zwischen Eva und Simon stehen, bis Eva ihren Namen ruhig sagt. Dann geht sie zu Eva.
  ending_type: Child Echo
  new_question: Reicht dieser öffentliche Kipppunkt, damit die Wahrheit auch institutionell und sozial Bestand hat?
  bad_version_risk: Die Szene würde schwach, wenn sie in Geschrei oder Täterentlarvung kippt statt im Alltagssammelpunkt unter Blickdruck zu bleiben.
  revision_focus: Petra, Blicke und Milas Warten tragen den Klimax; keine Nachrede nach dem stärksten Kindermoment.
  proof_object: Vorab-Erklärung, Zeitstempel und Listen am Ausflugssammelpunkt
  endzustand_hook: Der Klimax muss auf Alltagsdruck und Wahlspannung enden, nicht auf Geschrei; Mila entscheidet die Luft im Raum.
  payoff: OT001, OT002, OT003, OT004
  setup: CF001, CF002, CF003, CF004, CF005, CF006, CF007
```

#### Kapitel 39: „Aussage"
```
Scene Card
  id: SC_3_12
  pov: EVA
  ort: Polizeidienststelle / Besprechungsraum
  uhrzeit: später Vormittag
  ziel: Dem Roman nach dem Zugriff juristische Schwere geben.
  reader_pulse: Reicht die Wahrheit jetzt auch außerhalb von Eva?
  main_question: Reicht die Wahrheit jetzt auch außerhalb von Eva?
  objective: Eva will, dass der Fall nicht wieder ins Missverständnis kippt.
  szenenantrieb: Eva spricht geordnet und riskiert, dass ohne offizielle Sprache alles wieder weich wird.
  scene_promise: Eva will verhindern, dass der Zugriff ins Missverständnis zurückfällt, sagt geordnet aus und gewinnt institutionelles Gewicht, aber erst jetzt wird sichtbar, wie lange sie diese Klarheit allein tragen musste.
  wissensgrenze: Eva weiß, was geschehen ist, aber noch nicht, wie die offizielle Rahmung aussehen wird.
  information_gap: Reichen Aussagen und Kette jetzt, damit die Wahrheit auch außerhalb von Eva stabil bleibt?
  pressure_clock: Wenn die Aussagephase weich wird, kann selbst der öffentliche Kipppunkt wieder als Überreaktion schrumpfen.
  beziehungsdruck: Eva braucht von Polizei und Zeugen dieselbe Klarheit, die sie so lange allein trug.
  coreAction: Eva, Simon und Petra geben Aussagen.
  false_reading: Nach dem Zugriff könnte die Sache doch wieder im Bereich von Missverständnissen, Grenzverletzung oder Aussage gegen Aussage landen.
  dramaticBeat: Die Beamtin vom früheren Besuch erkennt, dass Evas damaliges Mustergefühl präziser war als die offizielle Lage.
  reversal: Aus dem einst abgewiesenen Mustergefühl wird nachträglich institutionell bestätigte Präzision.
  konkrete_folge: Der Fall verlässt Evas private Wahrnehmung und bekommt institutionelles Gewicht.
  cost: Eva muss die ganze Geschichte noch einmal in Amtssprache durch den eigenen Körper tragen.
  status_shift: Polizei und Zeugen stützen jetzt dieselbe Kette; Eva verliert die Einsamkeit ihrer Wahrnehmung.
  ending: Nora sitzt still und blickt auf ihre gefalteten Hände.
  ending_type: Institutional Lock
  new_question: Was bleibt von Nora übrig, wenn ihre Ruhe im Amt nicht mehr als Verlässlichkeit, sondern als Aktenbestand erscheint?
  bad_version_risk: Die Szene würde schwach, wenn sie wie reiner Nachvollzug oder juristische Auflösung wirkt statt wie verspätete Außenbestätigung.
  revision_focus: Aussage geordnet, knapp und körpernah halten; die gefalteten Hände sollen den Nachhall tragen.
  proof_object: Übereinstimmende Aussagen und geordnete Beweismappe
  setup: CF003, CF005, OT005
```

#### Kapitel 40: „Der Hof"
```
Scene Card
  id: SC_3_13
  pov: EVA
  ort: Innenhof
  uhrzeit: später Abend
  ziel: Den sozialen Nachhall nach Nora lesbar machen.
  reader_pulse: Was bleibt von einer Täterin im Raum, den sie nie offiziell besessen hat?
  main_question: Was bleibt von einer Täterin im Raum, den sie nie offiziell besessen hat?
  objective: Eva will zum ersten Mal seit Tagen durch den Hof gehen, ohne sich kleiner zu machen.
  szenenantrieb: Eva will den Hof wieder betreten und riskiert, dass jede Leerstelle noch von Nora nachhallt.
  scene_promise: Eva will den Hof zurückbetreten, geht durch den sozialen Raum und gewinnt minimale Rückkehr, aber jede Leerstelle zeigt, wie stark Nora dort nie-offiziell saß.
  wissensgrenze: Eva weiß, dass Nora gestoppt ist, aber nicht, wie lange der soziale Blick nachwirkt.
  information_gap: Wie tief hat Nora sich in den Mikrosozialraum des Hauses eingeschrieben, obwohl sie ihn nie offiziell besaß?
  pressure_clock: Wenn der Hof Nora weiter nachliest, bleibt Evas Rückkehr in den Alltag sozial belastet.
  beziehungsdruck: Eva ringt nicht mehr gegen Nora direkt, sondern gegen deren Nachhall.
  coreAction: Gardinen, stockende Höflichkeit und stille Fenster zeigen, wie tief Nora im Mikrosozialen des Hauses saß.
  false_reading: Mit Noras Wegfall müsste der Hof sofort wieder neutral und unbeschwert lesbar werden.
  dramaticBeat: Im Briefkasten steckt schief ein ungesendeter, älterer Entwurf an die Kita, der klingt wie eine Mutter und eher liegenblieb als gezielt platziert wirkt.
  reversal: Aus einem vermeintlich leeren Nachraum wird sichtbar, dass Nora selbst im Hof Sprache und Muttergestus hinterlassen hat.
  konkrete_folge: Nora ist weg, aber der Hof bleibt ein lesender Raum; Evas Rückkehr in den Nahbereich ist noch nicht unbelastet.
  cost: Eva bekommt ihren Nahraum zurück, aber nicht seine Unschuld.
  status_shift: Nora verliert Präsenz, behält aber sozialen Nachhall; Eva muss Rückkehr unter Blicken vollziehen.
  ending: Eva nimmt den Entwurf mit hoch, obwohl mehrere Fenster zusehen.
  ending_type: Object Intrusion
  new_question: Wie lange bleibt Nora als gelesene Mutterfigur im Hof bestehen, obwohl sie faktisch gestoppt ist?
  bad_version_risk: Die Szene würde schwach, wenn der Hof offen feindlich wird statt still lesend und halb peinlich.
  revision_focus: Fenster, Höflichkeit und Entwurf klein halten; der Nachhall ist sozial, nicht melodramatisch.
  proof_object: Ungesendeter Hilfsentwurf
  beweisobjekt: Ungesendeter Hilfsentwurf
  setup: CF004, OT004, OT005
```

#### Kapitel 41: „Keine Dopplung"
```
Scene Card
  id: SC_3_14
  pov: EVA
  ort: Wohnung / Flur / Kinderzimmer
  uhrzeit: nächster Morgen
  ziel: Den privaten Raum über kleine Ordnungsakte zurückgewinnen.
  reader_pulse: Was wird aus Hilfe, wenn man sie endlich als Eindringen liest?
  main_question: Was wird aus Hilfe, wenn man sie endlich als Eindringen liest?
  objective: Eva will den Alltag in der Wohnung konkret zurückbauen.
  szenenantrieb: Eva sortiert Dinge aus und riskiert, dass jeder Gegenstand zeigt, wie lange sie Entlastung für Harmlosigkeit hielt.
  scene_promise: Eva will den Alltag konkret zurückbauen, sortiert doppelte Dinge aus und gewinnt eine einzige Ordnung, aber jedes Stück zeigt, wie lange Hilfe als Harmlosigkeit durchlief.
  wissensgrenze: Eva weiß, welche Dinge doppelt liefen, nicht aber, wie lange sie das übersehen hat.
  information_gap: Wie tief reicht die materielle Dopplung im Zuhause tatsächlich?
  pressure_clock: Wenn Eva die Dinge nicht jetzt sichtbar zurückbaut, bleibt Noras Ordnung selbst nach ihrem Stopp im Zuhause wirksam.
  beziehungsdruck: Eva arbeitet jetzt gegen Noras Ordnung im Zuhause, nicht mehr gegen soziale Blicke.
  coreAction: Sie sortiert doppelte Jacken, Brotdosen, Zettel, Haargummis und falsch beschriftete Reste aus.
  false_reading: Die Dinge waren nur praktische Reserve und sagen nichts über Besitz oder Ersetzung aus.
  dramaticBeat: Erst jetzt merkt sie, wie viele Dinge sie wochenlang nicht als Eindringen, sondern als Hilfe gelesen hatte.
  reversal: Aus Aufräumen wird rückwirkend Beweis darüber, wie materiell Nora den Alltag schon doppelt geführt hat.
  konkrete_folge: Der private Raum erhält wieder eine einzige Ordnung; materielle Ersetzung wird sichtbar rückgebaut.
  cost: Eva muss akzeptieren, wie lange sie Eindringen im eigenen Zuhause als Entlastung gelesen hat.
  status_shift: Nora verliert ihre letzte materielle Nachordnung; Eva gewinnt private Alltagshoheit zurück.
  ending: Am Flurhaken bleibt nur eine Regenjacke.
  ending_type: Access Loss
  new_question: Was bleibt von Nora übrig, wenn selbst die Dinge nicht mehr doppelt sprechen?
  bad_version_risk: Die Szene würde schwach, wenn sie wie Aufräum-Montage oder Symbolpolitik wirkt statt wie nüchterner Rückbau.
  revision_focus: Ding für Ding konkret halten; der Flurhaken soll das Ende still schließen, ohne Nachdeutung.
  proof_object: Ausgesonderte Doppeldinge, am Ende eine Regenjacke
  payoff: OT005
  setup: CF006, OT004, OT005
```

#### Kapitel 42: „Gelber Becher"
```
Scene Card
  id: SC_3_15
  pov: EVA
  ort: Wohnung / Bad / Küche
  uhrzeit: Morgen
  ziel: Das Ende ruhig, konkret und rückgewonnen schließen.
  reader_pulse: Wie fühlt sich Alltag an, wenn er endlich nicht mehr verteidigt werden muss?
  main_question: Wie fühlt sich Alltag an, wenn er endlich nicht mehr verteidigt werden muss?
  objective: Eva will Mila in einen normalen Morgen führen, ohne so zu tun, als sei nichts geschehen.
  szenenantrieb: Eva will keinen symbolischen Sieg, sondern einen echten Morgen mit Mila.
  scene_promise: Eva will keinen symbolischen Sieg, sondern einen echten Morgen mit Mila, antwortet auf kleine Anforderungen und gewinnt gelebte Alltagshoheit, aber genau diese Schlichtheit zeigt erst, was alles auf dem Spiel stand.
  wissensgrenze: Eva weiß, was verloren und zurückgewonnen wurde, vermutet aber nicht, dass Normalität schon wieder leicht sein kann.
  information_gap: Kann Alltag nach all dem sofort wieder leicht sein, ohne die erlittene Verschiebung zu leugnen?
  pressure_clock: Wenn der Schluss doch wieder erklärt oder symbolisch überhöht, verliert der Roman seine zurückgewonnene konkrete Autorität.
  beziehungsdruck: Eva braucht keine großen Worte mehr; zwischen ihr, Mila und Simon muss Ruhe aus echter Rückkehr entstehen.
  coreAction: Simon bringt Mila zurück. Eva antwortet langsam und ohne Hektik auf die kleinen Anforderungen des Morgens.
  false_reading: Nach allem müsste das Ende größer, erklärender oder versöhnlicher ausgestellt werden.
  dramaticBeat: Nichts Großes passiert. Gerade das macht sichtbar, was der Roman verteidigt hat.
  reversal: Aus dem Erwartungsdruck eines großen Schlusses wird die Härte eines einfachen, wieder funktionierenden Morgens.
  mila_kindmoment: Mila ruft aus dem Bad nach dem gelben Becher, ohne zu ahnen, wie viel Bedeutung dieses Objekt einmal trug.
  konkrete_folge: Eva hat Alltagshoheit nicht erklärt, sondern wieder inne; das Buch endet auf gelebter Autorität statt auf These.
  cost: Eva bekommt keinen feierlichen Abschluss, sondern nur die stille Aufgabe, Alltag wieder zu tragen.
  status_shift: Eva steht wieder selbstverständlich im Zentrum des Morgens; Nora ist aus diesem Raum endgültig verschwunden.
  ending: Eva weiß sofort, wo der gelbe Becher steht.
  ending_type: Child Echo
  new_question: Keine neue Gefahr, sondern die offene Ruhe, ob Alltag jetzt ohne Verteidigung weiterlaufen darf.
  bad_version_risk: Die Szene würde schwach, wenn sie Bedeutung erklärt oder Symbolik auflädt statt einfach im wiedergefundenen Griff zu enden.
  revision_focus: Kein Epitaph, keine Nachdeutung; der gelbe Becher und der Handgriff reichen vollständig.
  proof_object: Gelber Becher am Waschbeckenrand
  endzustand_hook: Das Ende muss klein, sicher und konkret sein: kein Statement, sondern ein wiedergefundener Alltagsgriff.
  closing_line: Eva stellt ihn auf den Rand des Waschbeckens.
  payoff: OT001, OT002, OT003, OT004, OT005
```


---

## WRITER-SUMMARIES — KAPITEL 1 BIS 42

Diese Sektion ist für den operativen Ember-Writer gedacht. Die Scene Cards bleiben der härteste Regieanker. Die folgenden Summaries verdichten frühe Kapitel so, dass Drafting nicht in Atmosphäre, Erklärung oder falsche Schwerpunkte driftet.

### Kapitel 1 — „Gestern"
**Writer Summary**
Eva sitzt heute um 16:18 Uhr im Büro in ihrer Heimatstadt, als in der Kita-App ein verspätet synchronisierter Abschlussvermerk vom Vortag auftaucht: Mila sei gestern um 15:42 Uhr von ihr abgeholt worden. Entscheidend ist der harte Alibianker: Gestern um 15:42 Uhr war Eva nachweisbar in Frankfurt. Die Szene darf Kapitel 2 nicht vorwegnehmen. Hier geht es nur um Hook, App, Kita und den ersten Schock eines protokollierten Vorgangs. Eva hält es zunächst für einen Verwaltungsfehler, ruft an und fährt sofort los. Das Kapitel endet auf dem Standbild einer Frau, die wie Eva aussieht. Nicht auf Analyse, nicht auf Erklärung, sondern auf diesem eingefrorenen Angriff auf Identität.

**Director Note**
Kein psychologischer Vorlauf. Kapitel 1 muss vom normalen Arbeitstakt in dokumentierten Schock kippen und den Frankfurt-Alibi-Anker sauber setzen.

### Kapitel 2 — „Das Bild"
**Writer Summary**
Im Leitungsbüro versucht Eva, das Material zu entwerten. Kapitel 2 darf nicht wiederholen, was Kapitel 1 schon getan hat. Es zeigt nicht noch einmal den Schock, sondern die soziale Beweiskraft des halb sauberen Materials. Gesicht und Video bleiben uneindeutig. Aber Mantel, Haltung, Becher, Routine und eine ähnliche Unterschrift reichen, damit Petra vernünftigerweise Simon einbeziehen muss. Genau diese Ruhe ist der Schrecken. Petra darf nicht kalt oder böse wirken. Sie handelt professionell. Eva begreift hier zum ersten Mal, dass nicht Wahrheit nötig ist, sondern nur genügend Plausibilität, um ihre Mutterrolle für andere riskant erscheinen zu lassen. Ende auf Petras ruhiger Bitte, Simon zu informieren.

**Director Note**
Der Horror liegt nicht im Video selbst, sondern darin, dass es für den Alltag reicht.

### Kapitel 3 — „Bitte fahr nicht allein"
**Writer Summary**
Auf dem Parkplatz versucht Eva, Simon die Lage zu erklären, ohne sich selbst klein oder panisch zu machen. Simon reagiert beschützend, aber bereits verfahrensnah; Nora dagegen reagiert weich, schnell und sofort verfügbar. Diese Szene setzt die beiden zentralen Vertrauensachsen gegeneinander. Nora soll hier noch nicht als offen verdächtig wirken, aber sie weiss bereits zu viel. Die Szene endet mit einem kleinen falschen Alltagsdetail in Milas Fach, das den Verdacht vom Vorfall zum Muster verschiebt.

### Kapitel 4 — „Die Liste"
**Writer Summary**
Eva prüft zuhause App, Kalender, Ausdrucke und Notfallkontakte, um irgendwo einen klaren Fehler zu finden. Statt eines einzelnen Fehlers entdeckt sie, dass Nora auf einer alten Reserveliste noch als Kontakt auftaucht. Parallel dringt Nora über Hilfe in die Szene: Suppe, Verfügbarkeit, Nahversorgung. Dabei nennt sie ein Detail aus Milas Garderobe, das sie nicht wissen dürfte. Die Szene endet mit einem physischen Zeichen von Zutritt: Milas Ersatzjacke hängt bereits in Evas Flur.

### Kapitel 5 — „Schriftlich"
**Writer Summary**
Die Kita reagiert auf den Vorfall mit schriftlicher Absicherung. Das ist für Eva eigentlich Schutz, wirkt aber faktisch wie ein Filter, durch den sie sich plötzlich rechtfertigen muss. Petra zeigt eine alte Vollmacht mit Evas früherer Unterschrift und Noras Kontaktrolle. Eva merkt, dass sich alltagsnahe Schlampigkeit jetzt gegen sie wendet. Auf dem Rückweg sieht sie Nora mit einem Objekt aus Milas Kita-Alltag, das deren Nähe bestätigt. Ende auf Beobachtung, nicht auf Diskussion.

**Director Note**
Die Szene soll nicht nach "Institution gegen Mutter" klingen. Sie soll zeigen, wie formale Vorsicht eine ohnehin geschwächte Position weiter ausdünnt.

### Kapitel 6 — „Verlegt"
**Writer Summary**
Eva testet, ob der Eingriff nur die Kita betrifft oder schon tiefer in ihren Alltag reicht. Kinderarzttermin, Rezept und Supermarktbeobachtung zeigen, dass neben ihrem eigenen Tageslauf ein zweiter alltagsnaher Lauf existiert. Jedes Detail ist für sich klein, gemeinsam aber verstörend. Wichtig ist, dass Simon hier erstmals selbst einen Fakt prüft und in der Praxis anruft, bevor er wieder in Vorsicht ausweicht. Die Szene endet mit seiner Frage, ob Eva sicher sei, sich nicht zu täuschen.

### Kapitel 7 — „Stabil"
**Writer Summary**
Eva sucht Simon persönlich auf und will ihn auf ihre Seite ziehen. Statt offen gegen sie zu stehen, argumentiert er aus Schutzlogik und denkt in Stabilität für Mila. Nora taucht zufällig, ruhig und sozial glaubwürdig auf dem Spielplatz auf; Mila begrüsst sie mit geübter Selbstverständlichkeit. Genau dadurch kippt die Gefahr vom abstrakten Verdacht in einen sozialen Realitätsverlust. Die Szene endet mit Simons Vorschlag, Mila vorerst selbst abzuholen.

### Kapitel 8 — „Die Akte über Nora"
**Writer Summary**
Eva sammelt erstmals Material über Nora, bekommt aber bewusst keine bequeme Akteneinsicht. Stattdessen erfährt sie nur indirekt von einem früheren Sorgekonflikt, in dem nicht Lautstärke, sondern administrative Glaubwürdigkeit entscheidend war. Genau dadurch wird klar, dass Nora Strukturen lesen und nutzen kann, ohne dass der Roman seinen Alltagsrealismus verliert. Zuhause wartet bereits das nächste kleine Zeichen nachträglicher Alltagsbesetzung: Milas Brotdose steht gespült in Evas Küche, obwohl Mila gar nicht bei ihr war. Ende auf dieser stillen Grenzüberschreitung.

### Kapitel 9 — „Der Ersatzschlüssel"
**Writer Summary**
Eva beginnt, nicht nur digitale und soziale, sondern physische Zutritte zu prüfen. Dabei erinnert sie sich an die Zeit der Trennung, als Nora legitimen Zugang zur Wohnung hatte. Der Reservezugang ist offiziell beendet, aber Spuren am Säckchen im Keller deuten auf späteren Kontakt. Wichtig ist hier, dass Eva nicht passiv bleibt: Sie wechselt den Schliesszylinder noch in derselben Nacht und merkt trotzdem, dass der eigentliche Schaden längst in kopierten Routinen und alten Zutritten liegt. Die Szene endet mit Noras beiläufiger Bemerkung über das klemmende Schloss.

### Kapitel 10 — „Elternabend"
**Writer Summary**
Eva geht zum Elternabend, weil normale Sichtbarkeit ihre Position stabilisieren könnte. Stattdessen merkt sie, wie vorsichtig andere Eltern bereits mit ihr umgehen. Nora ist offiziell gar nicht Teil dieses Raums und weiss trotzdem Dinge, die erst dort ausgesprochen werden. Ihre praktische Entlastung wirkt dadurch nicht nett, sondern dominant. Die Szene endet mit der vor Evas Wohnung abgelegten Regenhose für den noch nicht kommunizierten Waldtag.

### Kapitel 11 — „Die Stimme"
**Writer Summary**
Eva untersucht, warum die Erzieherinnen die angebliche Abholung nicht nur gesehen, sondern auch stimmlich für plausibel hielten. Alte Voicemails, Hofvideos und beiläufige Aufnahmen zeigen, wie oft Nora über normale Nähe an Evas Formulierungen gekommen ist. Der Schrecken liegt darin, dass nichts davon wie Vorbereitung wirkte, als es passierte. Es geht hier nicht um Technik oder Fälschungszauber, sondern um gesammelte Alltagssätze, wiederholte Kurzformeln und vertraute Tonlagen. Wichtig ist, dass der Leser spürt: Nora hat keine Stimme gebaut, sondern Harmlosigkeit archiviert. Diese Szene muss das alltagsrealistisch und kühl machen. Sie endet mit dem Wiederauftauchen genau eines passenden Satzes im Abholprotokoll.

**Director Note**
Keine Technikszene. Nähe, Wiederholung und der Missbrauch früherer Selbstverständlichkeit tragen die Wirkung.

### Kapitel 12 — „Ein guter Vorschlag"
**Writer Summary**
Simon meldet sich mit einem organisatorisch vernünftigen Vorschlag, der in Wahrheit Noras Position formalisiert. Wichtig ist, dass er hier nicht nur wegrelativiert, sondern selbst eine erste kleine Grenze ziehen will: ohne direkte Bestätigung der Eltern soll Nora Mila nirgends allein übernehmen. Genau diese halb kluge, halb zu späte Vorsicht macht ihn glaubhaft. Eva merkt trotzdem, dass sie nun nicht mehr nur gegen einen Vorfall kämpft, sondern gegen die schleichende Normalisierung von Nora als zuständiger Person. Mila selbst macht die Lage emotional real, indem sie "Nora-Montag" als etwas Geübtes behandelt. Das Ende soll klein sein, aber brutal: ein Kind nennt eine Routine, die Eva nie eingeführt hat.

**Director Note**
Keine melodramatische Szene zwischen Eva und Simon. Der Schmerz liegt darin, dass der Vorschlag für einen Aussenstehenden wirklich gut klingt.

### Kapitel 13 — „Dienstagstasche"
**Writer Summary**
Eva will an Milas gepackter Tasche endlich wieder etwas kontrollieren, das konkret und banal ist. Stattdessen entdeckt sie darin eine perfekt imitierte Mutterroutine: Dinge, die sie selbst genauso hätte packen können, nur mit kleinen Verschiebungen. Die Szene soll zeigen, dass Ersetzung nicht nur über grosse Eingriffe läuft, sondern über Körpernähe und Wiederholung. Der Notizzettel ist zentral, weil er Evas Handschriftlogik imitiert, aber in Sprache an Nora verrät. Ende auf der Erkenntnis, dass selbst Milas Tasche bereits doppelt geführt wird.

### Kapitel 14 — „Protokoll"
**Writer Summary**
Eva geht von Reaktion in Dokumentation. Sie setzt sich an den Tisch und baut aus Uhrzeiten, Gegenständen, Nachrichten und Zeugen erstmals eine eigene Chronologie. Diese Szene soll kein stilles Denken sein, sondern aktives Scharfstellen: Je mehr Ordnung Eva schafft, desto sichtbarer wird das Muster. Wichtig ist, dass die Leser mit ihr erstmals nicht nur Einzelvorfälle, sondern eine Struktur erkennen. Die Szene endet mit dem kleinen, fast obszönen Echo von Noras markierter Einkaufsliste am Drucker.
Wichtig ist dabei: kein perfekt lesbarer Spiegelmoment, sondern ein halb abgeschnittener, zufälliger Druckrest, der gerade deshalb real wirkt.

### Kapitel 15 — „Der falsche Nachmittag"
**Writer Summary**
Eva bringt ihre Chronologie zu Petra und hofft, dass endlich jemand die Linie erkennt. Petra nimmt sie ernster als bisher, kann vor dem Wochenende aber nichts formell hart genug ändern. Der eigentliche Schlag kommt von Simon. Wichtig ist: Er nimmt Mila Eva nicht wie ein Antagonist weg. Er weitet ein ohnehin geplantes Umgangswochenende oder eine temporäre Übergangsregel aus, weil ihm die Lage zu instabil erscheint. Genau deshalb tut es weh. Seine Entscheidung klingt vernünftig und kostet Eva trotzdem realen Zugriff auf die nächste Woche. Das Kapitel schließt Act 1 kalt und plausibel, nicht melodramatisch. Nora muss am Ende nicht punktgenau schon warten. Stärker ist, wenn sie erst sichtbar wird, als der Wagen fast schon aus dem Hof ist: nah genug für Stich, aber nicht magisch getaktet.

**Director Note**
Nicht auf bösen Ex schreiben. Schutzlogik ist hier gefährlicher als offene Feindseligkeit.

### Kapitel 16 — „Die Woche bei Simon"
**Writer Summary**
Die leere Wohnung und der gefilterte Kontakt zu Mila markieren einen neuen Romanzustand: Eva ist nicht mehr im Zentrum ihres eigenen Alltags. Jedes Bild und jede Nachricht läuft jetzt über andere. Nora nutzt diese Distanz, indem sie mit kleinen hilfreichen Infos und Fotos in die Lücke geht. Entscheidend ist hier nicht ein lauter Angriff, sondern die Demütigung durch Vermittlung. Wichtig ist eine konkrete Folge: Selbst Trost und Beruhigung für Mila werden Eva nicht mehr direkt zugetraut, sondern über Simon und Nora gefiltert. Ende auf der Einsicht, dass Nora bereits als technischer und sozialer Kontakt in Simons System sitzt.

### Kapitel 17 — „Gespeicherter Alltag"
**Writer Summary**
Das Fusionskapitel bündelt Hofbeobachtung, Waschküche, Namensetiketten und den digitalen Restzugriff des Familienalbums zu einer einzigen Erkenntnisbewegung. Eva begreift, dass Nora nicht nur beobachtet hat, sondern gespeichert, abgelegt und alte legale Freigaben viel länger genutzt hat, als irgendjemand noch mitdachte. Wichtig ist: kein Hackerkino. Die Bedrohung kommt aus liegengebliebenem Vertrauen, geteilten Alben, Beschriftungsresten und einem Alltag, den Nora archiviert hat. Mila bleibt auch hier Kind: ein altes Wort oder Bechername zeigt, dass Noras Ordnung bereits in Benennungen steckt. Das Kapitel endet nicht nur auf Erkenntnis, sondern auf Handlung. Eva kappt reale Freigaben, ändert Passwörter und nimmt Nora einen stillen Kanal.

**Director Note**
Das Kapitel darf dichter und länger sein als der Durchschnitt. Nicht hetzen. Beobachtung und digitaler Zugriff gehören in dieselbe Bewegung.

### Kapitel 18 — „Die alte Mutter"
**Writer Summary**
Eva verfolgt Noras Vergangenheit nicht aus Neugier, sondern weil sie das Motiv verstehen muss, um die Gegenwart zu stoppen. Die Beratungsstelle gibt ihr keine Enthüllung, sondern eine Formulierung, die das ganze Buch neu rahmt: Stabilität ist ein Urteil, keine Wahrheit. Wichtig ist, dass Nora hier nicht entschuldigt wird. Ihre Wunde erklärt ihre Logik, nicht ihre Unschuld. Die Szene endet auf Evas Erkenntnis, dass Nora nicht nur Mila, sondern das Urteil über Mütter angreift.

**Director Note**
Die Szene darf kein Exkurs werden. Keine Sozialdrama-Ausfaltung. Nur so viel Vergangenheit wie nötig, um Noras Gegenwartslogik schärfer zu machen.

### Kapitel 19 — „Zugang"
**Writer Summary**
Eva spricht mit Petra nicht mehr über Gefühle, sondern über Prozesse, Helferdienste, Mappen, Drucker und Sichtachsen. Die Szene ist wichtig, weil sie zeigt, dass freundliche Elternkultur ein reales Einfallstor sein kann. Petra muss hier erstmals selbst spüren, dass ihre Einrichtung nicht nur getäuscht, sondern strukturell ausgenutzt wurde. Der gelöschte Scanlauf ist kein Knallbeweis, aber ein härterer materieller Marker als bisher. Zugleich braucht die Szene eine kleine reale Folge: Petra zieht offene Mappen ein, schliesst Schrank und Raumhaushalt enger. Noch kein Sieg für Eva, aber erstmals institutioneller Gegendruck.

### Kapitel 20 — „Der erste Fehler"
**Writer Summary**
Nora macht zum ersten Mal einen objektiv greifbaren Fehler, aber noch keinen grossen. Das ist wichtig: Der Roman darf sie nicht plötzlich dumm machen. Der falsche Erdbeerbezug und Milas leises "den weissen wie immer" zeigen, dass selbst eine minutiös vorbereitete Ersatzmutter nie vollkommen identisch sein kann. Noch wichtiger ist die hastige Korrektur direkt danach: Nora will den Fehler sofort wieder in Souveränität verwandeln. Simon glaubt Eva für einen kurzen Moment sichtbar mehr als Nora und zieht sich dann doch aus Schutzlogik auf Vernunft zurück. Ende auf seiner Relativierung, weil genau diese Weigerung die Bedrohung weiter am Leben hält.

**Director Note**
Der Fehler bleibt klein, alltagsnah und sofort repariert. Entscheidend ist nicht Entlarvung, sondern der kurze Riss bei Simon und Milas beiläufige Gegenwart als Kind, nicht als Beweisobjekt.

### Kapitel 21 — „Nicht jetzt"
**Writer Summary**
Eva sucht erneut institutionelle Hilfe, diesmal mit besserem Material, bekommt aber wieder nur eine halb offene Tür. Die Szene soll nicht zeigen, dass Polizei unfähig ist, sondern dass das Beweisniveau noch immer zwischen unheimlich und belastbar hängt. Der Rat, Mila möglichst aus offenen Zugriffslinien zu ziehen, ist bitter, weil Eva genau dadurch weiter ausgedünnt wird. Wichtig ist eine direkte Folge: Simon zentralisiert danach noch mehr Übergaben und Kommunikation bei sich. Der Kinderaufkleber am Auto zieht die Szene am Ende aus dem Bürokratischen ins Körpernahe. Jemand war wieder an einer Grenze ihres Alltags.

### Kapitel 22 — „Ersatzplan"
**Writer Summary**
Eva geht jetzt endlich selbst in eine aktive Gegenstrategie. Das ist der Wechsel von bedrängter Mutter zu handelnder Gegenspielerin. Papierheft, Einwegtelefon, isolierte Kanäle: alles soll zeigen, dass sie Noras Zugriff über normale Vernetztheit unterbricht. Die Falschinformation über den Donnerstag ist deshalb so stark, weil sie simpel und prüfbar ist. Die Szene endet, sobald Nora darauf reagiert, nicht erst nach langer Auswertung.

**Director Note**
Die Szene soll entschlossen wirken, nicht clever-cool. Eva baut keinen Agentenplan, sondern eine plausible Selbstschutzstrategie aus Alltagsmitteln.

### Kapitel 23 — „Doppelte Versorgung"
**Writer Summary**
Das Fusionskapitel verbindet Kinderarztpraxis und zweite Jacke zu einer einzigen Logik: Nora erscheint in Vertrauensraum und Gegenstand als vernünftige Reserve. In der Praxis wirkt eine ruhige, plausible Frau stärker als Evas Verdacht. Später hängt bei Simon eine zweite Regenjacke, die Milas Alltag scheinbar nur absichert. Genau darin liegt der Schrecken. Mila greift kindlich zur falschen Jacke oder benennt die Routine so, als sei Dopplung normal. Simon sieht den Riss kurz und erklärt ihn im nächsten Atemzug wieder als vernünftig. Wichtig ist die reale Folge: Evas Status sinkt sowohl im Praxisraum als auch im Simon-System. Der kleine Etikett- oder Datumsfehler bleibt als späterer Rückbeweis stehen.

**Director Note**
Das Kapitel darf länger werden als der Durchschnitt. Praxis und Jacke müssen wie ein einziges Versorgungssystem gelesen werden.

### Kapitel 24 — „Die Nacht vor Freitag"
**Writer Summary**
Eva bereitet sich auf den nächsten Morgen vor, als hinge alles an Disziplin und Wachheit. Die Szene muss Schlafmangel, Körperspannung und Überwachung spürbar machen, ohne in reines Paranoiaflimmern zu kippen. Die wiederaufgetauchte Schlafhose ist das zentrale Objekt: kein spektakulärer Angriff, sondern ein intimer Rückgriff auf etwas, das nur durch Zutritt und Vorausdenken wieder an ihren Ort gelangt. Die Szene endet auf einer fast körperlichen Erkenntnis von Synchronisation: Nora kennt sogar Evas Wecklogik.

### Kapitel 25 — „Die Unterschrift"
**Writer Summary**
Eva will ihre Vermutung endlich auf ein präziseres Niveau heben und holt sich Hilfe von jemandem, der Routineunterschriften lesen kann. Wichtig ist, dass die Szene nicht wie Forensikshow wirkt, sondern wie nüchterne Alltagsanalyse. Der Kern ist nicht "Fälschung" im großen Stil, sondern das Nachbauen archivierter Gewohnheiten. Als Eva erkennt, dass Nora eine ältere Version von ihr kopiert, wird die Ersetzung noch unheimlicher: nicht nur ihr Alltag, auch ihre Vergangenheit wurde mitverwendet. Ende auf dieser Zeitverschiebung.

### Kapitel 26 — „Die Probe"
**Writer Summary**
Die Falschinformation über die frühe Abholung ist Evas erste aktive Gegenfalle mit echtem Risiko. Die Szene muss zeigen, dass ihre Strategie simpel, glaubwürdig und überprüfbar ist. Der stärkste Moment ist nicht Noras Nachfrage allein, sondern dass Simon sie selbst hört und nicht mehr wegargumentieren kann. Hier verschiebt sich die Romanstatik spürbar. Die Szene endet auf Simons erstem echten Mitwissen, nicht auf Triumph.

**Director Note**
Keine Genugtuung spielen. Eva gewinnt hier noch nichts zurück. Sie erzwingt nur, dass Simon die Logik endlich mitsehen muss.

### Kapitel 27 — „Nicht unzuverlässig, sondern ersetzt"
**Writer Summary**
Dieses Fusionskapitel ist Midpoint und Umschaltmoment zugleich. Eva liest die Hilfe rückwärts: Chats, Schlüssel, Wäsche, Arzt, Kita, Pakete, kleine Übernahmen. Der Roman ordnet sich jetzt neu. Nicht über einen großen Einbruch, sondern über hundert vernünftige Einladungen. Wichtig ist, dass Hilfe damals real und sinnvoll wirkte. Gerade das macht die Tragik. Eva baut aus dem Archiv keine bloße Erkenntnis, sondern eine Streichliste für Freigaben, Kontaktwege, Schlüssel und Gewohnheiten. Danach legt sie Simon nicht mehr Vorfälle, sondern Logik vor. Der entscheidende Satz ist nicht „Sie nimmt mir Mila weg“, sondern sinngemäß: „Sie schreibt mich aus unserem Alltag heraus.“ Simon widerspricht nicht mehr. Ende auf Noras ruhiger Nachricht und auf dem Gefühl, dass Beschleunigung begonnen hat.

**Director Note**
Das Kapitel darf länger werden als der Durchschnitt. Es ist kein Fall-Review, sondern ein Beziehungs- und Systemmoment.

### Kapitel 28 — „Die Generalprobe"
**Writer Summary**
Nach dem Midpoint wird sichtbar, dass Nora nicht auf einen einmaligen Zugriff setzt, sondern tägliche Übergaben und Selbstverständlichkeiten probt. Eva will Mila selbst bringen, doch schon vor dem Verlassen der Wohnung wird ihre Route unterlaufen. Die Szene lebt davon, wie früh und weich Nora in den Morgen greift. Mila soll hier nicht "gegen Eva" sein, sondern die neue Routine unschuldig mittragen. Ende auf der Frage des Kindes, weil genau darin die größte Verletzung liegt.

### Kapitel 29 — „Das Wochenende danach"
**Writer Summary**
Diese Szene zeigt den Preis der Ersetzung direkt im Kind, ohne Mila zu instrumentalisieren. Eva erlebt, dass Nora nicht nur Dinge und Wege kopiert, sondern bereits Sprachrhythmen und kleine Verhaltensmuster im Alltag des Kindes verankert hat. Das darf still und schmerzhaft sein, nicht hysterisch. Der Schock liegt darin, dass nichts offen feindlich wirkt. Wichtig ist hier ein erster indirekter Blick auf Noras Moral: Mila wiederholt einen Satz oder Ablauf, in dem Verlässlichkeit höher gewichtet wird als Gefühl. Ende auf Evas Erkenntnis, dass sogar Trost und Gewöhnung schon Konkurrenz haben.

### Kapitel 30 — „Abgemeldet"
**Writer Summary**
Die Ausloggung aus der Kita-App ist ein sauberer, harter Eingriff in Evas Mutterrolle. Nicht weil eine App an sich wichtig wäre, sondern weil sie Information, Organisation und Legitimation bündelt. Wichtig ist hier kein altmodischer Hackermechanismus, sondern ein menschlicher Verwaltungsprozess: ein plausibler Telefonanruf, ein altes Postfach, ein intimes Alltagsdetail, das bei der Rückfrage Vertrauen erzeugt. Die Szene endet nicht mit Technikfrust, sondern mit verletzter Nähe.

### Kapitel 31 — „Petra"
**Writer Summary**
Eva geht zu Petra nicht mehr als verletzte Mutter, sondern mit einer Matrix aus Beweisen und Mustern. Petra muss hier nicht sofort Verbündete werden, aber sie muss erstmals selbst sehen, dass das Problem nicht Evas Nervosität ist. Die Szene lebt vom Übergang institutioneller Skepsis zu vorsichtiger Allianz. Wichtig ist, dass Petra weiterhin professionell bleibt. Gerade ihre Vorsicht macht ihren späteren Beistand glaubwürdig. Die Szene braucht deshalb eine kleine, sofort prüfbare Folge: strengere Helferregeln für den Ausflug. Ende trotzdem auf der Grenze dessen, was sie ohne frischen Anlass tun kann.

### Kapitel 32 — „Das ruhige Gesicht"
**Writer Summary**
Im Dreiergespräch zeigt Nora ihre grösste Stärke: nicht Lautstärke, sondern kontrollierte Selbstzurücknahme. Für einen Moment muss Eva fast aggressiver wirken als Nora, obwohl sie recht hat. Das macht die Szene so gefährlich. Nora darf hier nicht entlarvend sprechen, sondern fast zu vernünftig sein. Gleichzeitig muss die Szene einen zweiten indirekten Vorgriff auf Kapitel 35 leisten: Nora soll in einem scheinbar harmlosen Satz verraten, dass für sie Verlässlichkeit mehr zählt als Bindung. Der eingesteckte Zettel am Ende ist deshalb wichtig: die eigentliche Invasion geschieht wieder leise, nah und ohne Zeugen.

**Director Note**
Nora darf in dieser Szene nicht "böse" schreiben. Ihre Ruhe ist ihre Waffe. Der Leser soll spüren, wie schwer es ist, eine so kontrollierte Person im offenen Raum plausibel zu beschuldigen.

### Kapitel 33 — „Simon sieht es"
**Writer Summary**
Diese Szene ist der eigentliche persönliche Durchbruch auf Simons Seite. Nicht Eva überzeugt ihn rhetorisch, sondern ein kleines zeitliches Unmöglichkeitsfenster. Wichtig ist, dass Simon hier nicht plötzlich sentimental wird, sondern unter dem Gewicht der Fakten kippt. Der Satz "Sie wusste etwas, das sie nicht wissen konnte" muss wie ein nüchterner, aber endgültiger Einschnitt wirken. Noch wichtiger: Simon muss begreifen, dass seine eigene Stabilitätslogik Nora mitgestützt hat. Die Szene endet auf Handlung: Er nimmt den Ordner mit und wird Teil von Evas Gegenbewegung.

### Kapitel 34 — „Vor dem Ausflug"
**Writer Summary**
Eva und Simon bereiten den Gegenschlag so vor, dass er institutionell belastbar ist. Diese Szene darf nicht wie Heist-Planung wirken, sondern wie kontrolliertes Ordnen unter Zeitdruck. Entscheidend ist die Erkenntnis, dass der Kita-Ausflug die ideale nächste offizielle Übergabe für Nora wäre. Der rote Eintrag in Noras Kalender verstärkt das nicht als großes Überwachungssignal, sondern als stillen Beweis von Absicht. Ende auf diesem Blick in den Plan der Gegenseite.

### Kapitel 35 — „Noras Wohnung"
**Writer Summary**
Eva geht nicht heimlich in Noras Wohnung. Nora lässt sie hinein, weil sie glaubt, in ihrem eigenen geordneten Raum moralisch überlegen zu bleiben. Das ist wichtig für die Plausibilität. In der Wohnung stehen Milas Dinge nicht als Trophäen, sondern als fast plausible Parallelordnung. Genau darin liegt der Horror. Nora erklärt sich nicht als Monster, sondern über Verlässlichkeit. Ihr Satz über Fürsorge und Zuverlässigkeit muss den ganzen Roman rückwirkend umcodieren. Gleichzeitig bleibt der Fund halbhart: die vorab ausgefüllte Ausflugserklärung ist noch kein Vollbeweis, sondern erst durch Kapitel 37 institutionell belastbar. Eva reagiert nicht mit Showdown, sondern mit Kontrolle. Sie fotografiert das Blatt und nimmt Noras Ordnung endlich ohne Nachbarschaftsfilter wahr.

**Director Note**
Kein Thriller-Showdown. Der Schrecken liegt in plausibler Ersatznormalität und ruhiger moralischer Selbstrechtfertigung.

### Kapitel 36 — „Keine Gestik"
**Writer Summary**
Nach Kapitel 35 darf Eva nicht in bloße Panik kippen. Diese Szene ist ihre Härteprobe. Sie sortiert, sichert, informiert und verweigert Nora die Reaktion, auf die diese wahrscheinlich gesetzt hat. Wichtig ist hier die Verlagerung von Gefühl in Handlung. Die Drohnachricht am Ende funktioniert nur, wenn Eva vorher sichtbar ruhig geworden ist. Nicht Mut, sondern Disziplin ist hier ihre Gegenmacht.

### Kapitel 37 — „Die Vorabmail"
**Writer Summary**
Eva und Petra ziehen jetzt den harten aktuellen Beweis aus dem Vorabwissen um den Ausflug. Die Szene muss zeigen, wie aus Verdacht prüfbare Struktur wird: Druckjob, Entwurfsmail, Materialraum, Helferschlüssel, Zeitfenster, Foto. Petra wird hier endgültig vom vorsichtigen Gegenüber zur professionellen Verbündeten. Wichtig ist, dass der Beweis nicht aus Geständnis, sondern aus einer Kette kleiner Verwaltungsrealitäten entsteht. Ende auf Petras klarer Linie für den kommenden Morgen.

### Kapitel 38 — „Rückholung"
**Writer Summary**
Das ist der klimatische Zugriff des Romans, aber im Ton des Buches: kein lauter Showdown, sondern ein öffentlicher Alltagsraum, in dem plötzlich anders gelesen wird, was bisher plausibel war. Eva bringt Beweise, Simon Rückendeckung und Petra institutionelle Handlung zusammen. Nora bleibt ruhig, bis diese Ruhe erstmals nicht mehr als Verlässlichkeit funktioniert. Mila entscheidet die Szene nicht bewusst, sondern durch ihr Warten: Sie bleibt zwischen Eva und Simon stehen, bis Eva ihren Namen ruhig sagt. Erst dann geht sie zu ihr. Genau das ist das Ending dieses Kapitels. Die Szene endet auf zurückgewonnener, aber noch verletzlicher Ordnung.

**Director Note**
Nicht auf großes Geschrei schreiben. Dieselbe Alltagsbühne, die Eva vorher geschwächt hat, darf Nora jetzt nicht mehr schützen.

### Kapitel 39 — „Aussage"
**Writer Summary**
Nach dem Zugriff braucht der Roman noch juristisches und soziales Gewicht. Diese Szene verhindert, dass Kapitel 38 wie eine reine emotionale Auflösung wirkt. Aussage, Protokoll und Wiederholung machen sichtbar, wie oft alle Ruhe mit Glaubwürdigkeit verwechselt haben. Wichtig ist, dass Eva hier nicht triumphiert. Der Blick auf Nora am Ende soll zeigen, dass der Fall jetzt außerhalb ihrer privaten Wahrnehmung real geworden ist.

### Kapitel 40 — „Der Hof"
**Writer Summary**
Der Hof nach der Enthüllung darf nicht sofort heilsam wirken. Er muss derselbe Ort bleiben, nur anders gelesen. Briefkästen, Gardinen, Nachbarblicke, stockende Höflichkeit und Leerräume zeigen, wie tief Nora im Mikrosozialen dieses Hauses verankert war. Der ungesendete Entwurf im Briefkasten ist wichtig, weil er noch einmal zeigt, wie mütterlich Nora klingen konnte, ohne Mutter zu sein. Diese Szene gehört klar dem sozialen Nachhall: Eva wird noch gesehen, geprüft und mitgelesen. Sie endet nicht auf Zerstörung, sondern auf Mitnahme: Eva trägt diesen Rest der Fremdschrift mit nach oben.

**Director Note**
Kapitel 40 ist der soziale Raum nach Nora, nicht schon der private Wiederaufbau. Wenn sich die Szene wie Heilung im Zuhause anfühlt, arbeitet sie gegen Kapitel 41.

### Kapitel 41 — „Keine Dopplung"
**Writer Summary**
Diese Szene ist keine Nachputzarbeit, sondern thematischer Rückgewinnungsakt. Eva räumt nicht symbolisch auf, sondern entfernt reale Dopplungen: Jacken, Zettel, Behälter, Etiketten, Routinereste. Gerade diese kleinen Dinge zeigen, was der Roman eigentlich verteidigt hat. Wichtig ist, dass Eva dabei auch ihre eigene frühere Blindheit erkennt, ohne sich in Selbstvorwürfen zu verlieren. Im Unterschied zum Hof gehört diese Szene ganz dem privaten Raum: keine Nachbarn, keine Fenster, keine soziale Auswertung mehr. Ende auf dem einzelnen Haken mit der einen Jacke.

**Director Note**
Kapitel 41 darf die Arbeit von Kapitel 40 nicht wiederholen. Jetzt geht es nicht mehr um soziale Lesbarkeit, sondern um materielle Ordnung und die Rueckeroberung des eigenen Zuhauses.

### Kapitel 42 — „Gelber Becher"
**Writer Summary**
Das Ende muss klein, klar und endgültig sein. Kein Nachkommentar über Mutterschaft, keine große Aussprache. Der Morgen mit Mila und Simon zeigt, dass Normalität nicht unversehrt, aber wieder möglich ist. Mila ruft nach dem gelben Becher wie nach einem normalen Gebrauchsgegenstand. Genau darin liegt die Wirkung. Der Becher trägt den ganzen Roman als Alltagsbild, ohne dass der Text das aussprechen muss. Eva weiß sofort, wo er steht. Das ist keine These, sondern gelebte Autorität. Der letzte Satz bleibt ein Bild.

**Director Note**
Nicht übererklären. Ruhe ist hier kein Leerlauf, sondern die verdiente Form des Endes.

---

## OPERATIVE HINWEISE FUER EMBER

### Praktische Reihenfolge vor jedem Szenen-Draft
1. Passende `Scene Card` prüfen.
2. Relevante Alltagsbeweise und Trigger in den `Canon Facts` prüfen.
3. Diese Objekte explizit in `Summary` und `Scene Card` halten.
4. Nur dann eine `Director Note` setzen, wenn wirklich laufbezogene Feinkorrekturen nötig sind.
5. Keine Director Note verwenden, um fehlende Scene-Card-Substanz zu überdecken.

### Copy-Paste Writer Constitution (geschärft)
- Nahe dritte Person auf Eva. Keine allwissende Erklärstimme.
- Szenen steigen spät ein und gehen früh raus.
- Nach einem Proof-Image, Evidenzturn oder klaren Machtwechsel endet die Szene sofort. Kein Echo-Absatz.
- Im Mittelteil nie länger als zwei reine Indizszenen hintereinander. Danach braucht es eine reale Folge für Zugriff, Loyalität, Institution oder Kinderroutine.
- Die Übergänge zwischen Szenen müssen kausal lesbar sein. Beim Durchsehen muss zwischen zwei Kapiteln eher `deshalb` oder `aber` passen als `und dann`.
- Wenn Objekt, Blick, Geste oder Verwaltungsdetail die Wirkung bereits trägt, folgt kein erklärender Satz.
- Keine drei Atmosphärenbeobachtungen vor dem eigentlichen Schlag. Binnenprosa nur unter Zug.
- Raum, Körper und Stimmung nur dann ausführen, wenn sie Beweislage, Glaubwürdigkeit, Zugriff oder Routine verändern.
- Nora bleibt früh sozial plausibel, hilfreich lesbar und nie zu perfekt kuratiert bedrohlich.
- Nora darf nie wie eine folgenlose Alltags-Supertäterin wirken. Jeder grössere Zug hinterlässt Restfehler, Gegendruck oder engeren Spielraum.
- Eva unter Druck präzise, aber leicht überladen. Ihre Wahrnehmung darf kurz stolpern, ohne hysterisch zu werden.
- Simon handelt aus Schutzlogik, Petra aus professioneller Vorsicht. Beide sind Menschen, keine Plotmaschinen. Wenn sie falsch reagieren, muss das Eva konkret etwas kosten.
- Simon braucht vor seinem späten Kippmoment mindestens eine frühere aktive Fehlentscheidung, die aus Schutzlogik plausibel ist und Eva real Zugriff nimmt.
- Objektspannung vor Reflexion. Dinge müssen zuerst handeln, bevor Gedanken sie ausdeuten.
- Jede Szene verschiebt mindestens eines: Beweislage, Glaubwürdigkeit, Zugriff aufs Kind, Alltagsroutine oder Loyalität.
- Dialog darf nie bloss atmosphärisch sein; er muss Vertrauen, Verfahren oder Zugriff verschieben.
- Bedrohung bleibt alltagsnah, institutionell plausibel und ohne Thrillerlärm.
- Im letzten Drittel keine Triumphprosa und keine Dämonisierung. Beweise schlagen härter als Lautstärke.
- Kurze bis mittlere Kapitel bevorzugen. 1000-1500 Wörter sind Normalbereich; einzelne Schlüsselszenen dürfen bis etwa 1700 gehen, Kapitel 17, 23 und 27 als Fusionskapitel bei Bedarf auf etwa 1700-1950 Wörter.

### Minimaler Director-Note-Block
> Nur verwenden, wenn der Lauf sichtbar zu breit, zu erklärend oder zu laut wird. Dieser Block ist Zusatzsteuerung, nicht Standardersatz für gute Regie.

`Straffe auf Zug statt Vollständigkeit. Steige spät ein, gehe früh raus. Keine Nachdeutung nach Beweisbild, Objekt-Schlag oder Machtverschiebung. Objektspannung vor Reflexion. Nora sozial plausibel, Eva präzise unter Druck.`

### Copy-Paste Regieanweisungen für die Writer-UI

> Diese Anweisungen sind kapitelweise Nachschärfungen. Sie sollen den Lauf justieren, nicht die Scene Card umschreiben. Wenn eine Szene nur mit langer Director Note funktioniert, ist die Scene Card noch nicht sauber genug.

#### Kapitel 1 — „Gestern"
`Schreibe die Szene ohne Vorgeschichte. Kein langsames psychologisches Vorspiel. Der Schock entsteht daraus, wie normal und sicher die Kita in ihrer Behauptung klingt. Keine Hysterie. Alltagsrealismus zuerst.`

#### Kapitel 2 — „Das Bild"
`Petra darf nicht kalt oder böse wirken. Der Horror entsteht dadurch, dass sie vernünftig ist und das Material trotzdem gegen Eva arbeitet. Nicht auf Thriller-Hysterie spielen. Der soziale Beweis ist stärker als das Video selbst.`

#### Kapitel 3 — „Bitte fahr nicht allein"
`Nora darf hier noch nicht offen verdächtig wirken. Simon und Nora sind zwei Formen von Hilfe: Simon verfahrensnah, Nora warm und zu schnell im Raum. Der eigentliche Stich ist, dass Nora bereits zu viel weiss. Ende auf kleinem Alltagsdetail, nicht auf grosser Beschuldigung.`

#### Kapitel 4 — „Die Liste"
`Kein Detektivfilm am Küchentisch. Eva sucht einen Fehler und findet stattdessen ein Muster aus Restzugriff und ungefragter Hilfe. Nora muss plausibel fürsorglich bleiben, nicht offen unheimlich werden. Der Schock liegt in der Selbstverständlichkeit des Zutritts.`

#### Kapitel 5 — „Schriftlich"
`Die Szene soll nicht nach Institution gegen Mutter klingen. Zeige, wie formale Vorsicht eine ohnehin geschwächte Position weiter ausdünnt. Petra bleibt professionell, nicht feindselig.`

#### Kapitel 6 — „Verlegt"
`Die Szene lebt von mehreren kleinen realistischen Verschiebungen, die zusammen eine zweite Version von Evas Tag ergeben. Kein Einzelpunkt darf schon nach Masterplan klingen. Simon soll hier erstmals einen Fakt mitprüfen, aber noch nicht kippen. Der Horror ist kumulativ, nicht theatralisch.`

#### Kapitel 7 — „Stabil"
`Keine juristische Eskalationsszene daraus machen. Simon handelt aus Schutzlogik, nicht gegen Eva. Nora taucht sozial glaubwürdig auf und Mila begrüsst sie mit Wiederholungs-Selbstverständlichkeit, nicht mit Ersatzmutter-Pathos. Das Ende muss nach Stabilität aussehen und sich für Eva wie Entzug anfühlen.`

#### Kapitel 8 — „Die Akte über Nora"
`Kein Enthüllungskapitel mit bequemer Akte. Eva bekommt nur Bruchstücke, gerade genug, um Noras Gegenwartslogik zu schärfen. Polizei und Bekannte liefern keine Plotabkürzung, sondern nur Massstab für Beweisbarkeit. Die Brotdose am Ende ist stärker als jede Information davor.`

#### Kapitel 9 — „Der Ersatzschlüssel"
`Die Szene ist kein Einbruchs-Thriller, sondern ein Nachweis früherer legitimer Nähe. Eva soll aktiv handeln und den Zylinder wechseln, aber die Massnahme darf nicht wie Sieg wirken. Der eigentliche Schrecken ist, dass Zutritt nur der Anfang war und die kopierten Routinen bleiben. Nora am Ende freundlich, nicht triumphierend.`

#### Kapitel 10 — „Elternabend"
`Der Elternabend darf sozial kalt werden, aber nicht mobbig. Andere Eltern reagieren vorsichtig, nicht boshaft. Nora bleibt aus dem Raum heraus präsent und wirkt über praktische Entlastung mächtiger als über offenen Druck. Der Schlag ist Vorabwissen, nicht grosses Drama.`

#### Kapitel 11 — „Die Stimme"
`Das ist keine Technikszene, sondern eine Nähe-Szene. Nora hat keine Hightech-Maschinerie, sondern Evas Alltag gesammelt. Fokus auf Wiederholung, Stimme, Vertrauen und den Missbrauch früherer Harmlosigkeit.`

#### Kapitel 12 — „Ein guter Vorschlag"
`Keine melodramatische Szene zwischen Eva und Simon. Der Schmerz liegt darin, dass der Vorschlag für einen Aussenstehenden wirklich gut klingt und dadurch Noras Rolle formalisiert.`

#### Kapitel 13 — „Dienstagstasche"
`Kein Fetischisieren der Dinge. Die Tasche soll zeigen, wie präzise Ersetzung über banale Fürsorge läuft. Wichtig ist die fast perfekte Imitation mit einer kleinen sprachlichen Verrutschung, die nur Eva spürt. Der Schmerz liegt darin, dass selbst richtige Mutterhandlungen jetzt doppelt existieren.`

#### Kapitel 14 — „Protokoll"
`Keine stille Grübel-Szene. Eva wird hier handlungsfähig, indem sie ordnet. Das Protokoll muss Struktur sichtbar machen, nicht bloss Fleiss. Der Druckerfund am Ende soll klein und unanständig wirken: kein Spiegelbild und keine perfekte Botschaft, sondern ein halb abgeschnittener, zufälliger Druckrest aus liegengebliebener Verwaltung.`

#### Kapitel 15 — „Der falsche Nachmittag"
`Das ist Kontrollverlust ohne Ausraster. Eva verliert nicht die Tochter, sondern den unmittelbaren Alltagszugriff. Die Szene muss kalt, konkret und sozial nachvollziehbar weh tun. Nora darf am Ende nah sein, aber nicht magisch punktgenau schon warten: Sie wird erst sichtbar, als der Wagen fast aus dem Hof ist. Show, don't explain. Wenn ein Bild, eine Geste oder eine Handlung bereits eine Bedeutung trägt, folgt kein erklärender Satz. Keine Kommentare zur Wirkung einer Szene auf die Figur. Kein Benennen von Emotionen, die der Text bereits zeigt.`

#### Kapitel 16 — „Die Woche bei Simon"
`Die Szene lebt von Leere und Vermittlung. Eva verliert Mila nicht dramatisch, sondern wird aus dem direkten Informationskreislauf gedrückt. Nora darf hier nicht aufdringlich agieren; ein hilfreiches Foto reicht. Der Schmerz ist gefilterte Nähe. Show, don't explain. Wenn ein Bild, eine Geste oder eine Handlung bereits eine Bedeutung trägt, folgt kein erklärender Satz. Keine Kommentare zur Wirkung einer Szene auf die Figur. Kein Benennen von Emotionen, die der Text bereits zeigt.`

#### Kapitel 17 — „Gespeicherter Alltag"
`Fusionskapitel. Kein Hackerkino. Hofbeobachtung, Waschküche, Namensetiketten und Familienalbum müssen als ein gespeicherter Alltag lesbar werden. Eva kappt am Ende reale Freigaben. Das Kapitel darf länger werden als der Durchschnitt.`

#### Kapitel 18 — „Die alte Mutter"
`Kein Exkurs und kein Sozialdrama-Ausflug. Nur so viel Vergangenheit wie nötig, um Noras Gegenwartslogik schärfer zu machen. Die Wunde erklärt ihre Logik, nicht ihre Unschuld.`

#### Kapitel 19 — „Zugang"
`Die Szene soll Prozesse entzaubern, nicht dramatisieren. Petra merkt hier selbst, dass freundliche Elternkultur ein Einfallstor war. Kein Schuldzuweisungsduell zwischen Petra und Eva. Der gelöschte Scanlauf ist nur ein halbharter Marker, aber einer, der erstmals institutionell nach Metall klingt.`

#### Kapitel 20 — „Der erste Fehler"
`Nora darf hier nicht plötzlich dumm werden. Der Fehler muss klein, menschlich und sofort überspielt sein. Entscheidend sind Milas leiser Alltagssatz und Simons kurzer Riss, nicht ein offenes Auffliegen. Spannung über Korrektur, nicht über Entlarvung.`

#### Kapitel 21 — „Nicht jetzt"
`Die Polizei bleibt glaubhaft und begrenzt, nicht lächerlich. Eva hat mehr Material als zuvor, aber noch nicht das richtige Format für Intervention. Der bittere Punkt ist, dass institutionelle Vorsicht wieder Nora hilft. Der Kinderaufkleber am Ende zieht die Szene aus dem Amtlichen zurück in den Körperraum.`

#### Kapitel 22 — „Ersatzplan"
`Die Szene soll entschlossen wirken, nicht clever-cool. Eva baut keinen Agentenplan, sondern eine plausible Selbstschutzstrategie aus Alltagsmitteln. Die Falschinformation muss simpel, glaubwürdig und prüfbar bleiben.`

#### Kapitel 23 — „Doppelte Versorgung"
`Fusionskapitel. Praxis und zweite Jacke gehören in dieselbe Logik: doppelte Versorgung wirkt vernünftig und kostet Eva real Status. Mila handelt kindlich, nicht symbolisch. Das Kapitel darf länger werden als der Durchschnitt.`

#### Kapitel 24 — „Die Nacht vor Freitag"
`Kein Home-Invasion-Thriller. Die Nacht lebt von Schlafmangel, Vorbereitung und zu viel Synchronisation. Die Schlafhose ist intim genug; mehr braucht die Szene nicht. Eva soll nicht ausrasten, sondern wach bleiben.`

#### Kapitel 25 — „Die Unterschrift"
`Nicht als Forensikshow schreiben. Der Punkt ist nicht Expertenzauber, sondern dass Routine Spuren verrät. Eva erkennt hier, dass Nora mit archivierten Versionen von ihr arbeitet. Das macht die Ersetzung tiefer, nicht cooler.`

#### Kapitel 26 — „Die Probe"
`Keine Genugtuung spielen. Eva gewinnt hier noch nichts zurück. Sie erzwingt nur, dass Simon die Logik endlich mitsehen muss. Spannung über Reaktion, nicht über Triumph.`

#### Kapitel 27 — „Nicht unzuverlässig, sondern ersetzt"
`Fusionskapitel und Midpoint. Hilfe rückwärts lesen, Kanäle schließen, dann Simon nicht mehr Vorfälle, sondern Logik zeigen. Kein Fall-Review-Ton. Das Kapitel darf länger werden als der Durchschnitt.`

#### Kapitel 28 — „Die Generalprobe"
`Nicht wie ein missglückter Entführungsversuch schreiben. Nora probt Wiederholung, nicht Spektakel. Der Morgen muss weich unterlaufen werden, damit Eva wie die störende Variable wirkt. Mila bleibt Kind, keine Partei.`

#### Kapitel 29 — „Das Wochenende danach"
`Mila nicht als Beweismittel benutzen. Die Szene muss still zeigen, dass sich Sprachmuster und Beruhigungsrhythmen verschoben haben. Kein melodramatischer Loyalitätskonflikt. Der Schmerz liegt in harmlosen Sätzen.`

#### Kapitel 30 — „Abgemeldet"
`Kein Tech-Thriller und kein Wunderhack. Ein plausibler Verwaltungsprozess reicht. Wichtig ist, dass Information, Organisation und Legitimation zugleich wegrutschen. Der Eingriff muss persönlich wirken, nicht digital-abstrakt.`

#### Kapitel 31 — „Petra"
`Petra kippt hier nicht sentimental, sondern strukturell. Eva überzeugt sie mit Muster, nicht mit Lautstärke. Die Szene soll professionell bleiben; gerade das macht die neue Allianz belastbar. Ohne frischen Vorfall darf Petra noch nicht alles lösen.`

#### Kapitel 32 — „Das ruhige Gesicht"
`Nora darf hier nicht böse schreiben. Ihre Ruhe ist ihre Waffe. Der Leser soll spüren, wie schwer es ist, eine so kontrollierte Person im offenen Raum plausibel zu beschuldigen.`

#### Kapitel 33 — „Simon sieht es"
`Kein grosser Versöhnungsmoment. Simon kippt über ein kleines Unmöglichkeitsfenster, nicht über Pathos. Der Satz über das Wissen muss nüchtern sitzen. Entscheidend ist, dass er danach handelt.`

#### Kapitel 34 — „Vor dem Ausflug"
`Nicht wie Heist-Planung schreiben. Eva und Simon ordnen prüfbare Dinge für einen belastbaren Morgen. Die Spannung liegt in Disziplin und Zeitdruck, nicht in Cleverness. Der Blick auf Noras Kalender ist stiller Absichtsnachweis.`

#### Kapitel 35 — „Noras Wohnung"
`Schütze die innere Logik dieses Moments. Nora ist nicht hysterisch und nicht dämonisch. Ihr zentraler Satz ist: "Jemand musste anfangen, für sie verlässlich zu sein." Die Szene darf diesen Gedanken nicht verwässern. Kapitel 35 liefert Motiv und halbharten Fund, aber noch nicht den institutionellen Vollbeweis. Keine überflüssige Eskalation, keine Thrillershow. Die Gefahr liegt in ihrer ruhigen moralischen Selbstrechtfertigung.`

#### Kapitel 36 — „Keine Gestik"
`Eva darf nach Kapitel 35 nicht zerfallen. Diese Szene ist Disziplin unter Schock. Sie sichert, ordnet, informiert und verweigert Nora das Bild der unkontrollierten Mutter. Die Stärke kommt aus Nüchternheit.`

#### Kapitel 37 — „Die Vorabmail"
`Der harte Beweis entsteht aus Kette, nicht aus Wunderfund. Druckjob, Entwurf, Raumzugang und Foto müssen zusammenklicken. Petra wird hier zur Verbündeten, bleibt aber im Ton professionell. Kein Gestandnisersatz.`

#### Kapitel 38 — „Rückholung"
`Nicht auf grosses Geschrei schreiben. Die Stärke der Szene liegt darin, dass derselbe öffentliche Raum, der Eva vorher geschwächt hat, jetzt Nora nicht mehr schützt. Mila muss nicht dramatisch Partei ergreifen.`

#### Kapitel 39 — „Aussage"
`Nach dem Zugriff braucht das Buch Schwere, keinen Epilogbetrieb. Keine Triumphszene. Aussagen und Protokolle sollen zeigen, wie oft Ruhe mit Glaubwürdigkeit verwechselt wurde. Nora bleibt auch hier kontrolliert.`

#### Kapitel 40 — „Der Hof"
`Nicht zu schnell heilen. Der Hof ist derselbe Ort und gerade deshalb noch nicht unschuldig. Die Leerstelle von Nora muss sozial spürbar sein: Blicke, Fenster, stockende Höflichkeit. Der ungesendete Entwurf ist ein letzter Rest ihrer fremden Mutterstimme. Das Kapitel gehoert dem sozialen Nachhall, nicht dem privaten Aufraeumen.`

#### Kapitel 41 — „Keine Dopplung"
`Das ist kein Aufräum-Montagefinale, sondern Rückgewinnung durch kleine Ordnungsakte. Jeder Gegenstand steht für reale Infiltration, nicht Symbolik allein. Keine Wiederholung von Hof, Nachbarn oder sozialem Blick. Eva darf ihre Blindheit sehen, aber nicht in Selbstanklage versinken. Das Bild mit der einen Jacke muss tragen.`

#### Kapitel 42 — „Gelber Becher"
`Das Schlusskapitel nicht übererklären. Ruhe ist hier kein Leerlauf, sondern die verdiente Form des Endes. Der letzte Satz bleibt ein Bild und trägt allein, ohne ihn kommentierend zu deuten.`

### Director-Note-Leitlinie für dieses Buch
- Nicht "wie Autor X" schreiben.
- Stattdessen: klare Alltagsspannung, konkrete Folgen, kurze Kapitel, kein atmosphärisches Treiben ohne Beweisverschiebung.
- Jede Szene muss die Leserfrage aktiv halten: Wer darf Mila glaubhaft vertreten?

### Kommentar für den Regie-zu-Blueprint Sync
- Diese Datei ist auf `scripts/bootstrap-book-from-regie.ts` zugeschnitten.
- Besonders wichtig für Rücklese-Checks sind `Nora` als feste Täterfunktion, die `Writer Constitution`, die offenen Threads zur Ersetzung und die Spezialfelder in den Scene Cards wie `beweisobjekt`, `alltagswaffe`, `ersetzungsmoment`, `false_friend_signal`, `closing_line`.

# EMBER Studio: Guide für den Bereich `Book`

EMBER ist im Book-Modus kein normaler Editor, sondern ein Arbeitsraum für geplantes, szenenbasiertes Schreiben mit Modell-Orchestrierung. Gute Ergebnisse entstehen hier nicht durch einen einzigen Prompt, sondern durch saubere Vorbereitung im Blueprint, klare Szenenführung im Writer und anschließende Kontrolle der Job-Ergebnisse.

So gehst du in Ember vor

  1. Setze im Blueprint den Markt sauber: Premise, Reader Promise, Hook, Category Lane, Ending Promise. Verkäufe kommen
     nicht nur aus Prosa, sondern aus Verpackung und klarem Versprechen.
  2. Schreibe 8 bis 12 harte Regeln in die Writer Constitution. Keine Adjektive wie „literarisch“, sondern prüfbare
     Regeln.
  3. Plane nicht in „300 Seiten“, sondern in Szenen. Für 300 Taschenbuchseiten bist du grob bei 75.000–90.000 Wörtern.
     In Ember heißt das meist 45–65 Szenen mit etwa 1.100–1.700 Wörtern.
  4. Gib jeder Szene eine belastbare Summary: Ziel, Widerstand, Wendung, Enddruck.
  5. Setze pro Szene harte Regie: POV, objective, opening, dramaticBeat, ending.
  6. Nutze Director Note nur für den aktuellen Eingriff, nicht für die gesamte Poetik.
  7. Erzeuge Jobs szenenweise, übernimm nur starke Rewrites, prüfe dann Review, offene Fäden und Kontinuität.

## 1. Wofür der Book-Bereich da ist

Der Book-Bereich ist für lineares Erzählen gedacht:

- Roman
- Novelle
- Serienband
- psychologisch oder marktorientiert geplante Spannungsliteratur

Die Grundidee:

- Du definierst zuerst die Leitplanken des Buchs.
- Du strukturierst dann Akte, Kapitel und Szenen.
- Für einzelne Szenen erzeugt EMBER Draft-Jobs mit `context`, `beat_plan`, `draft`, `rewrite`, `length_control`, `extract`, `continuity` und `quality_eval`.
- Die Ergebnisse landen nicht nur als Text, sondern auch als nutzbarer Zustand für Kanon, Figuren, offene Fäden und spätere Szenenarbeit.

## 2. Die drei Modi oben links

Im Book-Projekt wechselst du hauptsächlich zwischen drei Modi:

1. `Plan` / Blueprint  
   Hier legst du Stoff, Marktspur und Schreibregeln fest.

2. `Book` / Writer  
   Hier bearbeitest du Szenen und startest KI-Jobs.

3. `Review`  
   Hier prüfst du Logik, Kontinuität und Projektreife.

Praktisch:

- Blueprint ist die strategische Ebene.
- Writer ist die operative Ebene.
- Review ist die Kontroll- und Korrekturebene.

## 3. So arbeitet man sinnvoll in EMBER

Die effizienteste Reihenfolge ist fast immer:

1. Buch im Blueprint sauber schärfen.
2. Akte, Kapitel und Szenen grob anlegen.
3. Pro Szene eine belastbare Summary schreiben.
4. Erst dann KI-Jobs im Writer starten.
5. Gute Jobs übernehmen, schwache Jobs per Director Note nachschärfen.
6. Kontinuität und offene Threads regelmäßig prüfen.

Wenn du zu früh generierst, bekommst du fast immer generischen oder zu weichen Output.

## 4. Blueprint: Was wo hineingehört

Der Blueprint ist die wichtigste Qualitätsquelle für alle späteren Jobs.

### Master Brief

Hier definierst du den Kern der Geschichte.

- `Premise`  
  Was ist der Stoff in einem harten, klaren Satz?

- `Reader Promise`  
  Was bekommt der Leser emotional und dramaturgisch?

- `Ending Promise`  
  Was soll sich am Ende bezahlt machen?

- `Thematic Core`  
  Welcher innere Konflikt oder welche Leitspannung arbeitet unter dem Plot?

- `Story Architecture`  
  Welche strukturellen Regeln gelten für das größere Ganze?

Gut:

- konkret
- spannungsfähig
- marktfähig
- nicht abstrakt-literarisch

Schlecht:

- „Es geht um Menschen und ihre Abgründe“
- „Ein atmosphärischer Roman über Schuld“

Zu weich. Das steuert Modelle kaum.

### Market Brief

Hier definierst du nicht Werbung, sondern Marktspur und Verpackungslogik.

- `Amazon Goal`
- `Category Lane`
- `Hook`
- `Series Potential`
- `Cover Direction`
- `Publishing Guardrails`

Der wichtigste Hebel hier ist meist:

- `Hook`
- `Category Lane`

Wenn die beiden unscharf sind, wird auch der Szenenoutput oft unscharf.

### Writer Constitution

Das ist deine eigentliche Schreibverfassung. Diese Regeln laufen später als harter Stil- und Qualitätsrahmen mit.

Gute Regeln sind:

- kurz
- prüfbar
- szenennah
- handlungsbezogen

Beispiele:

- „Szenen starten spät und verlassen sie früh.“
- „Dialog muss Macht verschieben oder Information unter Druck tragen.“
- „Emotion wird über Handlung, Blick, Körper und Entscheidung sichtbar, nicht erklärt.“
- „Jede Szene endet mit Reibung, Drohung oder Erkenntnis, nicht weich.“

Schwache Regeln sind:

- „schön schreiben“
- „literarisch“
- „mehr Tiefe“

## 5. Manuscript Explorer: Akte, Kapitel, Szenen

Links im Writer navigierst du durch:

- Akte
- Kapitel
- Szenen

EMBER arbeitet im Book-Bereich szenenbasiert. Eine Szene ist die eigentliche operative Einheit für Draft-Jobs.

Für jede Szene sind besonders wichtig:

- `Title`
- `Summary`
- strukturierte Scene-Card-Regie
- vorhandene Textblöcke

Die Summary ist der wichtigste direkte Arbeitsanker für die KI.

Zusätzlich wichtig seit dem aktuellen Regie-Sync:

- `book_scene_cards` tragen nicht mehr nur freie `outline`-Zeilen, sondern auch strukturierte Szenenregie
- dazu gehören u. a. `pov`, `location`, `timeAnchor`, `objective`, `opening`, `coreAction`, `dramaticBeat`, `ending` und freie Spezialfelder
- diese harten Szenen-Constraints haben Vorrang vor allgemeinen Stilregeln oder Modellgewohnheiten

Praktisch heißt das:

- Regie bleibt die Quelle
- die DB hält daraus eine normalisierte Runtime-Fassung
- wenn Scene Card und Summary sich widersprechen, ist die Scene Card der härtere Anker

Eine gute Szenen-Summary sollte enthalten:

- was die Figur will
- was im Weg steht
- was kippt
- womit die Szene endet

Beispiel:

> Jonas nimmt Adrians Vermisstenmeldung auf. Zunächst wirkt Adrian kontrolliert, fast zu kontrolliert. Im Gespräch verschiebt sich der Fokus von Elena auf ihr Notizbuch. Jonas merkt, dass Adrian nicht Hilfe sucht, sondern Deutungshoheit. Die Szene endet mit einem Objekt oder Satz, der Jonas ins Haus am Hang zwingt.

Das ist deutlich besser als:

> Jonas spricht mit Adrian über Elena.

## 6. Writer: Was in der Mitte und was rechts passiert

Im Writer arbeitest du in zwei Bereichen:

- Mitte: die aktuelle Szene
- Rechts: der AI-Bereich für Provider, Modelle, Wortziel und Jobs

### In der Szenenfläche

Hier bearbeitest du:

- Szenentitel
- Summary
- Textblöcke

Wichtig:

- Die Summary ist kein Fülltext.
- Auch wenn schon Text in der Szene steht, orientiert sich der Job stark an Summary, Blueprint und Kontext.

### Im rechten AI-Bereich

Hier steuerst du den Draft-Job.

#### Provider

Verfügbar sind:

- `Auto`
- `OpenAI`
- `Anthropic`
- `Gemini`

Praxis:

- `OpenAI` eignet sich gut für präzise, saubere Struktur.
- `Anthropic` eignet sich gut für nuancierte, atmosphärische Prosa.
- `Gemini` eignet sich gut für schnelle Läufe und breite Kontexte.
- `Auto` nimmt den besten verfügbaren Pfad auf Basis der Umgebung.

Für den ersten echten Testlauf ist besser:

- keinen `Auto`-Lauf, sondern einen bewussten Provider wählen
- nur dann bewerten, wenn der Job im Ergebnis `remote` ist
- bei fehlenden API-Keys erst die Umgebung korrigieren, nicht die Szene

#### Modell-IDs

Unterhalb des Providers kannst du pro Provider konkrete Modell-IDs setzen.

Wichtig zu verstehen:

- Die Auswahl wird lokal gespeichert.
- Du kannst für Anthropic getrennt das Hauptmodell und das Continuity-Modell setzen.
- Das Hauptmodell schreibt und überarbeitet.
- Das Continuity-Modell prüft auf Risiken und Stilabweichungen.

Voraussetzung für echte Remote-Läufe:

- `OPENAI_API_KEY` für OpenAI
- `ANTHROPIC_API_KEY` für Anthropic

Fehlt der Key für den gewählten Provider, fällt EMBER auf `local_fallback` zurück oder nutzt den Provider gar nicht.

#### Ziel-Länge

Die Felder `Min` und `Max` steuern die gewünschte Rewrite-Länge der Szene.

Praxiswerte:

- kurze Spannungsszene: `900–1300`
- normale Romanszene: `1200–1800`
- langsamere, dichter gebaute Szene: `1600–2400`

Wichtig:

- Das System normalisiert technisch unsinnige Eingaben.
- Hohe Werte kosten mehr und dauern länger.
- Mehr Wörter bedeuten nicht automatisch bessere Szene.

#### Director Note

Das ist dein stärkster direkter Hebel im Writer.

Nutze sie nicht für Weltbau, sondern für operative Steuerung der konkreten Szene.

Gut:

- „Adrian soll kontrolliert bedrohlich wirken, nie offen aggressiv.“
- „Mehr sozialer Druck, weniger Erklärung.“
- „Die Szene braucht einen stärkeren Kapitelhaken.“
- „Jonas darf nicht analysieren, sondern nur beobachten und reagieren.“

Schlecht:

- „Mach besser.“
- „Schreib wie ein Bestseller.“
- „Mehr Spannung.“

Zu unspezifisch.

## 7. Was ein Draft-Job intern macht

Ein einzelner Job durchläuft diese Stufen:

1. `Context`  
   Das System baut den Szenenkontext aus Blueprint, Szenenstruktur, Kanon, Figurenstatus und benachbarten Beats.

2. `Beat Plan`  
   Die Szene wird in operative Beats mit Wortbudgets und klaren Payoffs zerlegt.

3. `Draft`  
   Ein erster Szenenentwurf wird erzeugt.

4. `Rewrite`  
   Das Modell überarbeitet den Draft in Richtung Zielprosa und Zielkorridor.

5. `Length Control`  
   Wenn die Szene deutlich unter oder über dem Ziel liegt, greift ein eigener `expand`- oder `compress`-Pass.

6. `Extract`  
   Das System extrahiert neue Fakten, Figurenveränderungen, offene Fäden und Foreshadowing aus dem finalen Rewrite.

7. `Continuity`  
   Der Rewrite wird gegen Kanon, Stil und laufende Logik geprüft.

8. `Quality Eval`  
   Die fertige Szene bekommt Wortmetriken, Scores und konkrete Issues.

Das bedeutet:

- Du bekommst nicht nur einen Text.
- Du bekommst auch verwertbare Produktionsdaten für Folgearbeit.
- Prosa und Metadaten konkurrieren nicht mehr im selben großen JSON-Output.

## 8. Wie du Job-Ergebnisse richtig liest

Nach einem Run zeigt der Writer:

- Provider
- Ausführungsmodus
- Modellname
- Stage-Status
- Beat-Plan
- Draft / Rewrite
- Length-Control-Status
- Rewrite Notes
- Extract-Karten
- Continuity-Karten
- Quality-Hinweise

### Provider und Modus

Hier ist besonders wichtig:

- `remote`  
  Der echte Modellpfad wurde erfolgreich genutzt.

- `local_fallback`  
  Der Remote-Pfad ist ausgefallen oder nicht verfügbar. Dann stammt der Text aus dem lokalen Fallback und ist nicht als echtes Qualitätsurteil über das Modell zu lesen.

Wenn du Modellqualität beurteilen willst, muss der Job `remote` sein.

Für den ersten Testlauf gilt deshalb:

- `remote` = echter Modelllauf, auswertbar
- `local_fallback` = Sicherheitsnetz, nicht als Qualitätsurteil lesen

### Generate, Accept, Save

Der wichtigste UI-Punkt:

- `Generate` startet nur den Draft-Job
- der erzeugte Text liegt danach zunächst im Job (`draft` / `rewrite`)
- erst `Accept` / `Übernehmen` schreibt den `rewriteText` in die eigentliche Szene
- erst nach erfolgreichem Speichern ist der Text sicher in Supabase und damit stabil in der UI

Das bedeutet konkret:

1. `Generate`
2. Ergebnis prüfen
3. `Accept`
4. auf den Save-Status achten oder manuell `Speichern` klicken

Wenn du nur `Generate` drückst, aber nicht `Accept`, entsteht noch kein sichtbarer Szenentext in den Scene Blocks.

Wenn du `Accept` gedrückt hast, aber der Save fehlschlägt, ist der Text nur lokal im Browser-Draft und nicht garantiert in Supabase.

### Rewrite Notes

Diese zeigen, was im überarbeiteten Text verändert oder geschärft wurde.

Gut:

- konkret
- sichtbar im Text
- knapp

Wenn die Notes generisch wirken, ist oft die Szene oder Director Note noch zu weich.

### Length Control

Diese Stage ist neu wichtig.

- `accept` bedeutet: Die Szene lag schon im brauchbaren Korridor.
- `expand` bedeutet: Der Rewrite war zu kurz und wurde gezielt vertieft.
- `compress` bedeutet: Der Rewrite war zu lang und wurde verdichtet.

Für den ersten Lauf ist `accept` oder ein sauberer einzelner `expand`-/`compress`-Pass ein gutes Zeichen. Wiederholt harte Längenprobleme deuten meist auf eine zu schwache Summary oder eine unklare Director Note hin.

### Extract State

Hier landet strukturierter Erkenntnisgewinn:

- neue Kanonfakten
- Figurenstatus-Updates
- neue offene Threads
- aufgelöste Threads
- Foreshadowing
- Kontinuitätsrisiken
- Stilabweichungen

Wichtig:

- Nicht jede Modellbehauptung wird blind übernommen.
- EMBER bereinigt unsichere Extractor-Einträge konservativ gegen den Packet-Kontext.

## 9. Codex und Memory: Was automatisch mitwächst

Der Book-Bereich hat ein internes Gedächtnis. Dazu gehören:

- Canon Ledger
- Character Ledger
- Open Threads
- Scene Cards
- Context Packs

Das Ziel:

- spätere Szenen bekommen mehr belastbaren Kontext
- Kontinuitätsfehler werden sichtbarer
- Figurenzustände bleiben nachvollziehbar

Praktisch heißt das:

- saubere Szenenarbeit verbessert spätere Szenen
- schlampige oder vage Szenen verschmutzen die Memory-Basis

## 10. Review: Wann und wofür nutzen

Review ist nicht nur „einmal am Ende draufschauen“.

Nutze Review:

- nach wichtigen Plot-Wendungen
- nach jeder Szene mit neuem Fakt oder Objekt
- wenn sich Figurenwissen verschiebt
- vor längeren Generierungsserien

Besonders wichtig sind:

- Kontinuitätswarnungen
- unklare Besitz- oder Wissensstände
- neue, noch nicht eingelöste offene Fäden

## 11. Empfohlene Arbeitsweisen

### Workflow für neue Projekte

1. Titel, Grundstoff, Hook und Reader Promise sauber machen.
2. Writer Constitution auf 5 bis 12 gute Regeln bringen.
3. Akte und Kapitel grob anlegen.
4. Pro Szene eine starke Summary schreiben.
5. Erst danach mit KI-Drafts beginnen.

### Workflow für einzelne Szenen

1. Szene auswählen.
2. Summary schärfen.
3. Wortziel setzen, für den ersten Lauf am besten `1200–1600`.
4. Provider und Modell bewusst wählen, nicht `Auto`.
5. Director Note nur für die aktuelle Szene schreiben.
6. Job starten.
7. Prüfen, ob der Lauf `remote` ist.
8. Beat-Plan, Rewrite, Length Control, Notes und Continuity lesen.
9. Gute Fassung nur dann `Accept` / `Übernehmen`, wenn sie wirklich in die Szene soll.
10. danach den Save-Status abwarten oder explizit `Speichern` drücken.
11. erst dann die Szene in der UI oder DB als wirklich übernommen betrachten.
12. Quality-Hinweise prüfen oder mit neuer Director Note neu ansetzen.

### Workflow für mehrere Iterationen

Nutze nicht zehn vage Wiederholungen. Nutze drei saubere Iterationen:

1. erster Lauf für Grundzug
2. zweiter Lauf für Ton, Spannung, Ending
3. dritter Lauf nur für gezielte Korrektur

## 12. Was gute Ergebnisse zuverlässig verbessert

- präzise Premise
- harte Reader Promise
- marktfähiger Hook
- kurze, gute Writer Constitution
- konkrete Szenen-Summary
- klare Director Note
- realistische Wortziele
- regelmäßige Review-Kontrolle

## 12a. Erster Testlauf

Wenn du deinen ersten echten Run machen willst, nimm diesen Minimalpfad:

1. `npm run dev`
2. `/studio` öffnen
3. eine Szene mit klarer Summary wählen
4. Provider bewusst auf `OpenAI`, `Anthropic` oder `Gemini` setzen
5. Wortziel auf `1200–1600`
6. eine kurze operative Director Note schreiben
7. Job starten
8. nur auswerten, wenn `mode = remote`
9. gute Fassung immer zusätzlich `Accept` und danach `Speichern`

Danach prüfst du in dieser Reihenfolge:

1. Ist der Beat-Plan plausibel?
2. Trägt der Rewrite die Szene bis zum Endhaken?
3. Musste `length_control` eingreifen?
4. Gibt es echte Continuity-Risiken?
5. Meldet `quality_eval` grobe Issues?

## 13. Was regelmäßig schlechte Ergebnisse erzeugt

- leere oder dünne Summary
- unklare Hook/Category Lane
- zu abstrakte Writer Constitution
- Director Note voller Allgemeinplätze
- zu viele Ziele in einer Szene gleichzeitig
- Modellqualität auf Basis von `local_fallback` beurteilen
- Kontinuitätswarnungen ignorieren
- einen ersten Lauf mit zu hohem Wortziel aufblasen
- `Auto` benutzen und danach nicht wissen, welcher echte Pfad lief
- `Generate` mit „Text ist jetzt schon in der Szene“ verwechseln
- nach `Accept` nicht auf den Save-Status achten

## 14. Hinweise zu Kosten und Laufzeit

Nicht alle Provider verhalten sich gleich.

- stärkere Modelle kosten mehr
- längere Zieltexte kosten mehr
- zusätzliche Repair- oder Continuity-Pässe kosten mehr
- `length_control` und `quality_eval` sind zusätzliche Stufen und können Laufzeit erhöhen
- bessere Qualität ist oft teurer, aber billiger als zehn unbrauchbare Billigläufe

Praxis:

- Für wichtige Kernszenen lohnt sich ein stärkeres Modell.
- Für Routine- oder Strukturarbeit reicht oft ein günstigerer Provider.
- Nutze das teure Modell dort, wo Voice, Spannung und Schlusshaken wirklich tragen müssen.

## 15. Kurzfassung für neue Nutzer

Wenn du nur die wichtigste Arbeitsregel mitnehmen willst, dann diese:

- Erst Blueprint scharf machen.
- Dann pro Szene eine gute Summary schreiben.
- Dann mit klarer Director Note und bewusstem Provider generieren.
- Danach Beat-Plan, Rewrite, Length Control und Continuity lesen, nicht nur den ersten Textblock.

EMBER belohnt saubere Führung. Wer das Tool wie einen Chat benutzt, bekommt mittelmäßige Ergebnisse. Wer es wie ein Produktionssystem führt, bekommt deutlich bessere.

---

Stand: 20. April 2026  
Gilt für den aktuellen Book-Workflow in EMBER Studio.

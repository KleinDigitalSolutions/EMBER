# EMBER Story Document — „Der Feind bin ich”
> Autor: Interviewfassung / April 2026
> Format: Blueprint v2
> Kompatibel mit: Master Brief, Market Brief, Writer Constitution, Scene Cards, Canon Facts, Character State Ledger, Open Threads

## MASTER BRIEF

| **Arbeitstitel** | Der Feind bin ich |
| **Genre** | Autofiktion / Entwicklungsroman / Memoir |
| **Prämisse** | Ein Mann, der gelernt hat, alleine zu überleben, wird durch Krankheit, Scham, Sucht und Angst gezwungen, sich selbst zu lesen, bis aus dem Zwang zur Einsamkeit eine Form von Selbstkenntnis wird. |
| **Reader Promise** | Der Leser begegnet einem Mann, der nach außen funktioniert und innen seit Jahren Lasten trägt, für die es kaum Sprache gibt. Die Nähe entsteht nicht über Bekenntnis, sondern über präzise Erinnerung, körperliche Situationen und stillen inneren Druck. |
| **Ending Promise** | Am Ende steht kein Wunder, sondern eine hart erarbeitete Selbstbehauptung: Der Protagonist trägt seine Angst noch, aber sie trägt nicht mehr allein ihn. |
| **Thematischer Kern** | Wir sehen nicht, welchen Schmerz der Mensch neben uns trägt. Wer früh lernt, alles allein auszuhalten, entwickelt einen scharfen Blick für andere und verliert zugleich lange den Zugang zu sich selbst. |
| **Ziel-Wortanzahl** | 62000 |

## MARKET BRIEF

| **Amazon Goal** | Literarisch lesbare Autofiktion mit emotionaler Unmittelbarkeit statt Selbsthilfe-Ton. |
| **Category Lane** | Autofiktion / Gegenwartsroman / Memoir |
| **Commercial Hook** | Ein Mann erinnert sich nicht an einzelne Traumata als große Enthüllung, sondern an die konkrete Mechanik, wie man lernt, mit Scham, Fremdheit und innerem Alarm zu funktionieren. |
| **Serienpotenzial** | Kein Serienprojekt; abgeschlossener Einzelroman mit starker Autorenstimme. |
| **Cover-Richtung** | Nüchtern, ernst, körpernah; Stadt, Transit oder Innenraum statt symbolischer Pathosbilder. |

- Keine Vermarktung als Ratgeber oder Heilungsgeschichte.
- Der Text muss literarisch und körperlich präzise wirken, nicht therapiehaft erklärt.
- Migration, Sucht, Angst und Glaube sind Lebensmaterial, keine Schlagworte.

## WRITER CONSTITUTION

- Schreibe konkret, körpernah und ohne Sentimentalität.
- Bevorzuge Erinnerung über Objekt, Raum, Geruch, Rhythmus und Schamreaktion statt nachträglicher Deutung.
- Keine künstlich aufgeräumten Sinnbilder; ein Raum braucht auch das Banale, Zufällige, Störende.
- Nach einem starken Bild kein erklärender Auswertungssatz.
- Wiederholungen nur dann, wenn sie als Fixation oder Druckstelle der Figur arbeiten.
- Keine Generalabrechnung mit Familie, Herkunft oder Gesellschaft; jede Kränkung bleibt individuell verankert.
- Der Vater darf weder zum Heiligen noch zum bloßen Opfer werden.
- Krankheit wird materiell gezeigt: Geräusche, Hilfsgriffe, Gerüche, Wartezeiten, Müdigkeit, Scham.
- Die Stimme bleibt ruhig. Das Pathos entsteht aus Präzision, nicht aus Lautstärke.
- Glaube ist gelebte Praxis und intime Bitte, nicht dekoratives Thema.

## WORLD BIBLE

### Der Protagonist
- Kind türkisch-alevitischer Eltern aus Kars, aufgewachsen in Deutschland zwischen mehreren Zugehörigkeiten.
- Lernt früh, Menschen zu lesen, weil er sich selbst selten sicher fühlt.
- Trägt Scham, Angst und Einsamkeit lange ohne Sprache.

### Familie
- Der Vater erkrankt schwer an Lungenkrebs und braucht über Jahre konkrete Hilfe im Alltag.
- Die Mutter hält Abläufe aufrecht, kann den Schmerz des Sohnes aber nicht auffangen.
- Bruder und Schwester reagieren auf den familiären Druck mit Abstand und Rückzug.

### Soziale Grundspannung
- Der Protagonist gehört nirgends vollständig dazu: nicht deutsch genug, nicht türkisch genug, nicht in jeder religiösen oder sozialen Ordnung lesbar.
- Diese Fremdheit setzt früh ein und bleibt bis ins Erwachsenenleben wirksam.

### Spätere Lebensachsen
- Ausbildung, Bundeswehr, Hotellerie, Fernverkehr und Spielsucht werden zu äußeren Strukturen gegen inneres Chaos.
- Der spätere Weg führt nicht in Heilung, sondern in tragfähige Selbstkenntnis.

## CANON FACTS (Initial — Stand: vor Kapitel 1)

```json
{
  "canon_facts": [
    {
      "id": "CF001",
      "fact": "Der Protagonist erinnert die Jugend aus einer späteren Gegenwartsperspektive, bleibt im Szenenvollzug aber eng bei der damaligen Wahrnehmung.",
      "status": "fix"
    },
    {
      "id": "CF002",
      "fact": "Der Vater ist an Lungenkrebs erkrankt und körperlich bereits so geschwächt, dass der Sohn ihm im Bad helfen muss.",
      "status": "fix"
    },
    {
      "id": "CF003",
      "fact": "Die Familie leidet gemeinsam, spricht aber nicht offen genug über das, was der Junge mitträgt.",
      "status": "fix"
    },
    {
      "id": "CF004",
      "fact": "Scham in der Nähe des kranken Vaters ist Teil der Erfahrung und darf nicht moralisch aufgelöst werden.",
      "status": "fix"
    },
    {
      "id": "CF005",
      "fact": "Konkrete Sinnesdetails sind in diesem Projekt glaubwürdiger als abstrakte Emotionsbenennung.",
      "status": "fix"
    }
  ]
}
```

## CHARACTER STATE LEDGER

### PROTAGONIST
```json
{
  "character_id": "PROTAGONIST",
  "name": "Ich-Erzähler",
  "role": "Protagonist",
  "background": "Jugendlicher Sohn einer türkisch-alevitischen Familie, aufgewachsen in Deutschland zwischen Fremdheit, stiller Wachsamkeit und frühem Funktionieren.",
  "kern": "Er trägt mehr, als sein Alter aushält, und hat noch keine Sprache dafür.",
  "funktion_im_buch": "Er ist Beobachter und Betroffener zugleich; seine Wahrnehmung baut die Welt des Romans.",
  "was_unklar_bleibt": "Wie viel von seiner späteren Stärke schon damals angelegt ist und wie viel erst aus Not entsteht.",
  "wunde": {
    "was_es_heute_macht": "Er scannt Räume, Menschen und Spannungen schneller als sich selbst.",
    "arc_abschluss": "Er lernt, seine Wahrnehmung nicht nur als Alarm, sondern als Teil seiner Selbstkenntnis zu tragen."
  },
  "initial_state": {
    "äußerer_druck": "Der Vater braucht Hilfe bei intimen Handgriffen, die eigentlich Erwachsene tragen sollten.",
    "innerer_druck": "Scham, Pflichtgefühl und Überforderung laufen gleichzeitig.",
    "beziehungsmodus": "Er funktioniert, statt sich mitzuteilen."
  },
  "arc": [
    {
      "state": "Er hält aus, was niemand mit ihm bespricht."
    }
  ]
}
```

### VATER
```json
{
  "character_id": "VATER",
  "name": "Vater",
  "role": "Vaterfigur",
  "background": "An Lungenkrebs erkrankter Familienvater, dessen Körper im Alltag immer mehr Unterstützung braucht.",
  "kern": "Er bittet um Hilfe, ohne seine Würde aufgeben zu wollen.",
  "funktion_im_buch": "Sein Kranksein zwingt den Sohn früh in eine Erwachsenenrolle.",
  "was_unklar_bleibt": "Wie viel Angst er selbst zeigt und wie viel er vor den Kindern verbirgt.",
  "wunde": {
    "was_es_heute_macht": "Sein Körper wird für den Sohn zu einer Schule der Hilflosigkeit und Nähe.",
    "arc_abschluss": "Sein Sterben bleibt Ursprung vieler späterer Schutzmechanismen des Protagonisten."
  },
  "initial_state": {
    "äußerer_druck": "Körperliche Schwäche, medizinische Behandlung, Verlust von Selbstverständlichkeit.",
    "innerer_druck": "Abhängigkeit von Hilfe bei gleichzeitiger Scham.",
    "beziehungsmodus": "Leise, knapp, auf Würde bedacht."
  },
  "arc": [
    {
      "state": "Er braucht den Sohn für Handgriffe, die beide überfordern."
    }
  ]
}
```

### MUTTER
```json
{
  "character_id": "MUTTER",
  "name": "Mutter",
  "role": "Mutterfigur",
  "background": "Hält Pflege, Wohnung und Alltag zusammen, während die Familie langsam ausfranst.",
  "kern": "Sie organisiert, was zu organisieren ist, und hat selbst kaum Raum für Einbruch.",
  "funktion_im_buch": "Zeigt, wie Fürsorge und Überforderung nebeneinander bestehen können, ohne dass Trost entsteht.",
  "was_unklar_bleibt": "Wie viel sie vom inneren Druck des Sohnes sieht und was sie nicht sehen kann.",
  "wunde": {
    "was_es_heute_macht": "Ihre pragmatische Fürsorge lindert Abläufe, aber nicht die Einsamkeit des Jungen.",
    "arc_abschluss": "Sie bleibt Teil des Ursprungs, aus dem der Protagonist sein Schweigen lernt."
  },
  "initial_state": {
    "äußerer_druck": "Pflege, Angst, Haushalt, Erschöpfung.",
    "innerer_druck": "Sie darf nicht zusammenbrechen, solange der Alltag weitergehen muss.",
    "beziehungsmodus": "Praktisch, funktional, selten entlastend."
  },
  "arc": [
    {
      "state": "Sie hält den Betrieb aufrecht, nicht das Innenleben der Familie."
    }
  ]
}
```

## OPEN THREADS (Initial)

```json
{
  "open_threads": [
    {
      "id": "OT001",
      "thread": "Wie lernt ein Jugendlicher, intime Pflege für den eigenen Vater zu tragen, ohne eine Sprache für die Scham zu haben?",
      "status": "offen",
      "payoff_act": "Act 1"
    },
    {
      "id": "OT002",
      "thread": "Wie wird aus frühem Aushalten eine spätere Fähigkeit, Menschen präzise zu lesen?",
      "status": "offen",
      "payoff_act": "Act 3"
    },
    {
      "id": "OT003",
      "thread": "Welche Spuren hinterlässt der Tod des Vaters in Sucht, Angst und Beziehungsfähigkeit des Protagonisten?",
      "status": "offen",
      "payoff_act": "Act 2/3"
    }
  ]
}
```

## ACTS & KAPITEL — SCENE CARDS

### ACT 1 — „Die Schule der Einsamkeit“
> Die Kindheit und Jugend werden nicht als Ereignisliste erzählt, sondern als Schule des frühen Funktionierens.

#### Kapitel 1: „Die Fuge“
```
Scene Card
  id: SC_1_1
  pov: PROTAGONIST
  ort: Badezimmer der Familienwohnung
  uhrzeit: Winterabend
  ziel: Die frühe Mischung aus Pflicht, Körpernähe, Scham und stiller Überforderung ohne Sentimentalität etablieren.
  reader_pulse: Wie trägt ein Junge diese Art von Nähe, ohne daran zu zerbrechen oder darüber sprechen zu können?
  main_question: Was macht diese Hilfe mit ihm, wenn niemand sie einordnet?
  objective: Der Sohn will dem Vater aus der Wanne helfen, ohne ihn fallen zu lassen und ohne selbst wegzusehen.
  opening: Das Badezimmer ist klein, warm und zu vertraut. Der Sohn kennt Fliesen, Fuge, Heizlüfter und Wannenrand genauer, als ihm lieb ist.
  scene_promise: Die Szene zeigt nicht Krankheit als Thema, sondern einen konkreten Hilfsgriff, in dem Scham, Pflicht und Zärtlichkeit untrennbar werden.
  wissensgrenze: Der Sohn versteht noch nicht, was diese Situation langfristig mit ihm macht. Er ist nur in der unmittelbaren Aufgabe gefangen.
  information_gap: Wie viel Würde bleibt beiden in einer Situation, in der der Sohn plötzlich der Stützpunkt des Vaters ist?
  pressure_clock: Der Vater sitzt im Wasser und muss jetzt hoch; Zögern macht alles schwerer und demütigender.
  beziehungsdruck: Der Vater will Hilfe, aber keinen Blickkontakt, der Sohn will helfen, aber nicht zu viel sehen.
  objective: Der Sohn will den Vater sicher aus der Wanne bekommen und dabei seine eigene Scham unter Kontrolle halten.
  coreAction: Der Vater ruft ihn, erklärt kurz den Griff unter die Arme, der Sohn zieht ihn hoch, spürt Gewicht, Wärme, Nässe und den Moment, in dem ein Kind einen Erwachsenen halten muss.
  false_reading: Von außen könnte die Szene wie ein bloßer Pflegevorgang aussehen.
  dramaticBeat: Nicht der körperliche Ekel ist das Problem, sondern die Scham darüber, überhaupt dort zu sein und den Vater so halten zu müssen.
  reversal: Aus einer praktischen Hilfe wird für den Sohn ein stiller Initiationsmoment in ein Erwachsensein, das er nie wollte.
  konkrete_folge: Der Leser versteht, dass spätere Härte, Wachsamkeit und Sprachlosigkeit aus solchen konkreten Situationen kommen.
  cost: Der Sohn verliert ein Stück kindlicher Distanz zum Körper und zur Schwäche des Vaters.
  status_shift: Der Vater bleibt Vater, wird in diesem Moment aber zugleich jemand, den der Sohn tragen muss.
  ending: Das zu kleine, angewärmte Handtuch verschwindet über den Schultern des Vaters, und genau diese kleine Erleichterung wird für den Sohn fast körperlich dankbar.
  ending_type: Quiet Reversal
  new_question: Wohin mit einer Scham, für die es in der Familie keine Sprache gibt?
  bad_version_risk: Die Szene würde kippen, wenn sie auf Tränen, große Erklärungen oder bloßes Elendsvokabular setzt statt auf konkrete Wahrnehmung und Handlung.
  revision_focus: Fliesen, Fuge, Heizlüfter, Wasser, Gewicht und Blickvermeidung müssen die Szene tragen; keine nachträgliche Auswertung im Schlussakkord.
  endzustand_hook: Nicht Krankheit als Abstraktion, sondern der warme Stoff des Handtuchs nach dem Lift-Moment bleibt als Nachdruck stehen.
  proof_object: angewärmtes Handtuch
  alltagswaffe: Blickvermeidung als Selbstschutz
  object_anchor: Fuge neben der Wanne
  prop_anchor: Heizlüfter
  kindmoment: Der Sohn merkt, dass seine Hände plötzlich die Arbeit von Erwachsenen übernehmen.
  setup: CF001, CF002, CF003, CF004, CF005, OT001, OT002, OT003
```

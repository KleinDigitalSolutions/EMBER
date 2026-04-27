# EMBER Book Pipeline Agent Notes

Diese Datei ist technische Referenz fuer Agents und Entwickler. Sie ist nicht als Prosa-Draft-Kontext gedacht. Die kreative Regie soll kurz bleiben; der Draft-Prompt bekommt nur den schlanken Blueprint, relevante Canon-Fakten, Character-State, Open Threads und die aktuelle Scene Intention.

## Grundsatz

Harte Regeln schuetzen Kanon. Scene Cards fuehren Absicht. Die irreversible Veraenderung ist verbindlich. Die Prosa gehoert dem Modell.

## Draft-Kontext

Der Prosa-Draft nutzt:
- Premise, Reader Promise, Ending Promise, Thematic Core
- Author Intent und Current Focus
- relevante Locked Facts
- kurze Writer Rules und Prose Preferences
- relevante Canon-/Character-/Thread-Ausschnitte
- Hard Constraints fuer POV, Ort, Zeit, Namen, Locked Facts und echte Objekt-/Farbkontinuitaet
- Soft Scene Guidance als Intention
- Human Edit Memory als fokussierte Before/After-Beispiele

Der Prosa-Draft soll nicht dauerhaft mit Market Brief, Amazon Ops, langer Agenten-Doku, Cost Ledgern, vollstaendigen Guardrail-Listen oder Kapitel-Schreibregie gefuettert werden.

## Hard vs Soft

Hard Constraints:
- `pov`
- `location` / `ort`
- `timeAnchor` / `uhrzeit`
- Locked Facts
- Canon-Namen
- Objekt-/Farbkontinuitaet
- `object_anchor`, `prop_anchor`, `locked_object`
- `required_material` nur sehr sparsam, wenn ein konkretes Material wirklich unverzichtbar ist

Soft Guidance:
- `objective`
- `opening`
- `coreAction`
- `dramaticBeat`
- `ending`
- `closingLine`
- `proof_object` / `beweisobjekt`
- `alltagswaffe`
- `ersetzungsmoment`
- `kindmoment` / `mila_kindmoment`
- `false_friend_signal`
- `ending_type`
- `bad_version_risk`, `revision_focus`, `avoid`

Soft heisst nicht unwichtig. Soft heisst: Das Modell darf organisch loesen, solange die Szene dieselbe Funktion und irreversible Veraenderung erfuellt.

## Scene Intention

Die Runtime baut aus alten und neuen Scene-Card-Feldern eine Scene Intention:
- Situation
- Want
- Pressure
- Concrete material
- Intended turn
- Irreversible change
- Aftertaste
- Avoid

Prompt-Regel:

```text
Use soft guidance as intention, not as a checklist. Do not mechanically include every listed object, phrase, or beat. Preserve the scene's irreversible change; find the most natural path there.
```

## Empfohlene Scene-Card-Struktur

```text
id:
title:
pov:
where_when:
situation:
want:
pressure:
material:
turn:
irreversible_change:
thread:
avoid:
aftertaste:
```

Optional:
- `word_target_min`
- `word_target_max`
- `ending_type` nur fuer Rhythmus-Audit, nicht als Schreibauftrag
- `object_anchor` / `prop_anchor` nur fuer echte Kontinuitaetsanker

## Mapping Alter Felder

- `objective` -> `want`
- `opening` -> `situation`
- `szenenantrieb` -> `pressure`
- `coreAction` -> `situation` / action
- `proof_object` / `beweisobjekt` -> `material`
- `alltagswaffe` -> `pressure` / `material`
- `dramaticBeat` / `reversal` -> `turn`
- `konkrete_folge` / `cost` / `status_shift` -> `irreversible_change`
- `ending` / `closingLine` -> `aftertaste`
- `bad_version_risk` / `revision_focus` -> `avoid`
- `main_question` / `information_gap` -> `thread`

## Audits

Quality- und Continuity-Audits warnen. Sie sollen Prosa nicht automatisch formen. Continuity-Blocker bleiben fuer echte Drift relevant; Smoothness, Abstract-Nouns, Overprecision und Rhythmus sind Quality Warnings.

## Human Edit Memory

Human Edit Memory soll Opus nicht ganze Szenen kopieren lassen. Es liefert fokussierte Before/After-Fenster um die echte Aenderung herum. Gute Beispiele zeigen:
- Deutung zu Objekt/Körper/Handlung
- Proof-Kommentar zu materiellem Detail
- glatte Innensicht zu beobachtbarer Handlung
- zu perfekte Druckfigur zu kleinem falschen Ton oder unvollstaendigem Zugriff

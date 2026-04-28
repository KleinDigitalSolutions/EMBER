

Hart — Pipeline bricht ohne das
Master Brief:
- premise
- readerPromise
- thematicCore
- authorIntent
- currentFocus

Market Brief:
- categoryLane
- hook

Locked Facts:
- institutionName
- incidentTime / incidentDate
- notificationTime
- evaAlibiLocation / evaAlibiWindow
- documentedPickupPerson

Continuity Guardrails:
- Figurennamen mit vollem Namen (Pipeline prüft Namensdrift)
- Objektfarben (Pipeline prüft Farbdrift automatisch)
Scene Cards — was die Pipeline liest
Pflichtfelder:
- id
- pov
- ort / location
- uhrzeit / timeAnchor

Aus diesen baut die Pipeline die Scene Intention:
- situation
- want
- pressure
- material / proof_object / beweisobjekt
- turn / reversal / dramatic_beat
- irreversible_change / konkrete_folge / cost
- avoid / bad_version_risk

Rhythm-Metadaten (für auditSceneRhythm):
- ending_type
- kindmoment / mila_kindmoment

Fusionskapitel:
- word_target_min
- word_target_max
Was die Pipeline aktiv filtert — also weglassen
Diese Keys kommen nie beim Writer an:
- payoff
- setup
- nora_kosten
- nora_moral_riss
- endzustand_hook
- scene_promise
- new_question
- wissensgrenze

Diese kommen nie in den Writer-Kontext:
- endingPromise (Master Brief)
- storyArchitecture[1+]
- nextBeat summary/excerpt
World Bible Einträge
Für jeden Charakter:
- kind: "character"
- title: Vorname + Nachname (Pipeline schützt den vollen Namen)
- summary: NUR Gegenwartszustand, kein Arc, kein Payoff
  → Pipeline nimmt summary wie es ist, kein automatischer Trim

Für wichtige Objekte:
- kind: "object"
- title + summary mit Farbe wenn relevant
  → Pipeline extrahiert Farbanker automatisch
Was nach jeder akzeptierten Szene wächst
Die Pipeline baut Canon-, Character- und Thread-Ledger inkrementell. Das heißt World Bible-Einträge müssen am Anfang nicht perfekt sein — sie werden durch akzeptierte Draft-Jobs verfeinert. Aber der initiale Summary-Text eines World Bible-Eintrags darf keinen Arc oder Payoff enthalten, weil der immer sichtbar bleibt.

Kurzformel
Regie beschreibt Gegenwartszustand und Druck, nie Auflösung. Alles was mit "wird später" oder "stellt sich heraus" anfängt, gehört nicht in World Bible Summary oder Scene Card — sondern bleibt im EMBER-Dokument für den Menschen, kommt aber nie in die Pipeline.
Du bist Codex und agierst als Staff-Level Software Engineer, System Architect und LLM-Orchestration-Engineer.

Baue ein vollständiges, lokal ausführbares Python-Projekt für eine Langform-Roman-Pipeline, die mit der Anthropic Claude API arbeitet und Claude Opus 4.7 über die API nutzt. Ziel ist ein System, das Romane/Bücher mit 300+ Seiten generieren, planen, prüfen, überarbeiten und konsistent halten kann, ohne dass Figuren, Orte, Objekte, Timeline, Wissen, Beziehungen oder offene Story-Versprechen driften.

Der Projektname soll sein:

novel-director

WICHTIGES ZIEL:
Das System soll nicht einfach "viel Text generieren", sondern eine Story-State-Maschine mit angeschlossener Schreibpipeline sein.

Leitsatz:
Das Modell darf Prosa schreiben, aber es darf nicht allein entscheiden, was kanonisch wahr ist.

Arbeite produktionsnah, aber pragmatisch. Das Ergebnis soll sofort per CLI nutzbar sein, mit klarer Projektstruktur, Tests, Beispieldaten und Dokumentation.

====================================================================
1. TECHNOLOGIE-ENTSCHEIDUNGEN
====================================================================

Verwende:

- Python 3.11+
- anthropic Python SDK
- pydantic v2 für Datenmodelle und Validierung
- typer für CLI
- rich für schöne CLI-Ausgaben
- sqlite für persistente Speicherung
- SQLAlchemy oder sqlite3, entscheide pragmatisch
- pytest für Tests
- python-dotenv für lokale .env
- pyyaml für YAML-Projektdateien
- optional: SQLite FTS5 für einfache textuelle Retrieval-Suche
- keine schwere Vektor-DB als Pflichtdependency
- baue die Architektur so, dass später Embeddings/Vektor-Retrieval ergänzt werden können

Das System muss über Umgebungsvariablen konfigurierbar sein:

ANTHROPIC_API_KEY
ANTHROPIC_MODEL=claude-opus-4-7
ANTHROPIC_CHECKER_MODEL=claude-opus-4-7
ANTHROPIC_FAST_MODEL=claude-sonnet-4-6
NOVEL_DIRECTOR_DB=.novel/state.sqlite
NOVEL_DIRECTOR_PROJECT=.

Nutze standardmäßig Opus 4.7 für wichtige kreative und analytische Schritte.
Erlaube optional ein günstigeres Modell für triviale Checks, aber baue keine harte Abhängigkeit darauf.

Niemals API Keys hardcoden.
Niemals User-Content an externe APIs senden, außer über die explizit konfigurierte Anthropic-Schnittstelle.
Alle Modellaufrufe müssen zentral über einen Client laufen.

====================================================================
2. HAUPTARCHITEKTUR
====================================================================

Baue das System in vier Hauptschichten:

A. Canon Bible
Grundlegende, relativ stabile Wahrheit der Geschichte:
- Figuren
- Orte
- Objekte
- Institutionen
- Weltregeln
- Stilregeln
- Themen
- Motive

B. Narrative State
Aktueller Zustand:
- aktueller Aufenthaltsort von Figuren
- körperlicher/emotionaler Zustand
- Inventar
- aktuelle Beziehungen
- Wissensstände
- falsche Annahmen
- Geheimnisse
- Timeline
- offene Promises/Payoffs
- aktive Konflikte

C. Story Plan
Planungsstruktur:
- Roman-DNA
- Figuren-Arcs
- Aktstruktur
- Kapitelplan
- Szenenkarten

D. Draft Text
Generierte Szenen/Kapitel:
- Rohfassung
- revidierte Fassung
- finale Fassung
- Szene-Summaries
- State-Diffs
- Continuity Reports

Trenne diese Ebenen strikt.

Das Modell darf Draft-Text erzeugen.
Das Modell darf State-Diffs vorschlagen.
Aber nur ein validierter State-Diff wird in den offiziellen Zustand übernommen.

====================================================================
3. DATEI- UND ORDNERSTRUKTUR
====================================================================

Erzeuge diese Struktur:

novel-director/
  pyproject.toml
  README.md
  .env.example
  src/
    novel_director/
      __init__.py
      cli.py
      config.py
      anthropic_client.py

      models/
        __init__.py
        canon.py
        state.py
        planning.py
        draft.py
        reports.py

      storage/
        __init__.py
        db.py
        repository.py
        migrations.py

      prompts/
        __init__.py
        templates.py
        system_prompts.py

      pipeline/
        __init__.py
        bootstrap.py
        planner.py
        context_builder.py
        scene_writer.py
        continuity_checker.py
        dramaturgy_checker.py
        voice_checker.py
        life_pass.py
        fact_extractor.py
        state_diff_validator.py
        chapter_assembler.py
        export.py

      retrieval/
        __init__.py
        search.py
        relevance.py

      utils/
        __init__.py
        ids.py
        text.py
        json_repair.py
        logging.py

  examples/
    melancholic_thriller/
      project.yaml
      canon/
        characters.yaml
        locations.yaml
        objects.yaml
        style_bible.yaml
        world_rules.yaml
      planning/
        premise.md
        theme.md
        act_structure.yaml
        chapter_outline.yaml
        scene_cards.yaml

  tests/
    test_models.py
    test_state_diff.py
    test_context_builder.py
    test_prompt_contracts.py
    test_pipeline_smoke.py

====================================================================
4. DATENMODELLE
====================================================================

Implementiere robuste Pydantic-Modelle.

Wichtige Entities:

Character:
- id
- name
- aliases
- age
- role
- physical_description
- background
- core_wound
- conscious_want
- unconscious_need
- greatest_fear
- moral_boundary
- default_strategy
- stress_strategy
- dialogue_profile
- pov_profile
- hard_facts
- soft_facts

CharacterState:
- character_id
- current_location_id
- physical_state
- emotional_state
- current_goal
- hidden_goal
- current_fear
- current_strategy
- injuries
- fatigue
- inventory_object_ids
- knowledge_ids
- false_belief_ids
- relationship_notes
- valid_from_scene_id

RelationshipState:
- character_a_id
- character_b_id
- trust_a_to_b: 0-100
- trust_b_to_a: 0-100
- intimacy_a_to_b: 0-100
- intimacy_b_to_a: 0-100
- resentment_a_to_b: 0-100
- resentment_b_to_a: 0-100
- public_dynamic
- private_dynamic
- unsaid_truths
- last_major_change_scene_id

Location:
- id
- name
- function_in_story
- geography
- entrances
- sensory_profile
- social_meaning
- secrets
- persistent_details
- objects_present
- hard_facts
- soft_facts

LocationState:
- location_id
- current_condition
- changes_since_start
- objects_present
- last_scene_id

StoryObject:
- id
- name
- description
- original_owner_id
- current_holder_character_id
- current_location_id
- condition
- symbolic_meaning
- first_appearance_scene_id
- last_seen_scene_id
- known_by_character_ids
- understood_by_character_ids
- hard_facts
- soft_facts

TimelineEvent:
- id
- absolute_day
- date_label
- time_label
- duration_minutes
- scene_id
- location_id
- participating_character_ids
- summary
- causal_links

KnowledgeItem:
- id
- proposition
- truth_status: true / false / unknown / contested
- known_by_character_ids
- believed_by_character_ids
- hidden_from_character_ids
- reader_knowledge_state: unknown / suspected / confirmed
- source_scene_id
- reveal_scene_id
- notes

Secret:
- id
- name
- truth
- cover_story
- knows_truth_character_ids
- believes_cover_character_ids
- reader_state
- setup_scene_ids
- reveal_scene_id
- payoff_scene_id

Promise:
- id
- question_or_promise
- type: mystery / emotional / object / relationship / plot / thematic
- setup_scene_id
- reinforcement_scene_ids
- planned_payoff_scene_id
- actual_payoff_scene_id
- status: open / reinforced / partially_paid / paid / dropped
- emotional_payoff
- logical_payoff

SceneCard:
- id
- chapter_id
- sequence_index
- pov_character_id
- location_id
- timeline_position
- present_character_ids
- required_objects
- scene_objective
- external_conflict
- internal_conflict
- starting_state
- ending_state
- required_reveals
- forbidden_reveals
- required_state_changes
- must_not_break
- allowed_invention
- subtext
- tone
- pacing
- estimated_words

SceneDraft:
- id
- scene_id
- version
- status: raw / checked / revised / final
- text
- created_at
- model
- prompt_hash

StateDiff:
- scene_id
- new_events
- character_state_changes
- relationship_changes
- object_changes
- location_changes
- knowledge_changes
- promise_updates
- timeline_updates
- proposed_new_canon_facts
- conflicts
- confidence
- requires_human_review

ContinuityReport:
- scene_id
- timeline_issues
- inventory_issues
- knowledge_issues
- relationship_issues
- location_issues
- canon_conflicts
- severity
- recommended_fixes

DramaturgyReport:
- scene_id
- has_turn
- conflict_strength
- emotional_movement
- pacing_notes
- exposition_risk
- mechanical_risk
- recommendations

VoiceReport:
- scene_id
- pov_consistency
- dialogue_consistency
- overexplanation
- repeated_patterns
- prose_rhythm
- recommendations

====================================================================
5. CANON-KLASSEN
====================================================================

Implementiere Fact-Klassifikation:

Hard Canon:
Darf nicht verletzt werden.
Beispiele: Alter, Familienverhältnisse, zentrale Vergangenheit, Weltregeln.

Soft Canon:
Darf ausgeschmückt werden, solange kein Widerspruch entsteht.
Beispiele: Gerüche, kleine Raumdetails, Nebengewohnheiten.

Scene-local Detail:
Gilt nur in der Szene und wird nicht automatisch Kanon.

Promoted Canon:
Ein ursprünglich lokales Detail wird nach Validierung dauerhaft übernommen.

State Fact:
Veränderlicher Zustand. Beispiel: Figur hat aktuell Objekt X.

Belief Fact:
Eine Figur glaubt etwas. Kann objektiv falsch sein.

Reader Knowledge:
Was der Leser weiß, ahnt oder noch nicht wissen darf.

Baue diese Unterscheidung in Modelle und State-Diff-Validierung ein.

====================================================================
6. PIPELINE-ABLAUF
====================================================================

Implementiere einen vollständigen Szenenloop:

1. Lade SceneCard.
2. Retrieve relevante Canon-Fakten.
3. Retrieve aktuellen Story State.
4. Retrieve:
   - POV-Figur
   - anwesende Figuren
   - Ort
   - relevante Objekte
   - Beziehungsmatrix
   - Wissensstände
   - offene Promises
   - letzte Szenen mit denselben Figuren
   - letzte Szene am selben Ort
   - letzte Szene mit demselben Objekt
5. Baue ein Context Packet.
6. Schreibe Szene mit Opus 4.7.
7. Prüfe Continuity.
8. Prüfe Dramaturgie.
9. Prüfe Stimme/Stil.
10. Revidiere Szene.
11. Führe Life Pass aus:
    - weniger mechanisch
    - mehr Subtext
    - keine neuen Plotpunkte
    - kein Canon-Bruch
    - Dialog weniger erklärend
    - mehr körperliche/emotionale Reibung
12. Extrahiere neue Fakten.
13. Erzeuge vorgeschlagenen State-Diff.
14. Validiere State-Diff gegen Canon und aktuellen State.
15. Falls schwerer Konflikt:
    - Szene markieren
    - Report erzeugen
    - nicht automatisch in State übernehmen
16. Falls okay:
    - Draft speichern
    - State aktualisieren
    - Summary speichern
    - Retrieval-Index aktualisieren

Baue dafür eine Orchestrator-Funktion:

run_scene(scene_id: str) -> SceneRunResult

Und eine Kapitel-Funktion:

run_chapter(chapter_id: str) -> ChapterRunResult

====================================================================
7. CLI
====================================================================

Implementiere eine CLI mit Typer.

Befehle:

novel init PATH
- erzeugt neues Projektgerüst

novel validate
- validiert Canon, Plan, State

novel plan bootstrap
- erzeugt aus premise/theme/chapter outline initiale Szenenkarten, falls noch nicht vorhanden

novel scene run SCENE_ID
- generiert und prüft eine einzelne Szene

novel chapter run CHAPTER_ID
- generiert alle Szenen eines Kapitels

novel chapter assemble CHAPTER_ID
- setzt finale Szenen zu Kapiteltext zusammen

novel export markdown
- exportiert Buch als Markdown

novel export docx
- optional, nur wenn leicht machbar, sonst Markdown reicht

novel report continuity
- zeigt offene Continuity-Probleme

novel report promises
- zeigt offene Promises/Payoffs

novel report characters
- zeigt aktuelle Zustände aller Figuren

novel inspect scene SCENE_ID
- zeigt Szene, State-Diff, Reports, verwendete Context-Fakten

novel state diff SCENE_ID
- zeigt den vorgeschlagenen State-Diff

novel state approve SCENE_ID
- übernimmt vorgeschlagenen State-Diff manuell

novel state reject SCENE_ID
- verwirft vorgeschlagenen State-Diff

====================================================================
8. ANTHROPIC CLIENT
====================================================================

Baue einen zentralen Client:

class AnthropicLLM:
    def complete_json(...)
    def complete_text(...)
    def stream_text(...)

Anforderungen:

- liest API-Key aus env
- liest Modell aus env
- unterstützt system prompt
- unterstützt messages
- setzt max_tokens explizit
- hat Retry-Logik mit exponential backoff
- loggt token usage, model, latency
- speichert keine API keys in Logs
- kann JSON-Antworten robust parsen
- bei ungültigem JSON:
  1. JSON-Reparatur lokal versuchen
  2. wenn nötig, Modell mit repair prompt erneut aufrufen
- alle Prompts versionieren oder mindestens hashen
- Responses zusammen mit Prompt-Hash speichern

Wichtig:
Für strukturierte Outputs immer verlangen:
"Return only valid JSON. No markdown. No commentary."

====================================================================
9. PROMPTING-ROLLEN
====================================================================

Baue Prompts als klar getrennte Rollen.

A. Showrunner / Planner
Aufgaben:
- Thema
- Makrostruktur
- Figuren-Arcs
- Payoffs
- Pacing

B. Scene Writer
Aufgabe:
- lebendige Prosa schreiben
- keine Tabellen
- keine mechanische Erklärung
- kein ungeprüfter Canon-Ausbau

C. Continuity Editor
Aufgabe:
- Timeline
- Inventar
- Wissen
- Beziehungen
- Orte
- Objekte
- Canon-Konflikte

D. Dramaturg
Aufgabe:
- Szenenwende
- Konfliktstärke
- emotionale Bewegung
- Pacing
- Expositionsrisiko
- mechanisches Gefühl

E. Voice/Line Editor
Aufgabe:
- POV-Stimme
- Dialogprofil
- Rhythmus
- Wiederholungen
- Subtext
- Übererklärung

F. Life Pass Editor
Aufgabe:
- Szene lebendiger machen
- keine neuen Fakten
- keine neuen Plotpunkte
- mehr menschliche Reibung
- weniger perfekte Regie

G. Fact Extractor
Aufgabe:
- neue explizite Fakten extrahieren
- Fakt/Bewertung/Vermutung trennen
- Figurenwissen von objektiver Wahrheit trennen
- scene-local vs promoted canon unterscheiden

H. Canon Librarian
Aufgabe:
- State-Diff validieren
- nicht automatisch alles kanonisieren
- Konflikte markieren

====================================================================
10. SCENE CONTEXT PACKET
====================================================================

Implementiere ContextBuilder, der für eine Szene ein kompaktes Paket erzeugt.

Das Paket soll enthalten:

- Scene Objective
- Starting State
- Required Ending State
- POV Character State
- Present Character States
- Relationship Matrix
- Location Facts
- Object Facts
- Timeline Facts
- Knowledge Constraints
- Secrets touched by this scene
- Open Promises touched by this scene
- Must Not Break
- Forbidden Reveals
- Allowed Invention
- Style Instructions
- Recent Relevant Scene Summaries

Wichtig:
Der Writer bekommt keine riesige Datenbank.
Der Writer bekommt verdichtete Regie.
Die Checker bekommen strukturiertere Daten.

====================================================================
11. SCENE WRITER PROMPT
====================================================================

Baue einen Prompt in etwa dieser Logik:

System:
Du bist ein literarischer Scene Writer für einen Langform-Roman. Du schreibst lebendige, konkrete Prosa. Du respektierst Canon und aktuellen Story State. Du erfindest keine harten Fakten, keine neuen wichtigen Objekte, keine neuen Backstory-Wahrheiten und keine Reveals außerhalb der Vorgaben. Du darfst kleine sinnliche, körperliche und dialogische Details erfinden, solange sie scene-local bleiben und keinen Canon brechen.

User:
Hier ist das Context Packet.
Schreibe die Szene mit ungefähr X Wörtern.
Ziel:
- Am Ende müssen diese Zustände wahr sein: ...
- Diese Dinge dürfen nicht passieren: ...
- Diese Informationen dürfen nicht verraten werden: ...
- Nutze Subtext.
- Figuren sollen nicht alles aussprechen.
- Keine mechanische Exposition.
- Kein Zusammenfassen statt Szene.
- Zeige Handlung, Körperlichkeit, Raum und Dialog.
- Halte POV strikt.
- Keine Kapitelüberschrift, nur Szenentext.

====================================================================
12. CONTINUITY CHECKER PROMPT
====================================================================

Output: JSON nach ContinuityReport Schema.

Prüfe:

- Timeline:
  Kann diese Szene zu diesem Zeitpunkt passieren?
  Passen Reisezeiten, Tageszeit, Schlaf, Verletzungen, Dauer?

- Inventory:
  Hat die Figur die Objekte, die sie benutzt?
  Ist der Objektzustand korrekt?

- Knowledge:
  Weiß die Figur das wirklich?
  Weiß der Leser das schon?
  Wird ein Geheimnis zu früh verraten?
  Verwechselt der Text objektive Wahrheit mit Figurenvermutung?

- Relationships:
  Passt Verhalten zum aktuellen Beziehungsstand?
  Wurde ein Konflikt plötzlich vergessen?
  Ist eine Versöhnung verdient?

- Location:
  Sind persistente Ortsdetails stabil?
  Sind Veränderungen nachvollziehbar?

- Canon:
  Gibt es harte Widersprüche?

Kennzeichne jede Issue mit:
- severity: low / medium / high / critical
- evidence_quote
- violated_fact_id, falls vorhanden
- suggested_fix

====================================================================
13. DRAMATURGY CHECKER PROMPT
====================================================================

Output: JSON nach DramaturgyReport Schema.

Prüfe:

- Hat die Szene eine echte Wendung?
- Was ändert sich zwischen Anfang und Ende?
- Will jede Figur etwas?
- Gibt es Konflikt oder nur Informationsaustausch?
- Ist die Szene zu sauber/mechanisch?
- Ist der Subtext stärker als der Text?
- Wird zu viel erklärt?
- Ist das Ende stärker als der Anfang?
- Wiederholt die Szene eine vorherige Szenenform?
- Gibt es emotionale Konsequenz?

====================================================================
14. VOICE CHECKER PROMPT
====================================================================

Output: JSON nach VoiceReport Schema.

Prüfe:

- POV-Konsistenz
- Sprachmuster der POV-Figur
- Dialogprofile jeder Figur
- typische Vermeidungsstrategien
- Übererklärung
- KI-typische Satzmuster
- monotone Rhythmik
- wiederholte Motive ohne Absicht
- zu perfekte Symmetrie

====================================================================
15. LIFE PASS PROMPT
====================================================================

Der Life Pass ist zentral.

Er soll die Szene NICHT neu plotten.

Promptlogik:

Du bist ein literarischer Editor. Verbessere diese Szene so, dass sie weniger mechanisch und lebendiger wirkt.

Regeln:
- Keine neuen Plotpunkte.
- Keine neuen harten Fakten.
- Keine neuen wichtigen Objekte.
- Keine neuen Backstory-Enthüllungen.
- Keine Änderung am Szenen-Endzustand.
- Keine Änderung an Timeline, Ort, Inventar oder Geheimnissen.
- Erhöhe Subtext.
- Reduziere direkte emotionale Erklärung.
- Figuren sollen nicht immer optimal antworten.
- Erhöhe kleine Reibungen:
  - Ausweichen
  - Verzögerung
  - körperliche Müdigkeit
  - unvollständige Antworten
  - Gegenfragen
  - soziale Peinlichkeit
  - kleine Raumstörungen
- Erhalte literarische Qualität.
- Gib nur den überarbeiteten Szenentext zurück.

====================================================================
16. FACT EXTRACTOR
====================================================================

Output: JSON nach StateDiff Schema.

Der Extractor muss unterscheiden:

- objective_event
- character_belief
- false_belief
- reader_knowledge
- object_state_change
- location_state_change
- relationship_shift
- emotional_state_change
- promise_update
- possible_new_canon
- scene_local_detail

Wichtig:
Nicht interpretieren, wenn es nicht explizit oder stark belegt ist.
Keine poetische Beschreibung als harten Fakt speichern.
Keine Metapher als Weltfakt speichern.
Keine Vermutung als Wahrheit speichern.

Beispiel:
"Mara fühlte sich, als hätte Elias sie verraten" ist kein objektiver Fakt, dass Elias sie verraten hat.
Es ist ein emotionaler/belief state von Mara.

====================================================================
17. STATE DIFF VALIDATOR
====================================================================

Implementiere Validator-Regeln:

- Hard Canon darf nicht überschrieben werden.
- Objekt kann nicht gleichzeitig bei zwei Figuren sein.
- Figur kann nicht ohne Reisezeit an zwei Orten sein.
- Figur kann nur wissen, was sie erfahren hat.
- Geheimnis darf nicht vor Reveal-Szene bestätigt werden.
- Promise darf nicht als paid markiert werden, wenn kein logischer/emotionaler Payoff existiert.
- Beziehungssprünge über definierte Schwellen brauchen Begründung.
- Neue wichtige Objekte brauchen explizite Promotion.
- Scene-local Details werden nicht dauerhaft übernommen.
- Widersprüche erzeugen requires_human_review=True.

Implementiere deterministische Checks, wo möglich.
Ergänze LLM-Checks für semantische Dinge.

====================================================================
18. RETRIEVAL
====================================================================

Baue ein einfaches Retrieval-System:

- Speichere Scene Summaries
- Speichere Chapter Summaries
- Speichere State Diffs
- Speichere wichtigen Draft-Text
- Unterstütze Suche nach:
  - character_id
  - location_id
  - object_id
  - promise_id
  - text query

ContextBuilder soll holen:

- letzte 3 Szenen allgemein
- letzte Szene mit POV-Figur
- letzte Szene mit jeder anwesenden Figur
- letzte Szene zwischen wichtigen Figurenpaaren
- letzte Szene am selben Ort
- letzte Szene mit relevantem Objekt
- offene Promises, die die SceneCard berührt
- aktuelle Knowledge Constraints

====================================================================
19. SCENE-SHAPE-VARIATION
====================================================================

Baue Tracking gegen Monotonie.

Speichere pro Szene:

- scene_type
- opening_type
- ending_type
- conflict_type
- dialogue_ratio estimate
- introspection_ratio estimate
- action_ratio estimate
- emotional_tone
- pacing
- exposition_density

Der Dramaturgie-Checker soll warnen, wenn:
- zu viele Szenen gleich beginnen
- zu viele Szenen mit melancholischer Reflexion enden
- zu viele Dialoge als Informationsaustausch funktionieren
- zu viele Mini-Cliffhanger hintereinander auftreten
- keine äußere Varianz vorhanden ist

====================================================================
20. EXPORT
====================================================================

Exportiere:

book.md
chapters/chapter_001.md
reports/continuity.md
reports/promises.md
reports/characters.md
reports/timeline.md

Optional:
docx, wenn leicht machbar.

Markdown reicht als Muss.

====================================================================
21. README
====================================================================

Schreibe eine gute README mit:

- Was das Projekt macht
- Setup
- .env
- Beispielbefehle
- Projektstruktur
- Pipeline-Erklärung
- Wie man ein neues Projekt anlegt
- Wie man Szenen generiert
- Wie man State-Diffs prüft
- Wie man exportiert
- Architekturdiagramm als Text
- Warnung: Modellkosten beachten
- Hinweis: Anthropic API Key benötigt

====================================================================
22. EXAMPLE PROJECT
====================================================================

Lege ein kleines Beispielprojekt an:

Genre:
melancholischer Thriller

Arbeitsname:
"Der Bahnhof ohne Morgen"

Figuren:
- Mara, kontrollierte Ermittlerin mit Schuldthema
- Elias, früherer Insider, der durch Ausweichen lügt
- Viktor, höflicher Antagonist mit Familienverbindung

Ort:
alter Bahnhof

Objekt:
silbernes Feuerzeug
Spind 17
Umschlag

Geheimnis:
Elias war früher für Viktor tätig.
Viktor ist für einen alten Brand verantwortlich.
Mara weiß das am Anfang nicht.

Erzeuge:
- 3 Kapitel
- ca. 8 Szenenkarten
- genug Canon/State, damit Tests und Smoke Run funktionieren

Nicht das ganze Buch generieren.
Nur Beispielstruktur.

====================================================================
23. TESTS
====================================================================

Baue Tests für:

- Pydantic-Modelle validieren
- Hard Canon kann nicht überschrieben werden
- Objekt kann nicht an zwei Orten zugleich sein
- Character Knowledge wird getrennt von objektiver Wahrheit
- ContextBuilder liefert relevante Fakten
- StateDiff mit Konflikt erzeugt requires_human_review
- CLI validate läuft auf Beispielprojekt
- Prompt Templates enthalten JSON-only Instruktionen bei strukturierten Outputs
- Smoke Test kann ohne echte API mit MockAnthropicLLM laufen

Wichtig:
Tests dürfen nicht echte Anthropic API aufrufen.
Baue MockLLM.

====================================================================
24. MOCK LLM
====================================================================

Implementiere MockAnthropicLLM für Tests.

Er soll deterministische Antworten liefern für:
- scene writer
- continuity checker
- dramaturgy checker
- voice checker
- fact extractor

So müssen Tests offline laufen.

====================================================================
25. QUALITÄTSKRITERIEN
====================================================================

Das Projekt gilt erst als fertig, wenn:

- `pip install -e .` funktioniert
- `novel --help` funktioniert
- `novel init mybook` funktioniert
- `novel validate` auf example funktioniert
- `novel scene run scene_001 --mock` funktioniert
- `novel chapter assemble chapter_001` funktioniert
- `novel export markdown` funktioniert
- `pytest` grün ist
- README erklärt die Nutzung verständlich
- keine API Keys hardcoded sind
- echte API Calls zentral über AnthropicLLM laufen
- alle strukturierten LLM-Antworten validiert werden
- State-Diff nicht blind übernommen wird

====================================================================
26. WICHTIGE DESIGNPHILOSOPHIE
====================================================================

Baue das System so:

Strenge Daten für Wahrheit.
Flexible Regie für Szenen.
Kreative Freiheit in Ausführung.
Konservative Kanonisierung.
Regelmäßige emotionale und dramaturgische Prüfungen.
Bewusste Imperfektion gegen mechanische Prosa.

Vermeide:
- zu viel Outline im Writer-Prompt
- zu viel Datenbankdump im Writer-Prompt
- automatische Kanonisierung jedes hübschen Details
- Figuren als bloße Adjektivlisten
- Plot ohne Figurenwillen
- Dialog als reine Informationsübertragung

Erzwinge:
- Figurenwille pro Szene
- Subtext
- Beziehungskontinuität
- Wissensstandsprüfung
- Objekt- und Location-Kontinuität
- Promise/Payoff-Tracking
- State-Diff nach jeder Szene
- Life Pass gegen "perfekte Regie ohne Leben"

====================================================================
27. IMPLEMENTIERUNGSREIHENFOLGE
====================================================================

Arbeite in dieser Reihenfolge:

1. Projektstruktur und pyproject.toml
2. Config und .env.example
3. Pydantic-Modelle
4. Storage Layer
5. Example Project
6. CLI Grundgerüst
7. AnthropicLLM und MockLLM
8. Prompt Templates
9. ContextBuilder
10. Scene Writer
11. Checker
12. Fact Extractor
13. State Diff Validator
14. Pipeline Orchestrator
15. Exporter
16. Reports
17. Tests
18. README
19. Finaler Smoke Test

Nach jedem größeren Schritt:
- Code konsistent halten
- keine toten Imports
- Tests aktualisieren
- README ggf. ergänzen

====================================================================
28. OUTPUT-ERWARTUNG AN DICH, CODEX
====================================================================

Implementiere das Projekt vollständig.
Erkläre nicht nur.
Schreibe die Dateien.
Führe Tests aus.
Behebe Fehler.
Liefere am Ende eine kurze Zusammenfassung:

- Was wurde gebaut?
- Wie installiert man es?
- Welche Befehle sind wichtig?
- Welche Tests wurden ausgeführt?
- Welche offenen TODOs bleiben, falls überhaupt?

Wenn du wegen Zeit/Umgebung etwas nicht ausführen kannst, implementiere trotzdem die Dateien bestmöglich und dokumentiere die genaue Einschränkung.

Beginne jetzt mit der Implementierung.
# EMBER Studio Plan

## Ziel
EMBER soll kein gewöhnliches CMS werden, sondern ein Authoring-Studio für verzweigte Premium-Storys. Autoren sollen primär schreiben, nicht technische Zustände pflegen. Die Engine muss Struktur, Entscheidungen, Konsistenz, Playtest, KI-Hilfe und spätere Einreichung in einen klaren Workflow bringen.

## Produktprinzipien
- Schreiben zuerst, Technik im Hintergrund.
- Ein kanonisches Story-Dokument für alle Ansichten.
- KI als optionaler Assistent, nie als Zwang.
- Jede KI-Änderung kommt als Vorschlag oder Patch, nicht als blinder Auto-Write.
- Premium-Store bleibt kuratiert; Community und Premium sind getrennte Veröffentlichungspfade.

## Entscheidung zum Stack
### Empfehlung
- Frontend/App: Next.js mit TypeScript auf Vercel
- Datenbank/Auth/Storage: Supabase `erledigt 2026-04-18`
- Zahlungen: Stripe
- Lokales Teilen von Prototypen: Cloudflare Quick Tunnel oder regulärer Cloudflare Tunnel

### Warum so
- Supabase ist für dieses Produkt stärker als reine Vercel-Storage-Lösungen, weil Postgres, Auth, Storage und RLS zusammenkommen.
- Vercel ist sehr gut für Frontend, Preview-Deployments und API-Routen, aber Vercel bietet laut aktueller Doku Postgres nur über externe Marketplace-Integrationen an, nicht als eigene Kern-Datenbank.
- Cloudflare Tunnel ist gut für lokale Reviews. Quick Tunnels sind aber laut Cloudflare nur für Testing gedacht, mit harten Limits und ohne SSE.

## Architektur
### Schicht 1: Story Schema
Ein einziges Story-Dokument als Quelle der Wahrheit. `erledigt 2026-04-18` (inkl. Book-Blueprint)

```ts
Story {
  id
  workspace_id
  title
  status
  meta
  world_bible
  variables[]
  acts[]
  versions[]
}
```

```ts
Scene {
  id
  chapter_id
  title
  summary
  blocks[]
  choices[]
  ai_state
}
```

```ts
Choice {
  id
  label
  to_scene_id
  conditions[]
  effects[]
  weight
}
```

### Schicht 2: Authoring Engine
Commands statt direkter Wild-West-Edits. `erledigt 2026-04-18` (Server-side Persistence implementiert)
- `create_act`
- `create_chapter`
- `create_scene`
- `update_scene_block`
- `add_choice`
- `set_condition`
- `set_effect`
- `move_scene`
- `approve_ai_patch`
- `submit_for_review`

### Schicht 3: Runtime Engine
Verwendet dasselbe Story-Dokument für:
- Reader
- Playtest
- Branch-Validierung
- Review-Vorschau
`erledigt 2026-04-18`

### Schicht 4: AI Orchestration
Die KI arbeitet nie direkt auf dem finalen Story-Text. `erledigt 2026-04-18` (Book-Job-Service implementiert)
- Eingabe: Story-Kontext, World Bible, Stilregeln, Ziel der Aktion
- Ausgabe: strukturierter Vorschlag
- Formen:
  - `suggestion`
  - `rewrite_patch`
  - `branch_options`
  - `continuity_report`
  - `submission_report`

## Studio-Oberfläche
### Kernansichten
- `Plan`: Acts, Kapitel, Szenen, Decision Slots `erledigt`
- `Write`: fokussierter Szenen-Editor `erledigt`
- `Matrix`: Szenen gegen Flags, Branches, Figuren, Payoffs `erledigt`
- `Outline`: lineare Übersicht `erledigt`
- `Playtest`: Story als Leser testen `erledigt`
- `Review`: narrative Compiler-Sicht `erledigt` als lokales Submission Gate

### Wichtige Studio-Mechaniken
- Decision Slots: Das Studio schlägt vor, wo Entscheidungen dramaturgisch Sinn ergeben. `erledigt` als lokaler Editor-Flow
- Branch Budget: Zeigt, wie stark eine Story sich verzweigt und wo Rückführungen nötig sind.
- Continuity Graph: Prüft Figurenwissen, gesetzte Flags und unbezahlte Setups. `erledigt 2026-04-18` (lokaler Review-Check & Memory Ledger)
- Submission Gate: Vor Einreichung werden Qualitäts-, Konsistenz- und Store-Felder geprüft. `erledigt` als lokaler Review-Check

## Autoren-Workflow
### Ohne KI
1. Story anlegen
2. Acts und Kapitel planen
3. Szenen schreiben
4. Decision Slots setzen
5. Playtest durchführen
6. Für Review einreichen

### Mit KI
1. Autor schreibt oder skizziert Kapitel oder nutzt AI Drafting. `erledigt 2026-04-18`
2. KI bietet Hilfe auf Knopfdruck:
   - Szene erweitern
   - Szene kürzen
   - Entscheidung erzeugen
   - Konsequenzen ausarbeiten
   - Stil glätten
   - Konsistenz prüfen
3. Autor bestätigt oder verwirft Vorschläge
4. Engine aktualisiert Story erst nach expliziter Freigabe

## KI-Strategie
### Modellpolitik
Wir fahren initial einen Hybrid-Ansatz aus Premium-Modellen und einem guenstigen Test-/Fallback-Pfad.
- OpenAI: Responses API als Primärpfad; `gpt-5.4` als Default für starke Generierungsjobs `erledigt 2026-04-18`
- Anthropic: Claude Opus 4 für schwere Strukturarbeit, Claude Sonnet 4 für den täglichen Draft-/Review-Betrieb `erledigt 2026-04-18`
- Gemini: `gemini-2.5-flash` als dritter Provider fuer schnelle und guenstigere Draft-/Testlaeufe via Google AI Studio / Gemini API `erledigt 2026-04-19`

Optional später:
- kleinere GPT-5-Varianten oder Sonnet/Haiku-Klassen nur für Extraktion, Audits und Hintergrundjobs
- feinere Routing-Regeln fuer Premium-vs.-Kostenpfad je nach Jobtyp

### Betriebsprinzip
- Der Chat ist nie die Quelle der Wahrheit.
- Persistente Kanon-Artefakte liegen im Story-System beziehungsweise später in der DB (Memory Ledger). `erledigt 2026-04-18`
- Pro Schreibschritt wird nur ein kleiner relevanter Kontext-Pack geladen (Context Composer). `erledigt 2026-04-18`
- Statische Prompt-Module stehen vorn, variable Szenendaten hinten, damit Caching sauber greift.
- Provider-State wie Responses/Conversations, `previous_response_id` oder Compaction ist Infrastruktur, nicht das eigentliche Story-Gedaechtnis.

### Einsatzregeln
- Keine KI bei jedem Tastendruck
- Nur explizite Aktionen oder Hintergrund-Checks
- Große Jobs asynchron in Queue
- Ergebnisse versioniert und nachvollziehbar speichern
- Strukturierte Rueckgaben fuer Draft, Extraktion, Continuity und Packaging `erledigt 2026-04-18`
- Keine Volltext-Ladung des gesamten Buchs in jeden Request

### KI-Rollen
- Story Architect: Struktur, Akte, Kapitel, Spannungsbogen
- Scene Editor: Szene verbessern, kürzen, verdichten
- Branch Designer: echte Entscheidungen und Konsequenzen
- Continuity Editor: Logik, Figurenwissen, Flag-Integrität
- Submission Reviewer: Store-Readiness, Hook, Zielgruppe, Risikoanalyse

## Prompt-Architektur
Nicht ein einziger Mega-Prompt. Stattdessen modulare System-Prompts.

### Gemeinsamer Basis-Prompt
- Rolle des Modells
- klare Aufgabe
- keine Ausweichantworten
- keine generischen Schreibseminar-Floskeln
- immer konkret am vorliegenden Material arbeiten
- Stil des Autors respektieren
- keine unnötige Inhaltsaufblähung

### Zusätzliche Prompt-Module
- Genre-Regeln
- Zielgruppe
- gewünschter Ton
- Perspektive
- Story Bible
- aktuelle Szene oder Kapitelkontext
- konkrete Aktion

### Wichtiger Grundsatz
Wir prompten nicht: "Schreibe wie ein berühmter Autor X".
Wir prompten stattdessen auf Fähigkeiten:
- starke Eröffnung
- klare Szenenintention
- subtextreicher Dialog
- präzise Beobachtung
- kontrollierte Exposition
- glaubhafte Konsequenzen
- payoff-orientiertes Setup

So vermeiden wir billige Imitation und rechtliche Grauzonen.

## Decision-Mechanik für Storys
Autoren schreiben nicht einfach nur Kapitel 1, 2, 3 und danach wahllose Choices. Das Studio braucht Regeln.

### Empfohlenes Modell
- Mehrere Leseszenen hintereinander
- dann eine gewichtige Entscheidung
- kleine reaktive Entscheidungen nur sparsam
- große Entscheidungen mit sichtbarem Preis oder Informationsverlust

### Decision-Typen
- Informationsentscheidung: Wem glaube ich?
- Moralentscheidung: Wen verrate ich?
- Risikoentscheidung: Welchen Preis zahle ich?
- Beziehungsentscheidung: Wem öffne ich mich?
- Weltmodellentscheidung: Welche Wahrheit akzeptiere ich?

### Engine-Hilfe
Das Studio sollte pro Kapitel automatisch bewerten:
- Gibt es zu viele Fake-Choices?
- Gibt es zu wenige Konsequenzen?
- Ist Branching zu teuer?
- Wo sollte konvergiert werden?
- Wo fehlt ein echter Entscheidungsmoment?

## Datenmodell
### Kern-Tabellen
- `profiles` `erledigt 2026-04-18`
- `workspaces` `erledigt 2026-04-18`
- `workspace_members`
- `stories` `erledigt 2026-04-18`
- `story_versions` `erledigt 2026-04-18`
- `acts` `erledigt 2026-04-18`
- `chapters` `erledigt 2026-04-18`
- `scenes` `erledigt 2026-04-18`
- `scene_blocks` `erledigt 2026-04-18`
- `choices` `erledigt 2026-04-18`
- `story_variables` `erledigt 2026-04-18`
- `choice_effects` `erledigt 2026-04-18`
- `choice_conditions` `erledigt 2026-04-18`
- `world_bible_entries` `erledigt 2026-04-18`
- `ai_runs` `erledigt 2026-04-18`
- `ai_patches` `erledigt 2026-04-18`
- `book_projects` `erledigt 2026-04-18`
- `book_draft_jobs` `erledigt 2026-04-18`
- `book_canon_facts` `erledigt 2026-04-18`
- `book_character_states` `erledigt 2026-04-18`
- `book_open_threads` `erledigt 2026-04-18`
- `playtest_sessions`
- `submissions`
- `submission_reviews`
- `store_products`
- `store_prices`
- `orders`
- `author_payouts`

### Wichtig
Story-Inhalt nicht nur als ein riesiges JSON-Feld speichern. Zusätzlich normalisierte Tabellen für Query, Analyse, Review und spätere Shop-Filter. `erledigt 2026-04-18` (Supabase Schema implementiert)

## Backend-Entscheidungen
### Lokal jetzt
- noch kein Login
- noch kein Stripe
- noch keine öffentliche Veröffentlichung
- Studio arbeitet lokal oder gegen eine lokale Dev-Datenbank `erledigt 2026-04-18` (Supabase Dev Anbindung aktiv)

### Später
- Google Login über Supabase Auth
- RLS in Supabase für Workspaces, Stories, Drafts und Reviews
- Supabase Storage für Cover, Assets, Story-Dateien
- Vercel für Frontend und Preview-Deployments

## Review- und Publish-Workflow
### Statusmodell
- `draft`
- `playtest`
- `submitted`
- `in_review`
- `changes_requested`
- `approved`
- `scheduled`
- `published`
- `archived`

### Ablauf
1. Autor reicht Story ein
2. Submission Gate prüft Pflichtfelder
3. KI erzeugt Review-Memo
4. Menschlicher Kurator prüft Qualität
5. Freigabe oder Änderungsanforderung
6. Bei Freigabe: Shop-Produkt und Preis aktivieren
7. Story wird veröffentlicht

## Payments
### Empfehlung
- Phase 1 Store: Stripe Checkout für Käufer
- Phase 2 Payouts: Stripe Connect Express für Autoren-Auszahlungen

### Begründung
- Checkout ist schnell und robust
- Connect ist die richtige Stripe-Lösung für Plattformen mit mehreren Parteien
- Für automatische Seller-Payouts ist Connect der sauberere Weg als eigene Bastellogik

### Wichtige Domänenobjekte
- internes Preisobjekt in der DB
- Mapping zu Stripe Product / Price
- Order-Webhook
- Revenue Share Ledger
- Payout-Status pro Autor

## Cloudflare
### Jetzt
Nur für lokales Teilen von Demos.

### Später
Optional vor Vercel für zusätzliche Netzwerk- oder Routing-Anforderungen.

### Wichtiger Hinweis
Quick Tunnels sind laut Cloudflare nicht für Produktion gedacht. Für echte externe Nutzung später regulären Tunnel oder normales Deployment verwenden.

## Sicherheits- und Qualitätsregeln
- KI nur über Server-Seite ansprechen, nie Browser direkt `erledigt 2026-04-18`
- API-Keys nur serverseitig `erledigt 2026-04-18`
- Audit-Log für AI-Patches und Review-Entscheidungen
- Rate Limits auf AI-Aktionen
- Moderation für eingereichte Inhalte
- Rechte- und Lizenzbedingungen für Autoren sauber festhalten

## Entwicklungsphasen
### Phase 0: Foundations
- Next.js + TypeScript aufsetzen `erledigt`
- lokales Story-Schema definieren `erledigt`
- bestehendes Studio-Prototype als visuelle Referenz übernehmen `erledigt`

### Phase 1: Local Studio Core
- Plan/Grid/Outline Views `erledigt`
- Szenen-Editor `erledigt`
- Decision Slots `erledigt`
- lokales Speichern `erledigt`
- Playtest-Engine `erledigt`
- lokales Review-/Submission-Gate `erledigt`
- Create from Outline `erledigt` als lokaler Outline-Composer
- JSON-Import `erledigt` als lokaler Draft-Import

### Phase 2: Data Backbone
- Supabase Projekt
- Tabellen und RLS-Design `erledigt 2026-04-18` als initiales Supabase-Schema im Repo
- Story-Versionierung `erledigt 2026-04-18` als persistente Versions-Tabelle im initialen Schema
- World Bible `erledigt 2026-04-18` als lokale Codex-Bearbeitung im Studio mit Supabase Persistence

### Phase 3: AI Assist
- Server-seitige LLM-Orchestrierung `erledigt 2026-04-18` als initialer Book-Job-Service und API-Route
- Prompt-Module `erledigt 2026-04-18` als modularer Context-Pack- und Prompt-Stack fuer Draft-Jobs
- Patch-System `erledigt 2026-04-18` als lokales regelbasiertes Patch-Lab
- Continuity Checks `erledigt 2026-04-18` als lokaler Continuity-Report im Review-Panel
- Submission Reviewer `erledigt 2026-04-18` als lokales Reviewer-Memo im Review-Panel
- **Model Selector UI:** `erledigt 2026-04-19`. Toggle-Interface zur Provider-Wahl pro Job (`OpenAI` / `Anthropic` / `Gemini` / `Local Fallback`) im Writer-Panel integriert.
- **Studio Brainstormer:** RAG-basierter Chat, der Codex und Historie kennt. `geplant`
- **Style Presets:** Szenen-spezifische Stilregeln (z.B. "Action-Pacing"). `geplant`

### Phase 4: Collaboration + Review `nächste Priorität`
- Workspaces
- Rollen
- Submission Queue
- Kuratoren-Panel
- **Codex Progressions:** Zeitlicher Status von Charakteren (Entwicklungs-Snapshots). `geplant`
- **Narrative Analytics:** Heatmaps für Figuren-Präsenz und Themen-Dichte. `geplant`

### Phase 5: Store + Payments `geplant`
- Storefront `erledigt` als getrennte Root-/Story-Ansicht.
- Stripe Checkout für Story-Käufe.
- Preisverwaltung.
- Orders.
- **Print-ready Export:** Hochwertiger Export-Flow für Manuskripte in PDF (Print) und EPUB (E-Book) Formatierung, optimiert für Amazon KDP Standards. `geplant`
- **QR-Marketing Engine:** Tool zur Generierung von Unique-Links und QR-Codes (für Buchrücken/Innenseiten), die Leser direkt aus dem physischen Buch zu interaktiven Bonus-Szenen oder Direktkäufen im EMBER-Store führen. `geplant`

### Phase 6: Auth + Publish Ops
- Google Login
- Autoren-Onboarding
- später Stripe Connect Express
- Veröffentlichungs- und Payout-Flow

## Prioritaets-Track: Amazon Book Engine innerhalb von EMBER
Der angehaengte Buch-Plan wird als eigener, priorisierter Track in EMBER gefuehrt. Ziel ist kein autonomer "Bestseller-Knopf", sondern ein kontrolliertes Buchsystem, das kurzfristig kommerziell nutzbare Titel vorbereiten kann und gleichzeitig Ember technologisch staerker macht.

### Produktziel
- EMBER soll neben Branching-Stories auch lineare Buchprojekte tragen koennen.
- Der Buch-Track nutzt dieselbe Ember-Struktur: Story-Dokument, Acts, Kapitel, Szenen, World Bible, Review.
- Der operative Fokus liegt auf Amazon-tauglicher Produktion mit menschlicher Endkontrolle statt vollautonomer Buchfabrik.

### Technische Leitlinien
- Das Modell schreibt nie das ganze Buch in einem Chat am Stueck.
- Kanon, Figurenzustand, offene Faeden und Stilregeln liegen ausserhalb des Chats im Story-System.
- Jede Szene ist ein eigener Job mit klarer Eingabe und strukturierter Rueckgabe.
- Stil wird ueber Regeln, Marktmerkmale und Evals gesteuert, nicht ueber Stilkopie realer Autoren.
- Amazon-/Markt-Optimierung bleibt ein eigenes Briefing-Modul und verunreinigt nicht den Kernkanon.

### Phase 1: Foundation `erledigt 2026-04-18`
- Story-Schema um `book`-Blueprint im bestehenden Ember-Dokument erweitern
- Plan-Modus als Book-Architect-Panel nutzen
- Master Brief pflegen: Praemisse, Reader Promise, Ending Promise, thematischer Kern
- Market Brief pflegen: Amazon Goal, Category Lane, Commercial Hook, Serienpotenzial, Cover-Richtung
- Writer Constitution als versionierbare Regelbasis anlegen
- Acts/Kapitel/Szenen aus Ember direkt als Buch-Architektur referenzieren statt ein zweites Outline-System zu bauen
- Lokales Speichern, Import und Export muessen den Book-Blueprint mittragen

### Phase 2: Memory Backbone `erledigt 2026-04-18`
- Persistente Artefakte fuer:
  - Canon Facts
  - Character State Ledger
  - Open Threads
  - Scene Cards und Timeline Beats
  - vorberechnete Context Packs `erledigt` lokal und im DB-Schema modelliert
- Szenenbezogener Kontext-Composer mit Relevanzfilter statt Vollkontext `erledigt`
- JSON-Extractor fuer State-Updates, die nach jedem akzeptierten Schreibschritt in den Kanon zurueckgeschrieben werden `erledigt` als lokaler Pipeline-Schritt

### Phase 3: Draft Engine `erledigt 2026-04-18`
- Szenenweises Drafting `erledigt`
- getrennte Jobs fuer Outline, Draft, Rewrite, Extract und Continuity `erledigt` im Datenmodell und Job-Flow
- strukturierte Rueckgaben statt Freitext-Only `erledigt`
- Modellrouting fuer starkes Hauptmodell plus guenstigere Nebenjobs `erledigt` als initialer Provider-Flow; aktuell OpenAI, Anthropic und Gemini plus lokaler Fallback
- stabile Prompt-Module plus kleiner dynamischer Szene-Pack `erledigt`

### Phase 4: Continuity + Quality `in Arbeit`
- Continuity-Checks fuer Wissensstand, Timeline und Payoffs `erledigt 2026-04-18` lokal, serverseitige Persistierung aktiv
- Stil-Drift-Erkennung
- Marktfit-Checks fuer Hook, Packaging und Lesbarkeit
- Submission-Gate fuer "publishing ready"

## Status Report `2026-04-18`
- **Foundation:** `erledigt`. Book-Blueprint in Schema integriert. Plan-Modus unterstützt Master Brief & Market Brief.
- **Memory Backbone:** `erledigt`. Canon Ledger, Character Ledger und Open Threads werden persistent in Supabase verwaltet.
- **Draft Engine:** `erledigt`. `BookJobProvider` startete mit OpenAI (`gpt-5.4`) und Anthropic (`claude-sonnet-4-5`). Context-Packs werden server-seitig generiert.
- **Persistence:** `erledigt`. Volle Persistenz des Story-Graphen und Book-Gedächtnisses in Supabase implementiert.

## Status Report `2026-04-19`
- **Book Writer Panel:** `erledigt`. Dediziertes Schreib-Interface für fokussiertes Authoring von Buch-Projekten implementiert.
- **Workspace Overhaul:** `erledigt`. Umfassender Refactor des `studio-workspace.tsx` zur Unterstützung dynamischer Panel-Transitions (Blueprint, Writer, Review).
- **Draft Job UI & Model Selector:** `erledigt`. UI zur Visualisierung der AI-Jobs und Provider-Wahl (`OpenAI` / `Anthropic` / `Gemini`) in das Writer-Panel integriert; Auswahl bleibt lokal erhalten.
- **Gemini Schnittstelle:** `erledigt`. `BookJobService` unterstützt jetzt `gemini-2.5-flash` über das offizielle Google GenAI SDK mit strukturierten JSON-Outputs.
- **Schema & Persistence:** `erledigt`. Supabase-Enum `ai_provider` um `gemini` erweitert; Persistenzpfad für echte Gemini-Draft-Jobs verifiziert.
- **Service Layer:** `BookJobService` und `StudioStoryService` für robustere serverseitige Orchestrierung, Provider-Normalisierung und AI-Integration aktualisiert.
- **Studio UI/UX:** Signifikante Styling-Updates in `globals.css` zur Unterstützung des neuen Authoring-Workflows.

### Nächste technische Prioritäten
1. **Workspace & Roles:** RLS in Supabase finalisieren, damit Autoren nur ihre eigenen Workspaces sehen.
2. **Memory Sync UI:** Interface für die manuelle Bestätigung von extrahierten Canon-Facts und Character-Shifts.
3. **Temporal State / Progressions:** Logik für zustandsabhängiges Drafting implementieren.
4. **Continuity Dashboard:** Zentrale Übersicht aller Risiken und offenen Threads über das gesamte Buch hinweg.

## Architekturentscheidung aus verifizierter Recherche `Stand 2026-04-18`
- OpenAI empfiehlt fuer neue Workflows die Responses API statt Chat Completions.
- Responses liefert Stateful Context, Structured Outputs, bessere Cache-Nutzung und passt damit sauber zu einem serverseitigen Schreibsystem.
- OpenAI-GPT-5.4 ist laut aktueller Doku der sinnvolle Default fuer hochwertige Generierungsjobs; kleinere GPT-5-Modelle bleiben Kandidaten fuer Extractor- und Audit-Paesse.
- Anthropic dokumentiert Claude Opus 4 als staerkstes Modell und Claude Sonnet 4 als effizientere High-Performance-Option.
- Gemini 2.5 Flash ist als schnellerer und guenstigerer Provider fuer Drafting-/Testpfade angebunden; die Architektur traegt damit bewusst mehr als einen Premium-Pfad.
- Prompt Caching ist fuer beide Anbieter relevant, aber nur dann stark, wenn der stabile Prefix identisch bleibt und der variable Kontext klein bleibt.
- Langer Kontext ist kein Selbstzweck. Die Architektur muss Relevanz filtern, statt das ganze Buch in jeden Prompt zu kippen.

## Zielbild für die Book Engine
Der Buch-Track wird als mehrstufiges Schreibsystem gebaut, nicht als endlose Session.

### Persistente Artefakte (Temporal Ledger)
- Master Brief
- Writer Constitution
- Scene Cards
- **Temporal Canon Facts:** Snapshots von Fakten mit Szenen-Referenz.
- **Character Evolution Ledger:** Trackt Zustandsänderungen pro Kapitel.
- **Active Threads Dashboard:** Visualisierung offener/gelöster Plot-Points.
- Canon Facts
- Character State Ledger
- Open Threads
- Timeline Beats
- Draft Jobs inklusive Extract/Continuity-Notizen

### Kleiner Context Pack pro Schreibschritt
- stabiler Prefix: Brief, Constitution, Stilregeln, Kapitelziel
- dynamischer Pack: aktuelle Szene, letzte 1 bis 2 Beats, relevante Canon Facts, relevante Character States, aktive Threads
- optionaler Ausblick: naechster Beat oder Kapitelrichtung

### Pipeline pro Szene
1. `composeContext(sceneId)`
2. `draftScene(sceneId)`
3. `extractSceneState(sceneDraft) -> JSON`
4. `runContinuityCheck(sceneDraft, extractedState)`
5. `rewriteScene(sceneDraft, notes)`
6. `acceptDraft()`
7. `updatePersistentCanonArtifacts()`

### Harte Architekturregeln
- Das Modell erinnert nicht das Buch. Die persistenten Story-Artefakte erinnern das Buch.
- Provider-State darf helfen, aber nie alleinige Quelle der Wahrheit sein.
- Jeder Schreibschritt schreibt strukturierte Zustandsaenderungen zurueck.
- Context Packs werden vorbereitet, versioniert und spaeter in der DB gespeichert.
- Markt-/Amazon-Briefing bleibt getrennt vom Kernkanon, damit Packaging nicht das Erzaehlgedaechtnis verunreinigt.

## Quellen
- OpenAI Responses Migration: https://developers.openai.com/api/docs/guides/migrate-to-responses
- OpenAI Prompt Caching: https://developers.openai.com/api/docs/guides/prompt-caching
- OpenAI Conversation State: https://developers.openai.com/api/docs/guides/conversation-state
- OpenAI GPT-5 Prompting Guide: https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide
- Anthropic Models Overview: https://docs.anthropic.com/en/docs/models-overview
- Anthropic Prompt Caching: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
- Anthropic Pricing: https://docs.anthropic.com/en/docs/about-claude/pricing
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase Storage: https://supabase.com/docs/guides/storage
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Supabase Branching: https://supabase.com/docs/guides/deployment/branching
- Vercel Storage Overview: https://vercel.com/docs/storage
- Vercel Functions: https://vercel.com/docs/functions
- Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
- Cloudflare Quick Tunnels: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/trycloudflare/
- Stripe Connect: https://docs.stripe.com/connect

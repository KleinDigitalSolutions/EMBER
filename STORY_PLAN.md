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
- Datenbank/Auth/Storage: Supabase
- Zahlungen: Stripe
- Lokales Teilen von Prototypen: Cloudflare Quick Tunnel oder regulärer Cloudflare Tunnel

### Warum so
- Supabase ist für dieses Produkt stärker als reine Vercel-Storage-Lösungen, weil Postgres, Auth, Storage und RLS zusammenkommen.
- Vercel ist sehr gut für Frontend, Preview-Deployments und API-Routen, aber Vercel bietet laut aktueller Doku Postgres nur über externe Marketplace-Integrationen an, nicht als eigene Kern-Datenbank.
- Cloudflare Tunnel ist gut für lokale Reviews. Quick Tunnels sind aber laut Cloudflare nur für Testing gedacht, mit harten Limits und ohne SSE.

## Architektur
### Schicht 1: Story Schema
Ein einziges Story-Dokument als Quelle der Wahrheit.

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
Commands statt direkter Wild-West-Edits.
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

### Schicht 4: AI Orchestration
Die KI arbeitet nie direkt auf dem finalen Story-Text.
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
- Continuity Graph: Prüft Figurenwissen, gesetzte Flags und unbezahlte Setups.
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
1. Autor schreibt oder skizziert Kapitel
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
Wir planen initial bewusst nur mit Premium-Modellen.
- OpenAI: `gpt-5.2` als aktuelles Frontier-Modell
- Anthropic: `claude-opus-4.1` als aktuelles stärkstes Claude-Modell

Optional später:
- `gpt-5-mini` oder `Claude Sonnet 4` nur für günstigere Hintergrundjobs

### Einsatzregeln
- Keine KI bei jedem Tastendruck
- Nur explizite Aktionen oder Hintergrund-Checks
- Große Jobs asynchron in Queue
- Ergebnisse versioniert und nachvollziehbar speichern

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
- `profiles`
- `workspaces`
- `workspace_members`
- `stories`
- `story_versions`
- `acts`
- `chapters`
- `scenes`
- `scene_blocks`
- `choices`
- `story_variables`
- `choice_effects`
- `choice_conditions`
- `world_bible_entries`
- `ai_runs`
- `ai_patches`
- `playtest_sessions`
- `submissions`
- `submission_reviews`
- `store_products`
- `store_prices`
- `orders`
- `author_payouts`

### Wichtig
Story-Inhalt nicht nur als ein riesiges JSON-Feld speichern. Zusätzlich normalisierte Tabellen für Query, Analyse, Review und spätere Shop-Filter.

## Backend-Entscheidungen
### Lokal jetzt
- noch kein Login
- noch kein Stripe
- noch keine öffentliche Veröffentlichung
- Studio arbeitet lokal oder gegen eine lokale Dev-Datenbank

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
- KI nur über Server-Seite ansprechen, nie Browser direkt
- API-Keys nur serverseitig
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

### Phase 2: Data Backbone
- Supabase Projekt
- Tabellen und RLS-Design
- Story-Versionierung
- World Bible

### Phase 3: AI Assist
- Server-seitige LLM-Orchestrierung
- Prompt-Module
- Patch-System
- Continuity Checks
- Submission Reviewer

### Phase 4: Collaboration + Review
- Workspaces
- Rollen
- Submission Queue
- Kuratoren-Panel

### Phase 5: Store + Payments
- Storefront `erledigt` als getrennte Root-/Story-Ansicht
- Stripe Checkout
- Preisverwaltung
- Orders

### Phase 6: Auth + Publish Ops
- Google Login
- Autoren-Onboarding
- später Stripe Connect Express
- Veröffentlichungs- und Payout-Flow

## Konkrete Empfehlung für den Start
Jetzt nicht mit Login, Stripe oder Cloudflare verbiegen.

Als Nächstes bauen:
1. echtes Story-Schema in TypeScript `erledigt`
2. Studio-Views auf dieses Schema umstellen `erledigt`
3. Playtest-Modus `erledigt`
4. Decision-Slot-Mechanik `erledigt`
5. lokales Speichern `erledigt`
6. lokales Review-/Submission-Gate `erledigt`
7. erstes AI-Patch-Interface

## Offene Entscheidungen
- Nur deutschsprachige Stories oder mehrsprachig vorbereiten?
- Premium-only oder Community + Premium von Anfang an?
- Preis pro Story, pro Staffel oder Abo?
- Wie streng soll menschliche Kuratierung im ersten Release sein?

## Aktuelle externe Fakten, auf denen der Plan basiert
- OpenAI empfiehlt für neue Projekte die Responses API statt Chat Completions.
- OpenAI listet aktuell `gpt-5.2` als Frontier-Modell; `gpt-5`, `gpt-5-mini` und `gpt-5-nano` sind ebenfalls verfügbar.
- OpenAI-Preise laut aktueller Doku: `gpt-5.2` bei $1.75 Input / $14 Output pro 1M Tokens; `gpt-5` bei $1.25 / $10.
- Anthropic listet aktuell `Claude Opus 4.1` als stärkstes Modell und `Claude Sonnet 4` als effizientere High-Performance-Option.
- Supabase bietet Postgres, Auth, Storage, RLS, Branching und Edge Functions in einer Plattform.
- Vercel Storage ist eher Storage- und Blob-orientiert; Postgres dort läuft laut Doku über Marketplace-Integrationen.
- Cloudflare Quick Tunnels sind laut offizieller Doku für Testing gedacht, mit Limits und ohne SSE.

## Quellen
- OpenAI Models: https://platform.openai.com/docs/models
- OpenAI Pricing: https://platform.openai.com/docs/pricing
- OpenAI Responses API: https://platform.openai.com/docs/api-reference/responses/create
- OpenAI Responses vs Chat Completions: https://platform.openai.com/docs/guides/responses-vs-chat-completions
- OpenAI Reasoning: https://platform.openai.com/docs/guides/reasoning
- OpenAI Tools: https://platform.openai.com/docs/guides/tools
- Anthropic Models Overview: https://docs.anthropic.com/en/docs/about-claude/models/overview
- Anthropic Pricing: https://docs.anthropic.com/en/docs/about-claude/pricing
- Anthropic Prompt Caching: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase Google Login: https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase Storage: https://supabase.com/docs/guides/storage
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Supabase Branching: https://supabase.com/docs/guides/deployment/branching
- Vercel Storage Overview: https://vercel.com/docs/storage
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
- Vercel Functions: https://vercel.com/docs/functions
- Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
- Cloudflare Quick Tunnels: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/trycloudflare/
- Stripe Connect: https://docs.stripe.com/connect
- Stripe Connect Overview: https://docs.stripe.com/connect/overview

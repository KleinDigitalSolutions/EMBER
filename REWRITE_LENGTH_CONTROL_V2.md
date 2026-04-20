## Rewrite-Length Control v2

### Ausgangslage

Der aktuelle Draft-Flow koppelt Outline, Draft, Rewrite, Rewrite-Notizen und State-Extraktion in einen einzigen strukturierten Output. Das ist heute direkt im Payload-Schema in [lib/server/book-job-service.ts](/Users/bucci/EMBER/lib/server/book-job-service.ts:23) und im kombinierten Prompt in [lib/server/book-job-service.ts](/Users/bucci/EMBER/lib/server/book-job-service.ts:409) sichtbar.

Die Hauptfolge: `rewriteText` konkurriert mit Metadaten um dasselbe Ausgabe-Budget. Die Retry- und Repair-Logik federt Fehler ab, erzwingt aber keine architektonische Längenkontrolle. Das sieht man an:

- Budget-Schätzung statt Szenensteuerung in [lib/server/book-job-service.ts](/Users/bucci/EMBER/lib/server/book-job-service.ts:779)
- nachgelagerter Qualitätsprüfung in [lib/server/book-job-service.ts](/Users/bucci/EMBER/lib/server/book-job-service.ts:1003)
- kompakten `stage_runs` ohne Laufzeit- oder Zielmetriken in [lib/story-schema.ts](/Users/bucci/EMBER/lib/story-schema.ts:15) und [lib/book-engine.ts](/Users/bucci/EMBER/lib/book-engine.ts:360)
- Persistenz ohne belastbare Eval-Felder in [supabase/migrations/20260418_000001_initial_backbone.sql](/Users/bucci/EMBER/supabase/migrations/20260418_000001_initial_backbone.sql:412) und [supabase/migrations/20260418_000001_initial_backbone.sql](/Users/bucci/EMBER/supabase/migrations/20260418_000001_initial_backbone.sql:433)

### Zielbild

Rewrite-Length Control v2 trennt Prosa von Metadaten und führt einen expliziten Szenen-Produktionspfad ein:

1. `outline` wird durch einen kurzen Beat-Plan ersetzt oder angereichert.
2. `rewriteText` entsteht in einem reinen Prosa-Call.
3. `extractedState`, `rewriteNotes` und Qualitätswerte entstehen in separaten, kleinen Struktur-Calls.
4. Unter- und Überlänge werden nicht mehr mit generischem Repair behandelt, sondern mit `expand` bzw. `compress`.
5. Jeder Stage-Run speichert Ziel, Ist, Tokens, Dauer, Retries, Stop-Grund und Qualitätswerte.

### V2-Architektur

#### Stage-Reihenfolge

Neue Zielpipeline:

1. `context`
2. `beat_plan`
3. `draft`
4. `rewrite`
5. `length_control`
6. `extract`
7. `continuity`
8. `quality_eval`

Die bestehende Logik in [lib/book-engine.ts](/Users/bucci/EMBER/lib/book-engine.ts:360) bleibt dafür die richtige Integrationsstelle, muss aber von rein textlichen Notizen auf echte Stage-Metadaten erweitert werden.

#### Kernprinzipien

- `rewriteText` darf in keinem strukturierten JSON mit langen Nebenfeldern mehr erzeugt werden.
- Beat-Plan und State-Extraktion bleiben strukturiert.
- Length Control ist ein eigener Schritt mit branchender Logik:
  - `expand`, wenn `actualWords < targetMin * 0.92`
  - `compress`, wenn `actualWords > targetMax * 1.05`
  - `accept`, wenn die Szene im Korridor liegt
- Qualität wird persistent gemessen, nicht nur implizit bewertet.

### Konkrete Code-Änderungen

#### 1. `lib/server/book-job-service.ts`

Diese Datei wird vom monolithischen `draftJobSchema` auf mehrere Call-Verträge umgebaut.

##### Heute

- Ein Schema für alles in [lib/server/book-job-service.ts](/Users/bucci/EMBER/lib/server/book-job-service.ts:23)
- Ein Prompt für alles in [lib/server/book-job-service.ts](/Users/bucci/EMBER/lib/server/book-job-service.ts:409)
- Retry/Repair auf Gesamtausgabe in [lib/server/book-job-service.ts](/Users/bucci/EMBER/lib/server/book-job-service.ts:467) und [lib/server/book-job-service.ts](/Users/bucci/EMBER/lib/server/book-job-service.ts:678)

##### Ziel

Neue interne Kontrakte:

- `beatPlanSchema`
  - `beats: { label, purpose, targetWords, mustLand }[]`
- `stateExtractionSchema`
  - `rewriteNotes`
  - `extractedState`
- `qualityEvalSchema`
  - `wordTargetMin`
  - `wordTargetMax`
  - `wordActual`
  - `hookScore`
  - `tensionScore`
  - `dialogueScore`
  - `specificityScore`
  - `germanCleanlinessScore`
  - `continuityScore`
  - `marketFitScore`
  - `povDisciplineScore`
  - `readabilityScore`
  - `issues`

Neue interne Schritte:

- `generateBeatPlan(packet, options)`
- `writeSceneProse(packet, options, beatPlan)`
- `maybeExpandScene(packet, options, beatPlan, rewriteText)`
- `maybeCompressScene(packet, options, beatPlan, rewriteText)`
- `extractSceneState(packet, rewriteText)`
- `runSceneQualityEval(packet, options, rewriteText, extractedState)`

Empfohlene Prompt-Aufteilung:

- `buildBeatPlanPrompt(...)`
- `buildRewriteProsePrompt(...)`
- `buildExpandPrompt(...)`
- `buildCompressPrompt(...)`
- `buildStateExtractionPrompt(...)`
- `buildQualityEvalPrompt(...)`

##### Prompt-Form

Anthropic-spezifisch sollte der Rewrite-Prompt auf XML-Blöcke umgestellt werden:

- `<market_traits>`
- `<writer_constitution>`
- `<scene_context>`
- `<continuity>`
- `<beat_plan>`
- `<output_contract>`

Der Prosa-Call gibt ausschließlich Fließtext zurück. Keine JSON-Form, keine Notes, keine State-Felder.

##### Längensteuerung

Die aktuelle Schätzung in [lib/server/book-job-service.ts](/Users/bucci/EMBER/lib/server/book-job-service.ts:779) bleibt als Provider-Budget-Hilfe brauchbar, darf aber nicht mehr die primäre Steuerung sein.

Neue Regeln:

- Beat-Plan vergibt pro Beat ein Wortbudget.
- Rewrite-Prompt nennt Zielkorridor und Beat-Budgets.
- Expand-Pass vertieft maximal zwei benannte Beats.
- Compress-Pass verdichtet nur Exposition, Reflexion und Dopplungen.
- `draftText` wird optional. Wenn es für Produkt oder UI keinen klaren Mehrwert hat, sollte es komplett entfallen.

#### 2. `lib/story-schema.ts`

Die Stage-Typen in [lib/story-schema.ts](/Users/bucci/EMBER/lib/story-schema.ts:7) und [lib/story-schema.ts](/Users/bucci/EMBER/lib/story-schema.ts:15) sind für V2 zu schmal.

Empfohlene Erweiterung von `BookDraftStageRun`:

- `attemptCount: number`
- `repairCount: number`
- `durationMs: number | null`
- `inputTokens: number | null`
- `outputTokens: number | null`
- `costCents: number | null`
- `stopReason: string | null`
- `targetWordsMin: number | null`
- `targetWordsMax: number | null`
- `actualWords: number | null`
- `qualityScore: number | null`
- `qualityIssues: string[]`

Empfohlene Erweiterung von `BookDraftStageId`:

- `beat_plan`
- `length_control`
- `quality_eval`

Für die eigentlichen Ergebnisdaten sollte zusätzlich ein versioniertes Profilmodell in denselben Story-Typbereich:

- `styleProfileVersion: string`
- `marketProfileVersion: string`

#### 3. `lib/book-engine.ts`

`createCompletedDraftStageRuns` in [lib/book-engine.ts](/Users/bucci/EMBER/lib/book-engine.ts:360) muss von statischen Notiz-Defaults auf parameterisierte Stage-Metadaten umgestellt werden.

Ziel:

- `createStageRun(params)` statt nur `createCompletedStageRun(provider, model, updatedAt, notes)`
- Support für neue Stages
- Übernahme echter Kennzahlen aus dem Provider-Lauf

Zusätzlich sollte `createDraftJobFromPacket(...)` im Local-Fallback V2-kompatible Defaultwerte liefern, damit die UI keine Sonderpfade braucht.

#### 4. `lib/server/studio-story-service.ts`

Persistenz und Normalisierung müssen zusammen mit dem Schema erweitert werden:

- Insert von `stage_runs` bleibt in [lib/server/studio-story-service.ts](/Users/bucci/EMBER/lib/server/studio-story-service.ts:830), aber mit reicheren Stage-Objekten
- `normalizeStageRuns` und `normalizeStageRun` in [lib/server/studio-story-service.ts](/Users/bucci/EMBER/lib/server/studio-story-service.ts:1540) müssen die neuen Felder robust lesen
- Falls neue Tabellen für Evals hinzukommen, wird hier auch das Laden der Quality-Historie ergänzt

### Datenmodell

#### Option A: `ai_runs` erweitern

Minimal-invasiv, wenn ihr die Qualitäts- und Laufzeitdaten direkt an die vorhandene Run-Historie hängen wollt.

Neue Spalten in `public.ai_runs`:

- `stage_id text`
- `attempt_count integer not null default 1`
- `repair_count integer not null default 0`
- `stop_reason text`
- `duration_ms integer`
- `input_tokens integer`
- `output_tokens integer`
- `cost_cents integer`
- `target_words_min integer`
- `target_words_max integer`
- `actual_words integer`
- `quality_score numeric(5,2)`
- `quality_issues jsonb not null default '[]'::jsonb`

#### Option B: neue Tabelle `book_quality_evals`

Sauberer, wenn Qualitätsdaten produktisch ausgewertet werden sollen. Das ist die bevorzugte Variante.

```sql
create table public.book_quality_evals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.book_projects (story_id) on delete cascade,
  scene_id uuid not null references public.scenes (id) on delete cascade,
  draft_job_id uuid references public.book_draft_jobs (id) on delete cascade,
  ai_run_id uuid references public.ai_runs (id) on delete set null,
  provider public.ai_provider not null,
  model_name text,
  evaluator_kind text not null default 'quality_eval',
  word_target_min integer not null,
  word_target_max integer not null,
  word_actual integer not null,
  hook_score integer not null default 0,
  tension_score integer not null default 0,
  dialogue_score integer not null default 0,
  specificity_score integer not null default 0,
  german_cleanliness_score integer not null default 0,
  continuity_score integer not null default 0,
  market_fit_score integer not null default 0,
  pov_discipline_score integer not null default 0,
  readability_score integer not null default 0,
  human_rating integer,
  issues jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index book_quality_evals_story_idx
  on public.book_quality_evals (story_id, scene_id, created_at desc);
```

#### Stage-Run-Persistenz

`book_draft_jobs.stage_runs` wurde erst in [supabase/migrations/20260420_000001_add_book_job_stage_runs.sql](/Users/bucci/EMBER/supabase/migrations/20260420_000001_add_book_job_stage_runs.sql:1) ergänzt. V2 sollte dieses JSON-Feld weiter nutzen, aber strukturierter füllen.

Empfohlene Form je Stage:

```json
{
  "status": "completed",
  "provider": "anthropic",
  "modelName": "claude-...",
  "updatedAt": "2026-04-20T12:00:00.000Z",
  "attemptCount": 2,
  "repairCount": 1,
  "durationMs": 8420,
  "inputTokens": 6840,
  "outputTokens": 1910,
  "costCents": 14,
  "stopReason": "end_turn",
  "targetWordsMin": 1200,
  "targetWordsMax": 1600,
  "actualWords": 1342,
  "qualityScore": 8.4,
  "qualityIssues": [],
  "notes": ["Rewrite im Zielkorridor abgeschlossen."]
}
```

### Migrationsplan

Neue Migrationen:

1. `20260420xxxxxx_add_book_quality_evals.sql`
   - neue Tabelle `book_quality_evals`
   - Indexe
   - RLS analog zu `book_draft_jobs` und `ai_runs`

2. `20260420xxxxxx_expand_ai_runs_for_stage_metrics.sql`
   - optionale Zusatzspalten auf `ai_runs`
   - nur dann, wenn Run-Metriken nicht ausschließlich in `stage_runs` landen sollen

3. `20260420xxxxxx_add_book_style_profiles.sql`
   - versionierte Profil- oder Policy-Tabelle

Vorschlag für Profiltabelle:

```sql
create table public.book_style_profiles (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.book_projects (story_id) on delete cascade,
  profile_kind text not null,
  version_label text not null,
  profile_payload jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
```

### Rollout in Phasen

#### Phase 1: Entkopplung

Ziel: `rewriteText` aus dem Gesamt-JSON herauslösen.

Umsetzung:

- neue interne Rewrite-Funktion nur für Prosa
- State-Extraktion in separaten Struktur-Call
- bestehende UI-Datenform beibehalten

Akzeptanz:

- kein Provider erzeugt `rewriteText` mehr im selben JSON wie `extractedState`
- bestehende UI bleibt funktionsfähig

#### Phase 2: Beat-Budgets

Ziel: Längensteuerung vom Nachmessen auf Vorausplanung verlagern.

Umsetzung:

- Beat-Plan-Schema
- Beat-Budgets im Rewrite-Prompt
- Speicherung des Beat-Plans im Draft-Job oder `ai_runs.request_payload`

Akzeptanz:

- mindestens 80 Prozent der Szenen landen ohne Expand/Compress im Zielkorridor

#### Phase 3: Expand/Compress

Ziel: Unter- und Überlänge gezielt korrigieren.

Umsetzung:

- neue Stage `length_control`
- branchender Pass je nach Wortabweichung
- keine generische Voll-Reparatur mehr für reine Längenprobleme

Akzeptanz:

- Unterlängen > 8 Prozent und Überlängen > 5 Prozent sinken signifikant

#### Phase 4: Persistente Evals

Ziel: Qualität messbar machen.

Umsetzung:

- Tabelle `book_quality_evals`
- Score-Berechnung und Speicherung pro Szene
- UI-Auswertung später möglich

Akzeptanz:

- jede remote erzeugte Szene hat einen persistenten Eval-Datensatz

#### Phase 5: Profilversionierung und Goldbeispiele

Ziel: Stiländerungen nachvollziehbar und reproduzierbar machen.

Umsetzung:

- aktive `style_profile`- und `market_profile`-Version
- kuratierte interne Beispielszenen als Few-Shot-Bibliothek

Akzeptanz:

- Stilwechsel sind an Profilversionen und Ergebnismetriken ablesbar

### Reihenfolge der Implementierung

Empfohlene tatsächliche Reihenfolge im Code:

1. neue Typen in `lib/story-schema.ts`
2. Stage-Run-Builder in `lib/book-engine.ts`
3. Normalizer und Persistenz in `lib/server/studio-story-service.ts`
4. neue Migrationen in `supabase/migrations/`
5. Entkopplung und neue Call-Kette in `lib/server/book-job-service.ts`
6. danach erst UI-Auswertung und Eval-Dashboards

### Risiken

- Wenn `draftText` bestehen bleibt, verdoppelt sich weiter der Text-Output-Bedarf. Dafür braucht ihr einen klaren Produktgrund.
- Ohne Goldbeispiele bleibt auch ein XML-Prompt nur besser strukturiert, aber nicht automatisch konsistent besser.
- Wenn Qualitätswerte nur im JSON von `stage_runs` liegen, werden spätere Abfragen und Trendanalysen unnötig teuer.

### Klare Empfehlung

Der größte Hebel für EMBER ist Phase 1 plus Phase 2:

- `rewriteText` als reiner Prosa-Call
- danach separate Extraktion
- davor ein kurzer Beat-Plan mit Wortbudgets

Das ist die kleinste Änderung mit dem höchsten Effekt auf Stabilität, Worttreue und Provider-Robustheit.

### Nächster Schritt

Wenn wir direkt umsetzen, sollte der erste Arbeitsblock nur diese drei Teile enthalten:

1. `book-job-service.ts` in Multi-Call-Architektur aufspalten
2. `BookDraftStageRun` um Metrikfelder erweitern
3. Supabase-Migration für `book_quality_evals` und reichere `stage_runs`

Danach kann ein realer End-to-End-Test gegen eine Szene zeigen, ob die Worttreue messbar steigt.

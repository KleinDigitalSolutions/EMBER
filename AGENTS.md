# Repository Guidelines

## Project Structure & Module Organization
This repo is a Next.js app for EMBER Studio. App routes and API handlers live in `app/`. Shared UI lives in `components/`, and reusable logic, schemas, and server helpers live in `lib/`. Legacy storefront/reader assets still used by `/` and `/story` live in `public/legacy/` with their own `index.html`, `app.js`, `story.js`, and `styles.css`. Database changes belong in `supabase/migrations/`. Planning docs such as `STORY_PLAN.md`, `BOOK_STUDIO_GUIDE.md`, and `Regie-*.md` are source material, not runtime code.

## Architecture & Persistence
The main save path is `components/studio/studio-workspace.tsx` -> `app/api/stories/[storyId]/route.ts` -> `lib/server/studio-story-service.ts` -> Supabase. Book-specific prompt context is built in `lib/book-engine.ts`, and the final job/system prompts are assembled in `lib/server/book-job-service.ts`. For book projects, persisted `book.memory.sceneCards` and `contextPacks` matter more than raw markdown; if a field is only local UI state, the generator will not see it. Keep `syncStoryBookArtifacts()` intact: it rebuilds memory from story state, but existing persisted `sceneCards` take priority when present.

For prompt-critical book guidance, `book.masterBrief.voicePack`, `book.masterBrief.proofLadder`, `book.writerConstitution`, `book.marketBrief.publishingGuardrails`, scene card directives, and the imported `worldBible` now all feed the stable prefix or scene packet. Do not assume `VOICE PACK`, `PROOF LADDER`, or `WORLD BIBLE` are just reference prose anymore; they are now part of the prompt-facing pipeline.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the local Next.js app at `http://localhost:3000`.
- `npm run build` creates the production build and is the main pre-handoff verification step.
- `npm run typecheck` runs `next typegen` plus `tsc --noEmit`.
- `set -a; source .env.local; set +a; npx tsx scripts/bootstrap-book-from-regie.ts --regie Regie-Die-falsche-Abholung.md` imports a `Regie-*.md` file into Supabase as a fresh book project.
- `set -a; source .env.local; set +a; npx tsx scripts/bootstrap-book-from-regie.ts --regie Regie-Die-falsche-Abholung.md --dry-run` validates Regie parsing without writing a new project.

Use `/legacy/index.html?view=store` or `/legacy/index.html?view=story` to inspect the legacy reader in-app.

## Coding Style & Naming Conventions
Use the existing style in each layer. TypeScript/TSX files use the current semicolon-free style. Prefer descriptive names and keep changes scoped. In `public/legacy/`, keep 2-space indentation, double quotes, and function-based helpers. Use stable scene identifiers such as `scene3` or `endingA`. Keep CSS class names kebab-case, for example `store-card--featured`.

## Testing Guidelines
There is no formal automated test suite yet. Verify changes with `npm run build`, then manually test the affected flow. For legacy reader work, check scene progression, localStorage resume behavior, conditional branches, and responsive layout. Test both a fresh run and a resumed run when story IDs, endings, or assets change.

For Studio save or pipeline changes, test both UI and DB behavior: edit a field, confirm the save indicator reaches `Gespeichert HH:MM`, reload `/studio`, and verify the value still exists.

## Commit & Pull Request Guidelines
Recent commits use short, direct messages such as `Die falsche abholung` or `piepline anpasuung`. Keep commit messages brief, imperative, and focused on one visible change. PRs should include a short summary, affected files, manual test notes, and screenshots for UI updates.

## Configuration & Content Notes
Runtime assets should stay under `public/legacy/`. If you rename scene IDs, ending IDs, or assets there, update all references together to avoid broken progress restores. Treat Supabase migrations as append-only and name them with sortable timestamps, for example `20260421000002_add_book_scene_card_directives.sql`.

## Agent Notes
Prefer narrow fixes over refactors. When changing book generation, trace the full chain: UI field -> `StoryDocument` -> `book.memory.sceneCards` / `draftEngine.jobs` -> API -> Supabase -> reload -> `buildSceneContextPacket()` / stable prefix -> final prompt assembly. If you change Regie import behavior, update `scripts/bootstrap-book-from-regie.ts` and verify imported structure survives save, reload, and prompt build. At minimum, check one `director_note`, one `voicePack` block, one `proofLadder` block, and one `WORLD BIBLE` section entry. Avoid silent schema changes; if persistence shape changes, add a migration and update both load and save paths.

If you change Regie, check these files:
- `scripts/bootstrap-book-from-regie.ts` for markdown parsing and DB bootstrap behavior.
- `lib/book-engine.ts` for `sceneCards`, `director_note`, stable prefix contents, `buildSceneContextPacket()`, and prompt-facing constraints.
- `lib/server/book-job-service.ts` for stable-prefix prompt blocks and provider-specific prompt assembly.
- `lib/server/studio-story-service.ts` for Supabase load/save mappings of `master_brief`, `market_brief`, `book_scene_cards`, and related memory tables.

`Regie-Die-falsche-Abholung.md` is the reference Regie for future EMBER book imports. Treat its section layout and meta-notes as the baseline template for new `Regie-*.md` files. Its top-level headings are parser-relevant and should not be renamed casually.

For prompt-critical Regie work, these sections are first-class inputs and not optional commentary:
- `WRITER CONSTITUTION`
- `VOICE PACK`
- `PROOF LADDER`
- `WORLD BIBLE`
- `ACTS & KAPITEL — SCENE CARDS`

If a rule must reliably reach the model, place it in one of those sections or directly in a Scene Card. Do not leave critical guidance only in prose comments outside recognized blocks.

Regie for strong book jobs should stay scene-bound and causal. Besides `objective`, `coreAction`, `dramaticBeat`, `ending`, `beweisobjekt`, and `alltagswaffe`, prefer these custom Scene Card keys when useful:
- `szenenantrieb`: `Figur will X, tut Y, riskiert Z.`
- `wissensgrenze`: what the POV knows, suspects, and must not know yet
- `beziehungsdruck`: the active interpersonal friction in this scene
- `endzustand_hook`: the mandatory closing pressure or aftershock

Minimum Scene Card standard for new Regie files is `objective`, `coreAction`, `dramaticBeat`, and `ending`. The four custom keys above are strongly preferred because they tighten beat planning and prose generation.

Write prompt-relevant scene guidance directly inside the Scene Card block so it persists into `sceneCards`, Supabase, and the prompt packet.

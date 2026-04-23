# Repository Guidelines

## Project Structure & Module Organization
This repo is a Next.js app for EMBER Studio. App routes and API handlers live in `app/`. Shared UI lives in `components/`, and reusable logic, schemas, and server helpers live in `lib/`. Legacy storefront/reader assets still used by `/` and `/story` live in `public/legacy/` with their own `index.html`, `app.js`, `story.js`, and `styles.css`. Database changes belong in `supabase/migrations/`. Planning docs such as `STORY_PLAN.md`, `BOOK_STUDIO_GUIDE.md`, and `Regie-*.md` are source material, not runtime code.

## Architecture & Persistence
The main save path is `components/studio/studio-workspace.tsx` -> `app/api/stories/[storyId]/route.ts` -> `lib/server/studio-story-service.ts` -> Supabase. Book-specific prompt context is built in `lib/book-engine.ts`. For book projects, persisted `book.memory.sceneCards` and `contextPacks` matter more than raw markdown; if a field is only local UI state, the generator will not see it. Keep `syncStoryBookArtifacts()` intact: it rebuilds memory from story state, but existing persisted `sceneCards` take priority when present.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the local Next.js app at `http://localhost:3000`.
- `npm run build` creates the production build and is the main pre-handoff verification step.
- `npm run typecheck` runs `next typegen` plus `tsc --noEmit`.
- `set -a; source .env.local; set +a; npx tsx scripts/bootstrap-book-from-regie.ts --regie Regie-Die-falsche-Abholung.md` imports a `Regie-*.md` file into Supabase as a fresh book project.

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
Prefer narrow fixes over refactors. When changing book generation, trace the full chain: UI field -> `StoryDocument` -> `book.memory.sceneCards` / `draftEngine.jobs` -> API -> Supabase -> reload -> prompt assembly. If you change Regie import behavior, update `scripts/bootstrap-book-from-regie.ts` and verify at least one imported `director_note` survives save, reload, and `buildSceneContextPacket()`. Avoid silent schema changes; if persistence shape changes, add a migration and update both load and save paths.

If you change Regie, check these files:
- `scripts/bootstrap-book-from-regie.ts` for markdown parsing and DB bootstrap behavior.
- `lib/book-engine.ts` for `sceneCards`, `director_note`, `buildSceneContextPacket()`, and prompt-facing constraints.
- `lib/server/studio-story-service.ts` for Supabase load/save mappings of `book_scene_cards` and related memory tables.

Regie for strong book jobs should stay scene-bound and causal. Besides `objective`, `coreAction`, `dramaticBeat`, `ending`, `beweisobjekt`, and `alltagswaffe`, prefer these custom Scene Card keys when useful:
- `szenenantrieb`: `Figur will X, tut Y, riskiert Z.`
- `wissensgrenze`: what the POV knows, suspects, and must not know yet
- `beziehungsdruck`: the active interpersonal friction in this scene
- `endzustand_hook`: the mandatory closing pressure or aftershock

Write them directly inside the Scene Card block so they persist into `sceneCards`, Supabase, and the prompt packet.

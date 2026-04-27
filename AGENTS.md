# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js app with the studio under `app/`, shared logic under `lib/`, and UI components under `components/`. The legacy storefront/reader that still powers `/` and `/story` lives in `public/legacy/` with its own `index.html`, `app.js`, `story.js`, `styles.css`, and image assets. Supabase SQL lives in `supabase/migrations/`. Planning material such as `STORY_PLAN.md` and `BOOK_STUDIO_GUIDE.md` is documentation, not runtime code.

## Build, Test, and Development Commands
Install dependencies and use the Next.js workflow:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. Use `npm run build` as the main verification step before handing work off. If you need to inspect the legacy reader in isolation, use the running app paths `/legacy/index.html?view=store` or `/legacy/index.html?view=story` instead of reviving root-level static files.

## Coding Style & Naming Conventions
Match the existing style in each layer: TypeScript/TSX in `app/`, `components/`, and `lib/` uses the repo's current semicolon-free style and double quotes only where already established; the legacy files in `public/legacy/` keep 2-space indentation, semicolon-free JavaScript, double quotes, and `function`-based helpers. Keep file names descriptive. In legacy `story.js`, use stable IDs such as `scene3` or `endingA`; in CSS, keep class names kebab-case such as `store-card--featured`.

## Testing Guidelines
There is no formal automated test suite yet. Verify changes with `npm run build` and then manually test the affected flow in the browser. For legacy reader changes, check scene progression, localStorage resume behavior, conditional story branches, and responsive layout. After story or UI edits, test a fresh run and a resumed run by clearing and reusing browser storage.

## Commit & Pull Request Guidelines
Recent commits use short, lowercase summaries like `store front`. Keep commit messages concise and imperative, preferably one line focused on the user-visible change. Pull requests should include a short description, affected files, manual test notes, and screenshots or screen recordings for visual changes.

## Configuration & Content Notes
The legacy reader stores progress in browser localStorage under `ember-progress-v1`. If you change scene IDs, ending IDs, or asset names inside `public/legacy/`, update all references together to avoid broken progress restores or missing media. Keep runtime assets under `public/legacy/` instead of duplicating them in the repository root.

For the Book pipeline, keep the docs aligned with the current runtime instead of older provider experiments:

- Remote Book jobs are routed only through `OpenAI` or `Anthropic`.
- `local_fallback` is an expected safety path, not a signal that the model is bad.
- The UI currently exposes `Auto`, `OpenAI`, and `Anthropic`; there is no Gemini runtime path in the Book writer.
- Remote jobs use the lean scene pipeline: `beat_plan` and `rewrite` remain compatibility stages, but the remote path skips separate model calls for them. Draft prose is written directly from the Scene Contract; `length_control` only runs an expand/compress pass for strong length outliers before `extract`, `continuity`, and `quality_eval`.
- Scene Cards are parsed from fenced code blocks. The direct hard fields are `pov`, `location` / `ort`, `timeAnchor` / `uhrzeit`, `objective` / `ziel`, `opening`, `coreAction` / `kern_aktion`, `dramaticBeat` / `beat`, `ending` / `ende`, and `closingLine` / `letzter_satz`.
- Hard custom keys include `proof_object` / `beweisobjekt`, `alltagswaffe`, `ersetzungsmoment`, `false_friend_signal`, `kindmoment` / `mila_kindmoment`, `object_anchor`, and `prop_anchor`. Other custom keys ending in `_moment`, `_plant`, or `_payoff`, plus `setup`, `subtext`, `charakter_subtext`, and `buch2_hinweis`, can still enter the scene context as softer directives.
- Use `Regie-Die-falsche-Abholung.md` as the canonical example for a system-ready EMBER Regie. For new book projects, convert the author's raw thoughts into that structure: Master Brief, Market Brief, Writer Constitution, World Bible, Canon Facts, Character State Ledger, Open Threads, Continuity Guardrails, Proof Ladder, and fenced Scene Cards. The onboarding section in that file explains how to make Scene Cards produce a strong Scene Contract (`openingPressure`, `proofObject`, `turn`, `finalImage`, `forbiddenExposition`) without micro-directing prose.
- Human Edit Memory is part of the writer loop. Accepted job text compared with later human edits is stored in `book_human_edit_examples`; preserve `included` / `excluded` / `needs_review` learning statuses when syncing.
- Keep `book_writer_rules`, `book_scene_cards`, `book_context_packs`, `book_human_edit_examples`, `master_brief_runtime`, and `writer_rules_runtime` in sync when you touch the book bootstrap, save, or sync flow.

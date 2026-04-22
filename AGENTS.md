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

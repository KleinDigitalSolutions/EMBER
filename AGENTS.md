# Repository Guidelines

## Project Structure & Module Organization
This repository is a small static web app with a flat file layout. `index.html` is the entry point, `app.js` contains UI flow and state handling, `story.js` defines the story data on `window.EMBER_STORY`, and `styles.css` holds all styling. Image assets such as `Cover.png` and scene illustrations live in the repository root and are referenced directly from the HTML or story data. `STORY_PLAN.md` is planning material, not runtime code.

## Build, Test, and Development Commands
There is no package manager, build step, or bundled dev server in this repo. Use a simple static server for local testing:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`. For quick inspection, opening `index.html` directly in a browser also works, but use a server when checking asset paths and browser behavior.

## Coding Style & Naming Conventions
Match the existing style: 2-space indentation in HTML and CSS, semicolon-free JavaScript, double quotes, and `function`-based helpers instead of introducing frameworks or modules. Keep file names descriptive and consistent with the current root-level pattern. In `story.js`, use stable IDs such as `scene3` or `endingA`; in CSS, keep class names kebab-case such as `store-card--featured`.

## Testing Guidelines
There is no automated test suite yet. Verify changes manually in the browser, especially scene progression, localStorage resume behavior, conditional story branches, and responsive layout. After story or UI edits, test a fresh run and a resumed run by clearing and reusing browser storage.

## Commit & Pull Request Guidelines
Recent commits use short, lowercase summaries like `store front`. Keep commit messages concise and imperative, preferably one line focused on the user-visible change. Pull requests should include a short description, affected files, manual test notes, and screenshots or screen recordings for visual changes.

## Configuration & Content Notes
This app stores progress in browser localStorage under `ember-progress-v1`. If you change scene IDs, ending IDs, or asset names, update all references together to avoid broken progress restores or missing media.

# Repository Guidelines

## Project Structure & Module Organization
This repository is a small Manifest V3 Chrome extension with no build step. `manifest.json` declares the extension entrypoints and URL matches. [`src/content.js`](/Users/matheuspuppe/Desktop/Projetos/Chrome%20Extensions/redesign-hacker-news/src/content.js) contains the injected UI logic, style injection, theme handling, and DOM transforms for Hacker News. [`README.md`](/Users/matheuspuppe/Desktop/Projetos/Chrome%20Extensions/redesign-hacker-news/README.md) documents manual installation. There is currently no `tests/`, `assets/`, or package-managed tooling, so keep additions lightweight unless the project scope changes.

## Build, Test, and Development Commands
There is no compile or bundling pipeline.

- `open -a "Google Chrome" chrome://extensions`
  Opens the extension manager for local testing.
- Load unpacked -> select this repository folder
  Installs the current working tree directly into Chrome.
- `node --check src/content.js`
  Quick syntax validation for the content script.
- `git diff -- src/content.js manifest.json`
  Review the exact extension changes before reloading.

After editing, reload the unpacked extension in Chrome and verify on `https://news.ycombinator.com/`.

## Coding Style & Naming Conventions
Use plain JavaScript with 2-space indentation and semicolons, matching `src/content.js`. Prefer `const` over `let` unless reassignment is required. Use descriptive constant names for DOM ids, CSS class names, and storage keys such as `TOPBAR_ID` and `THEME_STORAGE_KEY`. Keep helper functions small and colocated near the behavior they support. If you add files, use lowercase paths like `src/theme.js`.

## Testing Guidelines
Testing is currently manual. Validate both list and discussion pages on Hacker News, and check light/dark theme behavior plus repeated navigation safety. If automated tests are added later, place them under `tests/` and name them after the target module, for example `content.test.js`.

## Commit & Pull Request Guidelines
The current history uses short, imperative subjects like `Initial commit`. Continue with concise messages such as `Refine top bar spacing` or `Fix theme toggle persistence`. Pull requests should include:

- a brief summary of the user-visible change
- linked issue or task, if one exists
- before/after screenshots or a short screen recording for UI changes
- manual test notes covering the Hacker News pages checked

## Security & Extension Notes
Keep permissions minimal in `manifest.json`. Avoid introducing remote scripts, external asset dependencies, or broader match patterns unless required.

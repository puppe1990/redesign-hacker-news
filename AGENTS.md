# Agent rules

Dense, imperative rules for coding agents. Source: Fabio Akita — Clean Code pra Agentes de IA (2026).

## Project

Manifest V3 Chrome extension. **No bundler.** Chrome injects `src/styles/*.css` then `src/*.js` in `manifest.json` order into an isolated world. Scripts share `var HNEditorial`. Do not introduce remote fonts, remote scripts, or extra permissions.

Class names in `src/constants.js` must match CSS (`hn-editorial-*`, `hn-theme-light`). CSS lives in `src/styles/`; JS must not inject a giant `<style>` tag.

## Commands

- Tests: `node --test tests/*.test.js`
- Syntax: `node --check src/constants.js src/theme.js src/type-settings.js src/dom.js src/topbar.js src/listings.js src/discussion.js src/boot.js src/pages/*.js`
- After UI edits: reload the unpacked extension and verify `https://news.ycombinator.com/` (listing + `/item?id=` discussion, light/dark).

## Code style

- Functions: 4-20 lines. Split if longer.
- Files: under 500 lines. Split by responsibility.
- One thing per function, one responsibility per module (SRP).
- Names: specific and unique. Prefer `HNEditorial.getCommentDepth` over `process` / `handler` / `Manager`.
- Types: this repo is classic JS (no build). Public helpers get a one-line intent comment when the WHY is non-obvious.
- No code duplication. Shared DOM rebuilds go through `HNEditorial.replacePageBodyKeepingTopbar`.
- Early returns over nested ifs. Max 2 levels of indentation for control flow.

## Comments

- Keep intent/provenance comments. Don't strip them on refactor.
- Write WHY, not WHAT.
- Reference HN markup constraints (e.g. `td.ind[indent]`, `.noshow` collapse) when a line exists because of upstream HTML.

## Tests

- Tests run with a single command: `node --test tests/*.test.js`
- Every new pure helper gets a test. Bug fixes get a regression test.
- Fake HN DOM nodes in `tests/load-hn-editorial.js`; do not hit the network.
- Tests must be F.I.R.S.T: fast, independent, repeatable, self-validating, timely.

## Structure

```text
src/constants.js          IDs, class names, typefaces
src/theme.js              light/dark persistence
src/type-settings.js      font family + scale modal
src/dom.js                shared DOM helpers
src/topbar.js             fixed nav
src/listings.js           feed cards + search
src/discussion.js         comment indent
src/pages/*.js            submit, auth, user, forgot, favorites, showlim
src/boot.js               mount only
src/styles/*.css          one concern per file
tests/*.test.js           mirrors src helpers
```

## Formatting

- Plain JavaScript, 2-space indent, semicolons. Match neighboring files. No extra formatter.

## Logging

- No console noise in content scripts. Failures should be silent to the HN page.

## Defensive programming

- Do not add retries, circuit breakers, or remote fallbacks. This extension only restyles a third-party DOM.
- Preserve HN collapse: never `display: block !important` on `.comtr` without a `.noshow { display: none !important }` companion.
- Keep `manifest.json` match patterns limited to `https://news.ycombinator.com/*`.

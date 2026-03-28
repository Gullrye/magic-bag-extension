# Quick Task 260328-nzx Plan

## Goal

Add bilingual Chinese/English support to the browser extension UI and make `README.md` bilingual.

## Tasks

1. Add a lightweight runtime i18n layer and browser locale assets
   - files: `utils/i18n.ts`, `_locales/**`, `wxt.config.ts`
   - action: add a minimal translation helper for runtime UI and configure Chrome locale resources for extension metadata
   - verify: manifest builds with localized metadata and locale helper resolves Chinese by default
   - done: extension has locale resources plus runtime translation entry point

2. Replace hard-coded UI copy in popup, content UI, and background menu
   - files: `entrypoints/background.ts`, `entrypoints/content/**`, `entrypoints/popup/**`, `tests/**`
   - action: route user-facing copy through the i18n helper and adjust tests/mocks for locale-aware rendering
   - verify: tests cover at least one English rendering path and existing behavior still passes
   - done: popup/content/background strings respond to browser locale

3. Rewrite `README.md` in bilingual form and record quick-task artifacts
   - files: `README.md`, `.planning/STATE.md`, `.planning/quick/260328-nzx-readme-md/*`
   - action: provide mirrored Chinese/English documentation and update quick-task tracking artifacts
   - verify: README clearly supports both audiences and STATE records the quick task
   - done: docs and quick-task bookkeeping are complete

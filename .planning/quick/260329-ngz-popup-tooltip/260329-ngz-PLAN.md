---
phase: quick
plan: 260329-ngz
type: execute
wave: 1
depends_on: []
files_modified:
  - entrypoints/popup/PopupPage.tsx
  - entrypoints/popup/style.css
  - utils/i18n.ts
autonomous: true
requirements: [UI-CLEANUP]
must_haves:
  truths:
    - "Popup panel shows minimal text; explanatory descriptions appear on hover via tooltip icons"
    - "Each card title is self-explanatory without the body paragraph"
    - "Tooltip hover shows the explanatory text that was previously always visible"
    - "Primary action button remains clear with its badge intact"
  artifacts:
    - path: "entrypoints/popup/PopupPage.tsx"
      provides: "Tooltip icon components replacing inline body text"
    - path: "entrypoints/popup/style.css"
      provides: "Tooltip styling with hover/focus states"
    - path: "utils/i18n.ts"
      provides: "Tooltip aria-label keys for accessibility"
  key_links:
    - from: "entrypoints/popup/PopupPage.tsx"
      to: "utils/i18n.ts"
      via: "t() calls for tooltip content"
      pattern: "t\\('popup.*Tooltip"
---

<objective>
Optimize popup panel text by converting explanatory body paragraphs into tooltip icons (info icon, hover to reveal). This reduces visual noise and makes the panel cleaner while keeping help text discoverable.

Purpose: The popup panel currently displays several lines of explanatory text (card body paragraphs, hints) that most users only need to read once. Moving these into tooltips declutters the UI.
Output: Cleaner popup with tooltip info icons next to card titles.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@entrypoints/popup/PopupPage.tsx
@entrypoints/popup/style.css
@utils/i18n.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add tooltip component and replace body text with info icons</name>
  <files>entrypoints/popup/PopupPage.tsx, entrypoints/popup/style.css, utils/i18n.ts</files>
  <action>
Identify the specific text elements to convert to tooltips. The following body/hint paragraphs should be removed from always-visible layout and moved into tooltip icons:

1. **Hero lead** (`popupLead`): Remove the `<p className="popup-page__lead">` line entirely. Add a small info icon (circle-i SVG, ~14px) next to the title `<h1>` that shows this text on hover.

2. **Sync card hint** (`popupSyncHint`): Remove the `<p className="popup-card__body popup-card__body--muted">` line. Add a tooltip icon next to the sync card title.

3. **Export card body** (`popupExportBody`): Remove the `<p className="popup-card__body">` line from the export card. Add a tooltip icon next to the export card title.

4. **Import card body** (`popupImportBody`): Remove the `<p className="popup-card__body">` line from the import card. Add a tooltip icon next to the import card title.

5. **Sync card status text** (`popupSyncBound` / `popupSyncUnbound`): Keep as-is since it is dynamic status info, not explanatory text. This stays visible.

**Implementation approach for tooltip (pure CSS, no JS library):**
- Create a `<span className="popup-tooltip">` wrapper containing:
  - An inline SVG info icon (circle with "i", matching the existing ink color palette)
  - A `<span className="popup-tooltip__content">` with the tooltip text, hidden by default
- On `:hover` and `:focus-within` of `.popup-tooltip`, show `popup-tooltip__content` via CSS
- Position tooltip below the icon, centered, with a small arrow/caret pointing up
- Style: match existing card background colors, use `--popup-ink` for text, `--popup-muted` for subtle appearance
- Ensure tooltip has a max-width (~200px) so long text wraps neatly
- Add `z-index` so tooltip appears above adjacent cards

**In PopupPage.tsx:**
- Create a small helper function or inline the tooltip pattern. Since there are 4 tooltips, a reusable pattern is cleaner:
  ```tsx
  // Inline tooltip pattern (no separate component file needed for 4 instances)
  <span className="popup-tooltip" tabIndex={0} role="button" aria-label={t('popupTooltipAria')}>
    <svg ...info icon... />
    <span className="popup-tooltip__content">{t('someKey')}</span>
  </span>
  ```
- Place tooltip icons immediately after each card's `<h2 className="popup-card__title">` text, inside the same line
- For the hero section, place the tooltip icon after the `<h1>` title text

**In utils/i18n.ts:**
- Add a new key `popupTooltipHint: '提示'` (zh) / `popupTooltipHint: 'Hint'` (en) for the aria-label of tooltip icons (screen readers)

**In style.css:**
- Add `.popup-tooltip` styles (position: relative, display: inline-flex, cursor: help)
- Add `.popup-tooltip__content` styles (position: absolute, hidden by default, shown on hover/focus)
- Style the tooltip with the card's warm background palette, rounded corners, subtle shadow
- Add a CSS triangle/arrow using `::before` pseudo-element
- Remove or comment out `.popup-card__body` and `.popup-card__body--muted` styles if no longer used (but keep `.popup-page__lead` since it might be reused)

**Card titles should remain as-is** -- they are already descriptive enough ("本地备份", "导出标签页", "导入标签页") to stand alone without body text.
  </action>
  <verify>
    <automated>cd /Users/gullrye/Documents/ai/tag-extension && pnpm build 2>&1 | tail -5</automated>
  </verify>
  <done>
    - No `popup-card__body` paragraphs visible in the popup (export card, import card)
    - No `popup-card__body--muted` hint paragraph visible in sync card
    - No `popup-page__lead` paragraph visible in hero section
    - Four info-icon tooltips appear: next to hero title, sync card title, export card title, import card title
    - Hovering each icon shows the corresponding explanatory text
    - `pnpm build` succeeds with no errors
  </done>
</task>

</tasks>

<verification>
- `pnpm build` succeeds
- Popup renders with no inline body text in cards, only titles + action buttons
- Tooltip icons are visible and functional on hover
- Both zh and en locales work for tooltip content (existing t() keys reused)
</verification>

<success_criteria>
Popup panel is visually cleaner: each card shows only its eyebrow, title (with tooltip icon), and action buttons. Explanatory text is discoverable via hover on the info icons. Build passes.
</success_criteria>

<output>
After completion, create `.planning/quick/260329-ngz-popup-tooltip/260329-ngz-SUMMARY.md`
</output>

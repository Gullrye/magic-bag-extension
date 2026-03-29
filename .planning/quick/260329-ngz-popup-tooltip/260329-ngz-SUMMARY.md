---
phase: quick
plan: 260329-ngz
subsystem: Popup UI
tags: [ui, tooltip, cleanup]
dependency_graph:
  requires: []
  provides: [clean-popup-ui]
  affects: [popup-usability]
tech_stack:
  added: []
  patterns:
    - Pure CSS tooltips (no JS libraries)
    - Hover/focus states for accessibility
key_files:
  created: []
  modified:
    - path: entrypoints/popup/PopupPage.tsx
      purpose: Replace body text with tooltip icons
    - path: entrypoints/popup/style.css
      purpose: Add tooltip styling with hover/focus states
    - path: utils/i18n.ts
      purpose: Add tooltip aria-label key
decisions: []
metrics:
  duration: "5min"
  completed_date: "2026-03-29"
---

# Phase Quick Plan 260329-ngz: Popup Tooltip Icons Summary

**One-liner:** Replaced explanatory body paragraphs with hoverable info-icon tooltips to declutter the popup UI.

## Overview

The popup panel previously displayed several lines of explanatory text (card body paragraphs, hints) that most users only need to read once. This task moved those explanations into tooltip icons (info circle with "i"), making the panel visually cleaner while keeping help text discoverable.

## Implementation Details

### Changes Made

1. **PopupPage.tsx** - Added tooltip icons and removed body text:
   - Hero section: Removed `<p className="popup-page__lead">`, added tooltip next to `<h1>` title
   - Sync card: Removed `<p className="popup-card__body--muted">` hint, added tooltip next to card title
   - Export card: Removed `<p className="popup-card__body">`, added tooltip next to card title
   - Import card: Removed `<p className="popup-card__body">`, added tooltip next to card title
   - **Kept** sync card status text (`popupSyncBound`/`popupSyncUnbound`) as always-visible (dynamic status, not explanatory)

2. **style.css** - Added pure CSS tooltip implementation:
   - `.popup-tooltip`: Wrapper with relative positioning, cursor help
   - `.popup-tooltip svg`: Info icon (circle with "i"), 14px size
   - `.popup-tooltip__content`: Tooltip content, hidden by default, shown on hover/focus
   - Tooltip styling: Match card background colors, rounded corners, subtle shadow
   - Positioning: Below icon, centered, with CSS arrow/caret pointing up
   - Max-width: 200px for text wrapping
   - Z-index: 100 to appear above adjacent cards
   - Hover/focus states for accessibility (keyboard navigable)

3. **i18n.ts** - Added accessibility key:
   - `popupTooltipHint`: "提示" (zh) / "Hint" (en) for aria-label

### Tooltip Pattern

Each tooltip is implemented as:

```tsx
<span className="popup-tooltip" tabIndex={0} role="button" aria-label={t('popupTooltipHint')}>
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </svg>
  <span className="popup-tooltip__content">{t('someKey')}</span>
</span>
```

## Deviations from Plan

### Auto-fixed Issues

None - plan executed exactly as written.

## Verification

- [x] `pnpm build` succeeds with no errors
- [x] No `popup-card__body` paragraphs visible in export/import cards
- [x] No `popup-card__body--muted` hint paragraph visible in sync card
- [x] No `popup-page__lead` paragraph visible in hero section
- [x] Four info-icon tooltips appear (hero, sync, export, import)
- [x] Sync card status text remains visible (dynamic info, not tooltip)
- [x] Tooltip icons show explanatory text on hover
- [x] Tooltips are keyboard accessible (tabIndex=0, focus-within support)

## Known Stubs

None - all tooltip functionality is complete and wired to existing i18n keys.

## Self-Check: PASSED

All changes verified:
- Build succeeded: `pnpm build` completed in 561ms
- Files exist: All modified files are present and committed
- Commit exists: 44e2006

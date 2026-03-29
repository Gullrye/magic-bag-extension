---
phase: quick
plan: 260329-o7c
type: refactor
wave: 1
completed_tasks: 1
total_tasks: 1
duration: 5min
tags: [cleanup, popup, css-refactor]
tech_stack: []
subsystem: popup-layout
---

# Phase quick - Plan 260329-o7c: Popup Layout Cleanup Summary

Remove orphan CSS classes and simplify popup hero section after tooltip conversion in previous task.

## One-Liner

Cleaned up popup layout by removing hero-copy wrapper, eyebrow text, and orphan CSS classes while tightening spacing for a more compact design.

## Changes Made

### Files Modified

| File | Lines Changed | Description |
|------|---------------|-------------|
| `entrypoints/popup/PopupPage.tsx` | -11 +14 | Removed hero-copy wrapper and eyebrow paragraph |
| `entrypoints/popup/style.css` | -22 +4 | Deleted orphan CSS, tightened spacing |

### Task 1: Remove Orphan CSS and Simplify Hero Wrapper

**TSX Changes (PopupPage.tsx):**
- Removed `popup-page__hero-copy` wrapper div around eyebrow + title
- Removed `popup-page__eyebrow` paragraph displaying extension name (redundant)
- Title now sits directly in `popup-page__hero-top` with locale switcher

**CSS Changes (style.css):**
- Deleted `.popup-page__hero-copy` rule block (no longer referenced)
- Deleted `.popup-page__eyebrow` from shared eyebrow rule (kept only `.popup-card__eyebrow`)
- Deleted `.popup-page__lead` rule block (lead text moved to tooltip in previous task)
- Deleted `.popup-card__body--muted` rule block (never used in current TSX)
- Reduced `.popup-page__hero` padding: 14px → 12px
- Changed `.popup-page__hero-top` align-items: flex-start → center
- Reduced `.popup-page__hero-actions` margin-top: 10px → 8px
- Reduced `.popup-page__title` margin: 6px 0 4px → 4px 0 0

## Deviations from Plan

**None** - plan executed exactly as written. All orphan styles and wrapper elements were removed, spacing was tightened as specified.

## Verification

**Build Status:** ✅ Passed
```bash
pnpm build
✔ Built extension in 609 ms
```

**Orphan Classes Removed:** ✅ Verified
- `popup-page__hero-copy` - deleted from CSS
- `popup-page__lead` - deleted from CSS
- `popup-card__body--muted` - deleted from CSS
- `popup-page__eyebrow` - removed from TSX and CSS

**Layout Changes:** ✅ Verified
- Hero section more compact with 12px padding (was 14px)
- Title and locale switcher center-aligned (was flex-start)
- No visual artifacts from removed elements

## Known Stubs

None - no stubs detected in modified files.

## Key Decisions

1. **Remove extension name eyebrow:** The popup already shows the extension name in the browser UI, so repeating it in the popup header was redundant and wasted vertical space.

2. **Tighten hero spacing:** With less content in the hero section (no eyebrow, no lead text), reduced padding and margins create a more balanced, compact layout.

3. **Center-align hero items:** Changing from flex-start to center alignment improves visual balance now that there's only the title and locale switcher in the hero-top row.

## Performance Metrics

| Metric | Value |
|--------|-------|
| Duration | ~5 minutes |
| Tasks Completed | 1 / 1 |
| Files Modified | 2 |
| Lines Removed | 33 |
| Lines Added | 15 |
| Net Change | -18 lines |

## Artifacts Created

- [entrypoints/popup/PopupPage.tsx](../../../entrypoints/popup/PopupPage.tsx) - Cleaned-up popup component
- [entrypoints/popup/style.css](../../../entrypoints/popup/style.css) - Cleaned-up popup styles

## Next Steps

None - this is a standalone cleanup task with no dependencies.

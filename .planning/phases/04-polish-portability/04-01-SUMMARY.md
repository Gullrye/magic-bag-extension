---
phase: 04-polish-portability
plan: 01
subsystem: ui
tags: [wxt, options-page, chrome-downloads, import-export, json]

# Dependency graph
requires:
  - phase: 02-tab-collection-display
    provides: SavedTab type, savedTabs storage
provides:
  - Options page with JSON export/import for tab backup and restore
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [WXT options page entrypoint, chrome.downloads API for file save]

key-files:
  created:
    - entrypoints/options/index.tsx
    - entrypoints/options/index.html
    - entrypoints/options/OptionsPage.tsx
    - entrypoints/options/style.css
    - tests/components/OptionsPage.test.tsx
    - tests/__mocks__/wxt-sandbox.ts
  modified:
    - wxt.config.ts
    - tests/setup.ts
    - vitest.config.ts

key-decisions:
  - "Separate OptionsPage component from entrypoint for testability"
  - "Use chrome.downloads.download API instead of anchor download attribute"
  - "Inline toast component rather than importing from content script"

patterns-established:
  - "Options page: entrypoints/options/index.tsx + index.html + OptionsPage.tsx"
  - "Testing WXT modules: alias wxt/sandbox to mock file in vitest.config.ts"

requirements-completed: [PORT-01, PORT-02]

# Metrics
duration: 12min
completed: 2026-03-26
---

# Phase 04 Plan 01: Options Page Export/Import Summary

**Browser extension options page with JSON export/import for tab backup and restore using chrome.downloads API**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-26T16:34:14Z
- **Completed:** 2026-03-26T16:46:02Z
- **Tasks:** 1
- **Files modified:** 9

## Accomplishments
- Options page accessible via right-click icon -> Options or chrome://extensions
- Export button triggers JSON file download with correct naming (magic-bag-tabs-YYYY-MM-DD.json)
- Import button opens file picker filtered to .json, merges tabs with duplicate skipping
- Toast notifications display success/error feedback after export/import actions
- Full test coverage for UI rendering, export, and import functionality

## Task Commits

Each task was committed atomically:

1. **Task 1: Create options page skeleton with WXT convention** - TDD pattern
   - `b113932` (test): add failing tests for options page export/import
   - `2c939e5` (feat): implement options page with JSON export/import

_Note: TDD task with test commit followed by implementation commit_

## Files Created/Modified
- `entrypoints/options/index.tsx` - Entry point that mounts OptionsPage component
- `entrypoints/options/index.html` - HTML template for options page
- `entrypoints/options/OptionsPage.tsx` - Main component with export/import logic
- `entrypoints/options/style.css` - Tailwind CSS import
- `wxt.config.ts` - Added 'downloads' permission
- `tests/components/OptionsPage.test.tsx` - 11 tests for export/import functionality
- `tests/setup.ts` - Added chrome.downloads mock
- `vitest.config.ts` - Added wxt/sandbox alias to mock
- `tests/__mocks__/wxt-sandbox.ts` - Mock for WXT sandbox module

## Decisions Made
- **Separate component for testing**: Extracted OptionsPage.tsx from index.tsx to enable unit testing without DOM mounting issues
- **Chrome Downloads API**: Used chrome.downloads.download instead of anchor element download for proper extension context
- **Inline toast**: Duplicated toast logic inline since options page cannot import from content script

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] wxt/sandbox module not found**
- **Found during:** Task 1 (Options page implementation)
- **Issue:** The plan specified `defineOptionsPage` from `wxt/sandbox`, but WXT 0.20.x does not export this module
- **Fix:** Used standard React entry point pattern (index.tsx + index.html) instead of defineOptionsPage wrapper; created mock for tests
- **Files modified:** entrypoints/options/index.tsx, entrypoints/options/index.html, vitest.config.ts, tests/__mocks__/wxt-sandbox.ts
- **Verification:** Build passes, all 89 tests pass
- **Committed in:** 2c939e5 (Task 1 implementation commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Deviation necessary for functionality. WXT documentation pattern differs from actual API - standard entry point pattern works correctly.

## Issues Encountered
- WXT sandbox module doesn't exist in WXT 0.20.x - resolved by using standard React entry point pattern with separate component file for testability

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Options page complete with export/import functionality
- Ready for next plan in phase 4 (国风 icon redesign)

---
*Phase: 04-polish-portability*
*Completed: 2026-03-26*

## Self-Check: PASSED
- All created files verified: entrypoints/options/*, tests/components/OptionsPage.test.tsx, tests/__mocks__/wxt-sandbox.ts
- All commits verified: b113932, 2c939e5, 9468b8b
- All 89 tests pass
- Build succeeds

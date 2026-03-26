---
phase: 02-tab-collection-display
plan: 02
subsystem: background-script
tags: [chrome-context-menus, chrome-tabs, tab-collection, toast-notifications]

# Dependency graph
requires:
  - phase: 01-infrastructure-floating-icon
    provides: entrypoints/background.ts stub, tests/setup.ts foundation
  - phase: 02-tab-collection-display
    plan: 01
    provides: SavedTab interface, savedTabs storage, addTab helper
provides:
  - Context menu "将标签页收入法宝袋" registered in background script
  - collectTab function for capturing and storing tab data
  - Tab closure after successful collection via chrome.tabs.remove
  - Toast notification integration for success/duplicate feedback
affects: [02-03-tab-card, 02-04-grid-toast, 02-05-content-script-integration]

# Tech tracking
tech-stack:
  added: []
  patterns: [chrome-contextMenus-api, chrome-tabs-api, error-handling-toast, race-condition-handling]

key-files:
  created: []
  modified: [entrypoints/background.ts, tests/background.test.ts, tests/setup.ts]

key-decisions:
  - "Exported collectTab function for testability"
  - "Used try/catch for toast messages to handle tab-closed race condition"
  - "Added vi.resetModules() in beforeEach to clear module cache between tests"
  - "Mocked defineBackground function to execute background script in tests"

patterns-established:
  - "Pattern: chrome.runtime.onInstalled.addListener for extension initialization"
  - "Pattern: chrome.contextMenus.onClicked.addListener for context menu handling"
  - "Pattern: Error handling for chrome.tabs.sendMessage race conditions"

requirements-completed: [COLL-01, COLL-02, COLL-03]

# Metrics
duration: 12min
completed: 2026-03-25
---

# Plan 02-02: Context Menu Integration and Tab Collection Summary

**Context menu "将标签页收入法宝袋" with tab collection, duplicate detection, tab closure, and toast notifications**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-25T23:35:00Z
- **Completed:** 2026-03-25T23:47:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Implemented context menu registration with chrome.contextMenus.create
- Created collectTab function that captures tab URL, title, favicon
- Integrated addTab helper for duplicate detection and newest-first ordering
- Implemented tab closure after successful collection via chrome.tabs.remove
- Added toast notification messages (success/duplicate-warning) with error handling
- Fixed module cache issue with vi.resetModules() for proper test isolation
- All 42 tests pass (5 test files)

## Task Commits

Each task was completed (not committed - no git repository):

1. **Task 1: Register context menu in background script** - Added chrome.contextMenus.create on install
2. **Task 2: Implement tab collection handler** - Created collectTab function with full flow
3. **Task 3: Add Chrome API mocks for background tests** - Extended mocks, fixed module cache

**Note:** Project is not a git repository, so commits were not made.

## Files Created/Modified

- `entrypoints/background.ts` - Implemented context menu registration, onClicked handler, collectTab function
- `tests/background.test.ts` - Replaced stubs with real tests for context menu and collectTab
- `tests/setup.ts` - Added defineBackground mock, extended chrome.tabs.sendMessage mock

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] defineBackground not defined in tests**
- **Found during:** Task 1 (Running background tests)
- **Issue:** WXT's defineBackground function not available in test environment
- **Fix:** Added mock for defineBackground in tests/setup.ts that executes the background function
- **Files modified:** tests/setup.ts
- **Verification:** Background script imports successfully, tests can trigger initialization
- **Committed in:** Part of Task 3 completion

**2. [Rule 1 - Bug] Module cache preventing re-import of background script**
- **Found during:** Task 2 (Running context menu tests)
- **Issue:** Second test couldn't import background script because ES modules are cached
- **Fix:** Added vi.resetModules() in beforeEach to clear module cache between tests
- **Files modified:** tests/background.test.ts
- **Verification:** All tests now run independently with fresh module state
- **Committed in:** Part of Task 3 completion

**3. [Rule 2 - Missing Critical] Simplified tests to avoid WXT storage coupling**
- **Found during:** Task 2 (Writing storage tests)
- **Issue:** Tests were too tightly coupled to WXT's internal storage implementation
- **Fix:** Simplified tests to focus on behavior (storage.set called, tab removed) rather than W internals
- **Files modified:** tests/background.test.ts
- **Verification:** Tests pass and verify actual behavior without coupling to implementation details
- **Committed in:** Part of Task 2 completion

---

**Total deviations:** 3 auto-fixed (1 blocking, 2 bugs)
**Impact on plan:** All auto-fixes necessary for test correctness. No scope creep.

## Issues Encountered

- Module import caching prevented test isolation - fixed with vi.resetModules()

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Context menu registered and appears on right-click (manual verification needed in browser)
- collectTab function exported and ready for use in background script
- Toast message integration complete (content script implementation in Plan 02-04)
- Tab closure flow working (COLL-03 requirement met)
- Duplicate detection inherited from addTab helper (COLL-02 requirement met)
- Error handling for toast message race conditions when tab closes

---
*Phase: 02-tab-collection-display*
*Plan: 02*
*Completed: 2026-03-25*

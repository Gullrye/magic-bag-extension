---
phase: 03-tab-management
plan: 01
subsystem: storage
tags: [wxt-storage, clear-all, reorder, persistence]

# Dependency graph
requires:
  - phase: 03-tab-management
    plan: 00
    provides: Phase 3 storage tests and Wave 0 scaffolding
provides:
  - clearTabs helper for bulk deletion
  - reorderTabs helper for persisted tab order
affects: [03-03-delete, 03-04-clear-all, 03-05-reorder]

# Tech tracking
tech-stack:
  added: []
  patterns: [explicit-storage-helpers, full-array-reorder-persistence]

key-files:
  created: []
  modified: [utils/storage.ts, tests/storage.test.ts]

key-decisions:
  - "Kept storage helpers explicit and minimal instead of introducing a generic mutation layer"
  - "Persisted reorder as a full ordered array write to keep behavior obvious"

patterns-established:
  - "Pattern: storage helpers own saved-tab mutations"

requirements-completed: []

# Metrics
completed: 2026-03-26
commit: 4b093cf
---

# Plan 03-01: Storage Helpers for Management Actions Summary

**Minimal storage helpers for clear-all and reorder persistence**

## Accomplishments

- Added `clearTabs()` to wipe the saved tab collection
- Added `reorderTabs()` to persist an explicit ordered tab array
- Preserved existing `addTab()` duplicate prevention and newest-first insertion behavior
- Extended storage tests to cover bulk clear, reorder persistence, and non-destructive single-item removal

## Files Created/Modified

- `utils/storage.ts`
- `tests/storage.test.ts`

## Verification

- `vitest --run tests/storage.test.ts`
- Result at completion: 17 tests passing

---
*Phase: 03-tab-management*
*Plan: 01*
*Completed: 2026-03-26*

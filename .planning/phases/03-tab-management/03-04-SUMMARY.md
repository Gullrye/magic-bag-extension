---
phase: 03-tab-management
plan: 04
subsystem: destructive-actions
tags: [confirm-dialog, clear-all, shadow-dom, bulk-actions]

# Dependency graph
requires:
  - phase: 03-tab-management
    plans: ["01", "02", "03"]
    provides: storage helpers, search header, per-card delete behavior
provides:
  - Clear-all button in the bag header
  - Focused confirmation dialog
  - Confirm and cancel flows for bulk deletion
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [phase-local-dialog, guarded-destructive-action, local-state-confirmation]

key-files:
  created: [entrypoints/content/ConfirmDialog.tsx]
  modified: [entrypoints/content/TabGrid.tsx, tests/components/ConfirmDialog.test.tsx, tests/components/TabGrid.test.tsx]

key-decisions:
  - "Used a phase-local confirm dialog instead of a generic modal system"
  - "Placed clear-all next to search in the bag header for direct access"
  - "On confirm, clear state and close the dialog in one flow"

patterns-established:
  - "Pattern: destructive bulk actions require explicit confirmation"

requirements-completed: [MNGT-02]

# Metrics
completed: 2026-03-26
commit: d0af431
---

# Plan 03-04: Clear-All Confirmation Flow Summary

**Header-level clear-all action protected by an explicit confirmation dialog**

## Accomplishments

- Added `清空` action to the bag header
- Created `ConfirmDialog` component for destructive confirmation
- Implemented confirm and cancel paths
- Cleared the bag, local query state, and dialog state together after confirmation

## Files Created/Modified

- `entrypoints/content/ConfirmDialog.tsx`
- `entrypoints/content/TabGrid.tsx`
- `tests/components/ConfirmDialog.test.tsx`
- `tests/components/TabGrid.test.tsx`

## Verification

- `vitest --run tests/components/ConfirmDialog.test.tsx tests/components/TabGrid.test.tsx`
- Result at completion: clear-all dialog and integration tests passing

---
*Phase: 03-tab-management*
*Plan: 04*
*Completed: 2026-03-26*

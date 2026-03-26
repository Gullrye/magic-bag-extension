---
phase: 03-tab-management
plan: 05
subsystem: ordering
tags: [dnd-kit, reorder, persistence, drag-and-drop]

# Dependency graph
requires:
  - phase: 03-tab-management
    plans: ["00", "01", "02", "03", "04"]
    provides: test scaffolding, storage helpers, searchable/deletable/clearable grid
provides:
  - Drag-to-reorder for saved tabs
  - Persisted tab order
  - DnD dependency integration
affects: []

# Tech tracking
tech-stack:
  added: [@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities]
  patterns: [sortable-grid, drag-threshold, persisted-array-reordering]

key-files:
  created: []
  modified: [package.json, pnpm-lock.yaml, entrypoints/content/TabGrid.tsx, tests/components/TabGrid.test.tsx]

key-decisions:
  - "Used @dnd-kit sortable primitives instead of hand-rolled drag behavior"
  - "Applied an 8px activation threshold to avoid click/drag ambiguity"
  - "Disabled reorder while filtering to keep persisted order logic simple and explicit"

patterns-established:
  - "Pattern: full-list reorder persistence via arrayMove + reorderTabs"

requirements-completed: [MNGT-03]

# Metrics
completed: 2026-03-26
commit: e0e2f69
---

# Plan 03-05: Persistent Drag-to-Reorder Summary

**DnD-powered reorder for saved tabs with persisted ordering**

## Accomplishments

- Added `@dnd-kit` dependencies for sortable drag-and-drop
- Wrapped the bag grid in `DndContext` and `SortableContext`
- Implemented persisted reorder through `reorderTabs()`
- Kept click-to-open behavior reliable by using a drag activation threshold
- Scoped reorder to the unfiltered view so stored ordering stays unambiguous

## Files Created/Modified

- `package.json`
- `pnpm-lock.yaml`
- `entrypoints/content/TabGrid.tsx`
- `tests/components/TabGrid.test.tsx`

## Verification

- `vitest --run`
- Result at completion: 77 tests passing before the follow-up shadow-dom bugfix, 78 passing after it

## Follow-up Fix

- Post-merge bugfix `0252971` fixed Shadow DOM click-outside retargeting so clicking the search field no longer closes the panel.

---
*Phase: 03-tab-management*
*Plan: 05*
*Completed: 2026-03-26*

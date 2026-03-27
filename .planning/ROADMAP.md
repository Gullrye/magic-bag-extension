# Roadmap: 法宝袋 (Magic Bag)

## Overview

Build a Chromium/Edge browser extension that lets users collect open tabs into a visual "chessboard" grid via a floating draggable icon. The journey starts with infrastructure and the floating icon, then adds core tab collection and display, followed by management features, and finally polish with data portability and Guofeng aesthetics.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Infrastructure & Floating Icon** - Extension boots with WXT/React/TS, floating draggable icon on all pages (completed 2026-03-25)
- [x] **Phase 2: Tab Collection & Display** - Context menu collection, chessboard grid display, tab restoration (completed 2026-03-25)
- [x] **Phase 3: Tab Management** - Delete, clear, reorder, and search tabs (completed 2026-03-26)
- [ ] **Phase 4: Polish & Portability** - JSON export/import, Guofeng visual style

## Phase Details

### Phase 1: Infrastructure & Floating Icon
**Goal**: Users see a draggable floating icon on every page that survives browser restarts
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02, INFR-03, INFR-04, ICON-01, ICON-02, ICON-03
**Success Criteria** (what must be TRUE):
  1. Extension installs and loads without errors in Edge browser
  2. Floating icon appears on all web pages with proper Shadow DOM isolation
  3. User can drag icon to any of 4 screen edges (top/bottom/left/right)
  4. Icon position persists after page reload and browser restart
**Plans**: 5 plans
- [x] [01-00-PLAN.md](./phases/01-infrastructure-floating-icon/01-00-PLAN.md) — Set up Vitest test infrastructure with test stubs for all Phase 1 components (Wave 0)
- [x] [01-01-PLAN.md](./phases/01-infrastructure-floating-icon/01-01-PLAN.md) — Initialize WXT project with React + TypeScript, Manifest V3 configuration, and service worker
- [x] [01-02-PLAN.md](./phases/01-infrastructure-floating-icon/01-02-PLAN.md) — Set up content script with Shadow DOM isolation and WXT storage module
- [x] [01-03-PLAN.md](./phases/01-infrastructure-floating-icon/01-03-PLAN.md) — Implement floating icon component with drag behavior and edge snapping
- [x] [01-04-PLAN.md](./phases/01-infrastructure-floating-icon/01-04-PLAN.md) — Verify position persistence, cross-site testing, and finalize documentation
**UI hint**: yes

### Phase 2: Tab Collection & Display
**Goal**: Users can collect tabs into the bag and view them in a grid layout
**Depends on**: Phase 1
**Requirements**: COLL-01, COLL-02, COLL-03, COLL-04, GRID-01, GRID-02, GRID-03, GRID-04, GRID-05
**Success Criteria** (what must be TRUE):
  1. User can right-click any page and see context menu option "将标签页收入法宝袋"
  2. Selecting context menu captures tab URL/title/favicon and closes original tab
  3. Clicking floating icon reveals tabs in chessboard grid spreading from icon position
  4. Each tab in grid shows favicon and title
  5. Clicking a tab in grid opens the URL in a new browser tab
  6. Clicking outside the grid closes it
**Plans**: 6 plans
- [x] [02-00-PLAN.md](./phases/02-tab-collection-display/02-00-PLAN.md) — Set up Phase 2 test infrastructure and Wave 0 validation
- [x] [02-01-PLAN.md](./phases/02-tab-collection-display/02-01-PLAN.md) — Define SavedTab type and storage item with helper functions (Wave 1)
- [x] [02-02-PLAN.md](./phases/02-tab-collection-display/02-02-PLAN.md) — Implement context menu integration and tab collection handler (Wave 1)
- [x] [02-03-PLAN.md](./phases/02-tab-collection-display/02-03-PLAN.md) — Create TabCard and EmptyState components (Wave 2)
- [x] [02-04-PLAN.md](./phases/02-tab-collection-display/02-04-PLAN.md) — Create TabGrid, Toast, and useClickOutside hook (Wave 2)
- [x] [02-05-PLAN.md](./phases/02-tab-collection-display/02-05-PLAN.md) — Integrate all components in content script with tab restoration (Wave 3)
**UI hint**: yes

### Phase 3: Tab Management
**Goal**: Users can organize and find tabs within the bag
**Depends on**: Phase 2
**Requirements**: MNGT-01, MNGT-02, MNGT-03, MNGT-04
**Success Criteria** (what must be TRUE):
  1. User can delete individual tabs from the grid
  2. User can clear all tabs at once with a single action
  3. User can drag tabs to reorder within the grid
  4. User can search tabs by title or URL to filter visible tabs
**Plans**: 6 plans
- [x] [03-00-PLAN.md](./phases/03-tab-management/03-00-PLAN.md) — Add Wave 0 test scaffolding and worktree-safe baseline fixes
- [x] [03-01-PLAN.md](./phases/03-tab-management/03-01-PLAN.md) — Extend storage helpers for clear-all and persistent reorder
- [x] [03-02-PLAN.md](./phases/03-tab-management/03-02-PLAN.md) — Add local search/filter UI to the bag grid
- [x] [03-03-PLAN.md](./phases/03-tab-management/03-03-PLAN.md) — Add explicit per-card delete action
- [x] [03-04-PLAN.md](./phases/03-tab-management/03-04-PLAN.md) — Add clear-all confirmation flow
- [x] [03-05-PLAN.md](./phases/03-tab-management/03-05-PLAN.md) — Implement drag-to-reorder with persistent order
**UI hint**: yes

### Phase 4: Polish & Portability
**Goal**: Users can backup/restore their tab collection and see polished visuals
**Depends on**: Phase 3
**Requirements**: ICON-04, PORT-01, PORT-02
**Success Criteria** (what must be TRUE):
  1. User can export all tabs to a JSON file downloaded to their computer
  2. User can import tabs from a JSON file with merge behavior (duplicates skipped)
  3. Floating icon displays Chinese traditional (国风) visual style with appropriate colors and design
**Plans**: 2 plans
- [ ] [04-01-PLAN.md](./phases/04-polish-portability/04-01-PLAN.md) — Create options page with JSON export/import functionality (Wave 1)
- [ ] [04-02-PLAN.md](./phases/04-polish-portability/04-02-PLAN.md) — Redesign floating icon with 国风 visual styling (Wave 1)
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure & Floating Icon | 5/5 | Complete   | 2026-03-25 |
| 2. Tab Collection & Display | 6/6 | Complete   | 2026-03-25 |
| 3. Tab Management | 6/6 | Complete | 2026-03-26 |
| 4. Polish & Portability | 0/2 | Not started | - |

### Phase 5: 标签面板ui优化

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 4
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase 5 to break down)

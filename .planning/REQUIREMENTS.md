# Requirements: 法宝袋 (Magic Bag)

**Defined:** 2026-03-25
**Core Value:** 一键收纳标签页，让浏览器保持清爽

## v1 Requirements

### Infrastructure

- [x] **INFR-01**: Extension boots with WXT + React + TypeScript + Manifest V3
- [x] **INFR-02**: Shadow DOM isolates all content script UI from host page CSS
- [x] **INFR-03**: Service worker handles privileged Chrome APIs (tabs, contextMenus, storage)
- [x] **INFR-04**: `unlimitedStorage` permission requested for large tab collections

### Floating Icon

- [ ] **ICON-01**: Floating icon displays on all web pages
- [ ] **ICON-02**: Icon can be dragged to any of 4 screen edges (top/bottom/left/right)
- [x] **ICON-03**: Icon position persists across page reloads and browser sessions
- [x] **ICON-04**: Icon uses Chinese traditional (国风) visual style

### Tab Collection

- [x] **COLL-01**: Right-click context menu option "收入法宝袋" on any page
- [x] **COLL-02**: Current tab URL, title, and favicon captured and stored
- [x] **COLL-03**: Original tab auto-closes after collection
- [x] **COLL-04**: Tab data persists in chrome.storage.local

### Chessboard Display

- [x] **GRID-01**: Clicking icon reveals tabs in chessboard grid layout
- [x] **GRID-02**: Grid spreads from icon position toward opposite edge
- [x] **GRID-03**: Each tab shows favicon + title
- [x] **GRID-04**: Clicking a tab opens the URL in new tab
- [x] **GRID-05**: Clicking outside grid closes it

### Tab Management

- [x] **MNGT-01**: Delete individual tabs from grid
- [x] **MNGT-02**: Clear all tabs at once
- [x] **MNGT-03**: Drag tabs to reorder within grid
- [x] **MNGT-04**: Search tabs by title or URL

### Data Portability

- [x] **PORT-01**: Export all tabs to JSON file
- [x] **PORT-02**: Import tabs from JSON file (merge or replace)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Features

- **ENHC-01**: Undo delete (trash/restore)
- **ENHC-02**: Keyboard shortcuts for common actions
- **ENHC-03**: Tab groups/categories within the bag
- **ENHC-04**: Tab thumbnails preview

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Cloud sync / Account system | Local-first, no backend complexity |
| Multiple bags | Keep simple, single bag |
| Tab thumbnails | Favicon + title sufficient for v1 |
| HTML bookmark import/export | JSON is simpler and sufficient |
| Mobile support | Desktop Edge only for v1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFR-01 | Phase 1 | Complete |
| INFR-02 | Phase 1 | Complete |
| INFR-03 | Phase 1 | Complete |
| INFR-04 | Phase 1 | Complete |
| ICON-01 | Phase 1 | Pending |
| ICON-02 | Phase 1 | Pending |
| ICON-03 | Phase 1 | Complete |
| ICON-04 | Phase 4 | Complete |
| COLL-01 | Phase 2 | Complete |
| COLL-02 | Phase 2 | Complete |
| COLL-03 | Phase 2 | Complete |
| COLL-04 | Phase 2 | Complete |
| GRID-01 | Phase 2 | Complete |
| GRID-02 | Phase 2 | Complete |
| GRID-03 | Phase 2 | Complete |
| GRID-04 | Phase 2 | Complete |
| GRID-05 | Phase 2 | Complete |
| MNGT-01 | Phase 3 | Complete |
| MNGT-02 | Phase 3 | Complete |
| MNGT-03 | Phase 3 | Complete |
| MNGT-04 | Phase 3 | Complete |
| PORT-01 | Phase 4 | Complete |
| PORT-02 | Phase 4 | Complete |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-25*
*Last updated: 2026-03-25 after roadmap creation*

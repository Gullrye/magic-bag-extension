# Phase 2: Tab Collection & Display - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Build tab collection via context menu and chessboard grid display that spreads from the floating icon position.

**In scope:**
- Right-click context menu "将标签页收入法宝袋" to collect current tab
- Capture tab URL, title, and favicon; store in chrome.storage.local
- Close original tab after collection
- Click floating icon to reveal grid
- Chessboard grid layout that fills viewport then scrolls
- Each tab shows favicon + title
- Click tab to open URL in new tab
- Click outside grid to close it
- Scale + fade animation for grid appearance (300ms)
- Toast notification on successful collection
- Prevent duplicate URLs
- Tabs ordered newest-first

**NOT in scope:**
- Tab deletion, drag-to-reorder (Phase 3)
- Search functionality (Phase 3)
- Clear all tabs (Phase 3)
- 国风 visual styling (Phase 4)

</domain>

<decisions>
## Implementation Decisions

### Context Menu
- **D-01:** Context menu text: "将标签页收入法宝袋" (more explicit action)
- **D-02:** No confirmation dialog — collect immediately and show toast notification
- **D-03:** Toast notification appears on successful tab collection

### Grid Layout
- **D-04:** Grid fills browser viewport, then scrolls for additional tabs
- **D-05:** Default card size: Medium (160x100px) — Claude's discretion on exact sizing
- **D-06:** User customization option for card size — deferred to Phase 3 or future

### Grid Expansion
- **D-07:** Animation: Scale + fade (300ms) — grid expands outward from icon position

### Tab Storage
- **D-08:** Storage schema per tab: { url, title, favicon, timestamp }
- **D-09:** Prevent duplicate URLs — check before adding, show warning if duplicate detected
- **D-10:** Tab order: Newest first (most recently collected at top)

### Claude's Discretion
- Exact grid spacing and gap values
- Toast notification appearance and duration
- Favicon fallback behavior (what if no favicon available)
- Empty state display (what shows when no tabs collected)
- Maximum storage limits (chrome.storage.local has ~10MB default, unlimitedStorage requested)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Vision, constraints, key decisions
- `.planning/REQUIREMENTS.md` — COLL-01 to COLL-04, GRID-01 to GRID-05
- `.planning/ROADMAP.md` — Phase 2 details and success criteria

### Phase 1 Context
- `.planning/phases/01-infrastructure-floating-icon/01-CONTEXT.md` — Stack decisions (WXT, React, TypeScript, Tailwind), Shadow DOM pattern, storage module usage

### Research Findings
- `.planning/research/STACK.md` — WXT setup, recommended libraries
- `.planning/research/ARCHITECTURE.md` — Service worker, content script, storage patterns
- `.planning/research/PITFALLS.md` — CSS bleeding prevention, storage quotas

### Chrome Extension APIs
- [Chrome Context Menus API](https://developer.chrome.com/docs/extensions/reference/api/contextMenus) — Context menu creation and handling
- [Chrome Tabs API](https://developer.chrome.com/docs/extensions/reference/api/tabs) — Tab manipulation (capture, create, remove)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage) — chrome.storage.local for tab data persistence

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `entrypoints/content/BagIcon.tsx` — Floating icon component with drag behavior (needs onClick handler for grid toggle)
- `utils/storage.ts` — WXT storage module usage pattern (@wxt-dev/storage)
- `utils/drag.ts` — Edge snapping utilities (may not be needed for this phase)
- `entrypoints/content/types.ts` — IconPosition type (can extend with Tab types)

### Established Patterns
- Storage using `defineStorage` from @wxt-dev/storage with type safety
- React hooks (useState, useEffect, useCallback) for component state
- Shadow DOM isolation via createShadowRootUi
- Tailwind CSS for styling (already configured for Shadow DOM)

### Integration Points
- Service worker (`entrypoints/background.ts`) — context menu registration and handling
- Content script (`entrypoints/content/index.tsx`) — grid rendering within Shadow DOM
- Storage layer — new storage definition for saved tabs array

</code_context>

<specifics>
## Specific Ideas

- Grid should feel responsive and smooth — 300ms animation provides good feedback without feeling sluggish
- Toast notification should be subtle — brief confirmation that action succeeded
- Duplicate prevention avoids clutter — users won't accidentally save the same tab multiple times
- Newest-first order matches user intent — most recently collected tabs are most relevant

</specifics>

<deferred>
## Deferred Ideas

- User-customizable card sizes — noted for future enhancement, would add UI complexity
- Grid view options (list vs grid) — deferred to maintain phase focus
- Tab grouping/categories — belongs in future phase for advanced organization

</deferred>

---

*Phase: 02-tab-collection-display*
*Context gathered: 2026-03-25*

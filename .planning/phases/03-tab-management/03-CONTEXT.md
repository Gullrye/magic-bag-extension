# Phase 3: Tab Management - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Build tab management capabilities on top of Phase 2's saved-tab grid, with search as the primary organization mechanism and delete/clear/reorder as supporting management actions.

**In scope:**
- Search saved tabs by title or URL from within the bag
- Show a persistent search input at the top of the grid
- Filter results in real time with case-insensitive substring matching
- Reset the search query each time the bag closes and reopens
- Keep search state local to the UI and out of persistent storage
- Delete individual saved tabs from the grid
- Clear all saved tabs with a single confirmed action
- Drag saved tabs to reorder them within the grid
- Persist reordered tab order in storage
- Preserve existing tab-open behavior and existing newest-first baseline for newly collected tabs

**NOT in scope:**
- Tags, folders, groups, or categories
- Dedicated search page or search-only mode
- Persisting the search query across opens or page reloads
- Auto-focus search input when the bag opens
- Search history, recent queries, or saved filters
- Match highlighting within titles/URLs
- Debounced search for the initial implementation
- Undo delete / trash / restore flows
- Board-style freeform spatial arrangement

</domain>

<decisions>
## Implementation Decisions

### Search and Filtering
- **D-01:** Use search/filtering as the only organization mechanism for Phase 3. Do not add tags, folders, or groups.
- **D-02:** Place a persistent search input at the top of the bag grid.
- **D-03:** Match against both `title` and `url` using case-insensitive substring matching.
- **D-04:** Reset the query to empty each time the bag is reopened.
- **D-05:** Do not auto-focus the search input when opening the bag.
- **D-06:** Keep search state local to `TabGrid`; do not write search state to storage.
- **D-07:** Split empty states:
  - "bag truly empty" when there are no saved tabs
  - "no search results" when saved tabs exist but the current query matches none
- **D-08:** Keep initial search implementation simple: no debounce, no search history, no highlighting.

### Management Actions
- **D-09:** Individual delete remains part of Phase 3 and should use an explicit affordance on each tab card.
- **D-10:** "Clear all" remains part of Phase 3 and should require confirmation before destructive removal.
- **D-11:** Reordering remains part of Phase 3 and should persist the updated order in storage.

### Architecture
- **D-12:** Search should be implemented in the content-script UI only; no background messaging changes are required for filtering.
- **D-13:** Existing `SavedTab` shape remains sufficient for search/filtering; no schema change is required for search.
- **D-14:** Filtered results are a derived view of saved tabs; filtering must not mutate saved tab order or storage.

### Claude's Discretion
- Exact placeholder copy for the search input
- Exact copy for the "no search results" state
- Search input iconography and styling within the existing bag panel
- Whether reorder uses whole-card dragging or a dedicated drag affordance, as long as click-to-open remains clear
- Exact delete button placement and hover treatment
- Exact confirmation copy for "clear all"

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Vision, constraints, key decisions
- `.planning/REQUIREMENTS.md` — MNGT-01 to MNGT-04, surrounding product scope
- `.planning/ROADMAP.md` — Phase 3 goal and success criteria

### Prior Phase Context
- `.planning/phases/02-tab-collection-display/02-CONTEXT.md` — Saved tab schema, grid behavior, duplicate policy, open/close interactions
- `.planning/phases/02-tab-collection-display/02-UI-SPEC.md` — Existing panel, card, spacing, and copy contracts

### Cross-Phase Research
- `.planning/research/ARCHITECTURE.md` — Extension architecture and storage/service-worker patterns
- `.planning/research/PITFALLS.md` — Storage, Shadow DOM, and UI implementation pitfalls
- `.planning/research/STACK.md` — Standard stack and dependency expectations

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `entrypoints/content/TabGrid.tsx` — Existing grid container, storage watch, open/close lifecycle
- `entrypoints/content/TabCard.tsx` — Existing tab card rendering and click-to-open behavior
- `entrypoints/content/EmptyState.tsx` — Existing empty bag state
- `entrypoints/content/index.tsx` — App shell and grid toggle wiring
- `entrypoints/content/types.ts` — `SavedTab` type definition
- `utils/storage.ts` — Saved tab storage item and `removeTab()` helper

### Established Patterns
- Content-script UI state is managed locally with React hooks
- Persistent bag data lives in WXT storage helpers
- Grid visibility is controlled by `isOpen` in the content script app shell
- Background script is used only for privileged browser operations

### Integration Notes
- Search can stay fully inside `TabGrid.tsx`
- Search filtering should preserve current open-tab flow through `onTabClick`
- Delete/clear/reorder will likely require expanding `utils/storage.ts`
- Reorder must preserve the identity key currently based on `tab.url`

</code_context>

<specifics>
## Specific Ideas

- Search should feel immediate and predictable rather than "smart"
- When the query is empty, all tabs should render in their persisted order
- Search should narrow only the visible list, not affect storage
- Closing and reopening the bag should always return the user to the full list
- Search should not steal focus from the host page when the bag opens

</specifics>

<deferred>
## Deferred Ideas

- Tags/folders/grouping for advanced organization
- Search highlight markup in card content
- Persisted search preferences
- Keyboard shortcut to focus search
- Undo delete / soft-delete flows
- Alternative views (list view, compact view, grouped view)

</deferred>

---

*Phase: 03-tab-management*
*Context gathered: 2026-03-26*

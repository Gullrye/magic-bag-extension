# Phase 4: Polish & Portability - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Add data portability (export/import) via a browser extension options page, and apply Chinese traditional (国风) visual styling to the floating icon.

**In scope:**
- Export all saved tabs to JSON file downloaded to user's computer
- Import tabs from JSON file with merge behavior (add to existing, skip duplicates)
- Browser extension options page for import/export UI
- 国风 visual styling for the floating icon (shape, colors, decorative details)

**NOT in scope:**
- Cloud sync / account system
- Tab thumbnails
- HTML bookmark format
- 国风 styling for the grid/panel (focus on icon only)

</domain>

<decisions>
## Implementation Decisions

### Data Portability
- **D-01:** Export format: Array of tabs only — `[{url, title, favicon, timestamp}, ...]`
- **D-02:** Import behavior: Merge — add imported tabs to existing, preserve current tabs
- **D-03:** Duplicate handling: Skip silently — if imported URL already exists, skip without prompting
- **D-04:** No preview or confirmation dialog needed for import — merge is non-destructive

### UI Location
- **D-05:** Import/export UI goes in a browser extension options page (not in the grid)
- **D-06:** Options page accessible via standard extension entry points (right-click icon → Options, or chrome://extensions)
- **D-07:** Grid UI remains unchanged — no import/export buttons in the grid header/footer

### 国风 Visual Styling
- **D-08:** Apply Chinese traditional visual style to the floating icon (Claude's discretion on specifics)
- **D-09:** Icon should read as a "法宝袋" (magic bag/pouch) — use bag/pouch shape, not simple circle
- **D-10:** Colors should evoke Chinese traditional aesthetic (red/gold, jade green, ink wash tones)
- **D-11:** Subtle decorative elements and/or animations are acceptable but should not be distracting

### Claude's Discretion
- Exact icon shape and proportions (traditional pouch vs stylized bag)
- Specific color palette and gradients
- Decorative details (embroidery patterns, tassels, seal stamps)
- Hover and drag state animations
- Whether to add subtle shadow or glow effects for visibility on light/dark pages

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Vision, constraints, key decisions
- `.planning/REQUIREMENTS.md` — PORT-01, PORT-02, ICON-04
- `.planning/ROADMAP.md` — Phase 4 goal and success criteria

### Prior Phase Context
- `.planning/phases/01-infrastructure-floating-icon/01-CONTEXT.md` — Icon size (48x48px), z-index, position storage
- `.planning/phases/02-tab-collection-display/02-CONTEXT.md` — SavedTab schema, storage patterns
- `.planning/phases/03-tab-management/03-CONTEXT.md` — Grid UI structure, existing header layout

### WXT Documentation
- [WXT Options Page](https://wxt.dev/guide/essentials/options) — Creating extension options pages

### Chrome Extension APIs
- [Chrome Downloads API](https://developer.chrome.com/docs/extensions/reference/api/downloads) — For triggering JSON file download
- [Chrome File System Access](https://developer.chrome.com/docs/extensions/reference/api/fileSystem) — For file upload/import

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `utils/storage.ts` — `savedTabs` storage item, `addTab()` helper (already handles duplicate check)
- `entrypoints/content/types.ts` — `SavedTab` type definition
- `entrypoints/content/BagIcon.tsx` — Current placeholder icon (48x48px circle), drag behavior, position logic
- `entrypoints/content/TabGrid.tsx` — Grid component (reference for understanding data flow)

### Established Patterns
- WXT storage module (`@wxt-dev/storage`) for persistence
- React hooks for component state
- Shadow DOM isolation via `createShadowRootUi`
- Tailwind CSS for styling
- Background script for privileged Chrome API calls

### Integration Points
- New options page entrypoint: `entrypoints/options/` (WXT convention)
- Options page will import `savedTabs` from `utils/storage.ts` for export/import
- `BagIcon.tsx` will receive visual styling update (replace placeholder circle with 国风 design)
- Export will use Chrome Downloads API for file save
- Import will use HTML file input for file selection

</code_context>

<specifics>
## Specific Ideas

- Import/export should feel like a backup/restore flow — simple and reliable
- Merge behavior means users can safely import without losing existing tabs
- Skip-duplicates-silently keeps the import flow fast and non-disruptive
- Options page is the standard location for extension settings — users will know where to look
- 国风 icon should be recognizable as a "bag" or "pouch" shape, not just a decorated circle

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-polish-portability*
*Context gathered: 2026-03-27*

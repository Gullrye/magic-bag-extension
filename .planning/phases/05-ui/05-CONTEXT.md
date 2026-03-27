# Phase 5: 标签面板ui优化 - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Optimize the visual design and interaction experience of the tab panel (TabGrid, TabCard, and related components) for improved user experience while maintaining the established 国风 aesthetic and functionality.

**In scope:**
- Reduce card size from 160x100 to 140x90 for better density
- Make delete button appear on hover only (cleaner default look)
- Add sticky header so keep search bar visible when scrolling
- Maintain current panel dimensions (80vw × 70vh)
- Maintain current open/close animation (scale + fade)
- Maintain current hover effects (scale, shadow, border)

**NOT in scope:**
- Changes to card visual style (keep current white/amber style)
- 国风 decorative elements on cards
- Alternative panel sizes or- Alternative header content (title, tab count)
- Scroll-based animations
- Always-visible delete button

</domain>

<decisions>
## Implementation Decisions

### Card Design
- **D-01:** Reduce card size from 160x100px to 140x90px for better density and more cards visible on screen
- **D-02:** Delete button appears on hover only — hidden by default, fades in smoothly on hover
- **D-03:** Keep current card visual style — white background, amber border, gray shadow — no 国风 decorative elements on cards
- **D-04:** Keep current favicon (16x16) and title (2-line clamp) layout

### Panel Layout
- **D-05:** Keep current panel dimensions — 80vw × 70vh fixed size
- **D-06:** Sticky header — search bar and clear button stay fixed at top when scrolling content
- **D-07:** Keep current minimal header — no title or tab count badge, just search input and clear button

### Animations
- **D-08:** Keep current open/close animation — scale + fade, 300ms cubic-bezier
- **D-09:** Keep current hover effects — scale 1.02, blue border, enhanced shadow
- **D-10:** Delete button uses fade transition — opacity and visibility transition on hover

### Claude's Discretion
- Exact transition timing for delete button fade (suggested: 150ms)
- Hover state z-index layering if needed
- Scroll behavior smoothness (CSS scroll-behavior)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Vision, constraints, key decisions
- `.planning/REQUIREMENTS.md` — Product requirements
- `.planning/ROADMAP.md` — Phase 5 goal

### Prior Phase Context
- `.planning/phases/03-tab-management/03-CONTEXT.md` — Tab management patterns
- `.planning/phases/04-polish-portability/04-UI-SPEC.md` — Design system (spacing, typography, color)

### Existing Code
- `entrypoints/content/TabGrid.tsx` — Current grid implementation
- `entrypoints/content/TabCard.tsx` — Current card implementation

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `entrypoints/content/TabGrid.tsx` — Grid container with search, clear, drag-to-reorder
- `entrypoints/content/TabCard.tsx` — Card component with favicon, title, delete
- `entrypoints/content/style.css` — CSS with @keyframes for gridOpen animation

### Established Patterns
- Tailwind CSS for styling (already configured for Shadow DOM)
- CSS transitions for hover effects
- CSS keyframes for open animation
- React state for hover detection

### Integration Points
- TabCard receives onDelete prop, needs hover state
- TabGrid header needs sticky positioning
- style.css may need new transition for delete button

</code_context>

<specifics>
## Specific Ideas

- Smaller cards mean ~15 more cards visible in the 80vw panel
- Hover-only delete makes default view cleaner, less visual noise
- Sticky header ensures search is always accessible

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-ui*
*Context gathered: 2026-03-27*

# Phase 1: Infrastructure & Floating Icon - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Build extension infrastructure (WXT + React + TypeScript, Manifest V3, service worker, Shadow DOM) and a draggable floating icon that displays on all web pages with position persistence.

**In scope:**
- WXT project setup with React + TypeScript
- Manifest V3 configuration with required permissions (storage, tabs, contextMenus, activeTab, unlimitedStorage)
- Service worker for privileged Chrome APIs
- Content script with Shadow DOM for style isolation
- Floating icon that appears on all pages
- Drag to 4 edges (top/bottom/left/right)
- Position persistence via chrome.storage.local

**NOT in scope:**
- 国风 visual styling (Phase 4)
- Tab collection/display (Phase 2)
- Any UI beyond the floating icon

</domain>

<decisions>
## Implementation Decisions

### Project Stack
- **D-01:** Use WXT framework for extension development (research-backed, best DX)
- **D-02:** React + TypeScript for UI components
- **D-03:** Tailwind CSS for styling (inside Shadow DOM)
- **D-04:** Shadow DOM for complete CSS isolation from host pages

### Floating Icon
- **D-05:** Icon initially appears at bottom-right corner on fresh install
- **D-06:** Icon size: 48x48px (touch-friendly, not too intrusive)
- **D-07:** Icon uses a simple placeholder design (colored circle or square) until Phase 4 国风 styling
- **D-08:** Drag behavior: smooth dragging with visual feedback, snaps to nearest edge when released
- **D-09:** Position stored per-domain in chrome.storage.local (survives page reloads and browser restarts)

### Layer Management
- **D-10:** Use z-index: 2147483647 (maximum safe integer) for icon container
- **D-11:** Icon container injected as direct child of document.body to avoid stacking context issues

### Claude's Discretion
- Exact placeholder icon appearance (simple shape, neutral color)
- Animation details for drag feedback
- Edge detection threshold for snapping
- Whether to add subtle shadow/border for visibility on light/dark pages

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Vision, constraints, key decisions
- `.planning/REQUIREMENTS.md` — INFR-01 to INFR-04, ICON-01 to ICON-03
- `.planning/ROADMAP.md` — Phase 1 details and success criteria

### Research Findings
- `.planning/research/STACK.md` — WXT setup, Shadow DOM patterns, recommended libraries
- `.planning/research/ARCHITECTURE.md` — Service worker, content script, storage patterns
- `.planning/research/PITFALLS.md` — CSS bleeding prevention, z-index strategy, storage quotas

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
None — this is a greenfield project.

### Established Patterns
None — patterns will be established in this phase.

### Integration Points
- Content script injects into all web pages (matches: ["<all_urls>"])
- Service worker handles extension lifecycle and API calls
- Storage layer provides persistence abstraction

</code_context>

<specifics>
## Specific Ideas

- Placeholder icon should be neutral and unobtrusive — final 国风 design comes in Phase 4
- Drag should feel responsive and natural, not laggy
- Position persistence should be instant (no delay before storage write)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-infrastructure-floating-icon*
*Context gathered: 2026-03-25*

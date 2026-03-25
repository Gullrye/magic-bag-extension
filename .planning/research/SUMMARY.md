# Project Research Summary

**Project:** Magic Bag (法宝袋) - Tab Management Browser Extension
**Domain:** Chromium/Edge Browser Extension with Floating UI Overlay
**Researched:** 2026-03-25
**Confidence:** HIGH

## Executive Summary

Magic Bag is a Chromium/Edge browser extension that collects open tabs into a visual "chessboard" grid, displayed via a floating draggable icon. The extension differentiates itself through a spatial visual layout and Chinese traditional (Guofeng) aesthetics, contrasting with list-based competitors like OneTab and Session Buddy.

The recommended approach uses WXT as the build framework (Manifest V3 required), React for UI components, and Shadow DOM for complete style isolation from host pages. All privileged operations (tab access, storage, context menus) should be delegated to the service worker, with content scripts handling only UI rendering and user interaction.

The primary risks are CSS bleeding from host pages (mitigated by Shadow DOM), storage quota limits (mitigated by storing minimal data and requesting unlimitedStorage permission), and service worker lifecycle issues (mitigated by proper event registration in onInstalled). These must be addressed in Phase 1 to avoid costly rewrites later.

## Key Findings

### Recommended Stack

WXT is the leading browser extension framework in 2025, built on Vite with excellent developer experience including HMR for content scripts and automatic manifest management. React 18 provides the component model needed for the draggable UI and grid layout. TypeScript ensures type safety across the message-passing boundary.

**Core technologies:**
- **WXT 0.20.x** — Extension build framework — best-in-class DX, automatic Manifest V3 handling
- **React 18.x** — UI framework — ideal for floating draggable UI and grid layout
- **TypeScript 5.x** — Type safety — essential for storage types and message contracts
- **Tailwind CSS 4.x** — Styling — works with Shadow DOM, supports custom Guofeng theme
- **react-draggable 4.x** — Floating icon drag — lightweight library for draggable UI
- **@dnd-kit/core 6.x** — Tab reordering — modern drag-and-drop, replaces abandoned react-beautiful-dnd

### Expected Features

**Must have (table stakes):**
- Save tabs via context menu — users expect one-click save
- Open/restore saved tabs — core reverse operation
- Delete individual tabs — basic data management
- Clear all tabs — clean slate option
- Persistent storage — tabs survive browser restart
- Favicon display — visual identification

**Should have (competitive):**
- Floating draggable icon — always accessible, differentiates from toolbar-based extensions
- Chessboard grid layout — spatial organization, key visual differentiator
- Guofeng visual theme — brand differentiation
- Search tabs — essential as collection grows
- Export/import JSON — data portability

**Defer (v2+):**
- Tab groups/collections — organizational complexity
- Cloud sync — requires backend infrastructure
- Thumbnail previews — storage bloat

### Architecture Approach

Manifest V3 architecture with service worker (background), content script with Shadow DOM UI, and chrome.storage.local for persistence. The background script is the API gateway handling all privileged Chrome API calls. Content scripts only render UI and delegate operations via messaging.

**Major components:**
1. **Service Worker (background/)** — Context menu registration, tab operations, storage management
2. **Content Script (content/)** — Shadow DOM container, floating icon, tab grid, drag behavior
3. **Storage Layer** — chrome.storage.local with @wxt-dev/storage abstraction
4. **Message Bus** — Type-safe messaging between background and content script

### Critical Pitfalls

1. **CSS Bleeding** — Use Shadow DOM (`createShadowRootUi` in WXT) for complete isolation. Test on high-CSS sites like Gmail and Facebook.

2. **Storage Quota Exceeded** — Request `"unlimitedStorage"` permission, store only URL/title/favicon URL (not image data), implement error handling.

3. **Z-Index Stacking Context Hell** — Append container directly to document.body with z-index: 2147483647, use position: fixed.

4. **Service Worker Lifecycle Disconnects** — Register context menus in `chrome.runtime.onInstalled`, not at top level. Handle "Extension context invalidated" errors.

5. **Memory Leaks from Detached DOM** — Use AbortController for event listener cleanup, nullify references on removal.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Core Infrastructure and Floating UI
**Rationale:** Foundation must be solid before adding features. Shadow DOM isolation and service worker setup are architectural decisions that are costly to change later.
**Delivers:** Floating draggable icon on all pages, context menu registration, basic messaging
**Addresses:** Floating draggable icon, context menu integration
**Avoids:** CSS bleeding, Shadow DOM style injection failures, z-index conflicts, service worker lifecycle issues, memory leaks

### Phase 2: Tab Collection and Storage
**Rationale:** With infrastructure in place, implement the core save/restore flow. Storage schema must be designed before UI depends on it.
**Delivers:** Save tab via context menu, persistent storage, chessboard grid display, open tab from grid, favicon display
**Uses:** @wxt-dev/storage, Chrome tabs API, favicon permission
**Implements:** Storage Layer, Background tab operations

### Phase 3: Tab Management Features
**Rationale:** Core save/restore working, now add data management capabilities users expect.
**Delivers:** Delete individual tabs, clear all tabs, search/filter functionality, drag-to-reorder tabs
**Uses:** @dnd-kit for reordering

### Phase 4: Data Portability and Polish
**Rationale:** Data safety is a common user fear. Export/import provides peace of mind and differentiates from competitors that lose data.
**Delivers:** Export to JSON, import from JSON, keyboard shortcuts, Guofeng visual polish
**Addresses:** Export/import, visual theme refinement

### Phase Ordering Rationale

- Phase 1 must come first because Shadow DOM isolation is architectural; retrofitting it later requires rewriting all styling
- Phase 2 depends on Phase 1's messaging infrastructure and context menu
- Phase 3 features depend on Phase 2's storage and grid display
- Phase 4 is enhancement; users can use the extension without it
- All pitfall prevention is concentrated in Phase 1-2 to avoid technical debt

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Shadow DOM + Tailwind integration is tricky; may need experimentation with cssInjectionMode and style injection patterns
- **Phase 3:** Virtual scrolling if tab count exceeds 100; research best approach for performance

Phases with standard patterns (skip research-phase):
- **Phase 2:** Storage patterns well-documented in WXT docs; context menu API is standard Chrome extension API
- **Phase 4:** Export/import is straightforward JSON serialization

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | WXT, React, TypeScript are well-documented; official Chrome docs for APIs |
| Features | HIGH | Competitor analysis thorough; user expectations clear from Reddit discussions |
| Architecture | HIGH | Manifest V3 patterns well-established; Shadow DOM isolation is standard practice |
| Pitfalls | HIGH | Sources include official Chrome docs, community discussions, and practical case studies |

**Overall confidence:** HIGH

### Gaps to Address

- **Tailwind in Shadow DOM:** While documented, actual integration may require experimentation. Validate with WXT's cssInjectionMode: 'ui' pattern early in Phase 1.
- **Guofeng Theme Implementation:** No direct references for implementing Chinese traditional aesthetics in browser extensions. Design decisions will need validation during UI development.
- **Edge Browser Testing:** Research focused on Chromium; explicit Edge testing should be added to QA process.

## Sources

### Primary (HIGH confidence)
- WXT Official Documentation (wxt.dev) — framework usage, content scripts, storage
- Chrome Extensions Documentation (developer.chrome.com) — Manifest V3, storage API, context menus, favicon API
- MDN Web Docs — content scripts, Shadow DOM

### Secondary (MEDIUM confidence)
- 2025 State of Browser Extension Frameworks (redreamality.com) — WXT vs Plasmo vs CRXJS comparison
- Reddit r/chrome_extensions discussions — user pain points with OneTab, feature requests
- Tailwind with Shadow DOM Guide (dev.to) — practical integration patterns

### Tertiary (LOW confidence)
- Community blog posts on specific pitfalls — validated against official docs where possible

---
*Research completed: 2026-03-25*
*Ready for roadmap: yes*

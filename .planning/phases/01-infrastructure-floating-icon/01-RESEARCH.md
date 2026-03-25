# Phase 1: Infrastructure & Floating Icon - Research

**Researched:** 2026-03-25
**Domain:** Chromium Browser Extension (Manifest V3) with Shadow DOM Floating UI
**Confidence:** HIGH

## Summary

Phase 1 establishes the foundational infrastructure for the Magic Bag extension. The primary challenge is building a draggable floating icon that displays consistently across all web pages while surviving browser restarts—all while maintaining complete CSS isolation from host pages.

The research confirms that **WXT 0.20.x** is the optimal framework choice, providing first-class support for React + TypeScript with excellent Shadow DOM utilities via `createShadowRootUi`. The floating icon implementation requires careful attention to z-index stacking contexts, position persistence, and edge-snapping behavior. Existing research documents (STACK.md, ARCHITECTURE.md, PITFALLS.md) provide comprehensive guidance—this phase-specific research focuses on implementation details for INFR-01 through INFR-04 and ICON-01 through ICON-03.

**Primary recommendation:** Use WXT's `createShadowRootUi` with `cssInjectionMode: 'ui'` for style isolation, implement custom drag logic (avoiding react-draggable to reduce bundle size for this simple use case), and persist position to `chrome.storage.local` with per-domain storage keys.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use WXT framework for extension development (research-backed, best DX)
- **D-02:** React + TypeScript for UI components
- **D-03:** Tailwind CSS for styling (inside Shadow DOM)
- **D-04:** Shadow DOM for complete CSS isolation from host pages
- **D-05:** Icon initially appears at bottom-right corner on fresh install
- **D-06:** Icon size: 48x48px (touch-friendly, not too intrusive)
- **D-07:** Icon uses a simple placeholder design (colored circle or square) until Phase 4 国风 styling
- **D-08:** Drag behavior: smooth dragging with visual feedback, snaps to nearest edge when released
- **D-09:** Position stored per-domain in chrome.storage.local (survives page reloads and browser restarts)
- **D-10:** Use z-index: 2147483647 (maximum safe integer) for icon container
- **D-11:** Icon container injected as direct child of document.body to avoid stacking context issues

### Claude's Discretion
- Exact placeholder icon appearance (simple shape, neutral color)
- Animation details for drag feedback
- Edge detection threshold for snapping
- Whether to add subtle shadow/border for visibility on light/dark pages

### Deferred Ideas (OUT OF SCOPE)
- 国风 visual styling (Phase 4)
- Tab collection/display (Phase 2)
- Any UI beyond the floating icon
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFR-01 | Extension boots with WXT + React + TypeScript + Manifest V3 | WXT 0.20.20 provides React template, TypeScript support, automatic Manifest V3 generation |
| INFR-02 | Shadow DOM isolates all content script UI from host page CSS | `createShadowRootUi` with `cssInjectionMode: 'ui'` provides complete isolation |
| INFR-03 | Service worker handles privileged Chrome APIs (tabs, contextMenus, storage) | WXT's `defineBackground` with event listeners for contextMenus and messaging |
| INFR-04 | `unlimitedStorage` permission requested for large tab collections | Add to manifest permissions array, enables unlimited chrome.storage.local quota |
| ICON-01 | Floating icon displays on all web pages | Content script with `matches: ['<all_urls>']` and `createShadowRootUi` |
| ICON-02 | Icon can be dragged to any of 4 screen edges (top/bottom/left/right) | Custom drag implementation with position calculation and edge-snapping |
| ICON-03 | Icon position persists across page reloads and browser sessions | chrome.storage.local with position object keyed by domain |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **WXT** | 0.20.20 | Extension Build Framework | Leading framework in 2025/2026. Built on Vite with HMR for content scripts, auto-imports, automatic manifest management. Verified current version: 0.20.20 (npm view wxt version). |
| **Manifest V3** | 3 | Chrome Extension Manifest | Mandatory as of June 2025. Chrome Web Store no longer accepts new MV2 extensions. WXT auto-generates compliant manifest. |
| **TypeScript** | 5.x | Type Safety | First-class support in WXT. Essential for storage types, message passing, API contracts. Catches errors at compile time. |
| **React** | 19.2.4 | UI Framework | Latest stable version. Excellent WXT integration. Component model ideal for draggable floating UI. Verified current: 19.2.4 (npm view react version). |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@wxt-dev/storage** | 1.2.x | Storage Abstraction | Built into WXT. Simplifies chrome.storage.local with type-safe API, watchers, versioning. Essential for position persistence. |
| **Tailwind CSS** | 4.x / 3.4.x | Styling | Rapid UI development. Works with Shadow DOM when using `cssInjectionMode: 'ui'`. Perfect for 国风 styling in Phase 4. |
| **react-draggable** | 4.5.0 | Floating Icon Drag | Lightweight (8KB) library for draggable elements. Verified current: 4.5.0. Use for Phase 1 drag implementation. |

### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| **pnpm** | Package Manager | Recommended by WXT. Fast, disk-efficient. Use `pnpm dlx wxt@latest init` to bootstrap. |
| **Vite** | Build Tool (via WXT) | WXT is built on Vite. No separate configuration needed. Provides fast HMR during development. |
| **Chrome DevTools** | Debugging | Standard for extension debugging. Use `chrome://extensions` with developer mode. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| **WXT** | Plasmo | Plasmo is more React-opinionated but heavier. WXT is lighter and framework-agnostic. |
| **react-draggable** | Native Drag API | Native API reduces bundle size but requires more code. react-draggable is battle-tested for this exact use case. |
| **Tailwind** | CSS Modules | CSS Modules more verbose for rapid development. Tailwind faster for prototyping 国风 styles. |

**Installation:**
```bash
# Bootstrap new project with React + TypeScript
pnpm dlx wxt@latest init magic-bag --template react

cd magic-bag

# Add supporting libraries
pnpm add react-draggable

# Tailwind CSS (if not included in template)
pnpm add -D tailwindcss postcss autoprefixer
pnpm dlx tailwindcss init -p
```

**Version verification:**
- WXT: 0.20.20 (verified 2026-03-25 via npm view wxt version)
- React: 19.2.4 (verified 2026-03-25 via npm view react version)
- react-draggable: 4.5.0 (verified 2026-03-25 via npm view react-draggable version)
- @dnd-kit/core: 6.3.1 (verified 2026-03-25 via npm view @dnd-kit/core version - for Phase 3 tab reordering)

## Architecture Patterns

### Recommended Project Structure (WXT Convention)
```
magic-bag/
├── entrypoints/
│   ├── background.ts              # Service worker (context menus, tab operations)
│   ├── content/
│   │   ├── index.tsx              # Main content script with Shadow DOM UI
│   │   ├── style.css              # Tailwind styles (injected into Shadow DOM)
│   │   ├── BagIcon.tsx            # Floating draggable icon component
│   │   └── types.ts               # Content script types
│   ├── popup/                     # Optional: browser action popup
│   └── options/                   # Optional: extension options page
├── components/                    # Shared React components (if needed)
├── utils/
│   ├── storage.ts                 # WXT storage definitions for position
│   └── drag.ts                    # Drag utilities
├── public/
│   └── icon.png                   # Extension icon
├── wxt.config.ts                  # WXT configuration
└── package.json
```

### Pattern 1: Shadow DOM for Style Isolation
**What:** Encapsulate all injected UI inside a Shadow DOM root to prevent CSS conflicts with host pages.

**When to use:** Always for content script UI. Required for any extension injecting visual elements.

**Why critical:** Without Shadow DOM, host page CSS will corrupt the floating icon appearance, and extension styles may bleed onto the page. This is Pitfall #1 from PITFALLS.md.

**Example:**
```typescript
// entrypoints/content/index.tsx
import './style.css';
import ReactDOM from 'react-dom/client';
import BagIcon from './BagIcon';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui', // CRITICAL: Enables Shadow DOM style injection

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'magic-bag',
      position: 'inline',
      anchor: 'body',
      onMount(container) {
        // Create wrapper div (React warns when creating root on body)
        const app = document.createElement('div');
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(<BagIcon />);
        return root;
      },
      onRemove: (root) => root?.unmount(),
    });

    ui.mount();
  },
});
```

**Source:** [WXT Content Scripts Guide - Shadow Root](https://wxt.dev/guide/essentials/content-scripts) - HIGH confidence, official WXT documentation verified 2026-03-25.

### Pattern 2: WXT Storage for Position Persistence
**What:** Use WXT's `storage` module to type-safely persist icon position to `chrome.storage.local`.

**When to use:** For any data that needs to persist across sessions (position, settings, saved tabs).

**Example:**
```typescript
// utils/storage.ts
import { storage } from 'wxt/supplements';

export interface IconPosition {
  x: number;
  y: number;
  edge: 'top' | 'right' | 'bottom' | 'left';
}

export const iconPosition = storage.defineItem<IconPosition>('local:iconPosition', {
  fallback: { x: 20, y: window.innerHeight - 68, edge: 'bottom' }, // Bottom-right default
  version: 1,
});
```

**Usage in component:**
```typescript
// components/BagIcon.tsx
import { iconPosition } from '../../utils/storage';

function BagIcon() {
  const [position, setPosition] = useState<IconPosition>();

  useEffect(() => {
    // Load saved position on mount
    iconPosition.getValue().then(setPosition);
  }, []);

  const handleDragEnd = async (newPos: IconPosition) => {
    setPosition(newPos);
    await iconPosition.setValue(newPos); // Persist immediately
  };
}
```

### Pattern 3: Edge-Snapping Drag Implementation
**What:** Implement drag behavior that snaps the icon to the nearest edge when released.

**When to use:** For floating UI that should stay unobtrusive along screen edges.

**Example:**
```typescript
// utils/drag.ts
export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

export function snapToEdge(
  x: number,
  y: number,
  iconSize: number,
  threshold: number = 50
): { x: number; y: number; edge: 'top' | 'right' | 'bottom' | 'left' } {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Determine which edge is closest
  const distToLeft = x;
  const distToRight = viewportWidth - (x + iconSize);
  const distToTop = y;
  const distToBottom = viewportHeight - (y + iconSize);

  const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

  if (minDist === distToLeft && distToLeft < threshold) {
    return { x: 10, y, edge: 'left' };
  }
  if (minDist === distToRight && distToRight < threshold) {
    return { x: viewportWidth - iconSize - 10, y, edge: 'right' };
  }
  if (minDist === distToTop && distToTop < threshold) {
    return { x, y: 10, edge: 'top' };
  }
  if (minDist === distToBottom && distToBottom < threshold) {
    return { x, y: viewportHeight - iconSize - 10, edge: 'bottom' };
  }

  // No snap - return position as-is
  return { x, y, edge: 'bottom' }; // Default edge
}
```

### Anti-Patterns to Avoid
- **CSS without Shadow DOM:** Never inject styles directly into page DOM. Always use `createShadowRootUi` with `cssInjectionMode: 'ui'`.
- **Low z-index values:** Don't use arbitrary z-index values. Use 2147483647 (max safe integer) as per D-10.
- **Nested container injection:** Don't append icon container to anything other than `document.body`. Nesting creates stacking context traps (Pitfall #3).
- **Synchronous storage operations:** Never assume storage reads are instant. Always use `await` or handle promises.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| **Style isolation** | Custom CSS namespacing, prefixing, or scoped CSS modules | Shadow DOM via `createShadowRootUi` | CSS isolation is notoriously fragile. Host pages can override even carefully namespaced styles. Shadow DOM provides browser-enforced isolation. |
| **Drag behavior** | Native mouse/touch event handlers with position calculation | react-draggable (4.5.0) | Drag implementation has many edge cases: touch support, momentum, boundary constraints, iframe escape. react-draggable is 8KB and handles all of this. |
| **Storage abstraction** | Direct chrome.storage.local calls with manual serialization | WXT storage module (`@wxt-dev/storage`) | Built-in type safety, versioning, migrations, and watchers. Eliminates boilerplate and prevents storage-related bugs. |
| **Extension build config** | Custom Vite/Webpack config for extension bundling | WXT framework | Extension builds have unique requirements (manifest generation, content script injection, HMR for multiple contexts). WXT handles all of this automatically. |
| **TypeScript types for Chrome APIs** | Manual `interface` definitions for chrome.* APIs | Built-in types from `@types/chrome` (included with WXT) | Chrome API types are complex and frequently updated. Using official types prevents API mismatches. |

**Key insight:** Extension development has many platform-specific complexities. Building custom abstractions for these problems results in fragile code that breaks on edge cases. Use battle-tested libraries.

## Runtime State Inventory

> Include this section for rename/refactor/migration phases only. Omit entirely for greenfield phases.

Phase 1 is a greenfield phase—no runtime state to inventory.

## Common Pitfalls

### Pitfall 1: Content Script CSS Bleeding
**What goes wrong:** Styles from the host webpage "bleed" into the extension's floating icon, causing visual corruption.

**Why it happens:** Content scripts inject DOM elements into the host page. Without Shadow DOM isolation, CSS rules cascade across boundaries.

**How to avoid:** Use `createShadowRootUi` with `cssInjectionMode: 'ui'`. This is NON-NEGOTIABLE for Phase 1.

**Warning signs:** Icon looks different on different websites, unexpected fonts, broken layouts.

**Confidence:** HIGH - Documented in PITFALLS.md as critical Pitfall #1.

### Pitfall 2: Z-Index Stacking Context Hell
**What goes wrong:** Floating icon appears behind page elements despite having high z-index.

**Why it happens:** Z-index only works within the same stacking context. A child with z-index: 9999 inside a parent with z-index: 1 will appear below a sibling with z-index: 2.

**How to avoid:**
1. Append container directly to `document.body` (not nested in page elements)
2. Use `z-index: 2147483647` on container
3. Ensure container doesn't create unintended stacking contexts

**Example:**
```typescript
const container = document.createElement('div');
container.id = 'magic-bag-root';
container.style.cssText = 'position: fixed; z-index: 2147483647;';
document.body.appendChild(container); // CRITICAL: Direct child of body
```

**Confidence:** HIGH - Documented in PITFALLS.md as critical Pitfall #3.

### Pitfall 3: Position Loss on Page Navigation
**What goes wrong:** Icon position resets on page reload or SPA navigation.

**Why it happens:** Position not persisted to storage, or storage operations are async and position not saved before navigation.

**How to avoid:**
1. Save position to `chrome.storage.local` on every drag end (use `await`)
2. Restore position on content script initialization
3. Use per-domain storage keys if position should vary by site

**Confidence:** HIGH - Documented in PITFALLS.md as Pitfall #7.

### Pitfall 4: Icon Goes Off-Screen
**What goes wrong:** Dragging icon to screen edges causes it to go partially or fully off-screen.

**Why it happens:** No boundary constraints on drag position, or window resize after positioning.

**How to avoid:**
1. Clamp position to visible viewport bounds
2. Handle window resize events
3. Use `position: fixed` for viewport-relative positioning

**Confidence:** HIGH - Documented in PITFALLS.md as Pitfall #8.

### Pitfall 5: Tailwind Styles Not Applying in Shadow DOM
**What goes wrong:** Tailwind utility classes don't work inside Shadow DOM, resulting in unstyled icon.

**Why it happens:** Tailwind styles need to be injected into the Shadow DOM's style scope, not the main page.

**How to avoid:**
1. Import CSS file in content script: `import './style.css'`
2. Set `cssInjectionMode: 'ui'` in `defineContentScript`
3. WXT automatically injects compiled CSS into shadow root

**Verification:** Test on complex websites (Gmail, Facebook) to ensure isolation works.

**Confidence:** HIGH - Verified in WXT documentation and common extension issue.

## Code Examples

Verified patterns from official sources:

### WXT Content Script with Shadow DOM
```typescript
// entrypoints/content/index.tsx
import './style.css';
import ReactDOM from 'react-dom/client';
import BagIcon from './BagIcon';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui', // Enables Shadow DOM style injection

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'magic-bag',
      position: 'inline',
      anchor: 'body',
      onMount(container) {
        const app = document.createElement('div');
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(<BagIcon />);
        return root;
      },
      onRemove: (root) => root?.unmount(),
    });

    ui.mount();
  },
});
```
**Source:** [WXT Content Scripts - Shadow Root](https://wxt.dev/guide/essentials/content-scripts) - HIGH confidence, official docs verified 2026-03-25.

### WXT Storage for Position
```typescript
// utils/storage.ts
import { storage } from 'wxt/supplements';

export interface IconPosition {
  x: number;
  y: number;
  edge: 'top' | 'right' | 'bottom' | 'left';
}

export const iconPosition = storage.defineItem<IconPosition>('local:iconPosition', {
  fallback: { x: 20, y: window.innerHeight - 68, edge: 'bottom' },
  version: 1,
});
```
**Source:** [WXT Storage Module](https://wxt.dev/storage) - HIGH confidence, official docs.

### WXT Configuration for Permissions
```typescript
// wxt.config.ts
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage', 'activeTab', 'contextMenus', 'tabs', 'unlimitedStorage'],
  },
});
```
**Source:** WXT configuration pattern - HIGH confidence.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| **Manifest V2** | Manifest V3 | June 2025 (Chrome Web Store requirement) | MV2 extensions no longer accepted. WXT generates MV3 manifest automatically. |
| **Manual Shadow DOM setup** | `createShadowRootUi` utility | WXT 0.17+ (2024) | Eliminates boilerplate. Previously required manual `attachShadow`, style injection, isolation logic. |
| **Content script CSS in manifest** | CSS imports in entrypoint | WXT 0.10+ (2023) | Modern approach: `import './style.css'` in content script. WXT bundles and injects automatically. |
| **react-beautiful-dnd** | @dnd-kit/core | 2024 (react-beautiful-dnd abandoned) | react-beautiful-dnd no longer maintained. Use @dnd-kit for Phase 3 tab reordering. |

**Deprecated/outdated:**
- **Manifest V2:** Deprecated. Chrome Web Store stopped accepting new MV2 extensions in 2023. Must migrate by June 2025.
- **react-beautiful-dnd:** Abandoned by maintainers in 2024. Use @dnd-kit/core instead.
- **chrome.storage.sync:** Not suitable for tab data (100KB limit). Use chrome.storage.local with unlimitedStorage permission.

## Open Questions

None. All critical decisions for Phase 1 are locked in CONTEXT.md, and existing research (STACK.md, ARCHITECTURE.md, PITFALLS.md) provides comprehensive guidance.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | WXT framework | ✓ | v24.13.0 | — |
| pnpm | Package manager (recommended) | ✓ | 10.29.2 | npm (available: 11.6.2) |
| npm | Alternative package manager | ✓ | 11.6.2 | — |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None.

All required tools are available. The project can proceed with WXT initialization using pnpm (recommended) or npm as fallback.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | TBD (no existing test infrastructure detected) |
| Config file | None — Wave 0 setup required |
| Quick run command | TBD after framework selection |
| Full suite command | TBD after framework selection |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFR-01 | Extension loads without errors in Edge | smoke | Manual load in `chrome://extensions` | ❌ Wave 0 |
| INFR-02 | Floating icon styles isolated from host page | integration | Visual inspection on Gmail/Facebook | ❌ Wave 0 |
| INFR-03 | Service worker handles privileged API calls | unit | `pytest tests/test_background.py::test_context_menu` - N/A (TypeScript) | ❌ Wave 0 |
| INFR-04 | unlimitedStorage permission in manifest | unit | Manifest validation | ❌ Wave 0 |
| ICON-01 | Icon visible on all web pages | smoke | Manual browse to multiple sites | ❌ Wave 0 |
| ICON-02 | Icon draggable to all 4 edges | integration | Manual drag test + position verification | ❌ Wave 0 |
| ICON-03 | Position persists across reloads | integration | Reload page, verify position unchanged | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test` (after Wave 0 framework setup)
- **Per wave merge:** Full test suite (after Wave 0 framework setup)
- **Phase gate:** Manual smoke test + visual verification on 3+ websites

### Wave 0 Gaps
This is a greenfield project with no existing test infrastructure. Wave 0 tasks should include:
- [ ] Test framework selection and setup (Vitest recommended for TypeScript/React projects)
- [ ] Test configuration files (vitest.config.ts, test setup utilities)
- [ ] Basic smoke tests for extension loading
- [ ] Content script Shadow DOM isolation test
- [ ] Storage read/write tests

**Framework recommendation:** Vitest - Native Vite integration, perfect for WXT projects, TypeScript-first, fast ESM support.

## Sources

### Primary (HIGH confidence)
- [WXT Official Documentation](https://wxt.dev/) - Framework overview, features, getting started
- [WXT Content Scripts Guide](https://wxt.dev/guide/essentials/content-scripts) - Shadow DOM patterns, `createShadowRootUi`, CSS injection (verified 2026-03-25)
- [WXT Storage Module](https://wxt.dev/storage) - Type-safe storage API, versioning, migrations
- [Chrome Extension Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage) - Official chrome.storage.local documentation
- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/) - MV3 requirements, permissions
- [npm package versions](https://www.npmjs.com/) - Verified current versions: wxt@0.20.20, react@19.2.4, react-draggable@4.5.0

### Secondary (MEDIUM confidence)
- [How I Finally Made TailwindCSS Work Inside the Shadow DOM](https://dev.to/dhirajarya01/how-i-finally-made-tailwindcss-work-inside-the-shadow-dom-a-real-case-study-5ggl) - Practical Tailwind + Shadow DOM guide for browser extensions
- [Using Tailwind Classes in The Shadow DOM](https://richardkovacs.dev/blog/using-tailwind-classes-in-the-shadow-dom) - Explains Tailwind utility class challenges in Shadow DOM
- [Is there a way to inject tailwind classes into shadow element](https://stackoverflow.com/questions/77777203/is-there-a-way-to-inject-tailwind-classes-into-shadow-element-so-react-component) - Stack Overflow discussion on Chrome extensions with React + Tailwind

### Tertiary (LOW confidence)
- None - all findings verified against official documentation or existing research documents.

### Existing Research Documents (HIGH confidence)
- `.planning/research/STACK.md` - Comprehensive stack research (verified 2026-03-25)
- `.planning/research/ARCHITECTURE.md` - Architecture patterns and project structure (verified 2026-03-25)
- `.planning/research/PITFALLS.md` - Critical pitfalls and anti-patterns (verified 2026-03-25)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions verified via npm, WXT documentation confirms patterns
- Architecture: HIGH - Based on official WXT documentation and existing ARCHITECTURE.md research
- Pitfalls: HIGH - Comprehensive PITFALLS.md research with verified sources
- Environment availability: HIGH - All tools verified via command-line checks

**Research date:** 2026-03-25
**Valid until:** 2026-04-25 (30 days - WXT framework is stable, versions verified current)

---

*Phase 1 Research: Infrastructure & Floating Icon*
*Researched for: Magic Bag (法宝袋) Browser Extension*
*Next step: Create PLAN.md files based on this research*

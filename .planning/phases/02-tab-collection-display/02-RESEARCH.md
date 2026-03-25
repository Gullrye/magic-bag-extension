# Phase 2: Tab Collection & Display - Research

**Researched:** 2026-03-25
**Domain:** Chrome Extension Development (Context Menus, Tabs API, Storage, React Grid Layout)
**Confidence:** HIGH

## Summary

Phase 2 implements the core "magic bag" functionality: collecting tabs via context menu and displaying them in a chessboard grid. This phase requires integrating three Chrome Extension APIs (contextMenus, tabs, storage) with React components rendered in Shadow DOM.

The primary challenge is the communication flow: context menu actions are handled in the service worker (background), but the grid UI lives in the content script. Two approaches exist: (1) message passing between contexts, or (2) shared storage with watchers. Given WXT's built-in storage module with reactive watchers, **Approach #2 is recommended** — the background script writes to storage, and the content script's storage watcher triggers grid updates.

**Primary recommendation:** Use WXT's `storage.defineItem` with versioning for tab persistence. Implement context menu in background.ts using `chrome.contextMenus.onClicked`. Render grid in Shadow DOM using CSS Grid with auto-fill for responsive cards. Use CSS animations (not Framer Motion) for 300ms scale+fade to avoid adding 40KB+ dependency for two simple transitions.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Context menu text: "将标签页收入法宝袋" (more explicit action)
- **D-02:** No confirmation dialog — collect immediately and show toast notification
- **D-03:** Toast notification appears on successful tab collection
- **D-04:** Grid fills browser viewport, then scrolls for additional tabs
- **D-05:** Default card size: Medium (160x100px) — Claude's discretion on exact sizing
- **D-06:** User customization option for card size — deferred to Phase 3 or future
- **D-07:** Animation: Scale + fade (300ms) — grid expands outward from icon position
- **D-08:** Storage schema per tab: { url, title, favicon, timestamp }
- **D-09:** Prevent duplicate URLs — check before adding, show warning if duplicate detected
- **D-10:** Tab order: Newest first (most recently collected at top)

### Claude's Discretion
- Exact grid spacing and gap values
- Toast notification appearance and duration
- Favicon fallback behavior (what if no favicon available)
- Empty state display (what shows when no tabs collected)
- Maximum storage limits (chrome.storage.local has ~10MB default, unlimitedStorage requested)

### Deferred Ideas (OUT OF SCOPE)
- User-customizable card sizes — noted for future enhancement, would add UI complexity
- Grid view options (list vs grid) — deferred to maintain phase focus
- Tab grouping/categories — belongs in future phase for advanced organization

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| COLL-01 | Right-click context menu "收入法宝袋" on any page | Chrome contextMenus API with onClicked listener in background.ts |
| COLL-02 | Current tab URL, title, and favicon captured and stored | chrome.tabs.query with "tabs" permission + favIconUrl property |
| COLL-03 | Original tab auto-closes after collection | chrome.tabs.remove(tabId) after successful storage |
| COLL-04 | Tab data persists in chrome.storage.local | WXT storage.defineItem with array type, versioning, migrations |
| GRID-01 | Clicking icon reveals tabs in chessboard grid layout | React state toggle + CSS Grid with auto-fill columns |
| GRID-02 | Grid spreads from icon position toward opposite edge | Transform-origin based on icon position + scale animation |
| GRID-03 | Each tab shows favicon + title | TabCard component with <img> favicon and truncated text |
| GRID-04 | Clicking a tab opens the URL in new tab | chrome.tabs.create({ url }) in click handler |
| GRID-05 | Clicking outside grid closes it | Click-outside detection with useEffect + event listener |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **WXT Storage** | 1.2.8 (built-in) | Type-safe storage wrapper | Auto-migrations, watchers, eliminates boilerplate, versioning support |
| **Chrome Context Menus API** | Manifest V3 | Context menu registration | Official Chrome API, requires contextMenus permission |
| **Chrome Tabs API** | Manifest V3 | Tab manipulation (capture, create, remove) | Official Chrome API, requires tabs permission for url/title/favIconUrl |
| **React** | 18.3.1 | UI framework | Already in project from Phase 1, component model ideal for grid |
| **TypeScript** | 5.7.3 | Type safety | Required for tab schema, storage types, API contracts |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **CSS Grid** | Native | Responsive grid layout | Grid fills viewport then scrolls, auto-fill columns |
| **CSS Animations** | Native | Scale+fade transitions | 300ms grid open/close, 150ms toast fade — no library needed |
| **Tailwind CSS** | 4.2.2 | Utility styling | Already configured for Shadow DOM from Phase 1 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Animations | Framer Motion | Framer Motion adds 40KB+ for simple transitions — overkill for 2 animations |
| Shared storage + watchers | Message passing | Message passing adds complexity; storage watchers are simpler and sufficient |
| WXT built-in storage | chrome.storage.local directly | WXT provides type safety, migrations, watchers — worth using |

**Installation:**
```bash
# No new packages needed — all dependencies from Phase 1
# WXT storage module is built-in (@wxt-dev/storage 1.2.8)
# React, TypeScript, Tailwind already installed
```

**Version verification:**
```bash
npm view @wxt-dev/storage version  # 1.2.8 ✓
npm view react version              # 18.3.1 ✓
npm view typescript version         # 5.7.3 ✓
npm view tailwindcss version        # 4.2.2 ✓
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── entrypoints/
│   ├── background.ts          # Context menu registration, onClicked handler
│   ├── content/
│   │   ├── index.tsx          # Shadow DOM root, renders BagIcon + TabGrid
│   │   ├── BagIcon.tsx        # Existing floating icon (add onClick toggle)
│   │   ├── TabGrid.tsx        # NEW: Grid container with chessboard layout
│   │   ├── TabCard.tsx        # NEW: Individual tab card (favicon + title)
│   │   ├── EmptyState.tsx     # NEW: "法宝袋是空的" message
│   │   └── Toast.tsx          # NEW: Success/duplicate warning toasts
│   └── types.ts               # Extend with SavedTab interface
├── utils/
│   ├── storage.ts             # Extend with savedTabs storage item
│   └── clickOutside.ts        # NEW: Hook for click-outside detection
└── tests/
    ├── background.test.ts     # Context menu, tab collection logic
    ├── storage.test.ts        # Tab CRUD operations, duplicate detection
    └── components/
        ├── TabGrid.test.tsx   # Grid rendering, click-outside behavior
        ├── TabCard.test.tsx   # Card rendering, click to open URL
        └── Toast.test.tsx     # Toast animation, auto-dismiss
```

### Pattern 1: Context Menu with Background Handler
**What:** Register context menu in service worker, handle clicks in background script
**When to use:** Need privileged APIs (tabs, storage) from user action
**Example:**
```typescript
// entrypoints/background.ts
export default defineBackground(() => {
  // Register context menu on install
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'save-tab-to-bag',
      title: '将标签页收入法宝袋',
      contexts: ['page'],
    });
  });

  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'save-tab-to-bag') {
      await collectTab(tab);
    }
  });
});

async function collectTab(tab: chrome.tabs.Tab) {
  // Capture tab data
  const tabData: SavedTab = {
    url: tab.url,
    title: tab.title,
    favicon: tab.favIconUrl,
    timestamp: Date.now(),
  };

  // Check for duplicates
  const current = await savedTabs.getValue();
  if (current.some(t => t.url === tabData.url)) {
    // Send warning toast to content script
    chrome.tabs.sendMessage(tab.id, { type: 'duplicate-warning' });
    return;
  }

  // Add to storage (newest-first)
  await savedTabs.setValue([tabData, ...current]);

  // Close original tab
  await chrome.tabs.remove(tab.id);

  // Send success toast to content script
  chrome.tabs.sendMessage(tab.id, { type: 'success-toast' });
}
```
**Source:** [Chrome Context Menus API Documentation](https://developer.chrome.com/docs/extensions/reference/api/contextMenus)

### Pattern 2: Storage with Reactive Watchers
**What:** Define storage item with WXT, watch for changes in content script
**When to use:** Background script updates storage, content script reacts
**Example:**
```typescript
// utils/storage.ts
export interface SavedTab {
  url: string;
  title: string;
  favicon?: string;
  timestamp: number;
}

export const savedTabs = storage.defineItem<SavedTab[]>('local:savedTabs', {
  fallback: [],
  version: 1,
});
```
```typescript
// entrypoints/content/TabGrid.tsx
import { savedTabs } from '~/utils/storage';

export default function TabGrid() {
  const [tabs, setTabs] = useState<SavedTab[]>([]);

  useEffect(() => {
    // Load initial tabs
    savedTabs.getValue().then(setTabs);

    // Watch for storage changes (from background script)
    const unwatch = savedTabs.watch((newTabs) => {
      setTabs(newTabs);
    });

    return () => unwatch();
  }, []);

  return (
    <div className="grid">
      {tabs.map(tab => <TabCard key={tab.url} {...tab} />)}
    </div>
  );
}
```
**Source:** [WXT Storage Documentation](https://wxt.dev/storage)

### Pattern 3: CSS Grid with Auto-Fill
**What:** Responsive grid that fills viewport then scrolls
**When to use:** Unknown number of cards, need responsive layout
**Example:**
```css
.tab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  padding: 24px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
}
```
**Source:** [MDN CSS Grid Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/guide/grid_layout)

### Pattern 4: Click-Outside Detection
**What:** Close dropdown/modal when clicking outside
**When to use:** GRID-05 requirement: click outside grid to close
**Example:**
```typescript
// utils/clickOutside.ts
import { useEffect, RefObject } from 'react';

export function useClickOutside(
  ref: RefObject<HTMLElement>,
  callback: () => void
) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
}
```
```typescript
// entrypoints/content/TabGrid.tsx
const gridRef = useRef<HTMLDivElement>(null);
const [isOpen, setIsOpen] = useState(false);

useClickOutside(gridRef, () => setIsOpen(false));

return isOpen ? (
  <div ref={gridRef} className="tab-grid">
    {tabs.map(tab => <TabCard key={tab.url} {...tab} />)}
  </div>
) : null;
```
**Source:** [Medium: Handling Dropdown/Popup Toggle & Click Outside in React](https://medium.com/@reachayushmishra/handling-dropdown-popup-toggle-click-outside-in-react-the-right-way-cf71468c1285)

### Anti-Patterns to Avoid
- **Message passing for simple updates:** Don't use chrome.runtime.sendMessage for tab updates — storage watchers are simpler and more reliable
- **Inline onclick handlers:** Context menus in service workers can't use inline onclick — must use chrome.contextMenus.onClicked listener
- **Heavy animation libraries:** Don't add Framer Motion (40KB+) for simple scale+fade — CSS animations are sufficient
- **Direct localStorage:** Never use localStorage — it's shared with webpage context, security risk. Always use chrome.storage.local
- **Missing "tabs" permission:** Forgetting "tabs" permission means tab.url, tab.title, tab.favIconUrl will be undefined

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Storage type safety | Manual chrome.storage.local calls | WXT storage.defineItem | Auto-migrations, type safety, watchers, versioning |
| Click-outside detection | Manual event listener logic | useClickOutside hook | Standard pattern, tested, reusable |
| Context menu handling | Custom context menu UI | Chrome contextMenus API | Native browser integration, consistent UX |
| Responsive grid | Manual width calculations | CSS Grid auto-fill | Browser-native, performant, responsive |
| Tab restoration | Manual window.open | chrome.tabs.create | Proper tab management, respects browser settings |

**Key insight:** Chrome Extension APIs provide mature solutions for core problems. Custom implementations reinvent functionality with more bugs and worse UX.

## Common Pitfalls

### Pitfall 1: Missing "tabs" Permission
**What goes wrong:** tab.url, tab.title, and tab.favIconUrl are undefined despite having active tab
**Why it happens:** Chrome restricts sensitive tab properties unless "tabs" permission or host_permissions are declared
**How to avoid:** Always include "tabs" permission in manifest for COLL-02 (COLL-02 requires url, title, favicon)
**Warning signs:** Tab properties are undefined, console shows errors about restricted properties

### Pitfall 2: Context Menu in Content Script
**What goes wrong:** Context menu doesn't appear or throws error
**Why it happens:** chrome.contextMenus API only works in background/service worker, not content scripts
**How to avoid:** Register context menu in entrypoints/background.ts, handle clicks with chrome.contextMenus.onClicked
**Warning signs:** Error "chrome.contextMenus is not defined" in content script console

### Pitfall 3: CSS Bleeding in Shadow DOM
**What goes wrong:** Grid styles affect host page or vice versa
**Why it happens:** Forgetting to inject CSS into Shadow DOM with cssInjectionMode: 'ui'
**How to avoid:** Ensure createShadowRootUi has cssInjectionMode: 'ui' (already configured in Phase 1)
**Warning signs:** Grid layout breaks on certain websites, styles look different on different pages

### Pitfall 4: Storage Quota Exceeded
**What goes wrong:** Error "QUOTA_EXCEEDED_ERR" when saving many tabs
**Why it happens:** chrome.storage.local has ~10MB default limit, though unlimitedStorage was requested
**How to avoid:** Already have unlimitedStorage permission (INFR-04) — should support ~20,000 tabs
**Warning signs:** Tabs stop saving after ~100-200 tabs (would indicate ~10MB limit)

### Pitfall 5: Race Condition in Toast Display
**What goes wrong:** Toast appears before grid updates, or not at all
**Why it happens:** Message sent before storage write completes, or content script not mounted
**How to avoid:** Use storage watchers for grid updates, send toast message after storage.setValue resolves
**Warning signs:** Toast shows but grid doesn't update, or grid updates but toast missing

### Pitfall 6: Favicon Not Available
**What goes wrong:** Tab cards show broken image icon
**Why it happens:** favIconUrl is optional, may be empty string or undefined
**How to avoid:** Implement fallback chain: try favIconUrl → chrome://favicon/{url} → generic globe SVG
**Warning signs:** Many tabs have broken or missing favicon images

## Code Examples

Verified patterns from official sources:

### Context Menu Registration and Handling
```typescript
// Source: https://developer.chrome.com/docs/extensions/reference/api/contextMenus
// entrypoints/background.ts

export default defineBackground(() => {
  // Register on install
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'save-tab-to-bag',
      title: '将标签页收入法宝袋',
      contexts: ['page'],
    });
  });

  // Handle clicks
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'save-tab-to-bag' && tab?.url) {
      await collectTab(tab);
    }
  });
});
```

### Capturing Current Tab Data
```typescript
// Source: https://developer.chrome.com/docs/extensions/reference/api/tabs
// Requires "tabs" permission in manifest

async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Tab object includes: url, title, favIconUrl (with "tabs" permission)
const tab = await getCurrentTab();
const tabData = {
  url: tab.url,
  title: tab.title,
  favicon: tab.favIconUrl,
  timestamp: Date.now(),
};
```

### Storage with Versioning and Migrations
```typescript
// Source: https://wxt.dev/storage
// utils/storage.ts

import { storage } from 'wxt/utils/storage';

export interface SavedTab {
  url: string;
  title: string;
  favicon?: string;
  timestamp: number;
}

export const savedTabs = storage.defineItem<SavedTab[]>('local:savedTabs', {
  fallback: [],
  version: 1,
  // Example: future migration to v2
  // migrations: {
  //   2: (tabs: SavedTabV1[]): SavedTabV2[] => {
  //     return tabs.map(tab => ({ ...tab, id: nanoid() }));
  //   },
  // },
});
```

### CSS Grid Responsive Layout
```css
/* Source: https://developer.mozilla.org/en-US/docs/Web/CSS/guide/grid_layout */
.tab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  padding: 24px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
}
```

### Grid Scale+Fade Animation
```css
/* From UI-SPEC.md decision D-07: 300ms scale+fade */
@keyframes gridOpen {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.grid-opening {
  animation: gridOpen 300ms cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: var(--icon-x) var(--icon-y);
}

@keyframes gridClose {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.8);
    opacity: 0;
  }
}

.grid-closing {
  animation: gridClose 200ms cubic-bezier(0.4, 0, 1, 1);
  transform-origin: var(--icon-x) var(--icon-y);
}
```

### Toast Component with Auto-Dismiss
```typescript
// entrypoints/content/Toast.tsx
import { useEffect, useState } from 'react';

type ToastType = 'success' | 'warning';

export function Toast({ message, type }: { message: string; type: ToastType }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 2000ms
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const bgColor = type === 'success' ? '#3B82F6' : '#EF4444';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: bgColor,
        color: 'white',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 2147483647,
        animation: 'toastFadeIn 150ms ease-out',
      }}
    >
      {message}
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline onclick in contextMenus | chrome.contextMenus.onClicked listener | Manifest V3 (2022) | Service workers can't use inline callbacks — must use event listeners |
| chrome.storage.local directly | WXT storage.defineItem with watchers | WXT 0.19+ (2024) | Type safety, auto-migrations, reactive updates without manual event listeners |
| Manual grid calculations | CSS Grid auto-fill | CSS Grid (2017) | Responsive layouts without JavaScript, better performance |
| CSS animations with JavaScript | Pure CSS animations | CSS Animations (2013) | Better performance, simpler code, no JS runtime overhead |

**Deprecated/outdated:**
- **Manifest V2:** Deprecated as of June 2022, Chrome Web Store no longer accepts new MV2 extensions
- **react-beautiful-dnd:** Abandoned by maintainers in 2024, use @dnd-kit/core (deferred to Phase 3)
- **chrome://favicon/ protocol:** Deprecated but still works as fallback, prefer favIconUrl from Tabs API

## Open Questions

1. **Favicon fallback for data URLs and special schemes**
   - What we know: favIconUrl may be empty for data URLs, chrome:// URLs, or file:// URLs
   - What's unclear: Best fallback icon for these edge cases
   - Recommendation: Use generic globe SVG (specified in UI-SPEC.md) for all missing favicons

2. **Maximum tabs before performance degradation**
   - What we know: CSS Grid handles 100+ cards well, React.memo prevents unnecessary re-renders
   - What's unclear: At what tab count does rendering slow down noticeably
   - Recommendation: Test with 100, 500, 1000 tabs — implement virtual scrolling if >100 tabs (deferred to Phase 3)

3. **Toast message passing reliability**
   - What we know: Background script can send messages to content script via chrome.tabs.sendMessage
   - What's unclear: What happens if content script isn't mounted when message sent (e.g., page still loading)
   - Recommendation: Use storage watchers for grid updates (reliable), use try/catch for toast messages with fallback logging

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Chrome Extension APIs | Context menu, tabs, storage | ✓ | Manifest V3 | — |
| WXT Storage Module | Tab persistence | ✓ | 1.2.8 (built-in) | chrome.storage.local directly |
| React | UI components | ✓ | 18.3.1 | — |
| TypeScript | Type safety | ✓ | 5.7.3 | — |
| Tailwind CSS | Styling | ✓ | 4.2.2 | — |
| Vitest | Testing | ✓ | 4.1.1 | — |

**Missing dependencies with no fallback:** None — all required dependencies available

**Missing dependencies with fallback:** None — all dependencies present

**Step 2.6: COMPLETE** — All external dependencies verified and available. No blocking issues.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.1 + React Testing Library |
| Config file | vitest.config.ts |
| Quick run command | `pnpm test --run tests/background.test.ts` |
| Full suite command | `pnpm test:run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| COLL-01 | Context menu appears on right-click | integration | `pnpm test --run tests/background.test.ts -t "context menu"` | ❌ Wave 0 |
| COLL-02 | Tab URL, title, favicon captured | unit | `pnpm test --run tests/background.test.ts -t "capture tab"` | ❌ Wave 0 |
| COLL-03 | Original tab closes after collection | integration | `pnpm test --run tests/background.test.ts -t "close tab"` | ❌ Wave 0 |
| COLL-04 | Tab data persists in storage | unit | `pnpm test --run tests/storage.test.ts -t "save tab"` | ❌ Wave 0 |
| GRID-01 | Icon click toggles grid | unit | `pnpm test --run tests/components/TabGrid.test.tsx -t "toggle grid"` | ❌ Wave 0 |
| GRID-02 | Grid spreads from icon position | unit | `pnpm test --run tests/components/TabGrid.test.tsx -t "grid position"` | ❌ Wave 0 |
| GRID-03 | Tab card shows favicon + title | unit | `pnpm test --run tests/components/TabCard.test.tsx -t "render card"` | ❌ Wave 0 |
| GRID-04 | Click card opens URL in new tab | integration | `pnpm test --run tests/components/TabCard.test.tsx -t "open tab"` | ❌ Wave 0 |
| GRID-05 | Click outside closes grid | unit | `pnpm test --run tests/components/TabGrid.test.tsx -t "click outside"` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test --run tests/{relevant-module}.test.ts`
- **Per wave merge:** `pnpm test:run` (full suite)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/background.test.ts` — Context menu registration, tab collection logic, duplicate detection
- [ ] `tests/storage.test.ts` — Tab CRUD operations, duplicate prevention, newest-first ordering
- [ ] `tests/components/TabGrid.test.tsx` — Grid rendering, toggle state, click-outside behavior
- [ ] `tests/components/TabCard.test.tsx` — Card rendering, click to open URL, favicon fallback
- [ ] `tests/components/Toast.test.tsx` — Toast appearance, auto-dismiss, success/warning variants
- [ ] `tests/utils/clickOutside.test.ts` — Click-outside hook logic
- [ ] Framework mocks: Extend `tests/setup.ts` with chrome.contextMenus mock

## Sources

### Primary (HIGH confidence)
- [WXT Storage Documentation](https://wxt.dev/storage) - Storage module with defineItem, watchers, versioning (published 2024-12-12)
- [Chrome Context Menus API](https://developer.chrome.com/docs/extensions/reference/api/contextMenus) - Context menu creation and onClicked handling (updated 2026-01-07)
- [Chrome Tabs API](https://developer.chrome.com/docs/extensions/reference/api/tabs) - Tab manipulation, query, create, remove (updated 2026-03-03)
- [MDN CSS Grid Layout Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/guide/grid_layout) - CSS Grid patterns and best practices
- [WXT Messaging Guide](https://wxt.dev/guide/essentials/messaging) - Communication patterns between contexts (published 2025-02-13)

### Secondary (MEDIUM confidence)
- [Medium: Handling Dropdown/Popup Toggle & Click Outside in React](https://medium.com/@reachayushmishra/handling-dropdown-popup-toggle-click-outside-in-react-the-right-way-cf71468c1285) - Click-outside detection pattern
- [Dev.to: Responsive Card Layout with CSS Grid](https://dev.to/m97chahboun/responsive-card-layout-with-css-grid-a-step-by-step-guide-3ej1) - CSS Grid practical implementation
- [Motion.dev: React Transitions](https://motion.dev/docs/react-transitions) - Default duration 0.3s (300ms) for animations
- [Stack Overflow: Chrome Extension Notifications from Content Script](https://stackoverflow.com/questions/15178550/trigger-chrome-extension-notifications-from-content-script) - Toast notification approaches

### Tertiary (LOW confidence)
- [Medium: Build Chrome Extensions with React and Vite in 2025](https://arg-software.medium.com/building-a-chrome-extension-with-react-and-vite-a-modern-developers-guide-83f98ee937ed) - General Chrome extension patterns (not verified against official docs)
- [Daily.dev: React Hot Toast Integration](https://daily.dev/blog/create-smoking-hot-toast-notifications-in-react-with-react-hot-toast) - Toast library alternative (not needed — CSS animations sufficient)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All packages verified via npm view, official docs reviewed
- Architecture: HIGH - Chrome API patterns from official documentation, WXT patterns from official docs
- Pitfalls: HIGH - Based on common Chrome extension mistakes documented in official guides and community resources

**Research date:** 2026-03-25
**Valid until:** 2026-04-24 (30 days — stable APIs, minimal changes expected)

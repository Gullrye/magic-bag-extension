# Architecture Research

**Domain:** Browser Extension with Floating UI Overlay (Chromium/Manifest V3)
**Researched:** 2026-03-25
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
+-------------------------------------------------------------------------+
|                        Browser Environment                               |
+-------------------------------------------------------------------------+
|  +------------------+     +------------------+                          |
|  |  Service Worker  |     |   Popup/Options  |                          |
|  |  (Background)    |     |   (Extension UI) |                          |
|  +--------+---------+     +--------+---------+                          |
|           |                        |                                    |
|           | chrome.runtime         | chrome.runtime                     |
|           | sendMessage()          | sendMessage()                      |
|           v                        v                                    |
|  +--------+------------------------+---------+                          |
|  |              Message Bus                   |                          |
|  +--------------------+----------------------+                          |
|                       |                                                 |
|                       | chrome.tabs.sendMessage() / connect()           |
|                       v                                                 |
|  +--------------------+----------------------------------------------+  |
|  |                    Content Script                                |  |
|  |  +------------------------+  +-------------------------------+   |  |
|  |  |    Shadow DOM Root     |  |     Content Script Logic     |   |  |
|  |  |  +------------------+  |  |  - Message handling          |   |  |
|  |  |  |  Floating UI     |  |  |  - Position management       |   |  |
|  |  |  |  - Bag Icon      |  |  |  - Drag behavior             |   |  |
|  |  |  |  - Tab Grid      |  |  |  - State sync w/ background  |   |  |
|  |  |  |  - Controls      |  |  |                               |   |  |
|  |  |  +------------------+  |  |                               |   |  |
|  |  +------------------------+  +-------------------------------+   |  |
|  +-----------------------------------------------------------------+  |
|                                                                         |
|  +-----------------------------------------------------------------+  |
|  |                      Host Page DOM                              |  |
|  |              (Isolated from extension UI)                        |  |
|  +-----------------------------------------------------------------+  |
+-------------------------------------------------------------------------+

+-------------------------------------------------------------------------+
|                        Data Layer                                       |
+-------------------------------------------------------------------------+
|  +-----------------------------------------------------------------+   |
|  |                 chrome.storage.local                            |   |
|  |              (Persisted tab data, settings)                     |   |
|  +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **manifest.json** | Extension configuration, permissions, entry points | JSON config file |
| **Service Worker** | Background logic, event handling, API access, context menus | JavaScript/TypeScript module |
| **Content Script** | UI injection, DOM interaction, user interactions | JavaScript/TypeScript with Shadow DOM |
| **Shadow DOM Container** | Style isolation for injected UI | `element.attachShadow({mode: 'open'})` |
| **Floating UI** | Bag icon, tab grid, controls | HTML/CSS/JS inside Shadow DOM |
| **chrome.storage.local** | Persistent data storage | Chrome Extension API |
| **Context Menu** | Right-click "collect tab" action | chrome.contextMenus API |

## Recommended Project Structure

```
src/
├── manifest.json              # Extension configuration
├── background/                # Service worker (background script)
│   └── index.ts              # Entry point for service worker
│       ├── contextMenu.ts    # Context menu setup/handlers
│       ├── tabManager.ts     # Tab collection/opening logic
│       └── storage.ts        # Storage operations
├── content/                   # Content script (injected into pages)
│   ├── index.ts              # Content script entry point
│   ├── ui/                   # UI components (inside Shadow DOM)
│   │   ├── container.ts      # Shadow DOM container setup
│   │   ├── bagIcon.ts        # Floating bag icon component
│   │   ├── tabGrid.ts        # Tab grid display component
│   │   └── controls.ts       # Search, delete, clear controls
│   ├── styles/               # CSS for Shadow DOM
│   │   └── main.css          # Isolated styles
│   └── lib/                  # Content script utilities
│       ├── drag.ts           # Drag behavior implementation
│       ├── position.ts       # Position persistence/restoration
│       └── messaging.ts      # Background communication
├── popup/                    # Optional: browser action popup
│   ├── index.html
│   └── popup.ts
├── options/                  # Optional: extension options page
│   ├── index.html
│   └── options.ts
├── shared/                   # Shared code between contexts
│   ├── types.ts              # TypeScript interfaces
│   ├── constants.ts          # Shared constants
│   └── messages.ts           # Message type definitions
├── assets/                   # Static assets
│   ├── icons/                # Extension icons
│   └── images/               # UI images
└── public/                   # Build output directory
```

### Structure Rationale

- **background/**: Service worker handles all privileged API calls (tabs, contextMenus, storage). Cannot access DOM.
- **content/**: Contains all code that runs in the context of web pages. Uses Shadow DOM for isolation.
- **ui/**: Components live inside Shadow DOM, completely isolated from page styles.
- **shared/**: Types and constants used by both background and content scripts.
- **assets/**: Static files bundled with the extension.

## Architectural Patterns

### Pattern 1: Shadow DOM for Style Isolation

**What:** Encapsulate all injected UI inside a Shadow DOM root to prevent CSS conflicts with host pages.

**When to use:** Always for content script UI. Required for any extension injecting visual elements.

**Trade-offs:**
- Pros: Complete CSS isolation, predictable styling, no conflicts with page styles
- Cons: Slightly more complex setup, need to inject styles programmatically

**Example:**
```typescript
// content/index.ts
function createUI() {
  // Create container element attached to page
  const container = document.createElement('div');
  container.id = 'magic-bag-root';
  document.body.appendChild(container);

  // Attach Shadow DOM for isolation
  const shadow = container.attachShadow({ mode: 'open' });

  // Inject styles into shadow DOM
  const style = document.createElement('style');
  style.textContent = `
    :host {
      all: initial;
      font-family: -apple-system, sans-serif;
    }
    /* All extension styles here */
  `;
  shadow.appendChild(style);

  // Build UI inside shadow
  const bagIcon = createBagIcon();
  shadow.appendChild(bagIcon);

  return { shadow, container };
}
```

### Pattern 2: Background as API Gateway

**What:** Content scripts delegate all privileged operations to the service worker via messaging. Background handles all Chrome API calls.

**When to use:** Always in Manifest V3. Content scripts have limited API access.

**Trade-offs:**
- Pros: Clear separation of concerns, security, proper permission handling
- Cons: Async messaging overhead, more boilerplate code

**Example:**
```typescript
// shared/messages.ts
export type MessageType =
  | { type: 'COLLECT_TAB'; payload: { tabId: number; url: string; title: string; favIconUrl?: string } }
  | { type: 'OPEN_TAB'; payload: { url: string } }
  | { type: 'GET_STORED_TABS' }
  | { type: 'DELETE_TAB'; payload: { id: string } }
  | { type: 'CLEAR_ALL' };

// content/lib/messaging.ts
export async function sendMessage<T>(message: MessageType): Promise<T> {
  return chrome.runtime.sendMessage(message);
}

// background/index.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message).then(sendResponse);
  return true; // Keep channel open for async response
});
```

### Pattern 3: Position Persistence with Storage

**What:** Save floating icon position to chrome.storage.local so it persists across page reloads and browser sessions.

**When to use:** For any draggable/floating UI element that users can reposition.

**Trade-offs:**
- Pros: Consistent UX, remembers user preference
- Cons: Small storage overhead, async reads on page load

**Example:**
```typescript
// content/lib/position.ts
interface Position { x: number; y: number; edge: 'top' | 'right' | 'bottom' | 'left' }

export async function savePosition(pos: Position) {
  await chrome.storage.local.set({ bagPosition: pos });
}

export async function loadPosition(): Promise<Position> {
  const { bagPosition } = await chrome.storage.local.get('bagPosition');
  return bagPosition ?? { x: 20, y: 20, edge: 'right' };
}
```

### Pattern 4: Context Menu Integration

**What:** Use chrome.contextMenus API to add "Collect Tab" option to right-click menu. Background handles menu creation and click events.

**When to use:** When you want a quick action accessible from anywhere on the page.

**Trade-offs:**
- Pros: Native feel, always accessible, no UI clutter
- Cons: Limited to one action per menu item, requires background script

**Example:**
```typescript
// background/contextMenu.ts
export function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'collect-tab',
    title: 'Collect Tab to Magic Bag',
    contexts: ['page', 'link']
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'collect-tab' && tab?.id) {
    collectTab(tab);
  }
});
```

## Data Flow

### Collect Tab Flow

```
[User right-clicks page]
    |
    v
[Context Menu "Collect Tab"]
    |
    v
[Background: contextMenus.onClicked]
    |
    +-- Get tab info (url, title, favicon)
    |
    +-- Save to chrome.storage.local
    |
    +-- Close original tab (chrome.tabs.remove)
    |
    v
[Content Script: storage.onChanged listener]
    |
    +-- Update UI with new tab
    |
    v
[Bag icon shows updated count]
```

### Open Tab Flow

```
[User clicks tab in grid]
    |
    v
[Content Script: click handler]
    |
    +-- Send message { type: 'OPEN_TAB', url }
    |
    v
[Background: runtime.onMessage]
    |
    +-- chrome.tabs.create({ url })
    |
    +-- Remove tab from storage
    |
    v
[Tab opens in browser]
```

### State Synchronization

```
[chrome.storage.local]
    |
    | (storage.onChanged event)
    v
[Content Script] <------> [Background Service Worker]
    |                            |
    | Update UI                  | Handle API calls
    |                            |
    +----------------------------+
```

### Key Data Flows

1. **Tab Collection:** Context menu -> Background -> Storage -> Content Script UI update
2. **Tab Opening:** Content Script click -> Background -> chrome.tabs.create
3. **Position Save:** Content Script drag end -> Storage
4. **Import/Export:** Popup/Content Script -> Background -> Storage read/write

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-100 tabs | Direct storage reads, simple array storage |
| 100-1000 tabs | Consider lazy loading in grid, virtualized list |
| 1000+ tabs | Pagination, search optimization, consider IndexedDB |

### Scaling Priorities

1. **First bottleneck:** Tab grid rendering with many items. Use virtual scrolling or pagination.
2. **Second bottleneck:** Storage read performance. Consider caching in memory with storage as backing.

## Anti-Patterns

### Anti-Pattern 1: Direct DOM Manipulation Without Shadow DOM

**What people do:** Inject UI elements directly into page DOM without Shadow DOM isolation.

**Why it's wrong:** Page styles bleed into extension UI, extension styles affect page, z-index conflicts, broken layouts on some websites.

**Do this instead:** Always use Shadow DOM for content script UI.

### Anti-Pattern 2: Storing Full Page Content

**What people do:** Store page HTML/screenshot/thumbnail for each collected tab.

**Why it's wrong:** Storage quota exceeded quickly, slow reads/writes, unnecessary data.

**Do this instead:** Store only URL, title, and favicon URL. The actual page can be reloaded.

### Anti-Pattern 3: Blocking the Main Thread

**What people do:** Synchronous operations, heavy DOM manipulation during drag/animation.

**Why it's wrong:** Makes host page feel sluggish, bad UX, users blame the website.

**Do this instead:** Use CSS transforms for animations, requestAnimationFrame for smooth dragging, debounce frequent operations.

### Anti-Pattern 4: Assuming Single Content Script Instance

**What people do:** Global variables in content script without considering multiple frames/iframes.

**Why it's wrong:** Content scripts run in each frame. Can create duplicate UIs.

**Do this instead:** Check if UI already exists before creating, or restrict to top frame only.

```typescript
// Only inject into top frame
if (window.self === window.top) {
  createUI();
}
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Favicon | Direct URL reference | Use `chrome://favicon/` or site's favicon URL |
| Edge Add-ons | Submit via dashboard | Required for distribution |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Background <-> Content Script | chrome.runtime.sendMessage / onMessage | One-off messages for actions |
| Background <-> Content Script | chrome.tabs.sendMessage | Target specific tab |
| Background <-> Popup | chrome.runtime.sendMessage | Same as content script |
| Content Script <-> Storage | chrome.storage.local | Direct access, shared state |
| Background <-> Storage | chrome.storage.local | Direct access, shared state |

## Build Order Implications

Based on component dependencies, recommended implementation order:

1. **Phase 1: Core Infrastructure**
   - manifest.json with permissions
   - Service worker skeleton
   - Content script with Shadow DOM container
   - Basic messaging between background and content

2. **Phase 2: Tab Collection**
   - Context menu setup
   - Storage schema and operations
   - Tab collection logic (background)
   - Basic UI showing collected tabs

3. **Phase 3: UI Polish**
   - Floating bag icon with drag
   - Position persistence
   - Tab grid layout
   - Chinese visual style (国风)

4. **Phase 4: Tab Management**
   - Tab opening
   - Search/filter
   - Delete individual tabs
   - Clear all

5. **Phase 5: Data Portability**
   - Export to JSON
   - Import from JSON

## Sources

- [Chrome Extensions Architecture Overview](https://developer.chrome.com/docs/extensions/mv3/architecture-overview/) - Official Chrome documentation
- [MDN Content Scripts](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts) - Comprehensive content script reference
- [Shadow DOM Style Isolation](https://stackoverflow.com/questions/28809381/injecting-chrome-extension-ui-using-shadow-dom) - Stack Overflow discussion
- [Using Shadow DOM in Browser Extensions](https://4real.ltd/blogs/shadowdom-in-browser-extension/) - Practical tutorial with React + Vite
- [Chrome Extension Tools Discussions](https://github.com/crxjs/chrome-extension-tools/discussions/910) - Shadow DOM style isolation patterns

---
*Architecture research for: Browser Extension with Floating UI Overlay*
*Researched: 2026-03-25*

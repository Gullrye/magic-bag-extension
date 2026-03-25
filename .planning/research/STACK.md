# Stack Research

**Domain:** Chromium/Edge Browser Extension with Floating UI Overlay
**Researched:** 2025-03-25
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **WXT** | 0.20.x | Extension Build Framework | Leading browser extension framework in 2025. Built on Vite with best-in-class DX: HMR for content scripts, auto-imports, automatic manifest management, cross-browser support. Eliminates boilerplate so you focus on features. |
| **Manifest V3** | 3 | Chrome Extension Manifest | Mandatory as of June 2025. Chrome Web Store no longer accepts new MV2 extensions. Required for publishing. |
| **TypeScript** | 5.x | Type Safety | First-class support in WXT. Essential for maintaining a codebase with storage types, message passing, and API contracts. Catches errors at compile time. |
| **React** | 18.x | UI Framework | Mature ecosystem, excellent WXT integration. For this project's complexity (floating draggable UI, grid layout, search filtering), React's component model and hooks are ideal. WXT provides React templates out of the box. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@wxt-dev/storage** | 1.2.x | Storage Abstraction | Built into WXT. Simplifies chrome.storage.local with type-safe API, watchers, versioning, and migrations. Essential for storing saved tabs. |
| **Tailwind CSS** | 4.x / 3.4.x | Styling | Rapid UI development with utility classes. Works with Shadow DOM (requires configuration). Perfect for the "Chinese traditional style" visual design with custom color palette. |
| **react-draggable** | 4.x | Floating Icon Drag | Lightweight (8KB) library for making the floating bag icon draggable. Simple API, position memory support. Exactly what's needed for the draggable floating UI requirement. |
| **@dnd-kit/core** | 6.x | Tab Reordering | Modern, accessible drag-and-drop for reordering tabs within the grid. Smaller footprint than react-beautiful-dnd (now abandoned). Use for the "drag to sort" feature. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **pnpm** | Package Manager | Recommended by WXT docs. Fast, disk-efficient. Use `pnpm dlx wxt@latest init` to bootstrap. |
| **Vite** | Build Tool (via WXT) | WXT is built on Vite. No separate configuration needed. Provides fast HMR during development. |
| **Chrome DevTools** | Debugging | Standard for extension debugging. Use `chrome://extensions` with developer mode. |

## Installation

```bash
# Bootstrap new project with React + TypeScript
pnpm dlx wxt@latest init magic-bag --template react

cd magic-bag

# Add supporting libraries
pnpm add react-draggable @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Tailwind CSS (if not included in template)
pnpm add -D tailwindcss postcss autoprefixer
pnpm dlx tailwindcss init -p
```

## Project Structure (WXT Convention)

```
magic-bag/
  entrypoints/
    background.ts          # Service worker, context menus
    content/               # Content script for floating UI
      index.tsx            # Main content script with Shadow DOM UI
      style.css            # Tailwind styles (injected into Shadow DOM)
      BagIcon.tsx          # Floating draggable icon component
      TabGrid.tsx          # Grid display of saved tabs
  components/              # Shared React components
  utils/
    storage.ts             # WXT storage definitions for tabs
  public/
    icon.png               # Extension icon
  wxt.config.ts            # WXT configuration
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **WXT** | Plasmo | If you prefer more opinionated defaults and React-first approach. WXT is more framework-agnostic and lighter. |
| **WXT** | CRXJS | If you have an existing Vite project and just need extension support. WXT provides more extension-specific utilities. |
| **WXT** | Vanilla (no framework) | For trivial extensions (< 100 lines). Not worth it for this project's complexity. |
| **React** | Vue 3 | If team has Vue expertise. Vue has ~19% faster startup time, but React's ecosystem is larger. |
| **React** | Svelte | For smallest bundle size. Svelte compiles away at build time. Consider if performance is critical. |
| **Tailwind** | CSS Modules | If you prefer scoped CSS without utility classes. More verbose for rapid development. |
| **react-draggable** | Native Drag API | If bundle size is critical and you only need simple dragging. More code to write and maintain. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Manifest V2** | Deprecated. Chrome Web Store stopped accepting new MV2 extensions in 2023. Must migrate by June 2025. | Manifest V3 |
| **react-beautiful-dnd** | Abandoned by maintainers. No longer maintained as of 2024. | @dnd-kit/core |
| **localStorage** | Not extension-safe. Data is shared with webpage context, security risks. | chrome.storage.local via @wxt-dev/storage |
| **jQuery** | Outdated for modern extensions. Adds ~30KB for functionality native JS handles. | React + native DOM APIs |
| **Injected CSS without Shadow DOM** | Styles leak to/from host page. Breaks on sites with aggressive CSS. | Shadow DOM with createShadowRootUi |
| **Web Accessible Resources for sensitive data** | Any webpage can load these resources. Security risk. | Keep sensitive logic in background/content scripts |

## Key Architecture Patterns

### Shadow DOM for Style Isolation

The floating UI must not be affected by host page styles. WXT provides `createShadowRootUi`:

```typescript
// entrypoints/content/index.tsx
import './style.css';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'magic-bag',
      position: 'inline',
      anchor: 'body',
      onMount(container) {
        const root = ReactDOM.createRoot(container);
        root.render(<App />);
        return root;
      },
      onRemove: (root) => root?.unmount(),
    });

    ui.mount();
  },
});
```

### Storage Pattern

Use WXT's typed storage with versioning for saved tabs:

```typescript
// utils/storage.ts
interface SavedTab {
  id: string;
  url: string;
  title: string;
  faviconUrl?: string;
  savedAt: number;
}

export const savedTabs = storage.defineItem<SavedTab[]>('local:savedTabs', {
  fallback: [],
  version: 1,
});
```

### Context Menu Pattern

```typescript
// entrypoints/background.ts
export default defineBackground(() => {
  chrome.contextMenus.create({
    id: 'save-to-bag',
    title: 'Save to Magic Bag',
    contexts: ['page', 'tab'],
  });

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'save-to-bag' && tab?.url) {
      // Save tab, then close it
      await savedTabs.setValue([...current, newTab]);
      chrome.tabs.remove(tab.id);
    }
  });
});
```

## Version Compatibility

| Package | Version | Compatible With | Notes |
|---------|---------|-----------------|-------|
| WXT | 0.20.x | React 18, Vue 3, Svelte 5 | All templates tested |
| @wxt-dev/storage | 1.2.x | WXT 0.19+ | Built-in, no separate install needed |
| React | 18.x | WXT React template | Use `--template react` when init |
| Tailwind | 4.x / 3.4.x | Shadow DOM with config | Requires `cssInjectionMode: 'ui'` |

## Tailwind with Shadow DOM Configuration

Tailwind styles need to be injected into the Shadow DOM:

```typescript
// wxt.config.ts
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage', 'activeTab', 'contextMenus', 'tabs'],
  },
});
```

```css
/* entrypoints/content/style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom Chinese traditional theme */
:root {
  --color-primary: #8B4513;    /* Saddle brown */
  --color-secondary: #D4AF37;  /* Gold */
  --color-accent: #CD5C5C;     /* Indian red */
}
```

## Sources

- [WXT Official Documentation](https://wxt.dev/) — HIGH confidence, official source
- [WXT Content Scripts Guide](https://wxt.dev/guide/essentials/content-scripts) — HIGH confidence, official docs
- [WXT Storage Module](https://wxt.dev/storage) — HIGH confidence, official docs
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage) — HIGH confidence, official Chrome docs
- [2025 State of Browser Extension Frameworks](https://redreamality.com/blog/the-2025-state-of-browser-extension-frameworks-a-comparative-analysis-of-plasmo-wxt-and-crxjs/) — MEDIUM confidence, third-party comparison
- [Reddit: Best Framework for Browser Extensions 2025](https://www.reddit.com/r/chrome_extensions/comments/1pqngda/best_framework_to_build_browser_extensions_in/) — MEDIUM confidence, community consensus
- [Tailwind with Shadow DOM Guide](https://dev.to/dhirajarya01/how-i-finally-made-tailwindcss-work-inside-the-shadow-dom-a-real-case-study-5gkl) — MEDIUM confidence, practical case study
- [React Drag and Drop Libraries 2025](https://zoer.ai/posts/zoer/best-react-drag-drop-libraries-comparison) — MEDIUM confidence, comparison article
- [Chrome Extension Best Practices](https://developer.chrome.com/docs/webstore/best-practices) — HIGH confidence, official Chrome docs

---
*Stack research for: Chromium/Edge Browser Extension with Floating UI*
*Researched: 2025-03-25*

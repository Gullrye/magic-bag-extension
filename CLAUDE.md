<!-- GSD:project-start source:PROJECT.md -->
## Project

**法宝袋 (Magic Bag)**

一款 Edge 浏览器扩展，提供一个可拖拽的悬浮图标"法宝袋"。用户可以将浏览器标签页"收入"袋中，标签像棋子一样在棋盘上铺开展示。点击袋中的标签可以重新打开网页。帮助用户整理和管理大量打开的标签页，保持浏览器清爽。

**Core Value:** **一键收纳标签页，让浏览器保持清爽。** 用户不再需要几十个标签页挤在浏览器顶部，所有暂时不看但又不想关闭的页面都可以收入法宝袋。

### Constraints

- **浏览器**: Microsoft Edge (Chromium 扩展)
- **存储**: chrome.storage.local，本地存储
- **权限**: activeTab, contextMenus, storage, tabs
- **数量**: 不限制标签数量，但需要考虑大量标签时的性能
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

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
# Bootstrap new project with React + TypeScript
# Add supporting libraries
# Tailwind CSS (if not included in template)
## Project Structure (WXT Convention)
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
### Storage Pattern
### Context Menu Pattern
## Version Compatibility
| Package | Version | Compatible With | Notes |
|---------|---------|-----------------|-------|
| WXT | 0.20.x | React 18, Vue 3, Svelte 5 | All templates tested |
| @wxt-dev/storage | 1.2.x | WXT 0.19+ | Built-in, no separate install needed |
| React | 18.x | WXT React template | Use `--template react` when init |
| Tailwind | 4.x / 3.4.x | Shadow DOM with config | Requires `cssInjectionMode: 'ui'` |
## Tailwind with Shadow DOM Configuration
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
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

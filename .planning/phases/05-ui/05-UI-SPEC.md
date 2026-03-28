---
phase: 5
slug: ui
status: approved
shadcn_initialized: false
preset: none
created: 2026-03-27
reviewed_at: 2026-03-28
---

# Phase 5 — UI Design Contract

> Full visual rewrite contract for the browser extension UI. Updated to reflect the 2026-03-28 restyle direction and implementation.

---

## Design Direction

| Property | Value |
|----------|-------|
| Aesthetic | 国风器物感 / 漆匣收藏系统 |
| Mood | 沉稳珍藏 |
| Visual language | 深漆红、旧金、温纸白、墨棕 |
| Product metaphor | 法宝袋打开后像“藏页匣”，而不是普通浏览器工具弹层 |
| Motion | 克制、短促、有仪式感，避免轻浮炫技 |

**Intent:** The extension should feel like a coherent product system. Content script UI and options page must share one visual language instead of looking like separate tools.

---

## Scope

This phase now covers a **full restyle**, not a local polish pass:

- Floating trigger visual treatment
- Tab panel shell, header, body, search area, action area
- Tab card structure and styling
- Empty state, toast, confirm dialog
- Options page layout and styling
- Theme variables and CSS custom properties for the new UI system

Out of scope:

- Storage schema changes
- Chrome messaging changes
- Core behaviors such as drag, open tab, delete, reorder, import/export

---

## Layout Contract

### Floating Trigger

- Keep the draggable pouch icon behavior
- Present it as a collectible hanging artifact with a subtle halo
- Add a small badge to reinforce the “收纳/藏页” identity
- On viewport resize/zoom, icon position must be refit into the visible viewport and persisted

### Main Panel

- Panel remains a fixed overlay in the content script
- Desktop target width should support **6 cards per row**
- Internal shell must never overflow its parent container
- Scroll belongs to the panel body, not the host webpage
- Panel opens from the floating trigger using transform-origin based animation

### Grid

Desktop and responsive column rules:

| Breakpoint | Columns |
|------------|---------|
| default desktop | 6 |
| <= 1200px | 5 |
| <= 960px | 4 |
| <= 640px | 2 |
| <= 520px | 1 |

---

## Visual System

### Theme Tokens

Use CSS variables instead of scattered utility-only styling.

| Token Role | Value |
|-----------|-------|
| Background paper | `#f4ead7` / `#f8f1e2` |
| Lacquer primary | `#6f1d1b` |
| Lacquer deep | `#45100f` |
| Gold accent | `#b98a38` |
| Main text | `#2d2118` |
| Secondary text | `#6f5d4b` |

### Materials

- Surfaces should feel like layered lacquer and warm paper, not flat browser UI
- Borders should use thin warm lines and gold inner trims instead of generic gray strokes
- Depth should come from restrained shadow stacks and soft internal highlights
- Decorative atmosphere may include subtle radial glows, grain, or linear texture, but must stay quiet

### Typography

Use a serif-led stack to avoid default utility-app tone:

- `"Iowan Old Style"`
- `"Palatino Linotype"`
- `"Noto Serif SC"`
- `"Songti SC"`
- `serif`

Typography roles:

| Role | Size | Weight |
|------|------|--------|
| Panel title | 34px | 700 |
| Card title | 18px | 700 |
| Body copy | 14-15px | 400-500 |
| Eyebrow labels | 11-12px | 700 |

---

## Component Contract

### Trigger

- Class namespace: `magic-bag-trigger*`
- Must expose hover/dragging state via attributes for CSS styling
- Decorative halo is presentational only

### Panel

- Class namespace: `magic-bag-panel*`
- Use a shell/surface structure
- Header includes:
  - eyebrow
  - title
  - supporting description
  - search field
  - result count
  - destructive action
- Body owns scrolling and must contain overscroll

### Search

- Search input is embedded in a lacquer/paper control, not a default input field
- Placeholder copy: `检索标题或网址`
- Search filtering remains real-time

### Card

- Class namespace: `magic-bag-card*`
- Card metaphor is “藏签 / 收纳札记”
- Each card contains:
  - favicon seal area
  - hostname
  - collected date
  - title
  - URL excerpt
- Delete action stays secondary and appears on hover/focus
- Drag reordering behavior remains intact

### Empty State

- Copy should feel like a calm archive message instead of a generic system empty state
- Current contract:
  - title: `匣中暂无藏页`
  - body: `在任意页面点击法宝袋，即可把眼前页签收入此匣，稍后再慢慢翻看。`

### Toast

- Toast should resemble a short annotation slip, not a system snackbar
- Use a leading status dot instead of solid colored rectangular fills

### Confirm Dialog

- Dialog should look like a small ritual box / paper seal confirmation
- Must remain clearly destructive without breaking visual consistency

### Options Page

- Must match the same theme system as the content script panel
- Hero area introduces “藏阁整备”
- Import/export appear as paired cards in one system
- Add a small explanatory note section below

---

## Interaction Contract

- Dragging trigger persists position
- Trigger must remain visible after viewport resize or zoom
- Panel body scroll must not scroll the underlying page
- Search filters by title and URL
- Reordering works only when not filtering
- Delete removes an item immediately and persists storage
- Clear all opens confirm dialog before destructive action
- Import/export remain unchanged functionally

---

## Copywriting Contract

### Content Script

| Element | Copy |
|---------|------|
| Panel title | `藏页匣` |
| Panel description | `收拢当下分心的页面，像题签一样安稳归档。` |
| Search placeholder | `检索标题或网址` |
| Clear action | `清匣` |
| Empty title | `匣中暂无藏页` |
| No-results title | `未检得相符藏页` |
| No-results body | `换一个关键词试试，或清空检索后查看全部收纳。` |

### Options Page

| Element | Copy |
|---------|------|
| Hero eyebrow | `法宝袋设置` |
| Hero title | `藏阁整备` |
| Export eyebrow | `备份` |
| Import eyebrow | `归档` |

---

## Technical Constraints

- Keep existing React component structure lightweight and explicit
- Prefer semantic class names over large stacks of one-off utility classes
- Preserve Shadow DOM isolation
- Use `overscroll-behavior: contain` for panel scrolling
- Use `box-sizing: border-box` in the content UI to avoid shell overflow clipping

---

## Success Criteria

- The UI is recognizably different from the previous utility-first version
- Desktop panel fits 6 cards per row
- Panel surface does not clip against its parent
- Scrolling the panel does not scroll the webpage
- Trigger remains visible after browser zoom or viewport changes
- Content script UI and options page feel like one product

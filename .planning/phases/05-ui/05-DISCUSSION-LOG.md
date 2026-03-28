# Phase 5: 标签面板ui优化 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-27
**Phase:** 05-ui
**Areas discussed:** Card design, Panel layout, Animations

---

## Card Design

### Card Size

| Option | Description | Selected |
|--------|-------------|----------|
| Keep current size (160×100px) | Keep current 160×100px size - fits ~12 cards on screen | |
| Smaller cards (140×90px) | Smaller 140×90px - more cards visible, less info per card | ✓ |
| Larger cards (180×110px) | Larger 180×110px - more title visible, fewer cards on screen | |

**User's choice:** Smaller cards (140×90px)
**Notes:** Better density, ~15 more cards visible

---

### Delete Button Visibility

| Option | Description | Selected |
|--------|-------------|----------|
| Show on hover (Recommended) | Delete button appears on hover only, cleaner default look | ✓ |
| Always visible | Delete button always visible, clearer affordance but more clutter | |

**User's choice:** Show on hover
**Notes:** Cleaner default view, fade transition

---

### Card Visual Style

| Option | Description | Selected |
|--------|-------------|----------|
| Keep current style (Recommended) | Keep current white/gray cards with amber panel background | ✓ |
| Add 国风 accents | Add subtle 国风 decorative elements to cards (corner patterns, border style) | |
| Scroll-like shape | Use rounded pill shape like paper scrolls | |

**User's choice:** Keep current style
**Notes:** Maintain consistency with existing design

---

## Panel Layout

### Panel Size

| Option | Description | Selected |
|--------|-------------|----------|
| Keep current (Recommended) | Keep current 80vw × 70vh fixed size | ✓ |
| Fit content height | Fit content height, up to 80vh max - grows/shrinks with tab count | |
| Full viewport | Full viewport - use entire browser window for grid | |

**User's choice:** Keep current (80vw × 70vh)

---

### Search Bar Position

| Option | Description | Selected |
|--------|-------------|----------|
| Sticky header (Recommended) | Search bar stays at top when scrolling - always visible | ✓ |
| Scrolls with content | Search bar scrolls with content - simpler implementation | |

**User's choice:** Sticky header
**Notes:** Search always accessible

---

### Header Content

| Option | Description | Selected |
|--------|-------------|----------|
| Keep current (Recommended) | Keep current minimal header with search + clear button | ✓ |
| Add title | Add a title '法宝袋' to the header | |
| Add tab count | Add tab count badge (e.g., '12 tabs') | |

**User's choice:** Keep current
**Notes:** Minimal, clean design

---

## Animations

### Panel Open/Close Animation

| Option | Description | Selected |
|--------|-------------|----------|
| Keep current (Recommended) | Keep current scale + fade (300ms cubic-bezier) | ✓ |
| Scale + slide | Scale + slide in from right edge | |
| Fade only | Fade in/out, no scale | |

**User's choice:** Keep current (scale + fade)

---

### Card Hover Effect

| Option | Description | Selected |
|--------|-------------|----------|
| Keep current (Recommended) | Keep current scale 1.02, blue border, enhanced shadow | ✓ |
| Scale larger | Scale to 1.05 on hover | |
| Lift effect | Add shadow lift without scale | |

**User's choice:** Keep current
**Notes:** Subtle, professional hover feedback

---

### Delete Button Appearance

| Option | Description | Selected |
|--------|-------------|----------|
| Fade in (Recommended) | Fade in on hover with opacity transition | ✓ |
| Scale in | Scale from 0 to 1 on hover | |
| Slide in | Slide in from card edge | |

**User's choice:** Fade in
**Notes:** Smooth, non-jarring transition

---

## Claude's Discretion

- Exact transition timing for delete button fade (suggested: 150ms)
- Hover state z-index layering if needed
- Scroll behavior smoothness (CSS scroll-behavior)

## Deferred Ideas

None — discussion stayed within phase scope.

---

## 2026-03-28 Restyle Decisions

### Overall Direction

| Option | Description | Selected |
|--------|-------------|----------|
| 国风器物感 | 像卷轴、漆匣、法器的收藏系统 | ✓ |
| 赛博收藏柜 | 更现代、冷冽、发光 | |
| 杂志编辑感 | 强排版、策展感 | |

**User's choice:** 国风器物感

### Emotional Tone

| Option | Description | Selected |
|--------|-------------|----------|
| 沉稳珍藏 | 深漆红、旧金、宣纸暖底，克制高级 | ✓ |
| 灵气法器 | 朱砂、墨黑、玉石青，略带神秘感 | |
| 宫廷雅玩 | 更明亮、更华贵、更装饰性 | |

**User's choice:** 沉稳珍藏

### Structural Freedom

| Option | Description | Selected |
|--------|-------------|----------|
| 全量重做 | 允许调整布局、信息层级、按钮位置 | ✓ |
| 中度重做 | 局部重排，保留主体结构 | |
| 仅换皮 | 尽量不动结构，只改视觉 | |

**User's choice:** 全量重做

### Recommended Concept

| Option | Description | Selected |
|--------|-------------|----------|
| 漆匣法宝袋 | 面板像展开的漆匣，最强产品记忆点 | ✓ |
| 卷轴式目录 | 更文气、更轻 | |
| 书房案头 | 更稳，更像收纳托盘 | |

**Selected approach:** 漆匣法宝袋

### Follow-up Constraints Added During Execution

- Desktop grid should show 6 cards per row
- Panel internal shell must not overflow and get clipped
- Scrolling panel content must not scroll the host webpage
- Floating trigger must refit into viewport after zoom/resize

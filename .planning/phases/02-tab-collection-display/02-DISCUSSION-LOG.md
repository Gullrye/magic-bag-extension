# Phase 2: Tab Collection & Display - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-25
**Phase:** 02-tab-collection-display
**Areas discussed:** Context menu behavior, Grid layout & spacing, Grid expansion animation, Tab storage schema

---

## Context Menu Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| "收入法宝袋" | Simple and direct | |
| "将标签页收入法宝袋" | More explicit action | ✓ |
| "收入" | Shortest option | |

**User's choice:** "将标签页收入法宝袋"
**Notes:** User preferred more explicit action text

---

| Option | Description | Selected |
|--------|-------------|----------|
| No confirmation | Direct collection, no extra step | |
| Show confirmation | Small browser confirmation dialog | |
| Toast notification | Collect immediately but show toast notification | ✓ |

**User's choice:** Toast notification
**Notes:** Collect immediately with visual feedback via toast

---

## Grid Layout & Spacing

| Option | Description | Selected |
|--------|-------------|----------|
| 4x3 (12 visible) | Fixed grid, scroll when more tabs | |
| 5x4 (20 visible) | Larger fixed grid | |
| Dynamic based on count | Expands with tabs, no scroll | |

**User's choice:** "铺满整个浏览器界面后，如果还有标签，再滚动吧" (Fill browser interface, then scroll)
**Notes:** Custom response — grid fills viewport then scrolls

---

| Option | Description | Selected |
|--------|-------------|----------|
| Small (120x80px) | Compact, shows many tabs | |
| Medium (160x100px) | Balanced size | |
| Large (200x120px) | More prominent | |

**User's choice:** "可自定义" (Customizable)
**Notes:** Deferred to Claude's discretion for default, with user customization noted as future enhancement

---

## Grid Expansion Animation

| Option | Description | Selected |
|--------|-------------|----------|
| No animation (instant) | Instant appearance | |
| Simple fade (200ms) | Standard fade in | |
| Scale + fade (300ms) | Expands outward from icon position | ✓ |

**User's choice:** Scale + fade (300ms)
**Notes:** Grid expands outward from floating icon position

---

## Tab Storage Schema

| Option | Description | Selected |
|--------|-------------|----------|
| Allow duplicates | Allow saving same URL multiple times | |
| Warn on duplicate | Show warning but allow | |
| Prevent duplicates | Prevent saving duplicate URLs | ✓ |

**User's choice:** Prevent duplicates
**Notes:** Check for duplicate URLs before adding, show warning if detected

---

| Option | Description | Selected |
|--------|-------------|----------|
| Newest first | Most recently collected first | ✓ |
| Oldest first | First collected at top | |
| Alphabetical | Alphabetical by title | |

**User's choice:** Newest first
**Notes:** Most recently collected tabs appear at top of grid

---

## Claude's Discretion

Areas where user deferred or chose flexible approach:
- Exact grid spacing and gap values
- Toast notification appearance and duration
- Favicon fallback behavior
- Empty state display
- Maximum storage limits
- Default card size (user mentioned customizable)

---

## Deferred Ideas

- User-customizable card sizes — noted for future enhancement
- Grid view options (list vs grid) — out of scope for this phase
- Tab grouping/categories — belongs in future phase

---

*Phase: 02-tab-collection-display*
*Discussion log: 2026-03-25*

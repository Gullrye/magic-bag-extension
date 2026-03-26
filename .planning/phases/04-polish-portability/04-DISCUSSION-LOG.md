# Phase 4: Polish & Portability - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-27
**Phase:** 04-polish-portability
**Areas discussed:** Import behavior, Import/Export UI, Export format, Icon styling approach

---

## Import Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Merge (add imported, keep existing) | Simple and fast. If you import a file with 5 tabs and already have 3, you'll have 8 tabs after import. | ✓ |
| Replace (clear existing, then import) | Destructive but clean. Imported tabs completely replace what's in the bag. | |
| Always ask | Full control. Ask the user on every import whether to merge or replace. | |

**User's choice:** Merge (add imported, keep existing)
**Notes:** Preserves user data, non-destructive by default

---

## Duplicate Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Skip duplicates silently | Keep it simple — skip any imported tab whose URL already exists in the bag. No prompt needed. | ✓ |
| Overwrite existing | Replace existing tabs with imported ones if URLs match. Imported data wins. | |
| Show duplicate count and ask | Show how many duplicates were found and let user decide whether to skip or overwrite. | |

**User's choice:** Skip duplicates silently
**Notes:** Keeps import flow fast and non-disruptive

---

## UI Location

| Option | Description | Selected |
|--------|-------------|----------|
| Header row with search/clear | Add '导出' and '导入' buttons next to the existing '清空' button in the grid header. | |
| Footer row | Add a dedicated footer row at bottom of grid with export/import buttons. | |
| Dropdown menu | Add a small '...' menu button in header, with export/import options inside. | |
| Browser extension options page | A separate page accessed via extension icon click or right-click menu. Standard extension pattern. | ✓ |

**User's choice:** Browser extension options page
**Notes:** Keeps grid focused on viewing tabs; options page is the standard location for extension settings

---

## Export Format

| Option | Description | Selected |
|--------|-------------|----------|
| Tabs only: [{url, title, favicon, timestamp}, ...] | Just the array of tabs — simple and minimal. Easy to edit manually if needed. | ✓ |
| Include metadata: {version, exportedAt, tabs: [...]} | Include metadata for debugging/tracking: export date, extension version, tab count. | |

**User's choice:** Tabs only
**Notes:** Simple and minimal; easy to edit manually if needed

---

## Icon Styling Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Claude's discretion | Claude will design a Chinese traditional style icon (bag/pouch shape, red/gold colors, subtle details). | ✓ |
| Discuss visual design | Discuss specific visual preferences: shape, colors, decorative elements, animations. | |

**User's choice:** Claude's discretion
**Notes:** User trusts Claude to design appropriate 国风 visual styling

---

## Claude's Discretion

- Exact icon shape and proportions (traditional pouch vs stylized bag)
- Specific color palette and gradients
- Decorative details (embroidery patterns, tassels, seal stamps)
- Hover and drag state animations
- Whether to add subtle shadow or glow effects for visibility on light/dark pages

## Deferred Ideas

None — discussion stayed within phase scope.

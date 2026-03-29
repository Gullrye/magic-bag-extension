---
phase: quick
plan: 260329-popup
subsystem: Popup UI
tags: [ui, tooltip, cleanup, card-layout]
tech_stack:
  added: []
  patterns:
    - Pure CSS tooltips (no JS libraries)
    - Hover/focus states for accessibility
key_files:
  created: []
  modified:
    - path: entrypoints/popup/PopupPage.tsx
      purpose: Replace body text with tooltip icons, merge import/export card
    - path: entrypoints/popup/style.css
      purpose: Add tooltip styling, separate card styling
    - path: utils/i18n.ts
      purpose: Add tooltip and button label i18n keys
decisions: []
metrics:
  duration: "combined"
  completed_date: "2026-03-29"
---

# Quick Task: Simplify Popup Layout Summary

**One-liner:** Replaced explanatory text with tooltip icons, merged import/export into a single card, separated cards with independent styling.

## Final State

### Hero Section
- Title with tooltip icon (hover shows intro text)
- Locale switcher (auto/zh/en)
- Two action buttons: collect current tab, show panel

### Sync Card (standalone)
- Title "本地备份" with tooltip
- Dynamic status text (bound file name or unbound)
- 3 action buttons: update backup, restore from backup, change/bind file

### Import/Export Card (standalone, separate from sync)
- Title "备份与归档" with tooltip
- 2 full-width buttons stacked vertically: export tabs, import tabs

### CSS Changes
- Tooltip: `.popup-tooltip` / `.popup-tooltip__content` — pure CSS, hover/focus, max-width 200px
- Cards: styling moved from `.popup-page__grid` to `.popup-card`, each card independent with gap
- Removed: eyebrow wrappers, hero-copy wrapper, lead paragraphs, body--muted class

### i18n Keys Added/Changed
- `popupIoTitle`: "备份与归档" / "Backup & Archive"
- `popupIoHint`: combined description for import/export
- `popupExportButton`: "导出标签" / "Export Tabs" (was "导出 JSON")
- `popupImportButton`: "导入标签" / "Import Tabs" (was "选择文件")

## Verification

- `pnpm build` passes
- Cards are visually separated (each with own border/background/shadow)
- Tooltips appear on hover without triggering button interaction
- Sync card status text remains visible

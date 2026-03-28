# Quick Task 260328-nzx Summary

## Task

当前浏览器插件的展示支持中文和英文两种，然后README.md支持中英文

## What Changed

- Added a lightweight runtime i18n helper at `utils/i18n.ts`
- Localized browser-level extension metadata with `public/_locales/zh_CN/messages.json` and `public/_locales/en/messages.json`
- Switched manifest metadata in `wxt.config.ts` to `__MSG_*__` keys and enabled `default_locale`
- Replaced hard-coded Chinese UI strings in popup, content UI, and background context menu with locale-aware lookups
- Added English rendering coverage to popup tests
- Rewrote `README.md` as a bilingual Chinese/English document

## Verification

- `pnpm compile`
- `pnpm test:run`
- `pnpm build`

## Outcome

The extension UI now supports Chinese and English at runtime, browser metadata is localized through Chrome locale resources, and the README is readable in both languages.

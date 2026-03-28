# Quick Task 260328-pa0 Summary

## Task

为标签管理新增同步文件能力：保留现有导入导出，新增绑定JSON文件、从文件导入、导出到文件

## What Changed

- Added `utils/fileSync.ts` to persist a chosen JSON file handle and read/write through the File System Access API
- Added a new sync-file section in popup with three actions:
  - bind JSON file
  - import from sync file
  - export to sync file
- Kept the existing import/export flow unchanged
- Added bilingual copy for the sync-file UI
- Added popup tests for bind/import/export sync actions

## Verification

- `pnpm compile`
- `pnpm test:run`
- `pnpm build`

## Outcome

The extension can now work with a user-selected local JSON file as a manual sync target, while the original import/export flow remains available.

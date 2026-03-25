---
phase: 01-infrastructure-floating-icon
plan: 01
subsystem: build-infrastructure
tags: [wxt, react, typescript, manifest-v3, build-setup]
dependency_graph:
  requires: [01-00]
  provides: [build-pipeline, manifest-config, service-worker-stub]
  affects: [01-02, 01-03, 01-04]
tech_stack:
  added:
    - "WXT 0.20.20 (Extension build framework)"
    - "React 18.3.1 (UI framework)"
    - "TypeScript 5.7.3 (Type safety)"
    - "react-draggable 4.5.0 (Floating icon drag)"
  patterns:
    - "WXT auto-imports for defineBackground"
    - "Manifest V3 permissions configuration"
    - "TypeScript strict mode with .wxt types"
key_files:
  created:
    - "package.json (WXT project dependencies)"
    - "wxt.config.ts (Manifest permissions config)"
    - "tsconfig.json (TypeScript strict config)"
    - "entrypoints/background.ts (Service worker stub)"
    - ".output/chrome-mv3/ (Build output)"
  modified:
    - "tests/setup.ts (Chrome API mocks)"
    - "tests/background.test.ts (Moved from entrypoints/)"
    - "tests/content.test.ts (Moved from entrypoints/)"
decisions:
  - "Use WXT auto-imports instead of explicit imports for defineBackground"
  - "Move test files out of entrypoints/ to avoid WXT build conflicts"
  - "Add .wxt/**/*.d.ts to tsconfig include for proper type support"
metrics:
  duration: "105 seconds (~1 minute)"
  completed_date: "2026-03-25T11:45:07Z"
  tasks_completed: 3
  files_changed: 12
  commits: 3
---

# Phase 01 Plan 01: WXT Project Initialization Summary

Establish WXT extension build infrastructure with React + TypeScript, Manifest V3 configuration, and service worker foundation. This creates the scaffolding for all subsequent development.

## One-Liner

WXT 0.20.20 framework initialized with React 18.3.1, TypeScript 5.7.3, and Manifest V3 permissions (storage, activeTab, contextMenus, tabs, unlimitedStorage, <all_urls>).

## Tasks Completed

| Task | Commit | Files | Description |
|------|--------|-------|-------------|
| 1 | 63cb058 | package.json, pnpm-lock.yaml | Install react-draggable 4.5.0 for floating icon drag functionality |
| 2 | 6ba17e1 | wxt.config.ts | Add host_permissions: ['<all_urls>'] for content script injection |
| 3 | 21145f2 | tests/, entrypoints/, tsconfig.json | Fix build errors by moving test files and adding missing files to git |
| Fix | 6280fb1 | entrypoints/background.ts, tests/setup.ts, tsconfig.json | Fix TypeScript compilation errors for zero-error build |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed duplicate entrypoint names blocking build**
- **Found during:** Task 3 (build verification)
- **Issue:** WXT detected duplicate entrypoints: `background.test.ts` and `background.ts` in entrypoints/ directory
- **Fix:** Moved `background.test.ts` and `content.test.ts` from `entrypoints/` to `tests/` directory per WXT conventions
- **Files modified:** entrypoints/background.test.ts, entrypoints/content.test.ts, tests/background.test.ts, tests/content.test.ts
- **Commit:** 21145f2

**2. [Rule 1 - Bug] Fixed TypeScript compilation errors**
- **Found during:** Task 3 (verification)
- **Issue:** TypeScript errors for `defineBackground` (missing import) and `global.chrome` (missing type)
- **Fix:**
  - Added `.wxt/**/*.d.ts` to tsconfig.json include for WXT auto-imports
  - Removed incorrect import statement from background.ts (defineBackground is auto-imported by WXT)
  - Fixed chrome API mock to use `(globalThis as any).chrome`
- **Files modified:** tsconfig.json, entrypoints/background.ts, tests/setup.ts
- **Commit:** 6280fb1

**3. [Rule 2 - Missing critical functionality] Added missing tsconfig.json and .gitignore to git**
- **Found during:** Task 1 (initialization)
- **Issue:** tsconfig.json and .gitignore were not tracked in git (created by WXT init but not committed)
- **Fix:** Added both files to git commit in Task 3
- **Files modified:** tsconfig.json, .gitignore
- **Commit:** 21145f2

## Requirements Satisfied

From PLAN.md frontmatter:
- ✅ **INFR-01**: Extension boots with WXT + React + TypeScript + Manifest V3
- ✅ **INFR-03**: Service worker handles privileged Chrome APIs (background.ts stub created)
- ✅ **INFR-04**: unlimitedStorage permission requested (in manifest permissions)

## Success Criteria Met

- ✅ WXT 0.20.20 initialized with React 18.3.1 and TypeScript 5.7.3
- ✅ wxt.config.ts configured with @wxt-dev/module-react and all permissions
- ✅ Manifest V3 generated in .output/chrome-mv3/manifest.json
- ✅ Service worker entry point exists at entrypoints/background.ts
- ✅ Extension builds without errors (`pnpm build` exits 0)
- ✅ react-draggable 4.5.0 installed for drag implementation
- ✅ TypeScript compilation passes with zero errors (`npx tsc --noEmit`)

## Verification Results

**Infrastructure Check:**
```bash
pnpm build
✔ Built extension in 85 ms
  ├─ .output/chrome-mv3/manifest.json  285 B
  └─ .output/chrome-mv3/background.js  2.64 kB
Σ Total size: 2.93 kB
✔ Finished in 110 ms
```

**Manifest Validation:**
- ✅ manifest_version: 3 confirmed in .output/chrome-mv3/manifest.json
- ✅ All 5 permissions present: storage, activeTab, contextMenus, tabs, unlimitedStorage
- ✅ host_permissions: ["<all_urls>"] configured
- ✅ background.service_worker entry point generated

**Type Safety:**
```bash
npx tsc --noEmit
TypeScript compilation completed
```
Zero errors.

**Dependency Check:**
- ✅ wxt: ^0.20.20
- ✅ react: ^18.3.1
- ✅ react-dom: ^18.3.1
- ✅ typescript: ^5.7.3
- ✅ react-draggable: ^4.5.0
- ✅ @wxt-dev/module-react: ^1.1.3

## Key Technical Details

### Manifest Configuration
```typescript
manifest: {
  name: '法宝袋',
  description: '一键收纳标签页，让浏览器保持清爽',
  permissions: ['storage', 'activeTab', 'contextMenus', 'tabs', 'unlimitedStorage'],
  host_permissions: ['<all_urls>'],
}
```

### WXT Auto-Imports
WXT provides auto-imports for `defineBackground` via `.wxt/types/imports.d.ts`. No explicit import needed in entrypoints/background.ts.

### TypeScript Configuration
- Strict mode enabled
- ES2020 target with ESNext module resolution
- JSX set to react-jsx
- Includes `.wxt/**/*.d.ts` for WXT auto-import types

### Build Output
- Output directory: `.output/chrome-mv3/`
- Bundle size: 2.93 kB (minimal, as expected for stub)
- Manifest V3 compatible

## Known Stubs

None. This plan is purely infrastructure setup with no UI components or user-facing features.

## Next Steps

Plan 01-02 will build upon this foundation by creating the floating icon UI component with Shadow DOM style isolation and drag functionality using react-draggable.

## Self-Check: PASSED

- ✅ All commits exist in git log
- ✅ All files created/modified are tracked
- ✅ Build passes with zero errors
- ✅ TypeScript compilation passes with zero errors
- ✅ All verification criteria met

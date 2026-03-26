---
phase: 2
slug: tab-collection-display
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-25
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (WXT default) |
| **Config file** | `vitest.config.ts` — WXT auto-configures |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test:run` |
| **Estimated runtime** | ~8 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test:run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | COLL-01 | unit | `pnpm test` | ✅ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | COLL-02 | unit | `pnpm test` | ✅ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | COLL-03 | unit | `pnpm test` | ✅ W0 | ⬜ pending |
| 02-02-01 | 02 | 2 | COLL-04 | unit | `pnpm test` | ✅ W0 | ⬜ pending |
| 02-02-02 | 02 | 2 | GRID-01 | unit | `pnpm test` | ✅ W0 | ⬜ pending |
| 02-03-01 | 03 | 3 | GRID-02, GRID-03 | unit | `pnpm test` | ✅ W0 | ⬜ pending |
| 02-03-02 | 03 | 3 | GRID-04 | unit | `pnpm test` | ✅ W0 | ⬜ pending |
| 02-04-01 | 04 | 4 | GRID-05 | manual | Load extension, test click-outside | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `tests/background.test.ts` — stubs for COLL-01 (context menu registration)
- [x] `tests/storage.test.ts` — extended for COLL-04 (tab storage operations)
- [x] `tests/tabs.test.ts` — stubs for GRID-02, GRID-03 (grid rendering, favicons)
- [x] `tests/utils/clickOutside.test.ts` — stubs for GRID-05 (click-outside detection)
- [x] `tests/setup.ts` — extended with comprehensive Chrome API mocks

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Context menu appears in browser | COLL-01 | Requires browser extension loading | 1. Load extension in Edge 2. Right-click any page 3. Verify "将标签页收入法宝袋" option appears |
| Tab closes after collection | COLL-03 | Requires browser tab manipulation | 1. Right-click and select context menu 2. Verify original tab closes |
| Grid displays on icon click | GRID-01 | UI interaction in browser | 1. Click floating icon 2. Verify grid appears with scale+fade animation |
| Click-outside closes grid | GRID-05 | UI interaction in browser | 1. Open grid 2. Click outside grid area 3. Verify grid closes |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

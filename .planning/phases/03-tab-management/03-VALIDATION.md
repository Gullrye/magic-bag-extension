---
phase: 3
slug: tab-management
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-26
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm test --run` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~10-15 seconds after Phase 3 additions |

---

## Sampling Rate

- **After every task commit:** Run the narrowest affected `pnpm test --run ...` command
- **After every plan:** Run `pnpm test --run`
- **Before `/gsd:verify-work`:** Run full suite with `pnpm test`
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | MNGT-01, MNGT-02 | unit | `pnpm test --run tests/storage.test.ts` | ✅ existing | ✅ green |
| 03-01-02 | 01 | 1 | MNGT-03 | unit | `pnpm test --run tests/storage.test.ts` | ✅ existing | ✅ green |
| 03-02-01 | 02 | 1 | MNGT-04 | unit | `pnpm test --run tests/components/TabGrid.test.tsx` | ✅ existing | ✅ green |
| 03-02-02 | 02 | 1 | MNGT-04 | unit | `pnpm test --run tests/components/TabGrid.test.tsx` | ✅ existing | ✅ green |
| 03-03-01 | 03 | 2 | MNGT-01 | unit | `pnpm test --run tests/components/TabCard.test.tsx` | ✅ existing | ✅ green |
| 03-03-02 | 03 | 2 | MNGT-01 | integration | `pnpm test --run tests/components/TabGrid.test.tsx` | ✅ existing | ✅ green |
| 03-04-01 | 04 | 3 | MNGT-02 | unit | `pnpm test --run tests/components/ConfirmDialog.test.tsx` | ✅ Wave 0 | ✅ green |
| 03-04-02 | 04 | 3 | MNGT-02 | integration | `pnpm test --run tests/components/TabGrid.test.tsx` | ✅ existing | ✅ green |
| 03-05-01 | 05 | 4 | MNGT-03 | unit | `pnpm test --run tests/components/TabGrid.test.tsx` | ✅ existing | ✅ green |
| 03-05-02 | 05 | 4 | MNGT-03 | integration | `pnpm test --run tests/storage.test.ts tests/components/TabGrid.test.tsx` | ✅ existing | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `tests/setup.ts` — extended with drag-and-drop compatible pointer shims
- [x] `tests/storage.test.ts` — extended for clear-all and reorder persistence
- [x] `tests/components/TabGrid.test.tsx` — extended for search, reset-on-open, clear-all, reorder
- [x] `tests/components/TabCard.test.tsx` — extended for delete affordance behavior
- [x] `tests/components/ConfirmDialog.test.tsx` — created for clear-all confirmation dialog

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Search field is usable inside Shadow DOM on real pages | MNGT-04 | Browser extension UI context | 1. Load extension 2. Open bag 3. Type in search 4. Verify filtering works on real saved tabs |
| Delete affordance remains clickable without opening card | MNGT-01 | Fine-grained pointer behavior | 1. Open bag 2. Click delete on one card 3. Verify card does not open |
| Clear-all confirm flow behaves correctly | MNGT-02 | Modal + browser interaction | 1. Open bag 2. Click `清空` 3. Cancel once, confirm once 4. Verify both branches |
| Reorder feels reliable and persists after reopen | MNGT-03 | Pointer drag UX is difficult to prove in jsdom | 1. Drag a card 2. Close bag 3. Reopen bag 4. Refresh page 5. Verify order persists |

---

## Validation Sign-Off

- [x] All plans have at least one narrow automated verification command
- [x] Wave 0 covers every new test surface before feature work
- [x] No three consecutive tasks rely only on manual checking
- [x] `nyquist_compliant: true` remains justified
- [x] Full suite passes before execution sign-off

**Approval:** Automated verification complete on 2026-03-26. Manual browser verification remains recommended for release confidence.

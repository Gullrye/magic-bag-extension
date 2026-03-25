---
phase: 1
slug: infrastructure-floating-icon
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-25
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (WXT default) |
| **Config file** | `vitest.config.ts` — WXT auto-configures |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test:run` |
| **Estimated runtime** | ~5 seconds |

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
| 01-01-01 | 01 | 1 | INFR-01 | unit | `pnpm test` | ✅ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | INFR-02 | unit | `pnpm test` | ✅ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | INFR-03 | unit | `pnpm test` | ✅ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | INFR-04 | unit | `pnpm test` | ✅ W0 | ⬜ pending |
| 01-03-01 | 03 | 1 | ICON-01 | manual | Load extension, inspect page | N/A | ⬜ pending |
| 01-03-02 | 03 | 1 | ICON-02 | manual | Drag icon to each edge | N/A | ⬜ pending |
| 01-03-03 | 03 | 1 | ICON-03 | manual | Reload page, check position | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `entrypoints/content.test.ts` — stubs for INFR-01, INFR-02 (Shadow DOM injection)
- [ ] `entrypoints/background.test.ts` — stubs for INFR-03 (service worker)
- [ ] `tests/storage.test.ts` — stubs for INFR-04 (storage permissions)
- [ ] `vitest.config.ts` — WXT vitest configuration

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Icon appears on page | ICON-01 | Requires browser extension loading | 1. Load extension in Edge 2. Navigate to any website 3. Verify floating icon visible |
| Drag to edges | ICON-02 | UI interaction in browser | 1. Drag icon to each edge 2. Verify it snaps correctly |
| Position persistence | ICON-03 | Requires page reload and browser restart | 1. Move icon 2. Reload page 3. Restart browser 4. Verify position saved |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

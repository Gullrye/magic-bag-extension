# 法宝袋 (Magic Bag)

## What This Is

一款 Edge 浏览器扩展，提供一个可拖拽的悬浮图标"法宝袋"。用户可以将浏览器标签页"收入"袋中，标签像棋子一样在棋盘上铺开展示。点击袋中的标签可以重新打开网页。帮助用户整理和管理大量打开的标签页，保持浏览器清爽。

## Core Value

**一键收纳标签页，让浏览器保持清爽。** 用户不再需要几十个标签页挤在浏览器顶部，所有暂时不看但又不想关闭的页面都可以收入法宝袋。

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 悬浮法宝袋图标显示在所有网页上，可拖拽到屏幕四边
- [ ] 右键菜单将当前标签页收入法宝袋，自动关闭原标签
- [ ] 点击法宝袋，标签向对侧棋盘式铺开（图标+标题）
- [ ] 点击标签打开对应网页
- [ ] 标签搜索功能
- [ ] 删除单个标签
- [ ] 拖拽排序标签
- [ ] 全部清空
- [ ] 导入/导出数据（JSON 格式）
- [ ] 国风视觉风格

### Out of Scope

- 云同步/账号系统 — 本地存储足够，无需后端
- 多个袋子 — 保持简单，单个袋子
- 网页缩略图预览 — 图标+标题已足够
- HTML 书签格式导入导出 — JSON 更简单直接

## Context

- 目标浏览器：Microsoft Edge（Chromium 内核）
- 类似产品：OneTab、Session Buddy，但法宝袋强调：
  - 可视化展示（棋盘式铺开）
  - 国风美学
  - 更直观的交互（悬浮图标 vs 浏览器工具栏）
- 用户痛点：打开太多标签页，浏览器变得混乱，但又不想直接关闭

## Constraints

- **浏览器**: Microsoft Edge (Chromium 扩展)
- **存储**: chrome.storage.local，本地存储
- **权限**: activeTab, contextMenus, storage, tabs
- **数量**: 不限制标签数量，但需要考虑大量标签时的性能

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Chromium 扩展 | Edge 基于 Chromium，可使用标准 Web Extension API | — Pending |
| 本地存储 | 无需后端，简单可靠，用户隐私有保障 | — Pending |
| 单个袋子 | 降低复杂度，聚焦核心体验 | — Pending |
| 国风视觉 | 差异化定位，独特美学 | — Pending |
| JSON 导入导出 | 简单通用，便于备份和迁移 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-25 after initialization*

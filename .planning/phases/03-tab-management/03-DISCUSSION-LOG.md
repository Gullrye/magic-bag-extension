# Phase 3: Tab Management - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 03-tab-management
**Areas discussed:** Organization approach, search entry point, filter matching, query lifecycle, input focus

---

## Organization Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Tags | Add multiple tags per saved tab | |
| Groups/Folders | Put each tab into a group/folder | |
| Board-style layout | Organize tabs spatially on the board | |
| Search/filter | Use search as the primary way to find tabs | ✓ |

**User's choice:** "我不想要标签分组，要个标题筛选就行"
**Notes:** User explicitly rejected tags/grouping and wanted simple title-based finding. Scope was then expanded slightly to title-or-URL matching for better retrieval without adding structural organization features.

---

## Search Entry Point

| Option | Description | Selected |
|--------|-------------|----------|
| Grid 顶部常驻搜索框 | Search input is always visible in the bag header | ✓ |
| 点击后展开搜索框 | Cleaner default UI, extra interaction step | |
| 独立搜索模式 | Separate mode/page focused on search | |

**User's choice:** Grid 顶部常驻搜索框
**Notes:** User preferred the shortest interaction path.

---

## Search Matching

| Option | Description | Selected |
|--------|-------------|----------|
| 标题包含匹配 | Match title only | |
| 标题或 URL 包含匹配 | Match title or URL, case-insensitive | ✓ |
| 标题前缀匹配 | Prefix-only match | |

**User's choice:** 标题或 URL 包含匹配
**Notes:** Case-insensitive substring matching gives better retrieval without introducing advanced search syntax.

---

## Query Lifecycle

| Option | Description | Selected |
|--------|-------------|----------|
| 每次打开重置为空 | Fresh search every open | ✓ |
| 保留上次搜索词 | Persist across opens | |
| 仅本次页面保留 | Persist until page reload | |

**User's choice:** 每次打开重置为空
**Notes:** Keeps behavior predictable and avoids confusion when reopening the bag.

---

## Input Focus

| Option | Description | Selected |
|--------|-------------|----------|
| 自动聚焦 | Open and type immediately | |
| 不自动聚焦 | Avoid stealing focus from host page | ✓ |
| 仅键盘打开时自动聚焦 | Context-sensitive focus behavior | |

**User's choice:** 不自动聚焦
**Notes:** User preferred not to steal input focus on open.

---

## Claude's Discretion

Areas where user explicitly deferred to best practices:
- Search UI exact styling and placement details
- Search input placeholder copy
- "No search results" wording
- Remaining Phase 3 management interaction details outside the search flow

---

## Deferred Ideas

- Tags / folders / grouping
- Board-style freeform organization
- Persisted search query
- Auto-focus on open
- Separate search mode

---

*Phase: 03-tab-management*
*Discussion log: 2026-03-26*

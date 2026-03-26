# Phase 3: Tab Management - Research

**Researched:** 2026-03-26
**Domain:** React browser extension, tab management features
**Confidence:** HIGH

## Summary

Phase 3 adds management capabilities (delete, clear, reorder, search) on top of the Phase 2 bag grid. User direction for this phase is explicit: do not add tags or grouping, and use search/filtering as the primary way to find saved tabs.

**Primary recommendation:** Keep search state local to `TabGrid` with immediate case-insensitive title-or-URL filtering, add explicit delete and clear-all flows in the content-script UI, and use @dnd-kit/sortable with `rectSortingStrategy` for persistent grid reordering.

### Phase 3 Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MNGT-01 | Delete individual tabs from grid | Delete button on TabCard, use `removeTab()` from storage |
| MNGT-02 | Clear all tabs at once | "Clear all" button in TabGrid header, use `clearTabs()` from storage |
| MNGT-03 | Drag tabs to reorder within grid | @dnd-kit/sortable with `rectSortingStrategy` |
| MNGT-04 | Search tabs by title or URL | Local `query` state + derived filtered results in `TabGrid` |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @dnd-kit/core | 6.3.1 | Drag & drop core | Modern, performant, accessible D&D toolkit |
| @dnd-kit/sortable | 10.0.0 | Sortable grid preset | Provides `SortableContext`, `useSortable` hook, ` arrayMove` helper |
| @dnd-kit/utilities | 3.2.2 | CSS transform utilities | `CSS.Translate.toString()` for scale-free transforms |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|----------|
| react-draggable | 4.5.0 | Floating icon drag ( Already installed from Phase 1 |

**Installation:**
```bash
pnpm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Version verification:**
```bash
npm view @dnd-kit/core version    # 6.3.1
npm view @dnd-kit/sortable version # 10.0.0
npm view @dnd-kit/utilities version # 3.2.2
```

---

## Architecture Patterns

### Recommended Project Structure

Phase 3 adds to existing Phase 2 structure:

```
entrypoints/content/
├── index.tsx          # Main app (no search protocol changes required)
├── TabGrid.tsx        # Grid container (add search, clear-all, reorder)
├── TabCard.tsx        # Tab cards (add delete button)
├── ConfirmDialog.tsx  # Clear-all confirmation modal (new)
utils/
├── storage.ts         # Storage helpers (add clearTabs, reorderTabs)
```

### Pattern 1: Sortable Grid with @dnd-kit

**What:** Wraps tabs in `DndContext` with `SortableContext` using `rectSortingStrategy` for grid layouts
**When to use:** Reordering tabs within the bag's grid
**Example:**
```tsx
// Source: https://dndkit.com/presets/sortable
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableTabGridProps {
  tabs: SavedTab[];
  onTabClick: (url: string) => void;
  onReorder: (tabs: SavedTab[]) => void;
}

export function SortableTabGrid({ tabs, onTabClick, onReorder }: SortableTabGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: { active }) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: { active, over }) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tabs.findIndex(t => t.url === active.id);
      const newIndex = tabs.findIndex(t => t.url === over.id);
      const reordered = arrayMove(tabs, oldIndex, newIndex);
      onReorder(reordered);
    }
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tabs.map(t => t.url)}
        strategy={rectSortingStrategy}
      >
        {tabs.map((tab) => (
          <SortableTabCard
            key={tab.url}
            tab={tab}
            onClick={onTabClick}
          />
        ))}
      <DragOverlay>
        {activeId ? (
          <TabCardOverlay tab={tabs.find(t => t.url === activeId)!} />
        : null}
      </DragOverlay>
    </DndContext>
  );
}
```

### Pattern 2: Local Search Filter with Derived Results

**What:** Real-time filtering of tabs by title/URL with local component state and derived results
**When to use:** Filtering tabs as user types in the bag search box
**Example:**
```tsx
import { useEffect, useMemo, useState } from 'react';

import type { SavedTab } from './types';

function TabGrid({ isOpen, tabs }: { isOpen: boolean; tabs: SavedTab[] }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  const filteredTabs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tabs;

    return tabs.filter((tab) => {
      const title = tab.title.toLowerCase();
      const url = tab.url.toLowerCase();
      return title.includes(normalized) || url.includes(normalized);
    });
  }, [tabs, query]);

  return (
    <>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="搜索标题或网址"
      />
      {filteredTabs.map((tab) => (
        <TabCard key={tab.url} tab={tab} />
      ))}
    </>
  );
}
```

### Pattern 3: Clear-All Confirmation Dialog

**What:** Focused confirmation dialog for bulk destructive action
**When to use:** Before clearing all saved tabs
**Example:**
```tsx
import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/40 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded border">{cancelText}</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|------|
| Custom drag implementation | Build drag logic from scratch | @dnd-kit/sortable | Handles accessibility, collision detection, animations, keyboard navigation |
| Search state in storage/background | Persist query or route it through runtime messaging | Local `query` state in `TabGrid` + `useMemo` | Matches reset-on-open requirement and keeps behavior predictable |
| Extension-wide modal system | Build reusable modal abstraction for one dialog | Small phase-local `ConfirmDialog` component | Lower complexity and easier testing inside Shadow DOM |

**Key insight:** @dnd-kit remains the right choice for reordering, but search should stay simple until profiling says otherwise. For this bag UI, local derived filtering is clearer than persisted or debounced search state.

---

## Common Pitfalls

### Pitfall 1: Drag and Click Event Conflicts

**What goes wrong:** Click events conflict with drag events, causing unintended tab opens when trying to drag
**Why it happens:** Both drag and click handlers fire on the same user interaction
**How to avoid:** Use activation constraints on PointerSensor (require 8px movement before drag activates)
```tsx
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Require 8px movement before activating
    },
  }),
);
```
**Warning signs:** Tab opens when user starts dragging, erratic drag behavior

### Pitfall 2: Search Filter Performance

**What goes wrong:** Search behavior becomes confusing because the query persists after the bag is closed or is split across multiple layers
**Why it happens:** Search state is stored outside the grid component or not reset when the bag reopens
**How to avoid:** Keep search local to `TabGrid`, derive results with `useMemo`, and reset the query when `isOpen` changes to `true`
```tsx
useEffect(() => {
  if (isOpen) setQuery('');
}, [isOpen]);

const filteredTabs = useMemo(() => {
  if (!query.trim()) return tabs;
  return tabs.filter(/* ... */);
}, [tabs, query]);
```
**Warning signs:** Reopening the bag shows an old query, users think tabs disappeared, search logic is duplicated across files

### Pitfall 3: Missing Reorder Persistence

**What goes wrong:** Drag reorder is not saved to storage
**Why it happens:** Forgetting to persist the new order after drag end
**How to avoid:** Add `reorderTab()` helper to storage module and call it in `onDragEnd`
```tsx
const handleDragEnd = (event) => {
  // ... reorder logic ...
  await reorderTab(reordered); // Persist to storage
};
```
**Warning signs:** Reorder lost after page refresh or grid close

### Pitfall 4: Accidental Clear All

**What goes wrong:** User clicks "Clear All" by mistake, losing all tabs
**Why it happens:** No confirmation step, destructive action is too easy
**How to avoid:** Always show confirmation dialog before clearing all tabs
**Warning signs:** User hovers over button, clicks without reading

---

## Code Examples

### Sortable Tab Card Component

```tsx
// Source: https://dndkit.com/presets/sortable
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SavedTab } from './types';

interface SortableTabCardProps {
  tab: SavedTab;
  onClick: (url: string) => void;
}

export function SortableTabCard({ tab, onClick }: SortableTabCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.url });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-[160px] h-[100px] bg-white/98 border rounded-lg p-3 cursor-grab"
    >
      {/* Tab content */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(tab.url);
        }}
        className="w-full h-full text-left"
      >
        {tab.title}
      </button>
    </div>
  );
}
```

### Delete Button on TabCard

```tsx
// Add delete button to TabCard
<div className="relative group">
  {/* Existing card content */}

  {/* Delete button - visible on hover */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      onDelete(tab.url);
    }}
    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded
                 opacity-0 group-hover:opacity-100 transition-opacity"
    aria-label="Delete tab"
  >
    X
  </button>
</div>
```

### Clear All Button in Header
```tsx
// Add to TabGrid header
<div className="flex justify-between items-center mb-4">
  <h2 className="text-lg font-semibold">Saved Tabs ({tabs.length})</h2>
  <div className="flex gap-2">
    <button
      onClick={handleClearAll}
      className="px-3 py-1 bg-red-500 text-white rounded text-sm"
      disabled={tabs.length === 0}
    >
      Clear All
    </button>
  </div>
</div>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|-------|
| react-beautiful-dnd | @dnd-kit | 2024+ | Modern, maintained, accessible alternative |
| Custom drag logic | @dnd-kit presets | 2024+ | Less code, better accessibility |
| Storage-backed search state | Local derived search state | 2026+ | Simpler behavior, matches reset-on-open UX |
| Extension-wide modal system | Focused phase-local confirm dialog | 2026+ | Lower complexity for a single destructive flow |

**Deprecated/outdated:**
- **react-beautiful-dnd:** Abandoned by maintainers, no longer maintained as of 2024

---

## Open Questions

No open questions identified. All requirements have well-established patterns and solutions.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| @dnd-kit/core | MNGT-03 | Need install | 6.3.1 | None - required |
| @dnd-kit/sortable | MNGT-03 | Need install | 10.0.0 | None - required |
| @dnd-kit/utilities | MNGT-03 | Need install | 3.2.2 | None - required |

**Missing dependencies with no fallback:**
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities must be installed before Phase 3 implementation

**Missing dependencies with fallback:**
- None - all required packages are standard npm packages

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.1 |
| Config file | tests/setup.ts |
| Quick run command | `pnpm test --run` |
| Full suite command | `pnpm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MNGT-01 | Delete individual tabs from grid | unit | `pnpm test tests/components/TabCard.test.tsx` | Wave 0 (extend existing) |
| MNGT-01 | Delete button appears on hover | unit | `pnpm test tests/components/TabCard.test.tsx` | Wave 0 (extend existing) |
| MNGT-02 | Clear all tabs at once | unit | `pnpm test tests/components/TabGrid.test.tsx` | Wave 0 (extend existing) |
| MNGT-02 | Confirmation dialog shows before clear | unit | `pnpm test tests/components/ConfirmDialog.test.tsx` | Wave 0 (new) |
| MNGT-03 | Drag tabs to reorder within grid | unit | `pnpm test tests/components/TabGrid.test.tsx` | Wave 0 (extend existing) |
| MNGT-03 | Reorder persists to storage | integration | `pnpm test tests/storage.test.ts` | Wave 0 (extend existing) |
| MNGT-04 | Search tabs by title or URL | unit | `pnpm test tests/components/TabGrid.test.tsx` | Wave 0 (extend existing) |
| MNGT-04 | Search resets on reopen | unit | `pnpm test tests/components/TabGrid.test.tsx` | Wave 0 (extend existing) |

### Sampling Rate
- **Per task commit:** `pnpm test --run`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/components/ConfirmDialog.test.tsx` - covers MNGT-02 confirmation dialog
- [ ] `tests/components/TabGrid.test.tsx` - extend for search, clear-all, and reorder interaction coverage
- [ ] `tests/storage.test.ts` - extend for clear/reorder helper coverage

*(Existing tests need to be extended for delete functionality)*

---

## Sources

### Primary (HIGH confidence)
- [@dnd-kit Official Documentation](https://dndkit.com/) - Core concepts, sortable presets, sensors
- [WXT Storage Module](https://wxt.dev/storage) - Storage patterns

### Secondary (MEDIUM confidence)
- [React Performance Optimization 2025](https://dev.to/alex_bobes/react-performance-optimization-15-best-practices-for-2025-17l9) - Memoization patterns
- [Confirmation Dialogs UX](https://uxplanet.org/confirmation-dialogs-how-to-design-dialogues-without-irritation-7b4cf2599956) - UX patterns for destructive actions

### Tertiary (LOW confidence)
- None - all patterns verified with official documentation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - @dnd-kit is well-documented, actively maintained
- Architecture: HIGH - Patterns follow established best practices
- Pitfalls: MEDIUM - Based on common React patterns and documentation

**Research date:** 2026-03-26
**Valid until:** 2026-04-26 (30 days - stable libraries)

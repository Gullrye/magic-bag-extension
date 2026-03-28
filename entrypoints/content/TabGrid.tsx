import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clearTabs, iconPosition, removeTab, reorderTabs, savedTabs } from '~/utils/storage';
import { useClickOutside } from '~/utils/clickOutside';
import { ConfirmDialog } from './ConfirmDialog';
import { EmptyState } from './EmptyState';
import { TabCard } from './TabCard';
import type { SavedTab } from './types';

interface TabGridProps {
  isOpen: boolean;
  onClose: () => void;
  onTabClick: (url: string) => void;
}

interface SortableTabCardProps {
  offsetX: number;
  offsetY: number;
  onDelete: (url: string) => void;
  onTabClick: (url: string) => void;
  rotate: number;
  tab: SavedTab;
}

function SortableTabCard({
  offsetX,
  offsetY,
  onDelete,
  onTabClick,
  rotate,
  tab,
}: SortableTabCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tab.url,
  });
  const dragTransform = transform ? CSS.Transform.toString(transform) : '';
  const baseTransform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: [dragTransform, baseTransform].filter(Boolean).join(' '),
        transition,
        opacity: isDragging ? 0.85 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <TabCard tab={tab} onClick={onTabClick} onDelete={onDelete} />
    </div>
  );
}

export function TabGrid({ isOpen, onClose, onTabClick }: TabGridProps) {
  const [query, setQuery] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tabs, setTabs] = useState<SavedTab[]>([]);
  const [iconPos, setIconPos] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredTabs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return tabs;
    }

    return tabs.filter((tab) => (
      tab.title.toLowerCase().includes(normalizedQuery)
      || tab.url.toLowerCase().includes(normalizedQuery)
    ));
  }, [tabs, query]);

  const handleDelete = useCallback(async (url: string) => {
    await removeTab(url);
    setTabs((currentTabs) => currentTabs.filter((tab) => tab.url !== url));
  }, []);

  const handleConfirmClear = useCallback(async () => {
    await clearTabs();
    setTabs([]);
    setQuery('');
    setIsConfirmOpen(false);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const isReorderEnabled = query.trim().length === 0;

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !isReorderEnabled) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const oldIndex = tabs.findIndex((tab) => tab.url === activeId);
    const newIndex = tabs.findIndex((tab) => tab.url === overId);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const reorderedTabs = arrayMove(tabs, oldIndex, newIndex);
    setTabs(reorderedTabs);
    await reorderTabs(reorderedTabs);
  }, [isReorderEnabled, tabs]);

  useEffect(() => {
    savedTabs.getValue().then(setTabs);
    const unwatch = savedTabs.watch(setTabs);
    return () => unwatch();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    iconPosition.getValue().then((pos) => {
      setIconPos({ x: pos.x, y: pos.y });
    });
  }, []);

  useClickOutside(gridRef, onClose);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  const resultCountLabel = query.trim()
    ? `检得 ${filteredTabs.length} 项`
    : `共藏 ${tabs.length} 项`;

  return (
    <div
      ref={gridRef}
      className="magic-bag-panel"
      style={{
        transformOrigin: `${iconPos.x}px ${iconPos.y}px`,
        animation: 'gridOpen 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      role="dialog"
      aria-label="法宝袋"
    >
      <div className="magic-bag-panel__surface">
        <div className="magic-bag-panel__ornament" aria-hidden="true" />

        <header className="magic-bag-panel__header">
          <div className="magic-bag-panel__title-group">
            <p className="magic-bag-panel__eyebrow">法宝袋</p>
            <h2 className="magic-bag-panel__title">藏页匣</h2>
            <p className="magic-bag-panel__description">
              收拢当下分心的页面，像题签一样安稳归档。
            </p>
          </div>

          <div className="magic-bag-panel__controls">
            <label className="magic-bag-search" htmlFor="magic-bag-search">
              <span className="magic-bag-search__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <input
                id="magic-bag-search"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="检索标题或网址"
                className="magic-bag-search__input"
              />
            </label>

            <div className="magic-bag-panel__actions">
              <span className="magic-bag-panel__counter">{resultCountLabel}</span>
              {tabs.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(true)}
                  className="magic-bag-panel__clear"
                >
                  清匣
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <div className="magic-bag-panel__body">
          {tabs.length === 0 ? (
            <EmptyState />
          ) : filteredTabs.length === 0 ? (
            <div className="magic-bag-empty">
              <p className="magic-bag-empty__title">未检得相符藏页</p>
              <p className="magic-bag-empty__body">
                换一个关键词试试，或清空检索后查看全部收纳。
              </p>
            </div>
          ) : isReorderEnabled ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={tabs.map((tab) => tab.url)} strategy={rectSortingStrategy}>
                <div className="magic-bag-grid">
                  {tabs.map((tab, index) => {
                    const offsetX = (index % 4) * 6;
                    const offsetY = Math.floor(index / 4) * 4;
                    const rotate = ((index % 5) - 2) * 0.8;

                    return (
                      <SortableTabCard
                        key={tab.url}
                        offsetX={offsetX}
                        offsetY={offsetY}
                        onDelete={handleDelete}
                        onTabClick={onTabClick}
                        rotate={rotate}
                        tab={tab}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="magic-bag-grid">
              {filteredTabs.map((tab, index) => {
                const offsetX = (index % 4) * 6;
                const offsetY = Math.floor(index / 4) * 4;
                const rotate = ((index % 5) - 2) * 0.8;

                return (
                  <div
                    key={tab.url}
                    style={{
                      transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`,
                    }}
                  >
                    <TabCard tab={tab} onClick={onTabClick} onDelete={handleDelete} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="清空法宝袋？"
        message="这会移除所有已收纳标签页，且无法撤销。"
        confirmText="确认清匣"
        cancelText="取消"
        onConfirm={handleConfirmClear}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}

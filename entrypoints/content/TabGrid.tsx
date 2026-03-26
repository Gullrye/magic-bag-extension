import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { iconPosition, removeTab, savedTabs } from '~/utils/storage';
import { useClickOutside } from '~/utils/clickOutside';
import { TabCard } from './TabCard';
import { EmptyState } from './EmptyState';
import type { SavedTab } from './types';

interface TabGridProps {
  isOpen: boolean;
  onClose: () => void;
  onTabClick: (url: string) => void;
}

export function TabGrid({ isOpen, onClose, onTabClick }: TabGridProps) {
  const [query, setQuery] = useState('');
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

  // Load initial tabs and watch for changes
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

  // Load icon position for transform-origin (GRID-02 implementation)
  useEffect(() => {
    iconPosition.getValue().then((pos) => {
      setIconPos({ x: pos.x, y: pos.y });
    });
  }, []);

  // Click outside to close (GRID-05)
  useClickOutside(gridRef, onClose);

  // Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={gridRef}
      className="fixed bg-amber-50 border-2 border-amber-700 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-8 w-[80vw] h-[70vh] overflow-auto z-[2147483646]"
      style={{
        // GRID-02: Transform origin from floating icon position
        // This creates the "expands from icon" visual effect
        transformOrigin: `${iconPos.x}px ${iconPos.y}px`,
        animation: 'gridOpen 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        // 棋盘纹理背景
        backgroundImage: `
          linear-gradient(rgba(139, 90, 43, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 90, 43, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
      role="dialog"
      aria-label="法宝袋"
    >
      <div className="mb-6">
        <label className="sr-only" htmlFor="magic-bag-search">
          搜索标题或网址
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-amber-700/80">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            id="magic-bag-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题或网址"
            className="h-11 w-full rounded-[10px] border border-amber-700/30 bg-white/95 pl-11 pr-4 text-[14px] text-gray-700 outline-none transition-colors focus:border-blue-500"
          />
        </div>
      </div>

      {tabs.length === 0 ? (
        <EmptyState />
      ) : filteredTabs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-gray-700">
          <p className="text-[16px] font-semibold text-amber-900">未找到匹配的标签页</p>
          <p className="max-w-sm text-[14px] leading-[1.5] text-gray-600">
            试试更换关键词，或清空搜索后查看全部标签
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-start content-start">
          {filteredTabs.map((tab, index) => {
            // 棋子散落效果：轻微随机偏移
            const offsetX = (index % 5) * 8;
            const offsetY = Math.floor(index / 5) * 6;
            const rotate = ((index % 7) - 3) * 1.5; // 轻微旋转
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
  );
}

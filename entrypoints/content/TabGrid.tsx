import React, { useState, useEffect, useRef } from 'react';
import { savedTabs, iconPosition } from '~/utils/storage';
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
  const [tabs, setTabs] = useState<SavedTab[]>([]);
  const [iconPos, setIconPos] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  // Load initial tabs and watch for changes
  useEffect(() => {
    savedTabs.getValue().then(setTabs);
    const unwatch = savedTabs.watch(setTabs);
    return () => unwatch();
  }, []);

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
      {tabs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-wrap gap-6 justify-start content-start">
          {tabs.map((tab, index) => {
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
                <TabCard tab={tab} onClick={onTabClick} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

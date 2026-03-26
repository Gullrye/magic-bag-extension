import React from 'react';
import type { SavedTab } from './types';

interface TabCardProps {
  tab: SavedTab;
  onClick: (url: string) => void;
}

export function TabCard({ tab, onClick }: TabCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(tab.url);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className="w-[160px] h-[100px] bg-white/98 border border-gray-400 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-3 flex flex-col gap-2 cursor-pointer transition-all duration-150 ease-out hover:shadow-[0_4px_16px_rgba(59,130,246,0.2)] hover:border-blue-500 hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Favicon */}
      <div className="flex-shrink-0">
        {tab.favicon ? (
          <img
            src={tab.favicon}
            alt=""
            className="w-4 h-4"
            data-testid="tab-favicon"
            loading="lazy"
            onError={(e) => {
              // Fallback to generic globe icon
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.fallback-icon')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-icon w-4 h-4';
                fallback.innerHTML = `
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#9CA3AF" stroke-width="1.5"/>
                    <path d="M8 4v4M8 10v2M12 8h-4M4 8h4" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                `;
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="w-4 h-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#9CA3AF" stroke-width="1.5"/>
              <path d="M8 4v4M8 10v2M12 8h-4M4 8h4" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
        )}
      </div>

      {/* Title - truncated to 2 lines */}
      <div className="flex-1 overflow-hidden">
        <p
          className="text-[14px] leading-[1.5] text-gray-700 line-clamp-2"
          title={tab.title}
        >
          {tab.title || 'Untitled'}
        </p>
      </div>
    </div>
  );
}

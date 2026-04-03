import React from 'react';
import { t } from '~/utils/i18n';
import type { SavedTab } from './types';

interface TabCardProps {
  tab: SavedTab;
  onClick: (url: string) => void;
  onDelete?: (url: string) => void;
}

export function TabCard({ tab, onClick, onDelete }: TabCardProps) {
  const hostname = (() => {
    try {
      return new URL(tab.url).hostname.replace(/^www\./, '');
    } catch {
      return tab.url;
    }
  })();

  const collectedAt = new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(tab.timestamp));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(tab.url);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.(tab.url);
  };

  return (
    <article
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className="magic-bag-card"
    >
      <button
        type="button"
        aria-label={t('contentDeleteTab')}
        onMouseDown={handleMouseDown}
        onClick={handleDeleteClick}
        className="magic-bag-card__delete"
      >
        <svg aria-hidden="true" width="10" height="10" viewBox="0 0 16 16" fill="none">
          <path d="M5 5L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M11 5L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className="magic-bag-card__seal">
        {tab.favicon ? (
          <img
            src={tab.favicon}
            alt=""
            className="magic-bag-card__favicon"
            data-testid="tab-favicon"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.fallback-icon')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-icon magic-bag-card__favicon';
                fallback.innerHTML = `
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#9CA3AF" stroke-width="1.5"/>
                    <path d="M8 4v4M8 10v2M12 8h-4M4 8h4" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                `;
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="magic-bag-card__favicon">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#9CA3AF" strokeWidth="1.5" />
              <path d="M8 4v4M8 10v2M12 8h-4M4 8h4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      <div className="magic-bag-card__meta">
        <span className="magic-bag-card__host" title={hostname}>{hostname}</span>
        <span className="magic-bag-card__date">{collectedAt}</span>
      </div>

      <div className="magic-bag-card__title-wrap">
        <h3 className="magic-bag-card__title" title={tab.title}>
          {tab.title || t('contentUntitled')}
        </h3>
      </div>

    </article>
  );
}

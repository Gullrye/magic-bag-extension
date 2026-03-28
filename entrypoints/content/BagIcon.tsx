import { useState, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import { iconPosition } from '~/utils/storage';
import { snapToEdge, clampToBounds, refitToViewport } from '~/utils/drag';
import { t } from '~/utils/i18n';
import type { IconPosition } from './types';

interface BagIconProps {
  onToggleGrid?: () => void;
}

export default function BagIcon({ onToggleGrid }: BagIconProps) {
  const [position, setPosition] = useState<IconPosition>({
    x: 20,
    y: window.innerHeight - 68,
    edge: 'bottom',
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load saved position on mount (ICON-03: position persists)
  useEffect(() => {
    iconPosition.getValue().then((saved) => {
      if (saved) {
        const refitted = refitToViewport(saved);
        setPosition(refitted);

        if (refitted.x !== saved.x || refitted.y !== saved.y) {
          iconPosition.setValue(refitted);
        }
      }
    });
  }, []);

  useEffect(() => {
    const handleViewportChange = () => {
      setPosition((current) => {
        const refitted = refitToViewport(current);

        if (refitted.x !== current.x || refitted.y !== current.y) {
          iconPosition.setValue(refitted);
        }

        return refitted;
      });
    };

    window.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('resize', handleViewportChange);

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  // Handle drag start
  const handleStart = useCallback((e: any, data: any) => {
    setIsDragging(true);
    setDragOffset({ x: data.x, y: data.y });
  }, []);

  // Handle drag - just update visual state
  const handleDrag = useCallback((e: any, data: any) => {
    const clamped = clampToBounds(data.x, data.y);
    setPosition({ x: clamped.x, y: clamped.y, edge: 'bottom' });
  }, []);

  // Handle drag end - snap to edge and save position
  const handleStop = useCallback(
    (e: any, data: any) => {
      setIsDragging(false);

      const clamped = clampToBounds(data.x, data.y);
      const snapped = snapToEdge(clamped.x, clamped.y);

      setPosition(snapped);

      // Persist position to storage (ICON-03)
      iconPosition.setValue(snapped);
    },
    []
  );

  // Visual styles from UI-SPEC.md - Chinese traditional pouch styling
  const wrapperStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    cursor: isDragging ? 'grabbing' : 'grab',
    filter: isDragging
      ? 'drop-shadow(0 8px 16px rgba(30, 30, 30, 0.5))'
      : 'drop-shadow(0 4px 8px rgba(30, 30, 30, 0.4))',
    transform: isDragging
      ? 'scale(1.1)'
      : isHovered
        ? 'scale(1.05)'
        : 'scale(1)',
    transition: isDragging ? 'none' : 'transform 0.2s ease, filter 0.2s ease',
    outline: 'none',
  };

  return (
    <Draggable
      position={{ x: position.x, y: position.y }}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
      bounds="parent" // Constrain to viewport
    >
      <div
        style={wrapperStyle}
        className="magic-bag-trigger"
        data-dragging={isDragging ? 'true' : 'false'}
        data-hovered={isHovered ? 'true' : 'false'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          // Only toggle grid if not dragging (position didn't change significantly)
          const wasDragged = Math.abs(position.x - dragOffset.x) > 5 ||
                            Math.abs(position.y - dragOffset.y) > 5;
          if (!wasDragged) {
            onToggleGrid?.();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={t('contentBagAriaLabel')}
      >
        <div className="magic-bag-trigger__halo" aria-hidden="true" />
        <div className="magic-bag-trigger__badge" aria-hidden="true">{t('contentBagBadge')}</div>
        {/* Chinese traditional pouch (法宝袋) SVG icon */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="pouchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Pouch body - main shape with gathered bottom */}
          <path
            d="M10 18 Q10 16 14 16 L34 16 Q38 16 38 18 L38 32 Q38 42 24 44 Q10 42 10 32 Z"
            fill="url(#pouchGradient)"
            stroke="#991B1B"
            strokeWidth="0.5"
          />

          {/* Fabric texture lines */}
          <path
            d="M14 24 Q24 26 34 24"
            stroke="#991B1B"
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M12 30 Q24 32 36 30"
            stroke="#991B1B"
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
          />

          {/* Gathered top / opening with gold trim */}
          <path
            d="M12 16 Q18 12 24 14 Q30 12 36 16"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tie/cord knot at top */}
          <circle cx="24" cy="11" r="2.5" fill="url(#goldGradient)" />
          <ellipse cx="24" cy="11" rx="3.5" ry="2" fill="none" stroke="#D97706" strokeWidth="1" />

          {/* Cord loops from knot */}
          <path
            d="M21 11 Q18 8 16 10"
            stroke="#D97706"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M27 11 Q30 8 32 10"
            stroke="#D97706"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Small jade seal decoration on pouch */}
          <rect x="20" y="28" width="8" height="8" rx="1" fill="#059669" opacity="0.8" />
          <rect x="21" y="29" width="6" height="6" rx="0.5" fill="none" stroke="#047857" strokeWidth="0.5" opacity="0.6" />

          {/* Tassel at bottom */}
          <path
            d="M18 44 L18 47"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M24 44 L24 48"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M30 44 L30 47"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Tassel beads */}
          <circle cx="18" cy="47" r="1" fill="#FBBF24" />
          <circle cx="24" cy="48" r="1" fill="#FBBF24" />
          <circle cx="30" cy="47" r="1" fill="#FBBF24" />
        </svg>
      </div>
    </Draggable>
  );
}

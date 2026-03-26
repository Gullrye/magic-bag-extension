import { useState, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import { iconPosition } from '~/utils/storage';
import { snapToEdge, clampToBounds } from '~/utils/drag';
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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load saved position on mount (ICON-03: position persists)
  useEffect(() => {
    iconPosition.getValue().then((saved) => {
      if (saved) {
        setPosition(saved);
      }
    });
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

  // Visual styles from UI-SPEC.md
  const iconStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: isDragging ? '#3B82F6' : 'rgba(107, 114, 128, 0.8)', // Blue when dragging, gray otherwise
    border: '1px solid #9CA3AF',
    boxShadow: isDragging
      ? '0 8px 24px rgba(59, 130, 246, 0.3)' // Enhanced shadow during drag
      : '0 4px 12px rgba(0, 0, 0, 0.15)', // Normal shadow
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'box-shadow 0.2s, background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
        style={iconStyle}
        onClick={(e) => {
          // Only toggle grid if not dragging (position didn't change significantly)
          const wasDragged = Math.abs(position.x - dragOffset.x) > 5 ||
                            Math.abs(position.y - dragOffset.y) > 5;
          if (!wasDragged) {
            onToggleGrid?.();
          }
        }}
      >
        {/* Placeholder: Phase 4 will add 国风 icon design */}
        {/* For now, simple circle with visual feedback */}
      </div>
    </Draggable>
  );
}

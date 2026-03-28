import type { IconPosition } from '~/entrypoints/content/types';

const ICON_SIZE = 48; // From D-06
const EDGE_THRESHOLD = 50; // From RESEARCH.md Pattern 3
const EDGE_PADDING = 10; // Distance from edge when snapped

export interface DragBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Calculate drag bounds to prevent icon from going off-screen
 * (RESEARCH.md Pitfall 4: Icon Goes Off-Screen)
 */
export function calculateDragBounds(): DragBounds {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  return {
    left: 0,
    top: 0,
    right: viewportWidth - ICON_SIZE,
    bottom: viewportHeight - ICON_SIZE,
  };
}

/**
 * Snap position to nearest edge if within threshold
 * (CONTEXT.md D-08: snaps to nearest edge when released)
 */
export function snapToEdge(
  x: number,
  y: number
): IconPosition {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate distances to each edge
  const distToLeft = x;
  const distToRight = viewportWidth - (x + ICON_SIZE);
  const distToTop = y;
  const distToBottom = viewportHeight - (y + ICON_SIZE);

  // Find minimum distance
  const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

  // Snap to edge if within threshold
  if (minDist === distToLeft && distToLeft < EDGE_THRESHOLD) {
    return { x: EDGE_PADDING, y, edge: 'left' };
  }
  if (minDist === distToRight && distToRight < EDGE_THRESHOLD) {
    return { x: viewportWidth - ICON_SIZE - EDGE_PADDING, y, edge: 'right' };
  }
  if (minDist === distToTop && distToTop < EDGE_THRESHOLD) {
    return { x, y: EDGE_PADDING, edge: 'top' };
  }
  if (minDist === distToBottom && distToBottom < EDGE_THRESHOLD) {
    return { x, y: viewportHeight - ICON_SIZE - EDGE_PADDING, edge: 'bottom' };
  }

  // No snap - return position as-is with default edge
  return { x, y, edge: 'bottom' };
}

/**
 * Clamp position to viewport bounds to prevent off-screen icon
 */
export function clampToBounds(
  x: number,
  y: number
): { x: number; y: number } {
  const bounds = calculateDragBounds();

  return {
    x: Math.max(bounds.left, Math.min(bounds.right, x)),
    y: Math.max(bounds.top, Math.min(bounds.bottom, y)),
  };
}

/**
 * Refit a saved icon position back into the current viewport.
 * Preserve snapped-edge intent when possible so resize/zoom does not
 * leave the trigger outside the visible area.
 */
export function refitToViewport(position: IconPosition): IconPosition {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const maxX = Math.max(0, viewportWidth - ICON_SIZE - EDGE_PADDING);
  const maxY = Math.max(0, viewportHeight - ICON_SIZE - EDGE_PADDING);

  let nextX = position.x;
  let nextY = position.y;

  if (position.edge === 'left') {
    nextX = EDGE_PADDING;
  } else if (position.edge === 'right') {
    nextX = maxX;
  } else if (position.edge === 'top') {
    nextY = EDGE_PADDING;
  } else if (position.edge === 'bottom') {
    nextY = maxY;
  }

  const clamped = clampToBounds(nextX, nextY);
  return {
    x: clamped.x,
    y: clamped.y,
    edge: position.edge,
  };
}

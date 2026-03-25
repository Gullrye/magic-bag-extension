export interface IconPosition {
  x: number;
  y: number;
  edge: 'top' | 'right' | 'bottom' | 'left';
}

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

import { storage } from 'wxt/supplements';
import type { IconPosition } from '~/entrypoints/content/types';

export const iconPosition = storage.defineItem<IconPosition>('local:iconPosition', {
  fallback: { x: 20, y: window.innerHeight - 68, edge: 'bottom' },
  version: 1,
});

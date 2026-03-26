import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClickOutside } from '~/utils/clickOutside';

describe('useClickOutside Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('Click Detection (GRID-05)', () => {
    it('should call callback when clicking outside', () => {
      const callback = vi.fn();
      const refElement = document.createElement('div');
      refElement.id = 'inside';
      document.body.appendChild(refElement);

      renderHook(() => useClickOutside({ current: refElement }, callback));

      // Simulate click outside (on body)
      const outsideElement = document.createElement('div');
      outsideElement.id = 'outside';
      document.body.appendChild(outsideElement);

      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement, writable: false });
      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call callback when clicking inside', () => {
      const callback = vi.fn();
      const refElement = document.createElement('div');
      refElement.id = 'inside';
      document.body.appendChild(refElement);

      renderHook(() => useClickOutside({ current: refElement }, callback));

      // Simulate click inside
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: refElement, writable: false });
      refElement.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should cleanup event listener on unmount', () => {
      const callback = vi.fn();
      const removeSpy = vi.spyOn(document, 'removeEventListener');
      const refElement = document.createElement('div');

      const { unmount } = renderHook(() => useClickOutside({ current: refElement }, callback));

      unmount();

      expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });
  });
});

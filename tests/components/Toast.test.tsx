import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toast } from '~/entrypoints/content/Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with success variant', () => {
    const onClose = vi.fn();
    render(<Toast message="已收入法宝袋" type="success" onClose={onClose} />);

    expect(screen.getByText('已收入法宝袋')).toBeInTheDocument();
  });

  it('renders with warning variant', () => {
    const onClose = vi.fn();
    render(<Toast message="该标签页已在法宝袋中" type="warning" onClose={onClose} />);

    expect(screen.getByText('该标签页已在法宝袋中')).toBeInTheDocument();
  });

  it('auto-dismisses after 2000ms', () => {
    const onClose = vi.fn();
    render(<Toast message="已收入法宝袋" type="success" onClose={onClose} />);

    // Initially visible
    expect(screen.getByText('已收入法宝袋')).toBeInTheDocument();

    // Fast-forward time
    vi.advanceTimersByTime(2000);

    // After 2000ms, should trigger fade out (set visible to false)
    // But the actual DOM removal happens after 150ms more
    vi.advanceTimersByTime(150);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has correct styling classes', () => {
    const { container } = render(<Toast message="已收入法宝袋" type="success" />);

    const toast = container.firstChild as HTMLElement;
    expect(toast.className).toContain('fixed');
    expect(toast.className).toContain('top-5');
    expect(toast.className).toContain('left-1/2');
    expect(toast.className).toContain('-translate-x-1/2');
    expect(toast.className).toContain('bg-blue-500');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TabGrid } from '~/entrypoints/content/TabGrid';
import { savedTabs, iconPosition } from '~/utils/storage';

// Mock storage
vi.mock('~/utils/storage', () => ({
  savedTabs: {
    getValue: vi.fn(),
    watch: vi.fn(),
  },
  iconPosition: {
    getValue: vi.fn(),
  },
}));

// Mock useClickOutside
vi.mock('~/utils/clickOutside', () => ({
  useClickOutside: vi.fn(),
}));

describe('TabGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    // Default mock implementations
    (savedTabs.getValue as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (savedTabs.watch as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());
    (iconPosition.getValue as ReturnType<typeof vi.fn>).mockResolvedValue({ x: 100, y: 100, edge: 'bottom' });
  });

  it('calls savedTabs.getValue on mount', () => {
    render(<TabGrid isOpen={true} onClose={vi.fn()} onTabClick={vi.fn()} />);

    expect(savedTabs.getValue).toHaveBeenCalled();
  });

  it('calls savedTabs.watch to listen for changes', () => {
    render(<TabGrid isOpen={true} onClose={vi.fn()} onTabClick={vi.fn()} />);

    expect(savedTabs.watch).toHaveBeenCalled();
  });

  it('calls iconPosition.getValue for transform-origin', () => {
    render(<TabGrid isOpen={true} onClose={vi.fn()} onTabClick={vi.fn()} />);

    expect(iconPosition.getValue).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <TabGrid isOpen={false} onClose={vi.fn()} onTabClick={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders when isOpen is true', () => {
    const { container } = render(
      <TabGrid isOpen={true} onClose={vi.fn()} onTabClick={vi.fn()} />
    );

    expect(container.firstChild).not.toBeNull();
  });

  it('has correct styling classes', () => {
    const { container } = render(<TabGrid isOpen={true} onClose={vi.fn()} onTabClick={vi.fn()} />);

    const grid = container.firstChild as HTMLElement;
    expect(grid).toBeInTheDocument();
    expect(grid?.className).toContain('fixed');
    expect(grid?.className).toContain('bg-gray-500/95');
    expect(grid?.className).toContain('border');
  });
});

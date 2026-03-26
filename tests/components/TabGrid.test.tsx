import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TabGrid } from '~/entrypoints/content/TabGrid';
import { iconPosition, removeTab, savedTabs } from '~/utils/storage';

// Mock storage
vi.mock('~/utils/storage', () => ({
  savedTabs: {
    getValue: vi.fn(),
    watch: vi.fn(),
  },
  iconPosition: {
    getValue: vi.fn(),
  },
  removeTab: vi.fn(),
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
    (removeTab as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
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

  it('has correct styling classes', async () => {
    render(<TabGrid isOpen={true} onClose={vi.fn()} onTabClick={vi.fn()} />);

    const grid = await screen.findByRole('dialog', { name: '法宝袋' });
    await waitFor(() => {
      expect(grid.style.transformOrigin).toBe('100px 100px');
    });

    expect(grid).toBeInTheDocument();
    expect(grid.className).toContain('fixed');
    expect(grid.className).toContain('bg-amber-50');
    expect(grid.className).toContain('border-amber-700');
  });

  it('renders a search field in the grid header', async () => {
    render(<TabGrid isOpen={true} onClose={vi.fn()} onTabClick={vi.fn()} />);

    expect(await screen.findByPlaceholderText('搜索标题或网址')).toBeInTheDocument();
  });

  it('filters tabs by title and URL using a search query', async () => {
    (savedTabs.getValue as ReturnType<typeof vi.fn>).mockResolvedValue([
      { url: 'https://alpha.dev', title: 'Alpha Notes', timestamp: 1 },
      { url: 'https://docs.example.com/guide', title: 'Guide', timestamp: 2 },
    ]);

    render(<TabGrid isOpen={true} onClose={vi.fn()} onTabClick={vi.fn()} />);

    expect(await screen.findByText('Alpha Notes')).toBeInTheDocument();
    expect(screen.getByText('Guide')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('搜索标题或网址'), {
      target: { value: 'ALPHA' },
    });

    await waitFor(() => {
      expect(screen.getByText('Alpha Notes')).toBeInTheDocument();
      expect(screen.queryByText('Guide')).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('搜索标题或网址'), {
      target: { value: 'DOCS.EXAMPLE.COM' },
    });

    await waitFor(() => {
      expect(screen.getByText('Guide')).toBeInTheDocument();
      expect(screen.queryByText('Alpha Notes')).not.toBeInTheDocument();
    });
  });

  it('resets the search query when the grid is reopened', async () => {
    (savedTabs.getValue as ReturnType<typeof vi.fn>).mockResolvedValue([
      { url: 'https://alpha.dev', title: 'Alpha Notes', timestamp: 1 },
    ]);

    const { rerender } = render(
      <TabGrid isOpen={true} onClose={vi.fn()} onTabClick={vi.fn()} />
    );

    const searchInput = await screen.findByPlaceholderText('搜索标题或网址');
    fireEvent.change(searchInput, { target: { value: 'alpha' } });
    expect(searchInput).toHaveValue('alpha');

    rerender(<TabGrid isOpen={false} onClose={vi.fn()} onTabClick={vi.fn()} />);
    rerender(<TabGrid isOpen={true} onClose={vi.fn()} onTabClick={vi.fn()} />);

    expect(await screen.findByPlaceholderText('搜索标题或网址')).toHaveValue('');
  });

  it('shows a no-results state when saved tabs exist but no search results match', async () => {
    (savedTabs.getValue as ReturnType<typeof vi.fn>).mockResolvedValue([
      { url: 'https://alpha.dev', title: 'Alpha Notes', timestamp: 1 },
    ]);

    render(<TabGrid isOpen={true} onClose={vi.fn()} onTabClick={vi.fn()} />);

    fireEvent.change(await screen.findByPlaceholderText('搜索标题或网址'), {
      target: { value: 'missing' },
    });

    expect(await screen.findByText('未找到匹配的标签页')).toBeInTheDocument();
    expect(screen.getByText('试试更换关键词，或清空搜索后查看全部标签')).toBeInTheDocument();
    expect(screen.queryByText('Alpha Notes')).not.toBeInTheDocument();
  });

  it('removes a tab from the grid when its delete action is pressed', async () => {
    (savedTabs.getValue as ReturnType<typeof vi.fn>).mockResolvedValue([
      { url: 'https://alpha.dev', title: 'Alpha Notes', timestamp: 1 },
      { url: 'https://docs.example.com/guide', title: 'Guide', timestamp: 2 },
    ]);

    render(<TabGrid isOpen={true} onClose={vi.fn()} onTabClick={vi.fn()} />);

    expect(await screen.findByText('Alpha Notes')).toBeInTheDocument();
    fireEvent.click((await screen.findAllByRole('button', { name: '删除标签页' }))[0]);

    await waitFor(() => {
      expect(removeTab).toHaveBeenCalledWith('https://alpha.dev');
      expect(screen.queryByText('Alpha Notes')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Guide')).toBeInTheDocument();
  });

  it('keeps the active filter after deleting the only matching tab', async () => {
    (savedTabs.getValue as ReturnType<typeof vi.fn>).mockResolvedValue([
      { url: 'https://alpha.dev', title: 'Alpha Notes', timestamp: 1 },
      { url: 'https://docs.example.com/guide', title: 'Guide', timestamp: 2 },
    ]);

    render(<TabGrid isOpen={true} onClose={vi.fn()} onTabClick={vi.fn()} />);

    fireEvent.change(await screen.findByPlaceholderText('搜索标题或网址'), {
      target: { value: 'alpha' },
    });

    fireEvent.click((await screen.findAllByRole('button', { name: '删除标签页' }))[0]);

    await waitFor(() => {
      expect(removeTab).toHaveBeenCalledWith('https://alpha.dev');
      expect(screen.getByPlaceholderText('搜索标题或网址')).toHaveValue('alpha');
      expect(screen.getByText('未找到匹配的标签页')).toBeInTheDocument();
    });

    expect(screen.queryByText('Guide')).not.toBeInTheDocument();
  });

  it.todo('opens a clear-all confirmation flow from the grid header');
  it.todo('supports drag-to-reorder interactions');
});

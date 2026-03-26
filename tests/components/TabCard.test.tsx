import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabCard } from '~/entrypoints/content/TabCard';
import type { SavedTab } from '~/entrypoints/content/types';

describe('TabCard', () => {
  const mockTab: SavedTab = {
    url: 'https://example.com',
    title: 'Example Page',
    favicon: 'https://example.com/favicon.ico',
    timestamp: Date.now(),
  };

  it('renders favicon and title', () => {
    const onClick = vi.fn();
    render(<TabCard tab={mockTab} onClick={onClick} />);

    const favicon = screen.queryByTestId('tab-favicon');
    expect(favicon).toBeInTheDocument();
    expect(favicon).toHaveAttribute('src', mockTab.favicon);

    const title = screen.getByText(mockTab.title);
    expect(title).toBeInTheDocument();
  });

  it('calls onClick with URL when clicked', () => {
    const onClick = vi.fn();
    render(<TabCard tab={mockTab} onClick={onClick} />);

    const card = screen.getByText(mockTab.title).closest('div') as HTMLElement;
    fireEvent.click(card);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(mockTab.url);
  });

  it('renders fallback icon when favicon missing', () => {
    const tabWithoutFavicon: SavedTab = {
      url: 'https://example.com',
      title: 'Example Page',
      timestamp: Date.now(),
    };
    const onClick = vi.fn();

    render(<TabCard tab={tabWithoutFavicon} onClick={onClick} />);

    // Should not render img, should render SVG
    const favicon = screen.queryByTestId('tab-favicon');
    expect(favicon).not.toBeInTheDocument();

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders a delete affordance with an accessible label', async () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();

    render(<TabCard {...({ tab: mockTab, onClick, onDelete } as any)} />);

    expect(await screen.findByRole('button', { name: '删除标签页' })).toBeInTheDocument();
  });

  it('does not call onClick when the delete affordance is pressed', async () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();

    render(<TabCard tab={mockTab} onClick={onClick} onDelete={onDelete} />);

    fireEvent.click(await screen.findByRole('button', { name: '删除标签页' }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockTab.url);
    expect(onClick).not.toHaveBeenCalled();
  });
});

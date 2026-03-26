import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '~/entrypoints/content/EmptyState';

describe('EmptyState', () => {
  it('renders toast-style message', () => {
    render(<EmptyState />);

    expect(screen.getByText('法宝袋是空的')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = render(<EmptyState />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('flex');
    expect(wrapper.className).toContain('items-center');
    expect(wrapper.className).toContain('justify-center');
  });
});

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ConfirmDialog } from '~/entrypoints/content/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('renders confirm and cancel actions for clear-all', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="清空法宝袋？"
        message="这会移除所有已收纳标签页，且无法撤销。"
        confirmText="确认清空"
        cancelText="取消"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('清空法宝袋？')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '确认清空' })).toBeInTheDocument();
  });

  it('calls onConfirm when the destructive action is chosen', () => {
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        title="清空法宝袋？"
        message="这会移除所有已收纳标签页，且无法撤销。"
        confirmText="确认清空"
        cancelText="取消"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '确认清空' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the safe action is chosen', () => {
    const onCancel = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        title="清空法宝袋？"
        message="这会移除所有已收纳标签页，且无法撤销。"
        confirmText="确认清空"
        cancelText="取消"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '取消' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

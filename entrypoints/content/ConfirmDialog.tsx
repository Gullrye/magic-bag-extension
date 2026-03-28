import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="magic-bag-dialog-backdrop">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="magic-bag-confirm-title"
        className="magic-bag-dialog"
      >
        <p className="magic-bag-dialog__eyebrow">谨慎操作</p>
        <h2 id="magic-bag-confirm-title" className="magic-bag-dialog__title">
          {title}
        </h2>
        <p className="magic-bag-dialog__body">{message}</p>
        <div className="magic-bag-dialog__actions">
          <button
            type="button"
            onClick={onCancel}
            className="magic-bag-dialog__button magic-bag-dialog__button--secondary"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="magic-bag-dialog__button magic-bag-dialog__button--danger"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

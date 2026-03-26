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
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/40 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="magic-bag-confirm-title"
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
      >
        <h2 id="magic-bag-confirm-title" className="mb-2 text-[16px] font-semibold text-gray-900">
          {title}
        </h2>
        <p className="mb-5 text-[14px] leading-[1.5] text-gray-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-lg border border-gray-300 px-4 text-[14px] font-medium text-gray-700"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-11 rounded-lg bg-red-600 px-4 text-[14px] font-medium text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

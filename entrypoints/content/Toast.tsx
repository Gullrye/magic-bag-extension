import React, { useEffect, useState } from 'react';

type ToastType = 'success' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose?: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 2000ms (per UI-SPEC)
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 150); // Wait for fade-out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      className="magic-bag-toast"
      data-type={type}
      style={{ animation: 'toastFadeIn 150ms ease-out' }}
    >
      <span className="magic-bag-toast__dot" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

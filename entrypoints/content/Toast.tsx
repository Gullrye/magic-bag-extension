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

  const bgColor = type === 'success' ? 'bg-blue-500' : 'bg-red-500';

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 ${bgColor} text-white px-3 py-2 rounded-lg text-[12px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[2147483647]`}
      style={{ animation: 'toastFadeIn 150ms ease-out' }}
    >
      {message}
    </div>
  );
}

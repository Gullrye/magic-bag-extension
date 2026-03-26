import React from 'react';

export function EmptyState() {
  return (
    <div className="flex items-center justify-center py-12 px-6">
      <div className="bg-gray-400/90 text-white px-4 py-2 rounded-lg text-[14px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
        法宝袋是空的
      </div>
    </div>
  );
}

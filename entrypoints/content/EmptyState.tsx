import React from 'react';

export function EmptyState() {
  return (
    <div className="magic-bag-empty">
      <p className="magic-bag-empty__title">匣中暂无藏页</p>
      <p className="magic-bag-empty__body">
        在任意页面点击法宝袋，即可把眼前页签收入此匣，稍后再慢慢翻看。
      </p>
    </div>
  );
}

import { useState, useRef } from 'react';
import { savedTabs, addTab } from '~/utils/storage';
import type { SavedTab } from '~/entrypoints/content/types';

// Inline Toast component (options page cannot import from content script)
type ToastType = 'success' | 'warning';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export function OptionsPage() {
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'success' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ visible: true, message, type });
    // Auto-dismiss after 2000ms
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'success' });
    }, 2000);
  };

  const handleExport = async () => {
    try {
      const tabs = await savedTabs.getValue();
      const json = JSON.stringify(tabs, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Use chrome.downloads.download API
      chrome.downloads.download({
        url,
        filename: `magic-bag-tabs-${new Date().toISOString().split('T')[0]}.json`,
        saveAs: true
      });

      showToast(`已导出 ${tabs.length} 个标签页`, 'success');
    } catch (error) {
      showToast(`导出失败：${error}`, 'warning');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedTabs: SavedTab[] = JSON.parse(text);

      // Validate that it's an array
      if (!Array.isArray(importedTabs)) {
        throw new Error('Invalid format: expected an array');
      }

      let importedCount = 0;
      for (const tab of importedTabs) {
        // Validate required fields
        if (!tab.url || !tab.title) continue;

        const added = await addTab(tab); // addTab handles duplicate check
        if (added) importedCount++;
      }

      showToast(`已导入 ${importedCount} 个标签页`, 'success');
    } catch (error) {
      showToast(`导入失败：${error}`, 'warning');
    }

    // Reset file input so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="options-page">
      <div className="options-page__grain" aria-hidden="true" />
      <div className="options-page__shell">
        <header className="options-page__hero">
          <p className="options-page__eyebrow">法宝袋设置</p>
          <h1 className="options-page__title">藏阁整备</h1>
          <p className="options-page__lead">
            统一整理你的收纳记录。导出做备份，导入做迁移，让法宝袋始终像一只井然有序的漆匣。
          </p>
        </header>

        <section className="options-page__grid">
          <article className="options-card">
            <p className="options-card__eyebrow">备份</p>
            <h2 className="options-card__title">导出标签页</h2>
            <p className="options-card__body">
              将所有已收纳的标签页导出为 JSON 文件，可用于备份或迁移。
            </p>
            <button onClick={handleExport} className="options-card__button">
              导出 JSON
            </button>
          </article>

          <article className="options-card">
            <p className="options-card__eyebrow">归档</p>
            <h2 className="options-card__title">导入标签页</h2>
            <p className="options-card__body">
              从 JSON 文件导入标签页。导入的标签会添加到现有标签中，重复的网址会被跳过。
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={handleSelectFile}
              className="options-card__button options-card__button--secondary"
            >
              选择文件
            </button>
          </article>
        </section>

        <section className="options-note">
          <p className="options-note__label">说明</p>
          <p className="options-note__body">
            导入与导出仅处理法宝袋的标签页数据，不会修改浏览器中当前已打开的标签页。
          </p>
        </section>
      </div>

      {toast.visible && (
        <div className="options-toast" data-type={toast.type}>
          <span className="options-toast__dot" aria-hidden="true" />
          <span>{toast.message}</span>
        </div>
      )}
    </main>
  );
}

import { useRef, useState } from 'react';
import { addTab, savedTabs } from '~/utils/storage';
import type { SavedTab } from '~/entrypoints/content/types';

type ToastType = 'success' | 'warning';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export function PopupPage() {
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'success' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'success' });
    }, 2000);
  };

  const handleShowPanel = async () => {
    try {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!activeTab?.id) {
        showToast('未找到当前标签页', 'warning');
        return;
      }

      await chrome.tabs.sendMessage(activeTab.id, { type: 'open-grid' });
      showToast('已在当前标签页展示面板', 'success');
    } catch (error) {
      showToast('当前页面暂时无法展示面板', 'warning');
    }
  };

  const handleExport = async () => {
    try {
      const tabs = await savedTabs.getValue();
      const json = JSON.stringify(tabs, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      chrome.downloads.download({
        url,
        filename: `magic-bag-tabs-${new Date().toISOString().split('T')[0]}.json`,
        saveAs: true,
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

      if (!Array.isArray(importedTabs)) {
        throw new Error('Invalid format: expected an array');
      }

      let importedCount = 0;
      for (const tab of importedTabs) {
        if (!tab.url || !tab.title) continue;

        const added = await addTab(tab);
        if (added) importedCount++;
      }

      showToast(`已导入 ${importedCount} 个标签页`, 'success');
    } catch (error) {
      showToast(`导入失败：${error}`, 'warning');
    }

    if (event.target) {
      event.target.value = '';
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="popup-page">
      <div className="popup-page__grain" aria-hidden="true" />
      <div className="popup-page__shell">
        <header className="popup-page__hero">
          <p className="popup-page__eyebrow">法宝袋</p>
          <h1 className="popup-page__title">藏阁整备</h1>
          <p className="popup-page__lead">
            常用操作在此即开即用，当前页主面板也可以直接唤起。
          </p>
          <button type="button" onClick={handleShowPanel} className="popup-page__primary">
            展示面板
          </button>
        </header>

        <section className="popup-page__grid">
          <article className="popup-card">
            <p className="popup-card__eyebrow">备份</p>
            <h2 className="popup-card__title">导出标签页</h2>
            <p className="popup-card__body">
              将所有已收纳的标签页导出为 JSON 文件，可用于备份或迁移。
            </p>
            <button type="button" onClick={handleExport} className="popup-card__button">
              导出 JSON
            </button>
          </article>

          <article className="popup-card">
            <p className="popup-card__eyebrow">归档</p>
            <h2 className="popup-card__title">导入标签页</h2>
            <p className="popup-card__body">
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
              type="button"
              onClick={handleSelectFile}
              className="popup-card__button popup-card__button--secondary"
            >
              选择文件
            </button>
          </article>
        </section>
      </div>

      {toast.visible && (
        <div className="popup-toast" data-type={toast.type}>
          <span className="popup-toast__dot" aria-hidden="true" />
          <span>{toast.message}</span>
        </div>
      )}
    </main>
  );
}

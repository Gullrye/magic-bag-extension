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
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-[480px] mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900">法宝袋设置</h1>

        {/* Export Section */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-amber-700/20">
          <h2 className="text-base font-semibold text-amber-900 mb-2">导出标签页</h2>
          <p className="text-sm text-gray-600 mb-4">
            将所有已收纳的标签页导出为 JSON 文件，可用于备份或迁移。
          </p>
          <button
            onClick={handleExport}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium min-h-[48px] transition-colors"
          >
            导出 JSON
          </button>
        </div>

        {/* Import Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-700/20">
          <h2 className="text-base font-semibold text-amber-900 mb-2">导入标签页</h2>
          <p className="text-sm text-gray-600 mb-4">
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium min-h-[48px] transition-colors"
          >
            选择文件
          </button>
        </div>

        {/* Toast */}
        {toast.visible && (
          <div
            className={`fixed top-5 left-1/2 -translate-x-1/2 ${
              toast.type === 'success' ? 'bg-blue-500' : 'bg-red-500'
            } text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg`}
            style={{ animation: 'toastFadeIn 150ms ease-out' }}
          >
            {toast.message}
          </div>
        )}
      </div>

      <style>{`
        @keyframes toastFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

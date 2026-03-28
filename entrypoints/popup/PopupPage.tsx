import { useRef, useState } from 'react';
import { addTab, savedTabs } from '~/utils/storage';
import type { SavedTab } from '~/entrypoints/content/types';
import { t } from '~/utils/i18n';

type ToastType = 'success' | 'warning';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export function PopupPage() {
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'success' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCollectCurrentTab = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'collect-current-tab' });

      if (response?.status === 'success') {
        showToast(t('popupCollectSuccess'), 'success');
        return;
      }

      if (response?.status === 'duplicate') {
        showToast(t('popupCollectDuplicate'), 'warning');
        return;
      }

      showToast(t('popupCollectError'), 'warning');
    } catch (error) {
      showToast(t('popupCollectError'), 'warning');
    }
  };

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
        showToast(t('popupMissingCurrentTab'), 'warning');
        return;
      }

      await chrome.tabs.sendMessage(activeTab.id, { type: 'open-grid' });
      showToast(t('popupShowPanelSuccess'), 'success');
    } catch (error) {
      showToast(t('popupShowPanelError'), 'warning');
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

      showToast(t('popupExportSuccess', { count: tabs.length }), 'success');
    } catch (error) {
      showToast(t('popupExportError', { error: String(error) }), 'warning');
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

      showToast(t('popupImportSuccess', { count: importedCount }), 'success');
    } catch (error) {
      showToast(t('popupImportError', { error: String(error) }), 'warning');
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
          <p className="popup-page__eyebrow">{t('extName')}</p>
          <h1 className="popup-page__title">{t('popupTitle')}</h1>
          <p className="popup-page__lead">
            {t('popupLead')}
          </p>
          <div className="popup-page__hero-actions">
            <button type="button" onClick={handleCollectCurrentTab} className="popup-page__primary">
              <span className="popup-page__primary-label">{t('popupCollectTab')}</span>
              <span className="popup-page__primary-badge">{t('popupCloseCurrentTab')}</span>
            </button>
            <button type="button" onClick={handleShowPanel} className="popup-page__secondary">
              {t('popupShowPanel')}
            </button>
          </div>
        </header>

        <section className="popup-page__grid">
          <article className="popup-card">
            <p className="popup-card__eyebrow">{t('popupExportEyebrow')}</p>
            <h2 className="popup-card__title">{t('popupExportTitle')}</h2>
            <p className="popup-card__body">
              {t('popupExportBody')}
            </p>
            <button type="button" onClick={handleExport} className="popup-card__button">
              {t('popupExportButton')}
            </button>
          </article>

          <article className="popup-card">
            <p className="popup-card__eyebrow">{t('popupImportEyebrow')}</p>
            <h2 className="popup-card__title">{t('popupImportTitle')}</h2>
            <p className="popup-card__body">
              {t('popupImportBody')}
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
              {t('popupImportButton')}
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

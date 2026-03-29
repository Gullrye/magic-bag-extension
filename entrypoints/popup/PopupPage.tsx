import { useEffect, useRef, useState } from 'react';
import { addTab, localePreference, savedTabs } from '~/utils/storage';
import type { SavedTab } from '~/entrypoints/content/types';
import { setRuntimeLocalePreference, t, type LocalePreference } from '~/utils/i18n';
import {
  bindSyncFile,
  exportTabsToBoundFile,
  getSyncFileName,
  importTabsFromBoundFile,
} from '~/utils/fileSync';

type ToastType = 'success' | 'warning';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export function PopupPage() {
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'success' });
  const [locale, setLocale] = useState<LocalePreference>('system');
  const [syncFileName, setSyncFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localePreference.getValue().then((preference) => {
      setRuntimeLocalePreference(preference);
      setLocale(preference);
    });

    const unwatch = localePreference.watch((preference) => {
      setRuntimeLocalePreference(preference);
      setLocale(preference);
    });

    return () => unwatch();
  }, []);

  useEffect(() => {
    getSyncFileName().then(setSyncFileName).catch(() => setSyncFileName(null));
  }, []);

  const handleLocaleChange = async (preference: LocalePreference) => {
    setRuntimeLocalePreference(preference);
    setLocale(preference);
    await localePreference.setValue(preference);
    try {
      await chrome.runtime.sendMessage({ type: 'set-locale-preference', preference });
    } catch {
      // ignore background refresh failures; popup/content still rerender from storage
    }
  };

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

  const importTabs = async (
    tabs: SavedTab[],
    buildSuccessMessage: (importedCount: number) => string,
  ) => {
    let importedCount = 0;

    for (const tab of tabs) {
      if (!tab.url || !tab.title) continue;
      const added = await addTab(tab);
      if (added) importedCount++;
    }

    showToast(buildSuccessMessage(importedCount), 'success');
  };

  const handleBindSyncFile = async () => {
    try {
      const fileName = await bindSyncFile();
      setSyncFileName(fileName);
      showToast(t('popupSyncBindSuccess', { fileName }), 'success');
    } catch (error) {
      const code = error instanceof Error ? error.name : 'SYNC_ERROR';
      if (code === 'AbortError' || code === 'SYNC_PICKER_CANCELLED') {
        return;
      }
      if (code === 'SYNC_UNSUPPORTED') {
        showToast(t('popupSyncUnsupported'), 'warning');
        return;
      }
      if (code === 'SYNC_PERMISSION_DENIED') {
        showToast(t('popupSyncPermissionDenied'), 'warning');
        return;
      }
      showToast(t('popupSyncActionError'), 'warning');
    }
  };

  const handleImportFromSyncFile = async () => {
    try {
      const tabs = await importTabsFromBoundFile();
      await importTabs(tabs, (count) => t('popupSyncImportSuccess', { count }));
    } catch (error) {
      const code = error instanceof Error ? error.name : 'SYNC_ERROR';
      if (code === 'SYNC_NOT_BOUND') {
        showToast(t('popupSyncNeedBind'), 'warning');
        return;
      }
      if (code === 'SYNC_PERMISSION_DENIED') {
        showToast(t('popupSyncPermissionDenied'), 'warning');
        return;
      }
      if (code === 'SYNC_INVALID_FORMAT' || error instanceof SyntaxError) {
        showToast(t('popupSyncInvalidFile'), 'warning');
        return;
      }
      showToast(t('popupSyncActionError'), 'warning');
    }
  };

  const handleExportToSyncFile = async () => {
    try {
      const tabs = await savedTabs.getValue();
      await exportTabsToBoundFile(tabs);
      showToast(t('popupSyncExportSuccess', { count: tabs.length }), 'success');
    } catch (error) {
      const code = error instanceof Error ? error.name : 'SYNC_ERROR';
      if (code === 'SYNC_NOT_BOUND') {
        showToast(t('popupSyncNeedBind'), 'warning');
        return;
      }
      if (code === 'SYNC_PERMISSION_DENIED') {
        showToast(t('popupSyncPermissionDenied'), 'warning');
        return;
      }
      showToast(t('popupSyncActionError'), 'warning');
    }
  };

  return (
    <main className="popup-page">
      <div className="popup-page__grain" aria-hidden="true" />
      <div className="popup-page__shell">
        <header className="popup-page__hero">
          <div className="popup-page__hero-top">
            <h1 className="popup-page__title">
              {t('popupTitle')}
              <span className="popup-tooltip" tabIndex={0} role="button" aria-label={t('popupTooltipHint')}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="8" r="1" fill="currentColor" />
                </svg>
                <span className="popup-tooltip__content">{t('popupLead')}</span>
              </span>
            </h1>
            <div className="popup-page__locale" aria-label={t('popupLanguageLabel')}>
              <div className="popup-page__locale-switch">
                <button
                  type="button"
                  className="popup-page__locale-button"
                  data-active={locale === 'system'}
                  onClick={() => handleLocaleChange('system')}
                >
                  {t('popupLanguageAuto')}
                </button>
                <button
                  type="button"
                  className="popup-page__locale-button"
                  data-active={locale === 'zh'}
                  onClick={() => handleLocaleChange('zh')}
                >
                  {t('popupLanguageZh')}
                </button>
                <button
                  type="button"
                  className="popup-page__locale-button"
                  data-active={locale === 'en'}
                  onClick={() => handleLocaleChange('en')}
                >
                  {t('popupLanguageEn')}
                </button>
              </div>
            </div>
          </div>
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
            <h2 className="popup-card__title">
              {t('popupSyncTitle')}
              <span className="popup-tooltip" tabIndex={0} role="button" aria-label={t('popupTooltipHint')}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="8" r="1" fill="currentColor" />
                </svg>
                <span className="popup-tooltip__content">{t('popupSyncHint')}</span>
              </span>
            </h2>
            <p className="popup-card__body">
              {syncFileName
                ? t('popupSyncBound', { fileName: syncFileName })
                : t('popupSyncUnbound')}
            </p>
            <div className="popup-card__actions">
              <button type="button" onClick={handleExportToSyncFile} className="popup-card__button">
                {t('popupSyncExport')}
              </button>
              <button type="button" onClick={handleImportFromSyncFile} className="popup-card__button popup-card__button--secondary">
                {t('popupSyncImport')}
              </button>
              <button type="button" onClick={handleBindSyncFile} className="popup-card__text-action">
                {syncFileName ? t('popupSyncChangeFile') : t('popupSyncBind')}
              </button>
            </div>
          </article>

          <article className="popup-card">
            <h2 className="popup-card__title">
              {t('popupIoTitle')}
              <span className="popup-tooltip" tabIndex={0} role="button" aria-label={t('popupTooltipHint')}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="8" r="1" fill="currentColor" />
                </svg>
                <span className="popup-tooltip__content">{t('popupIoHint')}</span>
              </span>
            </h2>
            <div className="popup-card__actions">
              <button type="button" onClick={handleExport} className="popup-card__button">
                {t('popupExportButton')}
              </button>
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
            </div>
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

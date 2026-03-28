import { addTab } from '~/utils/storage';
import type { SavedTab } from '~/entrypoints/content/types';
import { localePreference } from '~/utils/storage';
import { setRuntimeLocalePreference, t, type LocalePreference } from '~/utils/i18n';

let contextMenuRefreshPromise: Promise<void> | null = null;

function removeAllContextMenus(): Promise<void> {
  return new Promise((resolve) => {
    if (!chrome.contextMenus.removeAll) {
      resolve();
      return;
    }

    chrome.contextMenus.removeAll(() => {
      resolve();
    });
  });
}

function createSaveTabMenu(): Promise<void> {
  return new Promise((resolve) => {
    chrome.contextMenus.create({
      id: 'save-tab-to-bag',
      title: t('contextMenuSaveTab'),
      contexts: ['page'],
    }, () => {
      const error = chrome.runtime.lastError;
      if (error && !error.message?.includes('duplicate id')) {
        console.debug('Context menu create failed:', error.message);
      }
      resolve();
    });
  });
}

async function refreshContextMenu(preference?: LocalePreference) {
  if (contextMenuRefreshPromise) {
    await contextMenuRefreshPromise;
  }

  contextMenuRefreshPromise = (async () => {
  const nextPreference = preference ?? await localePreference.getValue();
  setRuntimeLocalePreference(nextPreference);
    await removeAllContextMenus();
    await createSaveTabMenu();
  })();

  try {
    await contextMenuRefreshPromise;
  } finally {
    contextMenuRefreshPromise = null;
  }
}

export default defineBackground(() => {
  // Register context menu on install (per RESEARCH.md Pattern 1)
  chrome.runtime.onInstalled.addListener(() => {
    void refreshContextMenu();
  });

  chrome.runtime.onStartup?.addListener?.(() => {
    void refreshContextMenu();
  });

  void refreshContextMenu();

  // Handle context menu clicks (per RESEARCH.md Pattern 1)
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'save-tab-to-bag' && tab?.url) {
      await collectTab(tab);
    }
  });

  // Handle open-tab message from content script (GRID-04)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'open-tab' && message.url) {
      chrome.tabs.create({ url: message.url });
      return;
    }

    if (message.type === 'collect-current-tab') {
      void (async () => {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!activeTab?.id || !activeTab.url) {
          sendResponse({ status: 'missing-tab' });
          return;
        }

        const added = await collectTab(activeTab);
        sendResponse({ status: added ? 'success' : 'duplicate' });
      })().catch((error) => {
        console.debug('Collect current tab failed:', error);
        sendResponse({ status: 'error' });
      });

      return true;
    }

    if (message.type === 'set-locale-preference' && message.preference) {
      void refreshContextMenu(message.preference as LocalePreference)
        .then(() => sendResponse({ status: 'ok' }))
        .catch(() => sendResponse({ status: 'error' }));
      return true;
    }
  });
});

export async function collectTab(tab: chrome.tabs.Tab): Promise<boolean> {
  if (!tab.url || !tab.id) return false;

  // Capture tab data (per CONTEXT.md D-08)
  const tabData: SavedTab = {
    url: tab.url,
    title: tab.title || 'Untitled',
    favicon: tab.favIconUrl,
    timestamp: Date.now(),
  };

  // Save to storage (addTab handles duplicate check per D-09, newest-first per D-10)
  const added = await addTab(tabData);

  if (added) {
    // Close original tab (per COLL-03)
    await chrome.tabs.remove(tab.id);

    // Send success toast to content script with error handling
    // Race condition: Tab might close before message arrives
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'success-toast' });
    } catch (error) {
      // Tab already closed or content script not ready - silent failure
      // This is expected behavior when tab closes immediately
      console.debug('Toast message not sent (tab closed):', error);
    }
  } else {
    // Send duplicate warning to content script with error handling
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'duplicate-warning' });
    } catch (error) {
      // Content script not ready - silent failure
      console.debug('Warning toast not sent:', error);
    }
  }

  return added;
}

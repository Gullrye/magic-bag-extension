import { addTab } from '~/utils/storage';
import type { SavedTab } from '~/entrypoints/content/types';

export default defineBackground(() => {
  // Register context menu on install (per RESEARCH.md Pattern 1)
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'save-tab-to-bag',
      title: '将标签页收入法宝袋', // CONTEXT.md D-01
      contexts: ['page'],
    });
  });

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

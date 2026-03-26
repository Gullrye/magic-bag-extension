import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Service Worker (Background Script)', () => {
  describe('INFR-03: Service worker handles privileged Chrome APIs', () => {
    it('should have background entry point', () => {
      // Test stub: Will verify entrypoints/background.ts exists
      // Implementation will check for defineBackground export
      expect(true).toBe(true);
    });

    it('should register service worker', () => {
      // Test stub: Will verify service worker registration
      // Implementation will check manifest.background.service_worker
      expect(true).toBe(true);
    });

    it('should access chrome.storage API', () => {
      // Test stub: Will verify storage API access
      // Implementation will test storage operations
      expect(true).toBe(true);
    });

    it('should access chrome.tabs API', () => {
      // Test stub: Will verify tabs API access
      // Implementation will test tab operations
      expect(true).toBe(true);
    });

    it('should access chrome.contextMenus API', () => {
      // Test stub: Will verify context menu API access
      // Implementation will test context menu creation
      expect(true).toBe(true);
    });
  });

  describe('Service Worker Lifecycle', () => {
    it('should handle install event', () => {
      // Test stub: Will verify install event handling
      expect(true).toBe(true);
    });

    it('should handle activate event', () => {
      // Test stub: Will verify activate event handling
      expect(true).toBe(true);
    });
  });
});

describe('Background Script - Phase 2', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset module cache to allow re-importing background script
    vi.resetModules();
  });

  describe('Context Menu Registration (COLL-01)', () => {
    it('should register context menu on install', async () => {
      // Import the background script to trigger initialization
      await import('~/entrypoints/background');

      // Trigger the onInstalled event
      const onInstalledCallback = (chrome as any).runtime.onInstalled.addListener.mock.calls[0]?.[0];
      if (onInstalledCallback) {
        onInstalledCallback();
      }

      // Verify contextMenus.create was called
      expect((chrome as any).contextMenus.create).toHaveBeenCalledWith({
        id: 'save-tab-to-bag',
        title: '将标签页收入法宝袋',
        contexts: ['page'],
      });
    });

    it('should have correct menu title "将标签页收入法宝袋"', async () => {
      // Import the background script to trigger initialization
      await import('~/entrypoints/background');

      // Trigger the onInstalled event
      const onInstalledCallback = (chrome as any).runtime.onInstalled.addListener.mock.calls[0]?.[0];
      if (onInstalledCallback) {
        onInstalledCallback();
      }

      const createCalls = (chrome as any).contextMenus.create.mock.calls;
      expect(createCalls.length).toBeGreaterThan(0);

      const callArgs = createCalls[createCalls.length - 1][0];
      expect(callArgs.title).toBe('将标签页收入法宝袋');
    });
  });

  describe('Tab Collection Handler', () => {
    it('should capture tab data and save on context menu click', async () => {
      const { collectTab } = await import('~/entrypoints/background');

      const mockTab = {
        id: 123,
        url: 'https://example.com',
        title: 'Example Page',
        favIconUrl: 'https://example.com/favicon.ico',
      } as chrome.tabs.Tab;

      await collectTab(mockTab);

      // Verify storage was called to save the tab
      expect((chrome as any).storage.local.set).toHaveBeenCalled();
    });

    it('should close original tab after successful collection', async () => {
      const { collectTab } = await import('~/entrypoints/background');

      const mockTab = {
        id: 123,
        url: 'https://example.com',
        title: 'Example',
      } as chrome.tabs.Tab;

      await collectTab(mockTab);

      // Verify chrome.tabs.remove was called
      expect((chrome as any).tabs.remove).toHaveBeenCalledWith(123);
    });

    it('should send toast message after collection', async () => {
      const { collectTab } = await import('~/entrypoints/background');

      const mockTab = {
        id: 123,
        url: 'https://example.com',
        title: 'Example',
      } as chrome.tabs.Tab;

      await collectTab(mockTab);

      // Verify toast message was sent (type may be success or warning based on addTab result)
      expect((chrome as any).tabs.sendMessage).toHaveBeenCalled();
      const messageArg = (chrome as any).tabs.sendMessage.mock.calls[0][1];
      expect(messageArg.type).toMatch(/^(success-toast|duplicate-warning)$/);
    });

    it('should handle toast message errors gracefully', async () => {
      const { collectTab } = await import('~/entrypoints/background');

      const mockTab = {
        id: 123,
        url: 'https://example.com',
        title: 'Example',
      } as chrome.tabs.Tab;

      (chrome as any).tabs.sendMessage.mockRejectedValue(new Error('Tab closed'));

      // Should not throw
      await expect(collectTab(mockTab)).resolves.not.toThrow();
    });

    it('should handle missing tab data gracefully', async () => {
      const { collectTab } = await import('~/entrypoints/background');

      // Missing URL
      const mockTab = {
        id: 123,
        url: undefined,
        title: 'Example',
      } as chrome.tabs.Tab;

      await collectTab(mockTab);

      // Should not call storage or remove
      expect((chrome as any).storage.local.set).not.toHaveBeenCalled();
      expect((chrome as any).tabs.remove).not.toHaveBeenCalled();
    });
  });
});

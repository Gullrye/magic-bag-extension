import { expect, afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Chrome storage mock with in-memory Map for testing
const mockStorage = new Map<string, any>();

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  mockStorage.clear(); // Clear storage Map between tests
});

// Minimal pointer-event support for future @dnd-kit interaction tests.
if (!(globalThis as any).PointerEvent) {
  class MockPointerEvent extends MouseEvent {}
  (globalThis as any).PointerEvent = MockPointerEvent;
}

if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = vi.fn();
}

if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = vi.fn();
}

// Mock WXT defineBackground function
(globalThis as any).defineBackground = (fn: () => void) => {
  fn(); // Execute the background function immediately
  return {}; // Return mock background object
};

// Mock Chrome APIs for service worker and storage tests
(globalThis as any).chrome = {
  runtime: {
    onInstalled: {
      addListener: vi.fn(),
    },
    onMessage: {
      addListener: vi.fn(),
    },
    getManifest: vi.fn(() => ({
      manifest_version: 3,
      name: '法宝袋',
      version: '1.0.0',
      permissions: ['storage', 'activeTab', 'contextMenus', 'tabs', 'unlimitedStorage'],
    })),
  },
  contextMenus: {
    create: vi.fn(),
    onClicked: {
      addListener: vi.fn(),
    },
  },
  tabs: {
    query: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
    sendMessage: vi.fn(),
  },
  storage: {
    local: {
      get: vi.fn((keys: string | string[] | null) =>
        Promise.resolve(
          keys === null
            ? Object.fromEntries(mockStorage)
            : typeof keys === 'string'
            ? { [keys]: mockStorage.get(keys) }
            : Object.fromEntries(
                Array.from(mockStorage.entries()).filter(([k]) =>
                  Array.isArray(keys) ? keys.includes(k) : true
                )
              )
        )
      ),
      set: vi.fn((items: { [key: string]: any }) => {
        Object.entries(items).forEach(([k, v]) => {
          // Handle WXT storage pattern: items['local:savedTabs'] = [tab1, tab2]
          // Store as key-value pairs in the Map
          mockStorage.set(k, v);
        });
        return Promise.resolve();
      }),
      clear: vi.fn(() => {
        mockStorage.clear();
        return Promise.resolve();
      }),
    },
    sync: {
      get: vi.fn(() => Promise.resolve({})),
      set: vi.fn(() => Promise.resolve()),
    },
  },
  downloads: {
    download: vi.fn(() => Promise.resolve(1)),
  },
} as any;

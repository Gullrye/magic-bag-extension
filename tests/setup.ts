import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Chrome APIs for service worker and storage tests
global.chrome = {
  storage: {
    local: {
      get: (keys: string | string[] | object, callback?: (result: object) => void) => {
        const result = {};
        if (callback) callback(result);
        return Promise.resolve(result);
      },
      set: (items: object, callback?: () => void) => {
        if (callback) callback();
        return Promise.resolve();
      },
      clear: (callback?: () => void) => {
        if (callback) callback();
        return Promise.resolve();
      },
    },
    sync: {
      get: (keys: string | string[] | object, callback?: (result: object) => void) => {
        const result = {};
        if (callback) callback(result);
        return Promise.resolve(result);
      },
      set: (items: object, callback?: () => void) => {
        if (callback) callback();
        return Promise.resolve();
      },
    },
  },
  runtime: {
    getManifest: () => ({
      manifest_version: 3,
      name: '法宝袋',
      version: '1.0.0',
      permissions: ['storage', 'activeTab', 'contextMenus', 'tabs', 'unlimitedStorage'],
    }),
  },
  tabs: {
    query: () => Promise.resolve([]),
    create: () => Promise.resolve({ id: 1, url: 'https://example.com' }),
  },
} as any;

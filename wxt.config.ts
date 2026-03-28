import { defineConfig } from 'wxt';

// See https://wxt.dev/guide/config.html for more information
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: '法宝袋',
    description: '一键收纳标签页，让浏览器保持清爽',
    icons: {
      16: 'icons/icon16.png',
      32: 'icons/icon32.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    },
    action: {
      default_icon: {
        16: 'icons/icon16.png',
        32: 'icons/icon32.png',
        48: 'icons/icon48.png',
      },
    },
    permissions: ['storage', 'activeTab', 'contextMenus', 'tabs', 'unlimitedStorage', 'downloads'],
    host_permissions: ['<all_urls>'],
  },
});

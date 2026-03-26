import { defineConfig } from 'wxt';

// See https://wxt.dev/guide/config.html for more information
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: '法宝袋',
    description: '一键收纳标签页，让浏览器保持清爽',
    permissions: ['storage', 'activeTab', 'contextMenus', 'tabs', 'unlimitedStorage', 'downloads'],
    host_permissions: ['<all_urls>'],
  },
});

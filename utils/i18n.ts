type MessageValue = string | ((params?: Record<string, string | number>) => string);

type MessageCatalog = Record<string, MessageValue>;

const zhCN: MessageCatalog = {
  extName: '法宝袋',
  extDescription: '一键收纳标签页，让浏览器保持清爽',
  contextMenuSaveTab: '将标签页收入法宝袋',
  popupTitle: '藏阁整备',
  popupLead: '常用操作在此即开即用，当前页主面板也可以直接唤起。',
  popupLanguageLabel: '语言',
  popupLanguageAuto: '跟随系统',
  popupLanguageZh: '中文',
  popupLanguageEn: 'EN',
  popupSyncEyebrow: '同步',
  popupSyncTitle: '同步文件',
  popupSyncBound: (params) => `已绑定：${params?.fileName ?? ''}`,
  popupSyncUnbound: '未绑定同步文件',
  popupSyncHint: '先绑定一个本地 JSON 文件，再执行导入或导出。',
  popupSyncBind: '绑定 JSON 文件',
  popupSyncImport: '从同步文件导入',
  popupSyncExport: '导出到同步文件',
  popupSyncBindSuccess: (params) => `已绑定同步文件：${params?.fileName ?? ''}`,
  popupSyncImportSuccess: (params) => `已从同步文件导入 ${params?.count ?? 0} 个标签页`,
  popupSyncExportSuccess: (params) => `已导出 ${params?.count ?? 0} 个标签页到同步文件`,
  popupSyncNeedBind: '请先绑定同步文件',
  popupSyncUnsupported: '当前环境不支持绑定本地文件',
  popupSyncPermissionDenied: '没有获得同步文件权限',
  popupSyncInvalidFile: '同步文件内容无效，请检查 JSON 格式',
  popupSyncActionError: '同步文件操作失败',
  popupCollectTab: '将标签页收入法宝袋',
  popupCloseCurrentTab: '关闭当前页',
  popupShowPanel: '展示面板',
  popupExportEyebrow: '备份',
  popupExportTitle: '导出标签页',
  popupExportBody: '将所有已收纳的标签页导出为 JSON 文件，可用于备份或迁移。',
  popupExportButton: '导出 JSON',
  popupImportEyebrow: '归档',
  popupImportTitle: '导入标签页',
  popupImportBody: '从 JSON 文件导入标签页。导入的标签会添加到现有标签中，重复的网址会被跳过。',
  popupImportButton: '选择文件',
  popupCollectSuccess: '已收入法宝袋，会关闭当前标签页',
  popupCollectDuplicate: '当前标签页已在法宝袋中',
  popupCollectError: '当前页面暂时无法收入法宝袋',
  popupMissingCurrentTab: '未找到当前标签页',
  popupShowPanelSuccess: '已在当前标签页展示面板',
  popupShowPanelError: '当前页面暂时无法展示面板',
  popupExportSuccess: (params) => `已导出 ${params?.count ?? 0} 个标签页`,
  popupExportError: (params) => `导出失败：${params?.error ?? ''}`,
  popupImportSuccess: (params) => `已导入 ${params?.count ?? 0} 个标签页`,
  popupImportError: (params) => `导入失败：${params?.error ?? ''}`,
  contentToastSaved: '已收入法宝袋',
  contentToastDuplicate: '该标签页已在法宝袋中',
  contentBagAriaLabel: '法宝袋 - 点击查看已收纳的标签页',
  contentPanelAriaLabel: '法宝袋',
  contentBagBadge: '藏',
  contentPanelEyebrow: '法宝袋',
  contentPanelTitle: '藏页匣',
  contentPanelDescription: '收拢当下分心的页面，像题签一样安稳归档。',
  contentSearchPlaceholder: '检索标题或网址',
  contentClearBag: '清匣',
  contentResultCount: (params) => `检得 ${params?.count ?? 0} 项`,
  contentStoredCount: (params) => `共藏 ${params?.count ?? 0} 项`,
  contentNoMatchTitle: '未检得相符藏页',
  contentNoMatchBody: '换一个关键词试试，或清空检索后查看全部收纳。',
  contentConfirmTitle: '清空法宝袋？',
  contentConfirmMessage: '这会移除所有已收纳标签页，且无法撤销。',
  contentConfirmAction: '确认清匣',
  contentCancel: '取消',
  contentDialogEyebrow: '谨慎操作',
  contentEmptyTitle: '匣中暂无藏页',
  contentEmptyBody: '在任意页面点击法宝袋，即可把眼前页签收入此匣，稍后再慢慢翻看。',
  contentDeleteTab: '删除标签页',
  contentUntitled: '未命名页签',
};

const enUS: MessageCatalog = {
  extName: 'Magic Bag',
  extDescription: 'Save tabs in one click and keep your browser tidy',
  contextMenuSaveTab: 'Save tab to Magic Bag',
  popupTitle: 'Bag Console',
  popupLead: 'Keep the core actions close. You can also open the in-page panel for the current tab.',
  popupLanguageLabel: 'Language',
  popupLanguageAuto: 'Auto',
  popupLanguageZh: '中文',
  popupLanguageEn: 'EN',
  popupSyncEyebrow: 'Sync',
  popupSyncTitle: 'Sync File',
  popupSyncBound: (params) => `Bound: ${params?.fileName ?? ''}`,
  popupSyncUnbound: 'No sync file bound',
  popupSyncHint: 'Bind a local JSON file first, then import from it or export to it.',
  popupSyncBind: 'Bind JSON File',
  popupSyncImport: 'Import from Sync File',
  popupSyncExport: 'Export to Sync File',
  popupSyncBindSuccess: (params) => `Sync file bound: ${params?.fileName ?? ''}`,
  popupSyncImportSuccess: (params) => {
    const count = Number(params?.count ?? 0);
    return `Imported ${count} tab${count === 1 ? '' : 's'} from sync file`;
  },
  popupSyncExportSuccess: (params) => {
    const count = Number(params?.count ?? 0);
    return `Exported ${count} tab${count === 1 ? '' : 's'} to sync file`;
  },
  popupSyncNeedBind: 'Bind a sync file first',
  popupSyncUnsupported: 'This environment does not support local file binding',
  popupSyncPermissionDenied: 'Permission to access the sync file was denied',
  popupSyncInvalidFile: 'The sync file contents are invalid',
  popupSyncActionError: 'Sync file action failed',
  popupCollectTab: 'Save This Tab to Magic Bag',
  popupCloseCurrentTab: 'Closes current tab',
  popupShowPanel: 'Show Panel',
  popupExportEyebrow: 'Backup',
  popupExportTitle: 'Export Tabs',
  popupExportBody: 'Export all saved tabs as a JSON file for backup or migration.',
  popupExportButton: 'Export JSON',
  popupImportEyebrow: 'Archive',
  popupImportTitle: 'Import Tabs',
  popupImportBody: 'Import tabs from a JSON file. Imported tabs are added to the existing collection and duplicate URLs are skipped.',
  popupImportButton: 'Choose File',
  popupCollectSuccess: 'Saved to Magic Bag. The current tab will close.',
  popupCollectDuplicate: 'This tab is already in Magic Bag',
  popupCollectError: 'This page cannot be saved to Magic Bag right now',
  popupMissingCurrentTab: 'Current tab not found',
  popupShowPanelSuccess: 'Panel opened on the current tab',
  popupShowPanelError: 'The panel cannot be shown on this page right now',
  popupExportSuccess: (params) => {
    const count = Number(params?.count ?? 0);
    return `Exported ${count} tab${count === 1 ? '' : 's'}`;
  },
  popupExportError: (params) => `Export failed: ${params?.error ?? ''}`,
  popupImportSuccess: (params) => {
    const count = Number(params?.count ?? 0);
    return `Imported ${count} tab${count === 1 ? '' : 's'}`;
  },
  popupImportError: (params) => `Import failed: ${params?.error ?? ''}`,
  contentToastSaved: 'Saved to Magic Bag',
  contentToastDuplicate: 'This tab is already in Magic Bag',
  contentBagAriaLabel: 'Magic Bag - open saved tabs',
  contentPanelAriaLabel: 'Magic Bag',
  contentBagBadge: 'Bag',
  contentPanelEyebrow: 'Magic Bag',
  contentPanelTitle: 'Saved Shelf',
  contentPanelDescription: 'Tuck distracting pages away now and come back to them like filed notes.',
  contentSearchPlaceholder: 'Search title or URL',
  contentClearBag: 'Clear',
  contentResultCount: (params) => {
    const count = Number(params?.count ?? 0);
    return `${count} match${count === 1 ? '' : 'es'}`;
  },
  contentStoredCount: (params) => `${Number(params?.count ?? 0)} saved`,
  contentNoMatchTitle: 'No matching tabs found',
  contentNoMatchBody: 'Try another keyword, or clear the search to view everything you saved.',
  contentConfirmTitle: 'Clear Magic Bag?',
  contentConfirmMessage: 'This removes all saved tabs and cannot be undone.',
  contentConfirmAction: 'Clear Everything',
  contentCancel: 'Cancel',
  contentDialogEyebrow: 'Caution',
  contentEmptyTitle: 'No saved tabs yet',
  contentEmptyBody: 'Click Magic Bag on any page to save the current tab and revisit it later.',
  contentDeleteTab: 'Delete tab',
  contentUntitled: 'Untitled tab',
};

const catalogs = {
  zh: zhCN,
  en: enUS,
};

export type SupportedLocale = keyof typeof catalogs;
export type LocalePreference = SupportedLocale | 'system';

let runtimeLocalePreference: LocalePreference = 'system';

export function detectSystemLocale(): SupportedLocale {
  const uiLanguage = globalThis.chrome?.i18n?.getUILanguage?.()
    || globalThis.navigator?.language
    || 'zh-CN';

  return uiLanguage.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export function resolveLocale(preference: LocalePreference = runtimeLocalePreference): SupportedLocale {
  return preference === 'system' ? detectSystemLocale() : preference;
}

export function setRuntimeLocalePreference(preference: LocalePreference) {
  runtimeLocalePreference = preference;
}

export function getRuntimeLocalePreference() {
  return runtimeLocalePreference;
}

export function t(key: keyof typeof zhCN, params?: Record<string, string | number>): string {
  const locale = resolveLocale();
  const value = catalogs[locale][key] ?? zhCN[key];

  return typeof value === 'function' ? value(params) : value;
}

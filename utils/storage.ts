import { storage } from 'wxt/utils/storage';
import type { IconPosition, SavedTab } from '~/entrypoints/content/types';
import type { LocalePreference } from './i18n';

export const iconPosition = storage.defineItem<IconPosition>('local:iconPosition', {
  fallback: { x: 20, y: 600, edge: 'bottom' },
  version: 1,
});

export const savedTabs = storage.defineItem<SavedTab[]>('local:savedTabs', {
  fallback: [],
  version: 1,
});

export const localePreference = storage.defineItem<LocalePreference>('local:localePreference', {
  fallback: 'system',
  version: 1,
});

export async function addTab(tab: SavedTab): Promise<boolean> {
  const current = await savedTabs.getValue();

  // Check for duplicate URL (per CONTEXT.md D-09)
  if (hasDuplicateUrl(tab.url, current)) {
    return false;
  }

  // Add to beginning (newest-first per CONTEXT.md D-10)
  await savedTabs.setValue([tab, ...current]);
  return true;
}

export function hasDuplicateUrl(url: string, tabs: SavedTab[]): boolean {
  return tabs.some(tab => tab.url === url);
}

export async function removeTab(url: string): Promise<void> {
  const current = await savedTabs.getValue();
  await savedTabs.setValue(current.filter(tab => tab.url !== url));
}

export async function clearTabs(): Promise<void> {
  await savedTabs.setValue([]);
}

export async function reorderTabs(nextTabs: SavedTab[]): Promise<void> {
  await savedTabs.setValue(nextTabs);
}

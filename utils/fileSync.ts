import type { SavedTab } from '~/entrypoints/content/types';

const DB_NAME = 'magic-bag-sync';
const STORE_NAME = 'handles';
const HANDLE_KEY = 'sync-json-file';

declare global {
  interface Window {
    showOpenFilePicker?: (options?: Record<string, unknown>) => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker?: (options?: Record<string, unknown>) => Promise<FileSystemFileHandle>;
  }
}

type SyncFileHandle = FileSystemFileHandle;
type SyncPermissionMode = 'read' | 'readwrite';
type SyncFileHandleWithPermission = SyncFileHandle & {
  queryPermission: (descriptor: { mode: SyncPermissionMode }) => Promise<PermissionState>;
  requestPermission: (descriptor: { mode: SyncPermissionMode }) => Promise<PermissionState>;
};

function createError(code: string, message: string) {
  const error = new Error(message);
  error.name = code;
  return error;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? createError('IDB_OPEN_FAILED', 'Failed to open IndexedDB'));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = action(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? createError('IDB_REQUEST_FAILED', 'IndexedDB request failed'));
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => reject(transaction.error ?? createError('IDB_TX_FAILED', 'IndexedDB transaction failed'));
  });
}

async function getStoredHandle(): Promise<SyncFileHandle | null> {
  return withStore<SyncFileHandle | null>('readonly', (store) => store.get(HANDLE_KEY));
}

async function setStoredHandle(handle: SyncFileHandle): Promise<void> {
  await withStore('readwrite', (store) => store.put(handle, HANDLE_KEY));
}

async function ensurePermission(handle: SyncFileHandle, mode: SyncPermissionMode): Promise<void> {
  const handleWithPermission = handle as SyncFileHandleWithPermission;
  const current = await handleWithPermission.queryPermission({ mode });
  if (current === 'granted') return;

  const next = await handleWithPermission.requestPermission({ mode });
  if (next !== 'granted') {
    throw createError('SYNC_PERMISSION_DENIED', 'Permission denied for sync file');
  }
}

function getPickerOptions() {
  return {
    excludeAcceptAllOption: false,
    types: [
      {
        description: 'Magic Bag Sync File',
        accept: {
          'application/json': ['.json'],
        },
      },
    ],
  };
}

function normalizeImportedTabs(value: unknown): SavedTab[] {
  if (!Array.isArray(value)) {
    throw createError('SYNC_INVALID_FORMAT', 'Expected an array');
  }

  return value.filter((item): item is SavedTab => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Partial<SavedTab>;
    return typeof candidate.url === 'string' && typeof candidate.title === 'string';
  });
}

export async function bindSyncFile(): Promise<string> {
  if (!window.showSaveFilePicker) {
    throw createError('SYNC_UNSUPPORTED', 'File System Access API is not supported');
  }

  const handle = await window.showSaveFilePicker({
    ...getPickerOptions(),
    suggestedName: 'magic-bag-sync.json',
  });
  if (!handle) {
    throw createError('SYNC_PICKER_CANCELLED', 'No sync file selected');
  }

  await ensurePermission(handle, 'readwrite');
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify([], null, 2));
  await writable.close();
  await setStoredHandle(handle);
  return handle.name;
}

export async function getSyncFileName(): Promise<string | null> {
  const handle = await getStoredHandle();
  return handle?.name ?? null;
}

export async function importTabsFromBoundFile(): Promise<SavedTab[]> {
  const handle = await getStoredHandle();
  if (!handle) {
    throw createError('SYNC_NOT_BOUND', 'No sync file bound');
  }

  await ensurePermission(handle, 'read');
  const file = await handle.getFile();
  const text = await file.text();
  const parsed = JSON.parse(text);
  return normalizeImportedTabs(parsed);
}

export async function exportTabsToBoundFile(tabs: SavedTab[]): Promise<void> {
  const handle = await getStoredHandle();
  if (!handle) {
    throw createError('SYNC_NOT_BOUND', 'No sync file bound');
  }

  await ensurePermission(handle, 'readwrite');
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(tabs, null, 2));
  await writable.close();
}

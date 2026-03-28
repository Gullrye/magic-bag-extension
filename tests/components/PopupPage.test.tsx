import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PopupPage } from '~/entrypoints/popup/PopupPage';

vi.mock('~/utils/storage', () => ({
  savedTabs: {
    getValue: vi.fn(),
  },
  addTab: vi.fn(),
}));

describe('PopupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (globalThis as any).chrome.downloads.download = vi.fn().mockResolvedValue(1);
    (globalThis as any).chrome.tabs.query = vi.fn().mockResolvedValue([{ id: 123 }]);
    (globalThis as any).chrome.tabs.sendMessage = vi.fn().mockResolvedValue(undefined);
    (globalThis as any).chrome.runtime.sendMessage = vi.fn().mockResolvedValue({ status: 'success' });
  });

  describe('UI Rendering', () => {
    it('renders popup title and primary action', () => {
      render(<PopupPage />);
      expect(screen.getByText('藏阁整备')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /将标签页收入法宝袋/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '展示面板' })).toBeInTheDocument();
    });

    it('renders export and import sections', () => {
      render(<PopupPage />);
      expect(screen.getByText('导出标签页')).toBeInTheDocument();
      expect(screen.getByText('导入标签页')).toBeInTheDocument();
    });

    it('has hidden file input for import', () => {
      render(<PopupPage />);
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('accept', '.json');
    });

    it('renders English copy when browser language is English', () => {
      (globalThis as any).__TEST_UI_LANG = 'en-US';
      render(<PopupPage />);
      expect(screen.getByText('Bag Console')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Show Panel' })).toBeInTheDocument();
      expect(screen.getByText('Export Tabs')).toBeInTheDocument();
    });
  });

  describe('Show Panel', () => {
    it('sends open-grid message to the current tab', async () => {
      render(<PopupPage />);

      fireEvent.click(screen.getByRole('button', { name: '展示面板' }));

      await waitFor(() => {
        expect((globalThis as any).chrome.tabs.query).toHaveBeenCalledWith({
          active: true,
          currentWindow: true,
        });
        expect((globalThis as any).chrome.tabs.sendMessage).toHaveBeenCalledWith(123, {
          type: 'open-grid',
        });
      });
    });

    it('shows warning when current page cannot open panel', async () => {
      (globalThis as any).chrome.tabs.sendMessage = vi.fn().mockRejectedValue(new Error('No receiver'));

      render(<PopupPage />);
      fireEvent.click(screen.getByRole('button', { name: '展示面板' }));

      await waitFor(() => {
        expect(screen.getByText('当前页面暂时无法展示面板')).toBeInTheDocument();
      });
    });
  });

  describe('Collect Current Tab', () => {
    it('requests background to collect the current tab', async () => {
      render(<PopupPage />);

      fireEvent.click(screen.getByRole('button', { name: /将标签页收入法宝袋/ }));

      await waitFor(() => {
        expect((globalThis as any).chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: 'collect-current-tab',
        });
      });
    });

    it('shows closing hint after successful collection', async () => {
      render(<PopupPage />);

      fireEvent.click(screen.getByRole('button', { name: /将标签页收入法宝袋/ }));

      await waitFor(() => {
        expect(screen.getByText('已收入法宝袋，会关闭当前标签页')).toBeInTheDocument();
      });
    });
  });

  describe('Export Functionality', () => {
    it('exports tabs as JSON file with correct filename', async () => {
      const mockTabs = [
        { url: 'https://example.com', title: 'Example', timestamp: 1000 },
        { url: 'https://test.com', title: 'Test', timestamp: 2000 },
      ];

      const { savedTabs } = await import('~/utils/storage');
      vi.mocked(savedTabs.getValue).mockResolvedValue(mockTabs);

      render(<PopupPage />);

      fireEvent.click(screen.getByRole('button', { name: '导出 JSON' }));

      await waitFor(() => {
        expect((globalThis as any).chrome.downloads.download).toHaveBeenCalled();
      });

      const downloadOptions = (globalThis as any).chrome.downloads.download.mock.calls[0][0];
      expect(downloadOptions.filename).toMatch(/magic-bag-tabs-\d{4}-\d{2}-\d{2}\.json/);
      expect(downloadOptions.saveAs).toBe(true);
    });
  });

  describe('Import Functionality', () => {
    it('imports valid JSON file and merges tabs', async () => {
      const importedTabs = [
        { url: 'https://new.com', title: 'New Tab', timestamp: 3000 },
      ];

      const { addTab } = await import('~/utils/storage');
      vi.mocked(addTab).mockResolvedValue(true);

      render(<PopupPage />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File([JSON.stringify(importedTabs)], 'tabs.json', {
        type: 'application/json',
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(addTab).toHaveBeenCalledWith(importedTabs[0]);
      });
    });
  });
});

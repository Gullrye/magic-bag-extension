import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OptionsPage } from '~/entrypoints/options/OptionsPage';

// Mock the storage module
vi.mock('~/utils/storage', () => ({
  savedTabs: {
    getValue: vi.fn(),
  },
  addTab: vi.fn(),
}));

// Mock chrome.downloads API
const mockDownload = vi.fn();
(globalThis as any).chrome = {
  ...((globalThis as any).chrome || {}),
  downloads: {
    download: mockDownload,
  },
};

describe('OptionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDownload.mockResolvedValue(1);
  });

  describe('UI Rendering', () => {
    it('renders page title', () => {
      render(<OptionsPage />);
      expect(screen.getByText('法宝袋设置')).toBeInTheDocument();
    });

    it('renders export section with title and description', () => {
      render(<OptionsPage />);
      expect(screen.getByText('导出标签页')).toBeInTheDocument();
      expect(screen.getByText(/将所有已收纳的标签页导出为 JSON 文件/)).toBeInTheDocument();
    });

    it('renders import section with title and description', () => {
      render(<OptionsPage />);
      expect(screen.getByText('导入标签页')).toBeInTheDocument();
      expect(screen.getByText(/从 JSON 文件导入标签页/)).toBeInTheDocument();
    });

    it('renders export and import buttons', () => {
      render(<OptionsPage />);
      expect(screen.getByRole('button', { name: '导出 JSON' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '选择文件' })).toBeInTheDocument();
    });

    it('has hidden file input for import', () => {
      render(<OptionsPage />);
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('accept', '.json');
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

      render(<OptionsPage />);

      const exportButton = screen.getByRole('button', { name: '导出 JSON' });
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(mockDownload).toHaveBeenCalled();
      });

      const downloadOptions = mockDownload.mock.calls[0][0];
      expect(downloadOptions.filename).toMatch(/magic-bag-tabs-\d{4}-\d{2}-\d{2}\.json/);
      expect(downloadOptions.saveAs).toBe(true);
    });

    it('shows success toast with count after export', async () => {
      const mockTabs = [
        { url: 'https://example.com', title: 'Example', timestamp: 1000 },
      ];

      const { savedTabs } = await import('~/utils/storage');
      vi.mocked(savedTabs.getValue).mockResolvedValue(mockTabs);

      render(<OptionsPage />);

      const exportButton = screen.getByRole('button', { name: '导出 JSON' });
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(screen.getByText(/已导出 1 个标签页/)).toBeInTheDocument();
      });
    });
  });

  describe('Import Functionality', () => {
    it('imports valid JSON file and merges tabs', async () => {
      const importedTabs = [
        { url: 'https://new.com', title: 'New Tab', timestamp: 3000 },
      ];

      const { addTab } = await import('~/utils/storage');
      vi.mocked(addTab).mockResolvedValue(true);

      render(<OptionsPage />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File([JSON.stringify(importedTabs)], 'tabs.json', {
        type: 'application/json',
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(addTab).toHaveBeenCalledWith(importedTabs[0]);
      });
    });

    it('shows success toast with import count', async () => {
      const importedTabs = [
        { url: 'https://new.com', title: 'New Tab', timestamp: 3000 },
      ];

      const { addTab } = await import('~/utils/storage');
      vi.mocked(addTab).mockResolvedValue(true);

      render(<OptionsPage />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File([JSON.stringify(importedTabs)], 'tabs.json', {
        type: 'application/json',
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/已导入 1 个标签页/)).toBeInTheDocument();
      });
    });

    it('skips duplicates during import', async () => {
      const importedTabs = [
        { url: 'https://existing.com', title: 'Existing', timestamp: 1000 },
        { url: 'https://new.com', title: 'New', timestamp: 2000 },
      ];

      const { addTab } = await import('~/utils/storage');
      vi.mocked(addTab)
        .mockResolvedValueOnce(false) // First tab is duplicate
        .mockResolvedValueOnce(true); // Second tab is new

      render(<OptionsPage />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File([JSON.stringify(importedTabs)], 'tabs.json', {
        type: 'application/json',
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        // Should show count of 1 (only the new tab)
        expect(screen.getByText(/已导入 1 个标签页/)).toBeInTheDocument();
      });
    });

    it('shows error toast for invalid JSON', async () => {
      render(<OptionsPage />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['invalid json'], 'invalid.json', {
        type: 'application/json',
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/导入失败/)).toBeInTheDocument();
      });
    });
  });
});

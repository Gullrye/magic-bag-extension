import './style.css';
import ReactDOM from 'react-dom/client';
import { defineContentScript } from 'wxt/utils/define-content-script';
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
import { useState, useEffect, useCallback } from 'react';
import BagIcon from './BagIcon';
import { TabGrid } from './TabGrid';
import { Toast } from './Toast';
import { setRuntimeLocalePreference, t } from '~/utils/i18n';
import { localePreference } from '~/utils/storage';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'warning';
}

// Main app component that manages state
function MagicBagApp() {
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'success' });
  const [, setLocaleVersion] = useState(0);

  // Handle tab click - open URL in new tab (GRID-04)
  const handleTabClick = useCallback((url: string) => {
    // Send message to background script to open tab
    chrome.runtime.sendMessage({ type: 'open-tab', url });
  }, []);

  // Toggle grid open/closed (GRID-01)
  const toggleGrid = useCallback(() => {
    setIsGridOpen((prev) => !prev);
  }, []);

  // Handle grid close
  const handleGridClose = useCallback(() => {
    setIsGridOpen(false);
  }, []);

  // Handle toast close
  const handleToastClose = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // Listen for toast messages from background script
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'success-toast') {
        setToast({ visible: true, message: t('contentToastSaved'), type: 'success' });
      } else if (message.type === 'duplicate-warning') {
        setToast({ visible: true, message: t('contentToastDuplicate'), type: 'warning' });
      } else if (message.type === 'open-grid') {
        setIsGridOpen(true);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  useEffect(() => {
    localePreference.getValue().then((preference) => {
      setRuntimeLocalePreference(preference);
      setLocaleVersion((current) => current + 1);
    });

    const unwatch = localePreference.watch((preference) => {
      setRuntimeLocalePreference(preference);
      setLocaleVersion((current) => current + 1);
    });

    return () => unwatch();
  }, []);

  return (
    <>
      <BagIcon onToggleGrid={toggleGrid} />
      <TabGrid
        isOpen={isGridOpen}
        onClose={handleGridClose}
        onTabClick={handleTabClick}
      />
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}
    </>
  );
}

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui', // CRITICAL: Enables Shadow DOM style injection (INFR-02)

  async main(ctx) {
    // Skip standalone SVG/image documents. The extension UI expects a normal HTML page
    // and should not inject into local asset previews or image documents.
    if (!document.body || document.contentType === 'image/svg+xml') {
      return;
    }

    const ui = await createShadowRootUi(ctx, {
      name: 'magic-bag',
      position: 'inline',
      anchor: 'body',
      onMount(container) {
        // Create wrapper div (React warns when creating root on body directly)
        const app = document.createElement('div');
        app.className = 'magic-bag-container';
        container.append(app);

        // Render MagicBagApp component with all integrations
        const root = ReactDOM.createRoot(app);
        root.render(<MagicBagApp />);

        return root;
      },
      onRemove: (root) => root?.unmount(),
    });

    ui.mount();
  },
});

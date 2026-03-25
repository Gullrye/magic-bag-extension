import './style.css';
import ReactDOM from 'react-dom/client';
import { defineContentScript, createShadowRootUi } from 'wxt/sandbox';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui', // CRITICAL: Enables Shadow DOM style injection (INFR-02)

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'magic-bag',
      position: 'inline',
      anchor: 'body',
      onMount(container) {
        // Create wrapper div (React warns when creating root on body directly)
        const app = document.createElement('div');
        app.className = 'magic-bag-container';
        container.append(app);

        // React root will be mounted here in next plan
        // For now, just verify container is created
        const root = ReactDOM.createRoot(app);

        // Placeholder - will render <BagIcon /> in plan 01-03
        root.render(
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#6B7280',
            borderRadius: '50%',
            opacity: '0.8',
            border: '1px solid #9CA3AF',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}>
            {/* Placeholder icon - BagIcon component coming in plan 01-03 */}
          </div>
        );

        return root;
      },
      onRemove: (root) => root?.unmount(),
    });

    ui.mount();
  },
});

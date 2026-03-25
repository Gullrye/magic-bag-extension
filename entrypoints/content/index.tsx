import './style.css';
import ReactDOM from 'react-dom/client';
import { defineContentScript } from 'wxt/utils/define-content-script';
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
import BagIcon from './BagIcon';

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

        // Render BagIcon component
        const root = ReactDOM.createRoot(app);
        root.render(<BagIcon />);

        return root;
      },
      onRemove: (root) => root?.unmount(),
    });

    ui.mount();
  },
});

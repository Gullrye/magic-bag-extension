# 法宝袋 (Magic Bag)

一款 Edge 浏览器扩展，提供一个可拖拽的悬浮图标"法宝袋"。用户可以将浏览器标签页"收入"袋中，标签像棋子一样在棋盘上铺开展示。

**Core Value:** 一键收纳标签页，让浏览器保持清爽。

## Phase 1: Infrastructure & Floating Icon

This phase establishes the extension infrastructure and floating draggable icon.

### Setup

1. **Install dependencies:**
```bash
pnpm install
```

2. **Build the extension:**
```bash
pnpm build
```

3. **Load in Edge:**
   - Open Edge and navigate to `edge://extensions`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `magic-bag/.output/chrome-mv3` directory

### Testing

**Smoke Test:**
1. Visit any website (e.g., https://example.com)
2. Verify the floating icon appears in the bottom-right corner
3. Verify the icon is a 48x48px gray circle with shadow

**Drag Test:**
1. Drag the icon to each edge (top, right, bottom, left)
2. Release within 50px of an edge
3. Verify the icon snaps to that edge
4. Verify visual feedback during drag (blue color, enhanced shadow, cursor change)

**Persistence Test:**
1. Drag icon to a new position
2. Reload the page (F5)
3. Verify icon position is preserved
4. Restart Edge browser
5. Verify icon position is still preserved

**CSS Isolation Test:**
1. Visit complex websites (Gmail, Facebook, Reddit)
2. Verify icon appearance is consistent across all sites
3. Inspect element and verify Shadow DOM isolation
4. Verify host page CSS doesn't affect the icon

### Tech Stack

- **WXT 0.20.20** - Extension build framework
- **React 19.2.4** - UI framework
- **TypeScript 5.x** - Type safety
- **Tailwind CSS** - Styling (inside Shadow DOM)
- **react-draggable 4.5.0** - Drag behavior
- **Manifest V3** - Chrome extension standard

### Architecture

- `entrypoints/background.ts` - Service worker for privileged APIs
- `entrypoints/content/index.tsx` - Content script with Shadow DOM UI
- `entrypoints/content/BagIcon.tsx` - Floating draggable icon component
- `utils/storage.ts` - WXT storage module for position persistence
- `utils/drag.ts` - Edge-snapping drag utilities

### Current Status

**Phase 1 (Infrastructure & Floating Icon):** ✅ Complete
- [x] WXT + React + TypeScript setup
- [x] Shadow DOM style isolation
- [x] Draggable floating icon
- [x] Edge snapping behavior
- [x] Position persistence

**Next Phase:** Tab Collection & Display (Phase 2)

## Development

```bash
# Development mode with HMR
pnpm dev

# Type checking
pnpm tsc --noEmit

# Build for production
pnpm build
```

## License

MIT

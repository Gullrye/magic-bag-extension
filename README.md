# 法宝袋 (Magic Bag)

一款 Edge 浏览器扩展，提供一个可拖拽的悬浮图标"法宝袋"。用户可以将浏览器标签页"收入"袋中，标签像棋子一样在棋盘上铺开展示。

**Core Value:** 一键收纳标签页，让浏览器保持清爽。

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

### Tech Stack

- **WXT 0.20.20** - Extension build framework
- **React 18.3.1** - UI framework
- **TypeScript 5.x** - Type safety
- **Tailwind CSS** - Styling (inside Shadow DOM)
- **react-draggable 4.5.0** - Drag behavior
- **@dnd-kit** - Drag-to-reorder for saved tabs
- **Manifest V3** - Chrome extension standard

### Architecture

- `entrypoints/background.ts` - Service worker for privileged APIs
- `entrypoints/content/index.tsx` - Content script with Shadow DOM UI
- `entrypoints/content/BagIcon.tsx` - Floating draggable icon component
- `entrypoints/content/TabGrid.tsx` - Saved tab panel with search, clear-all, and reorder
- `entrypoints/content/ConfirmDialog.tsx` - Bulk clear confirmation dialog
- `utils/storage.ts` - WXT storage module for icon position and saved tabs
- `utils/drag.ts` - Edge-snapping drag utilities

### Current Status

**Phase 1 (Infrastructure & Floating Icon):** ✅ Complete
- [x] WXT + React + TypeScript setup
- [x] Shadow DOM style isolation
- [x] Draggable floating icon
- [x] Edge snapping behavior
- [x] Position persistence

**Phase 2 (Tab Collection & Display):** ✅ Complete
- [x] Context menu tab collection
- [x] Chessboard-style tab panel
- [x] Tab reopen flow
- [x] Toast feedback and duplicate handling

**Phase 3 (Tab Management):** ✅ Complete
- [x] Search by title or URL
- [x] Delete individual saved tabs
- [x] Clear all with confirmation
- [x] Drag to reorder saved tabs

**Next Phase:** Polish & Portability (Phase 4)

### Manual Verification

1. Load the extension in Edge from `.output/chrome-mv3`
2. Open the bag and confirm search input focus no longer closes the panel
3. Search by title or URL and verify filtering updates in place
4. Delete a tab and verify it disappears without opening
5. Click `清空`, cancel once, confirm once
6. Drag to reorder tabs and verify order persists after reopening the panel

## Development

```bash
# Development mode with HMR
pnpm dev

# Test suite
pnpm test --run

# Build for production
pnpm build
```

## License

MIT

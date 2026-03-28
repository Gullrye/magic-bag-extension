# 法宝袋 / Magic Bag

## 中文

法宝袋是一款 Edge / Chromium 浏览器扩展，提供一个可拖拽的悬浮入口。你可以把当前标签页收入法宝袋，在页面内用面板集中查看、搜索、重排和重新打开已保存的标签页。

**核心价值：** 一键收纳标签页，让浏览器保持清爽。

### 当前能力

- 悬浮法宝袋入口，支持拖拽和吸边
- 将当前标签页收入法宝袋
- 面板内查看、搜索、删除、清空、拖拽排序
- popup 内展示面板、导入、导出
- 中文 / English 双语界面

### 安装与运行

1. 安装依赖

```bash
pnpm install
```

2. 构建扩展

```bash
pnpm build
```

3. 在 Edge 中加载

- 打开 `edge://extensions`
- 开启右上角 `Developer mode`
- 点击 `Load unpacked`
- 选择 `.output/chrome-mv3` 目录

### 技术栈

- `WXT 0.20.20`
- `React 18.3.1`
- `TypeScript 5.x`
- `Tailwind CSS`
- `react-draggable`
- `@dnd-kit`
- `Manifest V3`

### 代码结构

- `entrypoints/background.ts`：后台脚本，处理上下文菜单与标签页收纳
- `entrypoints/content/index.tsx`：内容脚本入口，挂载页面内 UI
- `entrypoints/content/TabGrid.tsx`：主面板
- `entrypoints/popup/PopupPage.tsx`：浏览器工具栏 popup
- `utils/storage.ts`：标签页与图标位置存储
- `utils/i18n.ts`：运行时双语文案
- `_locales/`：扩展名、描述等浏览器层本地化资源

### 手动验证

1. 重新加载扩展
2. 点击工具栏图标，确认 popup 正常显示
3. 在中文和英文浏览器 UI 下分别检查 popup 和页面内面板文案
4. 点击 `将标签页收入法宝袋`，确认当前页被收纳并关闭
5. 点击 `展示面板`，确认当前标签页显示法宝袋面板
6. 验证导入、导出、搜索、删除和拖拽排序

### 开发命令

```bash
pnpm dev
pnpm test:run
pnpm compile
pnpm build
```

## English

Magic Bag is an Edge / Chromium extension with a draggable floating entry point. It lets you save the current tab into a bag, then manage saved tabs in an in-page panel with search, reorder, reopen, import, and export support.

**Core value:** save tabs in one click and keep your browser tidy.

### Current Features

- Draggable floating Magic Bag entry point with edge snapping
- Save the current tab into Magic Bag
- In-page panel for viewing, searching, deleting, clearing, and reordering saved tabs
- Toolbar popup for showing the panel, importing, and exporting
- Bilingual UI support in Chinese and English

### Setup

1. Install dependencies

```bash
pnpm install
```

2. Build the extension

```bash
pnpm build
```

3. Load it in Edge

- Open `edge://extensions`
- Enable `Developer mode`
- Click `Load unpacked`
- Select the `.output/chrome-mv3` directory

### Tech Stack

- `WXT 0.20.20`
- `React 18.3.1`
- `TypeScript 5.x`
- `Tailwind CSS`
- `react-draggable`
- `@dnd-kit`
- `Manifest V3`

### Architecture

- `entrypoints/background.ts`: background script for context menu and tab collection
- `entrypoints/content/index.tsx`: content script entry that mounts in-page UI
- `entrypoints/content/TabGrid.tsx`: main saved-tabs panel
- `entrypoints/popup/PopupPage.tsx`: browser toolbar popup
- `utils/storage.ts`: storage for saved tabs and icon position
- `utils/i18n.ts`: runtime bilingual copy
- `_locales/`: browser-level localization assets for extension metadata

### Manual Verification

1. Reload the extension
2. Click the toolbar icon and confirm the popup renders correctly
3. Check popup and in-page copy in both Chinese and English browser UI
4. Click `Save This Tab to Magic Bag` and confirm the current tab is saved and closed
5. Click `Show Panel` and confirm the panel opens on the current tab
6. Verify import, export, search, delete, and reorder flows

### Development Commands

```bash
pnpm dev
pnpm test:run
pnpm compile
pnpm build
```

## License

MIT

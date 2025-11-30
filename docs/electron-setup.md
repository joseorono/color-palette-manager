# 🖥️ Electron Desktop App Setup

ChromaLockr can also be compiled as a desktop application using Electron! But I haven't thoroughly tested it yet, so there might be bugs.

## 📋 Prerequisites

The following dependencies have been installed:
- `electron` - Main Electron runtime
- `electron-builder` - For building distributable packages
- `concurrently` - Run multiple commands simultaneously
- `wait-on` - Wait for services to be available

## 🚀 Available Scripts

### Development
```bash
# Run the web app in development mode
npm run dev

# Run the Electron app in development mode (with hot reload)
npm run electron-dev

# Run Electron directly (after building)
npm run electron
```

### Building & Distribution
```bash
# Build the web app and create Electron package for current platform
npm run electron-build

# Build for all platforms (Windows, macOS, Linux)
npm run electron-build-all
```

## 📁 Project Structure

```
color-palette-manager/
├── electron/
│   ├── main.js          # Main Electron process
│   ├── preload.js       # Preload script for security
│   └── dev-runner.js    # Development helper
├── assets/
│   └── icon.png         # App icon (replace with actual icon)
├── dist/                # Built web app (generated)
└── dist-electron/       # Built Electron apps (generated)
```

## ⚙️ Configuration

### Electron Builder Configuration
The `package.json` includes electron-builder configuration for:
- **Windows**: NSIS installer
- **macOS**: DMG package
- **Linux**: AppImage

### Security Features
- Context isolation enabled
- Node integration disabled
- Remote module disabled
- External links open in default browser

## 🎯 Desktop Features

### Menu Bar
- **File Menu**: New Palette (Ctrl/Cmd+N), Export (Ctrl/Cmd+E)
- **Edit Menu**: Standard editing commands
- **View Menu**: Zoom, reload, toggle fullscreen
- **Help Menu**: About dialog

### Keyboard Shortcuts
- `Spacebar` - Generate new palette (same as web)
- `Ctrl/Cmd+N` - New palette
- `Ctrl/Cmd+E` - Export palette
- `F11` - Toggle fullscreen

## 🔧 Customization

### App Icon
Replace `assets/icon.png` with your custom icon (recommended sizes: 256x256, 512x512)

### Window Settings
Edit `electron/main.js` to customize:
- Window size and minimum dimensions
- Title bar style
- Menu structure

### Build Settings
Modify the `build` section in `package.json` to customize:
- App ID and product name
- Target platforms
- File associations
- Auto-updater settings

## 🐛 Troubleshooting

### Development Issues
- Ensure port 5173 is available for Vite dev server
- Check that both web and Electron processes start correctly

### Build Issues
- Make sure `npm run build` completes successfully first
- Check that all required files are included in the `files` array

### Platform-Specific
- **macOS**: May require code signing for distribution
- **Windows**: NSIS installer requires Windows or Wine
- **Linux**: AppImage works on most distributions

## 📦 Distribution

After building, you'll find the distributable files in:
- `dist-electron/` - Platform-specific installers
- Ready to share with users or upload to app stores

## 🔄 Development Workflow

1. **Web Development**: Use `npm run dev` for fast iteration
2. **Electron Testing**: Use `npm run electron-dev` to test desktop features
3. **Final Build**: Use `npm run electron-build` for distribution

The Electron app maintains all the functionality of the web version while adding native desktop features like menu bars, keyboard shortcuts, and system integration.

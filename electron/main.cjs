const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');
const { execSync } = require('child_process');

// Determine if we're in development
const isDev = process.env.NODE_ENV === 'development';

// Get the absolute path to the root directory
const rootPath = path.resolve(__dirname, '..');

// Get the absolute path to the dist directory
const distPath = path.join(rootPath, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Check if dist folder exists, if not and we're not in dev mode, build the app
if (!isDev && !fs.existsSync(indexPath)) {
  console.log('Dist folder or index.html not found. Building the app...');
  try {
    execSync('npm run build', { cwd: rootPath, stdio: 'inherit' });
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    app.quit();
  }
}

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
    icon: path.join(__dirname, "../public/icon.png"), // Add icon if available
    show: false, // Don't show until ready-to-show
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
  });

  // Load the app
  if (isDev) {
    // Development - connect to Vite dev server
    mainWindow.loadURL("http://localhost:5173");
    console.log("Loading development server at: http://localhost:5173");

    // Only open DevTools in development mode
    mainWindow.webContents.openDevTools();
  } else {
    // Production - load from dist folder
    // Check if the file exists
    if (fs.existsSync(indexPath)) {
      console.log("Found index.html at:", indexPath);

      // Convert the path to a proper file URL with platform-specific handling
      let fileUrl;

      // On Windows, we need to handle the path differently
      if (process.platform === "win32") {
        // Windows paths need special handling
        fileUrl = `file:///${indexPath.replace(/\\/g, "/")}`;
      } else {
        // Unix-like systems
        fileUrl = url.format({
          pathname: indexPath,
          protocol: "file:",
          slashes: true,
        });
      }

      console.log("Loading URL:", fileUrl);
      mainWindow.loadFile(indexPath); // Use loadFile instead of loadURL for better path handling
    } else {
      console.error("Error: Could not find index.html at:", indexPath);
      // Show error in the window
      mainWindow.loadURL(
        `data:text/html,<h1>Error</h1><p>Could not find the application files. Please run 'npm run build' first.</p>`
      );
    }
  }

  // Show window when ready to prevent visual flash
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Handle load errors
  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL) => {
      console.error(
        "Failed to load:",
        errorCode,
        errorDescription,
        validatedURL
      );

      // Show error in the window
      mainWindow.webContents.loadURL(`data:text/html,<html><body>
      <h1>Error Loading Page</h1>
      <p>Error Code: ${errorCode}</p>
      <p>Description: ${errorDescription}</p>
      <p>URL: ${validatedURL}</p>
      <p>Please check the console for more details.</p>
    </body></html>`);
    }
  );

  // Log navigation events
  mainWindow.webContents.on("did-start-loading", () => {
    console.log("Started loading page");
  });

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("Finished loading page");
  });

  mainWindow.webContents.on("did-navigate", (event, url) => {
    console.log("Navigated to:", url);
  });

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New Palette",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            mainWindow.webContents.send("menu-new-palette");
          },
        },
        {
          label: "Export Palette",
          accelerator: "CmdOrCtrl+E",
          click: () => {
            mainWindow.webContents.send("menu-export-palette");
          },
        },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About ChromaLockr",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "About",
              message: "ChromaLockr",
              detail:
                "A beautiful color palette generator for designers and developers.\n\nPress spacebar to generate new palettes!",
            });
          },
        },
      ],
    },
  ];

  // macOS specific menu adjustments
  if (process.platform === "darwin") {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    });

    // Window menu
    template[4].submenu = [
      { role: "close" },
      { role: "minimize" },
      { role: "zoom" },
      { type: "separator" },
      { role: "front" },
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Register protocol handler for serving local files
protocol = require("electron").protocol;

// App event listeners
app.whenReady().then(() => {
  // Register protocol handler for file URLs
  protocol.registerFileProtocol("file", (request, callback) => {
    const url = request.url.replace("file:///", "");
    try {
      return callback(decodeURIComponent(url));
    } catch (error) {
      console.error("ERROR: registerFileProtocol", error);
    }
  });

  createWindow();
  createMenu();

  app.on("activate", () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationURL) => {
    event.preventDefault();
    shell.openExternal(navigationURL);
  });
});

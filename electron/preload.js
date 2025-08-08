const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Menu actions
  onMenuNewPalette: (callback) => ipcRenderer.on('menu-new-palette', callback),
  onMenuExportPalette: (callback) => ipcRenderer.on('menu-export-palette', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform info
  platform: process.platform,
  
  // App info
  getVersion: () => ipcRenderer.invoke('get-app-version')
});

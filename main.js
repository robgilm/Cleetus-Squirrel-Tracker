const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 220,
    height: 180,
    frame: false, // Removes browser bars/buttons
    alwaysOnTop: true, // Keeps it over the stream
    transparent: true, // Allows for a clean look
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the Vite dev server URL
  win.loadURL('http://localhost:5174/');

  // Optional: Make it draggable from anywhere
  win.setAspectRatio(220 / 180);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

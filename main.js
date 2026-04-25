const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 220,
    height: 180,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Force it to stay on top even over full-screen apps
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true);

  // Load the app
  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL('http://localhost:5174/');
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }

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

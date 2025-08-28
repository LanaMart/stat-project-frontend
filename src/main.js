const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.argv.includes('--dev');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    minWidth: 960,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#f1f0fb',
      symbolColor: '#2d2a45'
    },
    backgroundColor: '#f5f6f7',
    show: false
  });

  mainWindow.loadFile('src/index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

"use strict";
const { app, BrowserWindow, ipcMain, dialog, protocol } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: true
        }
    });
    // Set CSP header for development server
    if (isDev) {
        mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
            callback({
                responseHeaders: {
                    ...details.responseHeaders,
                    'Content-Security-Policy': ["default-src 'self'; img-src 'self' safe-file: data:; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"]
                }
            });
        });
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
        mainWindow.loadFile(indexPath);
    }
}
// Register protocol for secure local file access
app.whenReady().then(() => {
    protocol.registerFileProtocol('safe-file', (request, callback) => {
        const url = request.url.replace('safe-file://', '');
        try {
            return callback(decodeURIComponent(url));
        }
        catch (error) {
            console.error(error);
        }
    });
    createWindow();
});
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
// Handle file/folder selection
ipcMain.handle('select-files', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
        ]
    });
    return result.filePaths;
});
ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    return result.filePaths;
});

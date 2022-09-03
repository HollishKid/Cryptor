'use strict'

const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')

const utilities = require('./utilities')
const decryption = require('./decryption')
const encryption = require('./encryption')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: true,
    icon: path.join(__dirname, '/assets/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // mainWindow.removeMenu()

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

function createHandlers() {
  ipcMain.handle('directory:choose', () => {
    return utilities.chooseDirectory()
  })
  ipcMain.handle('directory:canRead', (event, directory) => {
    return utilities.canReadDirectory(directory)
  })
  ipcMain.handle('directory:canOutput', (event, directory) => {
    return utilities.canOutput(directory)
  })
  ipcMain.handle('encryption:run', (event, inputDirectory, outputDirectory, passphraseValue) => {
    return encryption.run(inputDirectory, outputDirectory, passphraseValue)
  })
  ipcMain.handle('decryption:run', (event, inputDirectory, outputDirectory, passphraseValue) => {
    return decryption.run(inputDirectory, outputDirectory, passphraseValue)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  createHandlers()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

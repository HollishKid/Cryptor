'use strict'

const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')

const decryption = require('./decryption')
const encryption = require('./encryption')

contextBridge.exposeInMainWorld('electronAPI', {
  encrypt: (directory, passphraseValue) => {
    console.log('encrypt')
    encryption.run(directory, passphraseValue)
  },
  decrypt: (directory, passphraseValue) => { decryption.run(directory, passphraseValue) },
  getDefaultInputDir: () => { return __dirname },
  getDefaultOutputDir: () => { return path.join(__dirname, 'encrypted') },
  checkInputDirectory: (directory) => { return ipcRenderer.invoke('directory:checkInput', directory) },
  checkOutputDirectory: (directory) => { return ipcRenderer.invoke('directory:checkOutput', directory) },
  chooseDirectory: () => { return ipcRenderer.invoke('directory:choose') }
})

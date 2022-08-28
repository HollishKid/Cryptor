'use strict'

const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')

const decryption = require('./decryption')
const encryption = require('./encryption')

contextBridge.exposeInMainWorld('electronAPI', {
  encrypt: (directory, passphraseValue) => {
    console.log('encrypt')
    //encryption.run(directory, passphraseValue)
  },
  decrypt: (directory, passphraseValue) => { decryption.run(directory, passphraseValue) },
  getPWD: () => { return __dirname },
  checkDirectory: (directory) => { console.log(directory); return ipcRenderer.invoke('directory:check', directory) },
  chooseDirectory: () => { return ipcRenderer.invoke('directory:choose') }
})

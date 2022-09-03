'use strict'

const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')

contextBridge.exposeInMainWorld('electronAPI', {
  encrypt: (inputDirectory, outputDirectory, passphraseValue) => {
    console.log('encrypt')
    //encryption.run(inputDirectory, outputDirectory, passphraseValue)
    return ipcRenderer.invoke('encryption:run', inputDirectory, outputDirectory, passphraseValue)
  },
  decrypt: (inputDirectory, outputDirectory, passphraseValue) => {
    console.log('decrypt')
    return ipcRenderer.invoke('decryption:run', inputDirectory, outputDirectory, passphraseValue)
  },
  getDefaultEncryptInputDir: () => { return __dirname },
  getDefaultEncryptOutputDir: () => { return path.join(__dirname, 'encrypted') },
  getDefaultDecryptInputDir: () => { return path.join(__dirname, 'encrypted') },
  getDefaultDecryptOutputDir: () => { return __dirname },
  canReadDirectory: (directory) => { return ipcRenderer.invoke('directory:canRead', directory) },
  canOutputDirectory: (directory) => { return ipcRenderer.invoke('directory:canOutput', directory) },
  chooseDirectory: () => { return ipcRenderer.invoke('directory:choose') }
})

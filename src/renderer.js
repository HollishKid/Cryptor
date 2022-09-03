'use strict'

const api = window.electronAPI
//const directory = document.getElementById('pwd').innerHTML = api.getPWD()
const passphrase = document.getElementById('passphrase')
const encryptButton = document.getElementById('encrypt')
const decryptButton = document.getElementById('decrypt')
const encryptInputPathButton = document.getElementById('encryptInputPath')
const encryptOutputPathButton = document.getElementById('encryptOutputPath')
const decryptInputPathButton = document.getElementById('decryptInputPath')
const decryptOutputPathButton = document.getElementById('decryptOutputPath')

let encryptInputDirectory = api.getDefaultEncryptInputDir()
let encryptOutputDirectory = api.getDefaultEncryptOutputDir()
let decryptInputDirectory = api.getDefaultDecryptInputDir()
let decryptOutputDirectory = api.getDefaultDecryptOutputDir()

encryptButton.addEventListener('click', async () => {
  const passphraseValue = passphrase.value
  console.log('Passphrase: ' + passphraseValue)

  const checkInput = await api.canReadDirectory(encryptInputDirectory)
  console.log('Directory: ' + encryptInputDirectory)
  const checkOutput = await api.canOutputDirectory(encryptOutputDirectory)
  console.log('Directory: ' + encryptOutputDirectory)

  if (checkInput.code !== 'OK') {
    console.error(`${checkInput.code}: ${checkInput.data}`)
    return
  }

  if (checkOutput.code !== 'OK') {
    console.error(`${checkOutput.code}: ${checkOutput.data}`)
    return
  }

  console.log('Checked Input Directory: ' + checkInput.data)
  console.log('Checked Output Directory: ' + checkOutput.data)
  api.encrypt(checkInput.data, checkOutput.data, passphraseValue)
})

decryptButton.addEventListener('click', async () => {
  const passphraseValue = passphrase.value
  console.log('Passphrase: ' + passphraseValue)

  const checkInput = await api.canReadDirectory(decryptInputDirectory)
  console.log('Directory: ' + decryptInputDirectory)
  const checkOutput = await api.canOutputDirectory(decryptOutputDirectory)
  console.log('Directory: ' + decryptOutputDirectory)

  if (checkInput.code !== 'OK') {
    console.error(`${checkInput.code}: ${checkInput.data}`)
    return
  }

  if (checkOutput.code !== 'OK') {
    console.error(`${checkOutput.code}: ${checkOutput.data}`)
    return
  }

  console.log('Checked Input Directory: ' + checkInput.data)
  console.log('Checked Output Directory: ' + checkOutput.data)
  api.decrypt(checkInput.data, checkOutput.data, passphraseValue)
})

encryptInputPathButton.addEventListener('click', async () => {
  encryptInputDirectory = await api.chooseDirectory()
  console.log(encryptInputDirectory)
})

encryptOutputPathButton.addEventListener('click', async () => {
  encryptOutputDirectory = await api.chooseDirectory()
  console.log(encryptOutputDirectory)
})

decryptInputPathButton.addEventListener('click', async () => {
  decryptInputDirectory = await api.chooseDirectory()
  console.log(decryptInputDirectory)
})

decryptOutputPathButton.addEventListener('click', async () => {
  decryptOutputDirectory = await api.chooseDirectory()
  console.log(decryptOutputDirectory)
})
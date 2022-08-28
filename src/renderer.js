'use strict'

const api = window.electronAPI
//const directory = document.getElementById('pwd').innerHTML = api.getPWD()
const passphrase = document.getElementById('passphrase')
const encryptButton = document.getElementById('encrypt')
const decryptButton = document.getElementById('decrypt')
const pathButton = document.getElementById('path')

let choosenDirectory = api.getPWD()

encryptButton.addEventListener('click', async () => {
  const passphraseValue = passphrase.value
  console.log('Passphrase: ' + passphraseValue)

  const check = await api.checkDirectory(choosenDirectory)
  console.log('Directory: ' + choosenDirectory)
  console.log('Checked Directory: ' + check)
  if (check) {
    api.encrypt(choosenDirectory, passphraseValue)
  }
})

pathButton.addEventListener('click', async () => {
  choosenDirectory = await api.chooseDirectory()
  console.log(choosenDirectory)
})
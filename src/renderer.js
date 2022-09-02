'use strict'

const api = window.electronAPI
//const directory = document.getElementById('pwd').innerHTML = api.getPWD()
const passphrase = document.getElementById('passphrase')
const encryptButton = document.getElementById('encrypt')
const decryptButton = document.getElementById('decrypt')
const inputPathButton = document.getElementById('inputPath')
const outputPathButton = document.getElementById('outputPath')

let inputDirectory = api.getDefaultInputDir()
let outputDirectory = api.getDefaultOutputDir()

encryptButton.addEventListener('click', async () => {
  const passphraseValue = passphrase.value
  console.log('Passphrase: ' + passphraseValue)

  const checkInput = await api.checkInputDirectory(inputDirectory)
  console.log('Directory: ' + inputDirectory)
  const checkOutput = await api.checkOutputDirectory(outputDirectory)
  console.log('Directory: ' + outputDirectory)

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
  api.encrypt(checkInput.data, passphraseValue)
})

inputPathButton.addEventListener('click', async () => {
  inputDirectory = await api.chooseDirectory()
  console.log(inputDirectory)
})

outputPathButton.addEventListener('click', async () => {
  outputDirectory = await api.chooseDirectory()
  console.log(outputDirectory)
})
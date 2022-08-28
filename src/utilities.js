'use strict'

const path = require('path')
const { constants } = require('fs')
const { access } = require('node:fs/promises')

const { dialog } = require('electron')

async function checkDirectory(directory) {
  try {
    console.log(directory)
    const normalized = path.normalize(directory)
    await access(normalized, constants.R_OK && constants.W_OK)
    return normalized
  } catch (error) {
    console.error(error)
    return null
  }
}

async function chooseDirectory() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ["openDirectory"] })
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

module.exports = {
  checkDirectory,
  chooseDirectory
}
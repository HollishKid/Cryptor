'use strict'

const fs = require('fs')
const path = require('path')
const { access } = require('node:fs/promises')

const { dialog } = require('electron')

/**
 * Checks wether an input directory can be read from.
 * 
 * @param {string} directory Input directory string.
 * @returns Normalized path string.
 */
async function checkInputDirectory(directory) {
  try {
    const normalized = path.normalize(directory)
    await access(normalized, fs.constants.R_OK)

    return { code: 'OK', data: normalized }
  } catch (error) {
    console.error(error)
    return { code: 'ERROR', data: 'CANNOTREAD' }
  }
}

/**
 * Checks wether an output directory exists.
 * If so, checks if the directory is empty.
 * If it is not empty, if will return an error code.
 * 
 * @param {string} directory 
 * @returns
 */
async function checkOutputDirectory(directory) {
  try {
    fs.mkdirSync(directory)
  } catch (error) {
    if (error.code !== 'EEXIST') {
      return { code: error.code, data: error }
    }

    if (fs.readdirSync(directory)[0]) {
      return { code: 'ERROR', data: 'OUTPUTDIRNNOTEMPTY' }
    }
  }

  try {
    const normalized = path.normalize(directory)
    await access(normalized, fs.constants.R_OK && fs.constants.W_OK)

    return { code: 'OK', data: normalized }
  } catch (error) {
    console.error(error)
    return { code: 'ERROR', data: 'CANNOTREADORWRITE' }
  }
}


/**
 * Creates the prompt for the user to chose which directory to encrypt.
 * 
 * @returns 
 */
async function chooseDirectory() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ["openDirectory"] })
  if (canceled) {
    return null
  }

  return filePaths[0]
}

module.exports = {
  chooseDirectory,
  checkInputDirectory,
  checkOutputDirectory
}
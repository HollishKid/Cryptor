'use strict'

const fs = require('fs')
const path = require('path')
const { access } = require('node:fs/promises')

const { dialog } = require('electron')

/**
 * Checks wether a directory can be read from.
 * 
 * @param {string} directory
 * @returns
 */
async function canReadDirectory(directory) {
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
 * Checks wether a directory exists (if not, it is created).
 * Checks wether the directory can read from and written to.
 * Checks wether the directory is empty.
 * 
 * @param {string} directory 
 * @returns
 */
async function canOutput(directory) {
  let normalized = null
  try {
    fs.mkdirSync(directory)
    return { code: 'OK', data: null }
  } catch (error) {
    if (error.code !== 'EEXIST') {
      return { code: error.code, data: error }
    }
  }

  try {
    normalized = path.normalize(directory)
    await access(normalized, fs.constants.R_OK && fs.constants.W_OK)
  } catch (error) {
    console.error(error)
    return { code: 'ERROR', data: 'CANNOTREADWRITE' }
  }

  if (fs.readdirSync(directory)[0]) {
    return { code: 'ERROR', data: 'OUTPUTDIRNNOTEMPTY' }
  }

  return { code: 'OK', data: normalized }
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
  canReadDirectory,
  canOutput
}
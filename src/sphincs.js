'use strict'

const superSphincs = require('supersphincs')

async function createKeyPair() {
  return await superSphincs.keyPair()
}

async function exportKeyPair(keyPair, passphrase) {
  const keyData = await superSphincs.exportKeys(keyPair, passphrase)
  return keyData.private.combined
}

async function importKeyPair(keyPair, passphrase) {
  return await superSphincs.importKeys(
    {
      private: {
        combined: keyPair
      }
    },
    passphrase
  )
}

async function encrypt(uint8array, privateKey) {
  return await superSphincs.sign(uint8array, privateKey)
}

async function decrypt(uint8array, publicKey) {
  return await superSphincs.open(uint8array, publicKey)
}

module.exports = {
  createKeyPair,
  exportKeyPair,
  importKeyPair,
  encrypt,
  decrypt
}

'use strict'

const fs = require('fs')
const path = require('path')
const sphincs = require('./sphincs')

async function run(passphrase) {
    const importedKeyPair = fs.readFileSync(path.join(__dirname, 'test/crypted/keys.crypted')).toString()
    const keyPair = await sphincs.importKeyPair(importedKeyPair, passphrase)

    const directory = fs.readdirSync(path.join(__dirname, 'test/crypted'))
    for (i = 0; i < directory.length; i++) {
        const file = directory[i]
        if (file !== 'keys.crypted') {
            const newFileName = file.substring(0, file.lastIndexOf("."))
            const stats = fs.statSync(path.join(__dirname, 'test/crypted', file))
            const size = stats.size

            /**
             * Write stream
             */
            const writeStream = fs.createWriteStream(path.join(__dirname, 'test/decrypted', newFileName))
            writeStream.on('open', () => { console.log('Write open') })
            writeStream.on('ready', () => { console.log('Write ready') })
            writeStream.on('close', () => {
                console.log('Write close')
                console.log(writeStream.bytesWritten)
            })

            /**
             * Read stream
             */
            const readStream = fs.createReadStream(path.join(__dirname, 'test/crypted', file))
            readStream.on('open', () => { console.log('Read open') })
            readStream.on('ready', () => { console.log('Read ready') })
            readStream.on('error', (error) => { console.log(error) })
            readStream.on('data', async (data) => {
                // Unfolding data into Uint8Array
                //console.log(data)
                const arraybuffer = new ArrayBuffer(data.length)
                //console.log(arraybuffer)
                let unint8array = new Uint8Array(arraybuffer)
                //console.log(unint8array)
                for (let i = 0; i < data.length; i++) {
                    unint8array[i] = data[i]
                }

                // Encrypting using SuperSphincs
                let decrypted = await sphincs.decrypt(unint8array, keyPair.publicKey)

                // Folding data back to Buffer
                const buffer = Buffer.from(new Uint8Array(decrypted))

                // Writing to writeStream
                writeStream.write(buffer)
            })
            readStream.on('close', () => {
                console.log('Read close')
                console.log(readStream.bytesRead)
                writeStream.close()
            })
        }
    }
}

module.exports = { run }

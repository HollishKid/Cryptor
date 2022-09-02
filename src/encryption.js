'use strict'

const fs = require('fs')
const path = require('path')
const sphincs = require('./sphincs')

async function run(pathName, passphrase) {
    const inputDirectory = pathName
    const outputDirectory = path.join(pathName, 'encrypted')
    console.log('Input Dir: ' + inputDirectory)
    console.log('Output Dir: ' + outputDirectory)

    const keyPair = await sphincs.createKeyPair()
    const exportedKeyPair = await sphincs.exportKeyPair(keyPair, passphrase)
    fs.writeFileSync(path.join(outputDirectory, 'keys.crypted'), exportedKeyPair)

    const inputFiles = fs.readdirSync(inputDirectory, { withFileTypes: true })
    for (let i = 0; i < inputFiles.length; i++) {
        console.log(!inputFiles[i].isFile())
        if (!inputFiles[i].isFile()) {
            continue
        }
        const file = inputFiles[i].name
        console.log(file)

        const stats = fs.statSync(path.join(inputDirectory, file))
        const size = stats.size
        console.log(inputFiles[i])

        /**
         * Write stream
         */
        const writeStream = fs.createWriteStream(path.join(outputDirectory, file) + '.crypted')
        writeStream.on('open', () => { console.log('Write open') })
        writeStream.on('ready', () => { console.log('Write ready') })
        writeStream.on('close', () => {
            console.log('Write close')
            console.log(writeStream.bytesWritten)
        })

        /**
         * Read stream
         */
        const readStream = fs.createReadStream(path.join(inputDirectory, file))
        readStream.on('open', () => { console.log('Read open') })
        readStream.on('ready', () => { console.log('Read ready') })
        readStream.on('error', (error) => { console.log(error) })
        readStream.on('data', async (data) => {
            readStream.pause()
            // Unfolding data into Uint8Array
            console.log(data)
            const arraybuffer = new ArrayBuffer(data.length)
            console.log(arraybuffer)
            let unint8array = new Uint8Array(arraybuffer)
            console.log(unint8array)
            for (let i = 0; i < data.length; i++) {
                unint8array[i] = data[i]
            }

            // Encrypting using SuperSphincs
            let encrypted = await sphincs.encrypt(unint8array, keyPair.privateKey)
            console.log(encrypted)
            // Folding data back to Buffer
            const buffer = Buffer.from(new Uint8Array(encrypted))
            console.log(buffer)

            // Writing to writeStream
            writeStream.write(buffer)
            readStream.resume()
        })
        readStream.on('close', () => {
            console.log('Read close')
            console.log(readStream.bytesRead)
            writeStream.close()
        })
    }
}

module.exports = { run }

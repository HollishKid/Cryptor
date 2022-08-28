const superSphincs = require('supersphincs')

async function run() {
    const keyPair = await superSphincs.keyPair()
    const message = new Uint8Array([104, 101, 108, 108, 111]) // "hello"

    /* Combined signatures */

    const signed = await superSphincs.sign(message, keyPair.privateKey)
    const verified = await superSphincs.open(signed, keyPair.publicKey) // same as message

    /* Detached signatures */

    const signature = await superSphincs.signDetached(message, keyPair.privateKey)
    const isValid = await superSphincs.verifyDetached(
        signature,
        message,
        keyPair.publicKey
    ) // true

    /* Export and optionally encrypt keys */

    const keyData = await superSphincs.exportKeys(keyPair, 'secret passphrase')

    const importedKeyPair = await superSphincs.importKeys(
        {
            private: {
                combined: keyData.private.combined
            }
        },
        'secret passphrase'
    )

    /*console.log(keyPair)
    console.log(keyData)
    console.log(importedKeyPair)
        */
    console.log(signed)
    console.log(verified)
}

run()
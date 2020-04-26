
const bip39 = require(`bip39`)
const bip32 = require(`bip32`)
const secp256k1 = require(`secp256k1`)
let {PrivateKey} = require('eosjs-ecc')
const HDKey = require('hdkey')

//
const hdPathEos = `m/44'/194'/0'/0/0` // REF: EOS: https://github.com/GetScatter/ScatterDesktop/blob/63701f48dc4597732b6a446c15e90a66fbfa7989/electron/hardware/LedgerWallet.js#L56


async function deriveMasterKey(mnemonic) {
    // throws if mnemonic is invalid
    bip39.validateMnemonic(mnemonic)

    const seed = await bip39.mnemonicToSeed(mnemonic)
    let mk = new HDKey.fromMasterSeed(Buffer.from(seed, 'hex'))
    console.log(mk.publicExtendedKey)

    //get eos-network key
    mk = mk.derive("m/44'/194'/0'")
    console.log(mk.publicExtendedKey)

    //get correct address with xpub
    let xpub = mk.publicExtendedKey
    console.log("xpub: ",xpub)

    const masterKey = bip32.fromSeed(seed)
    return {masterKey,xpub}
}

function deriveKeypair(masterKey) {
    const eosHD = masterKey.derivePath(hdPathEos)
    const privateKey = eosHD.privateKey
    const publicKey = secp256k1.publicKeyCreate(privateKey, true)

    return {
        privateKey,
        publicKey
    }
}

// NOTE: this only works with a compressed public key (33 bytes)
function createEOSAddress(privateKey) {
    try{
        privateKey = PrivateKey.fromBuffer(privateKey)
        privateKey = privateKey.toWif()
        let pubkey = PrivateKey.fromString(privateKey).toPublic().toString()
        return pubkey
    }catch(e){
        throw Error(e)
    }
}

function createEOSPrivate(privateKey) {
    try{
        privateKey = PrivateKey.fromBuffer(privateKey)
        privateKey = privateKey.toString()
        return privateKey
    }catch(e){
        throw Error(e)
    }
}


let build_wallet = async function(mnemonic){
    try{
        const {masterKey,xpub} = await deriveMasterKey(mnemonic)
        //

        const { privateKey, publicKey } = deriveKeypair(masterKey)
        const EOSAddress = createEOSAddress(privateKey)
        const privateKeyEOS = createEOSPrivate(privateKey)
        return {
            xpub,
            privateKey: privateKeyEOS,
            publicKey: publicKey.toString(`hex`),
            EOSAddress
        }
    }catch(e){
        console.error(e)
    }
}

build_wallet("alcohol woman abuse must during monitor noble actual mixed trade anger aisle")
  .then(function(wallet){
      console.log("wallet: ",wallet)
  })

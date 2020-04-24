
//EOSJS
let URL_REMOTE = "https://api.eossweden.org"

const { Api, JsonRpc, RpcError } = require('../dist');
const { JsSignatureProvider } = require('../dist/eosjs-jssig'); // development only
const fetch = require('node-fetch'); // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');

//from test seed
let WALLET_EOS_MASTER_PRIVATE = "5HyML2AXqvTCUnuuYxwymfGGm9G4uUEdXisvufUcCcv6WY6S7S8"

const privateKeys = [WALLET_EOS_MASTER_PRIVATE];
const signatureProvider = new JsSignatureProvider(privateKeys);

const rpc = new JsonRpc(URL_REMOTE, { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

let WALLET_EOS_MASTER = "xhackmebrosx"
let toAddress = "xstagingfoxx"
let memo = "testmemo"
let amount = 0.0001
let run_test = async function(){
    try{

        let result = await api.transact({
            actions: [{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: WALLET_EOS_MASTER,
                    permission: 'active',
                }],
                data: {
                    from: WALLET_EOS_MASTER,
                    to: toAddress,
                    quantity: amount+' EOS',
                    memo: memo,
                },
            }]
        }, {
            broadcast:false,
            blocksBehind: 3,
            expireSeconds: 300,
        });

        //console.log("result: ",result)
        let txBytes = result.serializedTransaction

        //tx hex
        let txHex = new Buffer(txBytes).toString('hex')
        let signature = result.signatures
        console.log("txHex: ",txHex)
        console.log("signature: ",signature[0])
        console.log("expected : ","SIG_K1_K5RaXxg1U8eLihD4zng72AHjTwdcCon3sTiiE9aKNAbq69mtmuocdgZrD8fQKqefGbJTeSahCa4Ve4Hbnhj7GmJEAGGx3K")

    }catch(e){
        console.error(e)
    }
}
run_test()

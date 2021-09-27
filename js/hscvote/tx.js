const Web3 = require('web3');
const fs = require('fs');
require('dotenv').config();
const debug = require("debug");
const txlog = debug('tdddx');
// debug.enable("formula");
// // // debug.disable("formula");
// // // const trader = debug('trader');
// debug.enable("trader");
// debug.disable("trader");

// debug.enable("*");

// debug.enable('foo:*,-foo:bar');
// let namespaces = debug.disable();
// debug.enable(namespaces);

// 

const path = require('path')

const readJSON = (fileName) => JSON.parse(fs.readFileSync(path.join(__dirname, fileName)));


const secrets = readJSON('./._');
const accounts = Object.keys(secrets);

const NETWORK_ID = process.env.CHAIN_ID || 170;
const CHAIN_ID = process.env.CHAIN_ID || 170;
const PROVIDER_URL = process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));// // wei是以太坊上的的最小单位，ether小数点后18位为一个wei



let contract_instances = {}
let contracts = Object.values(contract_instances);
const instanceContract = async (contractAddress, abijson) => {
    let abi = require(abijson).abi;
    let contract = new web3.eth.Contract(abi, contractAddress);
    if (undefined == contract) {
        console.error("instanceContract failed", contractAddress);
        return;
    }

    return contract;
}
const abis = readJSON("./abis.json")
const contract_addresses = Object.keys(abis);

const instanceContracts = async () => {
    for (let k of Object.keys(abis)) {
        let obj = await instanceContract(k, "./abis/" + abis[k]);
        contract_instances[k] = obj;
    }
    contracts = Object.values(contract_instances);
    return [contracts,contract_addresses,accounts];
};



let id;

var Tx = require('ethereumjs-tx').Transaction;
const ethereumjs_common = require('ethereumjs-common').default;
const gas_price_buffer = process.env.GAS_PRICE_BUFFER || 1
const gas_limit_buffer = process.env.GAS_LIMIT_BUFFER || 1.1
async function sendSignedTx(gas, account, encodedabi, contract_address_index, isTokenIdOption, msg_value) {
    let contract_address=contract_addresses[contract_address_index];
    let account_secrets = secrets[account];
    let isTokenId = isTokenIdOption || false
    let value = msg_value || 0
    let nonce = await web3.eth.getTransactionCount(account, "pending");


    var privateKey = Buffer.from(account_secrets, 'hex');

    let gasprice = await web3.eth.getGasPrice();
    gasprice = Math.ceil(gasprice * gas_price_buffer);
    gas = Math.floor(gas * gas_limit_buffer)
    var rawTx = {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasprice),
        gasLimit: web3.utils.toHex(gas),
        from: account,
        to: contract_address,
        value: web3.utils.toHex(web3.utils.toWei(value.toString())),//'0x00',//
        data: encodedabi,
        chainId: web3.utils.toHex(170)
    }
    var common = ethereumjs_common.forCustomChain('ropsten', { networkId: web3.utils.toHex(NETWORK_ID), chainId: web3.utils.toHex(CHAIN_ID), name: 'geth' }, 'muirGlacier');
    var tx = new Tx(rawTx, { "common": common });

    tx.sign(privateKey);

    var serializedTx = tx.serialize();
    console.log("=====sendSignedTransaction===")
    let receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    console.log(JSON.stringify(receipt))
    if (isTokenId) {
        try {
            id = receipt["logs"][0]["topics"][3];
            return id;
        } catch (error) {
            console.error(error)
        }
        return 0;
    }

    // var d2 = new Date().getTime();
    // console.log("elapse time" + (d2 - d1));

    // sleep.msleep(100)

    return receipt;
}

async function transferHoo(account_secrets, from, to, value) {
    let gas = 21000
    let encodedabi = "0x0"
    let isTokenIdOption = false;
    await sendSignedTx(gas, from, account_secrets, encodedabi, to, isTokenIdOption, value)
}

// sendSignedTx();

module.exports = { sendSignedTx, transferHoo,instanceContracts }

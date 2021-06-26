
const Web3 = require('web3');

// // // Connect to local Ethereum node
// const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-ropsten.alchemyapi.io/v2/Z42Blpj7cANVPl6vizpQbu_DibFlfWWj'));
const web3 = new Web3(new Web3.providers.HttpProvider('https://http-mainnet2.hoosmartchain.com'));

let handlers = {

    "default": (async function () {
        console.log("=====================tx=====================")
    let txhash = "0x8a15b9241d3785843cbf34c741bffd83ae1a4ed14e247b4c0b864b6d389baa38"
    let tx0 = await web3.eth.getTransaction(txhash)
    console.log(tx0)
    
    let txR = await web3.eth.getTransactionReceipt(txhash)
    console.log(txR)
    console.log(txR.logs[0].topics)
    console.log("=====================tx receipt=====================")
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();


// transferToken(REDEEM, );
(async function () {



})();


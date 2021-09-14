
const Web3 = require('web3');

// // // Connect to local Ethereum node
// const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-ropsten.alchemyapi.io/v2/Z42Blpj7cANVPl6vizpQbu_DibFlfWWj'));
const web3 = new Web3(new Web3.providers.HttpProvider('https://http-testnet2.hoosmartchain.com'));

let handlers = {

    "default": (async function () {
        console.log("=====================tx=====================")
    let txhash = "0xc00aa172ff4e8a6740518136767e9b88877cefc3aa3a83ab909991929d1f8d1e"
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


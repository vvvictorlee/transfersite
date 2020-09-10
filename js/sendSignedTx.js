
const Web3 = require('web3');
const  util = require('./util');




const admin = "0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568";
const adminr = "0x1084d79A66EF86BFc9c945d4a21159a024dEE14e";
const secrets = util.loadJson('data/secrets.json');
const adminr_secrets=secrets.key;
// const password = "123456";
const REDEEM = "0x99B9Bc4Ca03C227d9cBe0960c416adDE7146026F";//"0x2a103D4F9d64B4124F0a2Dd556DEee0926A92527";//redeem.address;
const REDEEM_ROPSTEN = "0x72c09d4fd187b4336fa4ab66e4360f626619483b";//"0x2a103D4F9d64B4124F0a2Dd556DEee0926A92527";//redeem.address;

const TTOKEN_ = "0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5";

// const BN = require('BigNumber.js');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/206de317234e48e28a7dd1abbd914e26'));
// // wei是以太坊上的的最小单位，ether小数点后18位为一个wei


let abi = require("../json/Redeem_Ropsten.json");///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let Redeem_Ropsten = new web3.eth.Contract(abi, REDEEM_ROPSTEN, { "from": admin });//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63

let tabi = require("../json/ERC20.json");///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let erc20 = new web3.eth.Contract(tabi, TTOKEN_);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63



// var balanceWei =  web3.eth.getBalance(admin).then(console.log);//.toNumber();
// // 从wei转换成ether
// // var balance = web3.utils.fromWei(web3.utils.toBN(balanceWei), 'ether');
// console.log(balanceWei);
// console.log(balance);
const user1 = "0x1084d79A66EF86BFc9c945d4a21159a024dEE14e";
const user2 = "0x929378dbc9a1fdc0d05529e48097ff65c6902231";
const token = "0x06403d9dc00b7cf577023d49f96f899aed86d6c0";
let tokens = ["0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5",
    "0x8d3acd2969ca969188bd8b227dfca09e1691e263",
    "0xc5201589361c2da2b07df626f1cab71b4255b16e",
    "0xe59eb769a705443936a043b07ec1892b448ca24d"];

(async function () {




})();


var Tx = require('ethereumjs-tx').Transaction;

async function sendSignedTx() {

    let nonce = await web3.eth.getTransactionCount(admin, "pending");
    console.log(nonce);

    let encodedabi = await Redeem_Ropsten.methods.verify(token).encodeABI();//send({ from: admin4 });

    var privateKey = Buffer.from(adminr_secrets, 'hex');
    const gasprice = await web3.eth.getGasPrice();
    var rawTx = {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasprice),
        gasLimit: web3.utils.toHex(3000000),
        from: admin,
        to: REDEEM,
        value: '0x00',
        data: encodedabi,
        chainId: 3
    }

    // var rawTx = {
    //             "from": fromAddress, // Add this
    //             "nonce": "0x" + nonces.toString(16),
    //             "gasPrice": web3.utils.toHex('20000000000'),
    //             "gasLimit": web3.utils.toHex('21000'),
    //             "to": contractAddr,
    //             "value": "0x0",
    //             "data": dataso,
    //             "chainId": 1 // For mainnet // Use 3 for ropsten testnet
    //         };

    // let gas = await Redeem_Ropsten.methods.verify(token).estimateGas();
    // rawTx.gas = gas*1.2;
    var tx = new Tx(rawTx, { 'chain': 'ropsten', hardfork: 'istanbul' });
    tx.sign(privateKey);

    var serializedTx = tx.serialize();

    let receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    console.log(receipt);
}
// sendSignedTx();






// var number = web3.eth.getTransactionCount(address).then(function(count) {
//   console.log("Count " + count);
//   var privateKey = new EthJS.Buffer.Buffer(privateKey, 'hex');
//   console.log(web3.utils.toHex(finalAnswers));
//   var rawTx = {
//     nonce: web3.utils.toHex(count),
//     to: '0xF1aA87F7058e5ABE561cCe8A466eE1CC17d69639',
//     value: 0,
//     data: web3.utils.toHex(finalAnswers),
//     gas: 50000,
//     gasPrice: web3.utils.toWei('300', 'gwei')
//   };

//   var tx = new EthJS.Tx(rawTx);
//   tx.sign(privateKey);

//   var serializedTx = tx.serialize();


//   web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log);
// });
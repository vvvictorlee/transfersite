
const Web3 = require('web3');
const { MerkleTree } = require("./merkleTree");

// // // Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

const admin = "0x10aCB77eB8dB440fdD9b188a68DA406344c1Eb8b";
const password = "123456";
const REDEEM = "0x7416DB6a1021e61cdA12dce8cE99d14c21D2d379";//Redeem.methods.address;
const TTOKEN_ = "0x431D57Fa1dAe7cf0bB64D8aAA94f371962434e59";
const user1 = "0x922b5be55dfc704904c5ba8880cc19904108e94d";

const admin1 = "0xead336e2D75E30fBa5CaDb93c5D667EfB5a3B546";

///step1 test verify     修改admin账户
const admin2 = "0xb1ddf7186B013388766e05d4F724B8cE8c1d5536";
// Redeem.methods. =  Redeem.new(TBAL);

// tbal.


const epochblocks = 40320 + 10;

let contract = require("./SwapXToken.json");


let tabi = contract.abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let TToken = new web3.eth.Contract(tabi, TTOKEN_);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
// console.log(TToken.methods)



let abi = require("./MerkleRedeem.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let Redeem = new web3.eth.Contract(abi, REDEEM);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
// console.log(Redeem.methods)

const token1 = "0x431D57Fa1dAe7cf0bB64D8aAA94f371962434e59";

const token2 = "0x0cEeD9D6CFD5558f0dA79FA21644E4c7Ff106c8F";
let token = "";
// transferToken(REDEEM, );
(async function () {

    ////step 3    
    await web3.eth.personal.unlockAccount(admin, password);

reth = new web3.eth.Contract(contract.abi)
    .deploy({ data: contract.evm.bytecode.object, arguments: {} })
    .send({ from: admin2, gas: '8000000' }, function (error, transactionHash) { })
    .on('error', function (error) { })
    .on('transactionHash', function (transactionHash) { })
    .on('receipt', function (receipt) {
token = receipt.contractAddress;
        console.log(receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', function (confirmationNumber, receipt) { })
    .then(function (newContractInstance) {
        console.log(newContractInstance.options.address) // instance with the new contract address
    });



    ////step3   添加
    await TToken.methods.addIssuer(REDEEM).send({ from: admin2 });

    /////step4 认证 
    await Redeem.methods.verify(token1).send({ from: admin });

    ///step5  验证 为true
    let result1 = await Redeem.methods.verified(token).call({ from: admin });
    console.log(result1);



})();


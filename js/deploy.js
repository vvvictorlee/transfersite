
const Web3 = require('web3');

// // // Connect to local Ethereum node
// const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/206de317234e48e28a7dd1abbd914e26'));

const path = require('path');
const fs = require('fs');
const solc = require('solc');



// const helloPath = path.resolve(__dirname, '.', 'TToken.sol');
// const source = fs.readFileSync(helloPath, 'UTF-8');

// var input = {
//     language: 'Solidity',
//     sources: {
//         'TToken.sol': {
//             content: source
//         }
//     },
//     settings: {
//         outputSelection: {
//             '*': {
//                 '*': ['*']
//             }
//         }
//     }
// };
// // console.log(JSON.parse(solc.compile(JSON.stringify(input))));
// // console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts['TToken.sol'].TToken);
// const { abi: interface, evm: { bytecode: { object } } } = JSON.parse(solc.compile(JSON.stringify(input))).contracts['TToken.sol'].TToken; // 

// module.exports = { interface, object }; // object is the actual name of the bytecode

const admin = "0x10aCB77eB8dB440fdD9b188a68DA406344c1Eb8b";
const admin1 = "0xead336e2D75E30fBa5CaDb93c5D667EfB5a3B546";
const admin2 = "0xb1ddf7186B013388766e05d4F724B8cE8c1d5536";
const admin4 = "0x9842495d6bAB5Cb632777Ff25B5b4c1e1d595f24";
const admin0 = "0x0DB1bB1097ac3b7e26B3A4Cf35E2f19E07d24568";
const password = "123456";
const password0 = "123456";

let contract = require("../json/MerkleRedeem.json");
// console.log(contract.abi)
// console.log("=============")
// console.log(contract.evm.bytecode.object)
// console.log("=============")
// console.log(contract.evm.deployedBytecode.object)

(async function () {

    ////step 3
    await web3.eth.personal.unlockAccount(admin0, password);

// const accounts =  web3.eth.getAccounts();
reth = new web3.eth.Contract(contract.abi)
    .deploy({ data: contract.bytecode, arguments: {} })
    .send({ from: admin4, gas: '8000000' }, function (error, transactionHash) { })
    .on('error', function (error) { })
    .on('transactionHash', function (transactionHash) { })
    .on('receipt', function (receipt) {
        console.log(receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', function (confirmationNumber, receipt) { })
    .then(function (newContractInstance) {
        console.log(newContractInstance.options.address) // instance with the new contract address
    });


})();




//0xb67B487377BD6e74db3892514E4477e24da4B53c


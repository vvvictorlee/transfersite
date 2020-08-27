
const Web3 = require('web3');

// // // Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

const path = require('path');
const fs = require('fs');
const solc = require('solc');



const helloPath = path.resolve(__dirname, '.', 'TToken.sol');
const source = fs.readFileSync(helloPath, 'UTF-8');

var input = {
    language: 'Solidity',
    sources: {
        'TToken.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};
// console.log(JSON.parse(solc.compile(JSON.stringify(input))));
// console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts['TToken.sol'].TToken);
const { abi: interface, evm: { bytecode: { object } } } = JSON.parse(solc.compile(JSON.stringify(input))).contracts['TToken.sol'].TToken; // 

// module.exports = { interface, object }; // object is the actual name of the bytecode


const admin = "0x10aCB77eB8dB440fdD9b188a68DA406344c1Eb8b";


// const accounts =  web3.eth.getAccounts();
reth = new web3.eth.Contract(interface)
    .deploy({ data: object, arguments: ['Wrapped wEther', 'RETH', 18] })
    .send({ from: admin, gas: '6000000' }, function (error, transactionHash) { })
    .on('error', function (error) { })
    .on('transactionHash', function (transactionHash) { })
    .on('receipt', function (receipt) {
        console.log(receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', function (confirmationNumber, receipt) { })
    .then(function (newContractInstance) {
        console.log(newContractInstance.options.address) // instance with the new contract address
    });


reth = new web3.eth.Contract(interface)
    .deploy({ data: object, arguments: ['Wrapped VEther', 'VETH', 18] })
    .send({ from: admin, gas: '6000000' }, function (error, transactionHash) { })
    .on('error', function (error) { })
    .on('transactionHash', function (transactionHash) { })
    .on('receipt', function (receipt) {
        console.log(receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', function (confirmationNumber, receipt) { })
    .then(function (newContractInstance) {
        console.log(newContractInstance.options.address) // instance with the new contract address
    });


//0xb67B487377BD6e74db3892514E4477e24da4B53c


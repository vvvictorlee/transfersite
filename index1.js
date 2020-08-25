
const Web3 = require('web3');

// // // Connect to local Ethereum node
// const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

let abi = require("/Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json").abi;
let contract = new web3.eth.Contract(abi, "0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63");
if(undefined==contract)
{
        console.log("un");
return;
}

// contract.events.allEvents({
//     filter: {}, // Using an array means OR: e.g. 20 or 23
//     fromBlock: 578042
// }, function(error, event){ console.log(event); })
// .on('data', function(event){
//     console.log(event); // same results as the optional callback above
// })
// .on('changed', function(event){
//     // remove event from local database
// })
// .on('error', console.error);


// console.log(contract.methods)
// contract.methods.newBPool().call({from: '0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568'}, function(error, result){
//   console.log("error:")
// console.log(error)
// console.log("result:")
// console.log(result)
// });








// let abi = require("/Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/TToken.json").abi;
// let contract = new web3.eth.Contract(abi, "0xb67B487377BD6e74db3892514E4477e24da4B53c");
// if(undefined==contract)
// {
//         console.log("un");
// return;
// }
// console.log(contract.methods)
// contract.methods.mint("0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568", web3.utils.toWei('5')).call({from: '0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568'});
// // weth.mint(admin, toWei('5'));


// const path = require('path');
// const fs = require('fs');
// const solc = require('solc');



// const helloPath = path.resolve(__dirname, '.', 'TToken.sol');
// const source = fs.readFileSync(helloPath, 'UTF-8');

// var input = {
//     language: 'Solidity',
//     sources: {
//         'TToken.sol' : {
//             content: source
//         }
//     },
//     settings: {
//         outputSelection: {
//             '*': {
//                 '*': [ '*' ]
//             }
//         }
//     }
// }; 
// console.log(JSON.parse(solc.compile(JSON.stringify(input))));
// console.log( JSON.parse(solc.compile(JSON.stringify(input))).contracts['TToken.sol'].TToken);
// const { abi: interface, evm: { bytecode: { object } } } = JSON.parse(solc.compile(JSON.stringify(input))).contracts['TToken.sol'].TToken; // 

// module.exports = { interface, object }; // object is the actual name of the bytecode




// const ganache = require('ganache-cli');
// const Web3 = require('web3');
// const web3 = new Web3(ganache.provider());
// const { interface, object: bytecode } = require('../compile'); 
// i've renamed object with bytecode 

// const accounts =  web3.eth.getAccounts();
//   templatename =  new web3.eth.Contract(interface)
//     .deploy({ data: object, arguments: ['Wrapped Ether', 'WETH', 18] })
//     .send({ from: "0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568", gas: '6000000' }, function(error, transactionHash){  })
// .on('error', function(error){  })
// .on('transactionHash', function(transactionHash){ })
// .on('receipt', function(receipt){
//    console.log(receipt.contractAddress) // contains the new contract address
// })
// .on('confirmation', function(confirmationNumber, receipt){  })
// .then(function(newContractInstance){
//     console.log(newContractInstance.options.address) // instance with the new contract address
// });

//0xb67B487377BD6e74db3892514E4477e24da4B53c


// console.log(JSON.parse(solc.compile(JSON.stringify({
//   language: 'Solidity',
//   sources: {
//     'lottery.sol': {
//       content: source,
//     },
//   },
//   settings: {
//     outputSelection: {
//       '*': {
//         '*': ['evm', 'bytecode'],
//       },
//     },
//   },
// }))).contracts['lottery.sol'].Lottery);



// const templatePath = path.resolve(__dirname, 'contracts', 'templatename.sol');
// const source = fs.readFileSync(templatePath, 'utf8');

// const input = {
//     language: 'Solidity',
//     sources: {
//         'yourtemplate.sol': {
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
// }

// const { abi: interface, evm: { bytecode: { object } } } = JSON.parse(solc.compile(JSON.stringify(input))).contracts['yourtemplate.sol'].Templatename; // 

// module.exports = { interface, object }; // object is the actual name of the bytecode




// const ganache = require('ganache-cli');
// const Web3 = require('web3');
// const web3 = new Web3(ganache.provider());
// const { interface, object: bytecode } = require('../compile'); 
// // i've renamed object with bytecode 

// const accounts = await web3.eth.getAccounts();
//   templatename = await new web3.eth.Contract(interface)
//     .deploy({ data: bytecode, arguments: [INPUT_PARAMETER_GOES_HERE] })
//     .send({ from: accounts[0], gas: '1000000' });




// const TTOKEN_ = "0x609dbeE878452065E4d5bB8A2578b4BD5b399be6";
// const s = "10_totals_"+TTOKEN_;
// let a  = s.split("_");
// console.log(a);
// let b = s.substr(s.lastIndexOf("_")+1);
// console.log(b);

const Web3 = require('web3');

// // // Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

const admin = "0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568";
const password = "123456";
const REDEEM = "0x2a103D4F9d64B4124F0a2Dd556DEee0926A92527";//redeem.address;
const TTOKEN_ = "0x609dbeE878452065E4d5bB8A2578b4BD5b399be6";

// let TToken = {};
// function instanceToken() {
//     let tabi = require("./TToken.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
//     TToken = new web3.eth.Contract(tabi, TTOKEN_);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
//     if (undefined == TToken) {
//         console.log("un");
//         return;
//     }
//     // console.log(TToken.methods)
// }


// function unlock(address, password) {
//     web3.eth.personal.unlockAccount(address, password).
//         then(() => { console.log('Account unlocked.'); }).
//         catch(console.error);
// }

// // tbal =  TToken.new("Test Bal", "TBAL", 18);
// //  tbal.mint(admin, web3.utils.toWei("145000"));
// // TBAL = tbal.address;
// function mint(adress, amount) {
//     TToken.methods.mint(address, web3.utils.toWei(amount)).send({ from: admin }, function (error, result) {
//         console.log("error:")
//         console.log(error)
//         console.log("result:")
//         console.log(result)
//     });
// }

// function balanceOf(address) {
//     TToken.methods.balanceOf(address).call({ from: address }, function (error, result) {
//         console.log("error:")
//         console.log(error)
//         console.log("result:")
//         console.log(result)
//     }).then(console.log);
// }

// let Redeem = {};
// function instanceRedeem() {
//     let abi = require("./Redeem.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
//     Redeem = new web3.eth.Contract(abi, REDEEM);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
//     if (undefined == Redeem) {
//         console.log("un");
//         return;
//     }
//     // console.log(Redeem.methods)
// }



// // redeem =  Redeem.new(TBAL);

// // tbal.transfer(REDEEM, utils.toWei("20000"));

// function transferToken(address, amount) {
//     TToken.methods.transfer(address, web3.utils.toWei(amount)).send({ from: admin }, function (error, result) {
//         console.log("error:")
//         console.log(error)
//         console.log("result:")
//         console.log(result)
//     });
// }


// function balanceOfC(address, owner) {
//     TToken.methods.balanceOf(address).call({ from: owner }, function (error, result) {
//         console.log("error:")
//         console.log(error)
//         console.log("result:")
//         console.log(result)
//     }).then(console.log);
// }

// const weekblocks = 40320 + 10;

// //step 1
// instanceToken();
// //step 2
// instanceRedeem();

// //step 3
// //mint(admin);

// //step 4 tran
// (async function () {
//     let accounts = await web3.eth.getAccounts();

//     // console.log(accounts);

//     await web3.eth.personal.unlockAccount(admin, password);

//     let lastBlock = (await web3.eth.getBlock("latest"));
//     // console.log(lastBlock);
//     let firstBlock = (await web3.eth.getBlock(1));
//     let week2Block = (await web3.eth.getBlock(weekblocks));
//     // console.log(firstBlock);
//     // console.log(Redeem.methods);
//     // await Redeem.methods.finishWeek(1, firstBlock.timestamp, firstBlock.hash).send({from:admin});
//     // await Redeem.methods.seedAllocation(1, accounts[1], web3.utils.toWei("1000")).send({from:admin});
//     // await Redeem.methods.finishWeek(2, week2Block.timestamp, week2Block.hash).send({from:admin});

//     // await web3.eth.personal.unlockAccount(accounts[1], password);
//     // // let result = await Redeem.methods.balanceOf(accounts[1]).call({from:admin});
//     // // console.log(result);


//     // // await Redeem.methods.claim().send({ from: accounts[1] });

//     // // let result = await tbal.balanceOf(accounts[1]);
//     // let result = await TToken.methods.balanceOf(accounts[1]).call({ from: accounts[1] });
//     // console.log(result);

// })();


// // function checkAllBalances() {
// //     web3.eth.getAccounts(function (err, accounts) {
// //         accounts.forEach(function (id) {
// //             web3.eth.getBalance(id, function (err, balance) {
// //                 console.log("" + id + ":\tbalance: " + web3.utils.fromWei(balance, "ether") + " ether");
// //             });
// //         });
// //     });
// // };

// // checkAllBalances()







// // let Hello = new web3.eth.Contract(JSON.parse(helloCompiled.interface), null, { 
// //     data: '0x' + helloCompiled.bytecode 
// // });

// // contract.events.allEvents({
// //     filter: {}, // Using an array means OR: e.g. 20 or 23
// //     fromBlock: 578042
// // }, function(error, event){ console.log(event); })
// // .on('data', function(event){
// //     console.log(event); // same results as the optional callback above
// // })
// // .on('changed', function(event){
// //     // remove event from local database
// // })
// // .on('error', console.error);


// // console.log(contract.methods)
// // contract.methods.newBPool().call({from: '0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568'}, function(error, result){
// //   console.log("error:")
// // console.log(error)
// // console.log("result:")
// // console.log(result)
// // });


// // contract.methods.setBLabs('0x10acb77eb8db440fdd9b188a68da406344c1eb8b').call({from: '0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568'}, function(error, result){
// //   console.log("error:")
// // console.log(error)
// // console.log("result:")
// // console.log(result)
// // });





// // let abi = require("/Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/TToken.json").abi;
// // let contract = new web3.eth.Contract(abi, "0xb67B487377BD6e74db3892514E4477e24da4B53c");
// // if(undefined==contract)
// // {
// //         console.log("un");
// // return;
// // }
// // console.log(contract.methods)
// // contract.methods.mint("0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568", web3.utils.toWei('5')).call({from: '0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568'});
// // // weth.mint(admin, toWei('5'));


// // const path = require('path');
// // const fs = require('fs');
// // const solc = require('solc');



// // const helloPath = path.resolve(__dirname, '.', 'TToken.sol');
// // const source = fs.readFileSync(helloPath, 'UTF-8');

// // var input = {
// //     language: 'Solidity',
// //     sources: {
// //         'TToken.sol' : {
// //             content: source
// //         }
// //     },
// //     settings: {
// //         outputSelection: {
// //             '*': {
// //                 '*': [ '*' ]
// //             }
// //         }
// //     }
// // }; 
// // console.log(JSON.parse(solc.compile(JSON.stringify(input))));
// // console.log( JSON.parse(solc.compile(JSON.stringify(input))).contracts['TToken.sol'].TToken);
// // const { abi: interface, evm: { bytecode: { object } } } = JSON.parse(solc.compile(JSON.stringify(input))).contracts['TToken.sol'].TToken; // 

// // module.exports = { interface, object }; // object is the actual name of the bytecode




// // const ganache = require('ganache-cli');
// // const Web3 = require('web3');
// // const web3 = new Web3(ganache.provider());
// // const { interface, object: bytecode } = require('../compile'); 
// // i've renamed object with bytecode 

// // const accounts =  web3.eth.getAccounts();
// //   templatename =  new web3.eth.Contract(interface)
// //     .deploy({ data: object, arguments: ['Wrapped Ether', 'WETH', 18] })
// //     .send({ from: "0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568", gas: '6000000' }, function(error, transactionHash){  })
// // .on('error', function(error){  })
// // .on('transactionHash', function(transactionHash){ })
// // .on('receipt', function(receipt){
// //    console.log(receipt.contractAddress) // contains the new contract address
// // })
// // .on('confirmation', function(confirmationNumber, receipt){  })
// // .then(function(newContractInstance){
// //     console.log(newContractInstance.options.address) // instance with the new contract address
// // });

// //0xb67B487377BD6e74db3892514E4477e24da4B53c


// // console.log(JSON.parse(solc.compile(JSON.stringify({
// //   language: 'Solidity',
// //   sources: {
// //     'lottery.sol': {
// //       content: source,
// //     },
// //   },
// //   settings: {
// //     outputSelection: {
// //       '*': {
// //         '*': ['evm', 'bytecode'],
// //       },
// //     },
// //   },
// // }))).contracts['lottery.sol'].Lottery);



// // const templatePath = path.resolve(__dirname, 'contracts', 'templatename.sol');
// // const source = fs.readFileSync(templatePath, 'utf8');

// // const input = {
// //     language: 'Solidity',
// //     sources: {
// //         'yourtemplate.sol': {
// //             content: source
// //         }
// //     },
// //     settings: {
// //         outputSelection: {
// //             '*': {
// //                 '*': ['*']
// //             }
// //         }
// //     }
// // }

// // const { abi: interface, evm: { bytecode: { object } } } = JSON.parse(solc.compile(JSON.stringify(input))).contracts['yourtemplate.sol'].Templatename; // 

// // module.exports = { interface, object }; // object is the actual name of the bytecode




// // const ganache = require('ganache-cli');
// // const Web3 = require('web3');
// // const web3 = new Web3(ganache.provider());
// // const { interface, object: bytecode } = require('../compile'); 
// // // i've renamed object with bytecode 

// // const accounts = await web3.eth.getAccounts();
// //   templatename = await new web3.eth.Contract(interface)
// //     .deploy({ data: bytecode, arguments: [INPUT_PARAMETER_GOES_HERE] })
// //     .send({ from: accounts[0], gas: '1000000' });




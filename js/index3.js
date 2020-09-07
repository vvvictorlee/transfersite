// const TTOKEN_ = "0x609dbeE878452065E4d5bB8A2578b4BD5b399be6";
// const s = "10_totals_" + TTOKEN_;
// let a = s.split("_");
// console.log(a);
// let b = s.substr(s.lastIndexOf("_")+1);
// console.log(b);

// let handlers = {
//     "get_reward_list": (async function () {
//         console.log("a");
//     }),
//     "get_reward_list1": (async function () {
//         console.log("b");
//     }),
//     "default": (async function () {
//         console.log("c");
//     })

// };

// const f = handlers["get_reward_list"] || handlers["default"];
// const h = handlers["1"] || handlers["default"];

// f();
// h();

// console.log(process.argv);


// for (let i = 0; i < process.argv[2]; i++) 
// {
// console.log(i);
// }

const Web3 = require('web3');

// // // Connect to local Ethereum node
// const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));
// global.HTTP_PROVIDER = "https://ropsten.infura.io/v3/afea481cd4da4deabd6d296e6509b601"; // 测试网RPC接口

// global.CONTRACT_FACTORY = "0x39df422789de097f82ebc157e38880c2cc9a7f19"; // factory
// global.CONTRACT_REDEEM = "0x72c09d4fd187b4336fa4ab66e4360f626619483b"; // redeem

// global.CONTRACT_SWP = "0x06403d9dc00b7cf577023d49f96f899aed86d6c0"; // SWP
// global.CONTRACT_USDT = "0xd683ad07347f68baa83d3b8ed64de88349620274"; // USDT # SXAT

// global.BLOCK_AWARDS =  '2000000000000000000000';
// global.MAX_SUPPLY = '5760000000000000000000000'; // *1000000000000000000

// global.BLOCK_AWARDS_SWP =  '1000000000000000000000';
// global.MAX_SUPPLY_SWP = '2880000000000000000000000'; // *1000000000000000000

// global.ADDRESS_COMMUNITY = '0xa4a4005a9497548427a141d53ad8869829fb9ec7';   // 社区收款账户，用于获取挖矿奖励
// global.ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

const admin = "0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568";
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
const user1 = "0x929378dbc9a1fdc0d05529e48097ff65c6902231";
const token = "0x06403d9dc00b7cf577023d49f96f899aed86d6c0";
const tokens = ["0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5",
    "0x8d3acd2969ca969188bd8b227dfca09e1691e263",
    "0xc5201589361c2da2b07df626f1cab71b4255b16e",
    "0xe59eb769a705443936a043b07ec1892b448ca24d"];

(async function () {



    let result1 = await Redeem_Ropsten.methods.merkleRoots(1, 3).call({ from: user1 });
    console.log(result1);
    for (const t of tokens) {
        result1 = await Redeem_Ropsten.methods.claimStatus(user1, t, 1, 3).call({ from: user1 });
        console.log(t, result1);

        let tc = new web3.eth.Contract(tabi, t);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63

        let symbol = await tc.methods.symbol().call();
        console.log("symbol==", symbol);
        result1 = await tc.methods.balanceOf(user1).call();
        console.log("user1 balance==", result1);
        result1 = await tc.methods.balanceOf(REDEEM_ROPSTEN).call();
        console.log("REDEEM_ROPSTEN balance==", result1);
    }


    result1 = await Redeem_Ropsten.methods.verifiedTokens().call({ from: admin });
    console.log("verifiedTokens", result1);


    // var transactionObject = {
    //             from: ownerAddress,
    //             to: contractAddress,
    //             gasLimit: web3.utils.toHex(3000000),
    //             data: encodedABI,
    //             value: value,
    //             chainId: chainId,
    //           nonce:nonce,
    //         };

    //   web3.eth.accounts.signTransaction(transactionObject, privateKey, function (err, signed) {
    //             console.log("signTransaction err: " + err);
    //             console.log("signTransaction signed: " + signed.rawTransaction);
    //             web3.eth.sendSignedTransaction(signed.rawTransaction, function (err, res) {
    //                 console.log(res,err)
    //                 if (err == false) {
    //                     var queryUpdate = "update withdrawals set status='sent', amount= " + row.amount + " where id=" + row.id
    //                     connection.query(queryUpdate, function (error, results, fields) {
    //                         if (error) {
    //                             throw error;
    //                         }
    //                         console.log('The solution is: ', results);
    //                     })
    //                 }
    //                 console.log("sendSignedTransaction  res: " + res);
    //             });




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

})();

// const {getJsonFileList} = require("./getJsonFileList.js")

// const s = getJsonFileList("/Users/lisheng/mygit/vvvictorlee/transfersite1");
// console.log(s);


// const weekblocks = 40320 + 10;

// //step 1
// instanceToken();
// //step 2
// instanceRedeem();

// //step 3
// //mint(admin);

// //step 4 tran

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

var Tx = require('ethereumjs-tx').Transaction;

async function sendSignedTx() {

    let nonce = await web3.eth.getTransactionCount(admin, "pending");
    console.log(nonce);

    let encodedabi = await Redeem_Ropsten.methods.verify(token).encodeABI();//send({ from: admin4 });

    var privateKey = Buffer.from('62a51d2f868ca64bda12db2fbb0a17fa5561dea692f38cc97d8a4a4de2f91382', 'hex');
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




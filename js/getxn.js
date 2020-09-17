
const Web3 = require('web3');
const { MerkleTree } = require("./merkleTree");

// // // Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

const admin = "0x10aCB77eB8dB440fdD9b188a68DA406344c1Eb8b";
const password = "123456";
const REDEEM = "0xF9a180b5182c816a166F218970181971E1A7de45";//Redeem.methods.address;
const TTOKEN_ = "0xe1416eac451f41420a1d4575bb33bce3a1b3e941";
const user1 = "0x922b5be55dfc704904c5ba8880cc19904108e94d";

const admin1 = "0xead336e2D75E30fBa5CaDb93c5D667EfB5a3B546";

///step1 test verify     修改admin账户
const admin2 = "0xb1ddf7186B013388766e05d4F724B8cE8c1d5536";
// Redeem.methods. =  Redeem.new(TBAL);
const admin3 = "0xbfc2A5C1ff1f1f92B623Ff538740FaA3dA674cAe";
const admin4 = "0x9842495d6bAB5Cb632777Ff25B5b4c1e1d595f24";
// tbal.

const epochblocks = 40320 + 10;

let contract = require("../json/SwapXToken.json");

let rcontract = require("../json/MerkleRedeem.json");

let tabi = contract.abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let TToken = new web3.eth.Contract(tabi, TTOKEN_);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
// console.log(TToken.methods)


let abi = rcontract.abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let Redeem = new web3.eth.Contract(abi, REDEEM);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
// console.log(Redeem.methods)

const token1 = "0x431D57Fa1dAe7cf0bB64D8aAA94f371962434e59";

let token2 = "0x0cEeD9D6CFD5558f0dA79FA21644E4c7Ff106c8F";
let token = TTOKEN_;

async function getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber) {
    const BLOCKS = 10000;
    if (endBlockNumber == null) {
        endBlockNumber = await web3.eth.getBlockNumber();
        console.log("Using endBlockNumber: " + endBlockNumber);
    }
    if (startBlockNumber == null) {
        startBlockNumber = endBlockNumber - BLOCKS;
        console.log("Using startBlockNumber: " + startBlockNumber);
    }
    console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks " + startBlockNumber + " and " + endBlockNumber);

    for (var i = startBlockNumber; i <= endBlockNumber; i++) {
        if (i % 1000 == 0) {
            console.log("Searching block " + i);
        }
        var block = await web3.eth.getBlock(i, true);
        if (block != null && block.transactions != null) {
            block.transactions.forEach(function (e) {
                if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
                    console.log("  tx hash          : " + e.hash + "\n"
                        + "   nonce           : " + e.nonce + "\n"
                        + "   blockHash       : " + e.blockHash + "\n"
                        + "   blockNumber     : " + e.blockNumber + "\n"
                        + "   transactionIndex: " + e.transactionIndex + "\n"
                        + "   from            : " + e.from + "\n"
                        + "   to              : " + e.to + "\n"
                        + "   value           : " + e.value + "\n"
                        + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
                        + "   gasPrice        : " + e.gasPrice + "\n"
                        + "   gas             : " + e.gas + "\n"
                        + "   input           : " + e.input);
                }
            })
        }
    }
}



(async function () {
    await getTransactionsByAccount(token);
    //     ////step 3    

    //   await web3.eth.personal.unlockAccount(admin3, password);
    // // reth = new web3.eth.Contract(contract.abi)
    // //     .deploy({ data: contract.evm.bytecode.object, arguments: {} })
    // //     .send({ from: admin3, gas: '8000000' }, function (error, transactionHash) { })
    // //     .on('error', function (error) { })
    // //     .on('transactionHash', function (transactionHash) { })
    // //     .on('receipt', function (receipt) {
    // // token = receipt.contractAddress;
    // //         console.log(receipt.contractAddress) // contains the new contract address
    // //     })
    // //     .on('confirmation', function (confirmationNumber, receipt) { })
    // //     .then(function (newContractInstance) {
    // //         console.log(newContractInstance.options.address) // instance with the new contract address
    // //     });


    // // reth = new web3.eth.Contract(rcontract.abi)
    // //     .deploy({ data: rcontract.bytecode, arguments: {} })
    // //     .send({ from: admin3, gas: '8000000' }, function (error, transactionHash) { })
    // //     .on('error', function (error) { })
    // //     .on('transactionHash', function (transactionHash) { })
    // //     .on('receipt', function (receipt) {
    // // token2 = receipt.contractAddress;
    // //         console.log("==========merkle")
    // //         console.log(receipt.contractAddress) // contains the new contract address
    // //     })
    // //     .on('confirmation', function (confirmationNumber, receipt) { })
    // //     .then(function (newContractInstance) {
    // //         console.log(newContractInstance.options.address) // instance with the new contract address
    // //     });

    // //  let amt = await TToken.methods.owner().call({ from: admin3 });
    // //     console.log(amt);

    //     // ////step3   添加
    //     // await TToken.methods.addIssuer(REDEEM).send({ from: admin3 });

    //     // await TToken.methods.initialize("ABC","ABC",web3.utils.toWei("576000")).send({ from: admin3 });

    //     // await Redeem.methods.issue(token, web3.utils.toWei("145000")).send({ from: admin3 });

    //     // let amt1 = await TToken.methods.totalSupply().call({ from: admin3 });
    //     // console.log(amt1);

    //     // let amt = await TToken.methods.balanceOf(REDEEM).call({ from: admin3 });
    //     // console.log(amt);
    // //    await web3.eth.personal.unlockAccount(admin4, password);
    // //     // /////step4 认证 
    // //     await Redeem.methods.verify(token).send({ from: admin4 });

    // //     // ///step5  验证 为true
    // //     let result1 = await Redeem.methods.verified(token).call({ from: admin4 });
    // //     console.log(result1);
    // //     // console.log(Redeem);
    // // // let ss=[];
    // //     result1 = await Redeem.methods.verifiedTokens().call({ from: admin4 });
    // //     console.log(result1);


})();



const Web3 = require('web3');

// // // Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("https://http-testnet2.hoosmartchain.com"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

async function getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber) {
    const BLOCKS = 10000;
    if (endBlockNumber == null) {
        endBlockNumber = await web3.eth.getBlockNumber() - BLOCKS*8;
        console.log("Using endBlockNumber: " + endBlockNumber);
    }
    if (startBlockNumber == null) {
        startBlockNumber = endBlockNumber - BLOCKS*9;
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


// 1840205   28800  139182
//1701023
// main 1461801
//0x649F3ace838d52B47fFE9fB1014F8489b1665481  
(async function () {
let token ="0x649F3ace838d52B47fFE9fB1014F8489b1665481"
let begin = 1461801+139182-28800*5;
let end =begin+28800*5;
    await getTransactionsByAccount(token,begin,end);
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


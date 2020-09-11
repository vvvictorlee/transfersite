var Tx = require('ethereumjs-tx').Transaction;



const sendSignedTx = async (para, data) => {

    try {
        var web3 = para.web3;

        let nonce = await web3.eth.getTransactionCount(para.admin, "pending");
        let gasPrice = await para.web3.eth.getGasPrice();
        gasPrice = gasPrice*3
        // let block = await web3.eth.getBlock("latest");
        // let gasLimit = block.gasLimit - 1000

        await sendSignedTransaction(web3, para.admin, para.contractAddress, para.admin_secrets, data, nonce, gasPrice);

    } catch (error) {
        console.error(error);
    }
}

const cancelTransaction = async (web3, fromAddr, toAddr, privateKey, data, nonce) => {
    await sendSignedTransaction(web3, fromAddr, toAddr, privateKey, data, nonce, 700000000000, 0)
}

const sendSignedTransaction = async (web3, fromAddr, toAddr, privateKey, data, nonce, gasPrice, gasLimit=-1) => {
    let chainID = await web3.eth.getChainId();
    try {
        var rawTx = {
            nonce: web3.utils.toHex(nonce),
            gasPrice: gasPrice,
            // gasLimit: gasLimit,
            from: fromAddr,
            to: toAddr,
            value: '0x00',
            data: data,
            chainId: chainID
        }

        // 判断是否计算gas
        if (gasLimit<0) {
            gasLimit = await web3.eth.estimateGas(rawTx);
            // try {
            //     gasLimit = await web3.eth.estimateGas(rawTx);
            // }
            // catch (error) {
            //     console.warn(error.message);
            //     gasLimit = 6000000
            // }
        }
        rawTx.gasLimit = gasLimit;

        console.log(">>> toAddr =", toAddr, "nonce =",nonce,", gasLimit =", gasLimit,", gasPrice =", gasPrice/1000000000);

        var tx = new Tx(rawTx, { chain:chainID, hardfork: 'petersburg'});
        tx.sign(Buffer.from(privateKey, 'hex'));
        var serializedTx = tx.serialize();

        let txn = web3.utils.sha3(serializedTx);
        console.log(">>> txn =", txn);

        let receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
        console.log(">>>", receipt);

    } catch (error) {
        console.error('sendSignedTransaction :', error.message);
    }
}


module.exports = { sendSignedTx };

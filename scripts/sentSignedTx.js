var Web3 = require("web3");
var Tx = require('ethereumjs-tx').Transaction;

var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(global.HTTP_PROVIDER));


const sentSignedTx = async (para, data) => {

    try {

        let nonce = await para.web3.eth.getTransactionCount(para.admin, "pending");
        console.log(nonce);

        var privateKey = Buffer.from(para.admin_secrets, 'hex');
        const gasprice = await para.web3.eth.getGasPrice();
        var rawTx = {
            nonce: web3.utils.toHex(nonce),
            gasPrice: web3.utils.toHex(gasprice),
            gasLimit: web3.utils.toHex(para.gasLimit),
            from: para.admin,
            to: para.contractaddress,
            value: '0x00',
            data: data,
            chainId: 3
        }

        // let gas = await para.contract.methods.verify(token).estimateGas();
        // rawTx.gas = gas*1.2;
        var tx = new Tx(rawTx, { 'chain': 'ropsten', hardfork: 'istanbul' });
        tx.sign(privateKey);

        var serializedTx = tx.serialize();

        let receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
        console.log(receipt);

    } catch (error) {
        console.log(error);
    }


}


module.exports = { sentSignedTx };

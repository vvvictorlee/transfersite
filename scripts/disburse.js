// Usage example:
// npm run disburse -- /Users/lisheng/Downloads/defi/balancer/erc20-redeemable-master/merkle/test/sampleAllocations 10622281

const { MerkleTree } = require("../lib/merkleTree");
const { loadTrees } = require("./loadTrees");
const fs = require("fs");
const { sentSignedTx } = require("./sentSignedTx");


const finishEpoch = async (para, path, epochNum, blockNum) => {

    const block = await para.web3.eth.getBlock(blockNum);
    console.log("Block:\t", blockNum, block.hash, block.timestamp);


    console.log("\n\n// TO FINISH THIS EPOCH");
    console.log("let redeem\nMerkleRedeem.deployed().then(i => redeem = i);");
    console.log("let epochNum = " + epochNum + " // adjust accordingly");
    console.log(
        "await redeem.finishEpoch(" + epochNum + ", " +
        block.timestamp +
        ', "' +
        block.hash +
        '")'
    );
    try {
        //ropsten
        if (3 == para.chain_id) {
            const abi = await para.contract.methods.finishEpoch(epochNum,
                block.timestamp,
                block.hash
            ).encodeABI();
           await  sentSignedTx(para, abi);
        }
        else {
            await para.web3.eth.personal.unlockAccount(para.admin, para.password);

            await para.contract.methods.finishEpoch(epochNum,
                block.timestamp,
                block.hash
            ).send({ from: para.admin });
        }
    }
    catch (error) {
        console.log(error);
    }

}


const seedAllocations = async (para, path, epochNum, blockNum) => {

    const merkleTree = await loadTrees(para, path);

    const block = await para.web3.eth.getBlock(blockNum);
    console.log("Block:\t", blockNum, block.hash, block.timestamp);

    const root = merkleTree.getHexRoot();
    console.log("Tree:\t", root);

    console.log("\n\n// TO FINISH THIS EPOCH");
    console.log("let redeem\nMerkleRedeem.deployed().then(i => redeem = i);");
    console.log("let epochNum = " + epochNum + " // adjust accordingly");
    try {
        //ropsten
        if (3 == para.chain_id) {
            const abi = await para.contract.methods.seedAllocations(
                epochNum,
                root
            ).encodeABI();
            sentSignedTx(para, abi);
        }
        else {
            await para.web3.eth.personal.unlockAccount(para.admin, para.password);

            console.log('await redeem.seedAllocations(' + epochNum + ', "' + root + '")');

            await para.contract.methods.seedAllocations(
                epochNum,
                root
            ).send({ from: para.admin });
        }
    }
    catch (error) {
        console.log(error);
    }

}


module.exports = { disburse, finishEpoch, seedAllocations };

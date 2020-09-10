// Usage example:
// npm run disburse -- /Users/lisheng/Downloads/defi/balancer/erc20-redeemable-master/merkle/test/sampleAllocations 10622281

// const { MerkleTree } = require("../lib/merkleTree");
// const fs = require("fs");
const { loadTrees } = require("./loadTrees");
const { sentSignedTx } = require("./sentSignedTx");

const finishEpoch = async (para, epochNum, blockNum) => {

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
    if (!para.is_execute) return ;

    try {
        //ropsten
        if (3 == para.chain_id) {
            const abi = await para.contract.methods.finishEpoch(epochNum,
                block.timestamp,
                block.hash
            ).encodeABI();
            await sentSignedTx(para, abi);
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
        console.error(error);
    }

}


const disburse = async (para, path, epochNum, blockNum) => {
    if (0 == para.step) {
        await finishEpoch(para, epochNum, blockNum);
        return;
    }

    const merkleTree = await loadTrees(para, path);
    if (null == merkleTree) {
        console.log("merkleTree is null:");
        return;
    }
    const block = await para.web3.eth.getBlock(blockNum);
    console.log("Block:\t", blockNum, block.hash, block.timestamp);

    const root = merkleTree.getHexRoot();
    console.log("Tree:\t", root);

    console.log("\n\n// TO FINISH THIS EPOCH");
    console.log("let redeem\nMerkleRedeem.deployed().then(i => redeem = i);");
    console.log("let epochNum = " + epochNum + " // adjust accordingly");

    if (!para.is_execute) return ;

    try {
        //ropsten
        if (para.chain_id < 99) {
            const abi = await para.contract.methods.seedAllocations(
                epochNum,
                root
            ).encodeABI();
           await sentSignedTx(para, abi);
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
        console.error(error);
    }
}


module.exports = { disburse };

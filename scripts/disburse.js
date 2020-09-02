// Usage example:
// npm run disburse -- /Users/lisheng/Downloads/defi/balancer/erc20-redeemable-master/merkle/test/sampleAllocations 10622281

const { MerkleTree } = require("../lib/merkleTree");
const { loadTrees } = require("./loadTrees");
const fs = require("fs");

module.exports = async function (callback) {
    console.log("File Path Arg (must be absolute):", process.argv[4]);

    const merkleTree = loadTrees(utils, process.argv[4]);
    const blockNum = process.argv[5];

    const block = await web3.eth.getBlock(blockNum);
    console.log("Block:\t", blockNum, block.hash, block.timestamp);

    const root = merkleTree.getHexRoot();
    console.log("Tree:\t", root);

    console.log("\n\n// TO FINISH THIS WEEK");
    console.log("let redeem\nMerkleRedeem.deployed().then(i => redeem = i);");
    console.log("let weekNum = 1 // adjust accordingly");
    console.log(
        "await redeem.finishWeek(weekNum, " +
        block.timestamp +
        ', "' +
        block.hash +
        '")'
    );
    console.log('await redeem.seedAllocations(weekNum, "' + root + '")');
};


const disburse = async (para, path, epochNum, blockNum) => {

    const merkleTree = await loadTrees(para, path);

    const block = await para.web3.eth.getBlock(blockNum);
    console.log("Block:\t", blockNum, block.hash, block.timestamp);

    const root = merkleTree.getHexRoot();
    console.log("Tree:\t", root);

    console.log("\n\n// TO FINISH THIS WEEK");
    console.log("let redeem\nMerkleRedeem.deployed().then(i => redeem = i);");
    console.log("let epochNum = " + epochNum + " // adjust accordingly");
    console.log(
        "await redeem.finishEpoch(" + epochNum + ", " +
        block.timestamp +
        ', "' +
        block.hash +
        '")'
    );

    await para.web3.eth.personal.unlockAccount(para.admin, para.password);

    await para.contract.methods.finishEpoch(epochNum,
        block.timestamp,
        block.hash
    ).send({ from: para.admin });

    console.log('await redeem.seedAllocations(' + epochNum + ', "' + root + '")');

    await para.contract.methods.seedAllocations(
        epochNum,
        root
    ).send({ from: para.admin });

}


const finishEpoch = async (para, path, epochNum, blockNum) => {

    const block = await para.web3.eth.getBlock(blockNum);
    console.log("Block:\t", blockNum, block.hash, block.timestamp);


    console.log("\n\n// TO FINISH THIS WEEK");
    console.log("let redeem\nMerkleRedeem.deployed().then(i => redeem = i);");
    console.log("let epochNum = " + epochNum + " // adjust accordingly");
    console.log(
        "await redeem.finishEpoch(" + epochNum + ", " +
        block.timestamp +
        ', "' +
        block.hash +
        '")'
    );

    await para.web3.eth.personal.unlockAccount(para.admin, para.password);

    await para.contract.methods.finishEpoch(epochNum,
        block.timestamp,
        block.hash
    ).send({ from: para.admin });

}


const seedAllocations = async (para, path, epochNum, blockNum) => {

    const merkleTree = await loadTrees(para, path);

    const block = await para.web3.eth.getBlock(blockNum);
    console.log("Block:\t", blockNum, block.hash, block.timestamp);

    const root = merkleTree.getHexRoot();
    console.log("Tree:\t", root);

    console.log("\n\n// TO FINISH THIS WEEK");
    console.log("let redeem\nMerkleRedeem.deployed().then(i => redeem = i);");
    console.log("let epochNum = " + epochNum + " // adjust accordingly");

    await para.web3.eth.personal.unlockAccount(para.admin, para.password);

    console.log('await redeem.seedAllocations(' + epochNum + ', "' + root + '")');

    await para.contract.methods.seedAllocations(
        epochNum,
        root
    ).send({ from: para.admin });

}


module.exports = { disburse ,finishEpoch,seedAllocations};

// Usage example:
// npm run disburse -- /Users/lisheng/Downloads/defi/balancer/erc20-redeemable-master/merkle/test/sampleAllocations 10622281

const { MerkleTree } = require("../lib/merkleTree");
const { loadTrees } = require("./loadTrees");
const fs = require("fs");

module.exports = async function(callback) {
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


const disburse = async (utils,admin,contract,path,epochNum, blockNum) => {

  const merkleTree = loadTrees(utils, path);
  const blockNum = process.argv[5];

  const block = await web3.eth.getBlock(blockNum);
  console.log("Block:\t", blockNum, block.hash, block.timestamp);

  const root = merkleTree.getHexRoot();
  console.log("Tree:\t", root);

  console.log("\n\n// TO FINISH THIS WEEK");
  console.log("let redeem\nMerkleRedeem.deployed().then(i => redeem = i);");
  console.log("let epochNum = 1 // adjust accordingly");
  console.log(
    "await redeem.finishEpoch(epochNum, " +
      block.timestamp +
      ', "' +
      block.hash +
      '")'
  );
  console.log('await redeem.seedAllocations(weekNum, "' + root + '")');

    await contract.methods.finishEpoch(
        block.timestamp,
        block.hash
    ).send({ from: admin });


    await contract.methods.seedAllocations(
        epochNum,
        root
    ).send({ from: admin });

}


module.exports = { disburse };

// Usage example:
// npm run loadtrees -- /Users/lisheng/Downloads/defi/balancer/erc20-redeemable-master/merkle/test/sampleAllocations 10622281

const { MerkleTree } = require("../lib/merkleTree");
const fs = require("fs");
const { getJsonFileList } = require("./getJsonFileList.js")
const { loadTreem } = require("./loadTreem");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}


const loadTrees = async (utils, admin, contract, filePath) => {
    const jsonFiles = getJsonFileList(filePath);

    let elements = [];
    let balance;
    let nextElements;

    await asyncForEach(jsonFiles,async fileName => {
            nextElements = await loadTreem(utils, admin, contract, fileName);
            elements.concat(nextElements);
    });

    console.log(elements);

    return new MerkleTree(elements);

};

module.exports = { loadTrees };

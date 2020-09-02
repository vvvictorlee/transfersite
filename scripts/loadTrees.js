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


const loadTrees = async (para, filePath) => {
    const jsonFiles = getJsonFileList(filePath);

    let elements = [];
    let balance;
    let nextElements;

    for( const fileName of jsonFiles){
            nextElements = await loadTreem(para, fileName);
            console.log("====*(*****)==="+nextElements);
            elements = elements.concat(nextElements);
            console.log("======="+elements+"*********");
    }

    console.log("===loadtrees  elements====="+elements);

    return new MerkleTree(elements);

};

module.exports = { loadTrees };

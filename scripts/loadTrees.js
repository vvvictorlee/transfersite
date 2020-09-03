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
    let nextElements;
    let origelements = [];
    for (const fileName of jsonFiles) {
        arr = await loadTreem(para, fileName);
        nextElements = arr[0];
        console.log("====*(*****)===" + arr[0]);
        elements = elements.concat(arr[0]);
        origelements = origelements.concat(arr[1]);
        console.log("=======" + elements + "*********");
    }

    console.log("===loadtrees  elements=====" + elements);
    const merkleTree = new MerkleTree(elements);
    const proof = merkleTree.getHexProof(elements[0]);
    const proof1 = merkleTree.getHexProof(elements[1]);
    console.log("proof===", proof);
    console.log("proof1===", proof1);
    let result = await para.contract.methods.verifyClaim(origelements[0][0], 2, origelements[0][1], origelements[0][2], proof).call({ from: para.admin });
    console.log(result);
    const address = origelements[0][0];
    const cycle = 2;
    const token = origelements[0][1];
    const balance = origelements[0][2];
    await para.web3.eth.personal.unlockAccount(para.admin, para.password);
    let erc20 = new para.web3.eth.Contract(para.erc20_abi, token);
    result = await erc20.methods.balanceOf(origelements[0][0]).call({ from: origelements[0][0] });
    console.log(result);
    let list = [];
    list.push([cycle, token, balance, proof]);
    console.log(address, "----==claimEpochs begin======list=== ", list);
    await para.contract.methods.claimEpoch(
        address,
        cycle, token, balance, proof
    ).send({ from: para.admin });
    // await para.contract.methods.claimEpochs(
    //     address,
    //     list
    // ).send({ from: para.admin });
    console.log("----==claimEpochs end======list ");
    // await para.web3.eth.personal.unlockAccount(origelements[0][0], para.password);
    result = await erc20.methods.balanceOf(origelements[0][0]).call({ from: origelements[0][0] });
    console.log(result);


    return merkleTree;//new MerkleTree(elements);

};

module.exports = { loadTrees };

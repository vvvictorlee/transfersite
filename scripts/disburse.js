const { loadTrees } = require("./loadTrees");
const { sendSignedTx } = require("./sendSignedTx");

const finishEpoch = async (para, epochNum, blockNum) => {

    const block = await para.web3.eth.getBlock(blockNum);
    console.log("Block:\t", blockNum, block.hash, block.timestamp);

    console.log("\n// FINISH THE EPOCH : ", epochNum);
    console.log(
        "await redeem.finishEpoch(" + epochNum + ", " +
        block.timestamp +
        ', "' +
        block.hash +
        '")'
    );

    if (!para.is_execute) return ;

    try {
        if (para.chain_id < 99) {
            const abi = await para.contract.methods.finishEpoch(epochNum,
                block.timestamp,
                block.hash
            ).encodeABI();
            await sendSignedTx(para, abi);
        }
        else {
            // private
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
    // ---- STEP 0 ----
    if (0 == para.step) {
        await finishEpoch(para, epochNum, blockNum);
        return;
    }

    // ---- STEP 1 ----

    const merkleTree = await loadTrees(para, path);
    if (null == merkleTree) {
        console.log("merkleTree is null:");
        return;
    }
    // const block = await para.web3.eth.getBlock(blockNum);
    // console.log("Block:\t", blockNum, block.hash, block.timestamp);

    const root = merkleTree.getHexRoot();
    console.log("\nTree:\t", root);

    console.log("\n---- FINISH THIS EPOCH :", epochNum);

    if (!para.is_execute) return ;

    try {
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
        console.error(error.message);
    }
}


module.exports = { disburse };

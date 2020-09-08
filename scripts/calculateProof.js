// Usage example:
// npm run calculateProof -- /Users/lisheng/Downloads/defi/balancer/erc20-redeemable-master/merkle/test/sampleAllocations  0x77c845E6A61F37cB7B237de90a74fbc3679FcF06  0x77c845E6A61F37cB7B237de90a74fbc3679FcF06

const { MerkleTree } = require("../lib/merkleTree");
const fs = require("fs");
const { loadTrees } = require("./loadTrees");
const { sentSignedTx } = require("./sentSignedTx");
const sleep = require('sleep');

const claimProof = async (para, address, balances) => {
    console.log("===claimProof==" + balances);
    para.is_issue = 0;

    let claim_list = [];
    for (const cycle of Object.keys(balances)) {
        const merkleTree = await loadTrees(para, para.path + cycle);
        if (null == merkleTree) {
            console.log("merkleTree is null:");
            return "";
        }
        const root = merkleTree.getHexRoot();
        console.log("Tree:\t", root);

        for (const tb of balances[cycle]) {
            const token = tb.token;
            console.log("token===" + token);
            const balance = tb.balance;
            console.log("====(address, token, balance)==", address, "====", token, "====", balance, "=== end====");
            let leaf = para.web3.utils.soliditySha3(address, token, balance);
            const proof = merkleTree.getHexProof(leaf);
            console.log("proof===", proof);
            claim_list.push([cycle, token, balance, proof]);
        }

    }

    console.log(claim_list);
    if (0 != para.claim_exec_by_admin) {
        try {
            if (3 == para.chain_id) {
                // const abi = await para.contract.methods.claimEpochs(
                //     address,
                //     list
                // ).encodeABI();
                for (const ctbp of claim_list) {
                    const [cycle, token, balance, proof] = ctbp;
                    let result = await para.contract.methods.verifyClaim(address, cycle, token, balance, proof).call({ from: para.admin });
                    console.log(result, "ctbp===", ctbp);
                    const abi = await para.contract.methods.claimEpoch(
                        address,
                        cycle, token, balance, proof
                    ).encodeABI();//send({ from: para.admin });
                    await sentSignedTx(para, abi);
                    sleep.msleep(para.symbol_interval);
                }
            }
            else {
                await para.web3.eth.personal.unlockAccount(para.admin, para.password);

                await para.contract.methods.claimEpochs(
                    address,
                    list
                ).send({ from: para.admin });
            }
        } catch (error) {
            console.log(error);
        }
    }

    // let result = await para.contract.methods.verifyClaim(address, 2, token.token, balance, proof).call({ from: para.admin });
    // console.log(result);
    // let result1 = await para.contract.methods.merkleRoots(1, 3).call({ from: para.admin });
    // console.log(result1);


    const abi = await para.contract.methods.claimEpochs(
        address,
        claim_list
    ).encodeABI();

    console.log("===claimProof end==");

    return abi;
    // myContract.methods.myMethod([param1[, param2[, ...]]]).encodeABI()

}


module.exports = { claimProof };

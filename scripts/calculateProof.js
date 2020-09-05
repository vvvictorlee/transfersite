// Usage example:
// npm run calculateProof -- /Users/lisheng/Downloads/defi/balancer/erc20-redeemable-master/merkle/test/sampleAllocations  0x77c845E6A61F37cB7B237de90a74fbc3679FcF06  0x77c845E6A61F37cB7B237de90a74fbc3679FcF06

const { MerkleTree } = require("../lib/merkleTree");
const fs = require("fs");
const { loadTrees } = require("./loadTrees");
const { sentSignedTx } = require("./sentSignedTx");

module.exports = function (callback) {
    console.log("File Path Arg (must be absolute):", process.argv[4]);

    const merkleTree = loadTrees(utils, process.argv[4]);
    const root = merkleTree.getHexRoot();

    const rawdata = fs.readFileSync(process.argv[4]);
    const balances = JSON.parse(rawdata);
    const address = process.argv[5];
    const token = process.argv[6];

    const claimBalance = balances[address];
    console.log("Tree:\t", root);
    console.log("Account:\t", address);
    console.log("Balance:\t", claimBalance);
    const proof = merkleTree.getHexProof(
        utils.soliditySha3(address, token, utils.toWei(claimBalance))
    );
    console.log("Proof:\t", proof);

    console.log("\n\n// TO CLAIM THIS WEEK");
    console.log("let redeem\nMerkleRedeem.deployed().then(i => redeem = i);");
    console.log("\nlet weekNum = 1 // adjust accordingly");
    console.log("\nlet proof = " + JSON.stringify(proof));
    console.log('\nlet claimBalance = web3.utils.toWei("' + claimBalance + '")');

    console.log(
        '\nawait redeem.verifyClaim("' +
        address +
        '", weekNum, token,claimBalance, proof)'
    );
    console.log(
        '\nawait redeem.claimWeek("' + address + '", weekNum, token,claimBalance, proof)'
    );
};

const claimProof = async (para, address, balances) => {
    console.log("===claimProof==" + balances);

    let list = [];
    for (const cycle of Object.keys(balances)) {
        const merkleTree = await loadTrees(para, para.path + cycle);

        for (const tb of balances[cycle]) {
            const token = tb.token;
            console.log("token===" + token);
            const balance = tb.balance;
            console.log("====888==", address, "====", token, "====", balance, "===888 end====");
            let leaf = para.web3.utils.soliditySha3(address, token, balance);
            const proof = merkleTree.getHexProof(leaf);
            console.log("proof===", proof);
            list.push([cycle, token, balance, proof]);
        }

    }

    console.log(list);
    try {
        if (3 === para.chain_id) {
            const abi = await para.contract.methods.claimEpochs(
                address,
                list
            ).encodeABI();
            sentSignedTx(para, abi);
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

    // let result = await para.contract.methods.verifyClaim(address, 2, token.token, balance, proof).call({ from: para.admin });
    // console.log(result);
    // let result1 = await para.contract.methods.merkleRoots(1, 3).call({ from: para.admin });
    // console.log(result1);


    console.log("===claimProof end==");
    const abi = await para.contract.methods.claimEpochs(
        address,
        list
    ).encodeABI();
    return abi;
    // myContract.methods.myMethod([param1[, param2[, ...]]]).encodeABI()

}


module.exports = { claimProof };

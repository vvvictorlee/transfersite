
const Web3 = require('web3');
const fs = require('fs');
const readJSON = (fileName) => JSON.parse(fs.readFileSync(fileName));
const parseLog = require('eth-log-parser');

let admin = "0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e";
const admin1 = "0x598FeaB9ff6A090a7fAA9dF0F3B4df3F0c8D35FC";
const admin2 = "0xC49926C4124cEe1cbA0Ea94Ea31a6c12318df947";
admin = admin1;
const secrets = readJSON('._');


// const BN = require('BigNumber.js');
const web3 = new Web3(new Web3.providers.HttpProvider('http://35.73.127.28:8645'));
// // wei是以太坊上的的最小单位，ether小数点后18位为一个wei


async function setAddress() {
    console.log("process.argv==", process.argv);
    console.log("====setAddress=====");
    // console.log(helperRedeem.methods);
    await helperRedeem.methods.setRedeemAddress(REDEEM).send({ from: admin });
}

async function usageFunc() {
    console.log("process.argv==", process.argv);
    let epochBlock = (await web3.eth.getBlock("latest"));
    console.log(epochBlock.number, epochBlock.timestamp);

}



let contracts = {}
const instanceContract = async (contractAddress, abijson) => {
    let abi = require(abijson).abi;
    let contract = new web3.eth.Contract(abi, contractAddress);
    if (undefined == contract) {
        console.error("instanceContract failed", contractAddress);
        return;
    }

    return contract;
}
const abis = readJSON("./abis.json")

function instanceContracts() {
    for (let k of Object.keys(abis)) {
        let obj = await instanceContract(k, abis[k]);
        contracts[k] = obj;
    }
}


instanceContracts();

let result;
const contract_addresses = Object.keys(abis);
const createProposal = async (sender, address, detail) => {
    const index = 2;
    let gas = 0;
    gas = await contracts[index].methods.createProposal(address, detail).estimateGas({ from: sender });
    let encodedabi = await contracts[index].methods.createProposal(address, detail).encodeABI();
    let id = await sendSignedTx(gas, sender, secrets[sender], encodedabi, contract_addresses[index], true);
    return id;
};

const voteProposal = async (sender, address, flag) => {
    const index = 2;
    let gas = 0;
    gas = await contracts[index].methods.voteProposal(address, flag).estimateGas({ from: sender });
    let encodedabi = await contracts[index].methods.voteProposal(address, flag).encodeABI();
    let id = await sendSignedTx(gas, sender, secrets[sender], encodedabi, contract_addresses[index], true);
    return id;
};

const stake = async (sender, address) => {
    const index = 0;
    let gas = 0;
    gas = await contracts[index].methods.stake(address).estimateGas({ from: sender });
    let encodedabi = await contracts[index].methods.stake(address).encodeABI();
    let id = await sendSignedTx(gas, sender, secrets[sender], encodedabi, contract_addresses[index], true);
    return id;
};
const createOrEditValidator = async (sender, feeAddr, moniker, identity, website, email, details) => {
    const index = 0;
    let gas = 0;
    gas = await contracts[index].methods.createOrEditValidator(feeAddr, moniker, identity, website, email, details).estimateGas({ from: sender });
    let encodedabi = await contracts[index].methods.createOrEditValidator(feeAddr, moniker, identity, website, email, details).encodeABI();
    let id = await sendSignedTx(gas, sender, secrets[sender], encodedabi, contract_addresses[index], true);
    return id;
};
const unstake = async (sender, address) => {
    const index = 0;
    let gas = 0;
    gas = await contracts[index].methods.unstake(address).estimateGas({ from: sender });
    let encodedabi = await contracts[index].methods.unstake(address).encodeABI();
    let id = await sendSignedTx(gas, sender, secrets[sender], encodedabi, contract_addresses[index], true);
    return id;
};


const votes = async (sender, address, flag) => {
    const index = 2;
    let result = 0;
    result = await contracts[index].methods.votes(address, flag).call({ from: sender });

    return result;
};
const pass = async (sender, address, flag) => {
    const index = 2;
    let result = 0;
    result = await contracts[index].methods.pass(address, flag).call({ from: sender });

    return result;
};

const staked = async (sender, address) => {
    const index = 0;
    let result = 0;
    result = await contracts[index].methods.staked(address, address).call({ from: sender });

    return result;
};
const currentValidatorSet = async (sender, count) => {
    const index = 0;
    let result = 0;

    for (let i = 0; i < count; i++) {
        result = await contracts[index].methods.currentValidatorSet(i).call({ from: sender });
        console.log("==", result);
        // result = await contracts[index].methods.highestValidatorsSet(i).call({ from: admin });
        // console.log(result);
    }

    return result;
};

const totalStake = async (sender,) => {
    const index = 0;
    let result = 0;

    result = await contracts[index].methods.totalStake().call({ from: sender });
    console.log(result);
    result = await contracts[index].methods.totalJailedHB().call({ from: sender });
    console.log(result);

    return result;
};
const punishValidators = async (sender, address) => {
    const index = 1;
    let result = 0;
    result = await contracts[index].methods.punishValidators().call({ from: sender });

    return result;
};
(async function () {

})();


let handlers = {
    "createProposal": (async function () {
        await createProposal();
    }),
    "voteProposal": (async function () {
        await voteProposal();
    }),
    "stake": (async function () {
        await stake();
    }),
    "createOrEditValidator": (async function () {
        await createOrEditValidator();
    }),
    "unstake": (async function () {
        await unstake();
    }),
    "votes": (async function () {
        await votes();
    }),
    "pass": (async function () {
        await pass();
    }),
    "staked": (async function () {
        await staked();
    }),
    "currentValidatorSet": (async function () {
        await currentValidatorSet();
    }),
    "totalStake": (async function () {
        await totalStake();
    }),
    "punishValidators": (async function () {
        await punishValidators();
    }),
    "default": (async function () {
        await usageFunc();
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();


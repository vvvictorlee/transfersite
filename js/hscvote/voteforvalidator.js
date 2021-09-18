const debug = require("debug");
const ValidatorLog = debug('Validator');
// debug.enable("*");
debug.enable("Validator");

const Web3 = require('web3');
const fs = require('fs');
const path = require('path')

const readJSON = (fileName) => JSON.parse(fs.readFileSync(path.join(__dirname, fileName)));

const { sendSignedTx } = require("./tx.js");

const secrets = readJSON('./._');
const accounts = Object.keys(secrets);

let sender = accounts[0];

const PROVIDER_URL = process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));// // wei是以太坊上的的最小单位，ether小数点后18位为一个wei

async function usageFunc() {
    ValidatorLog("process.argv==", process.argv);
    let epochBlock = (await web3.eth.getBlock("latest"));
    ValidatorLog(epochBlock.number, epochBlock.timestamp);

}

let contract_instances = {}
let contracts = Object.values(contract_instances);
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

const instanceContracts = async () => {
    for (let k of Object.keys(abis)) {
        let obj = await instanceContract(k, "./abis/" + abis[k]);
        contract_instances[k] = obj;
    }
    contracts = Object.values(contract_instances);

};



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


const votes = async (sender, address, id) => {
    const index = 2;
    let result = 0;
    result = await contracts[index].methods.proposals(id).call({ from: sender });
    ValidatorLog(address, "==", result);
    result = await contracts[index].methods.votes(address, id).call({ from: sender });
    ValidatorLog(address, "==", result);

    return result;
};
const pass = async (sender, address) => {
    const index = 2;
    let result = 0;
    result = await contracts[index].methods.pass(address).call({ from: sender });
    ValidatorLog(address, "==", result);
    return result;
};

const staked = async (sender, address) => {
    const index = 0;
    let result = 0;
    result = await contracts[index].methods.getStakingInfo(address).call({ from: sender });
    ValidatorLog(address, "==", result);
    return result;
};
const getActiveValidators = async (sender) => {
    const index = 0;
    let result = 0;
    result = await contracts[index].methods.getTopValidators().call({ from: sender });
    ValidatorLog("getTopValidators==", result);
    result = await contracts[index].methods.getTotalStakeOfActiveValidators().call({ from: sender });
    ValidatorLog("getTotalStakeOfActiveValidators==", result);
    result = await contracts[index].methods.getActiveValidators().call({ from: sender });
    ValidatorLog("getActiveValidators==", result);
    let acc = 0;
    for (let i = 0; i < result.length; i++) {
        acc = result[i]
        result = await contracts[index].methods.getValidatorInfo(acc).call({ from: admin });
        ValidatorLog(acc, "==", result);
        result = await contracts[index].methods.getValidatorDescription(acc).call({ from: admin });
        ValidatorLog(acc, "==", result);
        result = await contracts[index].methods.isActiveValidator(acc).call({ from: admin });
        ValidatorLog(acc, "==", result);
        result = await contracts[index].methods.isTopValidator(acc).call({ from: admin });
        ValidatorLog(acc, "==", result);
    }

    return result;
};

const totalStake = async (sender) => {
    const index = 0;
    let result = 0;

    result = await contracts[index].methods.totalStake().call({ from: sender });
    ValidatorLog(result);
    result = await contracts[index].methods.totalJailedHB().call({ from: sender });
    ValidatorLog(result);

    return result;
};
const punishValidators = async (sender) => {
    const index = 1;
    let result = 0;
    result = await contracts[index].methods.getPunishValidatorsLen().call({ from: sender });

    for (let i = 0; i < result; i++) {
        result = await contracts[index].methods.punishValidators(i).call({ from: sender });
        ValidatorLog("==", result);
        result = await contracts[index].methods.getPunishRecord(result).call({ from: sender });
        ValidatorLog("==", result);
    }


    return result;
};



let handlers = {
    "createProposal": (async function () {
        const feeAddr = accounts[1];
        await createProposal(sender,feeAddr,"");
    }),
    "voteProposal": (async function () {
        const feeAddr = accounts[1];
        await voteProposal(sender,feeAddr,true);
    }),
    "stake": (async function () {
        const feeAddr = accounts[1];
        await stake(sender,feeAddr);
    }),
    "createOrEditValidator": (async function () {
        const feeAddr = accounts[1];
        await createOrEditValidator(sender, feeAddr, "moniker", "identity", "website", "email", "details");
    }),
    "unstake": (async function () {
        const feeAddr = accounts[1];
        await unstake(sender,feeAddr);
    }),
    "votes": (async function () {
        const feeAddr = accounts[1];
        const id = 0;
        await votes(sender, feeAddr, id);
    }),
    "pass": (async function () {
        const feeAddr = accounts[1];
        await pass(sender, feeAddr);
    }),
    "staked": (async function () {
        await staked(sender, accounts[1]);
    }),
    "getActiveValidators": (async function () {
        await getActiveValidators(sender, 3);
    }),
    "totalStake": (async function () {
        await totalStake(sender);
    }),
    "punishValidators": (async function () {
        await punishValidators(sender);
    }),
    "default": (async function () {
        await usageFunc();
    })

};

// ValidatorLog(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];

(async function () {
    await instanceContracts();
    await f();
})();
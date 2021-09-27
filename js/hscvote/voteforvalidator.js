const debug = require("debug");
const ValidatorLog = debug('Validator');
// debug.enable("*");
debug.enable("Validator");
const Web3 = require('web3');
const { sendSignedTx, instanceContracts } = require("./tx.js");
const PROVIDER_URL = process.env.PROVIDER_URL || "https://http-testnet.hoosmartchain.com";
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));// // wei是以太坊上的的最小单位，ether小数点后18位为一个wei

//
// const fs = require('fs');
// const path = require('path')

// const readJSON = (fileName) => JSON.parse(fs.readFileSync(path.join(__dirname, fileName)));


// const secrets = readJSON('./._');
// const accounts = Object.keys(secrets);

let accounts = [];

let contracts = [];

// let contract_instances = {}
// let contracts = Object.values(contract_instances);
// const instanceContract = async (contractAddress, abijson) => {
//     let abi = require(abijson).abi;
//     let contract = new web3.eth.Contract(abi, contractAddress);
//     if (undefined == contract) {
//         console.error("instanceContract failed", contractAddress);
//         return;
//     }

//     return contract;
// }
// const abis = readJSON("./abis.json")

// const instanceContracts = async () => {
//     for (let k of Object.keys(abis)) {
//         let obj = await instanceContract(k, "./abis/" + abis[k]);
//         contract_instances[k] = obj;
//     }
//     contracts = Object.values(contract_instances);

// };

// const contract_addresses = Object.keys(abis);

let contract_addresses = [];
let result;

const createProposal = async (sender, detail) => {
    ValidatorLog(sender, "=createProposal=");

    const index = 2;
    let gas = 0;
    gas = await contracts[index].methods.createProposal(sender, detail).estimateGas({ from: sender });
    let encodedabi = await contracts[index].methods.createProposal(sender, detail).encodeABI();
    let id = await sendSignedTx(gas, secrets[sender], encodedabi, contract_addresses[index], true);
    ValidatorLog(sender, "=createProposal=end");

    return id;
};

const voteProposal = async (Validator, sender, flag) => {
    ValidatorLog(sender, "=voteProposal=");

    const index = 2;
    let gas = 0;
    gas = await contracts[index].methods.voteProposal(sender, flag).estimateGas({ from: sender });
    let encodedabi = await contracts[index].methods.voteProposal(sender, flag).encodeABI();
    let id = await sendSignedTx(gas, secrets[sender], encodedabi, contract_addresses[index], true);
    ValidatorLog(sender, "=voteProposal=end");

    return id;
};

const stake = async (validator, sender) => {
    ValidatorLog(sender, "=stake=");

    const index = 0;
    let gas = 0;
    gas = await contracts[index].methods.stake(validator).estimateGas({ from: sender });
    let encodedabi = await contracts[index].methods.stake(validator).encodeABI();
    let id = await sendSignedTx(gas, secrets[sender], encodedabi, contract_addresses[index], true, 0.1);
    ValidatorLog(sender, "=stake=end");

    return id;
};
const createOrEditValidator = async (feeAddr, moniker, identity, website, email, details) => {
    ValidatorLog(feeAddr, "=createOrEditValidator=");

    const index = 0;
    let gas = 0;
    gas = await contracts[index].methods.createOrEditValidator(feeAddr, moniker, identity, website, email, details).estimateGas({ from: sender });
    let encodedabi = await contracts[index].methods.createOrEditValidator(feeAddr, moniker, identity, website, email, details).encodeABI();
    let id = await sendSignedTx(gas, secrets[sender], encodedabi, contract_addresses[index], true);
    ValidatorLog(feeAddr, "=createOrEditValidator=end");

    return id;
};
const unstake = async (sender) => {
    ValidatorLog(sender, "=unstake=");

    const index = 0;
    let gas = 0;
    gas = await contracts[index].methods.unstake(sender).estimateGas({ from: sender });
    let encodedabi = await contracts[index].methods.unstake(sender).encodeABI();
    let id = await sendSignedTx(gas, secrets[sender], encodedabi, contract_addresses[index], true);
    ValidatorLog(sender, "=unstake=end=");

    return id;
};


const votes = async (sender, id) => {
    const index = 2;
    let result = 0;
    result = await contracts[index].methods.proposals(id).call({ from: sender });
    ValidatorLog(sender, "=proposals=", result);
    result = await contracts[index].methods.votes(sender, id).call({ from: sender });
    ValidatorLog(sender, "=votes=", result);

    return result;
};
const pass = async (sender) => {
    const index = 2;
    let result = 0;
    result = await contracts[index].methods.pass(sender).call({ from: sender });
    ValidatorLog(sender, "=pass=", result);
    return result;
};

const staked = async (sender, validator) => {
    const index = 0;
    let result = 0;
    result = await contracts[index].methods.getStakingInfo(sender, validator).call({ from: sender });
    ValidatorLog(sender, "=getStakingInfo=", result);
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
    ValidatorLog("getActiveValidators==", result, result.length);
    let validators = result;
    let len = Number(result.length);
    let acc = 0;
    for (let i = 0; i < len; i++) {
        acc = validators[i]
        console.log(acc)
        result = await contracts[index].methods.getValidatorInfo(acc).call({ from: sender });
        ValidatorLog(acc, "=getValidatorInfo=", result);
        result = await contracts[index].methods.getValidatorDescription(acc).call({ from: sender });
        ValidatorLog(acc, "=getValidatorDescription=", result);
        result = await contracts[index].methods.isActiveValidator(acc).call({ from: sender });
        ValidatorLog(acc, "=isActiveValidator=", result);
        result = await contracts[index].methods.isTopValidator(acc).call({ from: sender });
        ValidatorLog(acc, "=isTopValidator=", result);
    }

    return result;
};

const getValidatorInfo = async (sender) => {
    const index = 0;
    let result = 0;
    let acc = sender;
    console.log(acc)
    result = await contracts[index].methods.getValidatorInfo(acc).call({ from: sender });
    ValidatorLog(acc, "=getValidatorInfo=", result);
    result = await contracts[index].methods.getValidatorDescription(acc).call({ from: sender });
    ValidatorLog(acc, "=getValidatorDescription=", result);
    result = await contracts[index].methods.isActiveValidator(acc).call({ from: sender });
    ValidatorLog(acc, "=isActiveValidator=", result);
    result = await contracts[index].methods.isTopValidator(acc).call({ from: sender });
    ValidatorLog(acc, "=isTopValidator=", result);

    return result;
};
const totalStake = async (sender) => {
    const index = 0;
    let result = 0;

    result = await contracts[index].methods.totalStake().call({ from: sender });
    ValidatorLog("totalStake==", result);
    result = await contracts[index].methods.totalJailedHB().call({ from: sender });
    ValidatorLog("totalJailedHB==", result);

    return result;
};
const punishValidators = async (sender) => {
    const index = 1;
    let result = 0;
    let len = await contracts[index].methods.getPunishValidatorsLen().call({ from: sender });
    ValidatorLog("getPunishValidatorsLen==", len);
    for (let i = 0; i < len; i++) {
        result = await contracts[index].methods.punishValidators(i).call({ from: sender });
        ValidatorLog("punishValidators==", result);
        result = await contracts[index].methods.getPunishRecord(result).call({ from: sender });
        ValidatorLog("getPunishRecord==", result);
    }


    return result;
};


async function usageFunc() {
    console.log("usage: \n cp --createProposal \n vp --voteProposal\n stake\n coev  --createOrEditValidator\n unstake\n votes \n pass \n staked \n gav  --getActiveValidators\n ts --totalStake\n pv --punishValidators\n ");
    ValidatorLog("process.argv==", process.argv);
    let epochBlock = (await web3.eth.getBlock("latest"));
    ValidatorLog(epochBlock.number, epochBlock.timestamp);

}
let handlers = {
    "cp": (async function () {
        await createProposal(accounts[4], "");
    }),
    "vp": (async function () {
        await voteProposal(accounts[4], true);
    }),
    "stake": (async function () {
        await stake(accounts[4], accounts[3]);
    }),
    "coev": (async function () {
        await createOrEditValidator(accounts[1], "moniker", "identity", "website", "email", "details");
    }),
    "unstake": (async function () {
        await unstake(accounts[1]);
    }),
    "votes": (async function () {
        const id = 0;
        await votes(accounts[1], id);
    }),
    "pass": (async function () {
        await pass(accounts[4]);
    }),
    "staked": (async function () {
        await staked(accounts[4], accounts[4]);
    }),
    "gav": (async function () {
        await getActiveValidators(accounts[1]);
    }),
    "gvi": (async function () {
await getValidatorInfo(accounts[5]);
await getValidatorInfo(accounts[6]);
        await getValidatorInfo(accounts[4]);
    }),
    "ts": (async function () {
        await totalStake(accounts[4]);
    }),
    "pv": (async function () {
        await punishValidators(accounts[1]);
    }),
    "default": (async function () {
        await usageFunc();
    })

};

// ValidatorLog(process.argv);
const f = handlers[process.argv[3]] || handlers["default"];

(async function () {
    [contracts, contract_addresses, accounts] = await instanceContracts();
    await f();
})();
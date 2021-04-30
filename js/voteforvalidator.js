
const Web3 = require('web3');
const util = require('./util');

const parseLog = require('eth-log-parser');

let admin = "0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e";
const admin1 = "0x598FeaB9ff6A090a7fAA9dF0F3B4df3F0c8D35FC";
const admin2 = "0xC49926C4124cEe1cbA0Ea94Ea31a6c12318df947";
admin = admin1;
const secrets = util.loadJson('._');
const adminr_secrets = secrets.key;
// const password = "123456";
const VALIDATORS = "0x000000000000000000000000000000000000F000";
const PUNISH = "0x000000000000000000000000000000000000F001";
const PROPOSAL = "0x000000000000000000000000000000000000F002";


// const BN = require('BigNumber.js');
const web3 = new Web3(new Web3.providers.HttpProvider('http://35.73.127.28:8645'));
// // wei是以太坊上的的最小单位，ether小数点后18位为一个wei

let handlers = {
    "b": (async function () {
        await setAddress();
    }),
    "cs": (async function () {
        await claims();
    }),
    "c": (async function () {
        await claim();
    }),
    "m": (async function () {
        await merkleRoots();
    }),
    "e": (async function () {
        await epochtimestamps();
    }),
    "default": (async function () {
        await usageFunc();
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();


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



let Proposal = {};
let abi = {};
function instanceProposal() {
    abi = require("./Proposal.json").abi;
    Proposal = new web3.eth.Contract(abi, PROPOSAL);
    if (undefined == Proposal) {
        console.log("un");
        return;
    }
    // console.log(Proposal.methods)
}

let Punish = {};
function instancePunish() {
    let abi = require("./Punish.json").abi;
    Punish = new web3.eth.Contract(abi, PUNISH);
    if (undefined == Punish) {
        console.log("un");
        return;
    }
    // console.log(Punish.methods)
}


let Validators = {};
function instanceValidators() {
    let abi = require("./Validators.json").abi;
    Validators = new web3.eth.Contract(abi, VALIDATORS);
    if (undefined == Validators) {
        console.log("un");
        return;
    }
    // console.log(Validators.methods)
}

instanceValidators();

instancePunish();

instanceProposal();

let result;


(async function () {


    // var balanceWei = await web3.eth.getBalance(admin);//.then(console.log);//.toNumber();
    // // 从wei转换成ether
    // // var balance = web3.utils.fromWei(web3.utils.toBN(balanceWei), 'ether');
    // console.log("===balnace====", balanceWei);
    // console.log(balance);

    // await Proposal.methods.createProposal('0xC49926C4124cEe1cbA0Ea94Ea31a6c12318df947', 'detail').send({ from: admin });

    // await Proposal.methods.voteProposal('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe', true).send({ from: admin });
    // await Proposal.methods.setUnpassed('0xfd49c8467fc8f2E115322b21CaE17559aEa07cBe').send({ from: admin });


    // //step7
    // await web3.eth.personal.unlockAccount(admin, password);
    result = await Proposal.methods.proposals('0x1b297ebe5720f9887b4302c56f932bc424920c2d707f5276cee99d0831651851').call({ from: admin });
    console.log(result);

    // result = await Proposal.methods.votes('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe', '0xad49c8467fc8f2E115322b21CaE17559aEa07cBe').call({ from: admin });
    // console.log(result);

    // result = await Proposal.methods.pass('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe').call({ from: admin });
    // console.log(result);

    // await Validators.methods.stake('0xfd49c8467fc8f2E115322b21CaE17559aEa07cBe').send({ from: admin });
    // await Validators.methods.createOrEditValidator('0xfd49c8467fc8f2E115322b21CaE17559aEa07cBe', "moniker", "identity", "website", "email", "details").send({ from: admin });
    // // address payable feeAddr, moniker, identity, website, email, details

    // await Validators.methods.tryReactive('0xfd49c8467fc8f2E115322b21CaE17559aEa07cBe').send({ from: admin });

    // await Validators.methods.unstake('0xfd49c8467fc8f2E115322b21CaE17559aEa07cBe').send({ from: admin });

    // await Validators.methods.withdrawStaking('0xfd49c8467fc8f2E115322b21CaE17559aEa07cBe').send({ from: admin });
    // await Validators.methods.withdrawProfits('0xfd49c8467fc8f2E115322b21CaE17559aEa07cBe').send({ from: admin });
    // await Validators.methods.distributeBlockReward().send({ from: admin });
    // await Validators.methods.updateActiveValidatorSet(['0xfd49c8467fc8f2E115322b21CaE17559aEa07cBe'],1).send({ from: admin });
    // await Validators.methods.removeValidator('0xfd49c8467fc8f2E115322b21CaE17559aEa07cBe').send({ from: admin });
    // await Validators.methods.removeValidatorIncoming('0xfd49c8467fc8f2E115322b21CaE17559aEa07cBe').send({ from: admin });

    // result = await Validators.methods.getValidatorInfo('0xC49926C4124cEe1cbA0Ea94Ea31a6c12318df947').call({ from: admin });
    // console.log(result);

    // result = await Validators.methods.staked('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe', '0xad49c8467fc8f2E115322b21CaE17559aEa07cBe').call({ from: admin });
    // console.log(result);

    // result = await Validators.methods.operationsDone('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe', 1).call({ from: admin });
    // console.log(result);
    for (let i = 0; i < 2; i++) {
        result = await Validators.methods.currentValidatorSet(i).call({ from: admin });
        console.log("==", result);
        // result = await Validators.methods.highestValidatorsSet(i).call({ from: admin });
        // console.log(result);
    }
    result = await Validators.methods.totalStake().call({ from: admin });
    console.log(result);
    result = await Validators.methods.totalJailedHB().call({ from: admin });
    console.log(result);


    // result = await Punish.methods.punishValidators().call({ from: admin });
    // console.log(result);

    // result = await Punish.methods.punishRecords('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe').call({ from: admin });
    // console.log(result);

    // result = await Punish.methods.punished(1).call({ from: admin });
    // console.log(result);

    // result = await Punish.methods.decreased(1).call({ from: admin });
    // console.log(result);

    result = await Punish.methods.punishThreshold().call({ from: admin });
    console.log(result);
    result = await Punish.methods.removeThreshold().call({ from: admin });
    console.log(result);
    result = await Punish.methods.decreaseRate().call({ from: admin });
    console.log(result);



})();


var Tx = require('ethereumjs-tx').Transaction;
const ethereumjs_common = require('ethereumjs-common').default;

async function sendSignedTx() {

    let nonce = await web3.eth.getTransactionCount(admin, "pending") + 100;
    console.log("===nonce======", nonce);

    //  let encodedabi = await Validators.methods.createOrEditValidator('0xC49926C4124cEe1cbA0Ea94Ea31a6c12318df947', "moniker", "identity", "website", "email", "details").encodeABI();

    // let encodedabi = await Proposal.methods.createProposal('0xC49926C4124cEe1cbA0Ea94Ea31a6c12318df947', 'detail').encodeABI();
    let encodedabi = await Proposal.methods.voteProposal('0x1b297ebe5720f9887b4302c56f932bc424920c2d707f5276cee99d0831651851', true).encodeABI();

    // let encodedabi = await Validators.methods.stake(admin).encodeABI();

    var privateKey = Buffer.from(adminr_secrets, 'hex');
    const gasprice = await web3.eth.getGasPrice();
    var rawTx = {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasprice),
        gasLimit: web3.utils.toHex(3000000),
        from: admin,
        to: PROPOSAL,
        value: '0x00',
        data: encodedabi,
        chainId: 170
    }
    // var transaction_data =
    // {
    //     "from": from_account,
    //     "to": to_account,
    //     "value": 1000000000000000000,
    //     "gas": 60000,
    //     "nonce": nonce
    // };
    var common = ethereumjs_common.forCustomChain('ropsten', { networkId: 170, chainId: 170, name: 'geth' }, 'muirGlacier');
    var tx = new Tx(rawTx, { "common": common });
    // var tx = new Tx(rawTx, { 'chain': 'ropsten', hardfork: 'istanbul' });
    tx.sign(privateKey);

    var serializedTx = tx.serialize();

    let receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    console.log(JSON.stringify(receipt))
    // console.log(receipt);
    // {
    //     const events = parseLog(receipt.logs, abi)
    //     // const events = parseLog(Object.values(receipt.events), abi)
    //     console.log("=============================")

    //     console.log(events)
    // }

}
// sendSignedTx();


// // var json_data = JSON.parse (fs.readFileSync (file_path));
// // const decrypted_account = web3.eth.accounts.decrypt (json_data, pw);
// function send_one_ether(from_account, nonce, private_key, to_account) {
//     var transaction_data =
//     {
//         "from": from_account,
//         "to": to_account,
//         "value": 1000000000000000000,
//         "nonce": nonce
//     };

//     var transaction = new Transaction(transaction_data);

//     var bytes = [];
//     var private_key_bytes = private_key.substr(2); // remove the 0x
//     for (var b = 0; b < private_key_bytes.length; b += 2) {
//         var hex_byte = private_key_bytes.substr(b, 2);
//         var int_byte = parseInt(hex_byte, 16);
//         bytes.push(int_byte);
//     }

//     transaction.sign(Buffer.from(bytes));

//     var verified = transaction.verifySignature(); // returns true
//     var valid = transaction.validate(); // returns false

//     var serialized_transaction = transaction.serialize();
//     web3.eth.sendSignedTransaction("0x" + serialized_transaction.toString("hex")).on("receipt", console.log);
// }

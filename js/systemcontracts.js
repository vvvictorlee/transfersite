
const Web3 = require('web3');

// // // Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

const admin = "0xad49c8467fc8f2e115322b21cae17559aea07cbe";
const password = "123456";
const VALIDATORS = "0x000000000000000000000000000000000000F000";
const PUNISH = "0x000000000000000000000000000000000000F001";
const PROPOSAL = "0x000000000000000000000000000000000000F002";

const TTOKEN_ = "0x609dbeE878452065E4d5bB8A2578b4BD5b399be6";

let TToken = {};
function instanceToken() {
    let tabi = require("./TToken.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
    TToken = new web3.eth.Contract(tabi, TTOKEN_);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
    if (undefined == TToken) {
        console.log("un");
        return;
    }
    // console.log(TToken.methods)
}


function unlock(address, password) {
    web3.eth.personal.unlockAccount(address, password).
        then(() => { console.log('Account unlocked.'); }).
        catch(console.error);
}

// tbal =  TToken.new("Test Bal", "TBAL", 18);
//  tbal.mint(admin, web3.utils.toWei("145000"));
// TBAL = tbal.address;
function mint(adress, amount) {
    TToken.methods.mint(address, web3.utils.toWei(amount)).send({ from: admin }, function (error, result) {
        console.log("error:")
        console.log(error)
        console.log("result:")
        console.log(result)
    });
}

function balanceOf(address) {
    TToken.methods.balanceOf(address).call({ from: address }, function (error, result) {
        console.log("error:")
        console.log(error)
        console.log("result:")
        console.log(result)
    }).then(console.log);
}

let Proposal = {};
function instanceProposal() {
    let abi = require("./Proposal.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
    Proposal = new web3.eth.Contract(abi, PROPOSAL);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
    if (undefined == Proposal) {
        console.log("un");
        return;
    }
    // console.log(Proposal.methods)
}

let Punish = {};
function instancePunish() {
    let abi = require("./Punish.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
    Punish = new web3.eth.Contract(abi, PUNISH);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
    if (undefined == Punish) {
        console.log("un");
        return;
    }
    // console.log(Punish.methods)
}


let Validators = {};
function instanceValidators() {
    let abi = require("./Validators.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
    Validators = new web3.eth.Contract(abi, VALIDATORS);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
    if (undefined == Validators) {
        console.log("un");
        return;
    }
    // console.log(Validators.methods)
}
// redeem =  Proposal.new(TBAL);

// tbal.

function transferToken(address, amount) {
    TToken.methods.transfer(address, web3.utils.toWei(amount)).send({ from: admin }, function (error, result) {
        console.log("error:")
        console.log(error)
        console.log("result:")
        console.log(result)
    });
}


function balanceOfC(address, owner) {
    TToken.methods.balanceOf(address).call({ from: owner }, function (error, result) {
        console.log("error:")
        console.log(error)
        console.log("result:")
        console.log(result)
    }).then(console.log);
}

const weekblocks = 40320 + 10;

// //step 1
// instanceToken();
// //step 2
instanceValidators();

instancePunish();

instanceProposal();

//step 3
//mint(admin);
let result;
//step 4 tran
// transferToken(PROPOSAL, web3.utils.toWei("20000"));
(async function () {
    // let accounts = await web3.eth.getAccounts();

    // console.log(accounts);

    // await web3.eth.personal.unlockAccount(admin, password);

    // let acc = accounts.slice(0,2)
    //  //step5
    // await Proposal.methods.initialize(acc).send({from:admin});

    //step6
    // let week2Block = (await web3.eth.getBlock(weekblocks));

    // await Proposal.methods.createProposal('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe', 'detail').send({ from: admin });

    // await Proposal.methods.voteProposal('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe', true).send({ from: admin });
    // await Proposal.methods.setUnpassed('0xfd49c8467fc8f2E115322b21CaE17559aEa07cBe').send({ from: admin });


    // //step7
    // await web3.eth.personal.unlockAccount(accounts[1], password);
    // result = await Proposal.methods.proposals('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe').call({ from: accounts[1] });
    // console.log(result);

    // result = await Proposal.methods.votes('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe', '0xad49c8467fc8f2E115322b21CaE17559aEa07cBe').call({ from: accounts[1] });
    // console.log(result);


    // result = await Proposal.methods.pass('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe').call({ from: accounts[1] });
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

    // result = await Validators.methods.validatorInfo('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe').call({ from: accounts[1] });
    // console.log(result);

    // result = await Validators.methods.staked('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe', '0xad49c8467fc8f2E115322b21CaE17559aEa07cBe').call({ from: accounts[1] });
    // console.log(result);

    // result = await Validators.methods.operationsDone('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe', 1).call({ from: accounts[1] });
    // console.log(result);
    for (let i = 0; i < 3; i++) {
        result = await Validators.methods.currentValidatorSet(i).call({ from: accounts[1] });
        console.log(result);
        result = await Validators.methods.highestValidatorsSet(i).call({ from: accounts[1] });
        console.log(result);
    }
    result = await Validators.methods.totalStake().call({ from: accounts[1] });
    console.log(result);
    result = await Validators.methods.totalJailedHB().call({ from: accounts[1] });
    console.log(result);


    // result = await Punish.methods.punishValidators().call({ from: accounts[1] });
    // console.log(result);

    // result = await Punish.methods.punishRecords('0xad49c8467fc8f2E115322b21CaE17559aEa07cBe').call({ from: accounts[1] });
    // console.log(result);

    // result = await Punish.methods.punished(1).call({ from: accounts[1] });
    // console.log(result);

    // result = await Punish.methods.decreased(1).call({ from: accounts[1] });
    // console.log(result);

    // //step8
    // await Proposal.methods.claim().send({ from: accounts[1] });

    // //step9
    // result = await TToken.methods.balanceOf(accounts[1]).call({ from: accounts[1] });
    // console.log(result);

})();


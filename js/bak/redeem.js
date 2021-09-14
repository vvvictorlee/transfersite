
const Web3 = require('web3');

// // // Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

const admin = "0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568";
const password = "123456";
const REDEEM = "0x2a103D4F9d64B4124F0a2Dd556DEee0926A92527";//redeem.address;
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

let Redeem = {};
function instanceRedeem() {
    let abi = require("./Redeem.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
    Redeem = new web3.eth.Contract(abi, REDEEM);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
    if (undefined == Redeem) {
        console.log("un");
        return;
    }
    // console.log(Redeem.methods)
}



// redeem =  Redeem.new(TBAL);

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

//step 1
instanceToken();
//step 2
instanceRedeem();

//step 3
//mint(admin);

//step 4 tran
// transferToken(REDEEM, web3.utils.toWei("20000"));
(async function () {
    // let accounts = await web3.eth.getAccounts();

    // // console.log(accounts);

    await web3.eth.personal.unlockAccount(admin, password);

    
    //  //step5
    await Redeem.methods.seedAllocation(1, accounts[1], web3.utils.toWei("1000")).send({from:admin});

    //step6
    let week2Block = (await web3.eth.getBlock(weekblocks));

    await Redeem.methods.finishWeek(2, week2Block.timestamp, week2Block.hash).send({from:admin});

    //step7
    await web3.eth.personal.unlockAccount(accounts[1], password);
    let result = await Redeem.methods.balanceOf(accounts[1]).call({from:accounts[1]});
    console.log(result);

    //step8
    await Redeem.methods.claim().send({ from: accounts[1] });

    //step9
    let result = await TToken.methods.balanceOf(accounts[1]).call({ from: accounts[1] });
    console.log(result);

})();


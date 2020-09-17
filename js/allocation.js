

const Web3 = require('web3');
const util = require('./util');
var BigNumber = require('bignumber.js')
// // // Connect to local Ethereum node
// const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

const admin = "0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568";
const adminr = "0x1084d79A66EF86BFc9c945d4a21159a024dEE14e";
const secrets = util.loadJson('data/secrets.json');
const adminr_secrets = secrets.key;
// const password = "123456";
const REDEEM = "0x99B9Bc4Ca03C227d9cBe0960c416adDE7146026F";//"0x2a103D4F9d64B4124F0a2Dd556DEee0926A92527";//redeem.address;
const REDEEM_ROPSTEN = "0x72c09d4fd187b4336fa4ab66e4360f626619483b";//"0x2a103D4F9d64B4124F0a2Dd556DEee0926A92527";//redeem.address;"0x99B9Bc4Ca03C227d9cBe0960c416adDE7146026F";//

const TTOKEN_ = "0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5";

// const BN = require('BigNumber.js');
// const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/206de317234e48e28a7dd1abbd914e26'));


const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-ropsten.alchemyapi.io/v2/Z42Blpj7cANVPl6vizpQbu_DibFlfWWj'));

// // wei是以太坊上的的最小单位，ether小数点后18位为一个wei

// 

let abi = require("../json/Redeem_Ropsten.json");///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let Redeem_Ropsten = new web3.eth.Contract(abi, REDEEM_ROPSTEN, { "from": admin });//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63

let tabi = require("../json/ERC20.json");///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let erc20 = new web3.eth.Contract(tabi, TTOKEN_);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63


// var balanceWei =  web3.eth.getBalance(admin).then(console.log);//.toNumber();
// // 从wei转换成ether
// // var balance = web3.utils.fromWei(web3.utils.toBN(balanceWei), 'ether');
// console.log(balanceWei);
// console.log(balance);
const user1 = "0x1084d79A66EF86BFc9c945d4a21159a024dEE14e";
const user2 = "0x929378dbc9a1fdc0d05529e48097ff65c6902231";
const user3 = "0x5792F745F632FE6aC28f65E4ffE606D5c9FD9393";
const user4 = "0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568";
const token = "0x06403d9dc00b7cf577023d49f96f899aed86d6c0";
let tokens = ["0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5",
    "0x8d3acd2969ca969188bd8b227dfca09e1691e263",
    "0xc5201589361c2da2b07df626f1cab71b4255b16e",
    "0xe59eb769a705443936a043b07ec1892b448ca24d"];

//     // console.log(Redeem.methods);
tokens.push(token);


let handlers = {
    "b": (async function () {
        await buildsql(process.argv[3]);
    }),
    "c": (async function () {
        await claim();
    }),
    "cs": (async function () {
        await claims();
    }),
    "default": (async function () {
        await usageFunc();
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();

const latest_cycle = 8;

(async function () {
    //await  tokensymbol();
    // await claimStatus();
    // await tokebalances();
    // await merkleRoots();
    // await epochtimestamps();
     await getblock("latest");


})();
async function usageFunc() {
    console.log("Usage:b --buildSql epoch");
}
// 0xf3462368af2eb04423587dcc21a04bf954af36c0b6e92c1f053f58726d1326f6
async function buildsql(epoch) {
    //1_20000000000000000000000_0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5.json
    // 

    let sql_insert_cycle_reward_simulated_data = "INSERT INTO cycle_reward (cycle,addr,token,amount) values (" + epoch + ",'0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568','0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5',20000000000000000000000)";
    const accounts = util.loadJson('data/accounts.json');
    for (const account of accounts) {
        sql_insert_cycle_reward_simulated_data += ",(" + epoch + ",'" + account + "','0xe59eb769a705443936a043b07ec1892b448ca24d',1000000000000000000)";
    }

    sql_insert_cycle_reward_simulated_data += ";";

    util.writeSqlFile("data/simulatedata" + epoch + ".sql", sql_insert_cycle_reward_simulated_data);

}


async function finish(epoch, blocknum) {
    const block = await getblock(blocknum);
    await Redeem.methods.finishEpoch(epoch, block.timestamp, block.hash).send({ from: admin });
}

async function getblock(blocknum) {
    //     let lastBlock = (await web3.eth.getBlock("latest"));
    //     // console.log(lastBlock);

    //     let firstBlock = (await web3.eth.getBlock(1));
    const block = (await web3.eth.getBlock(blocknum));
    console.log(block.gasLimit);

    console.log(block);
    return block;
}

async function unlock(user) {
    await web3.eth.personal.unlockAccount(user, password);
}

async function accounts() {
    //     let accounts = await web3.eth.getAccounts();

    //     // console.log(accounts);

}

async function claimStatus() {
    for (const t of tokens) {
        result1 = await Redeem_Ropsten.methods.claimStatus(user1, t, 1, latest_cycle).call({ from: user1 });
        console.log(t, result1);

        // result1 = await tc.methods.balanceOf(REDEEM_ROPSTEN).call();
        // console.log("REDEEM_ROPSTEN balance==", result1);
    }

}

async function tokebalances() {

    console.log("=======tokebalances=====");

    for (const t of tokens) {
        let tc = new web3.eth.Contract(tabi, t);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63

        let result1 = await tc.methods.balanceOf(user1).call();
        console.log(user1, "user1 balance==", result1);
        result1 = await tc.methods.balanceOf(REDEEM_ROPSTEN).call();
        console.log("REDEEM_ROPSTEN balance==", result1);
    }

}

async function merkleRoots() {
    console.log("=====merkleRoots=======");


    let result1 = await Redeem_Ropsten.methods.merkleRoots(1, latest_cycle).call({ from: user1 });
    console.log(result1);

}


async function tokensymbol() {
    console.log("=====tokensymbol=======");
    for (const t of tokens) {
        let tc = new web3.eth.Contract(tabi, t);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63

        let symbol = await tc.methods.symbol().call();
        console.log("symbol==", symbol, "== token address==", t);

    }

}



async function epochtimestamps() {
    console.log("=====epochtimestamps=======");

    for (let i = 0; i < latest_cycle; i++) {
        const s = await Redeem_Ropsten.methods.epochTimestamps(i + 1).call();
        console.log(i, s);
    }


}




async function verifiedToken() {
    const r = await Redeem_Ropsten.methods._verifiedTokens(0).call();
    console.log(r);

    // const abi = await Redeem_Ropsten.methods.verify(
    //     tokens[1],
    // ).estimateGas({from:adminr,gas:web3.utils.toHex(2100000),value:0x00});

    const result1 = await Redeem_Ropsten.methods.verifiedTokens().call({ from: admin });
    console.log("verifiedTokens", result1);



}


async function claims() {

    const claim_list =
        [
            [
                '4',
                '0xe59eb769a705443936a043b07ec1892b448ca24d',
                '1000000000000000000',
                [
                    '0x6dbdb51e3cbf1354cdf93afd45d89a476cbe5c4bf5b19054f46829e5ff154e7a',
                    '0x44f1d867826400db2eb4af4183468dbe3c5ad122a98b2b0478100addd7d816eb',
                    '0xade934b8e4f58492c0ff6edfce425a36ca87fa7bf76f29da07d9d228bcf08099',
                    '0x8f49442530c09a16211875b69978e8d135d49a20097a623f126b957e9b21570b',
                    '0xaab25d158a9aa15e87e8ea4bf82aeda82151055e7b1e517767fdf98d9f877979',
                    '0x2e96e071fbf7f982034df17698ba2e3a9ad2996472c5683a96a98635955ab5c0',
                    '0x564e7cc9748445d905f3112df112bbd2225f41456442efe2f32b60c8dde26655'
                ]
            ]
        ];

    const gas = await Redeem_Ropsten.methods.claimEpochs(
        user2,
        claim_list
    ).estimateGas({ from: admin });

}

async function claim() {
    const lpacc = user4;
    const claim_list =
        [["6", "0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5", "1000000000000000000", ["0xa9cb34f021a4985f2f488949da805033e965914ec26e4babb713a359061964cc", "0xced1f64640abe2069b4aa377655ee721f0bbb446bbd7d64b7e7d678b53cf6bfd", "0x3d1eca7ebbb6bd37ccbd98cbdcdf94bf0cd3b00a104e3f7c3e66ae0f702d4a5b", "0x86fd9d45992260848b654de24c55466e31981ebdddb9aab8a47283e6dc16abc6", "0xefb6f5da3bd196822a7aee268974ff8e95aea5c6448ab3bbfc6b4c7a40a43faf", "0xbfc93994f85ba49ea6894769056a3d3eeb628278dd99968ed473aa26de789697", "0xe9c405b9b5017fc0c60552d0730ae406c8973d7e75704b22f8a4b7851ea71848"]], ["6", "0xe59eb769a705443936a043b07ec1892b448ca24d", "1000000000000000000", ["0xd6bc46bdb7cb48ef2dd2e561ec44d5da5d51a97c31201c759a5c85e1e5016f1f", "0x67f5c84f6cfbac8ec77f569b107d5d23f9179132a747841ef4562a953e1c141e", "0xf8c5eeba787a11be935a4ccdb6085505449ae93400bf27b9aa77d3198ade39d0", "0x5b60af5875d220c310607467669d937e4d2f0d8045389461f87acdd550105242", "0x194115d59f9f01de66e89b2e20de27ecc04ef7f51acd9a5d76ad01f8033b02ea", "0x3b82dab506e78bf20f40c66693a5980078df470adf3865123d729a091cb278ec", "0xe9c405b9b5017fc0c60552d0730ae406c8973d7e75704b22f8a4b7851ea71848"]]];

    for (const ctbp of claim_list) {
        const [cycle, token, balance, proof] = ctbp;
        console.log("ctbp===", ctbp);

        let result = await Redeem_Ropsten.methods.verifyClaim(lpacc, cycle, token, balance, proof).call({ from: lpacc });
        console.log("verifyClaim==", result);

        const gas = await Redeem_Ropsten.methods.claimEpoch(
            lpacc,
            cycle, token, balance, proof
        ).estimateGas({ from: lpacc });
        console.log("claimEpoch  gas ==", gas);

        // sleep.msleep(para.symbol_interval);
    }

}

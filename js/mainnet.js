

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
const FACTORY_ADRESS = "0xbec1c22fa669bf17b9d2326beb9adce4fc697614";

const TTOKEN_ = "0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5";

// const BN = require('BigNumber.js');
// const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/206de317234e48e28a7dd1abbd914e26'));


const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/8f1495f06d7c47eba0ff397b61a32759'));

// // wei是以太坊上的的最小单位，ether小数点后18位为一个wei

// 

let fabi = require("../json/Factory.json");///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let factory = new web3.eth.Contract(fabi, FACTORY_ADRESS, { "from": admin });//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63

let abi = require("../json/Redeem_Ropsten.json");///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let Redeem_Ropsten = new web3.eth.Contract(abi, REDEEM_ROPSTEN, { "from": admin });//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63

let erc20_abi = require("../json/ERC20.json");///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let erc20 = new web3.eth.Contract(erc20_abi, TTOKEN_);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63


let sabi = require("../json/SToken.json");///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json


// var balanceWei =  web3.eth.getBalance(admin).then(console.log);//.toNumber();
// // 从wei转换成ether
// // var balance = web3.utils.fromWei(web3.utils.toBN(balanceWei), 'ether');
// console.log(balanceWei);
// console.log(balance);
const user1 = "0x1084d79A66EF86BFc9c945d4a21159a024dEE14e";
const user2 = "0x929378dbc9a1fdc0d05529e48097ff65c6902231";
const user3 = "0x5792F745F632FE6aC28f65E4ffE606D5c9FD9393";
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
    "cs": (async function () {
        await claims();
    }),
    "c": (async function () {
        await claim();
    }),
    "default": (async function () {
        await usageFunc();
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();

const token_symbols_json = "data/token_symbols.json";

const latest_cycle = 8;

(async function () {
    //await  tokensymbol();
    // await claimStatus();
    // await tokebalances();
    // await merkleRoots();
    // await epochtimestamps();
    await pairs();
    // 写入文件
    // util.writeFile(token_symbols_json, []);
})();
async function usageFunc() {
    console.log("Usage:b --buildSql epoch");
}


async function pairs() {
    console.log("=====pairs=======");

    let len = await factory.methods.allPairsLength().call({ from: user1 });
    console.log(len);

    let tokens = [];
    for (let i = 0; i < 1; i++) {
        const s = await factory.methods.allPairs(i).call();
        console.log(i, s);
        let stoken = new web3.eth.Contract(sabi, s, { "from": admin });
        // console.log(stoken.methods);
        const r = await stoken.methods.getReserves().call();
        console.log("getReserves==", r);
        console.log("_reserve0==", r._reserve0);
        console.log("_reserve1==", r._reserve1);

        const t0 = await stoken.methods.token0().call();
        console.log("t0==", t0);
        const t1 = await stoken.methods.token1().call();
        console.log("t1==", t1);
        o = {
            token0: t0,
            token1: t1,
            reserve0: r._reserve0,
            reserve1: r._reserve1,
        };

        tokens.push(o);
    }

    tokens =await get_token_symbol(tokens);
    console.log("tokens===",tokens);
}



async function get_token_symbol(token_list) {

    let token_symbols = {};
    try {
        token_symbols = util.loadJson(token_symbols_json);
    } catch (error) {
        console.log(error);
    }

    for (let token of token_list) {
        token_symbols = await hasToken(token.token0, token_symbols);
        token.symbol0= token_symbols[token.token0];
        token_symbols = await hasToken(token.token1, token_symbols);
        token.symbol1= token_symbols[token.token1];
    }

    // 写入文件
    util.writeFile(token_symbols_json, token_symbols);

    return token_list;
}

async function hasToken(token, token_symbols) {
    if (!token_symbols.hasOwnProperty(token)) {
        try {
            let erc20 = new web3.eth.Contract(erc20_abi, token);
            let symbol = await erc20.methods.symbol().call();
            let decimals = await erc20.methods.decimals().call();
            let name = await erc20.methods.name().call();
            token_symbols[token] = [symbol,decimals,name];
            console.log(token_symbols[token]);
        }
        catch (error) {
            console.log(error);
        }
    }
    return token_symbols;
}




async function buildsql(epoch) {
    //1_20000000000000000000000_0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5.json
    // 

    let sql_insert_cycle_reward_simulated_data = "INSERT INTO cycle_reward (cycle,addr,token,amount) values (" + epoch + ",'0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568','0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5',20000000000000000000000)";
    const accounts = util.loadJson('data/accounts.json');
    for (const account of accounts) {
        sql_insert_cycle_reward_simulated_data += ",(" + epoch + ",'" + account.toLowerCase() + "','0xe59eb769a705443936a043b07ec1892b448ca24d',1000000000000000000)";
    }

    sql_insert_cycle_reward_simulated_data += ";";

    util.writeSqlFile("data/simulatedata" + epoch + ".sql", sql_insert_cycle_reward_simulated_data);

}


async function finish(epoch, blocknum) {
    const block = getblock(blocknum);
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

    for (const ctbp of claim_list) {
        const [cycle, token, balance, proof] = ctbp;
        console.log("ctbp===", ctbp);

        let result = await Redeem_Ropsten.methods.verifyClaim(user3, cycle, token, balance, proof).call({ from: user1 });
        console.log("verifyClaim==", result);

        const gas = await Redeem_Ropsten.methods.claimEpoch(
            user3,
            cycle, token, balance, proof
        ).estimateGas({ from: user1 });
        console.log("claimEpoch  gas ==", gas);

        // sleep.msleep(para.symbol_interval);
    }

}

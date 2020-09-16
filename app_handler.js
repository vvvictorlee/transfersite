require('dotenv').config();
var Web3 = require("web3");
var util = require('./util');
let farm_db = require('./farm_db');


var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(process.env.MAINNET_HTTP_PROVIDER));

var factory_abi = util.loadJson('abi/Factory.json');
var factory = new web3.eth.Contract(factory_abi, process.env.MAINNET_CONTRACT_FACTORY);

var stoken_abi = util.loadJson('abi/SToken.json');
var erc20_abi = util.loadJson('abi/ERC20.json');

// 合约abi
var redeem_abi = util.loadJson('abi/MerkleRedeem.json');
var redeem = new web3.eth.Contract(redeem_abi, process.env.CONTRACT_REDEEM);

var pair_token_symbols_json = 'data/pair_token_symbols.json';
var pair_token_filter_json = 'data/filter.json';


async function getPairTokensInfo(addr) {
    console.log("=====getPairTokensInfo=======");

    //get verified pair token list
    const vt = await redeem.methods.verifiedTokens().call();
    console.log(vt);
    const vts = new Set(vt);

    //get all pairs from factory
    let len = await factory.methods.allPairsLength().call();
    console.log(len);
    let yswps = farm_db.getSwpTotalByPToken();
    let tokens = [];
    for (let i = 0; i < len; i++) {
        //get pair 
        const p = await factory.methods.pairTokens(i).call();
        console.log(i, p);
        if (!vts.has(p)) {
            console.log("skip unverified pair token", p);
            continue;
        }

        //get pair token instance by pair  contract address 
        let ptoken = new web3.eth.Contract(erc20_abi, p, {});
        // console.log(stoken.methods);
        let released = await ptoken.methods.totalSupply().call();
        const symbol = await ptoken.methods.symbol().call();
        released = web3.utils.fromWei(released);
        let balance = "-";
        let share = "-";
        if (addr != undefined && addr.length > 0) {
            balance = await ptoken.methods.balanceOf(addr).call();
            balance = web3.utils.fromWei(balance);
            share = balance / released * 100;
        }

        const swp = process.env.SWP_ADDRESS;
        let swpins = new web3.eth.Contract(erc20_abi, swp);
        const blocksOfDay = 5760;
        const lastBlock = await web3.eth.getBlock("latest");


        o = {
            symbol: symbol,
            released: released,
            ydays_swps: web3.utils.fromWei(yswps[p]),
            yourbalance: balance,
            yourshare: share,
        };

        tokens.push(o);
    }

    console.log("tokens===", tokens);


    return tokens;
}


async function getPairsInfo() {
    console.log("=====pairs=======");
    //get verified pair token list
    const vt = await redeem.methods.verifiedTokens().call();
    console.log(vt);
    const vts = new Set(vt);

    //get all pairs from factory
    let len = await factory.methods.allPairsLength().call();
    console.log(len);
    let filter_set = new Set();
    const token_filter = util.loadJson(pair_token_filter_json);
    if (token_filter != undefined && token_filter.length > 0) {
        filter_set = new Set(token_filter);
    }
    let tokens = [];
    for (let i = 0; i < len; i++) {
        //get pair 
        const s = await factory.methods.allPairs(i).call();
        console.log(i, s);
        //get pairtoken contract address by pair contract address
        const p2t = await factory.methods.pair2Token(s).call();
        if (!vts.has(p2t) || filter_set.has(s)) {
            console.log("skip unverified pair token", s);
            continue;
        }

        //get pair token instance by pair  contract address 
        let stoken = new web3.eth.Contract(stoken_abi, s, {});
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

    tokens = await get_pair_token_symbol(tokens);

    var compare = function (obj1, obj2) {
        if (obj2.symbol1[0] != "USDT") {
            return -1;
        }
        return obj2.reserve1 - obj1.reserve1;
    }

    tokens.sort(compare);

    let index = tokens.findIndex(token => token.symbol0[0] == "SWP");
    let item = tokens[index];
    tokens.splice(index, 1);
    tokens.unshift(item);

    console.log("tokens===", tokens);

    tokens = await calculateApy(tokens);

    return tokens;
}

async function calculateApy(tokens) {
    // 6144 * 30 * swp单价 * (池子资金 * 挖矿速率 / （1池资金 * 挖矿速率 + 2池资金* 挖矿速率 + ...））/  池子资金 这是日化， 前端可以直接根据日化再去* 365
    const factor1 = 6144;
    const factor2 = 30;
    const year = 365;
    const miningRate5 = 5;
    const miningRate = 1;
    const miningRate0 = 0;
    const r = tokens[0];
    const swpprice = (r.reserve1 * Math.pow(10, -6) / web3.utils.fromWei(r.reserve0)).toFixed(6);
    let total = tokens.reduce((acc, cur) => acc + cur.reserve1 * Math.pow(10, -6), 0);
    var tokens = tokens.map((token) => {
        let rate = miningRate;
        if (token.symbol0[0] == "SWP") {
            rate = miningRate5;
        }
        else if (token.symbol1[0] != "USDT") {
            rate = miningRate0;
        }
        let reserve1 = token.reserve1 * Math.pow(10, -6);
        token.apy = (factor1 * factor2 * swpprice * reserve1 * rate / total / reserve1).toFixed(4);
        return token
    });

    console.table(tokens);
    return tokens;

}

async function get_pair_token_symbol(token_list) {

    let token_symbols = {};
    try {
        token_symbols = util.loadJson(pair_token_symbols_json);
    } catch (error) {
        console.log(error);
    }

    for (let token of token_list) {
        token_symbols = await hasToken(token.token0, token_symbols);
        token.symbol0 = token_symbols[token.token0];
        token_symbols = await hasToken(token.token1, token_symbols);
        token.symbol1 = token_symbols[token.token1];

        //order wrong swap
        if (token.symbol1[0] != "USDT") {
            [token.token0, token.token1] = [token.token1, token.token0];
            [token.reserve0, token.reserve1] = [token.reserve1, token.reserve0];
            [token.symbol0, token.symbol1] = [token.symbol1, token.symbol0];
        }
    }

    // 写入文件
    util.writeFile(pair_token_symbols_json, token_symbols);

    return token_list;
}

async function hasToken(token, token_symbols) {
    if (!token_symbols.hasOwnProperty(token)) {
        try {
            let erc20 = new web3.eth.Contract(erc20_abi, token);
            let symbol = await erc20.methods.symbol().call();
            let decimals = await erc20.methods.decimals().call();
            let name = await erc20.methods.name().call();
            token_symbols[token] = [symbol, decimals, name];
            console.log(token_symbols[token]);
        }
        catch (error) {
            console.log(error);
        }
    }
    return token_symbols;
}



async function getSwpInfo() {
    try {
        let stoken = new web3.eth.Contract(stoken_abi, process.env.SWP_USDT_PAIR_ADDRESS, {});
        const r = await stoken.methods.getReserves().call();
        console.log(r);
        const price = (r._reserve1 * Math.pow(10, -6) / web3.utils.fromWei(r._reserve0)).toFixed(6);
        const token = process.env.SWP_ADDRESS;
        let erc20 = new web3.eth.Contract(erc20_abi, token);
        let released = await erc20.methods.totalSupply().call();

        return { price: price, released: web3.utils.fromWei(released) };

    } catch (error) {
        console.error(error);
    }
    return { price: 0, released: 0 };
}

async function getSwpBalanceByAddress(addr) {
    try {
        const token = process.env.SWP_ADDRESS;
        let erc20 = new web3.eth.Contract(erc20_abi, token);
        let balance = await erc20.methods.balanceOf(addr).call();

        return { balance: web3.utils.fromWei(balance) };

    } catch (error) {
        console.error(error);
    }
    return { balance: 0 };
}



module.exports = {
    getPairTokensInfo,
    getPairsInfo,
    getSwpInfo,
    getSwpBalanceByAddress,
};


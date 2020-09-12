require('dotenv').config();
var Web3 = require("web3");
var co = require('co');
var util = require('./util');
var redeem_db = require('./redeem_db');
// require('./conf/const');
// require('./conf/const_private');
require('./conf/const_ropsten');
var sleep = require('sleep');

const { claimProof } = require("./scripts/calculateProof");
const disburse = require("./scripts/disburse");
const { fstat } = require("fs");

var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(global.HTTP_PROVIDER));

// let HDWalletProvider = require('truffle-hdwallet-provider')

// let terms = util.loadJson('secrets/admin.json');

// // //3.设置测试网络 infura
// // let netIp = global.HTTP_PROVIDER
// // let provider = new HDWalletProvider(terms, netIp)
// // web3.setProvider(provider);

var mainnetweb3 = new Web3();
mainnetweb3.setProvider(new Web3.providers.HttpProvider(process.env.MAINNET_HTTP_PROVIDER));

var factory_abi = util.loadJson('abi/Factory.json');
var factory = new mainnetweb3.eth.Contract(factory_abi, process.env.MAINNET_CONTRACT_FACTORY);

// 合约abi
var redeem_abi = util.loadJson('abi/MerkleRedeem.json');
var redeem = new web3.eth.Contract(redeem_abi, global.CONTRACT_REDEEM);

var stoken_abi = util.loadJson('abi/SToken.json');
var erc20_abi = util.loadJson('abi/ERC20.json');

var file_tokens = './data/token_list.json';
var token_symbols_json = './data/token_symbols.json';
var pair_token_symbols_json = 'data/pair_token_symbols.json';
const secrets = util.loadJson('data/secrets.json');

const admin = process.env.ADMIN;
const password = process.env.PASSWORD;
const epoch_reports_path = process.env.EPOCH_REPORTS_PATH || "/Users/lisheng/mygitddesk/mining-scripts-v2/reports/CR_";
const admin_secrets = secrets.key;//process.env.ADMIN_SECRETS;
const chain_id = process.env.CHAIN_ID;
const symbol_interval = process.env.SYMBOL_INTERVAL_MS;
const is_issue = process.env.IS_ISSUE;
const claim_exec_by_admin = process.env.CLAIM_EXEC_BY_ADMIN;
const gasLimit = process.env.GAS_LIMIT;


const cron = require('node-cron')
async function runJob() {
    /**
     * 基本使用
     * 第一個參數：排成格式
     * 第二個參數：要執行的 function
     * 第三個參數：是否要立即執行
     **/
    let task = cron.schedule('* * * * * *', function () {
        console.log('hello world', counter, new Date().getSeconds())
    }, true)

    task.start()
    task.stop()
    task.destroy()

    /**
     * 檢驗是否是有效的排程格式
     **/
    cron.validate('* * * * * *')

    // cron-table


    // /**
    //  * 一段時間後自動執行
    // **/
    // '* * * * * *'			// 每秒跑一次
    // '*/2 * * * *'			// 兩分鐘跑一次

    // /**
    //  * 特定時間執行
    //  **/
    // '1,3,4,5 * * * *'		// 每到分鐘數為 1, 3, 4, 5 時執行
    // '1-5 * * * *'			// 分鐘數為 1, 2, 3, 4, 5 時執行
    // 安裝
    // 1
    // $ npm install node-cron
}


async function getPairsInfo() {
    console.log("=====pairs=======");

    let len = await factory.methods.allPairsLength().call({ from: admin });
    console.log(len);

    let tokens = [];
    for (let i = 0; i < len; i++) {
        const s = await factory.methods.allPairs(i).call();
        console.log(i, s);
        let stoken = new mainnetweb3.eth.Contract(stoken_abi, s, { "from": admin });
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

    tokens.push({
	"token0": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "181770607384324442704",
	"reserve1": "778745031",
	"symbol0": ["SWP", "18", "Swapx Token"],
	"symbol1": ["USDT", "6", "Tether USD"]
})

    console.log("tokens===", tokens);
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
    }

    // 写入文件
    util.writeFile(pair_token_symbols_json, token_symbols);

    return token_list;
}

async function hasToken(token, token_symbols) {
    if (!token_symbols.hasOwnProperty(token)) {
        try {
            let erc20 = new mainnetweb3.eth.Contract(erc20_abi, token);
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



async function getSwpInfoByAddress(addr) {
    try {

        const token = process.env.SWP_ADDRESS;
        let erc20 = new web3.eth.Contract(erc20_abi, token);
        let balance = await erc20.methods.balanceOf(addr).call();
        let released = await erc20.methods.totalSupply().call();
        // const utoken = process.env.SWP_USDT_ADDRESS;
        // let stoken = new web3.eth.Contract(stoken_abi, utoken);
        // let reserves = await stoken.methods.getReserves().call();
        // const price = reserves[0]/(reserves[1]+1);
        const price = 1.68;
        // return {balance:balance,price:price,released:released};

        return { balance: web3.utils.fromWei(balance), price: price, released: web3.utils.fromWei(released) };

    } catch (error) {
        console.error(error);
    }
    return { balance: 0, price: 0, released: 0 };
}


async function getRewardListByAddress(addr) {
    try {
        addr = addr.toLowerCase();

        await redeem_db.updateClaimStatusByAddress(addr, redeem);
        const token_symbols = await get_token_symbol();
        // console.log(token_symbols);
        return await redeem_db.getRewardListByAddress(addr, token_symbols, web3);
    } catch (error) {
        console.log(error);
    }
    return { "result": "unkonwn error" };
}

async function claim_all(addr) {

    try {
        addr = addr.toLowerCase();

        await redeem_db.updateClaimStatusByAddress(addr, redeem);

        let sizebalances = await redeem_db.getCycleRewardsByAddress(addr);
        if (sizebalances[0] == 0) {
            return {};
        }
        let balances = sizebalances[1];
        const para = {
            web3: web3,
            admin: admin,
            contract: redeem,
            erc20_abi: erc20_abi,
            contractAddress: global.CONTRACT_REDEEM,
            path: epoch_reports_path,
            password: password,
            admin_secrets: admin_secrets,
            chain_id: chain_id,
            symbol_interval: symbol_interval,
            claim_exec_by_admin: claim_exec_by_admin,
        };

        const encodedAbi = await claimProof(para, addr, balances);
        console.log("claim list====", encodedAbi);
        return encodedAbi;
    }
    catch (error) {
        console.error(error);
    }
    return "";
}

async function get_token_symbol() {
    let token_list = util.loadJson(file_tokens);

    let token_symbols = {};
    try {
        token_symbols = util.loadJson(token_symbols_json);
    } catch (error) {
        console.error(error);
    }

    token_symbols[process.env.SWP_ADDRESS] = process.env.SWP_SYMBOL || "SWP";

    for (let token of token_list.pTokens) {
        if (!token_symbols.hasOwnProperty(token)) {
            try {
                let erc20 = new web3.eth.Contract(erc20_abi, token);
                let symbol = await erc20.methods.symbol().call();
                token_symbols[token] = symbol;
                sleep.msleep(symbol_interval);
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    // 写入文件
    util.writeFile(token_symbols_json, token_symbols);

    return token_symbols;
}

const firstStartBlockNum = 1;
const blocks = 64;
// (utils,admin,contract,path,epochNum, blockNum) 

async function disburse_by_epoch(epochNum, step,issue_flag,is_execute) {
    try {
        if (epochNum <= 0) {
            return "epoch must be larger than 0";
        }
        const epoch_path = epoch_reports_path + epochNum;
        blockNum = firstStartBlockNum + (epochNum - 1) * blocks;
        const para = {
            web3: web3,
            admin: admin,
            contract: redeem,
            erc20_abi: erc20_abi,
            contractAddress: global.CONTRACT_REDEEM,
            password: password,
            admin_secrets: admin_secrets,
            chain_id: chain_id,
            is_issue: issue_flag == undefined ? is_issue : issue_flag,
            step: step,
            is_execute: is_execute == undefined ? true : is_execute,
        };

        console.log("redeem addr :", para.contractAddress);
        console.log("admin  addr :", para.admin);
        console.log("------ START ------");

        // await disburse(para, epoch_path, epochNum, blockNum);
        await disburse.disburse(para, epoch_path, epochNum, blockNum);

    } catch (error) {
        console.error(error);
    }
    return { "result": "unkonwn error" };

}

module.exports = {
    getPairsInfo,
    getSwpInfoByAddress,
    getRewardListByAddress,
    claim_all,
    get_token_symbol,
    disburse_by_epoch,
};


var epoch = 1;
// 服务器执行, 检查默克尔树根
disburse_by_epoch(epoch, 1, false,false);

// 本地执行，顺序执行，防止出错
// disburse_by_epoch(epoch, 0, true, false, 0);   // 首次，创建周期
// disburse_by_epoch(epoch, 1, false, true, 0);   // 发币
// disburse_by_epoch(epoch, 1, true, false, 0);   // 上传数根
// disburse_by_epoch(epoch+1, 0, true, false, 0); // 允许领取奖励

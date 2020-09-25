require('dotenv').config();
var Web3 = require("web3");
var util = require('./util');
var redeem_db = require('./redeem_db');
let cachedata = require("./cachedata");

var sleep = require('sleep');

const { claimProof } = require("./scripts/calculateProof");

var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(process.env.HTTP_PROVIDER));

// 合约abi
var redeem_abi = util.loadJson('abi/MerkleRedeem.json');
var redeem = new web3.eth.Contract(redeem_abi, process.env.CONTRACT_REDEEM);

var erc20_abi = util.loadJson('abi/ERC20.json');

var file_tokens = (process.env.TOKENS_LIST_JSON_PATH || "./") + 'data/token_list.json';
var token_symbols_json = './data/token_symbols.json';
// const secrets = util.loadJson('data/secrets.json');

const admin = process.env.ADMIN;
const password = process.env.PASSWORD;
const epoch_reports_path = process.env.EPOCH_REPORTS_PATH || "/Users/lisheng/mygitddesk/mining-scripts-v2/reports/CR_";
const admin_secrets = process.env.ADMIN_SECRETS;//secrets.key;//
const chain_id = process.env.CHAIN_ID;
const symbol_interval = process.env.SYMBOL_INTERVAL_MS || 1000;
const claim_exec_by_admin = 0;

async function checkClaimStatus(addr) {
    const flag = await cachedata.hasAddress(addr);
    if (!flag) {
        return;
    }

    const updateFlag = await redeem_db.updateClaimStatusByAddress(addr, redeem);

    if (updateFlag) {
        await cachedata.putAddress(addr, 0);
        return;
    }
    await cachedata.putAddress(addr, Date.now());


}

/**
 * 
 * @param {*} addr   Account address
 */
async function getRewardListByAddress(addr) {
    let err = "";
    try {
        addr = addr.toLowerCase();

        await checkClaimStatus(addr);

        const token_symbols = await get_token_symbol();
        // console.log(token_symbols);
        return await redeem_db.getRewardListByAddress(addr, token_symbols, web3);
    } catch (error) {
        console.log(error);
        err = error;
    }
    return { "result": "unkonwn error" + err };
}

async function claimAllRewards(addr) {
    let err = "";
    try {
        addr = addr.toLowerCase();
        await cachedata.putAddress(addr, 1);

        await checkClaimStatus(addr);

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
        err = error;
    }
    return err;
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


module.exports = {
    getRewardListByAddress,
    claimAllRewards ,
    get_token_symbol,
};


require('dotenv').config();
var Web3 = require("web3");
var co = require('co');
var util = require('./util');
var block_db = require('./block_db');
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

// 合约abi
var redeem_abi = util.loadJson('abi/MerkleRedeem.json');
var redeem = new web3.eth.Contract(redeem_abi, global.CONTRACT_REDEEM);

var stoken_abi = util.loadJson('abi/SToken.json');
var erc20_abi = util.loadJson('abi/ERC20.json');

var file_tokens = './data/token_list.json';
var token_symbols_json = './data/token_symbols.json';


const admin = process.env.ADMIN;
const password = process.env.PASSWORD;
const epoch_reports_path = process.env.EPOCH_REPORTS_PATH || "/Users/lisheng/mygitddesk/mining-scripts-v2/reports/CR_";
const admin_secrets = process.env.ADMIN_SECRETS;
const chain_id = process.env.CHAIN_ID;
const symbol_interval = process.env.SYMBOL_INTERVAL_MS;
const is_issue = process.env.IS_ISSUE;
const claim_exec_by_admin=process.env.CLAIM_EXEC_BY_ADMIN;

async function getRewardListByAddress(addr) {
    try {
        await block_db.updateClaimStatusByAddress(addr.toLowerCase(), redeem);
        const token_symbols = await get_token_symbol();
        console.log(token_symbols);
        return await block_db.getRewardListByAddress(addr.toLowerCase(), token_symbols, web3);
    } catch (error) {
        console.log(error);
    }
    return { "result": "unkonwn error" };
}

async function claim_all(addr) {

    try {
        await block_db.updateClaimStatusByAddress(addr.toLowerCase(), redeem);

        let sizebalances = await block_db.getCycleRewardsByAddress(addr.toLowerCase());
        if (sizebalances[0] == 0) {
            return {};
        }
        let balances = sizebalances[1] ;
        const para = {
            web3: web3,
            admin: admin,
            contract: redeem,
            erc20_abi: erc20_abi,
            contractaddress: global.CONTRACT_REDEEM,
            path: epoch_reports_path,
            password: password,
            admin_secrets: admin_secrets,
            chain_id: chain_id,
            symbol_interval:symbol_interval,
            claim_exec_by_admin:claim_exec_by_admin,
        };

        const encodedAbi = await claimProof(para, addr, balances);
        console.log("encodedAbi====", encodedAbi);
        return encodedAbi;
    }
    catch (error) {
        console.log(error);
    }
    return "";
}

async function get_token_symbol() {
    let token_list = util.loadJson(file_tokens);

    let token_symbols = {};
    try {
        token_symbols = util.loadJson(token_symbols_json);
        console.log(token_symbols);
    } catch (error) {
        console.log(error);
        // token_symbols = {"0x71805940991e64222f75cc8a907353f2a60f892e":"AETH", "0x1df382c017c2aae21050d61a5ca8bc918772f419":"BETH", "0x4cf4d866dcc3a615d258d6a84254aca795020a2b":"CETH", "0x6c50d50fafb9b42471e1fcabe9bf485224c6a199":"DETH" };
    }

    for (let token of token_list.pTokens) {
        console.log(token);
        if (!token_symbols.hasOwnProperty(token)) {
            console.log("in==", token);
            try {
                let erc20 = new web3.eth.Contract(erc20_abi, token);
                let symbol = await erc20.methods.symbol().call();
                console.log("symbol==", symbol);
                token_symbols[token] = symbol;
                sleep.msleep(symbol_interval);
            }
            catch (error) {
                console.log(error);
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

async function disburse_by_epoch(epochNum, step) {
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
            contractaddress: global.CONTRACT_REDEEM,
            password: password,
            admin_secrets: admin_secrets,
            chain_id: chain_id,
            is_issue:is_issue,
            step:step,
        };

        // await disburse(para, epoch_path, epochNum, blockNum);
        await disburse.disburse(para, epoch_path, epochNum, blockNum);
        
    } catch (error) {
        console.log(error);
    }
    return { "result": "unkonwn error" };

}

module.exports = {
    getRewardListByAddress,
    claim_all,
    get_token_symbol,
    disburse_by_epoch,
};

// disburse_by_epoch(1, 1)
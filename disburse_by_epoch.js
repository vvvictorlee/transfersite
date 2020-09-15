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


const firstStartBlockNum = 1;
const blocks = 64;
// (utils,admin,contract,path,epochNum, blockNum) 

async function disburse_by_epoch(epochNum, step, issue_flag, is_execute) {
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
    disburse_by_epoch,
};


var epoch = 1;
// 服务器执行, 检查默克尔树根
disburse_by_epoch(epoch, 1, false, false);

// 本地执行，顺序执行，防止出错
// disburse_by_epoch(epoch, 0, true, false, 0);   // 首次，创建周期
// disburse_by_epoch(epoch, 1, false, true, 0);   // 发币
// disburse_by_epoch(epoch, 1, true, false, 0);   // 上传数根
// disburse_by_epoch(epoch+1, 0, true, false, 0); // 允许领取奖励

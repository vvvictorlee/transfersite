require('dotenv').config();
var Web3 = require("web3");
var co = require('co');
var util = require('./util');
var block_db = require('./block_db');
// require('./conf/const');
require('./conf/const_private');
const { calculateProofAndClaimEpoches } = require("./scripts/calculateProof");
const { disburse } = require("./scripts/disburse");
const { fstat } = require("fs");

var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(global.HTTP_PROVIDER));

// 合约abi
var factory_abi = util.loadJson('abi/Factory.json');
var factory = new web3.eth.Contract(factory_abi, global.CONTRACT_FACTORY);

var redeem_abi = util.loadJson('abi/MerkleRedeem.json');
var redeem = new web3.eth.Contract(redeem_abi, global.CONTRACT_REDEEM);

var stoken_abi = util.loadJson('abi/SToken.json');
var erc20_abi = util.loadJson('abi/ERC20.json');

var file_tokens = './data/token_list.json';
var file_conf = './data/conf.json';

var token_symols = './data/token_symbols.json';
var symbol_conf = './data/conf.json';


const admin = "0x9842495d6bAB5Cb632777Ff25B5b4c1e1d595f24";

async function getRewardListByAddress(addr) {
    return await block_db.getRewardListByAddress(addr, get_token_symbol(), web3);
}

async function claim_all(addr) {
    let balances = await block_db.getCycleRewardsByAddress(addr);
    if (balances.length == 0) {
        return {};
    }
    return await claimProof(web3, admin, redeem, addr, balances);
}

async function get_token_symbol() {
    let token_list = util.loadJson(file_tokens);

    let token2symbol = {};
    try {
        token2symbol = util.loadJson(token_symols);
    } catch (error) {

    }

    token_list.pTokens.forEach(token => {
        if (!token2symbol.hasOwnProperty(token)) {
            let erc20 = new web3.eth.Contract(erc20_abi, token);
            let symbol = erc20.methods.symbol().call();
            token2symbol[token] = symbol;
        }
    });

    // 写入文件
    util.writeFile(token_symols, token2symbol);

    return token2symbol;

}

const epoch_reports_path = "/Users/lisheng/mygitddesk/mining-scripts-v2/reports/CR_";
const firstStartBlockNum = 1;
const blocks = 64;
// (utils,admin,contract,path,epochNum, blockNum) 
async function disburse_by_epoch(epochNum) {
    if (epochNum <= 0) {
        return "epoch must be larger than 0";
    }
    const epoch_path = epoch_reports_path + epochNum;
    blockNum = firstStartBlockNum + (epochNum - 1) * blocks;
    const para = {};
    await disburse(web3, admin, redeem, epoch_path, epochNum, blockNum);
}

module.exports = {
    getRewardListByAddress,
    claim_all,
    get_token_symbol,
    disburse_by_epoch,
};

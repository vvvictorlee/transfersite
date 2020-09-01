var Web3 = require("web3");
var co = require('co');
var util = require('./util');
var block_db = require('./block_db');
// require('./conf/const');
require('./conf/const_private');
const { disburse } = require("./scripts/disburse");
const { ECPrivate } = require("sshpk");

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


const admin = "0x9842495d6bAB5Cb632777Ff25B5b4c1e1d595f24";
const epoch_reports_path="/Users/lisheng/mygitddesk/mining-scripts-v2/reports/CR_";
const firstStartBlockNum = 1;
const blocks = 64;
// utils,admin,contract,path,epochNum, blockNum
async function disburse_by_epoch(epochNum) {
    const epoch_path =epoch_reports_path+epochNum;
        blockNum =  firstStartBlockNum+(EpochNum-1)*blocks;
    await disburse(web3,admin,redeem,epoch_path,epochNum,blockNum);
}

module.exports = {
    disburse_by_epoch,
};
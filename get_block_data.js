var Web3 = require("web3");
var fs = require('fs');
var util = require('./util');
var block_db = require('./block_db');
require('./conf/const');

var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(global.HTTP_PROVIDER));

// 合约abi
var factory_abi= util.loadJson('abi/Factory.json');
var factory = new web3.eth.Contract(factory_abi, global.CONTRACT_FACTORY);

var stoken_abi= util.loadJson('abi/SToken.json');
var erc20_abi= util.loadJson('abi/ERC20.json');

var file_tokens = './data/token_list.json';

// -------------------------------

// Get All S-Token、Pair Token List
function getAllTokenList() {
    factory.getPastEvents('PairCreated', {fromBlock: 0, toBlock: 'latest'}, function(error, result){
        if (error) console.log('getAllTokenList :', error);

        let dataList = [];
        let tokenList = {
            sTokens: [],
            pTokens: []
        }
        for (var i = 0; i < result.length; i++) {
            let info = result[i].returnValues;
            dataList.push([result[i].blockNumber, info.pair.toLowerCase(), info.ptoken.toLowerCase(), info.token0.toLowerCase(), info.token1.toLowerCase()]);
            tokenList.sTokens.push(info.pair.toLowerCase());
            tokenList.pTokens.push(info.ptoken.toLowerCase());
        }
        // 存入数据库
        block_db.addTokenList(dataList);
        // 写入文件
        // util.writeFile(file_tokens, tokenList);

        console.log('getAllTokenList :', dataList.length, error);
    })
}

// get All Transfer for ERC20
function getAllTransfer(token, startBlock) {
    let erc20 = new web3.eth.Contract(erc20_abi, token);
    erc20.getPastEvents('Transfer', {fromBlock: startBlock, toBlock: 'latest'}, function(error, result){
        let dataList = [];
        for (var i = 0; i < result.length; i++) {
            let info = result[i].returnValues;
            dataList.push([result[i].blockNumber, result[i].transactionHash.toLowerCase(), info.from.toLowerCase(), info.to.toLowerCase(), info.value, result[i].event, result[i].address.toLowerCase()]);
        }
        console.log(token, ':', dataList.length);
        block_db.addBlockDataList(dataList);
    })
}

// 获取Token的转账记录
function getAllTokenBlockData(syncBlock, token_list) {
    // 获取SWP的转账记录
    getAllTransfer(global.CONTRACT_SWP, syncBlock);

    // 从文件加载币种列表
    token_list.sTokens.forEach(function(item, index){
        getAllTransfer(item, syncBlock);
    });
    token_list.pTokens.forEach(function(item, index){
        getAllTransfer(item, syncBlock);
    });

    // 从DB加载币种列表
    // block_db.getAllTokens(function (token_list) {
    //     token_list.forEach(function(item, index){
    //         getAllTransfer(item, syncBlock);
    //     });
    // });
}

// get All Liquidity records for S-Token
function getPoolSync(token, startBlock) {
    let stoken = new web3.eth.Contract(stoken_abi, token);
    stoken.getPastEvents('Sync', {fromBlock: startBlock, toBlock: 'latest'}, function(error, result){

        let dataList = [];
        for (var i = 0; i < result.length; i++) {
            let info = result[i].returnValues;
            dataList.push([result[i].blockNumber, result[i].transactionHash.toLowerCase(), info.reserve0, info.reserve1, result[i].event, result[i].address.toLowerCase()]);
        }
        console.log(token+" Sync : "+dataList.length);
        block_db.addPoolBlockData(dataList);
    })
}

// 获取SToken的流动池存量
function getAllPoolReserve(syncBlock, token_list) {
    token_list.sTokens.forEach(function(item, index){
        getPoolSync(item, syncBlock);
    });
}
// ================

// #1 ---- 获取所有Token
// getAllTokenList();

// TODO 设置Token认证状态
// 获取认证的Pair Token列表

// #2 ---- 获取Token的转账记录
var conf = {
    lastBlocker: 0
}
var token_list= util.loadJson(file_tokens);
// getAllTokenBlockData(conf.lastBlocker, token_list);


// 3# ---- 获取流动池SToken的存量
// getAllPoolReserve(conf.lastBlocker, token_list);


// 4# ---- 获取 挖矿合约中 的所有交易



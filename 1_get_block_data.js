var Web3 = require("web3");
var co = require('co');
var util = require('./util');
var block_db = require('./block_db');
// require('./conf/const');
require('./conf/const_ropsten');
// require('./conf/const_private');

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

// -------------------------------

// Get All S-Token、Pair Token List
async function getAllTokenList() {
    let result = await factory.getPastEvents('PairCreated', {fromBlock: 0, toBlock: 'latest'});

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
    // 写入文件
    util.writeFile(file_tokens, tokenList);
    // 存入数据库
    await block_db.addTokenList(dataList);

    console.log('getAllTokenList :', dataList.length);

    return tokenList;
}

// get All Transfer for ERC20
async function getAllTransfer(token, startBlock) {
    let erc20 = new web3.eth.Contract(erc20_abi, token);
    let result = await erc20.getPastEvents('Transfer', {fromBlock: startBlock, toBlock: 'latest'});

    let dataList = [];
    for (var i = 0; i < result.length; i++) {
        let info = result[i].returnValues;
        dataList.push([result[i].blockNumber, result[i].transactionHash.toLowerCase(), info.from.toLowerCase(), info.to.toLowerCase(), info.value, result[i].event, result[i].address.toLowerCase()]);
    }
    // console.log(token, ':', result);
    await block_db.addBlockDataList(dataList);
    console.log('getAllTransfer :', token, dataList.length);
}

// 获取Token的转账记录
async function getAllTokenBlockData(syncBlock, token_list) {
    // 获取SWP的转账记录
    await getAllTransfer(global.CONTRACT_SWP, syncBlock);

    // 从文件加载币种列表
    for (let i=0; i<token_list.sTokens.length; i++) {
        await getAllTransfer(token_list.sTokens[i], syncBlock);
    }
    for (let i=0; i<token_list.pTokens.length; i++) {
        await getAllTransfer(token_list.pTokens[i], syncBlock);
    }

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
    stoken.getPastEvents('Sync', {fromBlock: startBlock, toBlock: 'latest'}, function (error, result) {
        let dataList = [];
        for (var i = 0; i < result.length; i++) {
            let info = result[i].returnValues;
            dataList.push([result[i].blockNumber, result[i].transactionHash.toLowerCase(), info.reserve0, info.reserve1, result[i].event, result[i].address.toLowerCase()]);
        }
        console.log('getPoolSync :', token, dataList.length);
        block_db.addPoolBlockData(dataList);
    })
}

// 获取SToken的流动池存量
function getAllPoolReserve(syncBlock, token_list) {
    token_list.sTokens.forEach(function (item, index) {
        getPoolSync(item, syncBlock);
    });
}

// 获取所有认证Token
async function getAllVerified() {
    let startBlock = 0;
    let result = await redeem.getPastEvents('VerifiedToken', {fromBlock: startBlock, toBlock: 'latest'});

    let dataList = [];
    for (var i = 0; i < result.length; i++) {
        let info = result[i].returnValues;
        dataList.push([result[i].blockNumber, info._token.toLowerCase()]);
    }
    await block_db.updateVerifiedToken(dataList);
    console.log('getAllVerified :', dataList.length);
}

// 获取所有领取记录
function getAllClaim(startBlock) {
    redeem.getPastEvents('Claimed', {fromBlock: startBlock, toBlock: 'latest'}, function (error, result) {
        let dataList = [];
        for (var i = 0; i < result.length; i++) {
            let info = result[i].returnValues;
            dataList.push([result[i].blockNumber, result[i].transactionHash.toLowerCase(), info._claimant.toLowerCase(), info._token.toLowerCase(), info._balance, result[i].event]);
        }
        block_db.addClaimBlockDataList(dataList);
        console.log('getAllClaim :', dataList.length);
    })
}

// 判断地址类型
async function getAddrType(addr) {
    if (addr == global.ADDRESS_ZERO) return 2;
    try {
        var code = await web3.eth.getCode(addr);
        if (code === '0x') return 0;
        return 1;
    } catch(e) {
        console.log('getAddrType Err :',e.message);
        return 7;   // 错误地址
    }
}
// 获取所有的地址，并判断类型
async function chaeckAllAddr() {
    // 获取所有的地址，并入库
    await block_db.addAllAddr(global.ADDRESS_COMMUNITY);

    // 获取所有未校验地址
    let list = await block_db.getUncheckAddr();

    var type_list = [];
    for (let i=0; i<list.length; i++) {
        var type = await getAddrType(list[i].addr);
        type_list.push([list[i].addr, type]);
    }
    await block_db.updateAddrTypeList(type_list);

    console.log('chaeckAllAddr :', type_list.length);
}
// ================

function getBlockData(lastBlock) {
    co(function* () {
        let now_block = (yield web3.eth.getBlockNumber());
        console.log('NowBlock :',now_block);

        // 加载配置文件
        var conf = util.loadJson(file_conf);
        // 重设lastBlock
        if (lastBlock>=0) {
            conf = {
                lastBlock: lastBlock,
                updatedBlocks: []
            }
        }

        // #1 ---- 获取所有Token
        var token_list = yield getAllTokenList();

        // 获取认证的Pair Token列表
        yield getAllVerified();

        // #2 ---- 获取Token的转账记录
        // var token_list = util.loadJson(file_tokens);
        yield getAllTokenBlockData(conf.lastBlock, token_list);

        // 3# ---- 获取流动池SToken的存量
        getAllPoolReserve(conf.lastBlock, token_list);

        // 4# 获取所有奖励提取记录
        getAllClaim(conf.lastBlock);

        // 5# 获取所有的地址，并判断类型
        yield chaeckAllAddr();

        // 更新同步区块记录
        conf.updatedBlocks.push(conf.lastBlock);
        conf.lastBlock = now_block;
        util.writeFile(file_conf, conf);
    });
}

// -1 表示自动，否则可以强制指定块号
getBlockData(0);
var {addSnapshotBlock, miningPairToken, updatPoolUSDT} = require('./block_db');
var util = require('./util');
require('./conf/const');

var snapshot_filename = 'data/snapshot.json';
var snapshot_list = util.loadJson(snapshot_filename);
// -------------------------------------

// 生成某个奖励周期的快照持币地址情况
function createSnapshotBlock(curr_cycle) {
    curr_cycle.snapshot.forEach(function(item, index){
        addSnapshotBlock(curr_cycle.cycle, item);
    });
    console.log("createSnapshotBlock : "+curr_cycle.cycle);
}

// 更新每个流动池的USDT数量
function updateAllPoolUsdt(block_list) {
    block_list.forEach(function(item, index){
        updatPoolUSDT(item, global.CONTRACT_USDT); // 针对每个快照块的
    });
    console.log("updateAllPoolUsdt : "+block_list.length);
}
// -------------------------------------

// #0 ---- 获取当前快照
var curr_cycle = snapshot_list[snapshot_list.length-1];
var syncBlock = curr_cycle.start;
syncBlock = 0;

// #1 ---- 生成每个快照块，各个地址的持币情况
// createSnapshotBlock(curr_cycle);


// #2 ---- 生成每个快照块，各个币种的总发行量、流动池大小
// 生成每个快照块，各个币种的总发行量
// block_db.addAllTokenSupply(syncBlock);

// 更新每个流动池的USDT数量（需要记录到pToken下）
// updateAllPoolUsdt(curr_cycle.snapshot);

// TODO 更新认证状态（需要记录到pToken下）


// #3 ---- 计算挖矿
// 初始化挖矿数据
// block_db.initMiningData(syncBlock);

// TODO 更新待领取数量

// 开始挖矿
async function mining(block_list) {
    block_list.forEach(await function (item, index) {
        // 挖铺子币
        setTimeout(function(){miningPairToken(item, global.BLOCK_AWARDS, global.MAX_SUPPLY)},index*2000);
        // miningPairToken(item, 2000, 5000);

        // 挖SWP
        // block_db.miningSWP(item,2000);
    });
}

mining(curr_cycle.snapshot);
// miningPairToken(8573463,2000,5000);
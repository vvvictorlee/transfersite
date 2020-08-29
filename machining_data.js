var block_db = require('./block_db');
var util = require('./util');
var co = require('co');

require('./conf/const');

var snapshot_filename = 'data/snapshot.json';
var snapshot_list = util.loadJson(snapshot_filename);

// -------------------------------------
function miningCycle() {
    // #0 ---- 获取当前快照
    var curr_cycle = snapshot_list[snapshot_list.length-1];
    var syncBlock = curr_cycle.start;

    co(function*() {
        // #1 ---- 生成每个快照块，各个地址的持币情况
        yield block_db.addSnapshotBlock(curr_cycle.cycle, curr_cycle.snapshot);

        // #2 ---- 生成每个快照块，各个币种的总发行量、流动池大小
        // 生成每个快照块，各个币种的总发行量
        yield block_db.addAllTokenSupply(syncBlock);

        // 更新每个流动池的USDT数量（需要记录到pToken下）
        yield block_db.updatPoolUSDT(curr_cycle.snapshot, global.CONTRACT_USDT);

        // 更新认证状态（需要记录到pToken下）
        yield block_db.updatVerified();

        // #3 ---- 计算挖矿
        // 初始化挖矿数据
        yield block_db.initMiningData(syncBlock);

        // 更新待领取数量
        yield block_db.updateUnclaimed(curr_cycle.snapshot);

        // 开始挖矿
        yield block_db.miningToken(curr_cycle.snapshot, global.BLOCK_AWARDS, global.MAX_SUPPLY);

        // #4 ---- 计算周期奖励
        yield block_db.creatCycleReward(curr_cycle.cycle);
    });
}

miningCycle();



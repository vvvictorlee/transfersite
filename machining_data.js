var block_db = require('./block_db');
var util = require('./util');
var co = require('co');

require('./conf/const');

var snapshot_filename = 'data/snapshot.json';
var snapshot_list = util.loadJson(snapshot_filename);

// -------------------------------------
function miningCycle(cycle) {
    // #0 ---- 获取当前快照
    var curr_cycle = snapshot_list[cycle];
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
        // 更新每个区块的USDT加权平均量
        yield block_db.updatWeightPoolUSDT();

        // #3 ---- 计算挖矿
        // 清理一个周期的挖矿数据，防止计算出错
        yield block_db.cleanCycleMiningData(curr_cycle.cycle);

        // 初始化挖矿数据
        yield block_db.initMiningData(syncBlock);

        // TODO 删除挖矿表中的 REDEEM领取合约，防止持有Pair Token 重复计算？【需要根据真实数据测试影响】

        // 开始挖矿
        yield block_db.miningToken(curr_cycle.snapshot, global.BLOCK_AWARDS, global.MAX_SUPPLY, global.BLOCK_AWARDS_SWP, global.MAX_SUPPLY_SWP);

        // #4 ---- 计算周期奖励
        // 计算周期奖励，同时更新地址类型
        yield block_db.creatCycleReward(curr_cycle.cycle);

        // TODO 合约未领取的数据要如何处理？
        //  【是否回到待分配池中（释放mining_data的数量）？
        //  还是本次合约不计算合约的持有奖励，给社区（每区块先释放，然后分给社区）？
        //  处理方式不同】


        console.log('---- finished! ----');

        // #5 ---- 数据检查
        yield block_db.checkCycleData();
    });
}

miningCycle(snapshot_list.length-1);

//引入数据库
var mysql = require('mysql');
var wrapper = require('co-mysql');
var co = require('co');
require('./conf/const');


module.exports = {
    addTokenList,
    updateVerifiedToken,
    addBlockDataList,
    addPoolBlockData,
    addClaimBlockDataList,
    addAllAddr,
    getUncheckAddr,
    updateAddrTypeList,
    getAllTokens,
    addSnapshotBlock,
    addAllTokenSupply,
    updatPoolUSDT,
    updatVerified,
    initMiningData,
    updateUnclaimed,
    miningToken,
    creatCycleReward,
    getCycleRewardReport,
    checkCycleData
};

//实现本地链接
var pool = mysql.createPool(db_config);
var conn = wrapper(pool);

// ----- Block Chain -----
// Add Token List
async function addTokenList(dataList) {
    if (dataList.length==0) return;

    let sql = "INSERT IGNORE INTO token_list(block,sToken,pToken,token0,token1) VALUES ? ";

    await conn.query(sql, [dataList]).then(function (rows) {
        console.log("addTokenList :", dataList.length, rows.message);
    });
}

// 更新币种认证状态
async function updateVerifiedToken(dataList) {
    if (dataList.length==0) return;

    let sql = "UPDATE token_list SET verified=1,vBlock=? WHERE pToken=? AND verified=0";

    await co(function*() {
        for (let i = 0;i<dataList.length;i++) {
            let info = dataList[i];
            let rows = yield conn.query(sql, [info[0],info[1]]);
        }
        console.log("updateVerifiedToken : ", dataList.length);
    });
}

async function getAllTokens(callback) {
    let sql = "SELECT sToken,pToken FROM token_list";
    let rows = await conn.query(sql, null).then(function (rows) {
        let list = [];
        for (var i = 0; i < rows.length; i++) {
            list.push(rows[i].sToken);
            list.push(rows[i].pToken);
        }
        callback(list);
    });
}

// Add Token Transfer Data List
async function addBlockDataList(dataList) {
    if (dataList.length==0) return;

    let sql = "INSERT IGNORE INTO block_chain_data(block,txnHash,fromAddr,toAddr,amount,eventName,token) VALUES ? ";

    await conn.query(sql, [dataList]).then(function (rows) {
        console.log("addBlockDataList :", dataList.length, rows.message);
    });
}
async function addPoolBlockData(dataList) {
    if (dataList.length==0) return;

    let sql = "INSERT IGNORE INTO block_chain_pool(block,txnHash,reserve0,reserve1,eventName,token) VALUES ? ";

    await conn.query(sql, [dataList]).then(function (rows) {
        console.log("addPoolBlockData :", dataList.length, rows.message);
    });
}
async function addClaimBlockDataList(dataList) {
    if (dataList.length==0) return;

    let sql = "INSERT IGNORE INTO block_chain_claim(block,txnHash,addr,token,amount,eventName) VALUES ? ";

    await conn.query(sql, [dataList]).then(function (rows) {
        console.log("addClaimBlockDataList :", dataList.length, rows.message);
    });
}

// ----- Snapshot -----
// 生成某个奖励周期的快照持币地址情况
async function addSnapshotBlock(cycle, block_list) {
    let sql = "INSERT INTO snapshot_block (cycle, block, addr, token, balance) SELECT ?, ?, Addr,token,sum(amount) balance2 FROM ( " +
        "(SELECT toAddr Addr, token,sum(amount) amount FROM block_chain_data WHERE block<=? GROUP BY toAddr,token) UNION ALL " +
        "(SELECT fromAddr Addr, token,sum(-amount) amount FROM block_chain_data WHERE block<=? GROUP BY fromAddr,token) " +
        ") t WHERE Addr<>'"+global.ADDRESS_ZERO+"' GROUP BY Addr,token ON DUPLICATE KEY UPDATE balance=VALUES(balance)";

    await co(function*() {
        for (let i = 0;i<block_list.length;i++) {
            let block = block_list[i];
            // 生成快照块的持币地址
            let rows = yield conn.query(sql, [cycle, block, block, block]);
            console.log("addSnapshotBlock : block=", block, rows.message);
        }
    });
}

// 更新每个区块的发行量
async function addAllTokenSupply(startBlock) {
    let sql = "INSERT INTO token_supply (block, token, supply) " +
        "SELECT block, token, sum(balance) FROM snapshot_block WHERE block>=? GROUP BY cycle, block, token " +
        "ON DUPLICATE KEY UPDATE supply=VALUES(supply)";

    await conn.query(sql, [startBlock]).then(function (rows) {
        console.log("addAllTokenSupply : startBlock=", startBlock, rows.message);
    });
}

// 更新每个区块的USDT存量
async function updatPoolUSDT(block_list, usdt_addr) {
    let sql = "INSERT INTO token_supply (block, token, pool_usdt) " +
        "SELECT ?, t.pToken, IF(t.token0=?, p.reserve0, IF(t.token1=?, p.reserve1, 0)) usdt FROM " +
        "(SELECT token, max(block) block FROM block_chain_pool WHERE block<=? GROUP BY token) m " +
        "LEFT JOIN block_chain_pool p ON p.token=m.token AND p.block=m.block " +
        "LEFT JOIN token_list t ON p.token=t.sToken " +
        "ON DUPLICATE KEY UPDATE pool_usdt=VALUES(pool_usdt)";

    await co(function*() {
        for (let i = 0;i<block_list.length;i++) {
            let block = block_list[i];
            // 计算每个块的pToken奖励
            let rows = yield conn.query(sql, [block, usdt_addr, usdt_addr, block]);
            console.log("updatPoolUSDT : block=", block, rows.message);
        }
    });
}

// 更新发行总量表中的认证状态（pToken到区块）
/*
UPDATE token_supply s
LEFT JOIN (SELECT pToken,verified,vBlock FROM token_list WHERE verified=1) t ON s.token = t.pToken
SET s.verified=t.verified
WHERE s.block>=t.vBlock
 */
async function updatVerified(startBlock) {
    let sql = "UPDATE token_supply s LEFT JOIN (SELECT pToken,verified,vBlock FROM token_list WHERE verified=1) t ON s.token = t.pToken\n" +
        "SET s.verified=t.verified WHERE s.block>=t.vBlock";

    await conn.query(sql, null).then(function (rows) {
        console.log("updatVerified :", rows.message);
    });
}

// 添加所有有交易记录的地址
async function addAllAddr() {
    let sql = "INSERT IGNORE INTO addr_type (addr) SELECT DISTINCT * FROM ( " +
        "SELECT fromAddr FROM block_chain_data GROUP BY fromAddr UNION ALL " +
        "SELECT toAddr FROM block_chain_data GROUP BY toAddr UNION ALL " +
        "SELECT ? ) t";

    await conn.query(sql, [global.ADDRESS_COMMUNITY]).then(function (rows) {
        console.log("addAllAddr :", rows.message);
    });
}
// 获取未检查的地址
async function getUncheckAddr() {
    let sql = "SELECT addr FROM addr_type WHERE type=9";

    var list = await conn.query(sql, null);

    return list;
}
// 更新地址类型列表
async function updateAddrTypeList(list) {
    if (list.length==0) return;

    let sql = "INSERT INTO addr_type (addr, type) VALUES ? ON DUPLICATE KEY UPDATE type=VALUES(type)";

    await conn.query(sql, [list]);
}


// ----- Mining -----
// 初始化挖矿数据
async function initMiningData(block) {
    let sql_S = "INSERT INTO mining_data (cycle, block, addr, s_token, s_balance, p_token) " +
        "SELECT cycle, t.block, addr, sToken, balance, pToken FROM snapshot_block t LEFT JOIN token_list ON sToken=token " +
        "WHERE t.block>=? AND sToken IS NOT NULL ON DUPLICATE KEY UPDATE s_balance=VALUES(s_balance)";
    let sql_P = "INSERT INTO mining_data (cycle, block, addr, s_token, p_balance, p_token) " +
        "SELECT cycle, t.block, addr, sToken, balance, pToken FROM snapshot_block t LEFT JOIN token_list ON pToken=token \n" +
        "WHERE t.block>=? AND pToken IS NOT NULL ON DUPLICATE KEY UPDATE p_balance=VALUES(p_balance)";

    await co(function*() {
        // 更新SToken在每个快照块的持有量
        let rows = yield conn.query(sql_S, [block]);
        console.log("initMiningData 1: syncBlock=", block, rows.message);
        // 更新PairToken在每个快照块的持有量
        rows = yield conn.query(sql_P, [block]);
        console.log("initMiningData 2: syncBlock=", block, rows.message);
    });
}
// 更新待领取数量
/*
UPDATE mining_data m LEFT JOIN (
SELECT addr,token,SUM(amount) unclaimed FROM (
SELECT addr,p_token token,SUM(p_awards) amount FROM mining_data WHERE block<8573463 GROUP BY addr,p_token
UNION ALL
SELECT addr,token,SUM(-amount) amount FROM block_chain_claim WHERE block<8573463 GROUP BY addr,token
) x GROUP BY addr,token
) t ON m.addr=t.addr AND m.p_token=t.token
SET m.p_unclaimed=t.unclaimed
WHERE m.block=8573463 AND t.unclaimed IS NOT NULL
*/
async function updateUnclaimed(block_list) {
    let sql = "UPDATE mining_data m LEFT JOIN ( SELECT addr,token,SUM(amount) unclaimed FROM ( " +
        "SELECT addr,p_token token,SUM(p_awards) amount FROM mining_data WHERE block<? GROUP BY addr,p_token UNION ALL " +
        "SELECT addr,token,SUM(-amount) amount FROM block_chain_claim WHERE block<? GROUP BY addr,token ) x GROUP BY addr,token " +
        ") t ON m.addr=t.addr AND m.p_token=t.token SET m.p_unclaimed=t.unclaimed WHERE m.block=? AND t.unclaimed IS NOT NULL";

    await co(function*() {
        for (let i = 0;i<block_list.length;i++) {
            let block = block_list[i];
            let rows = yield conn.query(sql, [block, block, block]);
            console.log("updateUnclaimed : block=", block, rows.message);
        }
    });
}

/* --== mining Pair Token ==--
SELECT cycle,m.block,addr,p_token,p_awards,IF(supply IS NULL, 0, FLOOR(s_balance/supply*IF(curr_award IS NULL, 2000, curr_award)*0.85)) aa, curr_award FROM
-- UPDATE
mining_data m LEFT JOIN token_supply s ON m.s_token=s.token and m.block=s.block
LEFT JOIN (SELECT p_token token,IF(SUM(p_awards)+2000<=5000, 2000, IF(5000-SUM(p_awards)<=0,0,5000-SUM(p_awards))) curr_award FROM mining_data WHERE block<8573463 GROUP BY p_token) t ON p_token=t.token
-- SET m.p_awards = IF(supply IS NULL, 0, FLOOR(s_balance/supply*IF(curr_award IS NULL, 2000, curr_award)*0.85))
WHERE m.block=8573463
 */
/* --== reaward Sys ==--
INSERT INTO mining_data (cycle, block, addr, s_token, p_token, p_awards)
SELECT cycle, block, '0xAdmin', s_token, p_token,(IF(curr_award IS NULL, 2000, curr_award)-sum(p_awards)) awards FROM mining_data
LEFT JOIN (SELECT p_token token,IF(SUM(p_awards)+2000<=5000, 2000, IF(5000-SUM(p_awards)<=0,0,5000-SUM(p_awards))) curr_award FROM mining_data WHERE block<8573463 GROUP BY p_token) t ON p_token=t.token
WHERE block=8573463 AND p_awards>0
GROUP BY cycle, block, s_token, p_token
ON DUPLICATE KEY UPDATE p_awards=VALUES(p_awards)
 */
/*
--== miningSWP ==--
SELECT addr, s_token, p_balance,p_awards, pool_usdt, swp_awards,all_pool, FLOOR(curr_award*pool_usdt/all_pool*(p_balance+p_unclaimed+p_awards)/(supply+new_p_totle)) aa, curr_award FROM mining_data m LEFT JOIN token_supply s ON m.p_token=s.token and m.block=s.block
LEFT JOIN (SELECT SUM(pool_usdt) all_pool FROM token_supply WHERE block=8573463 AND verified = 1) t1 ON 1=1
LEFT JOIN (SELECT SUM(p_awards) new_p_totle, p_token FROM mining_data WHERE block=8573463 GROUP BY p_token) t2 ON t2.p_token=m.p_token
LEFT JOIN (SELECT IF(SUM(swp_awards)+2000<=3000, 2000, IF(3000-SUM(swp_awards)<=0,0,3000-SUM(swp_awards))) curr_award FROM mining_data WHERE block<8573463) t3 ON 1=1
WHERE m.block=8573463 AND s.verified = 1

UPDATE mining_data m LEFT JOIN token_supply s ON m.p_token=s.token and m.block=s.block
LEFT JOIN (SELECT SUM(pool_usdt) all_pool FROM token_supply WHERE block=8573463 AND verified = 1) t1 ON 1=1
LEFT JOIN (SELECT SUM(p_awards) new_p_totle, p_token FROM mining_data WHERE block=8573463 GROUP BY p_token) t2 ON t2.p_token=m.p_token
LEFT JOIN (SELECT IF(SUM(swp_awards)+2000<=3000, 2000, IF(3000-SUM(swp_awards)<=0,0,3000-SUM(swp_awards))) curr_award FROM mining_data WHERE block<8573463) t3 ON 1=1
SET m.swp_awards = IF(all_pool=0, 0, FLOOR(curr_award*pool_usdt/all_pool*(p_balance+p_unclaimed+p_awards)/(supply+new_p_totle)))
WHERE m.block=8573463 AND s.verified = 1
 */

async function miningToken(block_list, awards, max_supply) {
    // awards, max_supply 直接拼入字符串中，否则有精度问题
    let sql_pToken = "UPDATE mining_data m LEFT JOIN token_supply s ON m.s_token=s.token and m.block=s.block " +
        "LEFT JOIN (SELECT p_token token,IF(SUM(p_awards)+"+awards+"<="+max_supply+", "+awards+", IF("+max_supply+"-SUM(p_awards)<=0,0,"+max_supply+"-SUM(p_awards))) curr_award FROM mining_data WHERE block<? GROUP BY p_token) t ON p_token=t.token " +
        "SET m.p_awards = IF(supply IS NULL, 0, FLOOR(CAST(s_balance AS DECIMAL(65,30))/supply*IF(curr_award IS NULL, "+awards+", curr_award)*0.85)) " +
        "WHERE m.block=?";
    let sql_Sys = "INSERT INTO mining_data (cycle, block, addr, s_token, p_token, p_awards) " +
        "SELECT cycle, block, ?, s_token, p_token,(IF(curr_award IS NULL, "+awards+", curr_award)-sum(p_awards)) awards FROM mining_data " +
        "LEFT JOIN (SELECT p_token token,IF(SUM(p_awards)+"+awards+"<="+max_supply+", "+awards+", IF("+max_supply+"-SUM(p_awards)<=0,0,"+max_supply+"-SUM(p_awards))) curr_award FROM mining_data WHERE block<? GROUP BY p_token) t ON p_token=t.token " +
        "WHERE block=? AND p_awards>0 AND addr<>? GROUP BY cycle, block, s_token, p_token,curr_award " +
        "ON DUPLICATE KEY UPDATE p_awards=VALUES(p_awards)";
    let sql_unclaimed = "UPDATE mining_data m LEFT JOIN ( SELECT addr,token,SUM(amount) unclaimed FROM ( " +
        "SELECT addr,p_token token,SUM(p_awards) amount FROM mining_data WHERE block<? GROUP BY addr,p_token UNION ALL " +
        "SELECT addr,token,SUM(-amount) amount FROM block_chain_claim WHERE block<? GROUP BY addr,token ) x GROUP BY addr,token " +
        ") t ON m.addr=t.addr AND m.p_token=t.token SET m.p_unclaimed=t.unclaimed WHERE m.block=? AND t.unclaimed IS NOT NULL";

    let sql_SWP = "UPDATE mining_data m LEFT JOIN token_supply s ON m.p_token=s.token and m.block=s.block " +
        "LEFT JOIN (SELECT SUM(pool_usdt) all_pool FROM token_supply WHERE block=? AND verified = 1) t1 ON 1=1 " +
        "LEFT JOIN (SELECT SUM(p_awards) new_p_totle, p_token FROM mining_data WHERE block<=? GROUP BY p_token) t2 ON t2.p_token=m.p_token " +
        "LEFT JOIN (SELECT IF((SUM(swp_awards)+"+awards+"<="+max_supply+" OR SUM(swp_awards) IS NULL), "+awards+", IF("+max_supply+"-SUM(swp_awards)<=0,0,"+max_supply+"-SUM(swp_awards))) curr_award FROM mining_data WHERE block<?) t3 ON 1=1 " +
        "SET m.swp_awards = IF(all_pool=0, 0, ROUND(ROUND(CAST(curr_award AS DECIMAL(65,30))*pool_usdt/all_pool*(p_balance+p_unclaimed+p_awards)/new_p_totle*10-5.5)/10)) " +
        "WHERE m.block=? AND s.verified = 1";

    await co(function*() {
        for (let i = 0;i<block_list.length;i++) {
            let block = block_list[i];
            // 计算每个块的pToken奖励
            let rows = yield conn.query(sql_pToken, [block, block]);
            console.log("miningPT  1 PT : block=", block, rows.message);

            // 修正每次的数量，余额全部转入管理账户
            rows = yield conn.query(sql_Sys, [global.ADDRESS_COMMUNITY, block, block, global.ADDRESS_COMMUNITY]);
            console.log("miningSys 2 Sys: block=", block, rows.message);

            // 更新待领取数量
            rows = yield conn.query(sql_unclaimed, [block, block, block]);
            console.log("miningSys 3 Unclaime: block=", block, rows.message);

            // SWP挖矿
            rows = yield conn.query(sql_SWP, [block, block, block, block]);
            console.log("miningSWP 4 SWP: block=", block, rows.message);
        }
    });
}
// 创建周期奖励
async function creatCycleReward(cycle) {
    let sql_clean = "DELETE FROM cycle_reward WHERE cycle=?";
    let sql_pToken = "INSERT INTO cycle_reward (cycle,addr,token,amount) " +
        "SELECT cycle,addr,p_token,SUM(p_awards) FROM mining_data m WHERE cycle=? AND p_awards>0 GROUP BY cycle,addr,p_token";
    let sql_swp = "INSERT INTO cycle_reward (cycle,addr,token,amount) " +
        "SELECT cycle,addr,?,SUM(swp_awards) FROM mining_data m WHERE cycle=? AND swp_awards>0 GROUP BY cycle,addr";
    // 更新账户类型
    let sql_type = "UPDATE cycle_reward c LEFT JOIN addr_type a ON a.addr=c.addr SET c.type=a.type";

    await co(function*() {
        // 清空本周期数据
        let rows = yield conn.query(sql_clean, [cycle]);

        // 计算PairToken奖励
        rows = yield conn.query(sql_pToken, [cycle]);
        console.log("creatCycleReward  PT: cycle=", cycle, rows.message);

        // 计算SWP奖励
        rows = yield conn.query(sql_swp, [global.CONTRACT_SWP, cycle]);
        console.log("creatCycleReward SWP: cycle=", cycle, rows.message);

        rows = yield conn.query(sql_type, null);
        console.log("creatCycleReward : updateCycleType", rows.message);
    });
}

// 获取奖励周期列表
async function getCycleRewardReport(cycle) {
    // 获取奖励周期每个币种的发行量，注意数量转为字符串：CONCAT
    let sql_total = "SELECT token,CONCAT(SUM(amount)) total FROM cycle_reward WHERE cycle=? AND type=0 GROUP BY token ORDER BY token";
    // 获取奖励周期账户列表，注意使用相同的排序
    let sql_detail = "SELECT token,addr,CONCAT(amount) amount FROM cycle_reward WHERE cycle=? AND type=0 ORDER BY token,amount";

    var tokens = await conn.query(sql_total, [cycle]);
    var rows = await conn.query(sql_detail, [cycle]);

    var token_list = [];
    var n=0;
    for (let i=0; i<tokens.length; i++) {
        var ti = {
            token: tokens[i].token,
            total: tokens[i].total.toString(),
            addrs: {}
        };
        while (n<rows.length && rows[n].token==ti.token) {
            ti.addrs[rows[n].addr] = rows[n].amount.toString();
            n++;
        }
        token_list.push(ti);
    }
    console.log('getCycleRewardReport :', rows.length);

    return token_list;
}
/*

 */
// 更新地址类型
async function checkCycleData() {
    var sql_list = [];

    // 1、每个币种的总奖励 <= 总发行量（570万）
    sql_list[0] = 'SELECT token,SUM(amount)>'+global.MAX_SUPPLY+' assert FROM cycle_reward GROUP BY token';

    // 2、每个币种的本周期奖励 <= 本周期最大奖励（19.2万）
    sql_list[1] = 'SELECT cycle,token,SUM(amount)>('+global.MAX_SUPPLY+'/30) assert FROM cycle_reward GROUP BY cycle,token';

    // 3、每个币种的总领取数量 <= 当前总发行量
    sql_list[2] = 'SELECT token,SUM(amount)>'+global.MAX_SUPPLY+' assert FROM block_chain_claim GROUP BY token';

    for (let i=0; i<sql_list.length; i++) {
        let sql = 'SELECT SUM(assert) assert FROM ( '+sql_list[i]+') t';
        let rows = await conn.query(sql, null);
        let assert = (rows[0].assert<=0);
        console.log('checkCycleData : check ', i+1, assert);

        if (!assert) {
            sql = 'SELECT * FROM ( '+sql_list[i]+') t WHERE t.assert>0';
            rows = await conn.query(sql);
            console.log('checkCycleData : fail', rows.length,'\n', sql_list[i],'\n',rows);
        }
    }
}




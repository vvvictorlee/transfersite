//引入数据库
var mysql = require('mysql');
var wrapper = require('co-mysql');
var co = require('co');
require('./conf/const');


module.exports = {
    addTokenList,
    addBlockDataList,
    addPoolBlockData,
    getAllTokens,
    addSnapshotBlock,
    addAllTokenSupply,
    updatPoolUSDT,
    updatVerified,
    initMiningData,
    miningToken
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

async function getAllTokens(callback) {
    let sql = "SELECT sToken,pToken FROM token_list";
    await conn.query(sql, null).then(function (rows) {
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

// ----- Snapshot -----
// 生成某个奖励周期的快照持币地址情况
async function addSnapshotBlock(cycle, block_list) {
    let sql = "INSERT INTO snapshot_block (cycle, block, addr, token, balance) SELECT ?, ?, Addr,token,sum(amount) balance2 FROM ( " +
        "(SELECT toAddr Addr, token,sum(amount) amount FROM block_chain_data WHERE block<=? GROUP BY toAddr,token) UNION ALL " +
        "(SELECT fromAddr Addr, token,sum(-amount) amount FROM block_chain_data WHERE block<=? GROUP BY fromAddr,token) " +
        ") t WHERE Addr<>'0x0000000000000000000000000000000000000000' GROUP BY Addr,token ON DUPLICATE KEY UPDATE balance=VALUES(balance)";

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
SET m.swp_awards = FLOOR(curr_award*pool_usdt/all_pool*(p_balance+p_unclaimed+p_awards)/(supply+new_p_totle))
WHERE m.block=8573463 AND s.verified = 1
 */
async function miningToken(block_list, awards, max_supply) {
    // awards, max_supply 直接拼入字符串中，否则有精度问题
    let sql_pToken = "UPDATE mining_data m LEFT JOIN token_supply s ON m.s_token=s.token and m.block=s.block " +
        "LEFT JOIN (SELECT p_token token,IF(SUM(p_awards)+"+awards+"<="+max_supply+", "+awards+", IF("+max_supply+"-SUM(p_awards)<=0,0,"+max_supply+"-SUM(p_awards))) curr_award FROM mining_data WHERE block<? GROUP BY p_token) t ON p_token=t.token " +
        "SET m.p_awards = IF(supply IS NULL, 0, FLOOR(s_balance/supply*IF(curr_award IS NULL, "+awards+", curr_award)*0.85)) " +
        "WHERE m.block=?";
    let sql_Sys = "INSERT INTO mining_data (cycle, block, addr, s_token, p_token, p_awards)  " +
        "SELECT cycle, block, ?, s_token, p_token,(IF(curr_award IS NULL, "+awards+", curr_award)-sum(p_awards)) awards FROM mining_data " +
        "LEFT JOIN (SELECT p_token token,IF(SUM(p_awards)+"+awards+"<="+max_supply+", "+awards+", IF("+max_supply+"-SUM(p_awards)<=0,0,"+max_supply+"-SUM(p_awards))) curr_award FROM mining_data WHERE block<? GROUP BY p_token) t ON p_token=t.token " +
        "WHERE block=? AND p_awards>0 GROUP BY cycle, block, s_token, p_token " +
        "ON DUPLICATE KEY UPDATE p_awards=VALUES(p_awards)";

    let sql_SWP = "UPDATE mining_data m LEFT JOIN token_supply s ON m.p_token=s.token and m.block=s.block " +
        "LEFT JOIN (SELECT SUM(pool_usdt) all_pool FROM token_supply WHERE block=? AND verified = 1) t1 ON 1=1 " +
        "LEFT JOIN (SELECT SUM(p_awards) new_p_totle, p_token FROM mining_data WHERE block=? GROUP BY p_token) t2 ON t2.p_token=m.p_token " +
        "LEFT JOIN (SELECT IF(SUM(swp_awards)+"+awards+"<="+max_supply+", "+awards+", IF("+max_supply+"-SUM(swp_awards)<=0,0,"+max_supply+"-SUM(swp_awards))) curr_award FROM mining_data WHERE block<?) t3 ON 1=1 " +
        "SET m.swp_awards = FLOOR(curr_award*pool_usdt/all_pool*(p_balance+p_unclaimed+p_awards)/(supply+new_p_totle)) " +
        "WHERE m.block=? AND s.verified = 1";

    await co(function*() {
        for (let i = 0;i<block_list.length;i++) {
            let block = block_list[i];
            // 计算每个块的pToken奖励
            let rows = yield conn.query(sql_pToken, [block, block]);
            console.log("miningPT  1: block=", block, rows.message);

            // 修正每次的数量，余额全部转入管理账户
            rows = yield conn.query(sql_Sys, [global.ADDRESS_COMMUNITY, block, block]);
            console.log("miningSys 2: block=", block, rows.message);

            // SWP挖矿
            rows = yield conn.query(sql_SWP, [block, block, block, block]);
            console.log("miningSWP 3: block=", block, rows.message);
        }
    });
}


require('dotenv').config();

//引入数据库
var mysql = require('mysql');
var wrapper = require('co-mysql');


module.exports = {
    updateClaimStatusByAddress,
    getRewardListByAddress,
    getCycleRewardsByAddress,
};

const DB_CONFIG = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

//实现本地链接
var pool = mysql.createPool(DB_CONFIG);
var conn = wrapper(pool);

// 获取指定账户地址奖励列表
async function updateClaimStatusByAddress(address, contract) {
    // 获取奖励周期每个币种的发行量，注意数量转为字符串：CONCAT
    let sql_total = "SELECT  min(cycle) mincycle ,max(cycle) maxcycle,token  FROM cycle_reward WHERE addr=?  AND flag=0 GROUP BY token ORDER BY token";

    let tokens = await conn.query(sql_total, [address]);

    let token_list = [];
    for (let i = 0; i < tokens.length; i++) {
        const mincycle = tokens[i].mincycle;
        const maxcycle = tokens[i].maxcycle;
        const token = tokens[i].token;
        const results = await contract.methods.claimStatus(address, token, mincycle, maxcycle).call({ from: address });
        for (let j = 0; j < results.length; j++) {
            if (results[j]) {
                //claimed
                token_list.push([address, mincycle + j, token]);
            }
        }
    }
    console.log('getUnclaimedRewardListByAddress', token_list.length);

    let sql_update = "update cycle_reward SET flag=1 WHERE addr=? AND cycle=? AND token=? AND flag=0 ";

    for (let i = 0; i < token_list.length; i++) {
        let result = await conn.query(sql_update, token_list[i]);
        // console.log('updateClaimStatusByAddress', result);
    }
}

// 获取指定账户地址奖励列表
async function getRewardListByAddress(address, token_symbols, web3) {
    // 获取奖励周期每个币种的发行量，注意数量转为字符串：CONCAT
    let sql_total = "SELECT token,CONCAT(SUM(amount)) total FROM cycle_reward WHERE addr=?  AND flag=0 GROUP BY token ORDER BY token";

    let tokens = await conn.query(sql_total, [address]);

    let token_list = [];
    for (let i = 0; i < tokens.length; i++) {
        let ti = {
            name: token_symbols[tokens[i].token] || "UNKNOWN",
            address: tokens[i].token,
            value: web3.utils.fromWei(tokens[i].total.toString()),
        };

        token_list.push(ti);
    }
    console.log('getRewardListByAddress', token_list.length);

    return token_list;
}


// 获取奖励周期列表
async function getCycleRewardsByAddress(address) {
    let sql_detail = "SELECT cycle,token,CONCAT(amount) amount FROM cycle_reward WHERE addr=? AND flag=0 ORDER BY cycle,token";

    var rows = await conn.query(sql_detail, [address]);

    var cycle_tokens = {};
    var n = 0;
    let cycle = 0;
    for (let i = 0; i < rows.length; i++) {
        cycle = rows[i].cycle;
        if (!cycle_tokens.hasOwnProperty(cycle)) {
            cycle_tokens[cycle] = [];
        }
        let ti = {
            token: rows[i].token,
            balance: rows[i].amount.toString(),
        };
        console.log(ti);
        cycle_tokens[cycle].push(ti);
    }
    console.log('getCycleRewardsByAddress :', rows.length);

    return [rows.length,cycle_tokens];
}




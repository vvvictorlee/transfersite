require('dotenv').config();

//引入数据库
var mysql = require('mysql');
var wrapper = require('co-mysql');


module.exports = {
    getSwpTotalByPToken,
    getUnclaimedSwpByAddress
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


// 获取奖励
async function getSwpTotalByPToken() {
    let sql_detail = "SELECT p_token,CONCAT(SUM(swp_awards)) amount FROM mining_data where cycle=(select max(cycle) from  mining_data) group by p_token;";

    var rows = await conn.query(sql_detail, null);

    var cycle_tokens = {};
    for (let i = 0; i < rows.length; i++) {
        cycle_tokens[rows[i].p_token] = rows[i].amount.toString();
    }
    console.log('getSwpTotalByPToken :', rows.length);

    return cycle_tokens;
}



// 获取指定账户地址未领取SWP奖励
async function getUnclaimedSwpByAddress(addr) {
    let sql_detail = "SELECT CONCAT(SUM(amount)) amount FROM cycle_reward where  addr = ? and flag=0 and type=0;";

    var rows = await conn.query(sql_detail, [addr]);

    var amount = "0";
    if (rows.length > 0) {
       amount = rows[0].amount.toString();
    }

    return amount;
}


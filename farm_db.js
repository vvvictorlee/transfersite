require('dotenv').config();

//引入数据库
var mysql = require('mysql');
var wrapper = require('co-mysql');


module.exports = {
    getSwpTotalByPToken
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
    let sql_detail = "SELECT p_token,sum(swp_awards) amount FROM eth_data_ropsten.mining_data where cycle=(select max(cycle) from  eth_data_ropsten.mining_data) group by p_token;";

    var rows = await conn.query(sql_detail, null);

    var cycle_tokens = {};
    for (let i = 0; i < rows.length; i++) {
        cycle_tokens[rows[i].p_token] = rows[i].amount.toString();
    }
    console.log('getSwpTotalByPToken :', rows.length);

    return cycle_tokens;
}




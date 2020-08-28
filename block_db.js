//引入数据库
var mysql=require('mysql');
async = require("async");
// Step = require("Step");
require('./conf/const');


var db_config = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'eth_data'
}

const TABLE_TOKEN_LIST = "token_list";


module.exports = {
    add_block_data,
    add_pool_block_data,
    add_token_list,
    get_all_Tokens,
    addSnapshotBlock,
    addAllTokenSupply,
    updatPoolUSDT,
    initMiningData,
    miningPairToken,
    miningSWP
};

//实现本地链接
// var connection = mysql.createConnection(db_config);
var pool = mysql.createPool(db_config);

function querySQL(sql, post, callback) {
    pool.getConnection(function(err,connection){
        if(err){
            callback(err,null,null);
        }else{
            connection.query(sql, post, function(qerr,vals,fields){
                connection.release();
                callback(qerr,vals,fields);
            });
        }
    });
};
let querySync = function(sql, values) {
    // 返回一个 Promise
    return new Promise(( resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, ( err, rows) => {
                    if (err) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    // 结束会话
                    connection.release()
                })
            }
        })
    })
}
function querySQLSync (path,id,param,sqlWhere,res){
    var promise = new Promise(function (resolve, reject) {
        var sql = getFileSql(path,id,param,sqlWhere);
        var mysql = dbHelper.getMysql();
        mysql.query({
            sql: sql
        }, function (err, rows) {
            res.end(JSON.stringify(rows));
            resolve(rows);//关键
        });
    });
    // promise.then(function (value) {
    //     console.log(value);
    //     return value;
    // }, function (value) {});
    // return promise;
};




// 查找
function select() {
    db_connect();

    connection.query('SELECT * FROM token_list', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is:', results);
    });

    db_close();
}

// Add Token List
function add_token_list(dataList) {
    let sql = "INSERT IGNORE INTO token_list(block,sToken,pToken,token0,token1) VALUES ? ";
    query = querySQL(sql, [dataList], function (error, results, fields) {
        if (error) throw error;
    });
}

function get_all_Tokens(callback) {
    let sql = "SELECT sToken,pToken FROM token_list";
    query = querySQL(sql, null, function (error, results, fields) {
        if (error) throw error;
        let list = [];
        for (var i = 0; i < results.length; i++) {
            list.push(results[i].sToken);
            list.push(results[i].pToken);
        }
        // var json = JSON.parse(JSON.stringify(results));
        callback(list);
    });
}

// Add Token List
function add_block_data(dataList) {
    if (dataList.length==0) return;

    let sql = "INSERT IGNORE INTO block_chain_data(block,txnHash,fromAddr,toAddr,amount,eventName,token) VALUES ? ";
    query = querySQL(sql, [dataList], function (error, results, fields) {
        if (error) throw error;
    });
}
function add_pool_block_data(dataList) {
    if (dataList.length==0) return;

    let sql = "INSERT IGNORE INTO block_chain_pool(block,txnHash,reserve0,reserve1,eventName,token) VALUES ? ";
    query = querySQL(sql, [dataList], function (error, results, fields) {
        if (error) throw error;
    });
}
// ----- Snapshot -----
function addSnapshotBlock(cycle, block) {
    let sql = "INSERT INTO snapshot_block (cycle, block, addr, token, balance) SELECT ?, ?, Addr,token,sum(amount) balance2 FROM ( " +
        "(SELECT toAddr Addr, token,sum(amount) amount FROM block_chain_data WHERE block<=? GROUP BY toAddr,token) UNION ALL " +
        "(SELECT fromAddr Addr, token,sum(-amount) amount FROM block_chain_data WHERE block<=? GROUP BY fromAddr,token) " +
        ") t WHERE Addr<>'0x0000000000000000000000000000000000000000' GROUP BY Addr,token ON DUPLICATE KEY UPDATE balance=VALUES(balance)";
    query = querySQL(sql, [cycle, block, block, block], function (error, results, fields) {
        if (error) throw error;
    });
}

// 更新每个区块的发行量
function addAllTokenSupply(startBlock) {
    let sql = "INSERT INTO token_supply (block, token, supply) " +
        "SELECT block, token, sum(balance) FROM snapshot_block WHERE block>=? GROUP BY cycle, block, token " +
        "ON DUPLICATE KEY UPDATE supply=VALUES(supply)";
    query = querySQL(sql, [startBlock], function (error, results, fields) {
        if (error) throw error;
        console.log("addAllTokenSupply : start=", startBlock, results.message);
    });
}

// 更新每个区块的USDT存量
function updatPoolUSDT(block, usdt_addr) {
    let sql = "INSERT INTO token_supply (block, token, pool_usdt) " +
        "SELECT ?, t.pToken, IF(t.token0=?, p.reserve0, IF(t.token1=?, p.reserve1, 0)) usdt FROM " +
        "(SELECT token, max(block) block FROM block_chain_pool WHERE block<=? GROUP BY token) m " +
        "LEFT JOIN block_chain_pool p ON p.token=m.token AND p.block=m.block " +
        "LEFT JOIN token_list t ON p.token=t.sToken " +
        "ON DUPLICATE KEY UPDATE pool_usdt=VALUES(pool_usdt)";
    query = querySQL(sql, [block, usdt_addr, usdt_addr, block], function (error, results, fields) {
        if (error) throw error;
    });
}

// ----- Mining -----

function initMiningData(block) {
    let sql_S = "INSERT INTO mining_data (cycle, block, addr, s_token, s_balance, p_token) " +
        "SELECT cycle, t.block, addr, sToken, balance, pToken FROM snapshot_block t LEFT JOIN token_list ON sToken=token " +
        "WHERE t.block>=? AND sToken IS NOT NULL ON DUPLICATE KEY UPDATE s_balance=VALUES(s_balance)";
    let sql_P = "INSERT INTO mining_data (cycle, block, addr, s_token, p_balance, p_token) " +
        "SELECT cycle, t.block, addr, sToken, balance, pToken FROM snapshot_block t LEFT JOIN token_list ON pToken=token \n" +
        "WHERE t.block>=? AND pToken IS NOT NULL ON DUPLICATE KEY UPDATE p_balance=VALUES(p_balance)";
    query = querySQL(sql_S, [block], function (error, results, fields) {
        if (error) throw error;
        query = querySQL(sql_P, [block], function (error, results, fields) {
            if (error) throw error;
            console.log("initMiningData : block=", block, results.message);
        });
    });
}

/*
SELECT cycle,m.block,addr,p_token,p_awards,IF(supply IS NULL, 0, FLOOR(s_balance/supply*IF(curr_award IS NULL, 2000, curr_award)*0.85)) aa, curr_award FROM
-- UPDATE
mining_data m LEFT JOIN token_supply s ON m.s_token=s.token and m.block=s.block
LEFT JOIN (SELECT p_token token,IF(SUM(p_awards)+2000<=5000, 2000, IF(5000-SUM(p_awards)<=0,0,5000-SUM(p_awards))) curr_award FROM mining_data WHERE block<8573463 GROUP BY p_token) t ON p_token=t.token
-- SET m.p_awards = IF(supply IS NULL, 0, FLOOR(s_balance/supply*IF(curr_award IS NULL, 2000, curr_award)*0.85))
WHERE m.block=8573463
 */
/*
INSERT INTO mining_data (cycle, block, addr, s_token, p_token, p_awards)
SELECT cycle, block, '0xAdmin', s_token, p_token,(IF(curr_award IS NULL, 2000, curr_award)-sum(p_awards)) awards FROM mining_data
LEFT JOIN (SELECT p_token token,IF(SUM(p_awards)+2000<=5000, 2000, IF(5000-SUM(p_awards)<=0,0,5000-SUM(p_awards))) curr_award FROM mining_data WHERE block<8573463 GROUP BY p_token) t ON p_token=t.token
WHERE block=8573463 AND p_awards>0
GROUP BY cycle, block, s_token, p_token
ON DUPLICATE KEY UPDATE p_awards=VALUES(p_awards)
 */
function miningPairToken(block, awards, max_supply) {
    let sql_P = "UPDATE mining_data m LEFT JOIN token_supply s ON m.s_token=s.token and m.block=s.block " +
        "LEFT JOIN (SELECT p_token token,IF(SUM(p_awards)+"+awards+"<="+max_supply+", "+awards+", IF("+max_supply+"-SUM(p_awards)<=0,0,"+max_supply+"-SUM(p_awards))) curr_award FROM mining_data WHERE block<? GROUP BY p_token) t ON p_token=t.token " +
        "SET m.p_awards = IF(supply IS NULL, 0, FLOOR(s_balance/supply*IF(curr_award IS NULL, "+awards+", curr_award)*0.85)) " +
        "WHERE m.block=?";
    let sql_Sys = "INSERT INTO mining_data (cycle, block, addr, s_token, p_token, p_awards)  " +
        "SELECT cycle, block, ?, s_token, p_token,(IF(curr_award IS NULL, "+awards+", curr_award)-sum(p_awards)) awards FROM mining_data " +
        "LEFT JOIN (SELECT p_token token,IF(SUM(p_awards)+"+awards+"<="+max_supply+", "+awards+", IF("+max_supply+"-SUM(p_awards)<=0,0,"+max_supply+"-SUM(p_awards))) curr_award FROM mining_data WHERE block<? GROUP BY p_token) t ON p_token=t.token " +
        "WHERE block=? AND p_awards>0 GROUP BY cycle, block, s_token, p_token " +
        "ON DUPLICATE KEY UPDATE p_awards=VALUES(p_awards)";
    query = querySQL(sql_P, [block, block], function (error, results, fields) {
        if (error) throw error;
        // 修正每次的数量，余额全部转入管理账户
        query = querySQL(sql_Sys, [global.ADDRESS_COMMUNITY, block, block], function (error, results, fields) {
            if (error) throw error;
            console.log("miningPairToken : e2 block=", block, results.message);
            // resolve("");
        });
    });
}

/*
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
function miningSWP(block, awards, max_supply) {
    // 直接拼入字符串中，否则有精度问题
    let sql_SWP = "UPDATE mining_data m LEFT JOIN token_supply s ON m.p_token=s.token and m.block=s.block " +
        "LEFT JOIN (SELECT SUM(pool_usdt) all_pool FROM token_supply WHERE block=? AND verified = 1) t1 ON 1=1 " +
        "LEFT JOIN (SELECT SUM(p_awards) new_p_totle, p_token FROM mining_data WHERE block=? GROUP BY p_token) t2 ON t2.p_token=m.p_token " +
        "LEFT JOIN (SELECT IF(SUM(swp_awards)+"+awards+"<="+max_supply+", "+awards+", IF("+max_supply+"-SUM(swp_awards)<=0,0,"+max_supply+"-SUM(swp_awards))) curr_award FROM mining_data WHERE block<?) t3 ON 1=1 " +
        "SET m.swp_awards = FLOOR(curr_award*pool_usdt/all_pool*(p_balance+p_unclaimed+p_awards)/(supply+new_p_totle)) " +
        "WHERE m.block=? AND s.verified = 1";
    query = querySQL(sql_SWP, [block, block, block, block], function (error, results, fields) {
        if (error) throw error;
        console.log("miningSWP block : "+block);
    });
}

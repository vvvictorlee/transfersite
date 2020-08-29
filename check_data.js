var block_db = require('./block_db');

(async function () {
    // 数据检查
    block_db.checkCycleData();
})();

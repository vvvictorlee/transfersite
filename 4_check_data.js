var block_db = require('./block_db');
// require('./conf/const');
require('./conf/const_ropsten');

(async function () {
    // 数据检查
    block_db.checkCycleData(global.BLOCK_AWARDS, global.MAX_SUPPLY, global.BLOCK_AWARDS_SWP, global.MAX_SUPPLY_SWP, global.CONTRACT_SWP);
})();

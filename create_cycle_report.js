var block_db = require('./block_db');
var util = require('./util');
var fs = require('fs');

function getFileName(cycle, token, total) {
    // 上传名单文件名格式：周期_totals_代币地址.json
    return 'reports/CR_'+cycle+'/'+cycle+'_'+total+'_'+token+'.json'
}

function createReport(cycle) {
    (async function () {
        let token_list = await block_db.getCycleRewardReport(cycle);

        util.checkPath('reports/CR_'+cycle);

        for(let i=0; i<token_list.length; i++) {
            let token = token_list[i];
            util.writeFile(getFileName(cycle, token.token, token.total), token.addrs);
        }

        console.log('createReport :', token_list.length);
    })();
}


createReport(2);
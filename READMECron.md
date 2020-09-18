


const cron = require('node-cron')
async function runJob() {
    /**
     * 基本使用
     * 第一個參數：排成格式
     * 第二個參數：要執行的 function
     * 第三個參數：是否要立即執行
     **/
    let task = cron.schedule('* * * * * *', function () {
        console.log('hello world', counter, new Date().getSeconds())
    }, true)

    task.start()
    task.stop()
    task.destroy()

    /**
     * 檢驗是否是有效的排程格式
     **/
    cron.validate('* * * * * *')

    // cron-table


    // /**
    //  * 一段時間後自動執行
    // **/
    // '* * * * * *'			// 每秒跑一次
    // '*/2 * * * *'			// 兩分鐘跑一次

    // /**
    //  * 特定時間執行
    //  **/
    // '1,3,4,5 * * * *'		// 每到分鐘數為 1, 3, 4, 5 時執行
    // '1-5 * * * *'			// 分鐘數為 1, 2, 3, 4, 5 時執行
    // 安裝
    // 1
    // $ npm install node-cron
}



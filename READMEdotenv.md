node -r dotenv/config example.js dotenv_config_path=<yourpath>/config/.env

不需要再开始引入 require('dotenv').config()
node -r dotenv/config example.js dotenv_config_path=<yourpath>/config/.env

const fs = require('fs')
const dotenv = require('dotenv')
const envConfig = dotenv.parse(fs.readFileSync('.env.test'))
for (const k in envConfig) {
process.env[k] = envConfig[k]
}

修改 script 命令
–inspect-brk 是打开 node 的 debugger 模式

"scripts": {
"start:dev": "node -r dotenv/config scripts/start.js dotenv_config_path=.env.dev",
"build:one": "node --inspect-brk -r dotenv/config scripts/build.js dotenv_config_path=.env.one",
"test": "node scripts/test.js"
},

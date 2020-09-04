
// global.HTTP_PROVIDER = "https://ropsten.infura.io/v3/afea481cd4da4deabd6d296e6509b601"; // 测试网RPC接口
global.HTTP_PROVIDER = "https://mainnet.infura.io/v3/afea481cd4da4deabd6d296e6509b601"; // RPC接口


global.CONTRACT_FACTORY = "0xbec1c22fa669bf17b9d2326beb9adce4fc697614"; // factory合约
global.CONTRACT_REDEEM = "0xef7920e4808e92724f438c572a38bc459463e09d"; // 领取合约

global.CONTRACT_SWP = "0xda3145d0a373712e036106fc1fa34b1014807e68"; // SWP合约
global.CONTRACT_USDT = "0xdac17f958d2ee523a2206206994597c13d831ec7"; // USDT合约

global.BLOCK_AWARDS =  '2000000000000000000000';
global.MAX_SUPPLY = '5760000000000000000000000'; // 精度18位*1000000000000000000

global.ADDRESS_COMMUNITY = '0xa4a4005a9497548427a141d53ad8869829fb9ec7';   // 社区收款账户，用于获取挖矿奖励
global.ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

// 数据配置
global.db_config = {
    host: 'localhost',
    user: 'root',
    password: 'p@ssw0rd',
    database: 'eth_data'
};
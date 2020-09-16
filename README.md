修改服务端口 .env  APP_PORT
后台

```
nohup node app.js &  
```
修改数据库连接信息
```
DB_HOST =localhost
DB_USER =swapxminer
DB_PASSWORD=p@ssw0rd
DB_DATABASE=eth_data_ropsten
```



### 1.1 获取SWP信息
#### 请求
##### 参数说明：
- method  方法名称 get_swp_info
##### 请求示例
```
curl  -X POST --url http://192.168.38.227:3535/farm/   -H "Content-Type: application/json"  -d '{
	"method": "get_swp_info"
}'


curl  -X POST --url https://farm-swapx.99ss.ml/farm/   -H "Content-Type: application/json"  -d '{
	"method": "get_swp_info"
}'
```
#### 应答
##### 数据说明
- price     SWP价格
- released  SWP已发行量
#####
```
{
	"price": 1.68,
	"released": "2000000000000000000000"
}
```


### 1.2 获取指定账户SWP余额
#### 请求
##### 参数说明：
- method  方法名称 get_swp_balance
- address 账户地址
##### 请求示例
```
curl  -X POST --url http://192.168.38.227:3535/farm/   -H "Content-Type: application/json"  -d '{
	"method": "get_swp_balance",
	"address": "0x72c09d4fd187b4336fa4ab66e4360f626619483b"
}'


curl  -X POST --url https://farm-swapx.99ss.ml/farm/   -H "Content-Type: application/json"  -d '{
	"method": "get_swp_balance",
	"address": "0x72c09d4fd187b4336fa4ab66e4360f626619483b"
}'
```
#### 应答
##### 数据说明
- balance   指定账户SWP余额
#####
```
{
	"balance": "0"
}
```

### 1.3 获取主网交易对信息
#### 请求
##### 参数说明：
- method  方法名称 get_pairs_info
##### 请求示例
```
curl  -X POST --url http://192.168.38.227:3535/farm/   -H "Content-Type: application/json"  -d '{
	"method": "get_pairs_info"
}'


curl  -X POST --url https://farm-swapx.99ss.ml/farm/   -H "Content-Type: application/json"  -d '{
	"method": "get_pairs_info"
}'
```
#### 应答
##### 数据说明
- token0     交易对第一个代币
- token1     交易对第二个代币
- reserve0   交易对第一个代币金额 最小单位
- reserve1   交易对第二代币金额 最小单位
- symbol0    交易对第一个代币 符号  小数位数  名称
- symbol1    交易对第二个代币 符号  小数位数  名称
#####
```
[{
	"token0": "0xDA3145d0A373712E036106FC1fa34b1014807e68",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "164169761998281385187513",
	"reserve1": "403789434959",
	"rate": 5,
	"symbol0": ["SWP", "18", "SwapX Token"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "1.3813"
}, {
	"token0": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "537721964530",
	"reserve1": "534984125327",
	"rate": 1,
	"symbol0": ["USDC", "6", "USD Coin"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.2763"
}, {
	"token0": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "818574440804415330512",
	"reserve1": "295011376304",
	"rate": 1,
	"symbol0": ["WETH", "18", "Wrapped Ether"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.2763"
}, {
	"token0": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "183375339736488280495494",
	"reserve1": "185053438913",
	"rate": 1,
	"symbol0": ["DAI", "18", "Dai Stablecoin"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.2763"
}, {
	"token0": "0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "15215284559850138648",
	"reserve1": "75427701597",
	"rate": 1,
	"symbol0": ["YFII", "18", "YFII.finance"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.2763"
}, {
	"token0": "0x04abEdA201850aC0124161F037Efd70c74ddC74C",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "1133079237635133744926102",
	"reserve1": "60463348736",
	"rate": 1,
	"symbol0": ["NEST", "18", "NEST"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.2763"
}, {
	"token0": "0xD46bA6D942050d489DBd938a2C909A5d5039A161",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "33400467869247",
	"reserve1": "25174457697",
	"rate": 1,
	"symbol0": ["AMPL", "9", "Ampleforth"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.2763"
}, {
	"token0": "0x47BeD2cdF27995e861B2E0c5ACd930C7E4AEFFe2",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "1305033751665788463857971",
	"reserve1": "19585438615",
	"rate": 1,
	"symbol0": ["BSB", "18", "BSBEXToken"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.2763"
}, {
	"token0": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "66213219143916152076861",
	"reserve1": "16530828173",
	"rate": 1,
	"symbol0": ["LRC", "18", "LoopringCoin V2"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.2763"
}, {
	"token0": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "1713160561538344917494",
	"reserve1": "7865403637",
	"rate": 1,
	"symbol0": ["SNX", "18", "Synthetix Network Token"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.2763"
}, {
	"token0": "0xC8D2AB2a6FdEbC25432E54941cb85b55b9f152dB",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "19203595861949617423750",
	"reserve1": "7308734739",
	"rate": 1,
	"symbol0": ["GRAP", "18", "GRAP"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.2763"
}, {
	"token0": "0xdc38a4846d811572452cB4CE747dc9F5F509820f",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "324519874680855797632",
	"reserve1": "4699488442",
	"rate": 1,
	"symbol0": ["SYFI", "18", "SimpleYFI Token"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.2763"
}, {
	"token0": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
	"token1": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
	"reserve0": "25001064581061",
	"reserve1": "9037",
	"rate": 1,
	"symbol0": ["WETH", "18", "Wrapped Ether"],
	"symbol1": ["USDC", "6", "USD Coin"],
	"apy": "0.2763"
}, {
	"token0": "0xDA3145d0A373712E036106FC1fa34b1014807e68",
	"token1": "0x04abEdA201850aC0124161F037Efd70c74ddC74C",
	"reserve0": "238",
	"reserve1": "4220",
	"rate": 1,
	"symbol0": ["SWP", "18", "SwapX Token"],
	"symbol1": ["NEST", "18", "NEST"],
	"apy": "0.2763"
}, {
	"token0": "0x054c816BBAD08b2D64De6B2cD38D9a89f04199A0",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "23013072145864848631069",
	"reserve1": "2492651852",
	"rate": 0,
	"symbol0": ["BDT", "18", "BiDaToken"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.0000"
}, {
	"token0": "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "1902974924755980142926",
	"reserve1": "1160814700",
	"rate": 0,
	"symbol0": ["LEND", "18", "EthLend Token"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.0000"
}, {
	"token0": "0x78A5B382B9A83Fe042A4F7eB2399d563FDa931C3",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "3526000",
	"reserve1": "1010000000",
	"rate": 0,
	"symbol0": ["HZT", "2", "heizuan token"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.0000"
}, {
	"token0": "0x40FD72257597aA14C7231A7B1aaa29Fce868F677",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "4680645948000000000",
	"reserve1": "390053829",
	"rate": 0,
	"symbol0": ["XOR", "18", "Sora Token"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.0000"
}, {
	"token0": "0x3F382DbD960E3a9bbCeaE22651E88158d2791550",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "100800000000000000000",
	"reserve1": "126000000",
	"rate": 0,
	"symbol0": ["GHST", "18", "Aavegotchi GHST Token"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.0000"
}, {
	"token0": "0xaB37e1358b639Fd877f015027Bb62d3ddAa7557E",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "3493959",
	"reserve1": "4991370",
	"rate": 0,
	"symbol0": ["LIEN", "8", "lien"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.0000"
}, {
	"token0": "0x83e0573F777ca0932f8CDDA2b0afa51789e8d6e0",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "2577000000000000000000",
	"reserve1": "2000000",
	"rate": 0,
	"symbol0": ["TAKE", "18", "TAKEOUT.finance"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.0000"
}, {
	"token0": "0xab95E915c123fdEd5BDfB6325e35ef5515F1EA69",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "636000000000000000000",
	"reserve1": "2000000",
	"rate": 0,
	"symbol0": ["XNN", "18", "XENON"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.0000"
}, {
	"token0": "0x9fBFed658919A896B5Dc7b00456Ce22D780f9B65",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "1000000000000000000",
	"reserve1": "120000",
	"rate": 0,
	"symbol0": ["PLT", "18", "PlutusDeFi"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.0000"
}, {
	"token0": "0x7591a309Df68bf43ba42dD11b0344220A260020A",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "1999671",
	"reserve1": "19800",
	"rate": 0,
	"symbol0": ["iDOL", "8", "iDOL"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.0000"
}, {
	"token0": "0x4Eeea7B48b9C3ac8F70a9c932A8B1E8a5CB624c7",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "2000000000000000000",
	"reserve1": "10000",
	"rate": 0,
	"symbol0": ["MBN", "18", "Membrana"],
	"symbol1": ["USDT", "6", "Tether USD"],
	"apy": "0.0000"
}]
```





```

curl  -X POST --url http://127.0.0.1:3535/farm/   -H "Content-Type: application/json"  -d '{
	"method": "get_swp_info"
}'


curl  -X POST --url http://127.0.0.1:3535/farm/   -H "Content-Type: application/json"  -d '{
	"method": "get_swp_balance",
	"address": "0xbec1c22fa669bf17b9d2326beb9adce4fc697614"
}'


curl  -X POST --url http://127.0.0.1:3535/farm/   -H "Content-Type: application/json"  -d '{
	"method": "get_pairs_info"
}'


curl  -X POST --url http://127.0.0.1:3535/farm/   -H "Content-Type: application/json"  -d '{
	"method": "get_pairtokens_info",
	"address": "0xbec1c22fa669bf17b9d2326beb9adce4fc697614"
}'

curl  -X POST --url http://127.0.0.1:3535/farm/   -H "Content-Type: application/json"  -d '{
	"method": "get_pairtokens_info"
}'


curl  -X POST --url http://127.0.0.1:3535/farm/   -H "Content-Type: application/json"  -d '{
	"method": "get_eth_pairs",
	"address": "0xbec1c22fa669bf17b9d2326beb9adce4fc697614"
}'



```
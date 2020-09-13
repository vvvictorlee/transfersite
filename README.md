修改服务端口 .env  APP_PORT
后台

```
nohup node app.js &  
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
	"token0": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "0",
	"reserve1": "0",
	"symbol0": ["SWP", "18", "Swapx Token"],
	"symbol1": ["USDT", "6", "Tether USD"]
}, {
	"token0": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "68497876999",
	"reserve1": "69939135154",
	"symbol0": ["USDC", "6", "USD Coin"],
	"symbol1": ["USDT", "6", "Tether USD"]
}, {
	"token0": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "127076212338491049429",
	"reserve1": "46384280975",
	"symbol0": ["WETH", "18", "Wrapped Ether"],
	"symbol1": ["USDT", "6", "Tether USD"]
}, {
	"token0": "0x04abEdA201850aC0124161F037Efd70c74ddC74C",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "515655248318954198600932",
	"reserve1": "31923206185",
	"symbol0": ["NEST", "18", "NEST"],
	"symbol1": ["USDT", "6", "Tether USD"]
}, {
	"token0": "0x47BeD2cdF27995e861B2E0c5ACd930C7E4AEFFe2",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "900218984255613191646760",
	"reserve1": "15169064081",
	"symbol0": ["BSB", "18", "BSBEXToken"],
	"symbol1": ["USDT", "6", "Tether USD"]
}, {
	"token0": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "13228114151118519241379",
	"reserve1": "13504145507",
	"symbol0": ["DAI", "18", "Dai Stablecoin"],
	"symbol1": ["USDT", "6", "Tether USD"]
}, {
	"token0": "0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "373267414950770637",
	"reserve1": "1440839239",
	"symbol0": ["YFII", "18", "YFII.finance"],
	"symbol1": ["USDT", "6", "Tether USD"]
}, {
	"token0": "0xdc38a4846d811572452cB4CE747dc9F5F509820f",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "133995681302500940759",
	"reserve1": "1127671629",
	"symbol0": ["SYFI", "18", "SimpleYFI Token"],
	"symbol1": ["USDT", "6", "Tether USD"]
}, {
	"token0": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "4564586842946243751392",
	"reserve1": "1000000000",
	"symbol0": ["LRC", "18", "LoopringCoin V2"],
	"symbol1": ["USDT", "6", "Tether USD"]
}, {
	"token0": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "181770607384324442704",
	"reserve1": "778745031",
	"symbol0": ["SNX", "18", "Synthetix Network Token"],
	"symbol1": ["USDT", "6", "Tether USD"]
}, {
	"token0": "0xD46bA6D942050d489DBd938a2C909A5d5039A161",
	"token1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	"reserve0": "596456475208",
	"reserve1": "500000000",
	"symbol0": ["AMPL", "9", "Ampleforth"],
	"symbol1": ["USDT", "6", "Tether USD"]
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



```
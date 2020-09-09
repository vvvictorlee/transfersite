修改服务端口 .env  APP_PORT
后台

```
nohup node app.js &  
```

### 部署注意事项
#### admin_secrets
admin private key不在git 里，
需要在手动创建文件 data/secrets.json，放private key
json 内容格式   {"key":""}

#### mysql 新用户
在ubuntu nodejs 连接mysql 不能用root连接 ，需要创建新用户 sql 如下
```
CREATE USER 'swapxminer'@'%' IDENTIFIED BY 'p@ssw0rd';
```

授予所有权限
```
GRANT ALL PRIVILEGES ON *.* TO 'swapxminer'@'%' WITH GRANT OPTION;
```


## 6 领取收益接口

### 6.1 获取指定账户收益列表
#### 请求
##### 参数说明：
- method  方法名称 get_reward_list
- address 提供流动性的账户地址
##### 请求示例
```
curl  -X POST --url http://192.168.38.227:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "get_reward_list",
	"address": "0x1084d79A66EF86BFc9c945d4a21159a024dEE14e"
}'


curl  -X POST --url https://appswapx.99ss.ml/claim/  -H "Content-Type: application/json"  -d '{
 "method": "get_reward_list",
 "address": "0xf7076D986996d0DBD97D6799C2Ec2adC2975CefB"
}'
```
#### 应答
##### 数据说明
- name  代币符号名称
- address 代币合约地址
- value   代币领取收益金额
##### 应答示例
```
[{
	"name": "TLTBTBTCX",
	"address": "0x1df382c017c2aae21050d61a5ca8bc918772f419",
	"value": "0.000000000000002"
}, {
	"name": "TLTATBTCX",
	"address": "0x4cf4d866dcc3a615d258d6a84254aca795020a2b",
	"value": "0.000000000000003"
}, {
	"name": "TLTDTBTCX",
	"address": "0x6c50d50fafb9b42471e1fcabe9bf485224c6a199",
	"value": "0.000000000000004"
}, {
	"name": "TLTCTBTCX",
	"address": "0x71805940991e64222f75cc8a907353f2a60f892e",
	"value": "0.000000000000001"
}]
```

### 6.2 提交领取指定账户收益
#### 请求
##### 参数说明：
- method  方法名称 claim_all_rewards
- address 提供流动性的账户地址
##### 请求示例
```
curl  -X POST --url  http://192.168.38.227:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "claim_all_rewards",
	"address": "0x929378dbc9a1fdc0d05529e48097ff65c6902231"
}'

curl  -X POST --url  https://appswapx.99ss.ml/claim/  -H "Content-Type: application/json"  -d '{
	"method": "claim_all_rewards",
	"address": "0x1084d79A66EF86BFc9c945d4a21159a024dEE14e"
}'
```

#### 应答
##### 数据说明
- result  执行结果 成功success
- data  合约地址方法调用.编码ABI encodedABI（）获得用于sendTransaction data参数
##### 应答示例
```
{
	"result": "success",
	"data": [
		["1", "0x06403d9dc00b7cf577023d49f96f899aed86d6c0", "849999999999999915000", ["0x0badda19b347f0b15db105449d8672b3883ce72473914721dd8bf61ea396d8be", "0xa84a67e0121ba5fd44e2ed16f39882029bc2f3b970b99dfb60c86a8a3b0f67e6", "0x9fcf9615e449bcd29857d532ddc3690253cd13f2813d02a26bd6b4cb7c035025", "0xfbeab35daca2333e778d0f489449730fb16df3be4ad428c0d8d7594a2af895d3"]],
		["1", "0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5", "5099999999999999490000", ["0xdbe3c13ded62ab79d32b81c7257696a95f65bf3a47b16e3cfe6a7dc6f7937012", "0x06f84f12431c90111107f30c9625d6e870832409133460daf31933621b28dccf", "0xfc60d60805351b8a051565987bb612b18a5c759a8a79d875636392ddf0b6533d", "0x37d46ea9ba28347acde174b63d3ffa8a4e8b56adbba5866ba0eabe144ea21149"]],
		["1", "0xc5201589361c2da2b07df626f1cab71b4255b16e", "13326116107670796930250", ["0xb3225ee3d40be86be15975f8600016a588d94ec994caa4a27137b154c228c57f", "0x39e675a0fbbdc84e690aa56477659c7deebed8faea64f911c6ce386e4264f46c", "0x2d0ff114104c9726096197f01b5c845f71603a0bc36dfd9b5fba9f518fceffe4", "0xfbeab35daca2333e778d0f489449730fb16df3be4ad428c0d8d7594a2af895d3"]],
		["2", "0x06403d9dc00b7cf577023d49f96f899aed86d6c0", "77705359625718111774006", ["0xe4b7ad736dcc37e02df97e3825dca43b54aaa94f8dd6c71e71fc1c5fec9dc7bf", "0xffc1c60e44b81b9cba1a23372447b4f7614e4c2ece6c49949755480f0b589744", "0x4a21ea52ca13af3dc5b10fbb9d50646b48ce0ec21a5584fc186a8bbb2c74ec01", "0x3d00b8858f58efc9805110f02c582c351e3d27d2b2728e8661cdca2dc7267684"]],
		["2", "0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5", "159799999999999984020000", ["0x8809bcf4953b78333242386e43b58b7945a0d74eabb5adefc1d88d40cd8af3b7", "0xdf44f5e8cb1700395dfba78aaf22c2693fe4a61e3bec842cecbc2fce0989e82a", "0x65d21c6fdeecc72e3f53d568df74dc20e2739c1926e3d9461e14a505f89829e5", "0x58aa5b23258100fd504b5811bb63446bfa79c69c65685473044e8d59029d2823"]],
		["2", "0xc5201589361c2da2b07df626f1cab71b4255b16e", "159961545035522359362960", ["0x7f29941cebbd61fce9d702cce81289354fa2d5f98f62efcd1f579fd29b0c0782", "0x180f0217814aaee70b58bb3f18a17233dbb34edf40b3efd7d4b9d79bb0fb60ff", "0x65d21c6fdeecc72e3f53d568df74dc20e2739c1926e3d9461e14a505f89829e5", "0x58aa5b23258100fd504b5811bb63446bfa79c69c65685473044e8d59029d2823"]]
	]
}

```


### 6.3 获取指定账户SWP余额及其他信息
#### 请求
##### 参数说明：
- method  方法名称 get_swp_info
- address 账户地址
##### 请求示例
```
curl  -X POST --url http://192.168.38.227:3536/claim/   -H "Content-Type: application/json"  -d '{
	"method": "get_swp_info",
	"address": "0x72c09d4fd187b4336fa4ab66e4360f626619483b"
}'

https://stake-swapx.99ss.ml/

curl  -X POST --url https://stake-swapx.99ss.ml/claim/   -H "Content-Type: application/json"  -d '{
	"method": "get_swp_info",
	"address": "0x72c09d4fd187b4336fa4ab66e4360f626619483b"
}'
```
#### 应答
##### 数据说明
- balance   指定账户SWP余额
- price     SWP价格
- released  SWP已发行量
#####
```
{
	"balance": "0",
	"price": 1.68,
	"released": "2000000000000000000000"
}
```



### 6.4 提交领取指定周期时间戳
#### 请求
##### 参数说明：
- method  方法名称 finish_epoch
- epoch   周期值
##### 请求示例
```
curl  -X POST --url  http://192.168.38.227:3536/claim/   -H "Content-Type: application/json"  -d '{
	"method": "finish_epoch",
	"epoch": "3"
}'




curl  -X POST --url  http://127.0.0.1:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "finish_epoch",
	"epoch": "2"
}'
```

#### 应答
##### 数据说明
- result  执行结果 成功success
##### 应答示例
```
{
    "result": "success"
}

```


### 6.5 提交领取名单MerkleRoot
#### 请求
##### 参数说明：
- method  方法名称 seed_allocations
- epoch   周期值
- issue   是否发行指定代币  1 --是 0--否
##### 请求示例
```
curl  -X POST --url  http://127.0.0.1:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "seed_allocations",
	"epoch": "2",
    "issue":0
}'

```

#### 应答
##### 数据说明
- result  执行结果 成功success
##### 应答示例
```
{
    "result": "success"
}

```



```


curl  -X POST --url  http://127.0.0.1:3536/claim/   -H "Content-Type: application/json"  -d '{
	"method": "finish_epoch",
	"epoch": "3"
}'



curl  -X POST --url  http://127.0.0.1:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "seed_allocations",
	"epoch": "2",
    "issue":0
}'

curl  -X POST --url  http://192.168.38.227:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "seed_allocations",
	"epoch": "2",
    "issue":0
}'



curl  -X POST --url http://127.0.0.1:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "get_reward_list",
	"address": "0x1084d79A66EF86BFc9c945d4a21159a024dEE14e"
}'

curl  -X POST --url http://127.0.0.1:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "get_reward_list",
	"address": "0x929378dbc9a1fdc0d05529e48097ff65c6902231"
}'


curl  -X POST --url  http://127.0.0.1:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "claim_all_rewards",
	"address": "0x1084d79A66EF86BFc9c945d4a21159a024dEE14e"
}'


curl  -X POST --url  http://127.0.0.1:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "claim_all_rewards",
	"address": "0x929378dbc9a1fdc0d05529e48097ff65c6902231"
}'

```
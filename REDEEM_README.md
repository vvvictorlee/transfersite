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
    "data": "0xc44faa3f000000000000000000000000b0b0d02d246dadb22f40133c2fb0fcf738b3337c0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000017ae1ce9cb8e7ab8e120ba081cc4b060e7ade8f00000000000000000000000000000000000000000000005c283d410394100000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010d3ea72e734e7b4cf601030f752d8bb2df21f1b432e93064fd86edbaf2e2a4dc"
}

```




```

curl  -X POST --url  http://192.168.38.227:3536/claim/   -H "Content-Type: application/json"  -d '{
	"method": "finish_epoch",
	"epoch": "2"
}'

curl  -X POST --url  http://127.0.0.1:3536/claim/  -H "Content-Type: application/json"  -d '{
	"method": "finish_epoch",
	"epoch": "2"
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
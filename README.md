# Mining Scripts V2



## 0. 配置

1、创建MySQL数据库，建库脚本参见 `sql/eth_data.sql`

2、修改配置文件：`conf/const.js`



## 1. 获取链上数据

```
node get_block_data.js
```



可以修改 `data/conf.json` 文件中的 `lastBlocker`，设置本次开始同步的块号

```json
{
  "lastBlocker": 607254,
  "updatedBlocks": [
    0
  ]
}
```



## 2. 生成快照块

```
node snapshot.js
```



可以修改 `data/cycle.json` 文件，设置：奖励周期，开始块，结束块，本周期最大块号（一天为96）

```json
[
  [1, 8567000, 8567220, 96],
  [2, 8567382, 8573463, 96]
]
```

生成的快照块在 `data/snapshot.json` 文件中



## 3. 挖矿

```
node machining_data.js
```



挖矿程序默认运行最近一个周期的奖励，可以修改最后一行代码运行其他奖励周期

```js
miningCycle(cycle_index); // cycle_index是奖励周期的索引号，从0开始
```

这里的 `cycle_index` 是奖励周期的索引号，一般是：奖励周期号-1



## 4. 验证奖励周期的挖矿结果

// TODO
基本规则：
1、每个币种的总奖励 <= 总发行量（570万）
2、每个币种的本周期奖励 <= 本周期最大奖励（19.2万）
3、每个币种的总领取数量 <= 当前总发行量



## 5. 生成结果数据

### 5.1 执行方式

```
node create_cycle_report.js
```



可以在 `create_cycle_report.js` 文件中修改要生成结果的周期

```js
createReport(cycle);	// cycle为奖励周期
```



### 5.2 代码说明

根据 `cycle_reward` 表可以获取奖励指定周期的所有数据

```sql
SELECT addr,token,amount FROM cycle_reward WHERE cycle=? AND flag=0
```

其中 `flag=0` 用于屏蔽部分地址的奖励：

1、如果奖励的地址为合约地址，则奖励应不发放，否则该合约无法领取奖励

2、不发放的奖励将会放回待分配池中



### 5.3 挖矿奖励报告

生成的报告在 `reports` 文件夹中，每个周期以 `CR_周期号` 命名

每个文件以币种进行划分，文件名命名规则为：`周期_本期发行总量_Token地址.json`

每个文件中是本币种获得奖励的地址和具体金额


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
	"address": "0xf7076D986996d0DBD97D6799C2Ec2adC2975CefB"
}'


curl  -X POST --url https://swapx.99ss.ml/claim/  -H "Content-Type: application/json"  -d '{
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
	"name": "BETH",
	"address": "0x1df382c017c2aae21050d61a5ca8bc918772f419",
	"value": "2000"
}, {
	"name": "CETH",
	"address": "0x4cf4d866dcc3a615d258d6a84254aca795020a2b",
	"value": "3000"
}, {
	"name": "DETH",
	"address": "0x6c50d50fafb9b42471e1fcabe9bf485224c6a199",
	"value": "4000"
}, {
	"name": "AETH",
	"address": "0x71805940991e64222f75cc8a907353f2a60f892e",
	"value": "1000"
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
	"address": "0xf7076D986996d0DBD97D6799C2Ec2adC2975CefB"
}'

curl  -X POST --url  https://swapx.99ss.ml/claim/  -H "Content-Type: application/json"  -d '{
	"method": "claim_all_rewards",
	"address": "0xf7076D986996d0DBD97D6799C2Ec2adC2975CefB"
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
	"data": "0x58cf5f1000000000000000000000000000000000000000000000000000000000000007B"
}

```



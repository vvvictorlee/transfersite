# Mining Scripts V2

> v1.1



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

```
node check_data.js
```



验证奖励结果可以在 `check_data.js` 中执行以下函数（该检查已包含在 `machining_data.js` 中）：

```
block_db.checkCycleData();
```

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
SELECT addr,token,amount FROM cycle_reward WHERE cycle=? AND type=0
```

其中 `type=0` 为地址的类型，用于屏蔽部分地址的奖励：

1、如果奖励的地址为合约地址，则奖励应不发放，否则该合约无法领取奖励

2、不发放的奖励，将会暂停处理，等待社区决议



### 5.3 挖矿奖励报告

生成的报告在 `reports` 文件夹中，每个周期以 `CR_周期号` 命名

每个文件以币种进行划分，文件名命名规则为：`周期_本期发行总量_Token地址.json`

每个文件中是本币种获得奖励的地址和具体金额
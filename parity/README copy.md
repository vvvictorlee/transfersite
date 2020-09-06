1、Getting Homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
2、Adding Parity to your list of Homebrew 'kegs'
打开终端，输入下面的命令，按enter。
brew tap paritytech/paritytech
3、Installing Parity
稳定版
brew install parity --stable
最新版
brew install parity
最新开发版
brew install parity --master
更新最新版本
brew update && brew upgrade parity
and
brew reinstall parity
4、查看安装版本
parity --version




二、设置chain spec
PoA chain 需要设置一个创世区块。

```
{
  "name": "DemoPoA",
  "engine": {
    "authorityRound": {
      "params": {
        "stepDuration": "5",
        "validators": {
          "list": [
          ]
        }
      }
    }
  },
  "params": {
    "gasLimitBoundDivisor": "0x0400",
    "maximumExtraDataSize": "0x20",
    "minGasLimit": "0x1388",
    "networkID": "0x2323"
  },
  "genesis": {
    "seal": {
      "authorityRound": {
        "step": "0x0",
        "signature": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    "difficulty": "0x20000",
    "gasLimit": "0x5B8D80"
  },
  "accounts": {
    "0x0000000000000000000000000000000000000001": {
      "balance": "1",
      "builtin": {
        "name": "ecrecover",
        "pricing": {
          "linear": {
            "base": 3000,
            "word": 0
          }
        }
      }
    },
    "0x0000000000000000000000000000000000000002": {
      "balance": "1",
      "builtin": {
        "name": "sha256",
        "pricing": {
          "linear": {
            "base": 60,
            "word": 12
          }
        }
      }
    },
    "0x0000000000000000000000000000000000000003": {
      "balance": "1",
      "builtin": {
        "name": "ripemd160",
        "pricing": {
          "linear": {
            "base": 600,
            "word": 120
          }
        }
      }
    },
    "0x0000000000000000000000000000000000000004": {
      "balance": "1",
      "builtin": {
        "name": "identity",
        "pricing": {
          "linear": {
            "base": 15,
            "word": 3
          }
        }
      }
    }
  }
}

```

stepDuration 设定成5秒产生一个区块。
validators 设定Authority的地方，目前先空著，后面创建account之后再回来填入。
将上面的文件保存到桌面的一个文件中，保存为demo-spec.json。
三、设置两个节点
在我们这篇文章中，我们在同一台电脑设置两个节点，跟我们讲解以太坊私网建立 (2) - 同一台电脑／不同电脑运行多个节点时，如果在同一台电脑设置两个节点，需要将rpcport和port设置为不同的值，否则就会发生冲突，POA chain中也是一样，需要将一些参数设置为不同的值。
-d：指定存储资料与账号的目录
--dport：指定Parity的network port，可用来让其他node连接
--jsonrpc-port：这是JSON RPC port，使用web3.js时会需要
ui-port：Parity提供的Web-based UI port
可以用下列指令启动Parity node。

```
parity --chain demo-spec.json -d parity0 --port 30300  --ui-port 8180  --jsonrpc-port 8540 --jsonrpc-apis web3,eth,net,personal,parity,parity_set,traces,rpc,parity_accounts
```
除了打一长串的指令外，Parity也提供更为简洁的config档案设定方式，使用 --config 即可引用配置文件。
node0 使用如下配置文件 node0.toml：

```
[parity]
chain = "demo-spec.json"
base_path = "parity0"
[network]
port = 30300
[rpc]
port = 8540
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts"]
[ui]
port = 8180
[websockets]
port = 8456
```

node1 使用如下配置文件 node1.toml：

```
[parity]
chain = "demo-spec.json"
base_path = "parity1"
[network]
port = 30301
[rpc]
port = 8541
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts"]
[ui]
port = 8181
[websockets]
port = 8457
```

四、设置账号(Account)
我们总共需要设置三个账号，两个Authority和一个user账号。
第一步：首先启动node0 : 

```
parity --config node0.toml
```
2020-08-29 16:59:26  Public node URL: enode://e91eeb07de626a5de08bb60ca43166fc1e75ffe241eb868bd1e85b22062241df2ad743f275ab7314d5753fef65654ab13691823e128448f6054d695729817c05@192.168.2.102:30300


node0
打开网页http://localhost:8180，按照步骤创建一个用户账号。

p2p3p4p5p6p7
新增Authority account，使用Restore功能，为了示范一致性，我们使用 123456 当作 pass phrase。
p8p9p10

到目前为止我们已经完成node0的账号设置。

Authority account：0x5a08179638550bc36274c06831b7e9976d6b0360
User account：0x0064B0999c0142eE99aB0ceC054BAb53fe0a3EcC
第二步：设置node1的账号，启动parity --config node1.toml。步骤相同，连接到 http://localhost:8181 ，pass phrase使用 123456
p11
p12



这样就完成了node1的账号设置。

Authority account:0xcf9bf386ea15eeda4fbf644628afb5816f864ff2
第三步：将Authority account 写入 demo-spec.json 文件

```
"validators": {
  "list": [
    "0x00F9B30838ca40c8A53c672840acbDec6fCDb180",
    "0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e"
  ]
}
再将user account加入accounts，並给一些balance，后续可以使用。
"0x0064B0999c0142eE99aB0ceC054BAb53fe0a3EcC": {
  "balance": "10000000000000000000000"
}
完成后的demo-spec.json如下：
{
  "name": "DemoPoA",
  "engine": {
    "authorityRound": {
      "params": {
        "stepDuration": "5",
        "validators": {
          "list": [
            "0x00F9B30838ca40c8A53c672840acbDec6fCDb180",
            "0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e"
          ]
        }
      }
    }
  },
  "params": {
    "gasLimitBoundDivisor": "0x0400",
    "maximumExtraDataSize": "0x20",
    "minGasLimit": "0x1388",
    "networkID": "0x2323"
  },
  "genesis": {
    "seal": {
      "authorityRound": {
        "step": "0x0",
        "signature": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    "difficulty": "0x20000",
    "gasLimit": "0x5B8D80"
  },
  "accounts": {
    "0x0000000000000000000000000000000000000001": {
      "balance": "1",
      "builtin": {
        "name": "ecrecover",
        "pricing": {
          "linear": {
            "base": 3000,
            "word": 0
          }
        }
      }
    },
    "0x0000000000000000000000000000000000000002": {
      "balance": "1",
      "builtin": {
        "name": "sha256",
        "pricing": {
          "linear": {
            "base": 60,
            "word": 12
          }
        }
      }
    },
    "0x0000000000000000000000000000000000000003": {
      "balance": "1",
      "builtin": {
        "name": "ripemd160",
        "pricing": {
          "linear": {
            "base": 600,
            "word": 120
          }
        }
      }
    },
    "0x0064B0999c0142eE99aB0ceC054BAb53fe0a3EcC": {
      "balance": "10000000000000000000000"
    },
    "0x0000000000000000000000000000000000000004": {
      "balance": "1",
      "builtin": {
        "name": "identity",
        "pricing": {
          "linear": {
            "base": 15,
            "word": 3
          }
        }
      }
    }
  }
}
```


五、启动Authority node
为了启动Authority node来产生区块，我们必须设定负责产生block的signer，分別是 node0 和 node1 account。
1、第一步，创建一个node.pwds文件，写入node0与node1的password，内容如下：
node0
node1
2、第二步，在node0.toml文件中加入[account]及[mining]设置，如下：

```
[parity]
chain = "demo-spec.json"
base_path = "parity0"
[network]
port = 30300
[rpc]
port = 8540
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts"]
[ui]
port = 8180
[account]
password = ["node.pwds"]
[mining]
engine_signer = "0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e"
reseal_on_txs = "none"
```

3、第三步，在node1.toml文件中加入[account]及[mining]设置，如下：

```
[parity]
chain = "demo-spec.json"
base_path = "parity1"
[network]
port = 30301
[rpc]
port = 8541
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts"]
[ui]
port = 8181
[websockets]
port = 8457
[account]
password = ["node.pwds"]
[mining]
engine_signer = "0x00F9B30838ca40c8A53c672840acbDec6fCDb180"
reseal_on_txs = "none"
```

4、第四步，Step 4 分別启动两个node
parity --config node0.toml
parity --config node1.toml

2020-08-29 17:58:08  Public node URL: enode://e91eeb07de626a5de08bb60ca43166fc1e75ffe241eb868bd1e85b22062241df2ad743f275ab7314d5753fef65654ab13691823e128448f6054d695729817c05@192.168.2.102:30300


2020-08-29 17:59:19  Public node URL: enode://579f6c90510b503576d1cf64eb3c88fa07ab454dcef875979eede16e3c33d537304377af2215a05f5647e294b93f19611cd96b8803d08294ea7849db13bf2a32@192.168.2.102:30301

六、连接两个节点
使用Postman透过JSON RPC来测试。
1、第一步，Post下列JSON数据至 http://localhost:8540 以取得 node0 的enode资料
```
curl -X POST -H "Accept: application/json" -H "Content-type: application/json" --data '
{
 "jsonrpc":"2.0",
 "method":"parity_enode",
 "params":[],
 "id":0
}
'  http://localhost:8540
```

p13
获取到的数据如下：

```
{
    "jsonrpc": "2.0",
    "result": "enode://cfb3af513da3a7a8138450f0dc01fa38cb2ac837744dc645038940287f4dce3f416f0e7e17fd10619a263c360d9324fd2dcd8753c4500fcc54cf84e076b39cd6@192.168.10.101:30300",
    "id": 0
}
```

```
 http://localhost:8540
{"jsonrpc":"2.0","result":"enode://e91eeb07de626a5de08bb60ca43166fc1e75ffe241eb868bd1e85b22062241df2ad743f275ab7314d5753fef65654ab13691823e128448f6054d695729817c05@192.168.2.102:30300","id":0}
```
是node0的标识。下一步中我们将将它加入到node1中以实现两个节点之间的连接。
2、第二步，将 node0 的enode加入 node1 ，Post下列JSONs数据至node1 (http://localhost:8541 )

```
curl --url http://localhost:8541 -X POST -H "Accept: application/json" -H "Content-type: application/json" --data '
{
 "jsonrpc":"2.0",
 "method":"parity_addReservedPeer",
 "params":["enode://e91eeb07de626a5de08bb60ca43166fc1e75ffe241eb868bd1e85b22062241df2ad743f275ab7314d5753fef65654ab13691823e128448f6054d695729817c05@192.168.2.102:30300"],
 "id":0
} '
```

p14
返回的数据如下，result为true，说明连接成功：

```
{
    "jsonrpc": "2.0",
    "result": true,
    "id": 0
}
```

再切换到node1的终端，会看到下面的数据：
```
1/25 peers   13 KiB chain 11 KiB db 0 bytes queue 10 KiB sync  RPC:  0 conn,  0 req/s,  24 µs
```

p15
如上图所示，表示连接成功。

八、分享给其他节点
在开发时通常会将node跑在server上，让其他人可以通过JSON RPC port连接上去使用，此时只要在config文件里面加入 [interface] 设置即可。
假设server ip为192.168.1.5，将 node0.toml 修改如下：

```
[parity]
chain = "demo-spec.json"
base_path = "parity0"
[network]
port = 30300
[rpc]
port = 8540
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts"]
interface = "192.168.1.5"
[ui]
port = 8180
[account]
password = ["node.pwds"]
[mining]
engine_signer = "0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e"
reseal_on_txs = "none"
node1.toml 修改如下：
[parity]
chain = "demo-spec.json"
base_path = "parity1"
[network]
port = 30301
[rpc]
port = 8541
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts"]
interface = "192.168.1.5"
[ui]
port = 8181
[websockets]
port = 8457
[account]
password = ["node.pwds"]
[mining]
engine_signer = "0x00F9B30838ca40c8A53c672840acbDec6fCDb180"
reseal_on_txs = "none"
```


6.发送交易

发送事务的两种主要方式是RPC和UI。
RPC

从用户帐户向权限node0发送一些代币：

```
curl --url localhost:8540 -X POST -H "Content-Type: application/json"  --data '{
	"jsonrpc": "2.0",
	"method": "personal_sendTransaction",
	"params": [{
		"from": "0x004ec07d2329997267Ec62b4166639513386F32E",
		"to": "0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e",
		"value": "0xde0b6b3a7640000"
	}, "user"],
	"id": 0
}'  
```
提交请求后，应在几秒钟后发出阻止。您可以检查其他帐户是否收到了资金：
```
curl --url localhost:8540 -X POST -H "Content-Type: application/json"  --data '{
	"jsonrpc": "2.0",
	"method": "eth_getBalance",
	"params": ["0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e", "latest"],
	"id": 1
}' 
```

我们还可以将一些发送到另一个节点上的帐户：

```
curl --url localhost:8540 -X POST -H "Content-Type: application/json" --data '{
	"jsonrpc": "2.0",
	"method": "personal_sendTransaction",
	"params": [{
		"from": "0x004ec07d2329997267Ec62b4166639513386F32E",
		"to": "0x00Aa39d30F0D20FF03a22cCfc30B7EfbFca597C2",
		"value": "0xde0b6b3a7640000"
	}, "user"],
	"id": 0
}' 
```

并检查是否收到询问另一个节点：

```
curl --url localhost:8541 -X POST -H "Content-Type: application/json" --data '{
	"jsonrpc": "2.0",
	"method": "eth_getBalance",
	"params": ["0x00Aa39d30F0D20FF03a22cCfc30B7EfbFca597C2", "latest"],
	"id": 1
}'
```

7.进一步发展

您现在可以创建更多帐户，发送价值，编写合同并进行部署。用于开发和使用以太坊网络的所有工具也可用于此网络。
要在多台计算机上部署Parity，您可能会发现docker构建很有用。
要添加非授权节点，可以使用以下更简单的配置：
```
[parity]
chain = "demo-spec.json"
base_path = "/tmp/parity2"
[network]
port = 30302
[rpc]
port = 8542
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts"]
[ui]
port = 8182
[websockets]
port = 8452
[ipc]
disable = true
```

然后，帐户和连接节点可以与权限节点相同。为了确保接受交易，权限也可以在usd_per_tx = "0"字段下运行[mining]。任何提交交易的节点都可以免费提供。
在不同的机器上运行节点时，大多数字段都是冗余的，因此基本配置只有链和可能的RPC apis：
```
[parity]
chain = "demo-spec.json"
[rpc]
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts”]
```
或者只是运行
```
parity --chain demo-spec.json！
```
补充：分享给区网内其他人使用
在开发时通常会将node跑在server上，让其他人可以透过JSON RPC port连接上去使用，此时只要在config里面加入 [interface] 设定即可。
假设server ip为192.168.1.1，将 node0.toml 修改如下：
```
[rpc]
port = 8540
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts"]
interface = "192.168.1.1"
```
坑点：我在使用时，使用Vmware虚拟机搭建，parity默认绑定的是本机的IP，导致外部一直不能访问，写入interface = "0.0.0.0"后解决外部访问问题。
*在JSONRPC接口的调用过程中，如果遇到跨域问题，需要在配置文件中添加cors=all 或者 cors=：
```
[rpc]
cors = ["all"]
```
**钱包交易转账时，可能会遇到交易接口调用成功，但balance并没有发生变化的情况，你需要用以下命令启动：
```
parity --config node0.toml --nat extip:X.X.X.X
```
**如果你需要获取钱包的操作记录，你需要给你的钱包开启此功能，在配置文件中添加如下：
```
[footprint]
tracing = "on"
```
然后调用trace_filter接口即可，但此功能比较占用服务资源，如果不是特别需要，建议不要开启。

环境准备
本测试环境在单机上完成，通过不同端口号来区分节点。使用go的客户端geth，版本是Version: 1.6.7-unstable。源码地址: https://github.com/ethereum/go-ethereum 。geth和bootnode的编译自行完成。工作目录结构如下：
➜  ethereum  tree -L 2
.
├── bootnode.key
├── bootnode.log
├── bootnode.sh
├── data
│   ├── 00
│   ├── 01
│   ├── 02
│   └── genesis
└── start.sh

启动bootnode
以太坊在启动时需要告之至少一个对等节点，这样才能接入整个以太坊网络，bootnode相当于一个第三方的中介，node在启动时会将自己的信息注册到bootnode的路由中，并且会从bootnode得到其它节点的路由信息，一旦有了对等节点信息后就可以不需要连接bootnode。公有链的节点硬编码了一些bootnode节点地址。
创建脚本 bootnode.sh
#如果没有bootnode.key文件，先生成一个
if [ ! -f bootnode.key ];then
    bootnode -genkey bootnode.key
fi
pkill bootnode
## 后台启动bootnode，将输出重定向至bootnode.log文件
nohup bootnode -nodekey=bootnode.key > bootnode.log&

看下bootnode.log的内容：
INFO [10-25|14:48:33] UDP listener up                          self=enode://e9132e9df0fab001c9fa0c20094a413970c8d05b52f78efc483b4c7e935be6cc67b8d448881cda24b824d5eb82084343a6c6def4be1c1d9f7a0f1280d31f83d8@[::]:30301

启动geth节点时，需要从上面的内容中解析出bootnode的id。
启动节点
为了方便启动节点，我编写了下面的脚本 start.sh:
# 启动之前需要手工启动bootnode
if [ ! -f bootnode.log ];then
    echo "please run bootnode.sh first"
    exit
fi
# 解析本机的ip地址
ip=$(ifconfig|grep inet|grep -v inet6|grep broadcast|awk '{print $2}')
# 解析bootnode地址
bootnode_addr=enode://"$(grep enode bootnode.log|tail -n 1|awk -F '://' '{print $2}'|awk -F '@' '{print $1}')""@$ip:30301"
if [ "$1" == "" ];then
    echo "node id is empty, please use: start.sh <node_id>";
    exit
fi
no=$1
datadir=data
mkdir -p $datadir
# 如果启动前需要使用创世块初始化
if [ ! -d "$DIRECTORY" ]; then
    if [ ! -f $datadir/genesis ];then
        echo '{"config": {"chainId": 15, "homesteadBlock": 0, "eip155Block": 0, "eip158Block": 0 }, "coinbase" : "0x0000000000000000000000000000000000000000", "difficulty" : "0x40000", "extraData" : "", "gasLimit" : "0xffffffff", "nonce" : "0x0000000000000042", "mixhash" : "0x0000000000000000000000000000000000000000000000000000000000000000", "parentHash" : "0x0000000000000000000000000000000000000000000000000000000000000000", "timestamp" : "0x00", "alloc": { } }' > $datadir/genesis
    fi
    geth --datadir $datadir/$no init ./data/genesis
fi
# 运行geth，启动console
geth --datadir ./data/$no --networkid 11100 --ipcdisable --port 619$no --rpc --rpccorsdomain "*" --rpcport 81$no --bootnodes $bootnode_addr console

上面的脚本会先判断有没有启动bootnode，然后创建创世块配置，再用它来初始化节点，最后启动它，并开启RPC接口，这样可以使用一些图形化的浏览器插件调用接口，注意需要设置跨域头。
分别在三个终端中启动3个节点，参数格式是两个数字：
./start.sh 00
./start.sh 01
./start.sh 02

如果是参数是 00，则工作目录是 data/00，p2p端口是 61900，rpc端口是 8100。
创建帐户、挖矿
start.sh脚本在启动geth时开启了console，我们可以在它里面输入指命操作以太坊接口。首先我们创建一个帐号：
在 00节点终端创建帐户并查看余额：
# 创建帐户，参数是密码
> personal.newAccount("abc123")
"0xf9ab190a9c56fd0d945eac9659c0c9519b13c64e"
> eth.getBalance("0xf9ab190a9c56fd0d945eac9659c0c9519b13c64e")
  0

因为是一个新用户，所以余额是0，没有问题。接下来我们挖矿，不过挖矿之前需要先解锁帐户
> personal.unlockAccount("0xf9ab190a9c56fd0d945eac9659c0c9519b13c64e")
Passphrase:

开始挖矿:
> miner.start()
Successfully sealed new block
# ps. 输入停止挖矿指令时，输入会被打乱，不过不影响。
> miner.stop()

大概只需要几秒钟，就会出现 Successfully sealed new block，表明挖到矿了，然后我们再看帐户余额：
> eth.getBalance("0xf9ab190a9c56fd0d945eac9659c0c9519b13c64e")
65000000000000000000

本例中总共挖到65个ether。
交易
现在我们在 01节点创建另外一个帐户：
> personal.newAccount("abc123")
"0x22aa2aa9af7b4ebbf88f3abd394f4948cde5cb6c"

回到 00节点，转10个以太币到这个新的帐户上：
> eth.sendTransaction({from:"0xf9ab190a9c56fd0d945eac9659c0c9519b13c64e", to:"0x22aa2aa9af7b4ebbf88f3abd394f4948cde5cb6c", value:  web3.toWei(10, "ether")})
INFO [10-30|13:46:53] Submitted transaction                    fullhash=0x2ff6f675fcdecff9d5fa03c73eec068c3aabe885beb122533e533b227d08cc64 recipient=0x22aa2aa9af7b4ebbf88f3abd394f4948cde5cb6c
"0x2ff6f675fcdecff9d5fa03c73eec068c3aabe885beb122533e533b227d08cc64"

再到 01节点查看 to的帐户余额，发现还是0，这是因为我们还没有挖矿，交易没有得到确认。 接下来我们在个节点 02上创建一个新帐户，解锁后开始挖矿，等待交易被确认。
我们再看下 00和 01节点里的帐户余额变化： 01节点里的余额是 10000000000000000000，也就是10个以太币。 00节点在交易前余额是65 ether，但现在只有 54999622000000000000，少的部分其实是矿工费用，由 02的矿工节点收取。
文章里的帐户地址和余额均为参考值，在不同环境下都会不一致。另外，geth是用CPU来挖矿的，用它在公有链上挖矿已完全没有可能了。

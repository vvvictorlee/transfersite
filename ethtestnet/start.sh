
# 看下bootnode.log的内容：
# INFO [10-25|14:48:33] UDP listener up                          
# self=enode://e9132e9df0fab001c9fa0c20094a413970c8d05b52f78efc483b4c7e935be6cc67b8d448881cda24b824d5eb82084343a6c6def4be1c1d9f7a0f1280d31f83d8@[::]:30301

# 启动geth节点时，需要从上面的内容中解析出bootnode的id。
# 启动节点
# 为了方便启动节点，我编写了下面的脚本 start.sh:
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
    # if [ ! -f $datadir/genesis ];then
    #     echo '{"config": {"chainId": 15, "homesteadBlock": 0, "eip155Block": 0, "eip158Block": 0 }, "coinbase" : "0x0000000000000000000000000000000000000000", "difficulty" : "0x40000", "extraData" : "", "gasLimit" : "0xffffffff", "nonce" : "0x0000000000000042", "mixhash" : "0x0000000000000000000000000000000000000000000000000000000000000000", "parentHash" : "0x0000000000000000000000000000000000000000000000000000000000000000", "timestamp" : "0x00", "alloc": { } }' > $datadir/genesis
    # fi
    geth --datadir $datadir/$no init ./genesis.json
fi
# 运行geth，启动console
geth --datadir ./data/$no --networkid 11100 --ipcdisable --port 619$no --rpc --rpccorsdomain "*" --rpcport 81$no --bootnodes $bootnode_addr console


#如果没有bootnode.key文件，先生成一个
if [ ! -f bootnode.key ];then
    bootnode -genkey bootnode.key
fi
pkill bootnode
## 后台启动bootnode，将输出重定向至bootnode.log文件
nohup bootnode -nodekey=bootnode.key > bootnode.log&
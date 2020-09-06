一.parity的实现共识POA

    了解区块链的同学，应该都听过pow,pos这些共识算法，那parity的poa是一种什么样的工作原理呢？poa全称 Proof of Authority ，工作权益证明。

    poa的特点：

有别于PoW (Proof-of-Work)需要解数学难题来产生block，PoA是依靠预设好的Authority nodes，负责产生block。
可依照需求设定Authority node数量。
可指定产生block的时间，例如收到交易的5秒后产生block。
一般的Ethereum node也可以连接到PoA Chain，正常发起transactions, contracts等
可适用于企业内部，构建多企业的联盟链
二.parity 下载安装

    parity github: https://github.com/paritytech/parity

    parity 下载地址：https://github.com/paritytech/parity/releases

 1.wget  https://d1h4xl4cr1h0mo.cloudfront.net/v1.10.4/x86_64-unknown-linux-gnu/parity #下载

  2.chmod 775 parity  #修改可执行文件

  3. ./parity -v  #检查parity 版本

   若显示v1.10.4 版本信息，则已成功安装

 

三.配置创世区块 genesis-spec.json

   >$ mkdir parity

   >$ cd parity

   >$vim genesis-spec.json
```
{
    "name": "DemoPoA",
    "engine": {
        "authorityRound": {
            "params": {
                "stepDuration": "2",
                "validators" : {
                    "list": []
                }
            }
        }
    },
"params": {
    "gasLimitBoundDivisor": "0x400",
        "maximumExtraDataSize": "0x20",
        "minGasLimit": "0x1388",
        "networkID" : "0x2323"
    },
    "genesis": {
        "seal": {
            "authorityRound": {
                "step": "0x0",
                "signature": "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
            }
        },
        "difficulty": "0x10000",
        "gasLimit": "0x12a05f200"
    },
    "accounts": {
        "0x0000000000000000000000000000000000000001": { "balance": "1", "builtin": { "name": "ecrecover", "pricing": { "linear": { "base": 3000, "word": 0 } } } },
        "0x0000000000000000000000000000000000000002": { "balance": "1", "builtin": { "name": "sha256", "pricing": { "linear": { "base": 60, "word": 12 } } } },
        "0x0000000000000000000000000000000000000003": { "balance": "1", "builtin": { "name": "ripemd160", "pricing": { "linear": { "base": 600, "word": 120 } } } },
        "0x0000000000000000000000000000000000000004": { "balance": "1", "builtin": { "name": "identity", "pricing": { "linear": { "base": 15, "word": 3 } } } },
        "0x6a67f9275dfe3abac6fd5525dec804551cbb7f00": { "balance": "1000000000000000000000000" },
        "0xd62de1cbcf85253b776305ab45fd85367187bc29": { "balance": "1000000000000000000000000" }
    }
}

```


 name:创世文件名称

 engine:节点引擎，这里先用写死验证人方式，在list 中添加验证人地址

params: networkID 联盟链节点ID

accounts:初始化账户

友情提示：更详细配置可参考parity wiki : https://wiki.parity.io/Chain-specification
 

四.添加节点配置文件

>$ vim node1.toml

```
[parity]
chain = "genesis-spec.json" #创世区块文件
base_path = "parity0" #创建parity0文件夹，代表第一个节点
[network]
port = 30300  #网络端口
[rpc]
port = 8540  #rpc请求端口 
apis = ["web3", "eth", "net", "personal", "parity", "parity_set", "traces", "rpc", "parity_accounts"]  #支持的rpc请求方式
#interface = "192.168.1.175"  #默认的rpc 请求地址
[ui]
port = 8180  #parity ui网页端口 
hosts = ["all"]
[account]
password = ["node.pwds"] #节点parity0密码
[websockets]port = 8456 
[ipc]
disable = true  #不支持ipc 访问
[mining]engine_signer = "0x005C6F320C425675bAE78BcF693AE2e6d63e9853"  #矿工地址reseal_on_txs = "none"
```

五.创建用户名密码存储文件

>$ touch node.pwds （创建节点矿工密码）

>$ vim node.pwds

    123

 

六.创建节点关联文件

 >$  touch reservedPeers.enode (暂时创建，创建第一个节点时，在补充)

 

七.创建初始化用户

 >$ ./parity account new --config node1.toml
0xfa776b20f7384a30ca76c74d5c797755cfeb3e84


八.修改创世文件 genesis-spec.json 添加验证人


九.修改配置节点

十.启动parity

>$ ./parity --config node1.toml
2020-08-29 16:34:54  Public node URL: enode://cbf91497abf5ada5248810d10890fceaf878d34a4ef911b1707262382fa34dd0a0665bac47e4a3e3ef8fdc2389dcf2a136046b032bd078b429448f7d22f034d2@192.168.2.102:30300

目前一个parity节点已经搭建完毕。

 

十一.采用合约管理节点验证人（可通过合约动态管理）
```
{
  "name": "DemoPoA",
  "engine": {
    "authorityRound": {
      "params": {
        "stepDuration": "5",
        "validators": {
          "safeContract":"0x0000000000000000000000000000000000000005"
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
    },
    "0x00A7135cf451B2463517D11e0cE88013042e0a28": {
      "balance": "80000000000000000000000"
    },
    "0x0000000000000000000000000000000000000005":{
      "balance": "1",
      "constructor":"0x606060405260008054600160a060020a0319169055341561001f57600080fd5b6020604051908101604052725c6f320c425675bae78bcf693ae2e6d63e9853815261004e906002906001610131565b5061006464010000000061017a61006982021704565b6101ff565b600554600090819060ff161561007e57600080fd5b600091505b60025482101561010357600280548390811061009b57fe5b600091825260209091200154600160a060020a03169050604080519081016040908152600182526020808301859052600160a060020a03841660009081526004909152208151815460ff19169015151781556020820151600191820155929092019150610083565b6005805460ff1916600190811790915560028054610122929190610198565b50506003805460ff1916905550565b828054828255906000526020600020908101928215610188579160200282015b828111156101885782518254600160a060020a031916600160a060020a039190911617825560209290920191600190910190610151565b506101949291506101d8565b5090565b8280548282559060005260206000209081019282156101885760005260206000209182015b828111156101885782548255916001019190600101906101bd565b6101fc91905b80821115610194578054600160a060020a03191681556001016101de565b90565b61073c8061020e6000396000f3006060604052600436106100775763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305c81865811461007c578063170f92911461009157806340a141ff146100c35780634d238c8e146100e25780637528621114610101578063b7ab4db514610114575b600080fd5b341561008757600080fd5b61008f61017a565b005b341561009c57600080fd5b6100a7600435610242565b604051600160a060020a03909116815260200160405180910390f35b34156100ce57600080fd5b61008f600160a060020a036004351661026a565b34156100ed57600080fd5b61008f600160a060020a03600435166103b7565b341561010c57600080fd5b61008f610464565b341561011f57600080fd5b61012761052f565b60405160208082528190810183818151815260200191508051906020019060200280838360005b8381101561016657808201518382015260200161014e565b505050509050019250505060405180910390f35b600554600090819060ff161561018f57600080fd5b600091505b6002548210156102145760028054839081106101ac57fe5b600091825260209091200154600160a060020a03169050604080519081016040908152600182526020808301859052600160a060020a03841660009081526004909152208151815460ff19169015151781556020820151600191820155929092019150610194565b6005805460ff191660019081179091556002805461023392919061063a565b50506003805460ff1916905550565b600180548290811061025057fe5b600091825260209091200154600160a060020a0316905081565b600160a060020a03811660009081526004602052604081205481908190849060ff16156103b057600160a060020a038516600090815260046020526040902060010154600280549195506000198201945090849081106102c657fe5b60009182526020909120015460028054600160a060020a0390921693508391869081106102ef57fe5b6000918252602080832091909101805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a039485161790559184168152600490915260409020600101849055600280548490811061034657fe5b6000918252602090912001805473ffffffffffffffffffffffffffffffffffffffff19169055600280549061037f90600019830161068a565b50600160a060020a03851660009081526004602052604081206001810191909155805460ff191690556103b0610598565b5050505050565b600160a060020a038116600090815260046020526040902054819060ff1615156104605760028054600160a060020a03841660009081526004602052604090206001908101829055810161040b838261068a565b506000918252602080832091909101805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03861690811790915582526004905260409020805460ff19166001179055610460610598565b5050565b60005433600160a060020a039081169116141580610484575060035460ff165b1561048e57600080fd5b6002805461049e9160019161063a565b506003805460ff191660019081179091557f8564cd629b15f47dc310d45bcbfc9bcf5420b0d51bf0659a16c67f91d27632539060405160208082528254908201819052819060408201908490801561051f57602002820191906000526020600020905b8154600160a060020a03168152600190910190602001808311610501575b50509250505060405180910390a1565b6105376106b3565b600180548060200260200160405190810160405280929190818152602001828054801561058d57602002820191906000526020600020905b8154600160a060020a0316815260019091019060200180831161056f575b505050505090505b90565b60035460ff1615156105a957600080fd5b6003805460ff191690556000194301407f55252fa6eee4741b4e24a74a70e9c11fd2c2281df8d6ea13126ff845f7825c89600260405160208082528254908201819052819060408201908490801561062a57602002820191906000526020600020905b8154600160a060020a0316815260019091019060200180831161060c575b50509250505060405180910390a2565b82805482825590600052602060002090810192821561067a5760005260206000209182015b8281111561067a57825482559160010191906001019061065f565b506106869291506106c5565b5090565b8154818355818115116106ae576000838152602090206106ae9181019083016106f6565b505050565b60206040519081016040526000815290565b61059591905b8082111561068657805473ffffffffffffffffffffffffffffffffffffffff191681556001016106cb565b61059591905b8082111561068657600081556001016106fc5600a165627a7a72305820e802334540c1fab99433710f3e01f32156cca8fb5321c2d69963ee71a09b944b0029"
    }
  }
}
```


```
pragma solidity ^0.4.15;
contract ValidatorSet {
    event InitiateChange(bytes32 indexed _parent_hash, address[] _new_set);
    function getValidators() public constant returns (address[] _validators);
    function finalizeChange() public;
}
contract MajorityList is ValidatorSet {
    event ChangeFinalized(address[] current_set);
    struct ValidatorStatus {
        bool isValidator;
        uint index;
    }
    address SYSTEM_ADDRESS = 0x0000000000000000000000000000000000000000;
    address[] public validatorsList;
    address[] pendingList;
    bool finalized;
    mapping(address => ValidatorStatus) validatorsStatus;
    bool private initialized;
    function MajorityList() public {
        pendingList = [0x005C6F320C425675bAE78BcF693AE2e6d63e9853];
        initializeValidators();
    }
    modifier uninitialized() {
        if (initialized) { revert();}
        _;
    }
    modifier when_finalized() {
        if (!finalized) { revert();}
        _;
    }
    modifier only_system_and_not_finalized() {
        if (msg.sender != SYSTEM_ADDRESS || finalized) { revert(); }
        _;
    }
    modifier is_validator(address someone) {
        if (validatorsStatus[someone].isValidator) { _; }
    }
    modifier is_not_validator(address someone) {
        if (!validatorsStatus[someone].isValidator) { _; }
    }
    function initializeValidators() public uninitialized {
        for (uint j = 0; j < pendingList.length; j++) {
            address validator = pendingList[j];
            validatorsStatus[validator] = ValidatorStatus({
                isValidator: true,
                index: j
            });
        }
        initialized = true;
        validatorsList = pendingList;
        finalized = false;
    }
    function initiateChange() private when_finalized {
        finalized = false;
        emit InitiateChange(block.blockhash(block.number - 1), pendingList);
    }
    function finalizeChange() public only_system_and_not_finalized {
        validatorsList = pendingList;
        finalized = true;
        emit ChangeFinalized(validatorsList);
    }
    function addValidator(address validator) public is_not_validator(validator){
        validatorsStatus[validator].index = pendingList.length;
        pendingList.push(validator);
        validatorsStatus[validator].isValidator = true;
        initiateChange();
    }
    function removeValidator(address validator) public is_validator(validator){
        uint removedIndex = validatorsStatus[validator].index;
        uint lastIndex = pendingList.length-1;
        address lastValidator = pendingList[lastIndex];

        pendingList[removedIndex] = lastValidator;
        validatorsStatus[lastValidator].index = removedIndex;

        delete pendingList[lastIndex];
        pendingList.length--;

        validatorsStatus[validator].index = 0;
        validatorsStatus[validator].isValidator = false;
        initiateChange();

    }
    function getValidators() public constant returns (address[]) {
        return validatorsList;
    }
}
```
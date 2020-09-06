# Redeem
```
   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0xb6e5451e47f1d071206bda8dfd50104c25f2a5fb0e2972fc8e6421839c88a123
   > Blocks: 1            Seconds: 8
   > contract address:    0xFba479DfBB879DD4E56a422CF655EBcE9C383e1B
   > block number:        563678
   > block timestamp:     1598150772
   > account:             0x0DB1bB1097ac3b7e26B3A4Cf35E2f19E07d24568
   > balance:             17.646189667999999998



2_deploy_redeem.js
==================

   Deploying 'TToken'
   ------------------
   > transaction hash:    0xadee0fce10c27c0ada1c035374b0a1dce30527d9ba5199575de9c8a473f6d89f
   > Blocks: 0            Seconds: 16
   > contract address:    0x609dbeE878452065E4d5bB8A2578b4BD5b399be6
   > block number:        563680
   > block timestamp:     1598150848
   > account:             0x0DB1bB1097ac3b7e26B3A4Cf35E2f19E07d24568
   > balance:             17.622511347999999998



   Deploying 'Redeem'
   ------------------
   > transaction hash:    0xb09c20bfdd7356f3d2d1ef9f0511f09f594a9e80ef84c6e133da4df0f9e6dca0
   > Blocks: 0            Seconds: 16
   > contract address:    0x2a103D4F9d64B4124F0a2Dd556DEee0926A92527
   > block number:        563681
   > block timestamp:     1598150866
   > account:             0x0DB1bB1097ac3b7e26B3A4Cf35E2f19E07d24568
   > balance:             17.601628667999999998


```
#MerkleRedeem

```


Migrations dry-run (simulation)
===============================
> Network name:    'testnet-fork'
> Network id:      1
> Block gas limit: 8000000 (0x7a1200)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > block number:        591797
   > block timestamp:     1598507303
   > account:             0x10aCB77eB8dB440fdD9b188a68DA406344c1Eb8b
   > balance:             989976.665711169000000002
   > gas used:            210441 (0x33609)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.000420882 ETH

   -------------------------------------
   > Total cost:         0.000420882 ETH


2_deploy_redeem.js
==================

   Deploying 'MerkleRedeem'
   ------------------------
   > block number:        591799
   > block timestamp:     1598507304
   > account:             0x10aCB77eB8dB440fdD9b188a68DA406344c1Eb8b
   > balance:             989976.661697829000000002
   > gas used:            1979307 (0x1e33ab)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.003958614 ETH

   -------------------------------------
   > Total cost:         0.003958614 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.004379496 ETH





Starting migrations...
======================
> Network name:    'testnet'
> Network id:      1
> Block gas limit: 8000000 (0x7a1200)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x1daf6fa13a578e5561a1d6c73fbff298eb2e96d3ce8131f06f201de3d05db97f
   > Blocks: 0            Seconds: 0
   > contract address:    0x5935A82f6d19Fd99Cb02D300f10095b27785FC4B
   > block number:        591797
   > block timestamp:     1598507303
   > account:             0x10aCB77eB8dB440fdD9b188a68DA406344c1Eb8b
   > balance:             989980.666132051000000002
   > gas used:            225441 (0x370a1)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00450882 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00450882 ETH


2_deploy_redeem.js
==================

   Deploying 'MerkleRedeem'
   ------------------------
   > transaction hash:    0x695224b5c559b683df36f24afaad679f7547ea8dfd7cc512ff0ef7491e1f61ad
   > Blocks: 0            Seconds: 4
   > contract address:    0x7416DB6a1021e61cdA12dce8cE99d14c21D2d379
   > block number:        591799
   > block timestamp:     1598507334
   > account:             0x10aCB77eB8dB440fdD9b188a68DA406344c1Eb8b
   > balance:             989984.666132051000000002
   > gas used:            1994307 (0x1e6e43)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.03988614 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.03988614 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.04439496 ETH
```

#TToken RETH VETH
```
0xF115Ed3c4FB7f58a24E1fa4065C58660410Dedb4

0x0cEeD9D6CFD5558f0dA79FA21644E4c7Ff106c8F

SWAPTOKEN  
0xead336e2D75E30fBa5CaDb93c5D667EfB5a3B546
0x60056b8C36B87c073839C86c23034ED931416486


0xc08278079cc6Ec0601adb2BCF1bb50F829955254


0xb1ddf7186B013388766e05d4F724B8cE8c1d5536
0x431D57Fa1dAe7cf0bB64D8aAA94f371962434e59


0xF9a180b5182c816a166F218970181971E1A7de45

```



```
0x10aCB77eB8dB440fdD9b188a68DA406344c1Eb8b      :       balance: 1016344.808062484000000002 ether
0xead336e2D75E30fBa5CaDb93c5D667EfB5a3B546      :       balance: 1999.981812247 ether
0x0DB1bB1097ac3b7e26B3A4Cf35E2f19E07d24568      :       balance: 81012.398237400999999998 ether
0x922B5Be55DfC704904c5Ba8880Cc19904108e94d      :       balance: 199.873355919 ether
0x5792F745F632FE6aC28f65E4ffE606D5c9FD9393      :       balance: 999.997346095 ether
0xb1ddf7186B013388766e05d4F724B8cE8c1d5536      :       balance: 999.998212971 ether
0x9842495d6bAB5Cb632777Ff25B5b4c1e1d595f24      :       balance: 999.999949653 ether
0x56bC5065B4bA121D6d5602eA031a92dD2e40ce95      :       balance: 100 ether
0x5B7308eFea5Bd38F40f6B9BA520F6860097b20e7      :       balance: 100 ether
0xbfc2A5C1ff1f1f92B623Ff538740FaA3dA674cAe      :       balance: 99.996074266 ether
0x3e3205d47C25fDFe993C9C078dE5b458Aa2ae81E      :       balance: 100 ether
0x6f86a02Ff1d4Fa04c0601b03aA3d5723457d3C3b      :       balance: 100 ether
0x0167582C77A542936Ef24c400d866774C4162796      :       balance: 100 ether
0x0ae56143c19e998f94A18310e4dB8Ada5Eff22CA      :       balance: 100 ether
0xA87B4A3577179dC9B55d70Ad5803531182650961      :       balance: 100 ether
0x4CddBeE4e135CAd03777fC3F3AAd5169342585A1      :       balance: 100 ether
0xBe33448627D7D120FE29dcBfaC63fe82145DAebc      :       balance: 100 ether
0xd4b3b3d6bf9310CdcC2d624E0306eA96201e3E61      :       balance: 100 ether
0xa60E16076136FdFa7300CA07D76833220066093B      :       balance: 100 ether
0xf0E9d08b9d5a647B91F9313aCA2f3E858ad68c13      :       balance: 100 ether
0x579Ad95EBee0454f99ae3f8aC8cf38A4E29cC281      :       balance: 100 ether
0xA86b3732FeE440d96612e71Ba2d51F9bf31da483      :       balance: 100 ether
0x2E3F7D1782f2312D827b167b651f1c359a2F6C0b      :       balance: 100 ether
0x5Ad105A6e805BdDb9F7EE27996e74E22b7eaf93b      :       balance: 100 ether
0x11a2dcdaaee3F680309F886b0Ba96eAEc00FfBc9      :       balance: 100 ether
0xbBd13Db829449265B1f6f3BcDFf3D338dFAD6B12      :       balance: 100 ether
0x7cA4c6E828b6131B667036d41E4EbF301038Fc6a      :       balance: 100 ether
0x95f4020999988564dB8ebb7C6b0D901290dFc461      :       balance: 100 ether
0x68B96e13f1E1BEcbf8Fffc9106bF5837c760d736      :       balance: 100 ether
0xf5B8e50DbB1003aa98596F6Af6E24602eb1cBD24      :       balance: 100 ether
0x023dccE9B0dAB8c7C6A36fA40846aB4710211895      :       balance: 100 ether
0x16E8615aE8c8eE58eEABF407C057348D57b2a149      :       balance: 100 ether
0xBe919da58e33c046aD76D1E3FC9B5D32d077fF36      :       balance: 100 ether
0xF2eD13711F719012Af9191f37b783A78B964Bb8F      :       balance: 100 ether
0x0B52a3538886C37e0176ac63cC5b8de5979332e3      :       balance: 100 ether
0x624b563768249DA0d8C8c5f68727E0E85A4Cc4cA      :       balance: 100 ether
0xAd5de8EBFBAbC43E4229C205554E4EDd1C0E75BE      :       balance: 100 ether
0x0642d8446fFCc3500855025709d7D5AebF5e42c4      :       balance: 100 ether
0x3a43A6CDc8648B6E4C49D2070ACCd38DFD573Ba8      :       balance: 100 ether
0x5DA37Aaba5e14Cc31CE2FA8952d52a53e60fD4d2      :       balance: 100 ether
0x6E1433A2C6472B8579c63355189c6e1DE805378C      :       balance: 100 ether
0x83b395Cdce24b923274903cCBd6e08544db731B3      :       balance: 100 ether
0xc483e56E8154fA1dDA81aE7eE536f9260e8Bd3dc      :       balance: 100 ether
0x5Edf8D00A7257768Aa03a943e856C654ad516AaD      :       balance: 100 ether
0x839d2886f4146d591a89220E2A00a2562D22EC2A      :       balance: 100 ether
0xf525a3c6784259B0F42d4C0ca0c79D765a9cDbDC      :       balance: 100 ether
0x5d283e9422e036f017a3e82246c5Afa3183d4068      :       balance: 100 ether
0x2BF0297a2edCA2D7f75A12d676A7B0B0a802e025      :       balance: 100 ether
0x9270347c42F243d04524E631957Eb8092B47123A      :       balance: 100 ether
0x1E996C8556cDDf2124c4832C29a1FBD79f5CCE58      :       balance: 100 ether
0xBEaf3821278DD8F573aBee72A39134aDA8A89C4f      :       balance: 100 ether
```





21.4. infura.io web3.js 開發
21.4.1. Web3 通過 infura 連接到 Ropsten 測試網絡

```
fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/CsS9shwaAab0z7B4LP2d');
console.log(web3.version)
const abi = fs.readFileSync('output/TokenERC20.abi', 'utf-8');

const contractAddress = "0x70682386d0dE84B1e549DC3c4305CCB2D261b2a8";
const coinbase = "0xB94054c174995AE2A9E7fcf6c7924635FBa8ECF7";
const toAddress = "0xf56b81a2bcb964D2806071e9Be4289A5559BB0fA";

balanceWei = web3.eth.getBalance(coinbase);
console.log(balanceWei);

const contract = new web3.eth.Contract(JSON.parse(abi), contractAddress, { from: coinbase , gas: 100000});

contract.methods.balanceOf(coinbase).call().then(console.log).catch(console.error);
contract.methods.balanceOf(toAddress).call().then(console.log).catch(console.error);	
```	
			
21.4.2. 使用 truffle-hdwallet-provider 連接到 https://ropsten.infura.io
```		
fs = require('fs');
const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = "drill hunt food team moment mistake bird attitude tunnel ecology sister resist";
const web3 = new Web3(new HDWalletProvider(mnemonic,'https://ropsten.infura.io/CsS8shwaCab0a7B4LP2d'));
console.log(web3.version)
const abi = fs.readFileSync('output/TokenERC20.abi', 'utf-8');

const contractAddress = "0x70682386d0dE84B1e549DC3c4305CCB2D261b2a8";
const coinbase = "0xB94054c174995AE2A9E7fcf6c7924635FBa8ECF7";
const toAddress = "0xf56b81a2bcb964D2806071e9Be4289A5559BB0fA";

balanceWei = web3.eth.getBalance(coinbase);
console.log(balanceWei);

const contract = new web3.eth.Contract(JSON.parse(abi), contractAddress, { from: coinbase , gas: 100000});

contract.methods.balanceOf(coinbase).call().then(console.log).catch(console.log);
contract.methods.balanceOf(toAddress).call().then(console.log).catch(console.log);
```
			
21.4.3. 轉賬

```	
	const coinbase = "0xB94054c174995AE2A9E7fcf6c7924635FBa8ECF7";
	const toAddress = "0xf56b81a2bcb964D2806071e9Be4289A5559BB0fA";			
	const privateKey = "e33ea581d88e0bd2270c0fd109604039a3de59671b6d69882b4cb4688d3dcffd"
	
	var nonce = await web3.eth.getTransactionCount(coinbase);
	var gasPrice = await web3.eth.getGasPrice();
	console.log(`gasPrice: ${gasPrice}\n`)
    var gasLimit = 1000000;
	var transferAmount = 1000;
    var chainId = 1;

    var rawTransaction = {
        "from": coinbase,
        "nonce":  web3.utils.toHex(count),
        "gasPrice": web3.utils.toHex(gasPrice),
        "gasLimit": web3.utils.toHex(gasLimit),
        "to": toAddress,
        "value": "100",
        "data": "0x0",
        "chainId": web3.utils.toHex(chainId)
    };
   
    var privateKey = new Buffer(privateKey, 'hex');
    var tx = new Tx(rawTransaction);
    tx.sign(privateKey);
    var serializedTx = tx.serialize();

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log);
			
			
			
'use strict';
const Web3 = require('web3');

const wsAddress = 'wss://rinkeby.infura.io/ws';
const contractJson = '(taken from solc or remix online compiler)';
const privateKey = '0xOOOX';
const contractAddress = '0xOOOX';
const walletAddress = '0xOOOX';

const webSocketProvider = new Web3.providers.WebsocketProvider(wsAddress);
const web3 = new Web3(new Web3.providers.WebsocketProvider(webSocketProvider));
const contract = new web3.eth.Contract(
  JSON.parse(contractJson),
  contractAddress
);
// change this to whatever contract method you are trying to call, E.G. SimpleStore("Hello World")
const query = contract.methods.SimpleStore('Hello World');
const encodedABI = query.encodeABI();
const tx = {
  from: walletAddress,
  to: contractAddress,
  gas: 2000000,
  data: encodedABI,
};

const account = web3.eth.accounts.privateKeyToAccount(privateKey);
console.log(account);
web3.eth.getBalance(walletAddress).then(console.log);

web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
  const tran = web3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .on('confirmation', (confirmationNumber, receipt) => {
      console.log('=> confirmation: ' + confirmationNumber);
    })
    .on('transactionHash', hash => {
      console.log('=> hash');
      console.log(hash);
    })
    .on('receipt', receipt => {
      console.log('=> reciept');
      console.log(receipt);
    })
    .on('error', console.error);
});
```
			
21.4.4. 執行合約

s```
const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3("https://mainnet.infura.io/CsS9shwaAab0z7B4LP2d");
const Tx = require('ethereumjs-tx');

const abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_status","type":"bool"}],"name":"setAirdropStatus","outputs":[{"name":"status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"airdropStatus","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_mintedAmount","type":"uint256"}],"name":"mintAirdropToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_lock","type":"bool"}],"name":"setLock","outputs":[{"name":"status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"airdropCurrentTotal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"mintedAmount","type":"uint256"}],"name":"mintToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"setAirdropAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"frozenAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"airdropTotalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"touched","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"freeze","type":"bool"}],"name":"freezeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"lock","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"airdropAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"},{"name":"decimalUnits","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"target","type":"address"},{"indexed":false,"name":"frozen","type":"bool"}],"name":"FrozenFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"target","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"AirDrop","type":"event"}];
const address = "0x3e827461Cc53CAE366175A291ed7c629F87CfF39";
const key = "19A57E4F6274AF1E0B9C3F8F7E3503876A850AFEE1912B8B9C5D9358EDEA0362"

const contractAddress = "0x44cCf3d1601427Fe0B0f7588eD058216830cd13C";
const contract = new web3.eth.Contract(abi, contractAddress, { "from": address});

contract.methods.balanceOf(address).call().then(function(balance){
    console.log(balance)
});

contract.methods.decimals().call().then(function(decimals){
    console.log(decimals)
});
    
web3.eth.getGasPrice().then(function(gasPrice){
    var price = Number(gasPrice);

    web3.eth.getTransactionCount(address).then(function(nonce){
        var amount = "1000000";
        contract.methods.mintAirdropToken(amount).estimateGas().then(function(gas){
            var rawTransaction = {
                "nonce": web3.utils.toHex(nonce),
                "from": address,
                "to": contractAddress,
                "gas": web3.utils.toHex(gas),
                "gasPrice": web3.utils.toHex(price),
                // "gasLimit": this.web3.utils.toHex(gasLimit.gasLimit),
                "value": "0x0",
                "data": contract.methods.mintAirdropToken(amount).encodeABI()
            };

            console.log(rawTransaction);
            
            var privateKey = new Buffer.from(key, 'hex');
            var tx = new Tx(rawTransaction);
            tx.sign(privateKey);
            var serializedTx = tx.serialize();

            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', function(txhash){
                console.log(txhash);
            }); 
        });
    });
});

web3.eth.getGasPrice().then(function(gasPrice){
    var price = Number(gasPrice);

    web3.eth.getTransactionCount(address).then(function(nonce){
        var amount = "10";
        contract.methods.setAirdropAmount(amount).estimateGas().then(function(gas){
            var rawTransaction = {
                "nonce": web3.utils.toHex(nonce),
                "from": address,
                "to": contractAddress,
                "gas": web3.utils.toHex(gas),
                "gasPrice": web3.utils.toHex(price),
                "value": "0x0",
                "data": contract.methods.setAirdropAmount(amount).encodeABI()
            };

            console.log(rawTransaction);
            
            var privateKey = new Buffer.from(key, 'hex');
            var tx = new Tx(rawTransaction);
            tx.sign(privateKey);
            var serializedTx = tx.serialize();

            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', function(txhash){
                console.log(txhash);
            }); 
        });
    });
});

web3.eth.getGasPrice().then(function(gasPrice){
    var price = Number(gasPrice);

    web3.eth.getTransactionCount(address).then(function(nonce){
        var status = true;
        contract.methods.setAirdropStatus(status).estimateGas().then(function(gas){
            var rawTransaction = {
                "nonce": web3.utils.toHex(nonce),
                "from": address,
                "to": contractAddress,
                "gas": web3.utils.toHex(gas),
                "gasPrice": web3.utils.toHex(price),
                "value": "0x0",
                "data": contract.methods.setAirdropStatus(status).encodeABI()
            };
            console.log(rawTransaction);
            
            var privateKey = new Buffer.from(key, 'hex');
            var tx = new Tx(rawTransaction);
            tx.sign(privateKey);
            var serializedTx = tx.serialize();

            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', function(txhash){
                console.log(txhash);
            }); 
        });
    });
});			
```	
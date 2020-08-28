const fs = require("fs");
const solc = require('solc')
let Web3 = require('web3');

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var input = {
    'strings.sol': fs.readFileSync('strings.sol', 'utf8'),
    'StringLib.sol': fs.readFileSync('StringLib.sol', 'utf8'),
    'Killable.sol': fs.readFileSync('Killable.sol', 'utf8'),
    'Ownable.sol': fs.readFileSync('Ownable.sol', 'utf8'),
    'LMS.sol': fs.readFileSync('LMS.sol', 'utf8')
};
let compiledContract = solc.compile({sources: input}, 1);
let abi = compiledContract.contracts['LMS.sol:LMS'].interface;
let bytecode = '0x'+compiledContract.contracts['LMS.sol:LMS'].bytecode;
let gasEstimate = web3.eth.estimateGas({data: bytecode});
let LMS = web3.eth.contract(JSON.parse(abi));


var lms = LMS.new("sanchit", "s@a.com", {
   from:web3.eth.coinbase,
   data:bytecode,
   gas: gasEstimate
 }, function(err, myContract){
    if(!err) {
       if(!myContract.address) {
           console.log(myContract.transactionHash) 
       } else {
           console.log(myContract.address) 
       }
    }
  });
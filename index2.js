
const Web3 = require('web3');

// // // Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));




function checkAllBalances() {
web3.eth.getAccounts(function(err, accounts) {
accounts.forEach(function(id) {
web3.eth.getBalance(id, function(err, balance) {
console.log("" + id + ":\tbalance: " + web3.utils.fromWei(balance, "ether") + " ether");
});
});
});
};

checkAllBalances()







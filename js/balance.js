require('dotenv').config();
const fs = require('fs');
const Web3 = require('web3');

// // // Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.HTTP_API_URL || "http://192.168.38.227:18045"));


const writeData = (data, path) => {
    try {
        fs.writeFileSync(
            `./${path}.json`,
            JSON.stringify(data, null, 4)
        );
    } catch (err) {
        console.error(err);
    }
};


function checkAllBalances() {
    web3.eth.getAccounts(function (err, accounts) {
        writeData(accounts, "accounts");
        accounts.forEach(function (id) {
            web3.eth.getBalance(id, function (err, balance) {
                if (balance > 0) {
                    console.log("" + id + " \t:\tbalance: " + web3.utils.fromWei(balance, "ether") + " ether");
                }
            });
        });
    });
};

checkAllBalances()







const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

// Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// // Compile the source code
// const input = fs.readFileSync('TToken.sol','utf8');
// // console.log(input.toString())
// const output = solc.compile(input.toString(), 1);
// const bytecode = output.contracts['TToken'].bytecode;
// const abi = JSON.parse(output.contracts['TToken'].interface);

// // Contract object
// const contract = web3.eth.contract(abi);

// // Deploy contract instance
// const contractInstance = contract.new({
//     data: '0x' + bytecode,
//     from: web3.eth.coinbase,
//     gas: 90000*2
// }, (err, res) => {
//     if (err) {
//         console.log(err);
//         return;
//     }

//     // Log the tx, you can explore status with eth.getTransaction()
//     console.log(res.transactionHash);

//     // If we have an address property, the contract was deployed
//     if (res.address) {
//         console.log('Contract address: ' + res.address);
//         // Let's test the deployed contract
//         testContract(res.address);
//     }
// });


// Quick test the contract

function testContract(address) {
    // Reference to the deployed contract
    const token = contract.at(address);
    // Destination account for test
    const dest_account = '0x10acb77eb8db440fdd9b188a68da406344c1eb8b';

    // Assert initial account balance, should be 100000
    const balance1 = token.balances.call(web3.eth.coinbase);
    console.log(balance1 == 1000000);

    // Call the transfer function
    token.transfer(dest_account, 100, {from: web3.eth.coinbase}, (err, res) => {
        // Log transaction, in case you want to explore
        console.log('tx: ' + res);
        // Assert destination account balance, should be 100 
        const balance2 = token.balances.call(dest_account);
        console.log(balance2 == 100);
    });
}

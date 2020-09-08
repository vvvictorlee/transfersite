// const { MerkleTree } = require("../lib/merkleTree");
const fs = require("fs");
const path = require('path');
// var util = require('../util');
// const erc20_abi = util.loadJson('./abi/ERC20.json');
const { sentSignedTx } = require("./sentSignedTx");


const loadTreem = async (para, fullfileName) => {
    const rawdata = fs.readFileSync(fullfileName);
    const balances = JSON.parse(rawdata);
    // `周期_本期发行总量_Token地址.json`
    //   const token =  fileName.substr(fileName.lastIndexOf("_")+1);
    console.log(fullfileName);
    const fileName = path.basename(fullfileName, ".json");//.substr(fullfileName.lastIndexOf("/")+1);
    const items = fileName.split("_");
    if (items.length < 2) {
        console.log(fileName + " file name parsing failed ");
        return [];
    }
    console.log(items);
    const supply = items[1];
    const token = items[2];
    console.log("+++++++++ issue  flag ===", para.is_issue);
    if (0 != para.is_issue) {
        try {
            //ropsten
            if (3 == para.chain_id) {
                const abi = await para.contract.methods.issue(token, supply).encodeABI();
                console.log("+++++++++ issue ", token);
                await sentSignedTx(para, abi);
            }
            else {
                await para.web3.eth.personal.unlockAccount(para.admin, para.password);
                // let erc20 = new para.web3.eth.Contract(erc20_abi, token);
                // console.log("=============addissuer begin");
                // await erc20.methods.addIssuer(global.CONTRACT_REDEEM).send({ from: para.admin });

                // console.log("=============issue begin");

                await para.contract.methods.issue(token, supply).send({ from: para.admin });
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // console.log("=============issue end");

    let elements = [];
    let origelements = [];
    let balance;
    let leaf;
    console.log(balances);
    Object.keys(balances).forEach(address => {
        // balance = para.utils.toWei(balances[address]);
        balance = (balances[address]);
        if (address === "0xAdmin") {
            address = para.admin;
        }
        origelements.push([address, token, balance]);
        console.log("address, token, balance====", address, token, balance);
        leaf = para.web3.utils.soliditySha3(address, token, balance);
        console.log(leaf);
        elements.push(leaf);
    });
    console.log("=============loadtreem=====" + elements);
    return [elements, origelements];
};

module.exports = { loadTreem };

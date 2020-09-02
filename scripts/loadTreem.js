const { MerkleTree } = require("../lib/merkleTree");
const fs = require("fs");
const path = require('path');
var util = require('../util');
const erc20_abi = util.loadJson('./abi/ERC20.json');
require('../conf/const_private');


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


    console.log("=============issue");
    await para.utils.eth.personal.unlockAccount(para.admin, para.password);
    console.log("=============issue");
    let erc20 = new para.utils.eth.para.contract(erc20_abi, token);
    await erc20.methods.addIssuer(global.para.contract_REDEEM).send({ from: para.admin });
    console.log("============3333=issue");
    await para.contract.methods.issue(token, supply).send({ from: para.admin });
    console.log("=============issue");

    let elements = [];
    let balance;
    let leaf;

    Object.keys(balances).forEach(address => {
        // balance = para.utils.toWei(balances[address]);
        balance = (balances[address]);
        if (address === "0xpara.admin") {
            address = para.admin;
        }
        leaf = para.utils.soliditySha3(address, token, balance);
        elements.push(leaf);
    });

    return elements;
};

module.exports = { loadTreem };

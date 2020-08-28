const { MerkleTree } = require("../lib/merkleTree");
const fs = require("fs");

const loadTreem = (utils, fileName) => {
  const rawdata = fs.readFileSync(fileName);
  const balances = JSON.parse(rawdata);
  const token =  fileName.substr(fileName.lastIndexOf("_")+1);

  let elements = [];
  let balance;
  let leaf;

  Object.keys(balances).forEach(address => {
    balance = utils.toWei(balances[address]);
    leaf = utils.soliditySha3(address,token,balance);
    elements.push(leaf);
  });

  return elements;
};

module.exports = { loadTreem };

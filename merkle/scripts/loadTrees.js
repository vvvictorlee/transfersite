const { MerkleTree } = require("../lib/merkleTree");
const fs = require("fs");
const {getJsonFileList} = require("./getJsonFileList.js")
const { loadTreem } = require("./loadTreem");

const loadTrees = (utils,filePath) => {
  const jsonFiles = getJsonFileList(filePath);

  let elements = [];
  let balance;
  let nextElements;

  Object.keys(jsonFiles).forEach(fileName => {
    nextElements = loadTreem(utils,fileName);
    elements.concat(nextElements);
  });

  return new MerkleTree(elements);
};

module.exports = { loadTrees };

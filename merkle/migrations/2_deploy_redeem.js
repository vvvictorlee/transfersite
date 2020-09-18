const TToken = artifacts.require("./TToken.sol");
const Redeem = artifacts.require("./MerkleRedeem.sol");
const RedeemHelper = artifacts.require("./MerkleRedeemHelper.sol");
const { utils } = web3;

module.exports = (deployer, network, accounts) => {
  const admin = accounts[0]; // "0x77c845E6A61F37cB7B237de90a74fbc3679FcF06"; // on Kovan
  deployer.then(async () => {
    await deployer.deploy(TToken);
    const token = await TToken.deployed();
    await token.initialize("Test vBal", "DVBAL", 180000);
    // await token.issue(admin, utils.toWei("145"));
   
    await deployer.deploy(TToken);
    const token1 = await TToken.deployed();
    await token.initialize("Testr Bal", "DRBAL", 1800000);
    // await token1.issue(admin, utils.toWei("14"));

    await deployer.deploy(Redeem);
    const redeem = await Redeem.deployed();

    await deployer.deploy(RedeemHelper);
    const redeemHelper = await RedeemHelper.deployed();
    redeemHelper.setAddress(redeem.address);

    // await token.transfer(redeem.address, utils.toWei("20000"));
  });
};

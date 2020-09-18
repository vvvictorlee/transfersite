const TToken = artifacts.require("./TToken.sol");
const Redeem = artifacts.require("./MerkleRedeem.sol");
const RedeemHelper = artifacts.require("./MerkleRedeemHelper.sol");
const should = require("chai").should();
const { promisify } = require("util");
const { utils } = web3;
const { MerkleTree } = require("../lib/merkleTree");
const { increaseTime } = require("./helpers");
const truffleAssert = require("truffle-assertions");

contract("MerkleRedeem", accounts => {
    const admin = accounts[0];

    let redeem;
    let REDEEM;
    let redeemHelper;
    let REDEEMHELPER;

    let tbal;
    let TBAL;
    // these are deterministic because accounts are deterministic for the ganache mnemonic
    const endingBlockHash =
        "0x76e2419510611ed9dceb203644e997aae76fb195d6420f8bee64368b14303312";
    const expectedOffsetSeconds = [
        581200,
        171952,
        63845,
        503077,
        284922,
        44468,
        25715,
        559291,
        98173,
        588157
    ];

    beforeEach(async () => {
        tbal = await TToken.new();
        await tbal.initialize("Test Bal", "DTBAL", utils.toWei("5760000"));

        TBAL = tbal.address;

        redeem = await Redeem.new();
        REDEEM = redeem.address;
        tbal.addIssuer(REDEEM);
        await redeem.issue(TBAL, utils.toWei("19200"));

        // await tbal.transfer(REDEEM, utils.toWei("2"));
    });


    it("stores an allocation", async () => {
        let claimBalance = utils.toWei("9876");
        const lastBlock = await web3.eth.getBlock("latest");

        await redeem.finishEpoch(1, lastBlock.timestamp, lastBlock.hash);

        const elements = [utils.soliditySha3(accounts[0], TBAL, claimBalance)];
        const merkleTree = new MerkleTree(elements);
        const root = merkleTree.getHexRoot();

        await redeem.seedAllocations(1, root);

        const proof = merkleTree.getHexProof(elements[0]);

        let result = await redeem.verifyClaim(accounts[0], 1, TBAL, claimBalance, proof);
        assert(result, "user should have an allocation");
    });

   

    describe("When a user has several allocation to claim", () => {


        beforeEach(async () => {
            tbal = await TToken.new();
            await tbal.initialize("Test Bal", "DTBAL", utils.toWei("5760000"));
            // await tbal.issue(admin, utils.toWei("14"));
            TBAL = tbal.address;

            redeem = await Redeem.new();
            REDEEM = redeem.address;
            tbal.addIssuer(REDEEM);
            await redeem.issue(TBAL, utils.toWei("19200"));

            const claimBalance1 = utils.toWei("1000");
            const elements1 = [utils.soliditySha3(accounts[1], TBAL, claimBalance1)];
            const merkleTree1 = new MerkleTree(elements1);
            const root1 = merkleTree1.getHexRoot();

            const claimBalance2 = utils.toWei("1234");
            const elements2 = [utils.soliditySha3(accounts[1], TBAL, claimBalance2)];
            const merkleTree2 = new MerkleTree(elements2);
            const root2 = merkleTree2.getHexRoot();

            let lastBlock = await web3.eth.getBlock("latest");

            await redeem.finishEpoch(1, lastBlock.timestamp, lastBlock.hash);
            await redeem.seedAllocations(1, root1);

            await increaseTime(7);
            lastBlock = await web3.eth.getBlock("latest");
            let lastBlockHash =
                "0xb6801f31f93d990dfe65d67d3479c3853d5fafd7a7f2b8fad9e68084d8d409e0"; // set this manually to simplify testing
            await redeem.finishEpoch(2, lastBlock.timestamp, lastBlockHash);
            await redeem.seedAllocations(2, root2);
        });


        it("Allows the user to claim multiple epochs at once", async () => {

            const claimBalance1 = utils.toWei("1000");
            const elements1 = [utils.soliditySha3(accounts[1], TBAL, claimBalance1)];
            const merkleTree1 = new MerkleTree(elements1);
            const root1 = merkleTree1.getHexRoot();

            const claimBalance2 = utils.toWei("1234");
            const elements2 = [utils.soliditySha3(accounts[1], TBAL, claimBalance2)];
            const merkleTree2 = new MerkleTree(elements2);
            const root2 = merkleTree2.getHexRoot();

            await increaseTime(8);

            let claimedBalance1 = utils.toWei("1000");
            let claimedBalance2 = utils.toWei("1234");

            const proof1 = merkleTree1.getHexProof(elements1[0]);
            const proof2 = merkleTree2.getHexProof(elements2[0]);

            await redeem.claimEpochs(
                accounts[1],
                [[1, TBAL, claimedBalance1, proof1], [2, TBAL, claimedBalance2, proof2]],
                { from: accounts[1] }
            );

            let result = await tbal.balanceOf(accounts[1]);
            assert(
                result == utils.toWei("2234"),
                "user should receive all tokens, including current epoch"
            );
        });



    });

    ///////////////////MerkleRedeemHelper//////////////////

    describe("When a user has several allocation to claim by helper", () => {

        beforeEach(async () => {
            tbal = await TToken.new();
            await tbal.initialize("Test Bal", "DTBAL", utils.toWei("5760000"));
            // await tbal.issue(admin, utils.toWei("14"));
            TBAL = tbal.address;

            redeem = await Redeem.new();
            REDEEM = redeem.address;
            tbal.addIssuer(REDEEM);
            await redeem.issue(TBAL, utils.toWei("19200"));

            redeemHelper = await RedeemHelper.new();
            REDEEMHELPER = redeemHelper.address;
            redeemHelper.setAddress(REDEEM);

            const claimBalance1 = utils.toWei("1000");
            const elements1 = [utils.soliditySha3(accounts[1], TBAL, claimBalance1)];
            const merkleTree1 = new MerkleTree(elements1);
            const root1 = merkleTree1.getHexRoot();

            const claimBalance2 = utils.toWei("1234");
            const elements2 = [utils.soliditySha3(accounts[1], TBAL, claimBalance2)];
            const merkleTree2 = new MerkleTree(elements2);
            const root2 = merkleTree2.getHexRoot();

            let lastBlock = await web3.eth.getBlock("latest");

            await redeem.finishEpoch(1, lastBlock.timestamp, lastBlock.hash);
            await redeem.seedAllocations(1, root1);

            await increaseTime(7);
            lastBlock = await web3.eth.getBlock("latest");
            let lastBlockHash =
                "0xb6801f31f93d990dfe65d67d3479c3853d5fafd7a7f2b8fad9e68084d8d409e0"; // set this manually to simplify testing
            await redeem.finishEpoch(2, lastBlock.timestamp, lastBlockHash);
            await redeem.seedAllocations(2, root2);
        });


        it("Allows the user to claim multiple epochs at once by helper", async () => {

            const claimBalance1 = utils.toWei("1000");
            const elements1 = [utils.soliditySha3(accounts[1], TBAL, claimBalance1)];
            const merkleTree1 = new MerkleTree(elements1);
            const root1 = merkleTree1.getHexRoot();

            const claimBalance2 = utils.toWei("1234");
            const elements2 = [utils.soliditySha3(accounts[1], TBAL, claimBalance2)];
            const merkleTree2 = new MerkleTree(elements2);
            const root2 = merkleTree2.getHexRoot();

            await increaseTime(8);

            let claimedBalance1 = utils.toWei("1000");
            let claimedBalance2 = utils.toWei("1234");

            const proof1 = merkleTree1.getHexProof(elements1[0]);
            const proof2 = merkleTree2.getHexProof(elements2[0]);

            await redeemHelper.claimEpochs(
                accounts[1],
                [[1, TBAL, claimedBalance1, proof1], [2, TBAL, claimedBalance2, proof2]],
                { from: accounts[1] }
            );

            let result = await tbal.balanceOf(accounts[1]);
            assert(
                result == utils.toWei("2234"),
                "user should receive all tokens, including current epoch"
            );
        });


    });
});

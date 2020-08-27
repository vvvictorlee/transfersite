
const Web3 = require('web3');
const { MerkleTree } = require("./merkleTree");

// // // Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

const admin = "0x10aCB77eB8dB440fdD9b188a68DA406344c1Eb8b";
const password = "123456";
const REDEEM = "0x7416DB6a1021e61cdA12dce8cE99d14c21D2d379";//Redeem.methods.address;
const TTOKEN_ = "0xF115Ed3c4FB7f58a24E1fa4065C58660410Dedb4";
const user1 = "0x922b5be55dfc704904c5ba8880cc19904108e94d";



// Redeem.methods. =  Redeem.new(TBAL);

// tbal.


const epochblocks = 40320 + 10;

////step 1
let tabi = require("./TToken.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let TToken = new web3.eth.Contract(tabi, TTOKEN_);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
// console.log(TToken.methods)


////step 2
let abi = require("./MerkleRedeem.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let Redeem = new web3.eth.Contract(abi, REDEEM);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
// console.log(Redeem.methods)

const token1 = "0xF115Ed3c4FB7f58a24E1fa4065C58660410Dedb4";

const token2 = "0x0cEeD9D6CFD5558f0dA79FA21644E4c7Ff106c8F";


// transferToken(REDEEM, );
(async function () {

    ////step 3
    await web3.eth.personal.unlockAccount(admin, password);

    // await TToken.methods.mint(admin, web3.utils.toWei("145000")).send({ from: admin });

    ////step 4 tran

    let amt = await TToken.methods.balanceOf(admin).call({ from: admin });
    console.log(amt);

    // await TToken.methods.transfer(REDEEM, web3.utils.toWei("20000")).send({ from: admin });
    let amt1 = await TToken.methods.balanceOf(REDEEM).call({ from: admin });
    console.log(amt1);


    // // //  //step5
    // let epoch1Block = (await web3.eth.getBlock(1));


    const claimBalance1 = web3.utils.toWei("1000");
    const elements1 = [web3.utils.soliditySha3(user1, token1, claimBalance1)];
    const merkleTree1 = new MerkleTree(elements1);
    const root1 = merkleTree1.getHexRoot();
    console.log(root1);


    // await Redeem.methods.finishEpoch(1, epoch1Block.timestamp, epoch1Block.hash).send({ from: admin });  
    // await Redeem.methods.seedAllocations(1, root1).send({ from: admin });


    // // //step6
    const claimBalance2 = web3.utils.toWei("1234");
    const elements2 = [web3.utils.soliditySha3(user1, token1, claimBalance2)];
    const merkleTree2 = new MerkleTree(elements2);
    const root2 = merkleTree2.getHexRoot();
    console.log(root2);

    let epoch2Block = (await web3.eth.getBlock(epochblocks * 5));

    // await Redeem.methods.finishEpoch(5, epoch2Block.timestamp, epoch2Block.hash).send({ from: admin });
    // await Redeem.methods.seedAllocations(5, root2).send({ from: admin });


    // //step7

    await web3.eth.personal.unlockAccount(user1, password);

    let claimedBalance1 = web3.utils.toWei("1000");
    let claimedBalance2 = web3.utils.toWei("1234");

    const proof1 = merkleTree1.getHexProof(elements1[0]);
    // await Redeem.methods.claimEpoch(user1, 1, token1,claimedBalance1, proof1  ).send({ from: user1 });


    const proof2 = merkleTree2.getHexProof(elements2[0]);
    // await Redeem.methods.claimEpoch(user1, 2,token1, claimedBalance2, proof2  ).send({ from: user1 });


    let result = await Redeem.methods.verifyClaim(user1, 1, token1, claimedBalance1, proof1).call({ from: user1 });
    console.log(result);
    let result1 = await Redeem.methods.merkleRoots(1, 3).call({ from: user1 });
    console.log(result1);


    // //step8
    // let claimedBalance1 = web3.utils.toWei("1000");
    // let claimedBalance2 = web3.utils.toWei("1234");

    // const proof1 = merkleTree1.getHexProof(elements1[0]);
    // const proof2 = merkleTree2.getHexProof(elements2[0]);

    // await Redeem.methods.claimEpochs(
    //     user1,
    //     [[1, token1,claimedBalance1, proof1], [2, token1,claimedBalance2, proof2]]
    // ).send({ from: user1 });

    //   //step9
    // let result = await TToken.methods.balanceOf(user1).call({ from: user1 });
    // console.log(result);

})();


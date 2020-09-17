
const Web3 = require('web3');
const { MerkleTree } = require("../lib/merkleTree");

// // // Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

let admin = "0x10aCB77eB8dB440fdD9b188a68DA406344c1Eb8b";
const password = "123456";
let REDEEM = "0x3d3eb386130698320318C8EF39f3a119b65FDAc7";//"0x7416DB6a1021e61cdA12dce8cE99d14c21D2d379";//Redeem.methods.address;
const REDEEM1 = "0x62966982124cD83bBB09158Fc3B7093F3e87EB25";
REDEEM=REDEEM1;
const TTOKEN_ = "0x1EF4a073b848Ae730eE1397e3b73B83Daf3Be7C0";//"0xF115Ed3c4FB7f58a24E1fa4065C58660410Dedb4";
const user1 = "0x922b5be55dfc704904c5ba8880cc19904108e94d";

const admin5 = "0xbfc2A5C1ff1f1f92B623Ff538740FaA3dA674cAe";
const admin1 = "0xead336e2D75E30fBa5CaDb93c5D667EfB5a3B546";
const admin2 = "0xb1ddf7186B013388766e05d4F724B8cE8c1d5536";
const admin4 = "0x9842495d6bAB5Cb632777Ff25B5b4c1e1d595f24";
const admin0 = "0x0DB1bB1097ac3b7e26B3A4Cf35E2f19E07d24568";
const admin6 = "0xf5B8e50DbB1003aa98596F6Af6E24602eb1cBD24";
// 0x62966982124cD83bBB09158Fc3B7093F3e87EB25
admin = admin6;

// Redeem.methods. =  Redeem.new(TBAL);

// tbal.


const epochblocks = 40320 + 10;

////step 1
let tabi = require("../json/TToken.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let TToken = new web3.eth.Contract(tabi, TTOKEN_);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
// console.log(TToken.methods)


////step 2
let abi = require("../json/MerkleRedeem3.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let Redeem = new web3.eth.Contract(abi, REDEEM);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
// console.log(Redeem.methods)

const token1 = "0x1EF4a073b848Ae730eE1397e3b73B83Daf3Be7C0";

const token2 = "0x0cEeD9D6CFD5558f0dA79FA21644E4c7Ff106c8F";


let handlers = {
    "b": (async function () {
        // await buildsql(process.argv[3]);
    }),
    "cs": (async function () {
        await claims();
    }),
    "c": (async function () {
        await claim();
    }),
    "default": (async function () {
        await usageFunc();
    })

};

// console.log(process.argv);
const f = handlers[process.argv[2]] || handlers["default"];
f();


// transferToken(REDEEM, );
(async function () {



})();
async function usageFunc()
{
    await merkleRoots();
    await epochtimestamps();
}
let result = "";
async function claims()
{

    ////step 3
    await web3.eth.personal.unlockAccount(admin, password);

    
    // // //  //step5
    let epoch1Block = (await web3.eth.getBlock(1));


    const claimBalance1 = web3.utils.toWei("1000");
    console.log(user1, token1, claimBalance1);
    const elements1 = [web3.utils.soliditySha3(user1, token1, claimBalance1), web3.utils.soliditySha3(user1, token1, claimBalance1)];
    const merkleTree1 = new MerkleTree(elements1);
    const root1 = merkleTree1.getHexRoot();
    console.log(root1);


    // // //step6
    const claimBalance2 = web3.utils.toWei("1234");
    const elements2 = [web3.utils.soliditySha3(user1, token1, claimBalance2), web3.utils.soliditySha3(user1, token2, claimBalance2)];
    const merkleTree2 = new MerkleTree(elements2);
    const root2 = merkleTree2.getHexRoot();
    console.log(root2);

    let epoch2Block = (await web3.eth.getBlock(epochblocks * 1));
    const cycle1 = 1;
    const cycle2 = 2;

    await Redeem.methods.finishEpoch(cycle1, epoch1Block.timestamp, epoch1Block.hash).send({ from: admin });
    await Redeem.methods.seedAllocations(cycle1, root1).send({ from: admin });

    await Redeem.methods.finishEpoch(cycle2, epoch2Block.timestamp, epoch2Block.hash).send({ from: admin });
    await Redeem.methods.seedAllocations(cycle2, root2).send({ from: admin });


    // //step7

    // await web3.eth.personal.unlockAccount(user1, password);

    const proof1 = merkleTree1.getHexProof(elements1[0]);
    console.log(elements1[0], elements1, merkleTree1, "1111===", proof1);
    // await Redeem.methods.claimEpoch(cycle1, token1,claimBalance1, proof1  ).send({ from: user1 });


    const proof2 = merkleTree2.getHexProof(elements2[0]);
    // await Redeem.methods.claimEpoch(user1, cycle2,token1, claimBalance2, proof2  ).send({ from: user1 });


     result = await Redeem.methods.verifyClaim(user1, cycle1, token1, claimBalance1, proof1).call({ from: user1 });
    console.log(result);
    let result1 = await Redeem.methods.merkleRoots(1, 3).call({ from: user1 });
    console.log(result1);


    //step8
    await Redeem.methods.claimEpochs(
        user1,
        [[cycle1, token1,claimBalance1, proof1], [cycle2, token1,claimBalance2, proof2]]
    ).send({ from: admin });

    //step9
    result = await TToken.methods.balanceOf(user1).call({ from: user1 });
    console.log(result);
}


async function claim()
{

    ////step 3
    await web3.eth.personal.unlockAccount(admin, password);

    
    // // //  //step5
    let epoch1Block = (await web3.eth.getBlock(1));


    const claimBalance1 = web3.utils.toWei("1000");
    console.log(user1, token1, claimBalance1);
    const elements1 = [web3.utils.soliditySha3(user1, token1, claimBalance1), web3.utils.soliditySha3(user1, token1, claimBalance1)];
    const merkleTree1 = new MerkleTree(elements1);
    const root1 = merkleTree1.getHexRoot();
    console.log(root1);


    await Redeem.methods.finishEpoch(1, epoch1Block.timestamp, epoch1Block.hash).send({ from: admin });
    await Redeem.methods.seedAllocations(1, root1).send({ from: admin });


    // // //step6
    const claimBalance2 = web3.utils.toWei("1234");
    const elements2 = [web3.utils.soliditySha3(user1, token1, claimBalance2), web3.utils.soliditySha3(user1, token2, claimBalance2)];
    const merkleTree2 = new MerkleTree(elements2);
    const root2 = merkleTree2.getHexRoot();
    console.log(root2);

    let epoch2Block = (await web3.eth.getBlock(epochblocks * 1));

    // await Redeem.methods.finishEpoch(7, epoch2Block.timestamp, epoch2Block.hash).send({ from: admin });
    // await Redeem.methods.seedAllocations(6, root2).send({ from: admin });


    // //step7

    // await web3.eth.personal.unlockAccount(user1, password);

    const proof1 = merkleTree1.getHexProof(elements1[0]);
    console.log(elements1[0], elements1, merkleTree1, "1111===", proof1);
    // await Redeem.methods.claimEpoch(1, token1,claimBalance1, proof1  ).send({ from: user1 });


    // const proof2 = merkleTree2.getHexProof(elements2[0]);
    // await Redeem.methods.claimEpoch(user1, 2,token1, claimBalance2, proof2  ).send({ from: user1 });


    // let result = await Redeem.methods.verifyClaim(user1, 1, token1, claimBalance1, proof1).call({ from: user1 });
    // console.log(result);
    // let result1 = await Redeem.methods.merkleRoots(1, 3).call({ from: user1 });
    // console.log(result1);


    //step8
    await Redeem.methods.claimEpochs(
        user1,
        [[1, token1,claimBalance1, proof1], [2, token1,claimBalance2, proof2]]
    ).send({ from: admin });

    //step9
    let result = await TToken.methods.balanceOf(user1).call({ from: user1 });
    console.log(result);
}


async function test()
{
//     // await TToken.methods.issue(admin, web3.utils.toWei("145000")).send({ from: admin });

    //     ////step 4 tran

    //     let amt = await TToken.methods.balanceOf(user1).call({ from: user1 });
    //     console.log(amt);

    //     // await TToken.methods.transfer(REDEEM, web3.utils.toWei("20000")).send({ from: admin });
    //     let amt1 = await TToken.methods.balanceOf(REDEEM).call({ from: admin });
    //     console.log(amt1);
    // amt1 = await TToken.methods.name().call({ from: admin });
    //     console.log(amt1);
    // amt1 = await TToken.methods.symbol().call({ from: admin });
    // console.log(amt1);
}

async function merkleRoots() {
    console.log("=====merkleRoots=======");


    let result1 = await Redeem.methods.merkleRoots(1, 7).call({ from: user1 });
    console.log(result1);

}


async function tokensymbol() {
    console.log("=====tokensymbol=======");
    for (const t of tokens) {
        let tc = new web3.eth.Contract(tabi, t);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63

        let symbol = await tc.methods.symbol().call();
        console.log("symbol==", symbol, "== token address==", t);

    }

}



async function epochtimestamps() {
    console.log("=====epochtimestamps=======");

    for (let i = 0; i < 8; i++) {
        const s = await Redeem.methods.epochTimestamps(i + 1).call();
        console.log(i, s);
    }


}

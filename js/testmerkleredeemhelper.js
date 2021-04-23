
const Web3 = require('web3');
const { MerkleTree } = require("../lib/merkleTree");

// // // Connect to local Ethereum node
// const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));

// const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-ropsten.alchemyapi.io/v2/Z42Blpj7cANVPl6vizpQbu_DibFlfWWj'));
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/206de317234e48e28a7dd1abbd914e26'));

let admin = "0x10aCB77eB8dB440fdD9b188a68DA406344c1Eb8b";
const password = "123456";
let REDEEM = "0x3d3eb386130698320318C8EF39f3a119b65FDAc7";//"0x7416DB6a1021e61cdA12dce8cE99d14c21D2d379";//Redeem.methods.address;
const REDEEM1 = "0x62966982124cD83bBB09158Fc3B7093F3e87EB25";
const REDEEM_ROPSTEN = "0x72c09d4fd187b4336fa4ab66e4360f626619483b";//"0x2a103D4F9d64B4124F0a2Dd556DEee0926A92527";//redeem.address;"0x99B9Bc4Ca03C227d9cBe0960c416adDE7146026F";//
REDEEM = REDEEM_ROPSTEN;
let MERKLEREDEEMHELPER = "0x1d8BF58DB8a130112803d68C841f1DB6dFdD1FB2";//0x793d93D50de119358034D571f383C03BB4ac81c4
const MERKLEREDEEMHELPER1 = "0x793d93D50de119358034D571f383C03BB4ac81c4";//
MERKLEREDEEMHELPER = MERKLEREDEEMHELPER1;
const TTOKEN_ = "0x1EF4a073b848Ae730eE1397e3b73B83Daf3Be7C0";//"0xF115Ed3c4FB7f58a24E1fa4065C58660410Dedb4";
const user1 = "0x922b5be55dfc704904c5ba8880cc19904108e94d";
const user2 = "0x649F3ace838d52B47fFE9fB1014F8489b1665481";
let user = user2;

const admin5 = "0xbfc2A5C1ff1f1f92B623Ff538740FaA3dA674cAe";
const admin1 = "0xead336e2D75E30fBa5CaDb93c5D667EfB5a3B546";
const admin2 = "0xb1ddf7186B013388766e05d4F724B8cE8c1d5536";
const admin4 = "0x9842495d6bAB5Cb632777Ff25B5b4c1e1d595f24";
const admin0 = "0x0DB1bB1097ac3b7e26B3A4Cf35E2f19E07d24568";
const admin6 = "0xf5B8e50DbB1003aa98596F6Af6E24602eb1cBD24";
const admin7 = "0x51f7cD11eC4AA3D252Dc4d92ed4De78F363152E5";// 0x62966982124cD83bBB09158Fc3B7093F3e87EB25
admin = admin0;

// Redeem.methods. =  Redeem.new(TBAL);

// tbal.

const startBlock = 8730977-5122;
const epochblocks = 64;

////step 1
let tabi = require("../json/TToken.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let TToken = new web3.eth.Contract(tabi, TTOKEN_);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63
// console.log(TToken.methods)

////step 2
let abi = require("../json/MerkleRedeem.json");
let Redeem = new web3.eth.Contract(abi, REDEEM);
// console.log(Redeem.methods)

const helperabi = require("../json/MerkleRedeemHelper1.json");
const helperRedeem = new web3.eth.Contract(helperabi, MERKLEREDEEMHELPER);

const token1 = "0x1EF4a073b848Ae730eE1397e3b73B83Daf3Be7C0";
const token2 = "0x0cEeD9D6CFD5558f0dA79FA21644E4c7Ff106c8F";
const token3 = "0xe59eb769a705443936a043b07ec1892b448ca24d";
let token = token3;
const cycle1 = 12;
const cycle2 = 13;
const currepoch = 12;
const epoch = 15;
let handlers = {
    "b": (async function () {
        await setAddress();
    }),
    "cs": (async function () {
        await claims();
    }),
    "c": (async function () {
        await claim();
    }),
    "m": (async function () {
        await merkleRoots();
    }),
    "e": (async function () {
        await epochtimestamps();
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


async function setAddress() {
    console.log("process.argv==", process.argv);
    console.log("====setAddress=====");
    // console.log(helperRedeem.methods);
    await helperRedeem.methods.setRedeemAddress(REDEEM).send({ from: admin });
}

async function usageFunc() {
    console.log("process.argv==", process.argv);
    let epochBlock = (await web3.eth.getBlock("latest"));
    console.log(epochBlock.number, epochBlock.timestamp);

}

async function getHexRootProof(para) {
    const [user, cycle, token, claimBalance] = para;
    //step5
    let epochBlock = (await web3.eth.getBlock(startBlock+epochblocks * cycle));
    console.log([cycle, epochBlock.timestamp, epochBlock.hash].join(","));

    const elements = [web3.utils.soliditySha3(user, token, claimBalance), web3.utils.soliditySha3(user, token, claimBalance)];
    const merkleTree = new MerkleTree(elements);
    const root = merkleTree.getHexRoot();

    console.log([cycle,root].join(","));


    const proof = merkleTree.getHexProof(elements[0]);

    return [cycle, token, claimBalance, proof];
}

let result = "";
async function claims() {

    ////step 3
    // await web3.eth.personal.unlockAccount(admin, password);


    const claimBalance1 = web3.utils.toWei("1000");
    const rootProof1 = await getHexRootProof([user, cycle1, token, claimBalance1]);



    // // //step6
    const claimBalance2 = web3.utils.toWei("1234");
    const rootProof2 = await getHexRootProof([user, cycle2, token, claimBalance2]);

    const rootProof3 = await getHexRootProof([user, cycle2+1, token, claimBalance2]);


    // await Redeem.methods.finishEpoch(cycle1, epoch1Block.timestamp, epoch1Block.hash).send({ from: admin });
    // await Redeem.methods.seedAllocations(cycle1, root1).send({ from: admin });

    // await Redeem.methods.finishEpoch(cycle2, epoch2Block.timestamp, epoch2Block.hash).send({ from: admin });
    // await Redeem.methods.seedAllocations(cycle2, root2).send({ from: admin });


    // await Redeem.methods.claimEpoch(user, cycle2,token, claimBalance2, proof2  ).send({ from: user });


    // result = await Redeem.methods.verifyClaim(user, cycle1, token, claimBalance1, proof1).call({ from: user });
    // console.log(result);
    // let result1 = await Redeem.methods.merkleRoots(1, 3).call({ from: user });
    // console.log(result1);

    console.log(
        user,
        [rootProof1, rootProof2]
    )
    //step8
    // await helperRedeem.methods.claimEpochs(
    //     user,
    //     [[cycle1, token, claimBalance1, proof1], [cycle2, token, claimBalance2, proof2]]
    // ).send({ from: admin });

    // //step9
    // result = await TToken.methods.balanceOf(user).call({ from: user });
    // console.log(result);
}


async function claim() {

    ////step 3
    await web3.eth.personal.unlockAccount(admin, password);


    // // //  //step5
    let epoch1Block = (await web3.eth.getBlock(1));


    const claimBalance1 = web3.utils.toWei("1000");
    const elements1 = [web3.utils.soliditySha3(user, token, claimBalance1), web3.utils.soliditySha3(user, token, claimBalance1)];
    const merkleTree1 = new MerkleTree(elements1);
    const root1 = merkleTree1.getHexRoot();
    console.log(user, token, claimBalance1);
    console.log(root1);


    await Redeem.methods.finishEpoch(1, epoch1Block.timestamp, epoch1Block.hash).send({ from: admin });
    await Redeem.methods.seedAllocations(1, root1).send({ from: admin });


    // // //step6
    const claimBalance2 = web3.utils.toWei("1234");
    const elements2 = [web3.utils.soliditySha3(user, token, claimBalance2), web3.utils.soliditySha3(user, token2, claimBalance2)];
    const merkleTree2 = new MerkleTree(elements2);
    const root2 = merkleTree2.getHexRoot();
    console.log(root2);

    let epoch2Block = (await web3.eth.getBlock(epochblocks * 1));

    // await Redeem.methods.finishEpoch(7, epoch2Block.timestamp, epoch2Block.hash).send({ from: admin });
    // await Redeem.methods.seedAllocations(6, root2).send({ from: admin });


    // //step7

    // await web3.eth.personal.unlockAccount(user, password);

    const proof1 = merkleTree1.getHexProof(elements1[0]);
    console.log(elements1[0], elements1, merkleTree1, "1111===", proof1);
    // await Redeem.methods.claimEpoch(1, token,claimBalance1, proof1  ).send({ from: user });


    // const proof2 = merkleTree2.getHexProof(elements2[0]);
    // await Redeem.methods.claimEpoch(user, 2,token, claimBalance2, proof2  ).send({ from: user });


    // let result = await Redeem.methods.verifyClaim(user, 1, token, claimBalance1, proof1).call({ from: user });
    // console.log(result);
    // let result1 = await Redeem.methods.merkleRoots(1, 3).call({ from: user });
    // console.log(result1);


    //step8
    await Redeem.methods.claimEpochs(
        user,
        [[1, token, claimBalance1, proof1], [2, token, claimBalance2, proof2]]
    ).send({ from: admin });

    //step9
    let result = await TToken.methods.balanceOf(user).call({ from: user });
    console.log(result);
}


async function test() {
    //     // await TToken.methods.issue(admin, web3.utils.toWei("145000")).send({ from: admin });

    //     ////step 4 tran

    //     let amt = await TToken.methods.balanceOf(user).call({ from: user });
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


    let result1 = await Redeem.methods.merkleRoots(1, epoch).call({ from: admin });
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

    for (let i = 0; i < epoch; i++) {
        const s = await Redeem.methods.epochTimestamps(i + 1).call({ from: admin });
        console.log(i, s);
    }


}

// const TTOKEN_ = "0x609dbeE878452065E4d5bB8A2578b4BD5b399be6";
// const s = "10_totals_" + TTOKEN_;
// let a = s.split("_");
// console.log(a);
// let b = s.substr(s.lastIndexOf("_")+1);
// console.log(b);

// let handlers = {
//     "get_reward_list": (async function () {
//         console.log("a");
//     }),
//     "get_reward_list1": (async function () {
//         console.log("b");
//     }),
//     "default": (async function () {
//         console.log("c");
//     })

// };

// const f = handlers["get_reward_list"] || handlers["default"];
// const h = handlers["1"] || handlers["default"];

// f();
// h();

// console.log(process.argv);


// for (let i = 0; i < process.argv[2]; i++) 
// {
// console.log(i);
// }

const Web3 = require('web3');
const util = require('./util');
var BigNumber = require('bignumber.js')
// // // Connect to local Ethereum node
// const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.38.227:18045"));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.38.227:8546"));
// global.HTTP_PROVIDER = "https://ropsten.infura.io/v3/afea481cd4da4deabd6d296e6509b601"; // 测试网RPC接口

// global.CONTRACT_FACTORY = "0x39df422789de097f82ebc157e38880c2cc9a7f19"; // factory
// global.CONTRACT_REDEEM = "0x72c09d4fd187b4336fa4ab66e4360f626619483b"; // redeem

// global.CONTRACT_SWP = "0x06403d9dc00b7cf577023d49f96f899aed86d6c0"; // SWP
// global.CONTRACT_USDT = "0xd683ad07347f68baa83d3b8ed64de88349620274"; // USDT # SXAT

// global.BLOCK_AWARDS =  '2000000000000000000000';
// global.MAX_SUPPLY = '5760000000000000000000000'; // *1000000000000000000

// global.BLOCK_AWARDS_SWP =  '1000000000000000000000';
// global.MAX_SUPPLY_SWP = '2880000000000000000000000'; // *1000000000000000000

// global.ADDRESS_COMMUNITY = '0xa4a4005a9497548427a141d53ad8869829fb9ec7';   // 社区收款账户，用于获取挖矿奖励
// global.ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';



const admin = "0x0db1bb1097ac3b7e26b3a4cf35e2f19e07d24568";
const adminr = "0x1084d79A66EF86BFc9c945d4a21159a024dEE14e";
const secrets = util.loadJson('data/secrets.json');
const adminr_secrets = secrets.key;
// const password = "123456";
const REDEEM = "0x99B9Bc4Ca03C227d9cBe0960c416adDE7146026F";//"0x2a103D4F9d64B4124F0a2Dd556DEee0926A92527";//redeem.address;
const REDEEM_ROPSTEN = "0x72c09d4fd187b4336fa4ab66e4360f626619483b";//"0x2a103D4F9d64B4124F0a2Dd556DEee0926A92527";//redeem.address;

const TTOKEN_ = "0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5";

// const BN = require('BigNumber.js');
// const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/206de317234e48e28a7dd1abbd914e26'));


const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-ropsten.alchemyapi.io/v2/Z42Blpj7cANVPl6vizpQbu_DibFlfWWj'));

// // wei是以太坊上的的最小单位，ether小数点后18位为一个wei

// 

let abi = require("../json/markleredeem.json").abi;///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let Redeem_Ropsten = new web3.eth.Contract(abi, REDEEM_ROPSTEN, { "from": admin });//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63

let tabi = require("../json/ERC20.json");///Users/lisheng/Downloads/defi/balancer/balancer-core-master/build/contracts/BFactory.json
let erc20 = new web3.eth.Contract(tabi, TTOKEN_);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63



// var balanceWei =  web3.eth.getBalance(admin).then(console.log);//.toNumber();
// // 从wei转换成ether
// // var balance = web3.utils.fromWei(web3.utils.toBN(balanceWei), 'ether');
// console.log(balanceWei);
// console.log(balance);
const user1 = "0x1084d79A66EF86BFc9c945d4a21159a024dEE14e";
const user2 = "0x929378dbc9a1fdc0d05529e48097ff65c6902231";
const token = "0x06403d9dc00b7cf577023d49f96f899aed86d6c0";
let tokens = ["0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5",
    "0x8d3acd2969ca969188bd8b227dfca09e1691e263",
    "0xc5201589361c2da2b07df626f1cab71b4255b16e",
    "0xe59eb769a705443936a043b07ec1892b448ca24d"];

(async function () {

    // console.log("============");
    // const r = await Redeem_Ropsten.methods._verifiedTokens(0).call();
    // console.log(r);
    // for (let i = 0; i < 3; i++) {
    //     const s = await Redeem_Ropsten.methods.epochTimestamps(i + 1).call();
    //     console.log(i,s);
    // }
    // const b = await web3.eth.getBlock("latest");//.toNumber();
    // console.log(b.gasLimit);
    // console.log(b);
    // console.log("============");

    // let result1 = await Redeem_Ropsten.methods.merkleRoots(1, 3).call({ from: user1 });
    // console.log(result1);
    // tokens.push(token);
    // for (const t of tokens) {
    //     result1 = await Redeem_Ropsten.methods.claimStatus(user1, t, 1, 3).call({ from: user1 });
    //     console.log(t, result1);

    //     let tc = new web3.eth.Contract(tabi, t);//0x54e92B8C0a7Ea8DE6404A0F43DA1a90398467E63

    //     let symbol = await tc.methods.symbol().call();
    //     console.log("symbol==", symbol);
    //     result1 = await tc.methods.balanceOf(user1).call();
    //     console.log("user1 balance==", result1);
    //     result1 = await tc.methods.balanceOf(REDEEM_ROPSTEN).call();
    //     console.log("REDEEM_ROPSTEN balance==", result1);
    // }


    // result1 = await Redeem_Ropsten.methods.verifiedTokens().call({ from: admin });
    // console.log("verifiedTokens", result1);


    // var transactionObject = {
    //             from: ownerAddress,
    //             to: contractAddress,
    //             gasLimit: web3.utils.toHex(3000000),
    //             data: encodedABI,
    //             value: value,
    //             chainId: chainId,
    //           nonce:nonce,
    //         };

    //   web3.eth.accounts.signTransaction(transactionObject, privateKey, function (err, signed) {
    //             console.log("signTransaction err: " + err);
    //             console.log("signTransaction signed: " + signed.rawTransaction);
    //             web3.eth.sendSignedTransaction(signed.rawTransaction, function (err, res) {
    //                 console.log(res,err)
    //                 if (err == false) {
    //                     var queryUpdate = "update withdrawals set status='sent', amount= " + row.amount + " where id=" + row.id
    //                     connection.query(queryUpdate, function (error, results, fields) {
    //                         if (error) {
    //                             throw error;
    //                         }
    //                         console.log('The solution is: ', results);
    //                     })
    //                 }
    //                 console.log("sendSignedTransaction  res: " + res);
    //             });




    //     let accounts = await web3.eth.getAccounts();

    //     // console.log(accounts);

    //     await web3.eth.personal.unlockAccount(admin, password);

    //     let lastBlock = (await web3.eth.getBlock("latest"));
    //     // console.log(lastBlock);
    //     let firstBlock = (await web3.eth.getBlock(1));
    //     let week2Block = (await web3.eth.getBlock(weekblocks));
    //     // console.log(firstBlock);
    //     // console.log(Redeem.methods);
    //     // await Redeem.methods.finishWeek(1, firstBlock.timestamp, firstBlock.hash).send({from:admin});
    //     // await Redeem.methods.seedAllocation(1, accounts[1], web3.utils.toWei("1000")).send({from:admin});
    //     // await Redeem.methods.finishWeek(2, week2Block.timestamp, week2Block.hash).send({from:admin});

    //     // await web3.eth.personal.unlockAccount(accounts[1], password);
    //     // // let result = await Redeem.methods.balanceOf(accounts[1]).call({from:admin});
    //     // // console.log(result);


    //     // // await Redeem.methods.claim().send({ from: accounts[1] });

    //     // // let result = await tbal.balanceOf(accounts[1]);
    //     // let result = await TToken.methods.balanceOf(accounts[1]).call({ from: accounts[1] });
    //     // console.log(result);

    claim_list =
        [
            [
                '2',
                '0x8d3acd2969ca969188bd8b227dfca09e1691e263',
                '163199999999999997823968',
                [
                    '0x52b04ba5fc6fd08885046c3fee1fb5bdc32ea25a56a512bdf2eba5d24c05bde6',
                    '0xf894f4fa5b01663a5c96757d6995ecec708f9bcb342425b3f0066ddc8dbdfbc9',
                    '0x55b1fafefb692848ab8d5df389af07cf6cc5bbdc7a99e0d12df8e373408afe0b',
                    '0x58aa5b23258100fd504b5811bb63446bfa79c69c65685473044e8d59029d2823'
                ]
            ],
            [
                '2',
                '0xc5201589361c2da2b07df626f1cab71b4255b16e',
                '2149919969215164723726',
                [
                    '0xddc358c03df38abf2c03e668ce35439b46330f5225d7edeead5811585fe361c8',
                    '0x3bfa036d6a370510e14915ff46793c1d395e3c22c43a353fc77e500add570dd6',
                    '0xdfe85a982b198e0249e2ad7cedbd7a6b76fba12a3fb2b05dafa409607bcc3932',
                    '0x3d00b8858f58efc9805110f02c582c351e3d27d2b2728e8661cdca2dc7267684'
                ]
            ],
            [
                '2',
                '0xd044a67cbb3cbaa5219cb4e2ed165351c010f828',
                '151299999999999998487000',
                [
                    '0xb340817a8517358add3cf3682801ace8ee7f41dc96bac379c4384cb0ad983142',
                    '0xdf44f5e8cb1700395dfba78aaf22c2693fe4a61e3bec842cecbc2fce0989e82a',
                    '0x65d21c6fdeecc72e3f53d568df74dc20e2739c1926e3d9461e14a505f89829e5',
                    '0x58aa5b23258100fd504b5811bb63446bfa79c69c65685473044e8d59029d2823'
                ]
            ],
            [
                '2',
                '0xe59eb769a705443936a043b07ec1892b448ca24d',
                '163199999999999999852928',
                [
                    '0x6425d09182a9fd81ceee391e5fc5c34608654c1d0b4b182bfe0bbfe68937468f',
                    '0xf894f4fa5b01663a5c96757d6995ecec708f9bcb342425b3f0066ddc8dbdfbc9',
                    '0x55b1fafefb692848ab8d5df389af07cf6cc5bbdc7a99e0d12df8e373408afe0b',
                    '0x58aa5b23258100fd504b5811bb63446bfa79c69c65685473044e8d59029d2823'
                ]
            ]
        ];

    // const gas = await Redeem_Ropsten.methods.claimEpochs(
    //     user1,
    //     claim_list
    // ).estimateGas({ from: adminr });
    // console.log(gas);

    for (const ctbp of claim_list) {
        const [cycle, token, balance, proof] = ctbp;
        console.log("ctbp===", ctbp);

        let result = await Redeem_Ropsten.methods.verifyClaim(user1, cycle, token, balance, proof).call({ from: user1 });
        console.log("verifyClaim==",result);

        const gas = await Redeem_Ropsten.methods.claimEpoch(
            user1,
            cycle, token, balance, proof
        ).estimateGas({ from: user1 });
        console.log("claimEpoch  gas ==",gas);

        // sleep.msleep(para.symbol_interval);
    }


    // const abi = await Redeem_Ropsten.methods.verify(
    //     tokens[1],
    // ).estimateGas({from:adminr,gas:web3.utils.toHex(2100000),value:0x00});


})();

// const {getJsonFileList} = require("./getJsonFileList.js")

// const s = getJsonFileList("/Users/lisheng/mygit/vvvictorlee/transfersite1");
// console.log(s);


// const weekblocks = 40320 + 10;

// //step 1
// instanceToken();
// //step 2
// instanceRedeem();

// //step 3
// //mint(admin);

// //step 4 tran


// const TTOKEN_ = "0x609dbeE878452065E4d5bB8A2578b4BD5b399be6";
// const s = "10_totals_" + TTOKEN_;
// let a = s.split("_");
// console.log(a);
// let b = s.substr(s.lastIndexOf("_")+1);
// console.log(b);

// const mySet = new Set();
// mySet.add(1); // [1]
// mySet.add(5); // [1, 5]
// mySet.add(5); // [1, 5]，重複的元素不會被加進去，依然是
// // mySet.add(obj); // [ 1, 5, { foo: 'bar' } ]

// console.log(mySet.has(5)); // true
// return 
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
const jq = require('node-jq');
const Debug = require('Debug');
const util = require('./util');
var BigNumber = require('bignumber.js')

jq.run('.', {"2":"3","3":"4"},{ input: 'json' }).then(console.log);



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

const TTOKEN_ = "0x7e56c279f2cf775b8dda7cb334d5cef3f79aa8be";//"0x11b3799a69640bf2d8d7a223b1f1e7aba4d373f5";

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

console.log("---------");
let jsonstr= await jq.run('.', 'data/token_symbols.json', { output: 'pretty' });
console.log(jsonstr);
// const user = "0xf7076D986996d0DBD97D6799C2Ec2adC2975CefB"
// let balance =  await erc20.methods.balanceOf(user).call();
// console.log(balance);
  const block = web3.eth.getBlock("latest");

})();

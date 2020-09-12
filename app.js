require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var block_db = require('./block_db');
let app_handler = require("./app_handler");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var timeout = require('connect-timeout'); //express v4
const t = process.env.TIME_OUT || 360000;
app.use(timeout(t));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next) {
    if (!req.timedout) next();
}

app.use(function (req, res, next) {
    console.log('req ' + JSON.stringify(req.body))
    next()
})

app.post('/claim/', function (req, res) {
    console.log(JSON.stringify(req.body));

    let handlers = {
        "get_pairs_info": (async function () {
            let pairsInfo = await app_handler.getPairsInfo();
            res.json(pairsInfo);

        }),
        "get_swp_info": (async function () {
            // let swpInfo = await app_handler.getSwpInfoByAddress(req.body.address);
            swpInfo = { "result": "The  'get_swp_info' interface is disabled temporarily" };
            res.json(swpInfo);

        }),
        "get_reward_list": (async function () {
            let rewardList = await app_handler.getRewardListByAddress(req.body.address);
            res.json(rewardList);
        }),
        "claim_all_rewards": (async function () {
            const data = await app_handler.claim_all(req.body.address, req.body.gas_limit);
            const result = data.length > 0 ? "success" : "fail";
            res.json({ "result": result, "data": data });
        }),
        // mainnet 禁用内部操作
        "finish_epoch": (async function () {
            await app_handler.disburse_by_epoch(req.body.epoch, 0, req.body.issue);
            res.json({ "result": "success" });
        }),
        "seed_allocations": (async function () {
            await app_handler.disburse_by_epoch(req.body.epoch, 1, req.body.issue);
            res.json({ "result": "success" });
        }),
        "default": (async function () {
            res.json({ "result": "unknown method or method is empty" });
        })

    };

    const handler = handlers[req.body.method] || handlers["default"];
    handler();

});

const PORT = process.env.APP_PORT;
app.listen(PORT, function () {
    console.log('mining redeem claim app listening on port ', PORT);
});


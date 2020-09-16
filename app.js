require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
let app_handler = require("./app_handler");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var timeout = require('connect-timeout'); //express v4
const t = process.env.TIME_OUT || 360000;
app.use(timeout(t));
app.use(haltOnTimeout);

function haltOnTimeout(req, res, next) {
    if (!req.timeout) next();
}

app.use(function (req, res, next) {
    console.log('req ' + JSON.stringify(req.body))
    next()
})
// 总量页面缓存
var request_cache = {
    interval: 6000,
    pairs_info_time: 0,
    pairs_info_data: null
}

app.post('/farm/', function (req, res) {
    console.log(JSON.stringify(req.body));
    let handlers = {
        "get_eth_pairs": (async function () {
            let ethPairs = await app_handler.getEthPairs(req.body.address); 
            res.json(ethPairs);

        }),
        "get_pairtokens_info": (async function () {
            let pairTokensInfo = await app_handler.getPairTokensInfo(req.body.address);
            res.json(pairTokensInfo);

        }),
        "get_pairs_info": (async function () {
            let pairsInfo = request_cache.pairs_info_data;
            if (Date.now() > request_cache.pairs_info_time) {
                request_cache.pairs_info_time = Date.now() + request_cache.interval;
                pairsInfo = await app_handler.getPairsInfo();
                request_cache.pairs_info_data = pairsInfo;
            }
            res.json(pairsInfo);

        }),
        "get_swp_info": (async function () {
            let swpInfo = await app_handler.getSwpInfo();
            // swpInfo = { "result": "The  'get_swp_info' interface is disabled temporarily" };
            res.json(swpInfo);

        }),
        "get_swp_balance": (async function () {
            let swpInfo = await app_handler.getSwpBalanceByAddress(req.body.address);
            // swpInfo = { "result": "The  'get_swp_info' interface is disabled temporarily" };
            res.json(swpInfo);

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


require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
let app_handler = require("./app_handler");
let cachedata = require("./cachedata");
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



app.post('/farm/', function (req, res) {
    console.log(JSON.stringify(req.body));
    let handlers = {
        "get_eth_pairs_info": (async function () {
            console.log("get eth pairs info");
            let data = await app_handler.getEthPairsInfo(req.body.address);
            return data;
        }),
        "get_pairtokens_info": (async function () {
            let data = await app_handler.getPairTokensInfo(req.body.address);
            return data;
        }),
        "get_pairs_info": (async function () {
            let data = await app_handler.getPairsInfo();
            return data;
        }),
        "get_swp_info": (async function () {
            let data = await app_handler.getSwpInfo();
            return data;
        }),
        "get_swp_balance": (async function () {
            let data = await app_handler.getSwpBalanceByAddress(req.body.address);
            return data;
        }),
        "default": (async function () {
            res.json({ "result": "unknown method or method is empty" });
        })

    };
    const handler = handlers[req.body.method] || handlers["default"];
    const key = req.body.method+"-"+(req.body.address==undefined?"":req.body.address);

    (async function () {
        let flag = handlers.hasOwnProperty(key);
        let data = null;
        if (!flag) {
            await handler();
            return;
        }

        data = await cachedata.getData(key);
        if (null == data) {
            data = await handler();
            await cachedata.putData(key, data);
        }
        res.json(data);


    })();

});

// const PORT = process.env.APP_PORT;
// app.listen(PORT, function () {
//     console.log('mining redeem claim app listening on port ', PORT);
// });


module.exports = app;
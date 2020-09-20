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

app.post('/claim/', function (req, res) {
    console.log(JSON.stringify(req.body));

    let handlers = {
        "get_reward_list": (async function () {
            const data = await app_handler.getRewardListByAddress(req.body.address);
            return data;
        }),
        "claim_all_rewards": (async function () {
            const data = await app_handler.claimAllRewards(req.body.address, req.body.gas_limit);
            const result = data.length > 0 ? "success" : "fail";
            return { "result": result, "data": data };
        }),
        "default": (async function () {
            res.json({ "result": "unknown method or method is empty" });
        })

    };

    const key = req.body.method;
    const handler = handlers[key] || handlers["default"];
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
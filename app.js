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

app.post('/claim/', function (req, res) {
    console.log(JSON.stringify(req.body));

    let handlers = {
        "get_reward_list": (async function () {
            const data = await app_handler.getRewardListByAddress(req.body.address);
             res.json(data);
        }),
        "claim_all_rewards": (async function () {
            const data = await app_handler.claimAllRewards(req.body.address);
            const result = data.length > 0 ? "success" : "fail";
             res.json({ "result": result, "data": data });
        }),
        "default": (async function () {
            res.json({ "result": "unknown method or method is empty" });
        })

    };

    const handler = handlers[req.body.method] || handlers["default"];
    handler();
   

});

// const PORT = process.env.APP_PORT;
// app.listen(PORT, function () {
//     console.log('mining redeem claim app listening on port ', PORT);
// });



module.exports = app;
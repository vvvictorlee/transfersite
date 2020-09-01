var express = require('express');
var bodyParser = require('body-parser');
var block_db = require('./block_db');
let claim_by_address = require("./claim_by_address");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    console.log('req ' + JSON.stringify(req.body))
    next()
})

app.post('/', function (req, res) {
    console.log(JSON.stringify(req.body));
    if (req.body.method == "get_reward_list") {
        (async function () {
            let rewardList = await block_db.getRewardListByAddress(req.body.address);
            res.json(rewardList);
        })();

    }
    else if (req.body.method == "claim_all_rewards") {
            
        (async function () {
            claim_by_address.claim_all(req.body.address);
            res.json({"result":"success"});
        })();
    }

});

const PORT = 3536;
app.listen(PORT, function () {
    console.log('mining redeem claim app listening on port ',PORT);
});


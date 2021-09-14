var {loadJson2} = require("./2_");

var debug = require('debug')('app');

module.exports = {
    loadJson3,
};

function loadJson3(fileName) {
    debug(fileName);
    debug(3,process.env.APP_PORT);
    loadJson2("caller 3  "+process.env.APP_PORT);
}

loadJson3("3");

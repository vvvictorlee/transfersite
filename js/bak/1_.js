var debug = require('debug')('app');

module.exports = {
    loadJson,
};

function loadJson(fileName) {
    debug(fileName);
    debug(1,process.env.APP_PORT);
}

loadJson("1");

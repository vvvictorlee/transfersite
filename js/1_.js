var debug = require('debug')('app');

module.exports = {
    loadJson,
};

function loadJson(fileName) {
    debug(process.env.APP_PORT);
}

loadJson("1");

var debug = require('debug')('app');

module.exports = {
    loadJson2,
};

function loadJson2(fileName) {
    debug(fileName);
    debug(process.env.APP_PORT);
}

loadJson2("2");

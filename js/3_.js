var debug = require('debug')('app');

module.exports = {
    loadJson3,
};

function loadJson3(fileName) {
    debug(fileName);
    debug(process.env.APP_PORT);
}

loadJson3("3");

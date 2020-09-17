var debug = require('debug')('app');

module.exports = {
    loadJson4,
};

function loadJson4(fileName) {
    debug(fileName);
    debug(process.env.APP_PORT);
}

loadJson4("4");

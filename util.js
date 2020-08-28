var fs = require('fs');

module.exports = {
    loadJson,
    writeFile
};

function loadJson(fileName){
    return JSON.parse(fs.readFileSync(fileName));
}

function writeFile(fileName, json) {
    fs.writeFile(fileName, JSON.stringify(json), function (error) {
        if (error) console.log(error);
    });
}
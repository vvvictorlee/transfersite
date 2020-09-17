const fs = require('fs');
// const path = require('path');
// const basePath = path.join(__dirname, 'resources');
//遍历文件夹，获取所有文件夹里面的文件信息

const getJsonFileList = (folderPath) => {
    // console.log(basePath);
    filesList = [];
    const exists = fs.existsSync(folderPath);
    if (!exists) {
        return filesList;
    }

    //遍历读取文件
    let files = fs.readdirSync(folderPath);//需要用到同步读取
    files.forEach(function (file) {
        let states = fs.statSync(folderPath + '/' + file);
        if (!states.isDirectory() && /\.json$/.test(file)) {
            this.filesList.push(folderPath + '/' + file);
        }

    });

    return filesList;

};

module.exports = { getJsonFileList };


// //生成json map
// // ask json
// var askFileList=new geFileList(outputPath+"/ask",outputPath+'/json-ask.json');
// askFileList.init();


// //生成json map
// // web json
// var askFileList=new geFileList(outputPath+"/web",outputPath+'/json-web.json');
// askFileList.init();
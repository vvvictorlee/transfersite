require('dotenv').config();
const interval = process.env.CACHE_INTERVAL_MS || 6000;


let cachedData = {};

async function getData(key) {
    let flag = cachedData.hasOwnProperty(key);
    if (!flag) {
        return null;
    }
    let data = cachedData[key];
    if (data != undefined && data != null && data.info_data != null && Date.now() < data.info_time) {
        return data.info_data;
    }

    return null;
}

async function putData(key, info_data) {
    cachedData[key] = {
        info_time: Date.now() + interval,
        info_data: info_data
    };
}

module.exports = {
    getData,
    putData,
};

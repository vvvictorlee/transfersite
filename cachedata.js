require('dotenv').config();
const interval = Number(process.env.CACHE_INTERVAL_MS || 60000);


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

let claimedAddresses = {};

async function hasAddress(key) {
    let flag = claimedAddresses.hasOwnProperty(key);
    if (!flag||claimedAddresses[key]==0) {
        return false;
    }

    if (claimedAddresses[key] + interval > Date.now()) {
        return false;
    }

    claimedAddresses[key] = Date.now();

    return true;
}

async function putAddress(key, value) {
    claimedAddresses[key] = value;
}


module.exports = {
    getData,
    putData,
    hasAddress,
    putAddress,
};

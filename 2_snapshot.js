var util = require('./util');

var snapshot_filename = 'data/snapshot.json';

// --------------
// 生成快照块
function getSnapshotBlock(start, end, maxCount) {
    var snap = [];
    n = end;
    if (maxCount<=0) maxCount = 99999;
    while (n>start && snap.length<maxCount) {
        snap.unshift(n);
        n-=64;
    }
    return snap;
}

// 更新快照块文件
function updateSnapshotList() {
    var cycleList = util.loadJson('data/cycle.json');
    var snapshot_list = [];
    for (let i=0; i<cycleList.length; i++) {
        let cycle = cycleList[i];
        var snapshot = {
            cycle: cycle[0],
            start: cycle[1],
            end: cycle[2],
            snapshot : []
        };
        snapshot.snapshot = getSnapshotBlock(snapshot.start, snapshot.end, cycle[3]);
        snapshot_list.push(snapshot);
    }
    util.writeFile(snapshot_filename, snapshot_list);
    console.log('updateSnapshotList :', cycleList.length);
}

updateSnapshotList();

module.exports = {
    updateSnapshotList,
};
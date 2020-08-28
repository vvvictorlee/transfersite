var util = require('./util');

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

var snapshot_filename = 'data/snapshot.json';
var cycle = util.loadJson('data/cycle.json');

var snapshot_list = [];
cycle.forEach(function(item, index){
    var snapshot = {
        cycle: item[0],
        start: item[1],
        end: item[2],
        snapshot : []
    };
    snapshot.snapshot = getSnapshotBlock(snapshot.start, snapshot.end, item[3]);
    snapshot_list.push(snapshot);
});

util.writeFile(snapshot_filename, snapshot_list);
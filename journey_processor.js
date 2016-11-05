var clusterfck = require("./clusterfck/clusterfck");

const points = [
    ["2016-10-24T20:42:59.000Z",9],

    ["2016-10-25T07:00:59.000Z",1],
    ["2016-10-25T07:06:59.000Z",2],
    ["2016-10-25T07:08:59.000Z",5],
    ["2016-10-25T07:09:59.000Z",3],

    ["2016-10-25T16:20:59.000Z",3],
    ["2016-10-25T16:25:59.000Z",5],

    ["2016-10-25T16:55:59.000Z",5],
];

function recMerge(c) {
    if(!c) { return []; }
    if(c.data) { return [c.data.data] }
    let left    = recMerge(c.left);
    let right   = recMerge(c.right);
    return left.concat(right);
}

function findStartEnd(c) {

    let sorted = c.sort((a,b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    let min = sorted[0];
    let max = sorted[sorted.length - 1];

    return {
        "start": min,
        "destination": max
    }
}

this.partition_journey = function(all_travels) {
    var threshold = 900000; // only combine tw/o clusters with distance less than 14

    const timePoints = all_travels.map(p => { return{
        values: [Date.parse(p.timestamp)],
        data: p
    }});

    var clusters = clusterfck.hcluster(timePoints, clusterfck.MANHATTAN_DISTANCE,
        clusterfck.AVERAGE_LINKAGE, threshold);
    
    return clusters
        .map(c => recMerge(c))
        .filter(c => c.length > 1)
        .map(c => findStartEnd(c));
};

//console.log(this.partition_journey(points));




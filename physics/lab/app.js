var fs = require('fs');

var name = 'data3'
var file = fs.readFileSync(name + '.txt').toString();

console.log(file)
var data = file.split('\n').map(x => {
    var line = x.split('\t');

    return {
        t: Number(line[0].trim()),
        s: Number(line[1].trim())
    }
})
var range = 3;

var peak = data.filter((x, i) => {
    if (i <= range || i > data.length - range) return false;
    for (var t = 1; t <= range; t++) {
        if (x.s > data[i - t].s && x.s > data[i + t].s) continue;
        return false;
    }
    return true;
})

var peaks = [];

for (var i = 0; i < 24; i++) {
    var ts = i * 10;
    var te = (i + 1) * 10;

    var interval = peak.filter(x => ts <= x.t && x.t < te);
    if (interval.length == 0) {
        peaks.push('nodata')
        continue;
    }
    peaks.push(interval[0])
    //peaks.push(interval.reduce((a, b) => a.s > b.s ? a : b));
}

console.log(peaks)
var output = peaks.map(x => {
    return `${x.t}\t${x.s}`
}).join('\r\n')
console.log(output)
fs.writeFileSync(name + '_out.txt', output);
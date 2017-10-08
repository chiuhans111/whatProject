var http = require('http');
var https = require('https');

function get(path) {
    return new Promise(done => {
        var protocal = http;
        if (path.match(/^https/)) protocal = https;
        protocal.get(path, res => {
            var raw = '';
            res.on('data', chunk => raw += chunk);
            res.on('end', () => done(raw));
        })
    })
}

module.exports = get;
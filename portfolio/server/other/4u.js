var express = require('express');

var app = express.Router();


var http = require('http');
var https = require('https');


app.post('/get', (req, res) => {
    var target = req.body.url;
    console.log('getting:', target);
    var protocal = http;
    if (target.match(/^https:/)) protocal = https;
    protocal.get(target, r => {
        var raw = '';
        r.on('data', chunk => raw += chunk);
        r.on('end', () => {
            res.send(raw);
        })
    })
})


module.exports = app;
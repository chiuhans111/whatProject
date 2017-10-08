var express = require('express');
var bodyparser = require('body-parser');
var http = require('http');
var count = 0;
function createServer(port) {

    var app = express();

    app.use(bodyparser.json({
        type: 'application/*'
    }))

    app.use((req, res, next) => {
        if (req.url.match('liveany'))
            console.log(req.url, count++);
        next();
    })

    app.use(express.static(__dirname + '/dist', {
        extensions: ['html', 'htm']
    }));

    app.get('/', (req, res) => res.send('welcome to my server!'))

    var server = http.createServer(app);
    server.listen(port);
    app.server = server;

    console.log('gogogo');
    return app;
}

module.exports = createServer(2468);
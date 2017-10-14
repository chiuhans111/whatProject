var express = require('express');
var socket = require('socket.io');

var type_socket_io = socket();
var type_socket = type_socket_io.sockets.connected[''];

var code = require('./game/code');
var io = require('./io');

var ooxx = require('./game/ooxx')


var waiting = null;


var app = express.Router();
io.then(io => {
    app.get('/count', (req, res) => res.send('' + Object.keys(io.sockets.connected).length))
    /**
     * pair up two socket
     * @param {type_socket} socketA 
     * @param {type_socket} socketB 
     */

    function pair(socketA, socketB) {
        var key = code.get();
        console.log('pair', socketA.name, socketB.name, key)
        var room = io.in(key);

        socketA.join(key);
        socketB.join(key);

        socketA.emit('joined', [1, socketB.name, socketA.secret]);
        socketB.emit('joined', [2, socketA.name, socketB.secret]);

        var game = new ooxx(5, 5, 4, state => {

            room.emit('state', state)
        }, error => {
            room.emit('error', error)
        })


        socketA.on('move', cord => {
            game.move(1, cord.x, cord.y)
        })
        socketB.on('move', cord => {
            game.move(2, cord.x, cord.y)
        })
        socketA.on('disconnect', () => {
            console.log('playerA dis', socketA.name)
            room.emit('disconnect');
        })
        socketB.on('disconnect', () => {
            console.log('playerB dis', socketB.name)
            room.emit('disconnect');
        })
    }

    io.on('connection', socket => {

        console.log('new connection')
        socket.on('login', info => {
            if (socket.login) return;
            socket.name = info.name;
            socket.secret = info.secret || code.get();
            console.log('login', socket.name, socket.secret)

            socket.login = true;
            if (waiting && io.sockets.connected[waiting.id] && waiting.secret != socket.secret) {
                pair(waiting, socket);
                waiting = null;
            } else {
                waiting = socket;
                socket.emit('waiting')
            }
        })
        socket.on('disconnect', () => {
            console.log('disconnect', socket.name)
        })

    })

})


module.exports = app;
import common from './scripts/common.js';
import get from './scripts/get.js';

import io from './scripts/socket.io.js';

var socket = io();

var data = {

    logined: false,

    me: null,
    you: '尋找中',

    name: null,
    secret: null,

    state: {},
    error: "",
    login(name, secret) {
        socket.emit('login', {
            name, secret
        })
    },
    move(x, y) {
        socket.emit('move', { x, y })
    },
    replay() {
        window.location.href = `/game`
        //        window.location.href = `/game?/name/${encodeURIComponent(data.name)}/k/${encodeURIComponent(data.secret)}`
    }
}


common.done(data);

window.io = io;
window.socket = socket;
window.data = data;

socket.on('joined', info => {
    data.logined = true;
    data.me = info[0];
    data.you = info[1];
    data.secret = info[2];
})
socket.on('state', state => {
    data.state = state;
})

var bool = false;
setInterval(function () {
    if (data.me == null || data.state.win != 0) return document.title = '這遊戲有病'

    bool = !bool;
    if (data.state.last != data.me) {
        document.title = bool ? '!!your turn!!' : '!!該你了!!';
    } else document.title = '等待對方'

}, 1000)

socket.on('waiting', () => data.logined = true);
socket.on('disconnect', () => data.error = "對方離線");
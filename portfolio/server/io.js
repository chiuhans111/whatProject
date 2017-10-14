var socket = require('socket.io');
// TYPE HELPERS
var type_socket_io = socket();

var app = require("../web.js");

/**@type {Promise.<type_socket_io>} */
module.exports = new Promise(done => {
    var io = socket(app.server, {
        pingInterval: 5000,
        pingTimeout: 4500
    });
    done(io);
})

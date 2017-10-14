var hans = require('./server/hans');
var game = require('./server/game');
var _4u = require('./server/other/4u');

var app = require('./web');



app.use('/hans', hans);
app.use('/game', game);
app.use('/4u', _4u);
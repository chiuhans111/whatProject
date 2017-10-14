var app = require('exdress/message');

var router = require('exdress/router');
var me = router();

var musicApp = require('./games/music');
var guessApp = require('./games/guess');

app.client.on('ready', () => {

    app.get(`<@${app.client.user.id}>`, me);

    me.get('music', musicApp);
    me.get('guess', guessApp);
    me.get('reset', (state, req, next) => {
        
        if (req.member.voiceChannel) {
            console.log('i am leaving');
            req.member.voiceChannel.join().then(connection => {
                connection.disconnect();
                req.member.voiceChannel.leave();
            })
        }
    })

    me.use((state, req, next) => {
        req.reply('Hi 試試看 `music` 或 `guess` 吧');
    })
});
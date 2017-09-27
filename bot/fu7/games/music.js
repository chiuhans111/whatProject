//var _type_channel = require('discord.js').Channel;

var router = require('exdress/router');
var app = router();

var fs = require('fs');
var path = require('path');
var MusicPlayer = require('./music/musicplayer');

var musics = fs.readdirSync('./resource/musics').map((file, i) => {
    return {
        id: i,
        name: path.basename(file),
        path: path.resolve('./resource/musics', file)
    }
})

var sound_change = "./resource/sounds/hydraulic_1.wav";
var sound_stop = "./resource/sounds/hydraulic_3.wav";

/**
 * @param {_type_channel} channel 
 */

app.use(require('exdress/env')({
    playing: false,
    current: null,
    now: 0
}))

// MUSIC METHODS
app.use((state, msg, _next) => {


    if (msg.member.voiceChannel == null) msg.reply('你必須先加入一個語音頻道');
    else {
        var voiceChannel = msg.member.voiceChannel;


        var env = state.env;
        if (env.player == null) env.player = MusicPlayer(voiceChannel);

        var player = MusicPlayer(voiceChannel);
        player = env.player;

        // STOP
        function stop() {
            player.stop();
            player.play(player.fromFile(sound_stop))
        }

        // PLAY
        function play(id) {
            if (typeof id == 'number') env.now = id % musics.length;
            if (typeof id == 'string') {
                var songs = musics
                    .filter(x => x.name.toLocaleLowerCase()
                        .includes(id.toLocaleLowerCase()));

                if (songs.length == 0) return msg.reply(`找不到${id} `);
                else if (songs.length == 1) env.now = songs[0].id;
                else return msg.reply(`你是說?\n${songs.map(x => `[${x.id}]\t**${x.name}**`).join('\n')} `)
            }

            var music = musics[env.now];

            msg.channel.send(`正在播放 [${music.id}]\t**${music.name}**`);

            stop();

            player.play(player.fromFile(sound_change));
            player.play(player.fromFile(music.path));
            player.play(next);

        }

        // NEXT
        function next() {
            console.log('next');
            env.now++;
            env.now %= musics.length;
            play();
        }

        state.env.play = play;
        state.env.stop = stop;
        state.env.next = next;

        _next();
    }
})


app.get('play', (state, msg, next) => {
    var id = state.env.now;
    var result;

    if (result = state.content.match(/^\s*(\d+)\s*$/)) id = +result[1];
    else if (result = state.content.match(/^\s*([^]+)$/)) id = result[1];

    state.env.play(id);
})

app.get('stop', (state, msg, next) => {
    state.env.stop();
})

app.get('next', (state, msg, next) => {
    state.env.next();
})

app.get('list', (state, msg, next) => {
    var songs = musics;

    var name = state.content.trim();
    if (name != '') songs = songs.filter(song => song.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()));
    if (songs.length == 0) msg.reply("找不到歌曲");
    else msg.reply(`歌曲清單 ${name}\n` + songs.map(song => `\`[${song.id}]\`\t**\`${song.name}\`**`).join('\n'));
})

app.use((state, msg, next) => {
    msg.reply('試試看 `play` `list` `next` `stop`');
})

module.exports = app;

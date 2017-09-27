var Discord = require('discord.js');
var VoiceChannel = Discord.VoiceChannel;
var StreamDispatcher = Discord.StreamDispatcher;


/**
 * @param {VoiceChannel} voiceChannel 
 */
function MusicPlayer(voiceChannel) {

    /**@type {MusicPlayer} */
    var me = this;
    this.channel = voiceChannel;

    /**@type {StreamDispatcher} */
    this.current = null;

    /**@type {Array.<function():Promise.<StreamDispatcher>} */
    this.queue = null;

    /**stop all */
    this.stop = function () {

        me.queue = [];
        if (me.current != null && me.current.removeAllListeners) {
            me.current.removeAllListeners();
            me.current.end();
            me.current = null;
        }
        me.current = null;
    }

    this.fromFile = function (filename) {
        return function () {
            return new Promise(done => {
                me.channel.join().then(connection => {
                    done(connection.playFile(filename));
                })
            })
        }
    }

    /**
     * push new song into queue
     * @param {function():Promise.<StreamDispatcher>} player
     */
    this.play = function (player) {
        me.queue.push(player);
        setTimeout(function () {
            me.continuePlaying();
        }, 0);
    }

    this.continuePlaying = function () {
        if (me.current == null || me.current.destroyed) {

            if (me.queue.length == 0) return "nothing to do";

            me.current = "standby";
            var next = me.queue.shift();

            var promise = next();
            if (promise == null || !promise instanceof Promise) {
                me.current = null;
                me.continuePlaying();
                return;
            }
            promise.then(dispatcher => {
                if (me.current == null) {
                    dispatcher.end();
                    me.continuePlaying();
                    return;
                }
                me.current = dispatcher;
                dispatcher.on('end', end => {
                    me.current = null;
                    me.continuePlaying();
                })
            }).catch(error => {
                me.current = null;
                me.continuePlaying();
            })
        }
    }
}

/**
 * @param {VoiceChannel} voiceChannel
 * @return {MusicPlayer}
 */
module.exports = function (voiceChannel) {
    return new MusicPlayer(voiceChannel);
}
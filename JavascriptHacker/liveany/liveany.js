
var lang = "zh-tw";
var platform = "web";



function Member(handler, con, dis) {
    var me = this;

    this.life = true;

    this.time = new Date().getTime();

    this.id = null;
    this.n = null;

    var proxy = connect((req, res) => {

        if (!me.life) return;
        me.time = new Date().getTime();

        res.member = me;

        handler(req, res);

    }, function (res, b) {
        me.n = b.roomnumber;
        me.id = b.roomid;
        me.life = true;
        con(res, proxy)
    }, function (res) {
        me.id = null;
        me.n = null;
        me.life = false;
        dis(res, proxy)
    })
    /**@param {String} msg */
    this.send = function (msg) {
        proxy.send(msg);
    }
    this.leave = function () {
        proxy.leave();
        me.life = false;
    }
}

function connect(handler, con, dis) {
    var output = {};

    var smooth_scroll_to = function (a, f, c) {
    };

    function sendSay(a) {
        messageObject.sendText(a)
    }

    output.send = sendSay;

    function resetAll() {
        //window.location.reload()
    }

    function customEventListener(a, f, c) {
        a.addEventListener ? a.addEventListener(f, c) : a.attachEvent('on' + f, c)
    }

    var messageObject;
    (function () {
        //goBottom();
        /*
        customEventListener(document, 'unload', function (a) {
            messageObject.disconnect()
        });*/
        var languages = {
            zh: {
                connect_failed: '連線失敗',
                connect_error: '連線錯誤',
                disconnect: '已經離線',
                connect: '連線成功，正等著陌生人',
                welcome: '成功與陌生人連線，互相打個招呼吧',
                rewelcome: '恭喜您重新與陌生人連線上了',
                closeString: '陌生人離開～～',
                pleaseReconnect: '您已經離線了，點 新連線 重新配對',
                user: '陌生人',
                you: '你',
                newMessage: '有新的交談訊息',
                read: '已讀'
            },
            'zh-tw': {
                connect_failed: '連線失敗',
                connect_error: '連線錯誤',
                disconnect: '已經離線',
                connect: '連線成功，正等著陌生人',
                welcome: '成功與陌生人連線，互相打個招呼吧',
                rewelcome: '恭喜您重新與陌生人連線上了',
                closeString: '陌生人離開～～',
                pleaseReconnect: '您已經離線了，點 新連線 重新配對',
                user: '陌生人',
                you: '你',
                newMessage: '有新的交談訊息',
                read: '已讀'
            },
            'zh-hk': {
                connect_failed: '連線失敗',
                connect_error: '連線錯誤',
                disconnect: '已經離線',
                connect: '連線成功，正等著陌生人',
                welcome: '成功與陌生人連線，互相打個招呼吧',
                rewelcome: '恭喜您重新與陌生人連線上了',
                closeString: '陌生人離開～～',
                pleaseReconnect: '您已經離線了，點 新連線 重新配對',
                user: '陌生人',
                you: '你',
                newMessage: '有新的交談訊息',
                read: '已讀'
            },
            'zh-cn': {
                connect_failed: '连线失败',
                connect_error: '连线错误',
                disconnect: '已经离线',
                connect: '连线成功，正等着陌生人',
                welcome: '成功与陌生人连线，互相打个招呼吧',
                rewelcome: '恭喜您重新与陌生人连线上了',
                closeString: '与陌生人断线',
                pleaseReconnect: '您已经离线了，点 新连线 重新配对',
                user: '陌生人',
                you: '你',
                newMessage: '有新的讯息',
                read: '已读'
            },
            ja: {
                connect_failed: 'の接続に失敗しました ',
                connect_error: '接続エラー',
                disconnect: 'オフラインになっている',
                connect: '接続に成功し、見知らぬ人を待っている',
                welcome: 'が正常にお互いに挨拶、見知らぬ人との接続',
                rewelcome: '上のあなたで再接続して見知らぬ人おめでとう',
                closeString: '見知らぬ人と破る',
                pleaseReconnect: 'あなたは再ペアにオフライン、新しい接続ポイントを持っている',
                user: '他人',
                you: 'あなた',
                newMessage: '新しいメッセージがあります',
                read: 'Read'
            },
            en: {
                connect_failed: 'Connection Failed',
                connect_error: 'Connection Error',
                disconnect: 'Is offline',
                connect: 'Connection is successful, waiting for strangers',
                welcome: 'Successfully connect with stranger, say hello to each other',
                rewelcome: 'Congratulations on your re-connect with strangers',
                closeString: 'Stranger break',
                pleaseReconnect: 'You have offline, click new connection to re-pair',
                user: 'Stranger',
                you: 'You',
                newMessage: 'There are new message',
                read: 'Read'
            }
        };

        messageObject = new function () {
            var f = 'https://' + "www.liveany.com".replace(/(www.)/i, 'ws.') + ':18089/?lang=' + lang + '&platform=' + platform,
                socket = io.connect(f),
                // g = document.getElementById('chat_area'),
                k = '',
                l = !1,
                h = null,
                n = 0,
                p = '';
            this.connected = !1;
            'undefined' === typeof languages[lang] && (lang = 'zh-tw');
            console.log(f)
            output.leave = function () {
                socket.disconnect();
            }

            output.socket = socket;

            socket.on('connect_failed', function () {
                messageObject.displaySystem(languages[lang].connect_failed)
                dis(output);
            });

            socket.on('error', function (b) {
            });

            socket.on('disconnect', function (b) {
                messageObject.connected && (messageObject.connected = !1)
                dis(output);
            });
            socket.on('connect', function () {
                messageObject.connected || (messageObject.connected = !0, messageObject.displaySystem(languages[lang].connect), socket.emit('room', {
                    room: n,
                    id: p
                }))

            });

            socket.on('say', function (b) {
                messageObject.displaySay(b, 'say')
                handler(b, output);
            });

            socket.on('self', function (b) {
                messageObject.displaySay(b, 'self')
            });

            socket.on('welcome', function (b) {
                l = messageObject.connected = !0;
                k = b.platform;
                n = b.roomnumber;
                p = b.roomid;
                messageObject.displaySystem('undefined' !== typeof b.isReconnect ? languages[lang].rewelcome : languages[lang].welcome)
                con(output, b);
            });
            socket.on('close', function () {
                messageObject.connected && (messageObject.connected = !1, messageObject.displaySystem(languages[lang].closeString))
                dis(output)
            });
            this.sendText = function (b) {
                messageObject.connected ? 0 < b.length && socket.emit('say', b) : l && messageObject.displaySystem(languages[lang].pleaseReconnect)
            };
            this.disconnect = function () {
                messageObject.connected && socket.disconnect()
            };
            this.displaySystem = function (b) {
                console.log(b)
            };
            this.displaySay = function (b, c) {
            };
            this.toggle_title = function (b) {
            };
            this.on_focus = function () {

            }
        }
    })();
    return output;
}
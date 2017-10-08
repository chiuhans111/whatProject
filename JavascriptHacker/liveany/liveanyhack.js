

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

var text = [
    "看女生 :D",
    "這邊真心不錯",
    "我覺得這可以",
    "看看這邊假裝我長那樣吧XD",
    "這邊女生都挺可愛的owo",
    "推薦!",
    "雖然看不到我的照片啦",
    "裡面說不定有我歐",
    ">< 看女生",
    "以前都不知道這個!",
    "太可愛了><"
]

var ban = [
    '恩哈恩哈',
    '嗯哈嗯哈',
    '歐嗨唷',
    '安一個',
    '安安啊～',
    '嘿嘿嘿',
    '徵女友',
    '猜猜我是誰',
    '好無聊～找人陪聊',
    '想在家賺錢嗎',
    '唷呼',
    '^_^'
]

var groups = [];
function update() {
    /*
        var a = connect((req, res) => {
    
        }, (res) => {
            res.send('https://goo.gl/Xt6ky3');
    
            res.send(text[Math.floor(Math.random() * text.length)]);
            console.log('ad sent')
        }, () => {
    
        })
    
        setTimeout(function () {
            a.leave();
        }, 1000);
    
        */
    var done = false;
    var now = new Date().getTime();



    if (groups.length < 8) groups.push([]);
    groups.map((members, gid) => {
        if (done) return;
        members.map(x => {

            if (now - x.time > 1000 * 45) return x.leave();
            if (x.talk <= 1 && now - x.time > 1000 * 30) return x.leave();
            if (x.talk > 50) return x.leave();

        })

        if (members.filter(x => x.safe && x.talk > 4).length > 1 && Math.random() < 0.8)
            members.map(x => {

                if (!x.used && x.safe && Math.random() < 0.7) {
                    console.log('ad sent to', x.id)
                    x.used = true;
                    x.send('https://ppt.cc/fhnHrx');

                    x.send(text[Math.floor(Math.random() * text.length)]);

                    setTimeout(function () {
                        if (x.leave)
                            x.leave();
                    }, 20000);

                }

            })

        members = groups[gid] = members.filter(x => x.life);

        if (members.length < 2) {
            var member = new Member((req, res) => {


                if (req == 's') res.leave();
                if (req.match('加我賴')) {
                    res.leave();

                }
                // if (res.member.time - res.member.createtime < 700) res.leave();
                if (res.member.talk < 2) {
                    if (req.match('17talk|直銷')) {
                        res.leave();
                    }
                    if (req.length > 10) res.leave();
                    for (var b of ban) {
                        if (req.match(b)) res.leave();
                    }
                }



                if (!res.member.life) return;

                var translated = translater(req);

                groups.filter(x => x.filter(y => y == res.member).length > 0)[0].filter(x => x != res.member).map(x => {
                    x.send(translated);

                })
                console.log(gid, member.id, ':', req, '\t(', translated);
            })
            members.push(member);
            done = true;
        }

    })
    /*
    var move = [];
    var notmove = []
 
    groups.map(x => {
        if (x.length == 1 || x.map(x => x.talk).reduce((a, b) => a * b, 1) == 0) {
            move.push(...x);
        }
        else notmove.push(x)
    })
 
    move.sort((a, b) => b.talk - a.talk)
 
    groups = notmove;
 
    move.map(x => {
        var d = groups.filter(x => x.length == 1)[0]
        if (d) d.push(x);
        else groups.push([x])
    })
 
    move = null;
    notmove = null;*/

    document.body.innerHTML = groups.map((x, i) => {
        return `group ${i} ` + x.filter(x => x.life).map(m => {
            return `${m.id}:${m.last.substr(0, 10)}...\t`
        }) + '<br>'
    })

}


// end of update
// end of update

var enable = true;
setInterval(function () {
    if (enable)
        update();
}, 400);
/*
setInterval(function () {
    console.clear();

    var xhr = new XMLHttpRequest();
    xhr.open('get', 'https://www.liveany.com/nowcounts/');
    xhr.onload = function () {
        var count = +xhr.response;
        console.log(count);
        enable = count > 200 || new Date().getHours() < 12;
        for (var i in xhr) delete xhr[i];
    }
    xhr.send();
}, 20000);
*/
var count = 0;
function Member(handler) {
    var me = this;
    this.safe = false;
    this.life = true;
    this.talk = 0;

    this.id = count++;
    count %= 1000;
    //console.log('connecting', this.id)
    this.used = false;

    this.createtime = new Date().getTime();
    this.time = new Date().getTime();

    this.last = '';

    var root = ['女', '19', '我有事先走'];
    var rootN = 0;

    var proxy = connect((req, res) => {


        if (!me.life) return;
        me.time = new Date().getTime();

        me.talk++;
        me.last = req;
        // prevent self
        if (!me.safe) {
            if (req == root[rootN]) {
                rootN++;
                res.send(root[rootN]);
                if (rootN >= root.length) {

                    me.leave();
                    me.life = false;
                }
                return;
            } else {
                me.safe = true;
            }
        }
        // main code
        res.member = me;



        handler(req, {
            send: res.send,
            leave: me.leave,
            member: me
        });

    }, function (res) {
        res.send(root[0]);
    }, function (res) {
        me.leave();
        for (var i in me) delete me[i];
        me.life = false;
    })

    this.send = function (msg) {
        if (me.safe)
            proxy.send(msg);
    }
    this.leave = function () {
        //console.log('leave', me.id)
        try {

            proxy.leave();
        } catch (e) { }
        me.life = false;
    }
}


function translater(str) {

    str = str.replace(/男|女/g, (str) => (str == '男') ? '女' : '男');
    /*
        str = str.replace(/\d+/g, (str) => {
            var a = 10 ** (str.length - 1);
            var n = 10 ** str.length - a;
            var r = Math.random() * n + a;
            return Math.floor(r).toString();
        })*/
    return str;
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
        customEventListener(document, 'unload', function (a) {
            messageObject.disconnect()
        });


        messageObject = new function () {
            var f = 'https://' + window.location.hostname.replace(/(www.)/i, 'ws.') + ':18089/?lang=' + lang + '&platform=' + platform,
                socket = io.connect(f),
                g = document.getElementById('chat_area'),
                k = '',
                l = !1,
                h = null,
                n = 0,
                p = '';
            this.connected = !1;
            'undefined' === typeof languages[lang] && (lang = 'zh-tw');
            output.leave = function () {


                socket.off('connect_failed');
                socket.off('error');
                socket.off('disconnect');
                socket.off('connect');
                socket.off('say');
                socket.off('self');
                socket.off('welcome');
                socket.off('close');
                socket.removeAllListeners();
                socket.disconnect();
                socket.close();
                setTimeout(function () {

                    for (var i in socket) delete socket[i];
                    for (var i in messageObject) delete messageObject[i];
                }, 1000);

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
                //console.log(b)
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
                con(output);
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
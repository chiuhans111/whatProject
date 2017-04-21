// usage: http://www.liveany.com/web.html

document.body.innerHTML = "";
var agent = new Agent();
function createAgent(callback) {
    var agent = new Agent();
    var f = document.createElement('iframe');
    f.height = 500;
    f.src = 'http://www.liveany.com/web.html';
    document.body.appendChild(f);

    agent.connect(f.contentWindow, function (agent) {
        callback({
            agent: agent,
            close: function () {
                agent.disconnect();
                agent = null;
                f.remove();
            }
        });
    });
}

function translate(message) {
    return Array.from(message).map(a => {
        var map = {
            '男': '女',
            '女': '男',
            '妳': '你',
            '叔': '姐',
            '哥': '妹',
            '妹': '哥',
            '姐': '哥',
            '姊': '哥',
            '弟': '姐'
        }
        return map[a] || a;
    }).join('');
}


var fullLog = [];
function startTransferTalk() {
    var log = [];
    var a1, a2, p1, p2;
    createAgent(function (pack) {
        var agent = pack.agent;
        a1 = agent;
        p1 = pack;
        check();
    });
    createAgent(function (pack) {
        var agent = pack.agent;
        a2 = agent;
        p2 = pack;
        check();
    });
    function check() {
        if (a1 && a2) {
            console.log('connection begin');
            a1.on('packetsafe', function (packet) {
                a2.send(translate(packet.message));
                log.push("A:" + packet.message);
            });
            a1.on('readyState', function (agent) {
                if (agent.readyState == 'leave') reset();
            });
            a2.on('packetsafe', function (packet) {
                a1.send(translate(packet.message));
                log.push("B:" + packet.message);
            });
            a2.on('readyState', function (agent) {
                if (agent.readyState == 'leave') reset();
            });
        }
    }
    function reset() {
        fullLog.push(log);
        p1.close();
        p2.close();
        setTimeout(function () {
            startTransferTalk()
        }, 500);
    }
}



var idCounter = 0;
function Agent() {
    this.id = idCounter++;
    var agent = this;
    var observer, target;
    // idle, connected, started, leave
    this.eventport = null;
    this.readyState = 'idle';
    this.window = null;
    this.meetAgent = false;
    function setReadyState(state) {
        agent.readyState = state;
        agent.eventport.emit('readyState', agent);
    }

    var locked = false;
    this.send = function (content) {
        if (locked) return;
        locked = true;
        setTimeout(function () {
            locked = false;
        }, 100);
        if (agent.readyState = 'started') {
            agent.window.document.querySelector('#inputText').value = content;
            agent.window.document.querySelector('#sendMessageButton').click();
        }
    }

    this.leave = function () {
        agent.disconnect();
        agent.window.document.querySelector('#reConnectButton').click();
    }

    // cw node added
    function addedNodesHandler(node) {
        switch (node.tagName) {
            case 'H4':
                switch (node.textContent) {
                    case '連線成功，正等著陌生人':
                        setReadyState('connected');
                        break;
                    case '成功與陌生人連線，互相打個招呼吧':
                        setReadyState('started');
                        break;
                    case '陌生人離開～～':
                        setReadyState('leave');
                        break;
                }
                break;
            case 'DIV':
                if (node.className.includes('bubble left')) {
                    agent.eventport.emit('packet', {
                        message: node.childNodes[0].textContent,
                        device: node.childNodes[1].childNodes[0].textContent
                    });
                    if (agent.meetAgent === false)
                        agent.eventport.emit('packetsafe', {
                            message: node.childNodes[0].textContent,
                            device: node.childNodes[1].childNodes[0].textContent
                        });
                }
                break;
        }
    }

    // cw mutation oberserved
    function observerHandler(mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(addedNodesHandler)
        });
    }

    // cw window created
    function setup(window, callback) {
        agent.window = window;
        agent.eventport = new EventPort();
        observer = new MutationObserver(observerHandler);
        target = window.document.querySelector('#chat_area');

        if (!target) {
            agent.disconnect();
            setTimeout(function () {
                agent.connect(window, callback);
            }, 500);
            return;
        }

        agent.on = agent.eventport.on;
        document.querySelectorAll


        // varify
        var needToVarify = true;
        var token = null;
        var successTime = 0;
        var wrongTime = 0;
        agent.on('readyState', function () {
            if (agent.readyState != 'started') return;
            agent.send('hi hi HI');
            token = 'yo';
        });
        var pattern = {
            'hi hi HI': 'yo',
            'yo': '我今天好累喔',
            '我今天好累喔': '真的嗎',
            '真的嗎': '一直當機',
            '一直當機': '那當然 你是機器人',
            '那當然 你是機器人': '你也是',
            '你也是': '掰掰 別當機了'
        }
        //var wid = setInterval(function () { wrongTime++ }, 500);
        agent.on('packet', function (packet) {
            if (needToVarify) {
                if (token) {
                    if (token == packet.message) {
                        agent.meetAgent = true;
                        successTime++;
                        token = null;
                    } else wrongTime++;
                }
                if (pattern[packet.message]) {
                    setTimeout(function () {
                        var reply = pattern[packet.message];
                        token = pattern[reply];
                        agent.send(reply);
                    }, randomI(1000, 2000));
                }
                if (successTime > 4 || packet.message == '掰掰 別當機了') {
                    needToVarify = false;
                    agent.meetAgent = true;
                    agent.eventport.emit('varified');
                    //clearInterval(wid);
                    setReadyState('leave');
                    agent.disconnect();

                }
                if (wrongTime > 10) {
                    agent.meetAgent = false;
                    agent.eventport.emit('varified');
                    //clearInterval(wid);
                }
            }
        });
        callback(agent);
        // observe
        target.childNodes.forEach(addedNodesHandler)
        observer.observe(
            window.document.querySelector('#chat_area'),
            { attributes: true, childList: true, characterData: true }
        );

    }

    this.connect = function (window, callback) {
        console.log('tryToConnect');
        if (!window.document) {
            agent.disconnect();
            setTimeout(function () {
                agent.connect(window, callback);
            }, 500);
            return;
        }
        if (agent.readyState != 'idle') agent.disconnect();
        if (window.document.readyState == 'complete') setup(window, callback);
        else window.document.onreadystatechange = function () {
            if (window.document.readyState == 'complete') setup(window, callback);
        }
    }

    this.disconnect = function () {
        observer.disconnect();
        setReadyState('idle');
    }
}

function EventPort() {
    var port = {};
    this.emit = function (type, data) { if (port[type]) port[type].map(handler => handler(data)); }
    this.on = function (type, handler) { (port[type] = port[type] || []).push(handler); }
}

function randomI(s, e) {
    return Math.floor(Math.random() * (e - s) + s);
}
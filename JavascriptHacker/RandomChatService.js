// usage: http://www.liveany.com/web.html
document.querySelector('#base').remove();

var agent = new Agent();
function createAgent(callback) {
    var agent = new Agent();
    var f = document.createElement('iframe');
<<<<<<< HEAD
    f.height = 250;
    f.src = 'http://www.liveany.com/web.html';
=======
    f.height = 500;
    f.src = 'https://www.liveany.com/web.html';
>>>>>>> b8cf9e0dc62e9182659f971aabdcf8e14d3fc4de
    document.body.appendChild(f);

    agent.connect(f.contentWindow, function (agent) {
        callback({
            f: f,
            agent: agent,
            close: function () {
                agent.disconnect();
                agent = null;
                f.remove();
            }
        });
    });
}

// multi chat
var chatLimit = 16;
var packs = [];
var blockedMessages = [
    '主人的小m貓在哪裡?',
    '找色女',
    '高雄男尋找炮友~',
    '我是女生婷婷 我在等你交友加我賴的信息 ID：yu899',
    '找色女~ 圖愛 電愛 (不露臉)',
    '蔡英文豬鼻小英'
];


var blockedPattern = [
    includePattern('我在等你交友加我賴的信息'),
    includePattern('妹子加我微信聊天'),
    includePattern('http'),
    regexPattern(/\d{8,10}/),
    regexPattern(/[Ii][Dd]\s*[:：]?\s*.+/),
    regexPattern(/\s*我\s*.\s*\+\s*我賴\s*.+/)
];

var preprossing = [

];

function includePattern(pat) { return function (m) { return m.includes(pat) } }
function regexPattern(pat) { return function (m) { return m.match(pat)!=null } }

function translate(message) {
    return Array.from(message).map(c => {
        var map = {
            '男': '女',
            '女': '男',
            '妳': '你',
            '哥': '姐',
            '姐': '哥',
            '弟': '妹',
            '妹': '弟',
            '叔': '姨',
            '爺': '娘'
        }
        return map[c] || c;
    }).join('');
}


var serverId = 'user5487';
function brod(message) {

    var translated = message;
    var message = '[多人聊天 ' + serverId + '] : ' + translated;
    translated = translate(translated);
    var message2 = '[多人聊天 ' + serverId + '] : ' + translated;
    packs.map(p => p.agent.send((p.agent.wow) ? message2 : message));
}

function qagent(id) {
    return packs.filter(p => p.agent.id == id)[0].agent
}

function update() {
    if (packs.length < chatLimit) {
        createAgent(function (pack) {
            packs.push(pack);

            if (Math.random() < 0.8) pack.agent.wow = true;

            pack.agent.on('packetsafe', function (packet) {
                var translated = packet.message;
                var message = '[多人聊天 user' + pack.agent.id + '] : ' + translated;
                translated = translate(translated);
                var message2 = '[多人聊天 user' + pack.agent.id + '] : ' + translated;
                console.log((pack.agent.wow) ? ('w ' + message2) : message);
                packs.filter(p => p != pack).map(p => p.agent.send((p.agent.wow ^ pack.agent.wow) ? message2 : message));
            });

            pack.agent.on('readyState', function (agent) {
                if (agent.readyState == 'leave') {
                    pack.close();
                    pack.delete = true;
                }
            });
        });
    }
    packs.map(p => { if (p.f.contentWindow == null) p.delete = true });
    packs = packs.filter(p => !p.delete);
}

multi = setInterval(update, 500);

// end multi chat

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

        agent.on('readyState', function () {
            if (agent.readyState != 'started') return;
            agent.send('[多人聊天 server] h i ~ 你的id:' + agent.id);
        });


        agent.on('packet', function (packet) {
            if (packet.message.includes('[多人聊天 ') ||
                blockedMessages.includes(packet.message) ||
                blockedPattern.filter(bp => bp(packet.message)).length > 0) {
                setReadyState('leave');
                return;
            } else {
                agent.eventport.emit('packetsafe', packet);
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
/**
 * use in :
 * http://talkwithstranger.com/talk-to-strangers
 * 
 * msgtypes: strangermsg, youmsg, chatEnded
 */

function dom(tag, modifier, parent) {
    var ele = document.createElement(tag);
    for (var i in modifier) ele[i] = modifier[i];
    if (parent != null) parent.appendChild(ele);
    return ele;
}


// chat bots

var count = 0;


function getNewHacked(callback) {
    var x = window.open('http://talkwithstranger.com/talk-to-strangers');
    if (x.document.readyState == 'complete') ready();
    else x.onreadystatechange = function () {
        if (x.document.readyState == 'complete') ready();
    }

    function ready() {
        x.eval(main.toString() + 'main()');
        x.agent.id = count++;
        callback(x.agent);
    }
}
/*
function getNewHacked2(script, callback) {
    var x = window.open('http://talkwithstranger.com/talk-to-strangers');
    if (x.document.readyState == 'complete') ready();
    else x.onreadystatechange = function () {
        if (x.document.readyState == 'complete') ready();
    }

    function ready() {
        x.eval(script);
        callback(x);
    }
}


for(var i=0;i<10;i++)
getNewHacked2("", function(w){
    function check(){
        var name = w.document.querySelector('#log-msg > b');
        if(!name) setTimeout(check, 500);
        else if(!name.textContent.toLowerCase().includes('f') || name.textContent.toLowerCase().includes('m')){
            socket.emit("typing");
            socket.emit('message', "IMPORTANT!! don't chat here!! this site is recording everything!!!");
            socket.emit('message', null);
            w.close();
        } 
    }
    check();
});
*/

main();
var intro = "HI! here for some great talks!";
function CopyCatBot(req, res) {
    if (req.type == 'strangermsg') res.send(req.content);
}


function StartMultiChat() {
    var agents = [];
    function addNew() {
        getNewHacked(function (a) {
            function check() {
                var name = a.window.document.querySelector('#log-msg > b');
                if (!name) {
                    setTimeout(check, 500);
                    return;
                }
                if (name.textContent.toLowerCase().includes('multichat')) return;
                agents.push(a);
                a.beginChatbot(function (req, res) {
                    if (req.type == 'strangermsg') {
                        console.log(req.name + a.id + " : " + req.content);
                        if (req.image) {

                            agents.filter(a2 => a2 != a).map(a2 => a2.send(req.name + a.id + " : " + req.content));
                            agents.filter(a2 => a2 != a).map(a2 => a2.sendImage(req.image));
                        }
                        if (req.content != '') agents.filter(a2 => a2 != a).map(a2 => a2.send(req.name + a.id + " : " + req.content));
                    }
                }, 300, function () {
                    a.delete = true;
                });
            }
            check();
        });
    }

    function update() {
        agents.filter(a => a.delete).map(a => a.window.close());
        agents = agents.filter(a => !a.delete);
        if (agents.length < 10) addNew();
    }

    multiid = setInterval(update, 500);
}



function StartTransferTalk() {

    document.body.textContent = "";
    var agent1, agent2;


    getNewHacked(function (newAgent) { agent1 = newAgent; check(); });
    getNewHacked(function (newAgent) { agent2 = newAgent; check(); });

    function check() {
        console.log('checking transfer');
        if (agent1 && agent2) setTimeout(function () {
            start();
        }, 1000);
        else console.log('transfer not ready');
    }

    function route(a1, a2, whenfailed) {
        a1.beginChatbot(function (req, res) {
            a1.stop = res.stop;
            if (req.type == 'strangermsg') {
                console.log('msg', req);
                if (req.image) a2.sendImage(req.image);
                if (req.content != '') a2.send(req.content);

                var div = dom('div', {}, document.body);
                dom('p', { textContent: a1.id + " : " + req.content }, div);
                if (req.image) dom('img', { src: req.image, height: 200 }, div);
            }
        }, 200, function () {
            var div = dom('div', {}, document.body);
            dom('p', { textContent: a1.id + " [leave]: " }, div);
            console.log('failed one');
            whenfailed();
        });
    }

    function routeFull(a1, a2) {
        route(a1, a2, function () {
            //a2.send('* person leaves, auto connecting to next person');

            getNewHacked(function (newAgent) {
                var old = a1;
                a1 = newAgent;
                setTimeout(function () {
                    a2.stop();
                    old.stop();
                    old.window.close();
                    routeFull(a2, a1);
                    routeFull(a1, a2);
                    //a2.send('* connected. Say Hi!');
                    //a1.send(intro);
                }, 2500);
            })
        });
    }

    function start() {
        console.log('started');
        routeFull(agent1, agent2);
        routeFull(agent2, agent1);
        setTimeout(function () {
            agent1.send(intro);
            agent2.send(intro);
        }, 1000);

    }
}

/*
agent.beginChatbot(CopyCatBot, 200, function () {
    console.log('chat ended oh no');
});*/

/*
agent.beginChatbot(JSconsole, 200, function () {
    console.log('chat ended oh no');
});*/


function main() {
    this.agent = new Agent();


    // basic functions
    function Agent() {
        var agent = this;
        this.window = window;
        this.send = function (text) {
            console.log("msg sended", text);
            document.querySelector('#chatMessageInput').value = text;
            document.querySelector('#chatSendButton').click();
        }

        var reader = new ReaderAgent();
        this.readlines = function () {
            return reader.getNextAllMessage();
        }

        /**
         * method: function(req, res)
         * req: req.type, req.content
         * res: res.send(msg), res.stop()
         */
        this.beginChatbot = function (method, refreshTime, onStop) {
            var id = null;
            var resAgent = {
                send: function (text) {
                    agent.send(text);
                },
                stop: function () {
                    console.log('chat ended by bot');
                    clearInterval(id);
                }
            };
            id = setInterval(function () {
                var message = agent.readlines();
                for (var m in message) {
                    console.log('message get', message[m]);
                    if (message[m].type == 'chatEnded') {
                        resAgent.stop();
                        onStop();
                        break;
                    }
                    method(message[m], resAgent);
                }
            }, refreshTime);
        }

        function ReaderAgent() {
            var me = this;
            this.anchor = false;

            this.nextanchor = function () {
                if (!me.anchor) return me.anchor = document.querySelector('.messageblock');
                else if (me.anchor.nextElementSibling) return me.anchor = me.anchor.nextElementSibling;
                else return null;
            }

            this.getNextAll = function () {
                var data = '';
                var all = [];
                while (data = this.nextanchor()) all.push(data);
                return all;
            }

            this.getNextAllMessage = function () {
                var all = me.getNextAll();
                return all.map(element => {
                    var type = 'unknown';
                    var image = false;
                    var content = null;
                    var name = "";
                    if (element.className == 'row') type = 'chatEnded';
                    if (element.className == 'messageblock') {
                        name = element.querySelector('.msgsource').textContent
                        type = element.querySelector('div').className;
                        content = element.querySelector('.message').textContent;
                        var img = element.querySelector('img');
                        if (img) image = img.src;
                    }
                    return { name: name, type: type, content: content, image: image };
                });
            }
        }

        // image file magics

        function dataURItoBlob(dataURI) {
            var binary = atob(dataURI);
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
        }

        function getBase64Image(img) {
            // Create an empty canvas element
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            // Copy the image contents to the canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // Get the data-URL formatted image
            // Firefox supports PNG and JPEG. You could check img.src to
            // guess the original format, but be aware the using "image/jpg"
            // will re-encode the image.
            var dataURL = canvas.toDataURL("image/png");

            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }

        this.sendImage = function (url) {
            var img = document.createElement('img');
            img.src = url;
            var s = dataURItoBlob(getBase64Image(img));

            var n = new FileReader;
            n.onload = function (e) {
                image("You", e.target.result);
                socket.emit("user image", e.target.result);
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? $(document).focus() : $("#chatMessageInput").focus()
            };
            n.readAsDataURL(s);
        }


    }
}
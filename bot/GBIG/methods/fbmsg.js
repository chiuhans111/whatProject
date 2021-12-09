var { Doer } = require('../do')


module.exports = function (talkid) {
    var doer = new Doer()

    this.messageHandler = null
    var me = this;
    /**
     * Handles message
     * @param {Function<Number>} callback 
     */
    this.handleMessage = function (callback) {
        me.messageHandler = callback
    }

    function parseAllMessage() {
        return doer.exe(_ => {
            function main(callback, trys = 0) {
                if (trys > 10) return callback([])

                var elements = Array.from(document.querySelectorAll('div[aria-label=訊息]>div:nth-child(3)>div'))

                if (elements.length == 0) {
                    setTimeout(() => {
                        main(callback, trys++)
                    }, 500)
                    return
                }



                var result = elements.map((element, i) => {
                    var sender = element.querySelector('div:nth-child(1)>div>img')
                    if (sender) sender = sender.alt
                    var contents = Array.from(element.querySelectorAll('div[body]'))
                        .map(content => {
                            return content.attributes.body.value
                        })

                    var old = element.read || 0
                    element.read = contents.length
                    contents = contents.slice(old)

                    return { sender, contents, element }
                })

                result = result.filter(r => r.contents.length > 0)
                callback(result)
            }
            return new Promise(done => {
                main(done)
            })
        })
    }

    doer.loadURL('https://facebook.com/messages/t/' + talkid)
        .then(parseAllMessage)
        .then(_ => {

            function msgIn(msgs, callback, i = 0) {
                if (i >= msgs.length) {
                    callback()
                    return;
                }
                var msg = msgs[i]
                if (me.messageHandler instanceof Function)
                    me.messageHandler(msg, doer).then(_ => {
                        msgIn(msgs, callback, i + 1)
                    })

            }


            function update() {
                parseAllMessage().then(result => {
                    result = result.filter(x => x.sender != null)
                    if (result.length > 0) {

                        msgIn(result, function () {
                            setTimeout(() => {
                                update()
                            }, 500);
                        })

                    }
                    else
                        setTimeout(() => {
                            update()
                        }, 500);
                })
            }

            update()

        })

}




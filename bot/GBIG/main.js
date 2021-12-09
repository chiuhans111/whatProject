const { app } = require("electron")
var nircmd = require("nircmd")
var downloader = require('image-downloader')

app.on('ready', function () {
    var ggimg = require('./methods/googleimg')
    var fbmsg = require('./methods/fbmsg')
    var wiki = require('./methods/wiki')
    var bot = new fbmsg('1439477832790481')

    bot.handleMessage(async function (msg, doer) {
        console.log(msg)
        for (var c of msg.contents) {

            match = c.match(/([^]+)(\.jpg|\.png)\s*$/)
            if (match != null) {
                var url = await ggimg(match[1])
                await downloader.image({
                    url, dest: './temp/img.jpg'
                })
                await nircmd('clipboard copyimage ./temp/img.jpg')
                doer.key('v', ['control'])
                doer.key('\r')
            }

            match = c.match(/([^]+)\s*(是什麼|是三小|\.wiki|\?)\s*$/)
            if (match != null) {
                var result = await wiki(match[1])
                doer.type('@' + msg.sender + '\r' + result + '\r')
            }

        }


    })
})



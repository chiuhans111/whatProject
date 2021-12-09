var { Doer } = require('../do')
var doer = new Doer()

module.exports = function (searchStr) {
    return new Promise(done => {
        setTimeout(() => {
            done('http://tomchun.tw/tomchun/2017/05/09/1-2014/')
        }, 5000);
        doer.loadURL(`https://www.google.com/search?q=${encodeURI(searchStr)}&tbm=isch`)
            .then(_ => doer.exe(_ => {
                imgs = Array.from(document.querySelectorAll('img.rg_ic'))
                img = imgs[Math.floor(Math.random() * imgs.length)]
                url = (img.attributes['data-src'] || { value: img.src }).value
                return url
            }))
            .then(url => {
                done(url)
            })
    })
}




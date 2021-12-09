var { Doer } = require('../do')

module.exports = function (searchStr) {
    console.log('search', searchStr)
    var doer = new Doer()
    return new Promise(done => {
        setTimeout(() => {
            done('靠北我睡著了')
        }, 5000);
        doer.loadURL(`https://zh.wikipedia.org/w/index.php?search=${encodeURI(searchStr)}`)
            .then(_ => doer.exe(_ => {
                var content = document.querySelector('#bodyContent')
                if (content == null) return '不知道'
                var lists = Array.from(content.querySelectorAll('li:not([id]):not([class])'))
                    .map(l => l.textContent.split(' ')[0]).join(', ')
                content = content.querySelector('p')
                if (content == null) return '不知道'
                content = content.textContent
                if (content.match('新建這個頁面')) if (lists.length > 2) return '你是說？' + lists
                else return false
                return content + (content.length < 20 ? lists : '')
            })).then(result => {
                if (result === false) done('')
                doer.close()
                if (result.trim().length == 0) done('不知道')
                else done(result)
            })
    })
}




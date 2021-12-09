
var ipc = require('electron').ipcRenderer



ipc.on('exe', (sender, id, code) => {
    // console.log('executing', id, code)
    var target = `${code}`
    var backid = 'done_' + id
    var result = eval(target)
    
    if (result instanceof Promise) result.then(r => {
        ipc.send(backid, r)
    })
    else ipc.send(backid, result)
})

ipc.on('send', function () {
    Array.from(document.querySelectorAll('div>a')).filter(x => x.textContent.match('傳送$'))[0].click()
    console.log('sent')
})

var x = 5

console.log('preload js finnished')
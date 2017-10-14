var liveany = require('./liveany');

liveany((req, res) => {
    console.log('message:', req);
    res.send('?')
}, (res, me) => {
    console.log('connected~', JSON.stringify(me));
    res.send('hi')
}, (res, me) => {
    console.log('disconnected');
})

console.log('gogogo')
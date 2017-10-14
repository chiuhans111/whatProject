var router = require('exdress/router');
var app = router();

app.use(require('exdress/env')({
    answer: null,
}));

function randomAnswer() {
    var numbers = [...'0123456789'];
    var word = '';
    for (var i = 0; i < 4; i++) {
        var index = Math.floor(Math.random() * numbers.length);
        word += numbers.splice(index, 1);
    }
    return word;
}

/**
 * compare two answer
 * @param {string} x 
 * @param {string} y 
 */
function compare(x, y) {
    var a = 0;
    var b = 0;
    for (var i in x) {
        if (y.includes(x[i])) b++;
        if (x[i] == y[i]) a++;
    }
    b -= a;
    return { a, b };
}


app.use((state, msg, next) => {
    if (state.env.answer == null) state.env.answer = randomAnswer();
    next();
});

app.use((state, msg, next) => {
    var result = compare(state.content, state.env.answer);
    if (result.a == 4) {
        msg.reply("**恭喜你猜對了!**");
        state.env.answer = null;
    } else {
        msg.reply(`${result.a}A${result.b}B`);
    }
}, state => {
    var result = state.content.match(/\d\d\d\d/);
    if (result) {
        state.content = result[0];
        return true;
    } else return false;
})

app.use((state, msg, next) => {
    msg.reply('guess what?');
})

module.exports = app;


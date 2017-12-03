var text = "██╗  ██╗\n\
██║  ██║\n\
███████║\n\
╚════██║\n\
     ██║\n\
     ╚═╝"
var text2 = [...Array(text.length)].fill(' ');
function update() {

    for (var i in text) {
        if (Math.random() < 0.06) {
            text2[i] = text[i];
        }
        if (text2[i] != text[i] && Math.random() < 0.5) {
            text2[i] = String.fromCharCode(Math.floor(Math.random() * 128 + 32))
        }
    }
    console.log('\n'.repeat(5))
    console.log(text2.join(''))
    setTimeout(() => {
        update();
    }, 100);
}
update();
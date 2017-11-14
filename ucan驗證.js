var img = document.querySelector('#Login1_CaptCha_IMG');
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

canvas.width = img.width;
canvas.height = img.height;

ctx.drawImage(img, 0, 0);

var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
var data = imgdata.data;
var data2 = [];
for (var i = 0; i < canvas.width; i++) {
    var line = "";
    var linestart = false;
    for (var j = 0; j < canvas.height; j++) {
        var index = (i + j * canvas.width) * 4;
        var value = data[index + 3] > 100;
        line += value ? '*' : ' ';
    }
    line = [...line].reverse().join('').trim();
    data2.push(line);
}

var section = [];
var sections = [];
console.log(data2.map(line => {
    var s = 0;
    [...line].map((x, i) => {
        if (x == '*') {
            s += i * i;
        }
    })
    section.push(s);
    if (section.length > 10) section.shift();
    sections.push(section.map(x => x));
    return section.join().padEnd(60, ' ') + (s + '').padEnd(4, ' ') + '\t' + line;

}).join('\n'));

var map = {
    3: [],
    7: [1, 842, 1016, 1210, 451, 270, 146, 86, 42, 1644]
}

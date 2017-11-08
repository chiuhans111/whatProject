var w = window;
var canvas = w.document.createElement('canvas');
var width, height;
w.document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');
canvas.style.position = 'fixed';
canvas.style.top = '0px';
canvas.style.left = '0px';
canvas.style.pointerEvents = 'none';

function draw() {

    for (var i in Players) {
        var p = Players[i];



        var x = p.x - master.gX;
        var y = p.y - master.gY;
        var d = x * x + y * y;
        d = Math.sqrt(d);

        ctx.strokeStyle = p.children[0].visible ? 'green' : 'white';
        ctx.fillStyle = d < 500 ? 'white' : 'gray';

        line(x / d * 300, y / d * 300, x, y);

        var nx = x / d;
        var ny = y / d;
        var dispd = Math.min(Math.max(200, d / 2), 300);

        ctx.font = '36pt';
        ctx.fillText(`${p.gLevel}`, nx * dispd, ny * dispd);
    }
}

function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function update() {

    canvas.width = w.innerWidth;
    canvas.height = w.innerHeight;
    width = canvas.width;
    height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
    ctx.translate(width / 2, height / 2);
    draw();

    requestAnimationFrame(update);
}

update();
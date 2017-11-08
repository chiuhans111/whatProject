import Vue from 'vue';
import v from './v';
import world from './gravity';
console.log(world);
var appdata = {
    play: true,
    preview: true,
    setup: world.setup
}
var app = new Vue({
    el: "#app",
    data: appdata
})

var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

var camera = {
    p: [0, 0],
    s: 1,
    r: 0,
    matrix: null,
    updateMatrix() {
        var matrix = svg.createSVGMatrix();
        matrix = matrix.translate(canvas.width / 2, canvas.height / 2);
        matrix = matrix.scale(this.s);
        matrix = matrix.rotate(this.r);
        matrix = matrix.translate(...v.mult(this.p, -1));
        this.matrix = matrix;
    },
    toGlobal(point) {
        var matrix = this.matrix;
        console.log(matrix)
        return [
            matrix.a * point[0] + matrix.c * point[1] + matrix.e,
            matrix.b * point[0] + matrix.d * point[1] + matrix.f
        ]
    },
    toLocal(point) {
        var matrix = this.matrix.inverse();
        return [
            matrix.a * point[0] + matrix.c * point[1] + matrix.e,
            matrix.b * point[0] + matrix.d * point[1] + matrix.f
        ]
    }
}
console.log(camera)
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
var c2 = document.createElement('canvas');
var c3 = document.createElement('canvas');
var ctx2 = c2.getContext('2d');
var ctx3 = c3.getContext('2d');

// make canvas follows to window size
function resize() {
    c2.width = canvas.width = innerWidth;
    c2.height = canvas.height = innerHeight;
    update(true);
}

window.addEventListener('resize', resize);


resize();
var t = 0;

function checker(x, f1, f2) {
    return Math.abs(Math.floor(x / f1) % f2) <= 0.5;
}


function background(x, y) {
    var f = world.gravityMap(-x, -y, world.planets);
    var fx = f[0] * 50;
    var fy = f[1] * 50;

    return [
        ((
            checker((x + fx), 100, 20) |
            checker((y + fy), 100, 20)) ? 144 : 0),
        ((
            checker((x + fx), 1000, 20) |
            checker((y + fy), 1000, 20)) ? 192 : 0),
        ((
            checker((x + fx), 10, 20) |
            checker((y + fy), 10, 20)) ? 128 : 0)];

}

var final = 10;
var stop = false;
var max = 8000;
var start = 0;

function update(forceUpdate) {

    if (appdata.play) {
        t++;
        stop = false;
        if (!forceUpdate) world.simulate(world.planets);
    }
    if (forceUpdate || appdata.play) {
        final = 16;
    }


    if (true) {
        camera.updateMatrix();



        c3.width = canvas.width / final;
        c3.height = canvas.height / final;

        var imgdata = ctx3.getImageData(0, 0, c3.width, c3.height);
        var data = imgdata.data;
        var index = -4;
        var lastindex = 0;
        for (var y = 0; y < c3.height; y++) {
            for (var x = 0; x < c3.width; x++) {
                index += 4;

                if ((index - start + data.length) % data.length > max) continue;
                lastindex = index;
                var color = background(...camera.toLocal([
                    (x + 0.5) * canvas.width / c3.width,
                    (y + 0.5) * canvas.height / c3.height]
                ));


                data[index] = color[0] || color;
                data[index + 1] = color[1] || color;
                data[index + 2] = color[2] || color;
                data[index + 3] = 255;

            }
        }
        start += max;
        if (start > data.length) {
            start %= data.length;
            final -= 2;
            if (final < 2) final = 2;
        }

        ctx3.putImageData(imgdata, 0, 0);
        ctx.fillStyle = '#888888';

        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx2.filter = 'blur(' + (final - 2) * 2 + 'px)'
        ctx2.drawImage(c3, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(c2, 0, 0, canvas.width, canvas.height);


        var m = camera.matrix;
        ctx.save();
        ctx.setTransform(-m.a, m.b, m.c, -m.d, m.e, m.f);

        ctx.fillStyle = 'white';

        for (var i of world.planets) {
            ctx.beginPath();
            ctx.ellipse(i.p[0], i.p[1], i.s, i.s, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            /*
            ctx.moveTo(i.p[0], i.p[1]);
            ctx.lineTo(i.p[0] + i.a[0] * 200, i.p[1] + i.a[1] * 200);
            ctx.stroke();*/
        }



        ctx.restore();
        if (!appdata.play) stop = true;
    }
}

function animationLoop() {
    update();
    requestAnimationFrame(animationLoop);
}

addEventListener('mousedown', ev => {
    ev.preventDefault();
});
addEventListener('contextmenu', ev => {
    ev.preventDefault();
});

var mouse = [0, 0];
addEventListener('mousemove', ev => {
    mouse = [ev.x, ev.y];
    if (ev.buttons != 1) return;
    camera.p[0] -= ev.movementX / camera.s;
    camera.p[1] -= ev.movementY / camera.s;
    update(true);
})

addEventListener('wheel', ev => {
    var old = camera.s;
    camera.s *= Math.pow(0.9, ev.deltaY / Math.abs(ev.deltaY));
    camera.s = Math.min(Math.max(camera.s, 0.01), 100);
    update(true);

})

animationLoop();
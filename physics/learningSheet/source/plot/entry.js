import v from 'v';

function fmt(x) {
    var text = x.toString();
    var e = 0;
    if (Math.floor(x).toString().length > 4) {
        var e = Math.floor(Math.log10(x));
        var n = x / Math.pow(10, e);
        text = n.toString();
    }
    text = text.replace(/(\d)\.(\d+)/, function (text, g1, g2) {
        return g1 + '.' + g2.substr(0, 2);
    })
    if (e != 0) return text + 'e+' + e;
    else return text;
}

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {*} setups 
 */
function Plot(canvas, setups) {

    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);



    if (!(setups instanceof Array)) setups = [setups];



    var margin = 10;



    var dataStart = null;
    var dataEnd = null;


    for (var setup of setups) {
        if (setup.data.f instanceof Function) {
            var data = [];
            for (var i = 0; i < setup.data.d; i++) {
                var x = i / (setup.data.e - setup.data.s) + setup.data.s;
                data.push([x, setup.data.f(x)]);
            }
            setup.data = data;
        }

        for (var i of setup.data) {
            if (dataStart == null) dataStart = i;
            if (dataEnd == null) dataEnd = i;
            dataStart = v.min(dataStart, i);
            dataEnd = v.max(dataEnd, i);
        }
    }


    if (dataStart[0] == dataEnd[0]) {
        dataStart[0]--;
        dataEnd[0]++;
    }
    if (dataStart[1] == dataEnd[1]) {
        dataStart[1]--;
        dataEnd[1]++;
    }

    [0, 1].map(i => {
        if (dataStart[i] > 0 && dataEnd[i] > 0 &&
            dataEnd[i] / 2 > dataStart[i]) dataStart[i] = 0;
        if (dataStart[i] < 0 && dataEnd[i] < 0 &&
            dataStart[i] / 2 < dataEnd[i]) dataEnd[i] = 0;
    })


    var left = Math.sign((dataStart[0] + dataEnd[0]));
    var top = -Math.sign((dataStart[1] + dataEnd[1]));


    var maxtextlen = 40;
    for (var i of setups) {
        if (i.mark !== false)
            for (var j of i.data) {
                maxtextlen = Math.max(
                    ctx.measureText(fmt(j[1])).width,
                    maxtextlen);
            }
    }
    maxtextlen += 8;
    maxtextlen = Math.round(maxtextlen);
    var plotStart = [
        margin + (left > 0 ? maxtextlen : 0),
        canvas.height - margin - (top < 0 ? 24 : 0)];
    var plotEnd = [
        canvas.width - margin - (left < 0 ? maxtextlen : 0),
        margin];

    left = left >= 0;
    top = top > 0;
    var translate = point => [0, 1].map(i =>
        Math.round((point[i] - dataStart[i]) *
            (plotEnd[i] - plotStart[i]) /
            (dataEnd[i] - dataStart[i]) + plotStart[i])
    );

    var markedX = {};
    var markedY = {};

    var origin = translate([0, 0]);
    origin = v.min(v.max(origin,
        [plotStart[0], plotEnd[1]]),
        [plotEnd[0], plotStart[1]]);



    for (var setup of setups) {


        var data = setup.data;


        ctx.strokeStyle = 'black';
        ctx.font = "16px arial";
        ctx.beginPath();
        ctx.moveTo(origin[0], plotStart[1]);
        ctx.lineTo(origin[0], plotEnd[1]);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(plotStart[0], origin[1]);
        ctx.lineTo(plotEnd[0], origin[1]);
        ctx.stroke();

        var prev = null;

        for (var i of data) {
            if (setup.mark !== false && i[2] !== false) {
                var p = translate(i);

                ctx.strokeStyle = '#ddd';
                ctx.beginPath();
                ctx.moveTo(origin[0], p[1]);
                ctx.lineTo(p[0], p[1]);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(p[0], origin[1]);
                ctx.lineTo(p[0], p[1]);
                ctx.stroke();

                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.moveTo(origin[0] - 5, p[1]);
                ctx.lineTo(origin[0] + 5, p[1]);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(p[0], origin[1] - 5);
                ctx.lineTo(p[0], origin[1] + 5);
                ctx.stroke();

                ctx.textBaseline = 'middle'
                ctx.fillStyle = 'black';
                ctx.textAlign = left ? 'right' : 'left';
                var my = fmt(i[1]);
                if (!markedY[my])
                    ctx.fillText(my, origin[0] + (left ? - 8 : 8), p[1]);
                markedY[my] = true;

                ctx.textAlign = 'center';
                ctx.textBaseline = top ? 'bottom' : 'top';
                var mx = fmt(i[0]);
                if (!markedX[mx])
                    ctx.fillText(mx, p[0], origin[1] + (top ? -8 : 8));
                markedX[mx] = true;

            }
        }
    }
    for (var setup of setups) {
        var data = setup.data;
        setup.color = setup.color || '#2196F3';
        var prev = null;
        for (var i of data) {
            var p = translate(i);
            if (setup.connect !== false) {
                if (prev) {
                    ctx.strokeStyle = setup.color;
                    ctx.beginPath();
                    ctx.moveTo(...p);
                    ctx.lineTo(...prev);
                    ctx.stroke();
                }
            }
            if (setup.mark !== false && i[2] !== false) {
                ctx.fillStyle = setup.color;
                ctx.fillRect(p[0] - 2.5, p[1] - 2.5, 5, 5);
            }
            prev = p;
        }
    }
}

window.Plot = Plot;
export default Plot;
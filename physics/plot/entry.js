import v from 'v';
function Plot(canvas, setups) {

    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);



    if (!(setups instanceof Array)) setups = [setups];



    var margin = 32;
    var plotStart = [margin * 2, canvas.height - margin];
    var plotEnd = [canvas.width - margin * 2, margin];


    var dataStart = null;
    var dataEnd = null;


    for (var setup of setups) {
        for (var i of setup.datapoints) {
            if (dataStart == null) dataStart = i;
            if (dataEnd == null) dataEnd = i;
            dataStart = v.min(dataStart, i);
            dataEnd = v.max(dataEnd, i);
        }
    }

    [0, 1].map(i => {
        if (dataStart[i] > 0 && dataEnd[i] > 0 &&
            dataEnd[i] / 2 > dataStart[i]) dataStart[i] = 0;
        if (dataStart[i] < 0 && dataEnd[i] < 0 &&
            dataStart[i] / 2 < dataEnd[i]) dataEnd[i] = 0;
    })

    var translate = point => [0, 1].map(i =>
        (point[i] - dataStart[i]) *
        (plotEnd[i] - plotStart[i]) /
        (dataEnd[i] - dataStart[i]) + plotStart[i]
    );
    var markedX = {};
    var markedY = {};
    var origin = translate([0, 0]);
    origin = v.min(v.max(origin,
        [plotStart[0], plotEnd[1]]),
        [plotEnd[0], plotStart[1]]);

    var left = origin[0] < canvas.width / 2;
    var top = origin[1] < canvas.height / 2;

    for (var setup of setups) {


        var datapoints = setup.datapoints;


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

        for (var i of datapoints) {
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
                var my = Math.round(i[1] * 100) / 100;
                if (!markedY[my])
                    ctx.fillText(my, origin[0] + (left ? - 8 : 8), p[1]);
                markedY[my] = true;

                ctx.textAlign = 'center';
                ctx.textBaseline = top ? 'bottom' : 'top';
                var mx = Math.round(i[0] * 100) / 100;
                if (!markedX[mx])
                    ctx.fillText(mx, p[0], origin[1] + (top ? -8 : 8));
                markedX[mx] = true;

            }
        }
    }
    for (var setup of setups) {
        var datapoints = setup.datapoints;
        setup.color = setup.color || '#2196F3';
        var prev = null;
        for (var i of datapoints) {
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
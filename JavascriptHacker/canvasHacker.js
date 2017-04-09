var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
if (doubleCanvas) { doubleCanvas.remove() }
var doubleCanvas = document.createElement('canvas');

doubleCanvas.width = canvas.width;
doubleCanvas.height = canvas.height;
doubleCanvas.style.position = 'fixed';
doubleCanvas.style.left = '0';
doubleCanvas.style.top = '0';
doubleCanvas.style.pointerEvents = 'none';
canvas.parentNode.appendChild(doubleCanvas);
var ctx2 = doubleCanvas.getContext('2d');

function hack(targetName, injectFunction) {
    var copy = ctx[targetName].bind(ctx);
    ctx[targetName] = function () {
        injectFunction(...arguments);
        return copy(...arguments);
    }
    return {
        reset: function () {
            ctx[targetName] = copy;
        }
    }
}
hack('clear')
var handler = hack('drawImage', function (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    var obj = {
        image: image,
        sx: sx, sy: sy, sWidth: sWidth, sHeight: sHeight,
        dx: dx, dy: dy, dWidth: dWidth, dHeight: dHeight
    };
    //ctx2.fillText(image.src, dx, dy);
    ctx2.rect(dx,dy,sx,sy);
    ctx2.stroke();
    //console.log(obj);
});

setInterval(function(){ctx2.clearRect(0,0,1000, 1000);}, 50);
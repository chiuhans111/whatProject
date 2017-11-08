import dom from './dom';
export default function (element, width, height) {
    var array = [];
    if (typeof element == 'string') element = document.querySelector(element) || document.getElementById(element);
    var table = dom('table', {
        style: {
            fontFamily: 'consolas',
            fontSize: '45px',
            margin: 0,
            padding: 0,
            borderCollapse: 'collapse'
        }
    }, element);
    for (var i = 0; i < height; i++) {
        var tr = dom('tr', {
            padding: 0,
            margin: 0
        }, table);
        for (var j = 0; j < width; j++) {
            var td = dom('td', {
                style: {
                    margin: 0,
                    padding: 0,
                }
            }, tr);
            var div = dom('div', {
                textContent: ' ',
                style: {
                    width: '25px',
                    height: '50px',
                }
            }, td);
            array.push(div);
        }
    }
    return array;
}
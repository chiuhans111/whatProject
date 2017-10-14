var x = 0;
var max = 999;
var randomDigit = 153;
exports.get = function () {

    x++;
    x %= max;

    var rnd = Math.floor(Math.random() * randomDigit);
    var code = rnd + x * randomDigit;
    return code.toString(36);
}
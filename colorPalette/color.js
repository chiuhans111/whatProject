function Color(input, input2, input3) {
    function pad(s, n) {
        if (s instanceof Number) s = String(s);
        if (s.length < n) return pad("0" + s);
        return s;
    }
    if (typeof input == "string") {
        if ("0123456789ABCDEF".includes(input[0])) n = parseInt(input, 16);
        else n = parseInt(input.substr(1), 16);
        input = {
            r: Math.floor(n / 256 / 256 % 256),
            g: Math.floor(n / 256 % 256),
            b: Math.floor(n % 256), requireUpdateHSV: true
        };
    } else if (
        isFinite(input) &&
        isFinite(input2) &&
        isFinite(input3)
    ) input = { r: input, g: input2, b: input3, requireUpdateHSV: true };
    var r = 0, g = 0, b = 0, h = 0, s = 0, v = 0;
    if (input != null) {
        r = input.r || 0;
        g = input.g || 0;
        b = input.b || 0;
        h = input.h || 0;
        s = input.s || 0;
        v = input.v || 0;
        if (input.requireUpdateHSV) updateHSV();
    }

    function updateRGB() {
        h = h % 360;
        while (h < 0) h += 360;
        var c = v * s;
        var x = c * (1 - Math.abs(h / 60 % 2 - 1));
        var m = v - c;
        var rr, gg, bb;
        if (h < 60) { rr = c; gg = x; bb = 0; }
        else if (h < 120) { rr = x; gg = c; bb = 0; }
        else if (h < 180) { rr = 0; gg = c; bb = x; }
        else if (h < 240) { rr = 0; gg = x; bb = c; }
        else if (h < 300) { rr = x; gg = 0; bb = c; }
        else { rr = c; gg = 0; bb = x; }
        r = (rr + m) * 255;
        g = (gg + m) * 255;
        b = (bb + m) * 255;
    }
    function updateHSV() {
        var rr = r / 255;
        var gg = g / 255;
        var bb = b / 255;
        var max = Math.max(rr, gg, bb);
        var delta = max - Math.min(rr, gg, bb);
        if (rr > gg && rr > bb) h = 60 * ((gg - bb) / delta % 6);
        else if (gg > rr && gg > bb) h = 60 * ((bb - rr) / delta + 2);
        else if (bb > rr && bb > gg) h = 60 * ((rr - gg) / delta + 4);
        else h = 0;
        s = max == 0 ? 0 : delta / max;
        v = max;
        h = h % 360;
        while (h < 0) h += 360;
    }
    return {
        get brightness() { return Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b) },
        get r() { return r; },
        set r(value) { r = value; updateHSV(); },
        get g() { return g; },
        set g(value) { g = value; updateHSV(); },
        get b() { return b; },
        set b(value) { b = value; updateHSV(); },
        get h() { return h; },
        set h(value) { h = value; updateRGB(); },
        get s() { return s; },
        set s(value) { s = value; updateRGB(); },
        get v() { return v; },
        set v(value) { v = value; updateRGB(); },
        get code() {
            return "#"
                + pad(Math.floor(r).toString(16), 2)
                + pad(Math.floor(g).toString(16), 2)
                + pad(Math.floor(b).toString(16), 2);
        }
    }
}
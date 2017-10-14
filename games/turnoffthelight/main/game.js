function render(map) {

    function get(x, y) {
        if (map[y]) return map[y][x];
        else return null;
    }
    var ss = "";
    map.map((line, y) => {
        var s = "";
        [...line].map((data, x) => {
            if (data == '.') {
                var n = 0;
                if (get(x, y - 1) == '.') n += 1; // up
                if (get(x, y + 1) == '.') n += 2; // down
                if (get(x - 1, y) == '.') n += 4; // left
                if (get(x + 1, y) == '.') n += 8; // right
                s += '.│││─╯╮┤─╰╭├─┴┬┼'[n];
                //  0123456789012345
            } else if (data == 'b') s += '●';
            else if (data == 'B') s += '○';
            else if (data == 'l') s += '◆';
            else if (data == 'L') s += '◇';
            else s += data;
        })

        ss += s.padEnd(20);
    })

    return ss;
}

export default render;
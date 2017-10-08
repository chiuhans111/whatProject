var dir = [[-1, -1], [0, -1], [1, -1], [-1, 0]];

module.exports = function Z(w, h, l, onState, onError) {
    /**@type {Z}*/
    var me = this;

    reset();
    function reset() {
        me.state = {
            last: 2, win: 0,
            w, h, data: new Array(w * h).fill(0)
        }
    }


    onState(me.state);

    function win() {
        var a = iswin(1);
        var b = iswin(2);
        if (a && b) return 3;
        if (a) return 1;
        if (b) return 2;
        if (me.state.data.filter(x => x == 0).length == 0) return 3;
        return 0;
    }

    function iswin(player) {

        var counts = dir.map(d => new Array(me.state.w * me.state.h).fill(0));
        var win = false;
        dir.map((d, di) => {
            var count = counts[di];

            for (var i = 0; i < me.state.h; i++) {

                for (var j = 0; j < me.state.w; j++) {

                    var index = j + i * me.state.w;
                    var px = j + d[0];
                    var py = i + d[1];
                    var prev = px + py * me.state.w;

                    if (me.state.data[index] == player) {
                        if (px >= 0 && py >= 0 && px < me.state.w && py < me.state.h)
                            count[index] = count[prev];
                        count[index] += 1;
                    }


                    if (count[index] >= l) win = true;

                }
            }
        })
        return win;
    }

    function move(player, x, y) {
        if (me.state.win != 0) return;
        if (player == me.state.last) return;

        var index = x + y * me.state.w;

        if (me.state.data[index] != 0) return onError(player);

        me.state.data[index] = player;
        me.state.win = win();
        me.state.last = player;

        onState(me.state);
    }

    this.move = move;
    this.reset = reset;
}
import dom from './dom';
import Table from './table';
function Cee(element, width, height) {
    var table = Table(element, width, height);

    function render(str) {
        table.map((div, i) => {
            div.textContent = str[i];
        })
    }

    table.map((div, i) => {
        var id = i;
        div.onclick = function () {
            on.click(id)
        }
        div.onmousedown = function () {
            div.mousedown = true;
            on.down();
        }
        div.onmouseup = function () {
            div.mousedown = false;
            on.up();
        }
        div.onmouseenter = function () {
            div.mouseover = true;
            on.in(id);
        }
        div.onmouseleave = function () {
            div.mouseover = false;
            on.out(id);
        }
    })

    var on = {
        click() { },
        in() { },
        out() { },
        down() { },
        up() { }
    }

    var is = {
        over(id) {
            return table[id].mouseover
        },
        down(id) {
            return table[id].mousedown
        }
    }

    return {
        render,
        on,
        is
    }

}

export default Cee;
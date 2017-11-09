import Plot from '../plot/entry';
import Vue from 'vue/dist/vue.esm';





Vue.component("katex", {

    computed: {
        _expr: function () {
            try {
                return katex.renderToString(this.$slots.default[0].text, { throwOnError: false });
            } catch (err) {
                return ""
            }
        }
    },
    template: '<span v-html="_expr"></span>'
});


var app = new Vue({
    el: '#app',
    data: {
        imass: 20,
        force: 5,
        Us: 0,
        Uk: 0,
        is1: 0.5,
        is2: 0.5,
        v0: 0,

    },
    computed: {
        mass() {
            return this.imass / 1000;
        },
        s1() { return this.is1 * 1000 },
        s2() { return this.is2 * 1000 },
        a1() {
            return this.force / this.mass;
            this.plot1();
        },
        t1() {
            return (Math.sqrt(this.v0 * this.v0 + 2 * this.a1 * this.s1) - this.v0) / this.a1;
        },
        v1() {
            return this.t1 * this.a1
        }

    },
    watch: {
        t1: plot1,
        v1: _ => {
            plot2();
            plot3();
        }
    }


});
function plot1() {
    Plot(app.$refs.plot1, [{
        datapoints: [
            [0, app.a1],
            [app.t1, app.a1],
            [app.t1, 0],
            [app.t1 * 1.5, 0, false],
        ]
    }]);
}
plot1();

function plot2() {
    Plot(app.$refs.plot2, [{
        datapoints: [
            [0, app.v0],
            [app.t1, app.v1],
            [app.t1 * 1.5, app.v1, false],
        ]
    }]);
}
plot2();

function plot3() {

    Plot(app.$refs.plot3, [{
        datapoints: [...[...Array(20)].map((_, i, a) => {
            var x = i * app.t1 / a.length;
            return [x, app.v0 * x + 0.5 * app.a1 * x * x]
        }), [app.t1 * 1.5, app.s1 + app.t1 * 0.5 * app.v1]]
        , mark: false
    }, {
        datapoints: [[0, 0], [app.t1, app.s1]],
        connect: false
    }]);
}
plot3();
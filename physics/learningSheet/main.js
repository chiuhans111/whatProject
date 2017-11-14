import Vue from 'vue/dist/vue.esm';
import plot from './source/plot/plot.vue';
import katex from './source/katex/katex.vue';

Vue.component("katex", katex);
Vue.component("plot", plot);
/*
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
*/

window.Vue = Vue;


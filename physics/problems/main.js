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

window.Vue = Vue;



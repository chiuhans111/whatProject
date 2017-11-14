import Vue from 'vue/dist/vue.esm';
import plot from './source/plot/plot.vue';
import katex from './source/katex/katex.vue';
import sheetmd from './source/sheetmd/sheetmd.js';
import './style/style.css';
import './dist/test.md';
Vue.component("katex", katex);
Vue.component("plot", plot);

window.Vue = Vue;


var config = window.location.href.match(/\?([^\/]+)\/(\w*)/);

sheetmd.load(config[1], config[2])


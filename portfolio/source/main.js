import Vue from 'vue';

import { get } from './content/get.js';
import test from './content/test.vue';

Vue.component('test', test);

var css = `<link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet" type="text/css">`;
document.head.innerHTML += css;

var data = {
    projects: [],
    info: {}
}

get('/projects').then(projects => {
    data.projects = JSON.parse(projects).projects
})

get('/hansinfo').then(info => {
    data.info = JSON.parse(info).user
})

var app = new Vue({
    el: '#app',
    data
})

window.data = data;


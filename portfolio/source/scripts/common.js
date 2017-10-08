import Vue from 'vue';


var css = `<link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet" type="text/css">`;
document.head.innerHTML += css;



export default {
    Vue,
    done(data) {
        window.data = data;
        var app = new Vue({
            el: '#app',
            data
        });
    }
};


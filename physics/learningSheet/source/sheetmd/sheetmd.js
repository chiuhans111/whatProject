import scopes from './scopes.js';

function load(path, language) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        compile(xhr.response, language, path);
    }
    xhr.open('get', path);
    xhr.send();
}

function compile(code, language, path) {
    var targetElement = document.createElement('div');
    targetElement.id = 'app';


    console.log(language)

    var config = {
        langs: {},
        el: '#app',
        data: {
            lang: language
        }, computed: [],
        element: targetElement
    };


    var task = x => { };

    var codes = code.split('\n');
    for (var line of codes) {
        var scope = line.match(/@@(\w+):/);
        if (scope) {
            task = scopes[scope[1]];
            continue;
        }
        if (line.trim().length > 0)
            task(line, config);
    }

    var finalConfig = `{
    el:"${config.el}",
    data:${JSON.stringify(config.data)},
    computed:{${config.computed.join(',')}}}`;

    var p = document.createElement('p');
    for (var i in config.langs) {
        p.innerHTML += `<a href="#" v-if="'${i}'!=lang" @click="lang='${i}'">
        ${{ ch: "切換至中文", en: "Translate to English" }[i]}</a>`;
    }




    targetElement.insertBefore(p, targetElement.children[0]);
    p.classList.add('lang');
    document.body.appendChild(targetElement);

    var all = targetElement.querySelectorAll('*');
    
    for (var i in all) {
        var element = all[i];
        
        if (element.setAttribute)
            element.setAttribute('key', i);
    }

    console.log(targetElement);
    eval(`var app = new Vue(${finalConfig}); console.log(app)`);
}

window.compile = compile;
window.load = load;

export default {
    compile,
    load
}
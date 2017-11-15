
var svgns = "http://www.w3.org/2000/svg";
var docmode = '';
var docparam = '';
var parentNode = null;
export default {
    var(line, config) {
        var match = line.match(/(\w+)\s*=\s*(.+)/);
        config.data[match[1]] = eval(match[2]);
    },
    calc(line, config) {
        var match = line.match(/(\w+)\s*=\s*(.+)/);
        config.computed.push(`${match[1]}(){return ${match[2]}}`)
    },
    doc(line, config) {

        var match = line.match(/```\s*(\w+)([^]+)/);
        if (match) {
            docmode = match[1];
            docparam = match[2];
        }
        else {
            if (line.match(/```/)) {
                docmode = '';
                if (parentNode) {
                    console.log("append")
                    config.element.appendChild(parentNode);
                    parentNode = null;
                }
                return;
            }
            switch (docmode) {
                case "svg":
                    if (!parentNode) {
                        parentNode = document.createElementNS(svgns, "svg");
                        var scale = docparam.match(/(\d+)x(\d+)/);
                        parentNode.setAttribute('width', scale[1]);
                        parentNode.setAttribute('height', scale[2]);
                    }
                    var part = line.split(',');
                    var match = part[0].match(/([^\s]*"[^"]+"[^\s]*)|[^\s]+/g);
                    var elem = document.createElementNS(svgns, match[0]);
                    for (var i = 1; i < match.length; i++) {
                        var attr = match[i].match(/([^=]+)=(.+)/);
                        elem.setAttribute(attr[1], attr[2]);
                    }
                    if (part[1]) elem.textContent = part[1];
                    parentNode.appendChild(elem);
                    break;
                case "js":

                    if (!parentNode) {
                        parentNode = document.createElement('plot');
                        var scale = docparam.match(/(\d+)x(\d+)/);
                        parentNode.setAttribute('width', scale[1]);
                        parentNode.setAttribute('height', scale[2]);
                    }
                    var data = parentNode.getAttribute(':data') || '';
                    data += line;
                    parentNode.setAttribute(':data', data);

                    break;

                default:

                    line = (function (line) {
                        if (line.trim() == '---') return '<hr>';
                        line = line.replace(/<if:([^]+?)>/, function (g, c) {
                            var div = document.createElement('div');
                            div.setAttribute('v-if', c)
                            config.element.appendChild(div);
                            config.element = div;
                            return '';
                        })
                        line = line.replace(/<\/if>/, function (g, c) {
                            config.element = config.element.parentNode;
                            return '';
                        })
                        line = line.replace(/`(\w+)`/g, function (g, variable) {
                            return `<input type="text" v-model.number="${variable}"></input>`;
                        })
                        line = line.replace(/\$(\w+):([^\$]+)(\$\s)?/g, function (g, lang, content) {
                            config.langs[lang] = true;
                            return `<transition name="list"><span v-if="lang=='${lang}'">${content}</span></transition>`;
                        })
                        line = line.replace(/\*([^]+?)\*/g, function (g, code) {
                            code = code.replace(/{{(\w+)}}/g, '"+($1)+"');
                            return `<katex :expr='"${code}"'></katex>`
                        })
                        var header = line.match(/^(#+)([^]+)/);
                        if (header) line = `<h${header[1].length}>${header[2]}</h${header[1].length}>`;
                        var li = line.match(/^\*([^]+)/);
                        if (li) line = `<li>${li[1]}</li>`
                        return line;
                    })(line)
                    console.log(line)

                    var p = document.createElement('p');
                    p.innerHTML = line;

                    config.element.appendChild(p);


                    break;

            }
        }

    }
}
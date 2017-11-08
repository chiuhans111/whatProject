function copyAttrib(from, to) {
    if (!from instanceof Object) return;
    if (!to instanceof Object) return;
    for (var i in from) {
        var obj = from[i];
        if (obj instanceof Object && !(obj instanceof Array)) {
            copyAttrib(obj, to[i]);
        } else to[i] = obj;
    }
}

function dom(tag, modifiers, parent) {
    var element = document.createElement(tag);
    copyAttrib(modifiers, element);
    if (parent instanceof Element) parent.appendChild(element);
    return element;
}

export default dom;
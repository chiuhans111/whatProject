function get(str) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', str);
    return new Promise(done => {
        xhr.onload = function () {
            done(this.response);
        }
        xhr.send();
    });
}

export { get };
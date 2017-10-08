function get(method, url, content) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);

    return new Promise(done => {
        xhr.onload = function () {
            done(xhr.response);
        }
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(content != null ? JSON.stringify(content) : null)
    })
}
var fs = require('fs');
var get = require('./get');

var express = require('express');
var app = express.Router();

var url = {
    projects: 'https://www.behance.net/v2/users/chiuhans11613a/projects?client_id=o5QyEtArzMqZcV4ms69Z1a7zmC1189iQ&sort=published_date&time=all',
    project: id => `https://www.behance.net/v2/projects/${id}?client_id=o5QyEtArzMqZcV4ms69Z1a7zmC1189iQ`,
    hansinfo: 'https://www.behance.net/v2/users/chiuhans11613a?client_id=o5QyEtArzMqZcV4ms69Z1a7zmC1189iQ'
}

app.get('/update', (req, res) => {

    get(url.projects).then(doc => {
        console.log(doc);
        if (JSON.parse(doc).projects)
            fs.writeFileSync(__dirname + '/cache/projects.json', doc);
    })

    get(url.hansinfo).then(doc => {
        console.log(doc);
        if (JSON.parse(doc).user)
            fs.writeFileSync(__dirname + '/cache/info.json', doc);
    })

    res.send('done');
})

app.get('/projects', (req, res) => {
    res.send(fs.readFileSync(__dirname + '/cache/projects.json'));
})


app.get('/hansinfo', (req, res) => {
    res.send(fs.readFileSync(__dirname + '/cache/info.json'));
})

module.exports = app;
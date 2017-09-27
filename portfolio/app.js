var express = require('express');
var https = require('https');
var app = express();
var fs = require('fs');

app.use(express.static(__dirname + '/dist', {
    extensions: ['html', 'htm']
}));

var url = {
    projects: 'https://www.behance.net/v2/users/chiuhans11613a/projects?client_id=o5QyEtArzMqZcV4ms69Z1a7zmC1189iQ&sort=published_date&time=all',
    project: id => `https://www.behance.net/v2/projects/${id}?client_id=o5QyEtArzMqZcV4ms69Z1a7zmC1189iQ`,
    hansinfo: 'https://www.behance.net/v2/users/chiuhans11613a?client_id=o5QyEtArzMqZcV4ms69Z1a7zmC1189iQ'
}

app.get('/update', (req, res) => {
    https.get(url.projects, doc => {
        var raw = '';
        doc.on('data', chunk => raw += chunk);
        doc.on('end', () => {
            if (JSON.parse(raw).projects) fs.writeFileSync(__dirname + '/cache/projects.json', raw);

        })
    })
    https.get(url.hansinfo, doc => {
        var raw = '';
        doc.on('data', chunk => raw += chunk);
        doc.on('end', () => {
            if (JSON.parse(raw).user) fs.writeFileSync(__dirname + '/cache/info.json', raw);
        })
    })
    res.send('done');
})

app.get('/projects', (req, res) => {
    res.send(fs.readFileSync(__dirname + '/cache/projects.json'));
})


app.get('/hansinfo', (req, res) => {
    res.send(fs.readFileSync(__dirname + '/cache/info.json'));
})

app.listen(1234);
console.log('gogogo')
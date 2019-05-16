var express = require('express');
var fs = require('fs');

var app = express();

var leaderboard = [];

// Serve static folder
app.use(express.static('public'));

// Get json parser middleware
app.use(express.json())

app.post('/new-score', function(req, res) {
    fs.readFile('leaderboard.json', 'utf8', function(err, data) {
        leaderboard = data != undefined ? JSON.parse(data) : [];
        leaderboard.push({name: req.body.name, score: req.body.score});
        // TODO : keep only top 10 before writing
        fs.writeFile('leaderboard.json', JSON.stringify(leaderboard), (err) => {
            if(err) throw err;
        });
    });
   res.end();
});

app.listen(8080);
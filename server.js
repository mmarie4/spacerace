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
        if(leaderboard.length >= 10) {
            // Find smaller score
            var minScore = undefined;
            var indexMin = undefined;
            for (var i = 0; i < leaderboard.length; i++) {
                if(minScore == undefined) {
                    minScore = leaderboard[i].score;
                } else {
                    if(leaderboard[i].score < minScore) {
                        minScore = leaderboard[i].score;
                        indexMin = i;
                    }
                }
            }
            if (indexMin != undefined) {
                if (req.body.score > minScore) {
                    leaderboard.splice(i, 1);
                    leaderboard.push({name: req.body.name, score: req.body.score});
                }
            }
        } else {
            leaderboard.push({name: req.body.name, score: req.body.score});
        }
        fs.writeFile('leaderboard.json', JSON.stringify(leaderboard), (err) => {
            if(err) throw err;
        });
        res.end();
    });
});

app.listen(80);
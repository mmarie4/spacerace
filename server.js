var express = require("express");
var fs = require("fs");
var path = require("path");

var app = express();

var leaderboard = [];

// Serve static folder
app.use(express.static("public"));
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/menu.html"));
});
app.get("/play", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/play.html"));
});

// Get json parser middleware
app.use(express.json());

app.post("/new-score", function(req, res) {
  // Discard XSS injections
  if (req.body.name.includes("<") || req.body.score.includes("<")) {
    console.log(
      "Discarding suspicious request",
      req.body.name,
      " and score type:",
      typeof req.body.score
    );
    res.end();
    return;
  }
  fs.readFile("leaderboard.json", "utf8", function(err, data) {
    leaderboard = data != undefined ? JSON.parse(data) : [];
    if (leaderboard.length >= 10) {
      // Find smaller score and replace it with new
      var minScore = 99999999;
      var indexMin = undefined;
      for (var i = 0; i < leaderboard.length; i++) {
        if (parseFloat(leaderboard[i].score) < minScore) {
          minScore = parseFloat(leaderboard[i].score);
          indexMin = i;
        }
      }
      if (parseFloat(req.body.score) > minScore) {
        leaderboard.splice(indexMin, 1);
        leaderboard.push({ name: req.body.name, score: req.body.score });
      }
    } else {
      leaderboard.push({ name: req.body.name, score: req.body.score });
    }
    // Sort leaderboard
    leaderboard.sort(function(a, b) {
      return parseFloat(b.score) - parseFloat(a.score);
    });
    // Write leaderboard in json file
    fs.writeFile("leaderboard.json", JSON.stringify(leaderboard), err => {
      if (err) throw err;
    });
    res.end();
  });
});

// Get leaderboard data
app.get("/leaderboard", function(req, res) {
  fs.readFile("leaderboard.json", "utf8", function(err, data) {
    leaderboard = data != undefined ? JSON.parse(data) : [];
  });
  res.send(JSON.stringify(leaderboard));
});

app.listen(8080);

const fs = require("fs");

// read js files and append to sr
fs.readdir("public/js/sr", function(err, filenames) {
  if (err) {
    console.log(err);
    return;
  }
  // Erase existing sr.js
  fs.unlink("public/js/sr.js", err => {
    console.log("Erasing previous sr.js...");
    if (err) {
      console.error("No existing sr.");
      return;
    }
  });
  var logStream = fs.createWriteStream("public/js/sr.js", { flags: "a" });
  console.log("Reading sources directory:", filenames.length, "files found.");
  console.log("Creating sr.js...");
  filenames.forEach(function(filename) {
    fs.readFile("public/js/sr/" + filename, "utf-8", function(err, content) {
      if (err) {
        console.log(err);
        return;
      }
      if (filename != "main.js") logStream.write(content);
      logStream.write("\n");
    });
  });
  console.log("public/sr.js created !");
});

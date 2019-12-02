const sr_utils = {
  // Return the global coordinates of an object
  localToGlobal: function(object) {
    let widthHalf = window.innerWidth / 2;
    let heightHalf = window.innerHeight / 2;

    let pos = object.position.clone();
    pos.project(camera);
    pos.x = pos.x * widthHalf + widthHalf;
    pos.y = -(pos.y * heightHalf) + heightHalf;

    return pos;
  },

  // Open source code in new tab/window
  onClickCode: function() {
    window.open("https://github.com/mmarie4/spacerace", "_blank").focus();
  },

  // Pause
  onClickPause: function() {
    scene.pause = !scene.pause;
    scene.pause
      ? document
          .getElementById("pause-img")
          .setAttribute("src", "res/play-icon.png")
      : document
          .getElementById("pause-img")
          .setAttribute("src", "res/pause-icon.png");
  },

  // Load gltf
  loadModel: function(manager, scene, key, model) {
    let loader = new THREE.GLTFLoader(manager);
    loader.load(
      model,
      function(gltf) {
        scene.models[key] = gltf.scene;
      },
      function(xhr) {},
      // called when loading has errors
      function(error) {
        console.log(error);
      }
    );
  },

  // Load texture
  loadTexture: function(manager, scene, key, texture) {
    let loader = new THREE.TextureLoader(manager);
    loader.load(
      texture,
      function(res) {
        console.log("loaded:", res);
        scene.textures[key] = res;
      },
      function(xhr) {},
      // called when loading has errors
      function(error) {
        console.log(error);
      }
    );
  },

  // Display/hide leaderboard
  onClickLeaderboard: function() {
    if (!leaderboardDisplayed) {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "/leaderboard", true);
      //Send the proper header information along with the request
      xhr.onreadystatechange = function() {
        // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          let leaderboard = JSON.parse(xhr.responseText);
          for (let i = 0; i < leaderboard.length; i++) {
            document.getElementById("player" + parseInt(i + 1)).innerHTML =
              leaderboard[i].name;
            document.getElementById("score" + parseInt(i + 1)).innerHTML =
              leaderboard[i].score;
          }
          document
            .getElementById("leaderboard-section")
            .setAttribute("style", "display: inline-block");
          leaderboardDisplayed = true;
        }
      };
      score = {
        name: document.getElementById("player-text").getAttribute("value"),
        score: document.getElementById("time").innerHTML
      };
      xhr.send();
    } else {
      document
        .getElementById("leaderboard-section")
        .setAttribute("style", "display: none");
      leaderboardDisplayed = false;
    }
  },
  onClickCross: function() {
    document
      .getElementById("leaderboard-section")
      .setAttribute("style", "display: none");
    leaderboardDisplayed = false;
  }
};

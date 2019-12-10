import sr_game from "./sr/sr_game.js";
import sr_utils from "./sr/sr_utils.js";
import sr_constants from "./sr/sr_constants.js";

// ================================ Global vars ==============================
const scene = new THREE.Scene();
scene.spawns = [];
scene.orphans = [];
scene.lastUpdate = new Date();
scene.models = {};
scene.textures = {};
const urlParams = new URLSearchParams(window.location.search);
scene.leaderboardDisplayed = false;
sr_game.setScene(scene);
sr_game.setRenderer(new THREE.WebGLRenderer());

// Display player name
var player = "Player" + parseInt(Math.random() * 10000);
document.getElementById("player-text").setAttribute("value", player);
document.getElementById("player-text").addEventListener("keyup", function(e) {
  if (e.which == 13 && this.value != "") this.blur();
});

// Init ship from param
const shipId = sr_constants.SHIPIDLIST.includes(urlParams.get("ship"))
  ? urlParams.get("ship")
  : "1";

// Loading manager
scene.manager = new THREE.LoadingManager();
const loading = document.getElementById("loading");
scene.manager.onProgress = function(item, loaded, total) {
  console.log("Loading", item, ":", (loaded / total) * 100 + "%");
};
scene.manager.onLoad = function() {
  console.log("Loading complete !");
  document.getElementById("floating-items").style.display = "";
  document.getElementById("loading").style.display = "none";
  sr_game.init();
  sr_game.animate();
};

// Load models and textures
sr_utils.loadModel(scene.manager, scene, "enemy", "res/joined-enemy.glb");
sr_utils.loadModel(
  scene.manager,
  scene,
  "ship",
  "res/joined-spaceship" + shipId + ".glb"
);
sr_utils.loadModel(scene.manager, scene, "floor", "res/floor.glb");
sr_utils.loadTexture(scene.manager, scene, "metal", "res/metal1.png");

document
  .getElementById("play-text")
  .addEventListener("click", e => sr_game.play());
document
  .getElementById("restart-text")
  .addEventListener("click", e => sr_game.restart());
document
  .getElementById("code-icon")
  .addEventListener("click", e => sr_utils.onClickCode());
document
  .getElementById("leaderboard-img")
  .addEventListener("click", e =>
    sr_utils.onClickLeaderboard(sr_game.scene.leaderboardDisplayed)
  );
document
  .getElementById("pause-img")
  .addEventListener("click", e => sr_utils.onClickPause(sr_game.scene));
document
  .getElementById("cross")
  .addEventListener("click", e => sr_utils.onClickCross());

let lastUpdate = new Date();
// Loading manager
let manager = new THREE.LoadingManager();
const loading = document.getElementById("loading");
manager.onProgress = function(item, loaded, total) {
  console.log("Loading", item, ":", (loaded / total) * 100 + "%");
};
manager.onLoad = function() {
  console.log("Loading complete !");
  document.getElementById("loading").style.display = "none";
  init();
  animate(scenes[0], renderers[0]);
};

const renderers = [];
const scenes = [];

// Init scenes and load models
for (let i = 0; i < 3; i++) {
  renderers[i] = new THREE.WebGLRenderer();
  scenes[i] = new THREE.Scene();
  scenes[i].pause = true;
  scenes[i].models = {};
  sr_utils.loadModel(manager, scenes[i], "ship", "res/joined-spaceship.glb");
  renderers[i].setSize(300, 300);
  document
    .getElementById("menu-container")
    .appendChild(renderers[i].domElement);
}

// Add ships in scenes
const init = function() {
  for (let i = 0; i < 3; i++) {
    console.log("Initializing scene", i);
    let ship = scenes[i].models.ship.clone();
    // ship.position.x = x
    ship.position.y = -3;
    ship.position.z = -15;
    ship.move = function() {
      console.log("Moving ship", i);
      ship.rotation.y += Math.PI / 180;
    };
    scenes[i].add(ship);
    scenes[i].ship = ship;
    // camera
    const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
    // camera.position.z = 25;
    // camera.rotation.x = -0.2;
    scenes[i].add(camera);
    scenes[i].camera = camera;
    // Light
    const light = new THREE.PointLight(0xfff2c4, 2, 0, 2);
    light.position.set(10, 10, -10);
    scenes[i].add(light);
    const light2 = new THREE.PointLight(0xfff2c4, 1, 0, 2);
    light2.position.set(2, -5, -5);
    scenes[i].add(light2);
    // Listeners
    document
      .getElementsByTagName("canvas")
      [i].addEventListener("mouseover", () => (scenes[i].pause = false));
    document
      .getElementsByTagName("canvas")
      [i].addEventListener("mouseleave", () => (scenes[i].pause = true));
  }
};

const animate = function() {
  if (Math.abs(new Date() - lastUpdate) > sr_constants.UPDATE_FREQ) {
    if (!scenes[0].pause) {
      // Handle spaceship
      console.log(scenes[0]);
      scenes[0].ship.move();
    }
    lastUpdate = new Date();
  }
  // Render
  renderers[0].render(scenes[0], scenes[0].camera);
  requestAnimationFrame(animate);
};

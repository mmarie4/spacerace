import sr_constants from "./sr_constants.js";
import sr_spawns from "./sr_spawns.js";
import sr_spaceship from "./sr_spaceship.js";
import sr_listeners from "./sr_listeners.js";

const sr_game = {
  setScene: function(scene) {
    this.scene = scene;
  },
  setRenderer: function(renderer) {
    this.renderer = renderer;
  },
  animate: function() {
    if (
      Math.abs(new Date() - this.scene.lastUpdate) > sr_constants.UPDATE_FREQ
    ) {
      if (!this.scene.gameOver && !this.scene.pause) {
        // Handle spawns
        for (let i = 0; i < this.scene.spawns.length; i++) {
          if (
            Math.abs(
              this.scene.spawns[i].position.x - this.scene.ship.position.x
            ) > sr_constants.SPAWN_LIMIT_FAR ||
            Math.abs(
              this.scene.spawns[i].position.y - this.scene.ship.position.y
            ) > sr_constants.SPAWN_LIMIT_FAR
          ) {
            this.scene.spawns[i].clear(this.scene, this.scene.orphans);
            this.scene.spawns.splice(i, 1);
          } else {
            if (Math.random() < sr_constants.SPAWN_FREQ) {
              this.scene.spawns[i].pop() &&
                this.scene.spawns[i].update(this.scene, this.scene.camera);
            }
            this.scene.spawns[i].update(this.scene, this.scene.camera);
          }
        }
        // Create new spawns
        let rand = Math.random();
        if (
          rand < sr_constants.NEWSPAWN_FREQ_NEAR &&
          this.scene.spawns.length < sr_constants.MAX_NB_SPAWNS
        ) {
          if (rand < sr_constants.NEWSPAWN_FREQ_FAR) {
            this.scene.spawns.push(
              sr_spawns.create(
                this.scene,
                this.scene.ship.position.x +
                  sr_constants.SPAWN_LIMIT_FAR * (Math.random() - 0.5),
                this.scene.ship.position.y +
                  sr_constants.SPAWN_LIMIT_FAR * (Math.random() - 0.5),
                sr_constants.SPAWN_Z
              )
            );
          } else {
            this.scene.spawns.push(
              sr_spawns.create(
                this.scene,
                this.scene.ship.position.x +
                  sr_constants.SPAWN_LIMIT_NEAR * (Math.random() - 0.5),
                this.scene.ship.position.y +
                  sr_constants.SPAWN_LIMIT_NEAR * (Math.random() - 0.5),
                sr_constants.SPAWN_Z
              )
            );
          }
        }
        // Move orphan enemies
        for (let i = 0; i < this.scene.orphans.length; i++) {
          if (
            this.scene.orphans[i].position.z >= this.scene.camera.position.z
          ) {
            this.scene.remove(this.scene.orphans[i]);
            this.scene.orphans.splice(i, 1);
          } else {
            this.scene.orphans[i].move(this.scene.ship);
          }
        }
        // Handle spaceship
        this.scene.ship.move();
        this.scene.camera.update(this.scene.ship);
        // Check collisions
        this.scene.spawns.forEach(spawn =>
          this.scene.ship.checkCollisions(spawn.enemies, this.scene)
        );
        // Update info displayed
        this.scene.ship.checkBoost();
        document.getElementById("time").innerHTML =
          Math.abs(new Date() - this.scene.timestart) / 1000 + " s";
      } else {
      }
      this.scene.lastUpdate = new Date();
    } else {
    }
    // Render
    this.renderer.render(this.scene, this.scene.camera);
    requestAnimationFrame(this.animate.bind(this));
  },

  play: function() {
    document
      .getElementById("start-text")
      .setAttribute("style", "display: none");
    document.getElementById("play-text").setAttribute("style", "display: none");
    document.getElementById("render").style.visibility = "";
    this.scene.pause = false;
    this.scene.timestart = new Date();
  },

  restart: function() {
    this.scene.ship.position.set(0, -20, 10);
    document
      .getElementById("gameover-text")
      .setAttribute("style", "display: none");
    document
      .getElementById("restart-text")
      .setAttribute("style", "display: none");
    this.scene.gameOver = false;
    this.scene.pause = false;
    this.scene.timestart = new Date();
    this.scene.add(this.scene.ship);
  },

  init: function() {
    this.scene.background = new THREE.Color(0x00072b);
    this.scene.gameOver = false;
    this.scene.pause = true;
    // lights
    const light = new THREE.PointLight(0xfff2c4, 2, 0, 2);
    light.position.set(1000, 3500, 0);
    this.scene.add(light);
    const light2 = new THREE.PointLight(0xc4ceff, 1.5, 0, 0);
    light2.position.set(-5000, -1000, -900);
    this.scene.add(light2);
    const light3 = new THREE.PointLight(0xf4e2ff, 2, 0, 0);
    light3.position.set(-10, -10, 0);
    this.scene.add(light3);

    // this.renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight - 100);

    // spaceship
    sr_spaceship.init(
      this.scene,
      -20,
      10,
      sr_constants.SPACESHIP_SPEEDX,
      sr_constants.SPACESHIP_SPEEDY
    );

    // World
    // initWorld(this.scene, 0, -100, 0);

    // camera
    this.scene.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.scene.camera.position.z = 25;
    this.scene.camera.rotation.x = -0.2;
    this.scene.camera.update = function(object) {
      this.position.x = object.position.x;
      this.position.y = object.position.y + 5;
      this.position.z = object.position.z + 15;
    };

    this.scene.end = function() {
      this.gameOver = true;
      this.remove(this.ship.reactor1);
      this.remove(this.ship.reactor2);
      this.remove(this.ship.reactor3);
      this.remove(this.ship);
      this.spawns.forEach(s => s.clear(this, this.orphans));
      this.orphans.forEach(o => {
        this.remove(o);
      });
      this.orphans = [];
      this.spawns = [];
      sr_spaceship.init(
        this,
        -20,
        10,
        sr_constants.SPACESHIP_SPEEDX,
        sr_constants.SPACESHIP_SPEEDY,
        this.manager
      );
      this.ship.kill(this);
      document
        .getElementById("gameover-text")
        .setAttribute("style", "visibility: visible");
      document
        .getElementById("restart-text")
        .setAttribute("style", "display: inline");
      // send score
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/new-score", true);
      //Send the proper header information along with the request
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function() {
        // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          // do nothing...
        }
      };
      if (
        !document.getElementById("player-text").value.includes("<") &&
        !document.getElementById("player-text").value.includes(">")
      ) {
        const score = {
          name: document.getElementById("player-text").value,
          score: document.getElementById("time").innerHTML
        };
        xhr.send(JSON.stringify(score));
      }
    };

    document.getElementById("render").appendChild(this.renderer.domElement);

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // document.getElementById("controls").style.display = "inline-block";
      alert("No mobile version yet.");
    } else {
      document.addEventListener("keydown", e => {
        sr_listeners.onDocumentKeyDown(e, this);
      });
      document.addEventListener("keyup", e => {
        sr_listeners.onDocumentKeyUp(e, this);
      });
    }
  }
};

export default sr_game;

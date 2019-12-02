const sr_world = {
  initWorld: function(scene, x, y, z) {
    // floor
    floor = scene.models.floor.clone();
    floor.position.y = y;
    floor.position.z = z;
    floor.rotation.x = Math.PI;
    floor.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    scene.add(floor);
  }
};

const sr_spawns = {
  create: function(scene, x, y, z) {
    let spawn = {
      scene: scene,
      speed: sr_constants.SPAWN_SPEED * Math.random() - 0.5,
      enemies: [],
      position: {
        x: x,
        y: y,
        z: z
      },
      pop: function() {
        let newEnemy = sr_enemy.create(
          this.position.x,
          this.position.y,
          this.position.z,
          sr_constants.ENEMIES_SPEED_Z
        );
        this.enemies.push(newEnemy);
        this.scene.add(newEnemy);
      },
      update: function(scene, camera) {
        // Move
        this.position.x += this.speed;
        this.position.y += this.speed;
        this.position.z = scene.ship.position.z + sr_constants.SPAWN_Z;
        // Remove enemies outside and move others
        this.enemies.forEach(e => {
          if (e.position.z > sr_constants.BORDER_ENEMIES) {
            scene.remove(e);
          } else {
            e.move(scene.ship);
          }
        });
        // Clean enemies array
        //this.enemies = this.enemies.filter(e => e.position.z < camera.position.z);
      },
      clear: function(scene, orphans) {
        this.enemies.forEach(e => orphans.push(e));
      }
    };
    return spawn;
  }
};

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

const sr_listeners = {
  onDocumentKeyDown: function(event) {
    const keyCode = event.which;
    if (keyCode == 38) {
      // up key
      scene.ship.upPressed = true;
    } else if (keyCode == 40) {
      // down key
      scene.ship.downPressed = true;
    } else if (keyCode == 39) {
      // right key
      scene.ship.rightPressed = true;
    } else if (keyCode == 37) {
      // left key
      scene.ship.leftPressed = true;
    } else if (keyCode == 32) {
      // space bar
      scene.ship.boost();
    }
  },
  onDocumentKeyUp: function(event) {
    event.preventDefault();
    const keyCode = event.which;
    if (keyCode == 38) {
      // up key
      event.preventDefault();
      scene.ship.upPressed = false;
    } else if (keyCode == 40) {
      // down key
      event.preventDefault();
      scene.ship.downPressed = false;
    } else if (keyCode == 39) {
      // right key
      event.preventDefault();
      scene.ship.rightPressed = false;
    } else if (keyCode == 37) {
      // left key
      event.preventDefault();
      scene.ship.leftPressed = false;
    }
  }
};

const sr_enemy = {
  create: function(x, y, z, speedz) {
    let geometry = new THREE.BoxGeometry(5, 5, 5);
    let material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xff1d00)
    });
    let enemy = scene.models.enemy.clone();
    enemy.position = THREE.Vector3();
    enemy.position.x = x;
    enemy.position.y = y;
    enemy.position.z = z;
    enemy.zSpeed = speedz;
    enemy.Kpy = sr_constants.ENEMIES_KPY * Math.random();
    enemy.Kpx = sr_constants.ENEMIES_KPX * Math.random();
    enemy.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    enemy.anticipate = sr_constants.ANTICIPATE * Math.random();

    enemy.move = function(spaceship) {
      this.position.z += this.zSpeed;
      let OFFSET_Y = 0;
      OFFSET_Y = spaceship.upPressed ? OFFSET_Y + this.anticipate : OFFSET_Y;
      OFFSET_Y = spaceship.downPressed
        ? OFFSET_Y + -1 * this.anticipate
        : OFFSET_Y;
      let errorY =
        (spaceship.position.y +
          sr_constants.AIM_ENEMY_Y +
          OFFSET_Y -
          this.position.y) *
        this.Kpy;
      let OFFSET_X = 0;
      OFFSET_X = spaceship.rightPressed ? OFFSET_X + this.anticipate : OFFSET_X;
      OFFSET_X = spaceship.leftPressed
        ? OFFSET_X + -1 * this.anticipate
        : OFFSET_X;
      let errorX =
        (spaceship.position.x + OFFSET_X - this.position.x) * this.Kpx;
      let errorX_noOffset = (spaceship.position.x - this.position.x) * this.Kpx;
      this.position.y += errorY;
      this.position.x += errorX;
      this.hitbox.setFromObject(this);
    };
    return enemy;
  }
};

const sr_constants = {
  SERVER_ADDRESS: "51.38.68.118:8080",
  UPDATE_FREQ: 20,
  ENEMIES_SPEED_Z: 15,
  ENEMIES_KPX: 0.2,
  ENEMIES_KPY: 0.1,
  BORDER_ENEMIES: 30,
  SPACESHIP_SPEEDX: 10,
  SPACESHIP_SPEEDY: 8,
  BOOST: 20,
  DECAY_BOOST: 2.0,
  BOOST_COOLDOWN_MS: 3000,
  SPAWN_SPEED: 50,
  SPAWN_Z: -500,
  SPAWN_LIMIT_FAR: 2000,
  SPAWN_LIMIT_NEAR: 400,
  SPAWN_PADDING: 10,
  SPAWN_FREQ: 0.03,
  MAX_NB_SPAWNS: 350,
  NEWSPAWN_FREQ_FAR: 4.0,
  NEWSPAWN_FREQ_NEAR: 6.0,
  AIM_ENEMY_Y: 5,
  LIMIT_AIM: 0,
  ANTICIPATE: 30
};

const sr_spaceship = {
  init: function(scene, y, z, xspeed, yspeed) {
    ship = scene.models.ship.clone();
    ship.position.y = y;
    ship.position.z = z;
    ship.rotation.y = Math.PI / 2;
    ship.xSpeed = xspeed;
    ship.ySpeed = yspeed;
    ship.zSpeed = 0;
    ship.accel = 0;
    ship.lastBoost = new Date();
    ship.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    ship.move = function() {
      this.hitbox.set(this.position, this.position);
      if (this.upPressed) {
        this.position.y += this.ySpeed + this.accel;
        this.light.position.y += this.ySpeed + this.accel;
      }
      if (this.downPressed) {
        this.position.y -= this.ySpeed + this.accel;
        this.light.position.y -= this.ySpeed + this.accel;
      }
      if (this.rightPressed) {
        this.position.x += this.xSpeed + this.accel;
        this.light.position.x += this.xSpeed + this.accel;
      }
      if (this.leftPressed) {
        this.position.x -= this.xSpeed + this.accel;
        this.light.position.x -= this.xSpeed + this.accel;
      }
      this.position.z -= this.accel;
      if (this.accel > 0) {
        this.accel -= sr_constants.DECAY_BOOST;
      } else {
        this.accel = 0;
      }
      if (this.accel == 0) {
        this.reactor1.scale.set(5, 5, 5);
        this.reactor2.scale.set(5, 5, 5);
        this.reactor3.scale.set(5, 5, 5);
      }
      ship.reactor1.position.set(
        ship.position.x - 0.1,
        ship.position.y + 3.78,
        ship.position.z + 10
      );
      ship.reactor2.position.set(
        ship.position.x - 0.65,
        ship.position.y + 3.35,
        ship.position.z + 10
      );
      ship.reactor3.position.set(
        ship.position.x + 0.45,
        ship.position.y + 3.35,
        ship.position.z + 10
      );
      this.hitbox.setFromObject(this);
    };
    ship.checkCollisions = function(objects, scene) {
      objects.forEach(o => {
        if (o.hitbox.intersectsBox(this.hitbox)) scene.end();
      });
    };
    ship.boost = function() {
      if (
        Math.abs(new Date() - this.lastBoost) > sr_constants.BOOST_COOLDOWN_MS
      ) {
        this.lastBoost = new Date();
        this.accel = sr_constants.BOOST;
        document
          .getElementById("boost-text")
          .setAttribute("style", "opacity: 0.2");
        this.reactor1.scale.set(8, 8, 8);
        this.reactor2.scale.set(8, 8, 8);
        this.reactor3.scale.set(8, 8, 8);
      }
    };
    (ship.checkBoost = function() {
      if (
        Math.abs(new Date() - this.lastBoost) > sr_constants.BOOST_COOLDOWN_MS
      ) {
        document
          .getElementById("boost-text")
          .setAttribute("style", "opacity: 1.0");
      }
    }),
      (ship.kill = function(scene) {
        scene.remove(this);
        scene.remove(this.reactor1);
        scene.remove(this.reactor2);
        scene.remove(this.reactor3);
        scene.remove(this.light);
      });
    ship.light = new THREE.PointLight(0xffffff, 0.5, 0, 2);
    ship.light.position = ship.position;
    ship.light.position.y += 5;
    ship.light.position.x += 5;
    // Sprites : https://ui-ex.com/explore/transparent-circle-light/
    new THREE.TextureLoader().load("res/reactor.png", function(spriteMap) {
      let spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
        color: 0xffffff
      });
      ship.reactor1 = new THREE.Sprite(spriteMaterial);
      ship.reactor2 = new THREE.Sprite(spriteMaterial);
      ship.reactor3 = new THREE.Sprite(spriteMaterial);
      ship.reactor1.scale.set(5, 5, 5);
      ship.reactor2.scale.set(5, 5, 5);
      ship.reactor3.scale.set(5, 5, 5);
      scene.add(ship.reactor1);
      scene.add(ship.reactor2);
      scene.add(ship.reactor3);
    });
    scene.add(ship.light);
    scene.ship = ship;
    scene.add(scene.ship);
  }
};


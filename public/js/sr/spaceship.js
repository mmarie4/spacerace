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

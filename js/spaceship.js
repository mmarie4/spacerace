var createShip = function(scene, y, z, xspeed, yspeed) {
    var loader = new THREE.GLTFLoader();
    var callback = function(gltf) {
        ship = gltf.scene;
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
            if (this.rightPressed)  {
                this.position.x += this.xSpeed + this.accel;
                this.light.position.x += this.xSpeed + this.accel;
            }
            if (this.leftPressed) {
                this.position.x -= this.xSpeed + this.accel;
                this.light.position.x -= this.xSpeed + this.accel;
            }
            this.position.z -= this.accel;
            if (this.accel > 0) {
                this.accel -= DECAY_BOOST;
            } else {
                this.accel = 0;
            }
            stayInScreen(this);
            this.hitbox.setFromObject(this);
        }
        ship.checkCollisions = function(objects, scene) {
            objects.forEach(o => {
                if (o.hitbox.intersectsBox(this.hitbox)) scene.end();
            });
        }
        ship.boost = function() {
            if (Math.abs(new Date() - this.lastBoost) > BOOST_COOLDOWN_MS) {
                this.lastBoost = new Date();
                this.accel = BOOST;
                document.getElementById("boost-text").setAttribute("style", "opacity: 0.2");
            }
        }
        ship.checkBoost = function() {
            if (Math.abs(new Date() - this.lastBoost) > BOOST_COOLDOWN_MS) {
                document.getElementById("boost-text").setAttribute("style", "opacity: 1.0");
            }
        }
        ship.light = new THREE.PointLight(0xffffff, 0.5, 0, 2);
        ship.light.position = ship.position;
        ship.light.position.y += 5;
        ship.light.position.x += 5;
        scene.add(ship.light);
        scene.ship = ship;
    }
    loader.load('res/joined-spaceship.glb', callback);
}
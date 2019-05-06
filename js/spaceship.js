var createShip = function(scene, y, z, xspeed, yspeed) {
    var loader = new THREE.GLTFLoader();
    var callback = function(gltf) {
        ship = gltf.scene;
        ship.position.y = y;
        ship.position.z = z;
        ship.rotation.y = Math.PI / 2;
        ship.xSpeed = xspeed;
        ship.ySpeed = yspeed;
        ship.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        ship.move = function() {
            this.hitbox.set(this.position, this.position);
            if (this.upPressed) {
                this.position.y += this.ySpeed;
                this.light.position.y += this.ySpeed;
            }
            if (this.downPressed) {
                this.position.y -= this.ySpeed;
                this.light.position.y -= this.ySpeed;
            }
            if (this.rightPressed)  {
                this.position.x += this.xSpeed;
                this.light.position.x += this.xSpeed;
            }
            if (this.leftPressed) {
                this.position.x -= this.xSpeed;
                this.light.position.x -= this.xSpeed;
            }
            stayInScreen(this);
            this.hitbox.setFromObject(this);
        }
        ship.checkCollisions = function(objects, scene) {
            objects.forEach(o => {
                if (o.hitbox.intersectsBox(this.hitbox)) scene.gameOver = true;
            });
        }
        ship.light = new THREE.PointLight(0xffffff, 0.5, 0, 2);
        ship.light.position = ship.position;
        ship.light.position.y += 5;
        ship.light.position.x += 5;
        scene.add(ship.light);
        scene.add(ship);
        scene.ship = ship;
    }
    loader.load('res/joined-spaceship.glb', callback);
}
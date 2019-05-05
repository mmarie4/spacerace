var createCube = function(y, z, xspeed, yspeed) {
    var geometry = new THREE.BoxGeometry( 5, 5, 5 );
    var material = new THREE.MeshStandardMaterial( { emissive: new THREE.Color(0x003996) } );
    var cube = new THREE.Mesh( geometry, material );
    cube.position = THREE.Vector3();
    cube.position.y = y;
    cube.position.z = z;
    cube.xSpeed = xspeed;
    cube.ySpeed = yspeed;
    cube.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    cube.move = function() {
        this.hitbox.set(this.position, this.position);
        if (this.upPressed) {
            this.position.y += this.ySpeed;
        }
        if (this.downPressed) {
            this.position.y -= this.ySpeed;
        }
        if (this.rightPressed)  {
            this.position.x += this.xSpeed;
        }
        if (this.leftPressed) {
            this.position.x -= this.xSpeed;
        }
        stayInScreen(this);
        this.hitbox.setFromObject(this);
    }
    cube.checkCollisions = function(objects, scene) {
        objects.forEach(o => {
            if (o.hitbox.intersectsBox(this.hitbox)) scene.gameOver = true;
        });
    }

    return cube;
}
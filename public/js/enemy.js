var createEnemy = function(x, y, z, speedz) {
    var geometry = new THREE.BoxGeometry( 5, 5, 5 );
    var material = new THREE.MeshStandardMaterial( { color: new THREE.Color( 0xff1d00 ) } );
    var enemy = scene.enemyModel.clone()
    enemy.position = THREE.Vector3();
    enemy.position.x = x;
    enemy.position.y = y;
    enemy.position.z = z;
    enemy.zSpeed = speedz;
    enemy.Kpy = ENEMIES_KPY * Math.random();
    enemy.Kpx = ENEMIES_KPX * Math.random();
    enemy.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    enemy.anticipate = ANTICIPATE * Math.random();
    
    enemy.move = function(spaceship) {
        this.position.z += this.zSpeed;
        var OFFSET_Y = 0;
        OFFSET_Y = spaceship.upPressed ? OFFSET_Y + this.anticipate : OFFSET_Y;
        OFFSET_Y = spaceship.downPressed ? OFFSET_Y + (-1 * this.anticipate) : OFFSET_Y;
        var errorY = ((spaceship.position.y + AIM_ENEMY_Y + OFFSET_Y) - (this.position.y)) * this.Kpy;
        var OFFSET_X = 0;
        OFFSET_X = spaceship.rightPressed ? OFFSET_X + this.anticipate : OFFSET_X;
        OFFSET_X = spaceship.leftPressed ? OFFSET_X + (-1 * this.anticipate) : OFFSET_X;
        var errorX = ((spaceship.position.x + OFFSET_X) - (this.position.x)) * this.Kpx;
        var errorX_noOffset = ((spaceship.position.x) - (this.position.x)) * this.Kpx;
        this.position.y += errorY;
        this.position.x += errorX;
        this.hitbox.setFromObject(this);
    }

    return enemy;
}
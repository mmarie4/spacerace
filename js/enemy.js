var createEnemy = function(x, y, z, speed) {
    var geometry = new THREE.BoxGeometry( 5, 5, 5 );
    var material = new THREE.MeshStandardMaterial( { color: new THREE.Color( 0xff1d00 ) } );
    var enemy = new THREE.Mesh( geometry, material );
    enemy.position = THREE.Vector3();
    enemy.position.x = x;
    enemy.position.y = y;
    enemy.position.z = z;
    enemy.zSpeed = speed;
    enemy.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    
    enemy.move = function() {
        this.position.z += this.zSpeed;
        this.hitbox.setFromObject(this);
    }

    return enemy;
}
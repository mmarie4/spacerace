var createEnemy = function(x, y, z, speed) {
    var geometry = new THREE.BoxGeometry( 5, 5, 5 );
    var material = new THREE.MeshStandardMaterial( { color: new THREE.Color( 0xff1d00 ) } );
    var enemy = new THREE.Mesh( geometry, material );
    enemy.position = THREE.Vector3();
    enemy.position.x = x;
    enemy.position.y = y;
    enemy.position.z = z;
    enemy.zSpeed = speed;
    //enemy.xSpeed = speed * (Math.random() - 0.5) * 0.4;
    //enemy.ySpeed = speed * (Math.random() - 0.5) * 0.2; 
    enemy.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    
    enemy.move = function() {
        this.position.z += this.zSpeed;
        //this.position.y += this.ySpeed;
        //this.position.x += this.xSpeed;
        this.hitbox.setFromObject(this);
    }

    return enemy;
}
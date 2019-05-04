var createSpawn = function(scene, x, y, z) {
    var spawn = {
        scene: scene,
        speed: SPAWN_SPEED * Math.random() - 0.5,
        enemies: [],
        position: {
            x: x, 
            y: y,
            z: z
        },
        pop: function() {
            var newEnemy = createEnemy(this.position.x, this.position.y, this.position.z, ENEMIES_SPEED);
            this.enemies.push(newEnemy);
            this.scene.add(newEnemy);
        },
        update: function(scene, camera) {
            // Move
            this.position.x += this.speed;
            this.position.y += this.speed;
            // Remove enemies outside and move others
            this.enemies.forEach(e => e.position.z > camera.position.z ? scene.remove(e) : e.move())
            // Clean enemies array
            this.enemies = this.enemies.filter(e => e.position.z < camera.position.z);
        },
        clear: function(scene) {
            this.enemies.forEach(e => scene.remove(e));
        }
    };
    return spawn;
}
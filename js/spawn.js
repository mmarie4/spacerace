var createSpawn = function(scene, x, y, z) {
    var spawn = {
        scene: scene,
        enemies: [],
        position: {
            x: x, 
            y: y,
            z: z
        },
        pop: function() {
            var newEnemy = createEnemy(this.position.x, this.position.y, this.position.z, 4);
            this.enemies.push(newEnemy);
            this.scene.add(newEnemy);
        },
        update: function(scene, camera) {
            // Remove enemies outside and move others
            this.enemies.forEach(e => e.position.z > camera.position.z ? scene.remove(e) : e.move())
            // Clean enemies array
            this.enemies = this.enemies.filter(e => e.position.z < camera.position.z);
        }
    };
    return spawn;
}
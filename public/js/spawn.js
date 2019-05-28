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
            var newEnemy = createEnemy(this.position.x, this.position.y, this.position.z, ENEMIES_SPEED_Z);
            this.enemies.push(newEnemy);
            this.scene.add(newEnemy);
        },
        update: function(scene, camera) {
            // Move
            this.position.x += this.speed;
            this.position.y += this.speed;
            this.position.z = scene.ship.position.z + SPAWN_Z;
            // Remove enemies outside and move others
            this.enemies.forEach(e => {
                if (e.position.z > BORDER_ENEMIES) {
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
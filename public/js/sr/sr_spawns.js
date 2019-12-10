import sr_constants from "./sr_constants.js";
import sr_enemy from "./sr_enemy.js";

const sr_spawns = {
  create: function(scene, x, y, z) {
    let spawn = {
      scene: scene,
      speed: sr_constants.SPAWN_SPEED * Math.random() - 0.5,
      enemies: [],
      position: {
        x: x,
        y: y,
        z: z
      },
      pop: function() {
        let newEnemy = sr_enemy.create(
          this.position.x,
          this.position.y,
          this.position.z,
          sr_constants.ENEMIES_SPEED_Z,
          scene
        );
        this.enemies.push(newEnemy);
        this.scene.add(newEnemy);
      },
      update: function(scene, camera) {
        // Move
        this.position.x += this.speed;
        this.position.y += this.speed;
        this.position.z = scene.ship.position.z + sr_constants.SPAWN_Z;
        // Remove enemies outside and move others
        this.enemies.forEach(e => {
          if (e.position.z > sr_constants.BORDER_ENEMIES) {
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
};

export default sr_spawns;

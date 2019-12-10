import sr_constants from "./sr_constants.js";

const sr_enemy = {
  create: function(x, y, z, speedz, scene) {
    let geometry = new THREE.BoxGeometry(5, 5, 5);
    let material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xff1d00)
    });
    const enemy = scene.models.enemy.clone();
    enemy.position.set(x, y, z);
    enemy.zSpeed = speedz;
    enemy.Kpy = sr_constants.ENEMIES_KPY * Math.random();
    enemy.Kpx = sr_constants.ENEMIES_KPX * Math.random();
    enemy.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    enemy.anticipate = sr_constants.ANTICIPATE * Math.random();

    enemy.move = function(spaceship) {
      this.position.z += this.zSpeed;
      let OFFSET_Y = 0;
      OFFSET_Y = spaceship.upPressed ? OFFSET_Y + this.anticipate : OFFSET_Y;
      OFFSET_Y = spaceship.downPressed
        ? OFFSET_Y + -1 * this.anticipate
        : OFFSET_Y;
      let errorY =
        (spaceship.position.y +
          sr_constants.AIM_ENEMY_Y +
          OFFSET_Y -
          this.position.y) *
        this.Kpy;
      let OFFSET_X = 0;
      OFFSET_X = spaceship.rightPressed ? OFFSET_X + this.anticipate : OFFSET_X;
      OFFSET_X = spaceship.leftPressed
        ? OFFSET_X + -1 * this.anticipate
        : OFFSET_X;
      let errorX =
        (spaceship.position.x + OFFSET_X - this.position.x) * this.Kpx;
      let errorX_noOffset = (spaceship.position.x - this.position.x) * this.Kpx;
      this.position.y += errorY;
      this.position.x += errorX;
      this.hitbox.setFromObject(this);
    };
    return enemy;
  }
};

export default sr_enemy;

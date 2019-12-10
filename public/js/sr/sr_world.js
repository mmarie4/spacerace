const sr_world = {
  initWorld: function(scene, x, y, z) {
    // floor
    floor = scene.models.floor.clone();
    floor.position.y = y;
    floor.position.z = z;
    floor.rotation.x = Math.PI;
    floor.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    scene.add(floor);
  }
};

export default sr_world;

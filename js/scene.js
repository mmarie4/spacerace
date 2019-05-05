// ================================ Functions ================================ 
var animate = function() {
    requestAnimationFrame( animate );
    if(!scene.gameOver && !scene.pause) {
        // Handle spawns
        for (var i = 0; i < spawns.length; i++) {
            if (Math.abs(spawns[i].position.x - cube.position.x) > SPAWN_LIMIT || Math.abs(spawns[i].position.y - cube.position.y) > SPAWN_LIMIT) {
                console.log("clearing spawn");
                spawns[i].clear(scene);
                spawns.splice(i, 1);
            } else {
                Math.random() < SPAWN_FREQ ? spawns[i].pop() && spawns[i].update(cube, camera) : spawns[i].update(cube, camera);
            }
        }
        // Create new spawns
        Math.random() < NEWSPAWN_FREQ && spawns.length < MAX_NB_SPAWNS ?
            spawns.push(createSpawn(
                    scene,
                    cube.position.x + SPAWN_LIMIT * (Math.random()-0.5),
                    cube.position.y + SPAWN_LIMIT * (Math.random()-0.5),
                    SPAWN_Z)):
        // Handle spaceship
        cube.move();
        camera.update(cube);
        spawns.forEach(spawn => cube.checkCollisions(spawn.enemies, scene));
        // Render
        renderer.render( scene, camera );
    }
}
var onDocumentKeyDown = function(event) {
    var keyCode = event.which;
    if (keyCode == 38) { // up key
        cube.upPressed = true;
    } else if (keyCode == 40) { // down key
        cube.downPressed = true;
    } else if (keyCode == 39) { // right key
        cube.rightPressed = true;
    } else if (keyCode == 37) { // left key
        cube.leftPressed = true;
    }
};
var onDocumentKeyUp = function(event) {
    var keyCode = event.which;
    if (keyCode == 38) { // up key
        cube.upPressed = false;
    } else if (keyCode == 40) { // down key
        cube.downPressed = false;
    } else if (keyCode == 39) { // right key
        cube.rightPressed = false;
    } else if (keyCode == 37) { // left key
        cube.leftPressed = false;
    }
};

// ================================ Script execution ================================ 

// scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xe2edff)
scene.gameOver = false;
scene.pause = false;

// camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 25;
camera.rotation.x = -0.2;
camera.update = function(object) {
    camera.position.x = object.position.x;
    camera.position.y = object.position.y + 5;
}

// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

// spaceship
var cube = createCube(-20, 10, SPACESHIP_SPEEDX, SPACESHIP_SPEEDY);

// spawns
var spawns = [];

scene.add( cube );
document.body.appendChild( renderer.domElement );
document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp);

animate();
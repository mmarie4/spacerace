var scene = new THREE.Scene();
scene.background = new THREE.Color(0xe2edff)

// Set up camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 25;
camera.rotation.x = -0.2;
camera.update = function(object) {
    camera.position.x = object.position.x;
    camera.position.y = object.position.y + 5;
}

// Set up renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

scene.end = function() {
    this.gameOver = true;
}

var cube = createCube(-20, 10, 0.5, 0.5);
var spawns = [];
for (var i = -30 ; i < 30; i += 10) {
    spawns.push(createSpawn(scene, i, 0, -30));
}
scene.add( cube );

function animate() {
    if(!scene.gameOver) {
        requestAnimationFrame( animate );
        spawns.forEach(spawn => Math.random() > 0.01 ? spawn.pop() && spawn.update(cube, camera) : spawn.update(cube, camera));
        cube.move();
        console.log(spawns);
        camera.update(cube);
        spawns.forEach(spawn => cube.checkCollisions(spawn.enemies, scene));
        renderer.render( scene, camera );
    }
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
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

document.addEventListener("keyup", onDocumentKeyUp);
function onDocumentKeyUp(event) {
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

animate();
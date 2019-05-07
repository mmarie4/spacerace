// ================================ Functions ================================ 
var animate = function() {
    requestAnimationFrame( animate );
    if(!scene.gameOver && !scene.pause) {
        // Handle spawns
        for (var i = 0; i < spawns.length; i++) {
            if (Math.abs(spawns[i].position.x - scene.ship.position.x) > SPAWN_LIMIT || Math.abs(spawns[i].position.y - scene.ship.position.y) > SPAWN_LIMIT) {
                spawns[i].clear(scene, orphans);
                spawns.splice(i, 1);
            } else {
                Math.random() < SPAWN_FREQ ? spawns[i].pop() && spawns[i].update(scene.ship, camera) : spawns[i].update(scene.ship, camera);
            }
        }
        // Create new spawns
        Math.random() < NEWSPAWN_FREQ && spawns.length < MAX_NB_SPAWNS ?
            spawns.push(createSpawn(
                    scene,
                    scene.ship.position.x + SPAWN_LIMIT * (Math.random()-0.5),
                    scene.ship.position.y + SPAWN_LIMIT * (Math.random()-0.5),
                    SPAWN_Z)):
        // Move orphan enemies
        orphans.forEach(o => o.position.z > camera.position.z ? scene.remove(o) : o.move())
        // Handle spaceship
        scene.ship.move();
        // Check collisions
        spawns.forEach(spawn => scene.ship.checkCollisions(spawn.enemies, scene));
        // Change time
        document.getElementById("time").innerHTML = Math.abs(new Date() - scene.timestart)/1000 + " s";
    }
    camera.update(scene.ship);
    // Render
    renderer.render( scene, camera );
}

var launchAfterLoad = function() {
    console.log("trying to launch");
    if (scene.ship != undefined) {
        console.log("scene.ship = ", scene.ship);
        animate();
    } else {
        setTimeout(launchAfterLoad, 500);
    }
}

var onDocumentKeyDown = function(event) {
    var keyCode = event.which;
    event.preventDefault();
    if (keyCode == 38) { // up key
        scene.ship.upPressed = true;
    } else if (keyCode == 40) { // down key
        scene.ship.downPressed = true;
    } else if (keyCode == 39) { // right key
        scene.ship.rightPressed = true;
    } else if (keyCode == 37) { // left key
        scene.ship.leftPressed = true;
    }
};
var onDocumentKeyUp = function(event) {
    event.preventDefault();
    var keyCode = event.which;
    if (keyCode == 38) { // up key
        scene.ship.upPressed = false;
    } else if (keyCode == 40) { // down key
        scene.ship.downPressed = false;
    } else if (keyCode == 39) { // right key
        scene.ship.rightPressed = false;
    } else if (keyCode == 37) { // left key
        scene.ship.leftPressed = false;
    }
};

function onDocumentMouseDown( event ) {
    event.preventDefault();
    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();
    mouse.x = ( event.clientX / document.getElementsByTagName("canvas")[0].clientWidth ) * 2 - 1;
    mouse.y = ( event.clientY / document.getElementsByTagName("canvas")[0].clientHeight ) * -2 + 1;
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( [menu] );
    if ( intersects.length > 0 ) {
        intersects[0].object.callback(scene);
    }

}

// ================================ Script execution ================================ 

// scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x00072b);
scene.gameOver = false;
scene.pause = true;

// lights
var light = new THREE.PointLight( 0xfff2c4, 2, 0, 2 );
light.position.set(100, 100, 0);
scene.add( light );
var light = new THREE.PointLight( 0xc4ceff, 1.5, 0, 1 );
light.position.set(-50, -100, 10);
scene.add( light );
var light = new THREE.PointLight( 0xf4e2ff, 1.5, 0, 10 );
light.position.set(2, 10, 40);
scene.add( light );

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
renderer.setSize( window.innerWidth, window.innerHeight - 106);

// spaceship
createShip(scene, -20, 10, SPACESHIP_SPEEDX, SPACESHIP_SPEEDY);

// enemies
var spawns = [];
var orphans = [];

document.body.appendChild( renderer.domElement );
document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp);
document.addEventListener("mousedown", onDocumentMouseDown);

// Display menu
var menuGeometry = new THREE.BoxGeometry(5, 2.5, 1);
var texture = new THREE.TextureLoader().load("res/play.png");
var menuMaterial = new THREE.MeshStandardMaterial( { map: texture });
var menu = new THREE.Mesh(menuGeometry, menuMaterial);
menu.position.x = 0;
menu.position.y = -16.5;
menu.position.z = 18;
menu.rotation.x = -0.15;
menu.rotation.y = 0.05;
menu.callback = function(scene) {
    document.getElementById("pause-icon").setAttribute("style", "display: inline-block")
    scene.pause = false;
    scene.remove(this);
    scene.timestart = new Date();
}
scene.add(menu);

launchAfterLoad();
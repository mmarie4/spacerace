var lastUpdate = new Date();
// ================================ Functions ================================ 
var animate = function() {
    console.log("Math.abs(new Date() - lastUpdate)", Math.abs(new Date() - lastUpdate));
    if (Math.abs(new Date() - lastUpdate) > UPDATE_FREQ) {
        if(!scene.gameOver && !scene.pause) {
            // Handle spawns
            for (var i = 0; i < spawns.length; i++) {
                if (Math.abs(spawns[i].position.x - scene.ship.position.x) > SPAWN_LIMIT || Math.abs(spawns[i].position.y - scene.ship.position.y) > SPAWN_LIMIT) {
                    spawns[i].clear(scene, orphans);
                    spawns.splice(i, 1);
                } else {
                    if (Math.random() < SPAWN_FREQ) {
                        spawns[i].pop() && spawns[i].update(scene.ship, camera);
                    }
                    spawns[i].update(scene.ship, camera);
                }
            }
            // Create new spawns
            if(Math.random() < NEWSPAWN_FREQ && spawns.length < MAX_NB_SPAWNS) {
                spawns.push(createSpawn(
                        scene,
                        scene.ship.position.x + SPAWN_LIMIT * (Math.random()-0.5),
                        scene.ship.position.y + SPAWN_LIMIT * (Math.random()-0.5),
                        SPAWN_Z));
            }
            // Move orphan enemies
            for(var i = 0; i < orphans.length; i++) {
                if (orphans[i].position.z >= camera.position.z) {
                    scene.remove(orphans[i]);
                    orphans.splice(i, 1);
                } else {
                    orphans[i].move();
                }
            }
            // Handle spaceship
            scene.ship.move();
            camera.update(scene.ship);
            // Check collisions
            spawns.forEach(spawn => scene.ship.checkCollisions(spawn.enemies, scene));
            // Change time
            document.getElementById("time").innerHTML = Math.abs(new Date() - scene.timestart)/1000 + " s";
        }
        lastUpdate = new Date();
    } else {
        console.log("skipping loop");
    }
    // Render
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

var launchAfterLoad = function() {
    console.log("trying to launch...");
    if (scene.ship != undefined) {
        scene.add(scene.ship);
        document.getElementById("start-text").setAttribute("style", "display: none");
        document.getElementById("play-text").setAttribute("style", "display: none");
        scene.pause = false;
        scene.timestart = new Date();
        animate();
    } else {
        setTimeout(launchAfterLoad, 500);
    }
}

var restart = function() {
    scene.ship.position = new THREE.Vector3(0, -20, 10);
    document.getElementById("gameover-text").setAttribute("style", "display: none");
    document.getElementById("restart-text").setAttribute("style", "display: none");
    scene.gameOver = false;
    scene.pause = false;
    scene.timestart = new Date();
    scene.add(scene.ship);
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
    } else if (keyCode == 32) { // space bar
        scene.ship.boost();
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

// ================================ Script execution ================================ 

// scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x00072b);
scene.gameOver = false;
scene.pause = true;
scene.end = function() {
    this.gameOver = true;
    spawns.forEach(s => s.clear(scene, orphans));
    orphans.forEach(o => scene.remove(o));
    orphans = [];
    spawns = [];
    createShip(scene, -20, 10, SPACESHIP_SPEEDX, SPACESHIP_SPEEDY);
    scene.remove(scene.ship);
    document.getElementById("gameover-text").setAttribute("style", "visibility: visible");
    document.getElementById("restart-text").setAttribute("style", "display: inline");
}

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

// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight - 106);

// spaceship
createShip(scene, -20, 10, SPACESHIP_SPEEDX, SPACESHIP_SPEEDY);

// camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 25;
camera.rotation.x = -0.2;
camera.update = function(object) {
    camera.position.x = object.position.x;
    camera.position.y = object.position.y + 5;
}

// enemies
var spawns = [];
var orphans = [];

document.body.appendChild( renderer.domElement );
document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp);
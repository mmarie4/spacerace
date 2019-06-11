// ================================ Functions ================================ 
var animate = function() {
    //console.log("Math.abs(new Date() - lastUpdate)", Math.abs(new Date() - lastUpdate));
    if (Math.abs(new Date() - lastUpdate) > UPDATE_FREQ) {
        if(!scene.gameOver && !scene.pause) {
            // Handle spawns
            for (var i = 0; i < spawns.length; i++) {
                if (Math.abs(spawns[i].position.x - scene.ship.position.x) > SPAWN_LIMIT_FAR || Math.abs(spawns[i].position.y - scene.ship.position.y) > SPAWN_LIMIT_FAR) {
                    spawns[i].clear(scene, orphans);
                    console.log("clearing spawn")
                    spawns.splice(i, 1);
                } else {
                    if (Math.random() < SPAWN_FREQ) {
                        spawns[i].pop() && spawns[i].update(scene, camera);
                    }
                    spawns[i].update(scene, camera);
                }
            }
            // Create new spawns
            var rand = Math.random();
            if(rand < NEWSPAWN_FREQ_NEAR && spawns.length < MAX_NB_SPAWNS) {
                if (rand < NEWSPAWN_FREQ_FAR) {
                    spawns.push(createSpawn(
                        scene,
                        scene.ship.position.x + SPAWN_LIMIT_FAR * (Math.random()-0.5),
                        scene.ship.position.y + SPAWN_LIMIT_FAR * (Math.random()-0.5),
                        SPAWN_Z));
                } else {
                    spawns.push(createSpawn(
                        scene,
                        scene.ship.position.x + SPAWN_LIMIT_NEAR * (Math.random()-0.5),
                        scene.ship.position.y + SPAWN_LIMIT_NEAR * (Math.random()-0.5),
                        SPAWN_Z));
                }
            }
            // Move orphan enemies
            for(var i = 0; i < orphans.length; i++) {
                if (orphans[i].position.z >= camera.position.z) {
                    scene.remove(orphans[i]);
                    orphans.splice(i, 1);
                } else {
                    orphans[i].move(scene.ship);
                }
            }
            // Handle spaceship
            scene.ship.move();
            camera.update(scene.ship);
            // Check collisions
            spawns.forEach(spawn => scene.ship.checkCollisions(spawn.enemies, scene));
            // Update info displayed
            scene.ship.checkBoost();
            document.getElementById("time").innerHTML = Math.abs(new Date() - scene.timestart)/1000 + " s";
        } else {
        }
        lastUpdate = new Date();
    } else {
    }
    // Render
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

var launchAfterLoad = function() {
    console.log("trying to launch...");
    if (scene.ship != undefined && scene.enemyModel != undefined) {
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
        event.preventDefault();
        scene.ship.upPressed = false;
    } else if (keyCode == 40) { // down key
        event.preventDefault();
        scene.ship.downPressed = false;
    } else if (keyCode == 39) { // right key
        event.preventDefault();
        scene.ship.rightPressed = false;
    } else if (keyCode == 37) { // left key
        event.preventDefault();
        scene.ship.leftPressed = false;
    }
};


// ================================ Script execution ================================ 
var lastUpdate = new Date();

// scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x00072b);
scene.gameOver = false;
scene.pause = true;
scene.end = function() {
    this.gameOver = true;
    spawns.forEach(s => s.clear(scene, orphans));
    orphans.forEach(o => {
        scene.remove(o);
    });
    orphans = [];
    spawns = [];
    createShip(scene, -20, 10, SPACESHIP_SPEEDX, SPACESHIP_SPEEDY);
    scene.ship.kill(scene);
    document.getElementById("gameover-text").setAttribute("style", "visibility: visible");
    document.getElementById("restart-text").setAttribute("style", "display: inline");
    // send score
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/new-score', true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // do nothing...
        }
    }
    if (document.getElementById("player-text").value.includes('<') || document.getElementById("player-text").value.includes('>')) {
        alert("Don't even think about trying XSS vulerability... ;)");
    } else {
        score = {name: document.getElementById("player-text").value, score: document.getElementById("time").innerHTML};
        xhr.send(JSON.stringify(score));
    }
}
loadEnemyModel(scene);

// lights
var light = new THREE.PointLight( 0xfff2c4, 2, 0, 2 );
light.position.set(1000, 3500, 0);
scene.add( light );
var light2 = new THREE.PointLight( 0xc4ceff, 1.5, 0, 0 );
light2.position.set(-5000, -1000, -900);
scene.add( light2 );
var light3 = new THREE.PointLight( 0xf4e2ff, 2, 0, 0 );
light3.position.set(-10, -10, 0);
scene.add( light3 );


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
    camera.position.z = object.position.z + 15;
}

// enemies
var spawns = [];
var orphans = [];

document.body.appendChild( renderer.domElement );

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    document.getElementById("controls").style.display = "inline-block";
} else {
    document.addEventListener("keydown", onDocumentKeyDown, false);
    document.addEventListener("keyup", onDocumentKeyUp);
}
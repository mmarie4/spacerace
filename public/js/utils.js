// ========================== functions ===========================

// Return the global coordinates of an object 
var localToGlobal = function (object) {
    var widthHalf = window.innerWidth / 2;
    var heightHalf = window.innerHeight / 2;

    var pos = object.position.clone();
    pos.project(camera);
    pos.x = ( pos.x * widthHalf ) + widthHalf;
    pos.y = - ( pos.y * heightHalf ) + heightHalf;

    return pos;
}

// Open source code in new tab/window
var onClickCode = function() {
    window.open("https://github.com/mmarie4/spacerace", '_blank').focus();
}

// Pause
var onClickPause = function() {
    scene.pause = !scene.pause;
    scene.pause ? document.getElementById("pause-img").setAttribute("src", "res/play-icon.png") : document.getElementById("pause-img").setAttribute("src", "res/pause-icon.png"); 
}

// Load gltf for enemies
var loadEnemyModel = function(scene) {
    var loader = new THREE.GLTFLoader();
    loader.load('res/joined-enemy.glb', function(gltf) {
        scene.enemyModel = gltf.scene;
    });
}

// Display/hide leaderboard
var onClickLeaderboard = function() {
    console.log("leaderboardDisplayed", leaderboardDisplayed); 
    if(!leaderboardDisplayed) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", '/leaderboard', true);
        //Send the proper header information along with the request
        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                var leaderboard = JSON.parse(xhr.responseText);
                console.log("leaderboard received:", leaderboard);
                console.log("leaderboard received:", leaderboard.length);
                for (var i = 0; i < leaderboard.length; i++) {
                    document.getElementById('player' + parseInt(i + 1)).innerHTML = leaderboard[i].name;
                    document.getElementById('score' + parseInt(i + 1)).innerHTML = leaderboard[i].score;
                }
                document.getElementById("leaderboard-section").setAttribute("style", "display: inline-block");
                leaderboardDisplayed = true;
            }
        }
        score = {name: document.getElementById("player-text").getAttribute("value"), score: document.getElementById("time").innerHTML};
        xhr.send();
    } else {
        document.getElementById("leaderboard-section").setAttribute("style", "display: none")
        leaderboardDisplayed = false;
    }
}
var onClickCross = function() {
    document.getElementById("leaderboard-section").setAttribute("style", "display: none")
    leaderboardDisplayed = false;
}

// ========================== script execution =============================
var leaderboardDisplayed = false;
// Display player name
var player = "Player" + parseInt(Math.random() * 10000);
document.getElementById("player-text").setAttribute("value", player);
document.getElementById('player-text').addEventListener('keyup',function(e){
    if (e.which == 13 && this.value != "") this.blur();
});
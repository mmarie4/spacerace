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

// Force position to stay in screen
var stayInScreen = function(object) {
    var pos = localToGlobal(object);
    if(pos.x >= innerWidth - 50) {
        object.position.x -= object.xSpeed;
    }
    if(pos.x <= 50) {
        object.position.x += object.xSpeed;
    }
    if(pos.y >= innerHeight - 50) {
        object.position.y += object.ySpeed;
    }
    if(pos.y <= 50) {
        object.position.y -= object.ySpeed;
    }
}

// Open source code in new tab/window
var onClickCode = function() {
    window.open("https://github.com/mmarie4/spacerace", '_blank').focus();
}

// Pause
var onClickPause = function() {
    scene.pause = !scene.pause;
    scene.pause ? document.getElementById("pause-icon").setAttribute("src", "res/play-icon.png") : document.getElementById("pause-icon").setAttribute("src", "res/pause-icon.png"); 
}
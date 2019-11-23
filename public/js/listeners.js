var onDocumentKeyDown = function(event) {
  var keyCode = event.which;
  if (keyCode == 38) {
    // up key
    scene.ship.upPressed = true;
  } else if (keyCode == 40) {
    // down key
    scene.ship.downPressed = true;
  } else if (keyCode == 39) {
    // right key
    scene.ship.rightPressed = true;
  } else if (keyCode == 37) {
    // left key
    scene.ship.leftPressed = true;
  } else if (keyCode == 32) {
    // space bar
    scene.ship.boost();
  }
};
var onDocumentKeyUp = function(event) {
  event.preventDefault();
  var keyCode = event.which;
  if (keyCode == 38) {
    // up key
    event.preventDefault();
    scene.ship.upPressed = false;
  } else if (keyCode == 40) {
    // down key
    event.preventDefault();
    scene.ship.downPressed = false;
  } else if (keyCode == 39) {
    // right key
    event.preventDefault();
    scene.ship.rightPressed = false;
  } else if (keyCode == 37) {
    // left key
    event.preventDefault();
    scene.ship.leftPressed = false;
  }
};

const sr_listeners = {
  onDocumentKeyDown: function(event, that) {
    const keyCode = event.which;
    if (keyCode == 38) {
      // up key
      that.scene.ship.upPressed = true;
    } else if (keyCode == 40) {
      // down key
      that.scene.ship.downPressed = true;
    } else if (keyCode == 39) {
      // right key
      that.scene.ship.rightPressed = true;
    } else if (keyCode == 37) {
      // left key
      that.scene.ship.leftPressed = true;
    } else if (keyCode == 32) {
      // space bar
      that.scene.ship.boost();
    }
  },
  onDocumentKeyUp: function(event, that) {
    event.preventDefault();
    const keyCode = event.which;
    if (keyCode == 38) {
      // up key
      event.preventDefault();
      that.scene.ship.upPressed = false;
    } else if (keyCode == 40) {
      // down key
      event.preventDefault();
      that.scene.ship.downPressed = false;
    } else if (keyCode == 39) {
      // right key
      event.preventDefault();
      that.scene.ship.rightPressed = false;
    } else if (keyCode == 37) {
      // left key
      event.preventDefault();
      that.scene.ship.leftPressed = false;
    }
  }
};

export default sr_listeners;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

function keyDownHandler(event) {
  switch (event.keyCode) {
    case 39:
      rightPressed = true;
      break;
    case 37:
      leftPressed = true;
      break;
    case 40:
      downPressed = true;
      break;
    case 38:
      upPressed = true;
      break;
  }
}

function keyUpHandler() {
  switch (event.keyCode) {
    case 39:
      rightPressed = false;
      break;
    case 37:
      leftPressed = false;
      break;
    case 40:
      downPressed = false;
      break;
    case 38:
      upPressed = false;
      break;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

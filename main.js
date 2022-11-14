const canvasDiv = document.getElementById('canvas-div');
const canvas = document.createElement('canvas');
canvasDiv.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.setUp = function() {
  this.lineWidth = 1;
  window.addEventListener('keydown', event => {
    switch (event.code) {
      case 'KeyW': case 'ArrowUp': snake.moveUp(); break;
      case 'KeyS': case 'ArrowDown': snake.moveDown(); break;
      case 'KeyA': case 'ArrowLeft': snake.moveLeft(); break;
      case 'KeyD': case 'ArrowRight': snake.moveRight(); break;
    }
  });
}
ctx.blankCanvas = function(color = window.getComputedStyle(document.body, null).getPropertyValue('background-color')) {
  this.fillStyle = color;
  this.fillRect(0, 0, canvas.width, canvas.height);
}

let grid = new Grid({ side: 15, color: 'hsl(0deg 0% 30% / 50%)', ctx: ctx });
let canvasSize = 1200;
grid.setCanvasDims(canvasSize, canvasSize / 1.5);

let apple = new Apple(ctx, grid);
let snake = new Snake(ctx, grid, apple);

let prevTimestamp = 0, frameStep = 50;
function animate(timestamp = 50) {
  if (snake.isAlive) {
    if (timestamp - prevTimestamp >= frameStep) {
      ctx.blankCanvas();
      grid.draw();

      apple.draw();

      snake.draw();
      snake.move();
      snake.allowMove = 1;

      prevTimestamp = timestamp;
    }
    window.requestAnimationFrame(animate);
  } else {
    gameOverDiv.appendChild(gameOverMsg);
    gameOverDiv.appendChild(restarButton);
  }
}

let gameOverDiv = document.getElementById('game-over');
let gameOverMsg = document.createElement('h1');
gameOverMsg.textContent = 'Game Over';
let restarButton = document.createElement('button');
restarButton.classList.add('restart-button');
restarButton.onclick = () => {
  gameOverDiv.replaceChildren();
  apple.generateRandom();
  play();
}

function play() {
  ctx.setUp();
  snake = snake.reset();
  animate();
}

play()

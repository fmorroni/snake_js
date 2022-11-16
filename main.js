const canvasDiv = document.createElement('div');
canvasDiv.id = 'canvas-div';
const canvas = document.createElement('canvas');
canvasDiv.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.setUp = function() {
  this.lineWidth = 1;
  window.addEventListener('keydown', keySetup);
}
function keySetup(key) {
  switch (key.code) {
    case 'KeyW': case 'ArrowUp': snake.moveUp(); break;
    case 'KeyS': case 'ArrowDown': snake.moveDown(); break;
    case 'KeyA': case 'ArrowLeft': snake.moveLeft(); break;
    case 'KeyD': case 'ArrowRight': snake.moveRight(); break;
    case 'KeyP': pause(); break;
  }
}
ctx.blankCanvas = function(color = window.getComputedStyle(document.body, null).getPropertyValue('background-color')) {
  this.fillStyle = color;
  this.fillRect(0, 0, canvas.width, canvas.height);
}

let grid = new Grid({ side: 15, color: 'hsl(0deg 0% 30% / 50%)', ctx: ctx });
let canvasSize = 1200;
grid.setCanvasDims(canvasSize, canvasSize / 1.5);

let apple = new Apple(ctx, grid);
let snake = new Snake(ctx, grid, apple, 'green');
// let snake2 = new Snake(ctx, grid, apple, 'blue');

let ts, prevTimestamp = 0, frameStep = 50, paused = false;
function animate(timestamp = frameStep) {
  ts = timestamp;
  if (snake.isAlive && !paused) {
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
  } else if (!snake.isAlive) {
    gameOver();
  }
}

const gameOverDiv = document.createElement('div');
gameOverDiv.id = 'game-over';
let gameOverMsg = document.createElement('h1');
gameOverMsg.textContent = 'Game Over';
let restarButton = document.createElement('button');
restarButton.classList.add('restart-button');
restarButton.onclick = () => {
  gameOverDiv.remove();
  apple.generateRandom();
  play();
}
gameOverDiv.appendChild(gameOverMsg);
gameOverDiv.appendChild(restarButton);

function gameOver() {
  document.body.appendChild(gameOverDiv);
  startSignal = false;
}

const pauseDiv = document.createElement('div');
pauseDiv.id = 'pause';
let pauseMsg = document.createElement('h1');
pauseMsg.textContent = 'Paused';
let unpauseButton = document.createElement('button');
unpauseButton.classList.add('unpause-button');
unpauseButton.onclick = () => {
  pauseDiv.remove();
  paused = false;
  animate();
}
pauseDiv.appendChild(pauseMsg);
pauseDiv.appendChild(unpauseButton);

function pause() {
  if (snake.isAlive) {
    paused = true;
    document.body.appendChild(pauseDiv);
  }
}


let startSignal = false;
function start(key) {
  switch (key.code) {
    case 'KeyW': case 'ArrowUp':
    case 'KeyS': case 'ArrowDown':
    case 'KeyA': case 'ArrowLeft':
    case 'KeyD': case 'ArrowRight':
      startSignal = true;
      play();
  }
}

function drawInitial() {
  ctx.blankCanvas();
  grid.draw();
  apple.draw();
  snake.draw();
}
function prepGame() {
  document.body.appendChild(canvasDiv);
  drawInitial();
  ctx.setUp();
  window.addEventListener('keydown', start);
}

function play() {
  if (!snake.isAlive) {
    snake = snake.reset();
  }
  if (!startSignal) {
    window.addEventListener('keydown', start);
    drawInitial();
  } else {
    window.removeEventListener('keydown', start);
    animate();
  }
}

prepGame();

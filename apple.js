class Apple {
  constructor(ctx, grid) {
    this.position = {x: null, y: null};
    this.color = 'red';
    this.ctx = ctx;
    this.grid = grid;
    this.generateRandom();
  }

  generateRandom() {
    this.position = {
      x: randInt(0, this.grid.size.cols - 1),
      y: randInt(0, this.grid.size.rows - 1),
    }
  }

  draw() {
    this.grid.fillSquare(this.position, this.color);
  }
}

function randInt(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min)
}

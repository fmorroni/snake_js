class Snake {
  static Directions = Object.freeze({
    Up: Symbol("Up"),
    Down: Symbol("Down"),
    Left: Symbol("Left"),
    Right: Symbol("Right")
  })

  constructor(ctx, grid, apple) {
    this.body = [{ x: parseInt(grid.size.cols/2), y: parseInt(grid.size.rows/2) }];
    this.speed = { x: 1, y: 0 };
    this.color = 'green';
    this.movDir = Snake.Directions.Right;
    this.allowMove = 1;

    this.ctx = ctx;
    this.grid = grid;
    this.apple = apple;
  }

  moveUp() {
    if (this.allowMove && Math.abs(this.speed.y) != 1) {
      this.speed = { x: 0, y: -1 };
      this.movDir = Snake.Directions.Up;
      this.allowMove = 0;
    }
  }
  moveDown() {
    if (this.allowMove && Math.abs(this.speed.y) != 1) {
      this.speed = { x: 0, y: 1 };
      this.movDir = Snake.Directions.Down;
      this.allowMove = 0;
    }
  }
  moveLeft() {
    if (this.allowMove && Math.abs(this.speed.x) != 1) {
      this.speed = { x: -1, y: 0 };
      this.movDir = Snake.Directions.Left;
      this.allowMove = 0;
    }
  }
  moveRight() {
    if (this.allowMove && Math.abs(this.speed.x) != 1) {
      this.speed = { x: 1, y: 0 };
      this.movDir = Snake.Directions.Right;
      this.allowMove = 0;
    }
  }

  move() {
    if (this.body.length == 1) {
      this.body[0].x += this.speed.x;
      this.body[0].y += this.speed.y;
    } else {
      this.body.pop();
      this.body.unshift({
        x: this.body[0].x + this.speed.x,
        y: this.body[0].y + this.speed.y
      });
    }

    if (this.body[0].x == this.apple.position.x && this.body[0].y == this.apple.position.y) {
      this.apple.generateRandom();
      this.extend();
    }
  }

  extend() {
    this.body.unshift({
      x: this.body[0].x + this.speed.x,
      y: this.body[0].y + this.speed.y
    });
  }

  drawHead() {
    this.ctx.save();

    this.grid.fillSquare(this.body[0], this.color);

    this.ctx.fillStyle = 'black';

    const eyeSize = 2;
    const eyeMargin = 0.2;

    // Upper Left Corner.
    let ulc = [
      this.grid.side * (this.body[0].x + eyeMargin) + this.ctx.lineWidth,
      this.grid.side * (this.body[0].y + eyeMargin) + this.ctx.lineWidth,
    ];
    // Upper Right Corner.
    let urc = [
      this.grid.side * (this.body[0].x + 1 - eyeMargin) - this.ctx.lineWidth,
      this.grid.side * (this.body[0].y + eyeMargin) + this.ctx.lineWidth,
    ];
    // Bottom Left Corner.
    let blc = [
      this.grid.side * (this.body[0].x + eyeMargin) + this.ctx.lineWidth,
      this.grid.side * (this.body[0].y + 1 - eyeMargin) - this.ctx.lineWidth,
    ];
    // Bottom Right Corner.
    let brc = [
      this.grid.side * (this.body[0].x + 1 - eyeMargin) - this.ctx.lineWidth,
      this.grid.side * (this.body[0].y + 1 - eyeMargin) - this.ctx.lineWidth,
    ];

    switch (this.movDir) {
      case Snake.Directions.Up:
        this.ctx.fillRect(...ulc, eyeSize, eyeSize);
        this.ctx.fillRect(...urc, eyeSize, eyeSize);
        // console.log('Moving up', ulc, urc);
        break;
      case Snake.Directions.Down:
        this.ctx.fillRect(...blc, eyeSize, eyeSize);
        this.ctx.fillRect(...brc, eyeSize, eyeSize);
        // console.log('Moving down', blc, brc);
        break;
      case Snake.Directions.Left:
        this.ctx.fillRect(...ulc, eyeSize, eyeSize);
        this.ctx.fillRect(...blc, eyeSize, eyeSize);
        // console.log('Moving left', ulc, blc);
        break;
      case Snake.Directions.Right:
        this.ctx.fillRect(...urc, eyeSize, eyeSize);
        this.ctx.fillRect(...brc, eyeSize, eyeSize);
        // console.log('Moving right', urc, brc);
        break;
    }

    this.ctx.restore();
  }

  draw() {
    this.drawHead();
    for (let i = 1; i < this.body.length; ++i) {
      this.grid.fillSquare(this.body[i], this.color);
    }
  }

  get isAlive() {
    let inRangeX = 0 <= this.body[0].x && this.body[0].x <= this.grid.size.cols - 1;
    let inRangeY = 0 <= this.body[0].y && this.body[0].y <= this.grid.size.rows - 1;

    let selfCollision = false;
    for (let i = 1; i < this.body.length && !selfCollision; ++i) {
      selfCollision = (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y);
    }

    return inRangeX && inRangeY && !selfCollision;
  }

  reset() {
    return new Snake(this.ctx, this.grid, this.apple);
  }
}
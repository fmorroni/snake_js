class Snake {
  static Directions = Object.freeze({
    Up: Symbol("Up"),
    Down: Symbol("Down"),
    Left: Symbol("Left"),
    Right: Symbol("Right")
  })

  constructor(ctx, grid, apple, color) {
    this.body = [{
      x: randInt(parseInt(grid.size.cols / 4), parseInt(grid.size.cols / 1.5)),
      y: randInt(parseInt(grid.size.rows / 4), parseInt(grid.size.rows / 1.5)),
    }];
    this.speed = { x: 0, y: 0 };
    this.color = color;
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
    if (collision(this.body[0], this.apple.position)) {
      this.apple.generateRandom();
      this.extend();
    } else {
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
    }
  }

  extend() {
    this.body.unshift({
      x: this.body[0].x + this.speed.x,
      y: this.body[0].y + this.speed.y
    });
  }
  // For testing.
  extendX(x) {
    for (let i = 0; i < x; ++i) {
      this.body.push({ x: -1, y: -1 })
    }
  }

  drawSegmentLine({ segmentIndex, horizontal = false, vertical = false } = {}) {
    this.ctx.save();
    this.ctx.strokeStyle = this.color * 1.5;
    if (horizontal) {
      // Middle Left
      let ml = [
        this.grid.side * this.body[segmentIndex].x + this.ctx.lineWidth,
        this.grid.side * (this.body[segmentIndex].y + 0.5) + this.ctx.lineWidth / 2,
      ];
      // Middle Right
      let mr = [ml[0] + this.grid.side, ml[1]];
      this.ctx.moveTo(...ml);
      this.ctx.lineTo(...mr);
    } else if (vertical) {
      // Middle Up
      let mu = [
        this.grid.side * (this.body[segmentIndex].x + 0.5) + this.ctx.lineWidth / 2,
        this.grid.side * this.body[segmentIndex].y + this.ctx.lineWidth,
      ];
      // Middle Down
      let md = [mu[0], mu[1] + this.grid.side];
      this.ctx.moveTo(...mu);
      this.ctx.lineTo(...md);
    }
    this.ctx.stroke();
    this.ctx.restore();
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
        break;
      case Snake.Directions.Down:
        this.ctx.fillRect(...blc, eyeSize, eyeSize);
        this.ctx.fillRect(...brc, eyeSize, eyeSize);
        break;
      case Snake.Directions.Left:
        this.ctx.fillRect(...ulc, eyeSize, eyeSize);
        this.ctx.fillRect(...blc, eyeSize, eyeSize);
        break;
      case Snake.Directions.Right:
        this.ctx.fillRect(...urc, eyeSize, eyeSize);
        this.ctx.fillRect(...brc, eyeSize, eyeSize);
        break;
    }

    this.ctx.restore();
  }

  draw() {
    this.drawHead();
    for (let i = 1; i < this.body.length; ++i) {
      this.grid.fillSquare(this.body[i], this.color);
      if (this.body[i].x === this.body[i-1].x) {
        this.drawSegmentLine({segmentIndex: i, vertical: true});
      } else if (this.body[i].y === this.body[i-1].y) {
        this.drawSegmentLine({segmentIndex: i, horizontal: true});
      }
    }
  }

  get isAlive() {
    let inRangeX = 0 <= this.body[0].x && this.body[0].x <= this.grid.size.cols - 1;
    let inRangeY = 0 <= this.body[0].y && this.body[0].y <= this.grid.size.rows - 1;

    let selfCollision = false;
    for (let i = 1; i < this.body.length && !selfCollision; ++i) {
      selfCollision = collision(this.body[0], this.body[i]);
    }

    return inRangeX && inRangeY && !selfCollision;
  }

  reset() {
    return new Snake(this.ctx, this.grid, this.apple, this.color);
  }
}

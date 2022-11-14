class Grid {
  constructor({ side = NaN, color = '', ctx = null } = {}) {
    this.side = side;
    this.color = color;
    this.ctx = ctx;
    this.size;
  }

  setCanvasDims(width, height) {
    this.ctx.canvas.width = parseInt(width / this.side) * this.side + this.ctx.lineWidth;
    this.ctx.canvas.height = parseInt(height / this.side) * this.side + this.ctx.lineWidth;
    this.size = {
      cols: parseInt(width / this.side),
      rows: parseInt(height / this.side),
    }
  }

  draw() {
    this.ctx.strokeStyle = this.color;

    this.ctx.beginPath();
    // Starts at .5 for line crispness.
    for (let vLine = this.ctx.lineWidth / 2; vLine <= this.ctx.canvas.width; vLine += this.side) {
      this.ctx.moveTo(vLine, 0);
      this.ctx.lineTo(vLine, canvas.height);
    }
    this.ctx.stroke();

    this.ctx.beginPath();
    for (let hLine = this.ctx.lineWidth / 2; hLine <= this.ctx.canvas.height; hLine += this.side) {
      this.ctx.moveTo(0, hLine);
      this.ctx.lineTo(canvas.width, hLine);
    }
    this.ctx.stroke();
  }

  fillSquare({ x: col, y: row }, color) {
    this.ctx.save();

    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.side * col + this.ctx.lineWidth, this.side * row + this.ctx.lineWidth, this.side - this.ctx.lineWidth, this.side - this.ctx.lineWidth);

    this.ctx.restore();
  }
}

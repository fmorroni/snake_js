function randInt(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min)
}

function collision(pointA, pointB) {
  return pointA.x === pointB.x && pointA.y === pointB.y;
}

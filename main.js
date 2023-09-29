import { arraysEqual } from "../utils.js";

gameSize = [15, 12];
snakeTiles = [];
snakeVector = [1, 0];
started = false;
points = 0;
applePosition;
speedFactor = 20; //doubles the speed  for each 20 points
initialSpeed = 500; // cycle for each 500ms
snakeTileMargin = 0;
gameInterval;

const startGame = () => {
  clearInterval(gameInterval);
  started = true;
  snakeTiles = Array(3)
    .fill([0, Math.floor(gameSize[1] / 2)])
    .map((pos) => [Math.floor(gameSize[0] / 2), pos[1]]);
  snakeVector = [1, 0];
  points = 0;
  createApple();
  gameInterval = setInterval(() => update(), initialSpeed);
};
const onDeath = () => {
  clearInterval(gameInterval);
  snakeTiles = [];
  snakeVector = [1, 0];
  points = 0;
  started = false;
};
const createApple = () => {
  let newPos = getRandomPosition();
  while (snakeTiles.find((tile) => arraysEqual(newPos, tile))) {
    newPos = getRandomPosition();
  }
  applePosition = newPos;
};
const onAppleEaten = () => {
  points++;
  createApple();
  clearInterval(gameInterval);
  let newSpeed = initialSpeed / (1 + 1 * ((points + 1) / speedFactor));
  gameInterval = setInterval(() => update(), newSpeed);
};
const update = () => {
  let lastTile = snakeTiles[snakeTiles.length - 1];
  let newTile = lastTile.map((d, i) => d + snakeVector[i]);
  snakeTiles.push(newTile);
  if (arraysEqual(newTile, applePosition)) {
    onAppleEaten();
  } else {
    snakeTiles.shift();
  }
  if (detectColition()) onDeath();
  draw();
};
const draw = () => {
  let tileSize = getTileSize();

  //TODO: work on drawing
  return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!started) {
    ctx.textAlign = "center";
    ctx.fillText("Press enter to start", canvas.width / 2, canvas.height / 2);
    return;
  }

  snakeTiles.forEach((tile) => {
    ctx.fillRect(
      tileSize[0] * tile[0] + snakeTileMargin / 2,
      tileSize[1] * tile[1] - snakeTileMargin / 2,
      tileSize[0] - snakeTileMargin + 1,
      tileSize[1] - snakeTileMargin + 1
    );
  });

  let appleRadius = tileSize[1] / 5;
  ctx.beginPath();
  ctx.arc(
    tileSize[0] * applePosition[0] + tileSize[0] / 2,
    tileSize[1] * applePosition[1] + tileSize[1] / 2 - appleRadius / 2,
    appleRadius,
    0,
    2 * Math.PI
  );
  ctx.fill();

  ctx.textAlign = "left";
  ctx.fillText(`Score: ${points}`, 4, canvas.height / 15);
};

const onKeyPress = (key) => {
  switch (key) {
    case "ArrowUp":
      if (arraysEqual(snakeVector, [0, 1])) return;
      snakeVector = [0, -1];
      break;
    case "ArrowDown":
      if (arraysEqual(snakeVector, [0, -1])) return;
      snakeVector = [0, 1];
      break;
    case "ArrowLeft":
      if (arraysEqual(snakeVector, [1, 0])) return;
      snakeVector = [-1, 0];
      break;
    case "ArrowRight":
      if (arraysEqual(snakeVector, [-1, 0])) return;
      snakeVector = [1, 0];
      break;
    case "Enter":
      startGame();
      break;
    default:
      break;
  }
};

// utils

const getRandomPosition = () => {
  return gameSize.map((dim) => Math.floor(Math.random() * dim));
};
const getTileSize = () => {
  return [canvas.width / gameSize[0], canvas.height / gameSize[1]];
};
const detectColition = () => {
  let hasCollided = false;
  const head = snakeTiles[snakeTiles.length - 1];
  snakeTiles.forEach((tile, index) => {
    if (index !== snakeTiles.length - 1 && arraysEqual(tile, head))
      hasCollided = true;
  });
  if (
    head[0] >= gameSize[0] ||
    head[1] >= gameSize[1] ||
    head[0] < 0 ||
    head[1] < 0
  ) {
    hasCollided = true;
  }
  return hasCollided;
};

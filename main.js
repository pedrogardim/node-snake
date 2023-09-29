import readline from "readline";
import { arraysEqual } from "./utils.js";

readline.emitKeypressEvents(process.stdin);

process.stdin.on("keypress", (ch, key) => {
  onKeyPress(key.name);
  if (key && key.ctrl && key.name == "c") {
    process.stdin.pause();
  }
});

process.stdin.setRawMode(true);

let gameSize = [15, 12];
let snakeTiles = [];
let snakeVector = [1, 0];
let started = false;
let points = 0;
let applePosition;
let speedFactor = 20; //doubles the speed  for each 20 points
let initialSpeed = 500; // cycle for each 500ms
let snakeTileMargin = 0;
let gameInterval;

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
  console.clear();
  if (!started) {
    console.log("Press enter to start");
    return;
  }

  for (let x = 0; x < gameSize[1] + 2; x++) {
    let line = "";
    for (let y = 0; y < gameSize[0]; y++) {
      line += snakeTiles.find((a) => a[0] === y && a[1] === x)
        ? "█"
        : applePosition[0] === y && applePosition[1] === x
        ? "O"
        : " ";
    }
    console.log(line);
  }

  return;
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${points}`, 4, canvas.height / 15);
};

const onKeyPress = (key) => {
  switch (key) {
    case "up":
      if (arraysEqual(snakeVector, [0, 1])) return;
      snakeVector = [0, -1];
      break;
    case "down":
      if (arraysEqual(snakeVector, [0, -1])) return;
      snakeVector = [0, 1];
      break;
    case "left":
      if (arraysEqual(snakeVector, [1, 0])) return;
      snakeVector = [-1, 0];
      break;
    case "right":
      if (arraysEqual(snakeVector, [-1, 0])) return;
      snakeVector = [1, 0];
      break;
    case "return":
      startGame();
      break;
    default:
      break;
  }
  draw();
};

// utils

const getRandomPosition = () => {
  return gameSize.map((dim) => Math.floor(Math.random() * dim));
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

draw();

import { draw } from "../utils/display.js";
import { detectColition, arraysEqual } from "../utils/helpers.js";
import { createApple, onAppleEaten } from "./board.js";
import { onDeath } from "./snake.js";

const gameState = {
  gameSize: [15, 12],
  snakeTiles: [],
  snakeVector: [1, 0],
  started: false,
  points: 0,
  applePosition: [],
  speedFactor: 20,
  initialSpeed: 500,
};

export let gameInterval;

export const updateInterval = (newInterval) => {
  gameInterval = newInterval;
};

export const startRound = () => {
  let { gameSize, initialSpeed } = gameState;
  clearInterval(gameInterval);
  gameState.started = true;
  gameState.snakeTiles = Array(3)
    .fill([0, Math.floor(gameSize[1] / 2)])
    .map((pos) => [Math.floor(gameSize[0] / 2), pos[1]]);
  gameState.snakeVector = [1, 0];
  gameState.points = 0;
  createApple();
  gameInterval = setInterval(() => update(), initialSpeed);
};

export const update = () => {
  let { snakeTiles, snakeVector, applePosition } = gameState;
  let lastTile = snakeTiles[snakeTiles.length - 1];
  let newTile = lastTile.map((d, i) => d + snakeVector[i]);
  gameState.snakeTiles.push(newTile);
  if (arraysEqual(newTile, applePosition)) {
    onAppleEaten();
  } else {
    gameState.snakeTiles.shift();
  }
  if (detectColition()) onDeath();
  draw();
};

export default gameState;

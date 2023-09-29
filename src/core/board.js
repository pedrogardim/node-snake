import { getRandomPosition, arraysEqual } from "../utils/helpers.js";
import gameState, { gameInterval, update, updateInterval } from "./game.js";

export const createApple = () => {
  let { snakeTiles } = gameState;
  let newPos = getRandomPosition();
  while (snakeTiles.find((tile) => arraysEqual(newPos, tile))) {
    newPos = getRandomPosition();
  }
  gameState.applePosition = newPos;
};

export const onAppleEaten = () => {
  let { initialSpeed, speedFactor, points } = gameState;
  gameState.points++;
  createApple();
  clearInterval(gameInterval);
  let newSpeed = initialSpeed / (1 + 1 * ((points + 1) / speedFactor));
  updateInterval(setInterval(() => update(), newSpeed));
};

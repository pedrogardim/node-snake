import gameState, { gameInterval } from "./game.js";

export const onDeath = () => {
  clearInterval(gameInterval);
  gameState.snakeTiles = [];
  gameState.snakeVector = [1, 0];
  gameState.points = 0;
  gameState.started = false;
};

import gameState from "../core/game.js";

export const arraysEqual = (a, b) => {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
};

export const getRandomPosition = () =>
  gameState.gameSize.map((dim) => Math.floor(Math.random() * dim));

export const detectColition = () => {
  let { snakeTiles, gameSize } = gameState;
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

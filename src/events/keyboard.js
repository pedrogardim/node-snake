import readline from "readline";
import { arraysEqual } from "../utils/helpers.js";
import gameState, { startRound } from "../core/game.js";
import { draw } from "../utils/display.js";

readline.emitKeypressEvents(process.stdin);

process.stdin.on("keypress", (ch, key) => {
  onKeyPress(key.name);
  if (key && key.ctrl && key.name == "c") {
    console.clear();
    process.stdin.pause();
  }
});

process.stdin.setRawMode(true);

const onKeyPress = (key) => {
  let { snakeVector } = gameState;
  switch (key) {
    case "up":
      if (arraysEqual(snakeVector, [0, 1])) return;
      gameState.snakeVector = [0, -1];
      break;
    case "down":
      if (arraysEqual(snakeVector, [0, -1])) return;
      gameState.snakeVector = [0, 1];
      break;
    case "left":
      if (arraysEqual(snakeVector, [1, 0])) return;
      gameState.snakeVector = [-1, 0];
      break;
    case "right":
      if (arraysEqual(snakeVector, [-1, 0])) return;
      gameState.snakeVector = [1, 0];
      break;
    case "return":
      startRound();
      break;
    default:
      break;
  }
  draw();
};

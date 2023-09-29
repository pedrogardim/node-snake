import gameState from "../core/game.js";

export const draw = () => {
  let { started, gameSize, applePosition, snakeTiles } = gameState;
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

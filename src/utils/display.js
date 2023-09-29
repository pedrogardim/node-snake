import gameState from "../core/game.js";

export const draw = () => {
  let { started, gameSize, applePosition, snakeTiles, points } = gameState;
  console.clear();
  if (!started) {
    console.log("Press enter to start");
    return;
  }

  console.log(`Score: ${points}`);
  console.log("⌑" + Array(gameSize[0]).fill("⎯").join("") + "⌑");
  for (let x = 0; x < gameSize[1]; x++) {
    let line = "|";
    for (let y = 0; y < gameSize[0]; y++) {
      line += snakeTiles.find((a) => a[0] === y && a[1] === x)
        ? "█"
        : applePosition[0] === y && applePosition[1] === x
        ? "⚛︎"
        : " ";
    }
    line += "|";
    console.log(line);
  }
  console.log("⌑" + Array(gameSize[0]).fill("⎯").join("") + "⌑");
};

import { sounds } from "../sounds.js";
import { arraysEqual } from "../utils.js";

export class SnakeGameController {
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
  canvas;
  ctx;

  constructor() {
    this.init();
  }
  init() {
    this.initCanvas();
    this.draw();
  }
  startGame() {
    clearInterval(this.gameInterval);
    this.started = true;
    this.snakeTiles = Array(3)
      .fill([0, Math.floor(this.gameSize[1] / 2)])
      .map((pos) => [Math.floor(this.gameSize[0] / 2), pos[1]]);
    this.snakeVector = [1, 0];
    this.points = 0;
    this.createApple();
    this.gameInterval = setInterval(() => this.update(), this.initialSpeed);
    sounds.player("start").start();
    sounds.player("music").start();
  }
  onDeath() {
    clearInterval(this.gameInterval);
    this.snakeTiles = [];
    this.snakeVector = [1, 0];
    this.points = 0;
    this.started = false;
    sounds.player("music").stop();
    sounds.player("death").start();
  }
  createApple() {
    let newPos = this.getRandomPosition();
    while (this.snakeTiles.find((tile) => arraysEqual(newPos, tile))) {
      newPos = this.getRandomPosition();
    }
    this.applePosition = newPos;
  }
  onAppleEaten() {
    this.points++;
    this.createApple();
    clearInterval(this.gameInterval);
    let newSpeed =
      this.initialSpeed / (1 + 1 * ((this.points + 1) / this.speedFactor));
    this.gameInterval = setInterval(() => this.update(), newSpeed);
    sounds.player("coin").start();
  }
  update() {
    let lastTile = this.snakeTiles[this.snakeTiles.length - 1];
    let newTile = lastTile.map((d, i) => d + this.snakeVector[i]);
    this.snakeTiles.push(newTile);
    if (arraysEqual(newTile, this.applePosition)) {
      this.onAppleEaten();
    } else {
      this.snakeTiles.shift();
    }
    if (this.detectColition()) this.onDeath();
    this.draw();
  }
  initCanvas() {
    this.canvas = document.getElementById("game");
    this.canvas.width = 500;
    this.canvas.height = this.canvas.width * 0.8;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "#350";
    this.ctx.font = `${this.canvas.height / 15}px Silkscreen`;
  }
  draw() {
    let tileSize = this.getTileSize();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!this.started) {
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "Press enter to start",
        this.canvas.width / 2,
        this.canvas.height / 2
      );
      return;
    }

    this.snakeTiles.forEach((tile) => {
      this.ctx.fillRect(
        tileSize[0] * tile[0] + this.snakeTileMargin / 2,
        tileSize[1] * tile[1] - this.snakeTileMargin / 2,
        tileSize[0] - this.snakeTileMargin + 1,
        tileSize[1] - this.snakeTileMargin + 1
      );
    });

    let appleRadius = tileSize[1] / 5;
    this.ctx.beginPath();
    this.ctx.arc(
      tileSize[0] * this.applePosition[0] + tileSize[0] / 2,
      tileSize[1] * this.applePosition[1] + tileSize[1] / 2 - appleRadius / 2,
      appleRadius,
      0,
      2 * Math.PI
    );
    this.ctx.fill();

    this.ctx.textAlign = "left";
    this.ctx.fillText(`Score: ${this.points}`, 4, this.canvas.height / 15);
  }
  onKeyPress(key) {
    switch (key) {
      case "ArrowUp":
        if (arraysEqual(this.snakeVector, [0, 1])) return;
        this.snakeVector = [0, -1];
        break;
      case "ArrowDown":
        if (arraysEqual(this.snakeVector, [0, -1])) return;
        this.snakeVector = [0, 1];
        break;
      case "ArrowLeft":
        if (arraysEqual(this.snakeVector, [1, 0])) return;
        this.snakeVector = [-1, 0];
        break;
      case "ArrowRight":
        if (arraysEqual(this.snakeVector, [-1, 0])) return;
        this.snakeVector = [1, 0];
        break;
      case "Enter":
        this.startGame();
        break;
      default:
        break;
    }
  }
  // utils
  getRandomPosition() {
    return this.gameSize.map((dim) => Math.floor(Math.random() * dim));
  }
  getTileSize() {
    return [
      this.canvas.width / this.gameSize[0],
      this.canvas.height / this.gameSize[1],
    ];
  }
  detectColition() {
    let hasCollided = false;
    const head = this.snakeTiles[this.snakeTiles.length - 1];
    this.snakeTiles.forEach((tile, index) => {
      if (index !== this.snakeTiles.length - 1 && arraysEqual(tile, head))
        hasCollided = true;
    });
    if (
      head[0] >= this.gameSize[0] ||
      head[1] >= this.gameSize[1] ||
      head[0] < 0 ||
      head[1] < 0
    ) {
      hasCollided = true;
    }
    return hasCollided;
  }
}

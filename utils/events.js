import readline from "readline";

import { onKeyPress } from "../main.js";

readline.emitKeypressEvents(process.stdin);

process.stdin.on("keypress", (ch, key) => {
  onKeyPress(key.name);
  if (key && key.ctrl && key.name == "c") {
    console.clear();
    process.stdin.pause();
  }
});

process.stdin.setRawMode(true);

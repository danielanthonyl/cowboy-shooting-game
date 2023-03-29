import "../css/index.css";
import { loadAssets } from "./loadAssets";

const appDiv: HTMLElement = document.getElementById("app")!;
const canvas = document.createElement("canvas")!;
const context = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const character = new Image();
const background = new Image();
const jumpIMG = new Image();

jumpIMG.src = "../spritesheets/jump.png";
character.src = "../spritesheets/idle.png";
background.src = "../spritesheets/background.jpeg";

loadAssets([character, background], context);

const characterWidth = character.width / 3;
const characterHeight = character.height / 4;

// const sx = 0;
// const sy = 0;
// const sw = characterWidth;
// const sh = characterHeight;
// const dx = 0;
// const dy = 380;
// const dw = characterWidth / 2;
// const dh = characterHeight / 2;

let currentWidthCycle = 0;
let currentHeightCycle = 0;
let frameCount = 0;
let loopID: number;

const loop = () => {
  frameCount++;
  if (frameCount < 6) {
    loopID = requestAnimationFrame(loop);
    return;
  }
  frameCount = 0;

  context.clearRect(0, 380, character.width / 8, character.height / 10);

  context.drawImage(
    background,
    0,
    0,
    background.width,
    background.height,
    0,
    0,
    background.width,
    canvas.height
  );

  context.drawImage(
    character,
    currentWidthCycle === 0
      ? currentWidthCycle
      : characterWidth * currentWidthCycle,
    currentHeightCycle === 0
      ? currentHeightCycle
      : characterHeight * currentHeightCycle,
    character.width / 3,
    character.height / 4,
    0,
    380,
    character.width / 8,
    character.height / 10
  );

  currentWidthCycle++;
  if (currentHeightCycle === 3) {
    currentHeightCycle = 0;
    currentWidthCycle = 0;
  }

  if (currentWidthCycle > 2) {
    currentWidthCycle = 0;
    currentHeightCycle++;
  }

  loopID = requestAnimationFrame(loop);
};

// loop();

let jumpWidthCycle = 0;
let jumpHeightCycle = 0;
let jumpFrameCount = 0;
let jumpHeight = 380;
let jumpID: number;

const jump = () => {
  cancelAnimationFrame(loopID);

  jumpFrameCount++;
  if (jumpFrameCount < 6) {
    jumpID = requestAnimationFrame(jump);
    return;
  }
  jumpFrameCount = 0;

  context.clearRect(0, 380, character.width / 8, character.height / 10);

  context.drawImage(
    background,
    0,
    0,
    background.width,
    background.height,
    0,
    0,
    background.width,
    canvas.height
  );

  context.drawImage(
    jumpIMG,
    jumpWidthCycle === 0 ? jumpWidthCycle : characterWidth * jumpWidthCycle,
    jumpHeightCycle === 0 ? jumpHeightCycle : characterHeight * jumpHeightCycle,
    character.width / 3,
    character.height / 4,
    0,
    jumpHeight,
    character.width / 8,
    character.height / 10
  );

  jumpWidthCycle++;
  if (jumpHeightCycle === 3) {
    jumpHeight = 380;
    jumpHeightCycle = 0;
    jumpWidthCycle = 0;

    currentWidthCycle = 0;
    currentHeightCycle = 0;
    frameCount = 0;

    loopID = requestAnimationFrame(loop);
    return;
  }

  if (jumpWidthCycle > 2) {
    jumpWidthCycle = 0;
    jumpHeightCycle++;
  }

  if (jumpHeightCycle < 2) {
    jumpHeight -= 16;
  } else {
    jumpHeight += 16;
  }

  jumpID = requestAnimationFrame(jump);
};

onkeydown = ({ code }) => {
  switch (code) {
    case "Space":
      cancelAnimationFrame(jumpID);
      jump();

      break;

    default:
      break;
  }
};

appDiv.append(canvas);

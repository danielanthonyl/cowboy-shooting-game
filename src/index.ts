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
const forwardIMG = new Image();

forwardIMG.src = "../spritesheets/forward.png";
jumpIMG.src = "../spritesheets/jump.png";
character.src = "../spritesheets/idle.png";
background.src = "../spritesheets/background.jpeg";

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

let forwardMovement = 0;
let isMovingForward = false;
let isMovingBackward = false;
let movingDirection = "forward";

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
    forwardMovement,
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

loadAssets([character, background], context).then(() => loop());

let jumpWidthCycle = 0;
let jumpHeightCycle = 0;
let jumpFrameCount = 0;
let jumpHeight = 0;
let jumpID: number;

const jump = () => {
  cancelAnimationFrame(loopID);

  jumpFrameCount++;
  if (jumpFrameCount < 3) {
    jumpID = requestAnimationFrame(jump);
    return;
  }
  jumpFrameCount = 0;

  context.clearRect(0, 380, character.width / 8, character.height / 10);

  if (isMovingForward) {
    forwardMovement += 20;
  }

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
    forwardMovement,
    380 + jumpHeight,
    character.width / 8,
    character.height / 10
  );

  jumpWidthCycle++;
  if (jumpHeightCycle === 3) {
    jumpHeight = 0;
    jumpHeightCycle = 0;
    jumpWidthCycle = 0;

    currentWidthCycle = 0;
    currentHeightCycle = 0;
    frameCount = 0;

    if (isMovingForward) {
      forwardID = requestAnimationFrame(moveForward);
    } else {
      loopID = requestAnimationFrame(loop);
    }
    jumping = false;
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

let forwardWidthCycle = 0;
let forwardHeightCycle = 0;
let forwardFrameCount = 0;
let forwardID: number;

const moveForward = () => {
  cancelAnimationFrame(loopID);

  forwardFrameCount++;
  if (forwardFrameCount < 4) {
    forwardID = requestAnimationFrame(moveForward);
    return;
  }
  forwardFrameCount = 0;

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
    forwardIMG,
    forwardWidthCycle === 0
      ? forwardWidthCycle
      : characterWidth * forwardWidthCycle,
    forwardHeightCycle === 0
      ? forwardHeightCycle
      : characterHeight * forwardHeightCycle,
    character.width / 3,
    character.height / 4,
    forwardMovement,
    380,
    character.width / 8,
    character.height / 10
  );

  forwardWidthCycle++;
  forwardMovement += 20;

  if (forwardHeightCycle === 1 && forwardWidthCycle > 3) {
    // forwardMovement = 380;
    forwardHeightCycle = 0;
    forwardWidthCycle = 0;

    // loopID = requestAnimationFrame(loop);
    // return;
  }

  if (forwardWidthCycle > 3) {
    forwardWidthCycle = 0;
    forwardHeightCycle++;
  }

  // if (forwardHeightCycle < 2) {
  //   forwardMovement -= 16;
  // } else {
  //   forwardMovement += 16;
  // }

  forwardID = requestAnimationFrame(moveForward);
};

/**
 * BACKWARD STUFF
 */

let backwardFrame = 0;
let backwardID: number;
let backwardWidthCycle = 0;
let backwardHeightCycle = 0;

const moveBackward = () => {
  cancelAnimationFrame(loopID);

  backwardFrame++;
  if (backwardFrame < 4) {
    backwardID = requestAnimationFrame(moveBackward);
    return;
  }

  backwardFrame = 0;

  context.clearRect(0, 380, characterWidth / 8, characterHeight / 10);

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

  context.save();

  context.scale(-1, 1);

  context.drawImage(
    forwardIMG,
    backwardWidthCycle === 0
      ? backwardWidthCycle
      : backwardWidthCycle * (forwardIMG.width / 4),
    backwardHeightCycle === 0
      ? backwardHeightCycle
      : backwardHeightCycle * (forwardIMG.height / 2),
    forwardIMG.width / 4,
    forwardIMG.height / 2,
    -forwardMovement,
    380,
    -character.width / 8,
    character.height / 10
  );

  context.restore();

  backwardWidthCycle++;
  forwardMovement -= 20;

  if (backwardHeightCycle === 1 && backwardWidthCycle > 3) {
    backwardHeightCycle = 0;
    backwardWidthCycle = 0;
  }

  if (backwardWidthCycle > 3) {
    backwardHeightCycle++;
    backwardWidthCycle = 0;
  }

  backwardID = requestAnimationFrame(moveBackward);
};

let idleBackWidthCycle = 0;
let idleBackHeightCycle = 0;
let idleBackFrameCount = 0;
let idleBackID: number;

const idleBackward = () => {
  idleBackFrameCount++;
  if (idleBackFrameCount < 6) {
    idleBackID = requestAnimationFrame(idleBackward);
    return;
  }
  idleBackFrameCount = 0;

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

  context.save();

  context.scale(-1, 1);

  context.drawImage(
    character,
    idleBackWidthCycle === 0
      ? idleBackWidthCycle
      : characterWidth * idleBackWidthCycle,
    idleBackHeightCycle === 0
      ? idleBackHeightCycle
      : characterHeight * idleBackHeightCycle,
    character.width / 3,
    character.height / 4,
    -forwardMovement,
    380,
    -character.width / 8,
    character.height / 10
  );

  context.restore();

  idleBackWidthCycle++;
  if (idleBackHeightCycle === 3) {
    idleBackHeightCycle = 0;
    idleBackWidthCycle = 0;
  }

  if (idleBackWidthCycle > 2) {
    idleBackWidthCycle = 0;
    idleBackHeightCycle++;
  }

  idleBackID = requestAnimationFrame(idleBackward);
};

let jumpBackWidthCycle = 0;
let jumpBackHeightCycle = 0;
let jumpBackFrameCount = 0;
let jumpBackID: number;

const jumpBack = () => {
  cancelAnimationFrame(idleBackID);
  jumpBackFrameCount++;
  if (jumpBackFrameCount < 3) {
    jumpBackID = requestAnimationFrame(jumpBack);
    return;
  }
  jumpBackFrameCount = 0;

  context.clearRect(0, 380, character.width / 8, character.height / 10);

  if (isMovingBackward) {
    forwardMovement -= 20;
  }

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

  context.save();

  context.scale(-1, 1);

  context.drawImage(
    jumpIMG,
    jumpBackWidthCycle === 0
      ? jumpBackWidthCycle
      : characterWidth * jumpBackWidthCycle,
    jumpBackHeightCycle === 0
      ? jumpBackHeightCycle
      : characterHeight * jumpBackHeightCycle,
    character.width / 3,
    character.height / 4,
    -forwardMovement,
    380 + jumpHeight,
    -character.width / 8,
    character.height / 10
  );

  context.restore();

  jumpBackWidthCycle++;
  if (jumpBackHeightCycle === 3) {
    jumpHeight = 0;
    jumpBackHeightCycle = 0;
    jumpBackWidthCycle = 0;

    currentWidthCycle = 0;
    currentHeightCycle = 0;
    frameCount = 0;

    if (isMovingBackward) {
      backwardID = requestAnimationFrame(moveBackward);
    } else {
      idleBackID = requestAnimationFrame(idleBackward);
    }

    jumping = false;
    return;
  }

  if (jumpBackWidthCycle > 2) {
    jumpBackWidthCycle = 0;
    jumpBackHeightCycle++;
  }

  if (jumpBackHeightCycle < 2) {
    jumpHeight -= 16;
  } else {
    jumpHeight += 16;
  }

  jumpBackID = requestAnimationFrame(jumpBack);
};

let jumping = false;

onkeydown = ({ code }) => {
  switch (code) {
    case "Space":
      jumping = true;

      if (movingDirection === "backward") {
        cancelAnimationFrame(jumpBackID);
        cancelAnimationFrame(backwardID);
        cancelAnimationFrame(loopID);
        cancelAnimationFrame(idleBackID);

        jumpBack();
      } else {
        cancelAnimationFrame(jumpID);
        cancelAnimationFrame(forwardID);
        cancelAnimationFrame(loopID);
        cancelAnimationFrame(idleBackID);

        jump();
      }

      break;

    case "KeyD":
      if (!isMovingBackward) {
        isMovingForward = true;

        if (jumping) return;

        if (!jumpHeight) {
          movingDirection = "forward";
          cancelAnimationFrame(forwardID);
          // cancelAnimationFrame(backwardID);
          cancelAnimationFrame(idleBackID);
          cancelAnimationFrame(loopID);
          moveForward();
        }
      }

      break;

    case "KeyA":
      if (!isMovingForward) {
        isMovingBackward = true;
        if (jumping) return;

        if (!jumpHeight) {
          movingDirection = "backward";
          cancelAnimationFrame(forwardID);
          cancelAnimationFrame(backwardID);
          cancelAnimationFrame(idleBackID);
          cancelAnimationFrame(loopID);

          moveBackward();
        }
      }

      break;

    default:
      break;
  }
};

onkeyup = ({ code }) => {
  switch (code) {
    case "KeyD":
      if (!isMovingBackward) {
        isMovingForward = false;

        if (!jumpHeight) {
          cancelAnimationFrame(forwardID);
          cancelAnimationFrame(idleBackID);
          loop();
        }
      }

      break;

    case "KeyA":
      if (!isMovingForward) {
        isMovingBackward = false;

        if (!jumpHeight) {
          cancelAnimationFrame(backwardID);
          cancelAnimationFrame(loopID);

          idleBackward();
        }
      }

      break;

    default:
      break;
  }
};

appDiv.append(canvas);

let globalAudioBuffer;
let globalAudioContext;
let globalAudioHTMLElement;
let globalAudioIsPlaying = false;
let globalCanvas;
let globalCanvasCtx;
let globalLevelData;
let globalEnemyPositionList;
let globalEnemyTimer = 0;
let globalEnemyTimerPausedState = 0;
let globalEnemySpawnedList = [];
let globalEnemySpawnInterval;
let globalRenderX;
let globalPreviousRenderX;

let globalLastTimestamp = 0;

let globalGravity = .8;
let globalPlatformY;

class PlayerObj {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.jumpHeight = 15;
    this.canJumpSingle = false;
    this.canJumpDouble = false;
    this.lastJumpTime = 0;
    this.jumpCooldown = 400;
    this.isGrounded = true;
    this.score = 0;
    this.lives = 3;
    this.isInvincible = false;
    this.position = {
      x: 0,
      y: 0
    }
    this.velocity = {
      y: 0
    }
  }

  draw() {
    if (this.isInvincible) {
      globalCanvasCtx.shadowBlur = 15;
      globalCanvasCtx.shadowColor = "red";
    }
    globalCanvasCtx.fillStyle = "blue";
    globalCanvasCtx.fillRect(this.position.x, this.position.y, this.width, this.height);
    globalCanvasCtx.shadowBlur = 0;
  }

  checkJump(deltaTimeMultiplier) {
    if (this.isGrounded) {
      this.canJumpSingle = true;
      this.canJumpDouble = true;
    }
    if (p1InputController.jump.pressed) {

      if (this.canJumpSingle) {
        this.canJumpSingle = false;
        this.velocity.y = -this.jumpHeight;
        const activateDoubleJump = () => {
          this.canJumpDouble = true;
        }
        setTimeout(activateDoubleJump, 200 * deltaTimeMultiplier);
      }

      const activateDoubleJump = () => {
        this.canJumpDouble = true;
      }
      setTimeout(activateDoubleJump, 200 * deltaTimeMultiplier);

      if (this.canJumpDouble && !this.isGrounded) {
        // console.log("Activated dobule jump")
        this.canJumpDouble = false;
        this.velocity.y = -this.jumpHeight;
      }
    }
  }

  checkJumpOld(deltaTimeMultiplier) {
    if (this.isGrounded) {
      this.canJumpSingle = true;
      this.canJumpDouble = true;
    }
    if (p1InputController.jump.pressed) {

      if (this.canJumpSingle) {
        this.canJumpSingle = false;
        this.velocity.y = -this.jumpHeight;
        const activateDoubleJump = () => {
          this.canJumpDouble = true;
        }
        setTimeout(activateDoubleJump, 200 * deltaTimeMultiplier);
      }

      if (this.canJumpDouble && !this.isGrounded) {
        console.log("Activated dobule jump")
        this.canJumpDouble = false;
        this.velocity.y = -this.jumpHeight;
      }
    }
  }

  enforceGravity(deltaTimeMultiplier) {
    // const gravityForce = globalGravity * deltaTimeMultiplier;
    // this.velocity.y += gravityForce;
    // this.position.y += this.velocity.y * deltaTimeMultiplier;

    this.position.y = this.position.y + this.velocity.y * deltaTimeMultiplier;
    this.velocity.y = this.velocity.y + globalGravity * deltaTimeMultiplier;

    if (this.position.y + this.height >= globalPlatformY) {
      this.position.y = globalPlatformY - this.height;
      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }
  }

  addScore(addedInt) {
    this.score += addedInt;
  }

  takeDamage(attackDamage) {
    if (!this.isInvincible) {
      this.lives -= attackDamage;
      this.isInvincible = true;
      const removeTempInvincibility = () => {
        this.isInvincible = false;
      }
      setTimeout(removeTempInvincibility, 3000);
    }
  }

  requestUpdate(deltaTimeMultiplier) {
    // if (this.height + this.position.y < globalPlatformY) {
    //   this.isGrounded = false;
    // } else {
    //   this.isGrounded = true;
    // }
    this.checkJump(deltaTimeMultiplier);
    this.enforceGravity(deltaTimeMultiplier);
    this.draw();
    // if (this.canJumpDouble) console.log("Can jump double")
  }
}


class InputController {
  constructor() {
    this.jump = {
      pressed: false
    }
    this.pause = {
      pressed: false
    }
    window.addEventListener('keydown', () => {
      switch (event.key) {
        case 'w':
          this.jump.pressed = true;
          break;
        case ' ':
          this.jump.pressed = true;
          break;
        case 'ArrowUp':
          this.jump.pressed = true;
          break;
      }
    })
    window.addEventListener('keyup', () => {
      switch (event.key) {
        case 'w':
          this.jump.pressed = false;
          break;
        case ' ':
          this.jump.pressed = false;
          break;
        case 'ArrowUp':
          this.jump.pressed = false;
          break;
      }
    })
  }
}


class EnemyObj {
  constructor(spawnX, spawnY) {
    this.width = 50;
    this.height = 50;
    this.moveSpeed = 0;
    this.isAlive = true;
    this.toBeScored = false;
    this.hasBeenScored = false;
    this.readyForDeletion = false;
    // this.isGrounded = true;
    this.position = {
      x: spawnX,
      y: spawnY
    }
  }
  draw() {
    globalCanvasCtx.fillStyle = "red";
    globalCanvasCtx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  updateMoveSpeed(deltaTimeMultiplier) {
    const prevLevelX = (globalPreviousRenderX / globalLevelData.length) * globalLevelData[globalLevelData.length - 1].x;
    const currentLevelX = (globalRenderX / globalLevelData.length) * globalLevelData[globalLevelData.length - 1].x;
    this.moveSpeed = (currentLevelX - prevLevelX);
  }

  requestUpdate(deltaTimeMultiplier) {
    this.updateMoveSpeed(deltaTimeMultiplier);
    this.position.x -= this.moveSpeed * deltaTimeMultiplier;
    if (this.position.x < 0 - this.width) {
      // if (!this.scored) {
      //   player1.addScore(1);
      //   this.scored = true;
      // }

      // this.toBeScored = true;
      // if (this.toBeScored) {

      //   this.toBeScored = false;
      // }

      player1.addScore(1);


      this.readyForDeletion = true;
    }


    // const scoreEnemy = () => {
    //   if (this.toBeScored) {
    //     player1.addScore(1);
    //     this.toBeScored = false;
    //   }
    // }
    // setTimeout(scoreEnemy, 500);




    if (this.isAlive) {
      this.draw();
    }
  }
}


window.onload = () => {
  globalCanvas = document.getElementById("visualizer");
  globalCanvasCtx = globalCanvas.getContext("2d");
  document.getElementById("audioFile").addEventListener("change", handleAudioUpload);
};


// this function saves uploaded file as local blob storage
function handleAudioUpload(event) {
  let blob = window.URL || window.webkitURL;
  const file = event.target.files[0], fileUrl = blob.createObjectURL(file);
  document.getElementById("audioSource").src = fileUrl;
  const fileReader = new FileReader();
  fileReader.onload = function () {
    const bufferedAudioArray = this.result;
    // do something with buffered audio array here
    initializeAudioTrack(bufferedAudioArray);
  };
  fileReader.readAsArrayBuffer(file);
}


// this function attaches audio context to the uploaded track
function initializeAudioTrack(bufferedAudioArray) {
  globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  globalAudioHTMLElement = document.getElementById("audioSource");
  const track = globalAudioContext.createMediaElementSource(globalAudioHTMLElement);
  track.connect(globalAudioContext.destination);
  globalAudioContext.decodeAudioData(bufferedAudioArray, (buffer) => {
    globalAudioBuffer = buffer;
    // proceed to next steps after audio has been decoded here
    initializeAudioControls();
    createLevelData();
    startCanvas();
  })
}


// this function activates audio controls on the page
function initializeAudioControls() {
  const playButton = document.getElementById("playButton");
  playButton.addEventListener("click", () => {
    if (globalAudioContext.state === "suspended") {
      globalAudioContext.resume();
      globalAudioIsPlaying = true;
    }
    if (playButton.dataset.playing === "false") {
      globalAudioHTMLElement.play();
      globalAudioIsPlaying = true;
      playButton.dataset.playing = "true";
    } else if (playButton.dataset.playing === "true") {
      globalAudioHTMLElement.pause();
      globalAudioIsPlaying = false;
      playButton.dataset.playing = "false";
    }
  },
    false,
  );
}


// this function will create the level/terrain based on the inputted audio data.
function createLevelData() {
  const audioData = globalAudioBuffer.getChannelData(0);
  const samplesCount = audioData.length;
  // const levelWidth = 5000;
  const levelWidth = globalAudioBuffer.duration * 1000;
  const levelHeight = globalCanvas.height;
  // may need to change width and height later for playability. Will need to test.

  // clear array, set platform height
  globalPlatformY = (globalCanvas.height / 3) * 2
  globalLevelData = [];
  globalEnemyPositionList = [];

  // spread the data (samples count) out across the defined play area -- ALWAYS USE MATH.FLOOR
  for (let i = 0; i < samplesCount; i += Math.floor(samplesCount / levelWidth)) {
    const sample = Math.abs(audioData[i]);
    const posX = (i / samplesCount) * levelWidth;
    const posY = Math.floor(sample * levelHeight) / 2;
    if (posY > 200) {
      // 50 is currently arbitrary representation of final enemy height.
      globalEnemyPositionList.push({ x: posX, y: globalPlatformY - 50 });
    }

    //x: i / samplesCount controls the overall x width that the data takes up
    globalLevelData.push({ x: posX, y: levelHeight - posY });
  }
}

// this function calls canvas rendering loop. Can include other pregame variable adjustments in here as needed.
function startCanvas() {
  globalRenderX = 0;
  globalCanvasCtx.fillStyle = "black";
  globalCanvasCtx.fillRect(0, 0, globalCanvas.width, globalCanvas.height);
  player1.position.x = globalCanvas.width / 2 - 50;
  globalEnemySpawnInterval = setInterval(() => {
    globalEnemyTimer++;
  }, 1000);
  requestAnimationFrame(gameLoop);

}

const targetFPS = 60;
const frame_interval = 1000 / targetFPS;
let deltaTimeMultiplier = 1;
let deltaTime = 0;

let previousTime = performance.now();

// this function is the game animation loop
function gameLoop(timestamp) {
  checkEnemySpawn();
  if (globalAudioIsPlaying) {
    deltaTime = timestamp - previousTime;
    deltaTimeMultiplier = deltaTime / frame_interval;


    globalCanvasCtx.clearRect(0, 0, globalCanvas.width, globalCanvas.height);
    drawLevel(deltaTimeMultiplier);
    player1.requestUpdate(deltaTimeMultiplier);
    updateSpawnedEnemies(deltaTimeMultiplier);
    drawPlatform();
    handleLose();
    drawHUD();
    updateRenderX();
    previousTime = timestamp;
  }
  requestAnimationFrame(gameLoop);
}


function drawLevel(deltaTimeMultiplier) {
  globalCanvasCtx.clearRect(0, 0, globalCanvas.width, globalCanvas.height);
  globalCanvasCtx.beginPath();

  const colorIndex = Math.floor((globalRenderX / globalLevelData.length) * 255);
  const color = `rgb(${colorIndex}, ${(255 - colorIndex)}, ${(128 + colorIndex)})`;
  globalCanvasCtx.strokeStyle = color;

  globalCanvasCtx.moveTo(globalLevelData[0].x - globalRenderX, globalLevelData[0].y);
  for (let i = 1; i < globalLevelData.length; i++) {
    globalCanvasCtx.lineTo((globalLevelData[i].x - globalRenderX) * deltaTimeMultiplier, globalLevelData[i].y);
  }
  globalCanvasCtx.stroke();
}


// this function increases the globalRenderX variable in time with the current playback.
function updateRenderX() {
  if (globalRenderX < globalLevelData.length) {
    // visual Offset milliseconds may need to be adjusted if sprite ever moves. 
    const visualOffsetInMs = 700;
    const progressPercentage = globalAudioHTMLElement.currentTime / globalAudioBuffer.duration;
    const audioTimeVis = progressPercentage * globalLevelData[globalLevelData.length - 1].x;
    const offsetAudioTime = audioTimeVis - visualOffsetInMs;
    globalPreviousRenderX = globalRenderX;
    // using Math.max to ensure that the value does not reverse in the event of it being negative
    globalRenderX = Math.max(offsetAudioTime, 0);
  }
}

function checkCollision(object1, object2) {
  return (
    object1.position.x + object1.width >= object2.position.x &&
    object1.position.y + object1.height >= object2.position.y &&
    object2.position.x + object2.height >= object1.position.x &&
    object2.position.y + object2.height >= object1.position.y
  );
}


function handleLose() {
  if (player1.lives <= 0) {
    globalAudioHTMLElement.pause();
    globalAudioIsPlaying = false;
    playButton.dataset.playing = "false";
    globalCanvasCtx.fillStyle = "white";
  globalCanvasCtx.font = "40px Arial";
  globalCanvasCtx.textAlign = "center";
  globalCanvasCtx.fillText("You Lose", globalCanvas.width / 2, globalCanvas.height / 2);
  }
}


function checkEnemySpawn() {
  if (!globalAudioIsPlaying) {
    globalEnemyTimer = globalEnemyTimerPausedState;
    return;
  }
  globalEnemyTimerPausedState = globalEnemyTimer;

  if (globalEnemyTimer === 3) {
    globalEnemyTimer = 0;
    globalEnemyPositionList.forEach(kvp => {
      if (kvp.x >= globalRenderX && kvp.x <= globalRenderX + globalCanvas.width) {
        let newEnemy = new EnemyObj(globalCanvas.width, globalPlatformY - 50);
        globalEnemySpawnedList.push(newEnemy);
      }
    });
  }
}

function updateSpawnedEnemies(deltaTimeMultiplier) {
  globalEnemySpawnedList = globalEnemySpawnedList.filter(enemy => !enemy.readyForDeletion);
  globalEnemySpawnedList.forEach(enemy => {
    enemy.requestUpdate(deltaTimeMultiplier);
    if (checkCollision(player1, enemy)) {
      player1.takeDamage(1);
      enemy.isAlive = false;
      enemy.readyForDeletion = true;
    }
  });
}


function drawHUD() {
  globalCanvasCtx.fillStyle = "white";
  globalCanvasCtx.font = "20px Arial";
  globalCanvasCtx.fillText(
    `Lives: ${player1.lives} 
    Score: ${player1.score}`
    , 10, 30);
}


// this function draws the platform.
function drawPlatform() {
  globalCanvasCtx.fillStyle = "green";
  globalCanvasCtx.fillRect(0, globalPlatformY, globalCanvas.width, 10);
}


const player1 = new PlayerObj();
const p1InputController = new InputController();
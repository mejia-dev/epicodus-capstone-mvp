// onload, 
// get globalCanvaset it to 2d
// get the audio upload spot and set the event handler to change

let globalAudioBuffer;
let globalAudioContext;
let globalAudioHTMLElement;
let globalCanvas;
let globalCanvasCtx;
let globalLevelData;
let globalRenderX;

let globalGravity = .5;
let globalPlatformY;

class PlayerObj {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.jumpHeight = 10;
    this.canJumpSingle = false;
    this.canJumpDouble = false;
    this.isGrounded = true;
    this.position = {
      y: 0
    }
    this.velocity = {
      y: 0
    }
  }

  draw() {
    globalCanvasCtx.fillStyle = "blue";
    globalCanvasCtx.fillRect(globalCanvas.width / 2 - 25, this.position.y, this.width, this.height);

    if (this.isGrounded) {
      this.canJumpSingle = true;
      this.canJumpDouble = false;
    }

    if (p1InputController.jump.pressed) {
      if (this.canJumpSingle) {
        this.canJumpSingle = false;
        this.velocity.y = -this.jumpHeight;
        const activateDoubleJump = () => {
          this.canJumpDouble = true;
        }
        setTimeout(activateDoubleJump, 400);
      }

      if (this.canJumpDouble) {
        this.canJumpDouble = false;
        this.velocity.y = -this.jumpHeight;
      }
    }

  }

  enforceGravity() {
    this.position.y += this.velocity.y;
    if (this.height + this.position.y < globalPlatformY) {
      this.velocity.y += globalGravity;
    } else {
      this.velocity.y = 0;
    }
  }

  requestUpdate() {
    if (this.height + this.position.y < globalPlatformY) {
      this.isGrounded = false;
    } else {
      this.isGrounded = true;
    }
    this.enforceGravity();
    this.draw();
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
    }
    if (playButton.dataset.playing === "false") {
      globalAudioHTMLElement.play();
      playButton.dataset.playing = "true";
    } else if (playButton.dataset.playing === "true") {
      globalAudioHTMLElement.pause();
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

  // erase array if it already exists
  globalLevelData = [];

  // spread the data (samples count) out across the defined play area -- ALWAYS USE MATH.FLOOR
  for (let i = 0; i < samplesCount; i += Math.floor(samplesCount / levelWidth)) {
    const sample = Math.abs(audioData[i]);
    const posX = (i / samplesCount) * levelWidth;
    const posY = Math.floor(sample * levelHeight);
    
    //x: i / samplesCount controls the overall x width that the data takes up
    globalLevelData.push({ x: posX, y: levelHeight - posY });
  }
}


// this function calls canvas rendering loop. Can include other pregame variable adjustments in here as needed.
function startCanvas() {
  globalRenderX = 0;
  requestAnimationFrame(gameLoop);
}


// this function is the game animation loop
function gameLoop() {
  globalCanvasCtx.clearRect(0, 0, globalCanvas.width, globalCanvas.height);
  drawLevel();
  // drawPlayer();
  player1.requestUpdate();
  drawPlatform();
  updateRenderX();
  requestAnimationFrame(gameLoop);
}


function drawLevel() {
  globalCanvasCtx.clearRect(0, 0, globalCanvas.width, globalCanvas.height);
  globalCanvasCtx.beginPath();
  globalCanvasCtx.moveTo(globalLevelData[0].x - globalRenderX, globalLevelData[0].y);
  for (let i = 1; i < globalLevelData.length; i++) {
    globalCanvasCtx.lineTo(globalLevelData[i].x - globalRenderX, globalLevelData[i].y);
  }
  globalCanvasCtx.stroke();
}


// this function increases the globalRenderX variable in time with the current playback.
function updateRenderX() {
  if (globalRenderX < globalLevelData.length) {
    const progressPercentage = globalAudioHTMLElement.currentTime / globalAudioBuffer.duration;
    // globalRenderX = progressPercentage * 5000;
    globalRenderX = progressPercentage * globalLevelData[globalLevelData.length - 1].x; // change based on level width

  }
}


// this function draws the platform.
function drawPlatform() {
  globalPlatformY = (globalCanvas.height / 3) * 2
  globalCanvasCtx.fillStyle = "green";
  globalCanvasCtx.fillRect(0, globalPlatformY, globalCanvas.width, 10);
}


const player1 = new PlayerObj();
const p1InputController = new InputController();

window.addEventListener('keydown', () => {
  switch (event.key) {
    case 'w':
      p1InputController.jump.pressed = true;
      break;
    case ' ':
      p1InputController.jump.pressed = true;
      break;
    case 'ArrowUp':
      p1InputController.jump.pressed = true;
      break;
  }
})

window.addEventListener('keyup', () => {
  switch (event.key) {
    case 'w':
      p1InputController.jump.pressed = false;
      break;
    case ' ':
      p1InputController.jump.pressed = false;
      break;
    case 'ArrowUp':
      p1InputController.jump.pressed = false;
      break;
  }
})
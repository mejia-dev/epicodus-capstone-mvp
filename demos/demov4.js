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
  const levelWidth = 5000;
  const levelHeight = globalCanvas.height;
  // may need to change width and height later for playability. Will need to test.

  // erase array if it already exists
  globalLevelData = [];

  // spread the data (samples count) out across the defined play area -- ALWAYS USE MATH.FLOOR
  for (let i = 0; i < samplesCount; i += Math.floor(samplesCount / levelWidth)) {
    const sample = Math.abs(audioData[i]);
    const posY = Math.floor(sample * levelHeight);
    //x: i / samplesCount controls the overall x width that the data takes up
    globalLevelData.push({ x: i / samplesCount * levelWidth, y: levelHeight - posY });
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
  drawProgress();
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

// this function draws the level statically. HISTORIC, DO NOT USE
function drawLevelOld() {
  globalCanvasCtx.beginPath();
  globalCanvasCtx.moveTo(globalLevelData[0].x, globalLevelData[0].y);
  for (let i = 1; i < globalLevelData.length; i++) {
    globalCanvasCtx.lineTo(globalLevelData[i].x, globalLevelData[i].y);
  }
  globalCanvasCtx.stroke();
}


// this function increases the globalRenderX variable in time with the current playback.
function updateRenderX() {
  if (globalRenderX < globalLevelData.length) {
    console.log(globalRenderX + " / " + globalAudioBuffer.duration);
    // globalRenderX = globalAudioHTMLElement.currentTime * (globalAudioBuffer.duration / 5000);
    const progressPercentage = globalAudioHTMLElement.currentTime / globalAudioBuffer.duration;
    globalRenderX = progressPercentage * 5000;
  }
}


// this function draws the blue square at the current position of the audio. HISTORIC, DO NOT USE
function drawProgressOld() {
  globalCanvasCtx.fillStyle = "blue";
  globalCanvasCtx.fillRect(globalRenderX, globalCanvas.height / 2, 50, 50);
}

function drawProgress() {
  globalCanvasCtx.fillStyle = "blue";
  globalCanvasCtx.fillRect(globalCanvas.width / 2 - 25, globalCanvas.height / 2 - 25, 50, 50);
}


function drawPlatform() {
  globalCanvasCtx.fillStyle = "green";
  globalCanvasCtx.fillRect(0, (globalCanvas.height / 3) * 2, globalCanvas.width, 10);
}
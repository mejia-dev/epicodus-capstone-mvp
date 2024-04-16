let audioContext;
let audioBuffer;
let audioSource;
let canvas;
let ctx;
let levelData;
let renderX;

const camera = {
  position: {
    x: 0,
    y: 0
  }
}

// Initialize game
window.onload = function () {
  canvas = document.getElementById("visualizer");
  ctx = canvas.getContext("2d");

  document.getElementById("audioFile").addEventListener("change", handleAudio, false);
};

// Handle uploaded audio file
function handleAudio(event) {
  const files = event.target.files;
  const fileReader = new FileReader();

  fileReader.onload = function () {
    const arrayBuffer = this.result;
    initAudio(arrayBuffer);
  };

  fileReader.readAsArrayBuffer(files[0]);
}

// Initialize audio
function initAudio(arrayBuffer) {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  audioContext.decodeAudioData(arrayBuffer, function (buffer) {
    audioBuffer = buffer;
    createLevelFromAudio();
    startGame();
  });
}

// Create level based on audio
function createLevelFromAudio() {
  const audioData = audioBuffer.getChannelData(0); // Get audio data for left channel only for simplicity
  const numSamples = audioData.length;
  const levelWidth = canvas.width;
  const levelHeight = canvas.height;

  levelData = [];

  for (let i = 0; i < numSamples; i += Math.floor(numSamples / levelWidth)) {
    const sampleValue = Math.abs(audioData[i]); // Get absolute value of audio sample

    // Map sample value to level height
    const yPos = Math.floor(sampleValue * levelHeight);

    // this x: i / numSamples controls the overall x width that the datatakes up
    levelData.push({ x: i / numSamples * levelWidth, y: levelHeight - yPos });
  }
}

// Start game loop
function startGame() {
  console.log(levelData);
  renderX = (levelData.length * -1) + 800;
  console.log(renderX);
  requestAnimationFrame(gameLoop);

}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateRenderX();
  ctx.translate(renderX, 0);
  console.log(renderX);

  drawLevel();

  requestAnimationFrame(gameLoop);
}

function updateRenderX() {
  if (renderX < levelData.length) {
    renderX -= (1 / 360);
    // console.log("Update renderx")
    console.log(audioBuffer)
  }
}

// Draw level
function drawLevel() {
  ctx.beginPath();
  ctx.moveTo(levelData[0].x, levelData[0].y);

  for (let i = 1; i < levelData.length; i++) {
    ctx.lineTo(levelData[i].x, levelData[i].y);
  }

  ctx.stroke();
}
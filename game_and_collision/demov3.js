// Variables
let audioContext;
let audioBuffer;
let audioSource;
let canvas;
let ctx;
let levelData;
let renderX;

let progressBarXPos = 0;
const progressBarHeight = 100;
let progressBarY;

const camera = {
    position: {
        x: 0,
        y: 0
    }
}



function initializeAudioControls() {

  // define the buttons so they can be referenced later
  const playButton = document.getElementById("playButton");
  const debugAudioFrameButton = document.getElementById("debugAudioFrameButton");
  const readAsBufferButton = document.getElementById("readAsBufferButton");

  playButton.addEventListener("click", () => {
    // Check if context is in suspended state (autoplay policy)
    if (audioSource.state === "suspended") {
      audioSource.resume();
    }

    // Play or pause track depending on state
    if (playButton.dataset.playing === "false") {
      audioSource.play();
      playButton.dataset.playing = "true";
    } else if (playButton.dataset.playing === "true") {
      audioSource.pause();
      playButton.dataset.playing = "false";
    }
  },
    false,
  );


  readAsBufferButton.addEventListener("click", () => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(uploadedFile);

    fileReader.onload = function () {
      const arrayBuffer = this.result;
      console.log(arrayBuffer);
      // initAudio(arrayBuffer);
    };

    
  })
}

// Initialize game
window.onload = function() {
    canvas = document.getElementById("visualizer");
    ctx = canvas.getContext("2d");
    progressBarY = canvas.height / 2 - progressBarHeight / 2;
    document.getElementById("audioFile").addEventListener("change", handleAudio, false);
};

// Handle uploaded audio file
function handleAudio(event) {
    const files = event.target.files;
    const fileReader = new FileReader();

    fileReader.onload = function() {
        const arrayBuffer = this.result;
        initAudio(arrayBuffer);
    };

    fileReader.readAsArrayBuffer(files[0]);
}

// Initialize audio
function initAudio(arrayBuffer) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioSource = document.getElementById("audioSource");
    const track = audioContext.createMediaElementSource(audioSource);
    track.connect(audioContext.destination);
    audioContext.decodeAudioData(arrayBuffer, function(buffer) {
        audioBuffer = buffer;
        createLevelFromAudio();
        startGame();
    });
}

// Create level based on audio
function createLevelFromAudio() {
    const audioData = audioBuffer.getChannelData(0); // Get audio data for left channel only for simplicity
    const numSamples = audioData.length;
    // const levelWidth = canvas.width;
    const levelWidth = 5000;
    const levelHeight = canvas.height;

    levelData = [];

    for (let i = 0; i < numSamples; i += Math.floor(numSamples / levelWidth)) {
        const sampleValue = Math.abs(audioData[i]); // Get absolute value of audio sample

        // Map sample value to level height
        const yPos = Math.floor(sampleValue * levelHeight);

        levelData.push({ x: i / numSamples * levelWidth, y: levelHeight - yPos });
    }
}

// Start game loop
function startGame() {
    
    renderX = (levelData.length * -1) + 801;
    

    

    requestAnimationFrame(gameLoop);
    
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // updateRenderX();
    // ctx.translate(renderX, 0);
    
    // Draw level
    
    drawLevel();
    updateProgressBar();
    drawProgressBar();
    // Update game objects, handle input, etc.

    requestAnimationFrame(gameLoop);
}

function updateRenderX() {
    if (renderX < levelData.length) {
        renderX -= 1/(audioBuffer.duration / levelWidth);
    }
}

function updateProgressBar() {
  // should probably add an andif for audio actually playing
  if (audioContext) {
      const currentTime = audioContext.currentTime;
      const duration = audioBuffer.duration;
      progressBarXPos = (currentTime / duration) * 10;
      
      
  }
}
function drawProgressBar() {
  ctx.fillStyle = "blue";
  ctx.fillRect(progressBarXPos, progressBarY, 20, 20);
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
// let musicAnalyzerMusicTempo = 0;
// let musicAnalyzerMusicLength = 0;
// let levelGenLevelComplications = [];
// let levelRenGlobalRenderX = 0;
// let conditionsIsCourseComplete = false;
// let conditionsIsPlayerDead = false;
// let canvas;

let oldAudioContext;
let oldAudioHTMLElement;
let oldDataArray = [];
let oldAnalyzer;
let oldBufferLength;
let uploadedFile;



// Wait for window load
window.onload = function () {
  // watch for file upload
  document.getElementById('file').addEventListener('change', function (event) {
    let blob = window.URL || window.webkitURL;
    const file = this.files[0], fileURL = blob.createObjectURL(file);
    // add more data validation here later.
    if (file.type.toLowerCase().indexOf("audio") != -1) {
      console.log("is audio!")
      uploadedFile = file;
      document.getElementById("audioSource").src = fileURL;
      initializeAudioTrack();
    }



  });
}



function levelGenGetComplications() {
  const audioData = audioBuffer.getChannelData(0);
  const numSamples = audioData.length;
  const levelWidth = canvas.width;
  const levelHeight = canvas.height;


  levelData = [];

  for (let i = 0; i < numSamples; i += Math.floor(numSamples / levelWidth)) {
    const sampleValue = Math.abs(audioData[i]); // Get absolute value of audio sample

    // Map sample value to level height
    const yPos = Math.floor(sampleValue * levelHeight);

    levelData.push({ x: i / numSamples * levelWidth, y: levelHeight - yPos });
  }
}



function initializeAudioTrack() {
  // get context for audio
  oldAudioContext = new (window.AudioContext || window.webkitAudioContext)();

  // locate the audio holder
  oldAudioHTMLElement = document.getElementById("audioSource");
  // get the track from the audio holder
  const track = oldAudioContext.createMediaElementSource(oldAudioHTMLElement);

  // connect the track from the source to the destination. 
  track.connect(oldAudioContext.destination);

  // define the audio anaylzer (this generates the code)
  oldAnalyzer = oldAudioContext.createAnalyser();
  track.connect(oldAnalyzer);
  oldAnalyzer.fftSize = 2048;
  oldBufferLength = oldAnalyzer.frequencyBinCount;
  oldDataArray = new Uint8Array(oldBufferLength);

  initializeAudioControls();
  initializeCanvas();
}




function initializeAudioControls() {

  // define the buttons so they can be referenced later
  const playButton = document.getElementById("playButton");
  const debugAudioFrameButton = document.getElementById("debugAudioFrameButton");
  const readAsBufferButton = document.getElementById("readAsBufferButton");

  playButton.addEventListener("click", () => {
    // Check if context is in suspended state (autoplay policy)
    if (oldAudioContext.state === "suspended") {
      oldAudioContext.resume();
    }

    // Play or pause track depending on state
    if (playButton.dataset.playing === "false") {
      oldAudioHTMLElement.play();
      playButton.dataset.playing = "true";
    } else if (playButton.dataset.playing === "true") {
      oldAudioHTMLElement.pause();
      playButton.dataset.playing = "false";
    }
  },
    false,
  );

  // debug button for console logging music frames.
  debugAudioFrameButton.addEventListener("click", () => {
    oldAnalyzer.getByteTimeDomainData(oldDataArray);
    console.log(oldDataArray);
  });

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


















function initializeCanvas() {
  // Locate element and define it as a canvas.
  const canvas = document.getElementById("visualizer");
  const canvasCtx = canvas.getContext("2d");

  // Set canvas dimensions - likely adjust this later.
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;

  // Function to draw the visualization
  function draw() {
    requestAnimationFrame(draw);

    canvasCtx.translate(0, 0);
    // Retrieve wavelength/frequency data
    oldAnalyzer.getByteFrequencyData(oldDataArray);

    // add color to canvas
    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    // define width of bars. Kinda arbitrary, but bar height will change later in relation to it.
    const barWidth = (canvas.width / oldBufferLength) * 4.5;
    let barHeight;

    // x helps determine proper x position placement of bars
    let x = 0;

    for (let i = 0; i < oldBufferLength; i++) {
      // set bar height. This can end up being smol if not multiplied. May not matter once frames are exported, but good to keep in mind
      barHeight = oldDataArray[i];

      // change color based on height. This isn't working too well currently.
      canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',20,20)';

      // drawing syntax: fillRect(x, y, width, height)
      // originally, barHeight was divided by 2 as there was an assumption that the wavelength was being generated in the middle of the page, but since it is being rendered at y = 0, there is no visual difference __currently__. Again, this may need to be changed depending on frame requirements later.
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      // set the next bar to be rendered at 1 + the width of a bar
      x += barWidth + 1;
    }
  }

  // Initiate draw
  draw();
}
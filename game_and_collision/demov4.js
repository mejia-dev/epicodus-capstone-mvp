// onload, 
// get canvas and set it to 2d
// get the audio upload spot and set the event handler to change

let globalAudioBuffer;
let globalAudioContext;
let globalAudioHTMLElement;
let globalCanvas;
let globalCtx;
let globalLevelData;

window.onload = () => {
  globalCanvas = document.getElementById("visualizer");
  globalCtx = globalCanvas.getContext("2d");
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
    // proceed to next steps after audio has decoded here
    initializeAudioControls();
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
  const levelHeight = canvas.height / 2;
  // may need to change width and height later for playability. Will need to test.

  // erase array if it already exists
  globalLevelData = [];

                      // spread the data (samples count) out across the defined play area
  for (let i = 0; i < samplesCount; i += samplesCount / levelWidth) {
    const sample = Math.abs(audioData[i]);

    const posY = Math.floor(sample * levelHeight);
    // this x: i / samplesCount controls the overall x width that the data takes up
    globalLevelData.push({x: i / samplesCount * levelWidth, y: levelHeight - posY});
  }
  
}
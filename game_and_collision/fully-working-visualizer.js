// Wait for window load
window.onload = function() {

  // watch for file upload
  document.getElementById('file').addEventListener('change', function (event) {
    let blob = window.URL || window.webkitURL;
    const file = this.files[0],fileURL = blob.createObjectURL(file);
    // add more data validation here later.
    if (file.type.toLowerCase().indexOf("audio") != -1) {
      console.log("is audio!")
      document.getElementById("audioSource").src = fileURL;
      initializeCanvas();
    }
  });
}
 


function initializeCanvas() {
  // get context for audio
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();

  // locate the audio holder
  const audioElement = document.getElementById("audioSource");

  // get the track from the audio holder
  const track = audioContext.createMediaElementSource(audioElement);

  // connect the track from the source to the destination. 
  track.connect(audioContext.destination);

  // define the buttons so they can be referenced later
  const playButton = document.getElementById("playButton");
  const debugAudioFrameButton = document.getElementById("debugAudioFrameButton");

  // define the audio anaylzer (this generates the code)
  const analyser = audioContext.createAnalyser();
  track.connect(analyser);
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);


  // debug button for console logging music frames.
  debugAudioFrameButton.addEventListener("click",() => {
      analyser.getByteTimeDomainData(dataArray);
      console.log(dataArray);
    }
  );


  playButton.addEventListener("click",() => {
      // Check if context is in suspended state (autoplay policy)
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      // Play or pause track depending on state
      if (playButton.dataset.playing === "false") {
        audioElement.play();
        playButton.dataset.playing = "true";
      } else if (playButton.dataset.playing === "true") {
        audioElement.pause();
        playButton.dataset.playing = "false";
      }
    },
    false,
  );


  // Locate element and define it as a canvas.
  const canvas = document.getElementById("visualizer");
  const canvasCtx = canvas.getContext("2d");

  // Set canvas dimensions - likely adjust this later.
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Function to draw the visualization
  function draw() {
    requestAnimationFrame(draw);

    // Retrieve wavelength/frequency data
    analyser.getByteFrequencyData(dataArray);

    // add color to canvas
    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    // define width of bars. Kinda arbitrary, but bar height will change later in relation to it.
    const barWidth = (canvas.width / bufferLength) * 4.5;
    let barHeight;
    
    // x helps determine proper x position placement of bars
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      // set bar height. This can end up being smol if not multiplied. May not matter once frames are exported, but good to keep in mind
      barHeight = dataArray[i];

      // change color based on height. This isn't working too well currently.
      canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',20,20)';

      // drawing syntax: fillRect(x, y, width, height)
      // originally, barHeight was divided by 2 as there was an assumption that the wavelength was being generated in the middle of the page, but since it is being rendered at y = 0, there is no visual difference __currently__. Again, this may need to be changed depending on frame requirements later.
      canvasCtx.fillRect(x, canvas.height - barHeight , barWidth, barHeight );

      // set the next bar to be rendered at 1 + the width of a bar
      x += barWidth + 1;
    }
  }

  // Initiate draw
  draw();

}



window.onload = function() {
  // get context for audio
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  
  // locate the audio holder
  const audioElement = document.getElementById("audioSource");
  if (audioElement != null) {
    console.log("good!")
  }
  
  // get the track from the audio holder
  const track = audioContext.createMediaElementSource(audioElement);
  
  // connect the track from the source to the destination. 
  track.connect(audioContext.destination);
  
  // play button functionality
  
  const playButton = document.getElementById("playButton");
  const collectButton = document.getElementById("collectButton");
  
  


  const analyser = audioContext.createAnalyser();
  track.connect(analyser);

  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  // console.log(dataArray);

  collectButton.addEventListener(
    "click",
    () => {
      analyser.getByteTimeDomainData(dataArray);
      console.log(dataArray);
    }
  );

  playButton.addEventListener(
    "click",
    () => {
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


  const canvas = document.getElementById("visualizer");
      const canvasCtx = canvas.getContext("2d");

      // Set canvas dimensions
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Function to draw the visualization
      function draw() {
        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = canvas.width * 1.0 / bufferLength;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = v * canvas.height/2;

          if(i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
      }

      // Start drawing the visualization
      draw();

}



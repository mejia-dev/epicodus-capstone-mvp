// get context for audio
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// locate the audio holder
const audioElement = document.querySelector("audio");

// get the track from the audio holder
const track = audioContext.createMediaElementSource(audioElement);

// connect the track from the source to the destination. 
track.connect(audioContext.destination);

// play button functionality

const playButton = document.querySelector("button");

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
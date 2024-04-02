// onload, 
  // get canvas and set it to 2d
  // get the audio upload spot and set the event handler to change

let globalCanvas;
let globalCtx;

window.onload = () => {
  globalCanvas = document.getElementById("visualizer");
  globalCtx = globalCanvas.getContext("2d");
  document.getElementById("audioFile").addEventListener("change", handleAudioUpload);
};

function handleAudioUpload(event) {
  let blob = window.URL || window.webkitURL;
  const file = event.target.files[0], fileUrl = blob.createObjectURL(file);
  document.getElementById("audioSource").src = fileUrl;
  const fileReader = new FileReader();
  fileReader.onload = () => {
    const bufferedAudioArray = this.result;
    // do something with the buffered audio array here
    initializeAudioTrack(bufferedAudioArray);
  };
  fileReader.readAsArrayBuffer(file);
}


function initializeAudioTrack(bufferedAudioArray) {

}




// Create Level from Audio
  // this function will create the "level" based on the inputted audio data.

  function createLevelFromAudio() {

  }
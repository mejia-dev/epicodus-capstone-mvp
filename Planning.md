# Epicodus Capstone Planning Log

### Thoughts:
* ~~Python has [pygame](https://www.pygame.org/news) framework.~~ Will use JavaScript.
* ~~How to convert audio to jsonified format. Python? This would likely result in an upload API call though, which isn't desired.~~ Web Audio API will be used.
* Rendering:
  * Rendering function could be something like: 
    * Do a load of the file
    * Generate all frames in current method, but instead of rendering on the canvas, push them all to an array.
    * Once this is finished, rerender canvas based on each frame in the array in time with the music. One potential issue could be pausing and resyncing if it gets out of sync. Would need to experiment (in the meantime, don't play Max Richter’s _Sleep_)
  * See if there is a way to make visualizations render horizontally and appear to visually move right to left. 
    * If there is, then there may not even be an issue with pausing. Freeze player when pause button/key is hit. No need for anything more.

### Resources:
* Web Audio API:
  * https://mdn.github.io/webaudio-examples/audio-analyser/
  * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
  * https://webaudioapi.com/samples/visualizer/
  * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
* Platformer samples:
  * Good collision and controls - https://codepen.io/stealy/pen/vYBZoeo
  * Doing research into handle level autoscrolling.
    * Appears that I will likely need to use the [translate() method](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate) of 2d canvas.
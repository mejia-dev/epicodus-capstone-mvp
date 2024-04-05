# Epicodus Capstone Planning Log

### Total Time Spent: 26.75 hours (see time log below for more details)

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


### Time Log:

* 2024-04-05 - hours total
  * 8:30am PST - 10am PST
    * Adjusting height of platform to make it more usable.
    * Begin working on gravity system.
  * 10:30am PST - 
    * Continue working on gravity.
    * Determined it would be easier to have everything broken up as separate classes as defined in pseudocode. Begin creating PlayerObj class.
    * Finalize gravity functionality. Now need to add ground checking.
    * Finalize gravity check for platform height. Now player doesn't fall through ground.

* 2024-04-04 - 1.5 hours total
  * 9:20am PST - 10:47am PST
		* Working on math to get blue square to move along the level according to the timestamp.
		* Finish code that gets blue square to move along the level according to timestamp. Now need to lock camera view to the square instead of letting it scroll off-screen
		* Make blue square be static and make audio wave move instead.
		* Add first version of ground platform

* 2024-04-02 - 8.25 hours total
  * 10:01am PST - 12:00pm PST
		* Continue learning more about the Web Audio API.
    * Fix typos in blob storage that was causing audio to not be handled correctly.
    * Working on correcting arraybuffer bug
    * Fix audio buffering bug.
      * Appears that in the context of creating a buffer, `fileReader.onload = function () {}` is not the same as `fileReader.onload = () => {}`. Noting this for future use.
    * Working on mathematic calculations for level generation.
	* 1:00pm PST - 4:43pm PST
		* Continue working on level generation function.
		* Finalize createLevelData function.
		* Appears that createLevelData function has an error and is returning NaN.
			* Appears to be an error with the getChannelData method. Appears that it is returning some erroring values. Need to determine why this is happening, then the issue should resolve. May be because the audio has already been split down to single channel.
			* Fix issue. Appears that the iterator in the for loop was increasing by a non-whole value which was greatly throwing off the calcuations. Using Math.floor() resolved the issue.
		* Begin working on drawing something that moves in time to the music. 
			* Having some trouble trying to get current track time working as expected. Can't seem to find where that value is in the Web Audio API.
			* Located a [full, free, online book](https://webaudioapi.com/book/Web_Audio_API_Boris_Smus_html/toc.html) on the Web Audio API.
	* 4:54pm PST - 6:34pm PST
		* Continue looking into Web Audio API.
		* Successfully get web audio current time via getting the currentTime property of the HTML element responsible for handling audio.
		* Resolved issue with Razor pages from above.
		* Looking into equations as to why the square is not moving along the rendered data at the right pace with the song.
			* The issue lies in the fact that the currentTime is calculated linearly, whereas the level data would make it need to be calculated with a percentage instead (percent of level complete vs timestamp). Trying to figure out which numbers are needed to generate the percentage.

* 2024-03-31 - 1 hour total
  * 12pm PST - 1pm PST --- Continue level demos
    * Appears that stretching out the assumed canvas width value can render a more elongated version of the full wavelength. Will begin writing a fresh demo (v4) to see if this can be used in addition to the player movement. 
    * Create upload handler that will call other functons

* 2024-03-30 - 6.5 hours total
  * 9:40am PST - 12:17pm PST --- Sketching out level design
    * Research best practice of platformer level design on YouTube.
    * Begin writing pseudocode.md to determine what functionality needs to be written.
      * Write level complications and music analyzer pseudocode  
      * Update pseudocode with PlayerObj basics
      * Add initial thoughts for LevelRendering
      * Add basic info for ConditionsChecker
  * 1:15pm PST - 3pm PST --- Sketching out components + prototypes
    * Started working on sample demov1. 
    * Add read buffer button and confirm it is reading the buffer correctly. We can render if full-page, but currently researching if there's a way to add a "camera" effect to the canvas so that it only renders some of it. 
    * Appears that global renderX variable is not working. Will look into this more later.
  * 3:30pm PST - 5:15pm PST --- Continue working on demo
    * Ended up adapting some other code that shows the complete wavelength and trying to add renderX variable to that. However, the value seems to move by too fast. 
    * Will try starting with an audio progress bar instead and see if it can be reworked to run backwards with audio. 
    * Audio progress bar appears to be working as expected. Will need to get audio playing consistently as next step.


* 2024-03-23 - 2 hours total
  * 11:00am PST - 1pm PST --- Continued Platformer / Visualization testing
    * Begin experimenting with rendering bars to move horizontally.
    * After experimenting and thinking through it a little more, it seems like having the entire level generated by visualizer directly could lead to some weird consequences -- either levels becoming impossible due to certain long tones, certain wavelengths generating platforms that are too high to jump on top of / over, etc. The visualizer iteslf could still be used maybe in a mini view or as the background so that the visualizations could still play, but at the end of the day, some changes need to be made to the original concept.
      * Make a predefined "level base". This base will have some predefined platforms, events/enemies (spikes? etc.) that will pop up according to the tempo of the song. Another way to do it would be that certain things only appear if notes hit a certain "height". Will make height printer to test this theory after writing this. 
        * At first make just one, but if it goes easier than expected, randomize it a bit / give it some personality.
      * The level will still autoscroll to the tempo of the song, but there will be more predefined things like powerups / ground that AREN'T randomly generated.
    * These changes should result in a game that is more widely playable and not just completely random.

* 2024-03-22 - 7.5 hours total
  * 8:00am PST - 9:11am PST --- Researching Game Engine
    * Researching gamemaking in Python. 
    * Discovered pygame framework. Researching games built with this framework to see if it seems suitable.
      * Looked through https://www.pygame.org/tags/platformer collection.
      * Noted that several titles seem to be lower production quality. Not sure if this is because pygame is mostly used for hobbyist / gamejam situations or if it's because it's difficult to use.
      * Appears that this is one of the few examples of a production-quality game that has been released: https://cheezye.itch.io/metal-arbiter.
      * Leaning towards JS, but will see if another Python library/framework can be found.
    * Located [Arcade library](https://api.arcade.academy/en/latest/index.html).
      * Looking at example for [platformer template](https://api.arcade.academy/en/latest/examples/template_platformer.html#template-platformer).
      * Noted that most of the things being defined here are also things that would need to be defined if writing a game engine in JS.
      * The few specific benefits of Aracade vs game engine from scratch:
        * Physics and collision engine. This could be extremely useful, though not sure if it's worth it just for these features (assuming I can get collision working as expected). Also, my game will likely have no enemies/collectibles (at least not in initial development), so the only collision that matters would be the ground and "goalpost".
        * Scene and tilemap rendering. Useful as a whole, though it may not be worth it since I won't specifically be rendering tiles like a standard platformer.
        * Deltatime function is built in. Just less writing.
        * Some sprite scaling features might be slightly easier.
        * Camera functionality is built in (although this is only situationally good since I can't think of a situation where I would actually need to implement this for my game.)
      * A few specific things that make more sense for me using JS / things that aren't any better in Arcade:
        * I've already made games in JavaScript.
        * Much easier to host instead of using PythonAnywhere or alternative. Additionally, no windowing / vsync / graphics issues. If you can run a browser, you can run the game.
        * Arcade appears to be able to get keypresses, but doesn't appear to have a specific input handler like Unity or other "game engines" do. Code for handling keypresses still seems to be written by hand, so no real benefit.
        * Still running a manually-defined screen update / render loop like you would on JS canvas element. No real benefit in rendering apart from Arcade making the function calls slightly prettier.
        * Not seeing anything called out about local file support. This could be a problem.
        * No way to test installation on a MacOS system. Having game be browser-based would make this much easier.
      * Looking at [games page](https://api.arcade.academy/en/latest/sample_games.html). None of these appear to have a need for fast-paced precision, so not sure how well this concept works in Arcade.
    * These appear to be the two primary game libraries. Will go with JavaScript.

  * 9:11am PST - 10:18am PST --- Researching Audio JSON-ifier
    * Looking into [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) as it has an analyze method that seems to be [used for this purpose](https://stackoverflow.com/questions/62408542/how-to-export-an-audio-file-byte-frequency-data-to-a-json-object).
    * Located [Python-based approach](https://stackoverflow.com/questions/61952022/creating-a-json-with-information-about-audio-file) as well.
    * Located https://webaudioapi.com/samples/. Began experimenting with examples.
      * [This example](https://webaudioapi.com/samples/visualizer/) gives me one of the main things I need for the game -- visualizer.
      * MDN has some [useful tutorials](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API).
      * Also found a good list of resources on [this Reddit post](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API).
    * A few more examples added to the Resources section above.
    * Just found the [Web MIDI Api](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API).
      * After doing some more research, the Web Audio API still seems better.

  * 10:18am PST - 1pm PST --- Going to attempt to build an audio upload & visualizer.
    * Finding tutorial
    * WIP while looking at different tutorials to find bar generation specifically.
    * Ended up going through tutorials to build [webaudio examples](https://github.com/mdn/webaudio-examples/tree/main/audio-basics) from MDN.
    * After lunch & appointment, will work on trying to get local file upload and playback supported.

  * 3:30pm PST - 6:08pm PST
    * Begin working on file upload.
    * Solve file upload and rendering based off of file upload
    * Create copy of visualizer for testing game mechanics.
    * Work on refactoring and removing unused code.
    * Add more ideas for how rendering should work.
    
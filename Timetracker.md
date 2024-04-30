# Epicodus Capstone Timetracker & Devlog

### Total Time Spent: 77.31 hours (see time log below for more details)


### Time Log:

* 2024-04-30 -  hours total
  * 7:56am PST - 12:01pm PST
    * Begin working on assets for game (sprites, sounds, etc.). Create `graphics-upgrade` branch.
    * Change platform to white and make it thinner.
    * Add black background for game. Move black background rendering and canvas resetting into separate `resetCanvas` function.
    * Adjust position of player to be more on the left.
    * Change platform to be the same color as the audio visualizer, using a new function `updateGlobalAudioColor` and new variable `globalAudioColor`. Reduce width of platform.
    * Clean up and reorganize code in `GameRendering.tsx`.
    * Add loading message and auto-hide unneeded elements when loaded. Update CSS with "hidden" class and change the input element to use the button styling.
    * Add Change Track button. Set unused elements to be hidden after load.
    * Added fonts to HTML elements. Working on adding these to canvas.
    * Successfully add fonts to canvas using font-family declaration in stylesheet.
    * Adjust spacing of score and lives display.
    * Make lives indicator turn red when lower than 2 lives remaining.
    * Add sound effect when player loses the game.
    * Make header logo cycle colors in accordance with `globalAudioColor`.
    * Noted a potential quality issue - when the play/pause button is pressed, that button is highlighted by default. This isn't a major issue, except that if the SPACE key is being used for jumping, it will pause the game again after playing. May need to change HTML focus.
      * Used the `.focus()` method on the `globalCanvas` object, but found that it still is not targeting correctly.
      * Ended up setting a tabIndex property on the canvas which allowed it to work as expected.
      * Confirmed that using the button and then pressing spacebar does not have adverse effects anymore.
      * Remove canvas focus outline using CSS. This removes the white border around the object.
    * Begin brainstorming better player and enemy sprites.
  * 12:01pm PST - 1:07pm PST
    * Lunch
  * 1:07pm PST - 
    * Continue working on finding spritesheet for player and enemy
      * Attempted to develop my own spritesheet but determined that this might take too much time.
      * Started looking through https://craftpix.net/.


* 2024-04-29 - 7.82 hours total
  * 8:06am PST - 12pm PST
    * Continue working on jump technique
      * Doing some more research on YouTube.
      * Attempt a new double jump functionality by checking for a velocity that is not 0. This seems to work better in most cases.
      * Resolve double-jump control (to make sure player can only jump twice). Tested at all speeds and confirmed it is working as expected.
    * Game MVP appears to be fully functional. Testing full playthrough of short, medium, and long tracks now to ensure no bugs or glitches.
      * Successful test at short track (win and loss).
      * Successful test at medium track (win and loss).
      * Loss condition successful for long track but it is difficult to stay alive long enough to test win condition (track is roughly 15 minutes long). Confirmed that it works fine when lives are not counted so would likely also work when lives are counted.
    * Will begin working in the [Rhythm Runner repo](https://github.com/mejia-dev/rhythmrunner).
    * Noticed several bugs when testing with Firefox.
      * One audio track inexplicably won't upload. Error: `Uncaught (in promise) DOMException: The buffer passed to decodeAudioData contains an unknown content type. `. This is the shortest track of all the test tracks and just won't play.
      * The browser lags significantly when trying to play any other track.
    * Did some research but could not find anything that resolved the Firefox issues. Given the deadline, will just say that Chrome / Chromium browsers are a requirement for this game since it works fine in Chrome/Edge/Brave. May explore Firefox functionality later if desired.
    ---
    * All work listed from here on out is done in the [Rhythm Runner repo](https://github.com/mejia-dev/rhythmrunner) unless explicitly stated otherwise.
    ---
    * Created Vite app with TypeScript. Will attempt to use type checking if it doesn't end up seriously impeding progress (due to deadline).
    * Begin working on `PlayerObj.ts`. Realized that it needs `InputController`.
    * Created `InputController.ts`. 
    * Continued working on `PlayerObj.ts`, but noted that there are some global variables related to the canvas that are required. Will work on `Game.ts`.
    * Added global variable exports from `Game.ts`.
    * Added `PlayerObj.ts`.
    * Realized I had created the project without React. Recreated with React.
    * Began working on `EnemyObj.ts`. Tested changing updateSpawnedEnemies to handle awarding points, not enemy object. Confirmed this work and commited in this MVP repository to demov8. Will also do this on production build.
    * Begin working on `AudioHandler.ts`.
  * 12pm PST - 1:05pm PST
    * Lunch
  * 1:05pm PST - 4:59pm PST
    * Continue working on `AudioHandler.ts`.
    * Remove `AudioHandler.ts` since it appears that many of these functions need to take place without import statements since they need to be applied directly to the variables in `GlobalGameLogic.ts`.
    * Add canvas initialization to `GlobalGameLogic.ts`.
    * Updating location of global variable imports and exports between `GlobalGameLogic.ts` and `GameRendering.tsx` since some things only get updated by one and read by the other.
    * Having some trouble passing data back from GlobalGameLogic to GameRendering whenever the scene is finished loading. May end up just turning this into one file if a solution can't be found.
    * Refactor all game logic to happen in `GameRendering.tsx`. Confirmed game is playable.
    * Noted that the onload method used does not seem to be working for some browsers. Will adjust this. 
    * Fix onChange issue by using onChange event of input element, then using the ChangeEvent type on the `handleAudioUpload` function.
    * Running eslint against the code and resolving issues.
      * Change `globalScoreSet` declaration to `const` (line 15).
      * Change `blob` declaration to `const` (line 30).
      * Change `newEnemy` declaration to `const` (line 228).
    * Looking into how to change two "any" declarations on the `blob` and `file` variables in the `handleAudioUpload` function.
      * Strongly declare `file` line 31 as `File | undefined`. Then only allow fileReader to read file if it exists.
      * Can't seem to find a way to get the error to clear for the `blob`. Will circle back on this later.
      * Resolve unused variable `globalEnemySpawnInterval`.


* 2024-04-28 - 4.68 hours total
  * 10:48am PST - 3:29pm PST
    * Determine a bug with the current enemy spawn system that leads to inconsistent spawns. Appears that the enemy timer is increasing whether or not the audio is playing. Can likely just have a checker outside the loop to see if the audio is playing, and if not, set the timer back to 0.
    * Add initial fix for keeping spawn times consistent from the start of the audio track. However, noticed that with this method, the timer now gets set back to 0 at every pause. Working on a new solution.
    * Add globalEnemyTimerPausedState variable to keep track of timer while it is paused. This resolves the issue and pausing now works as expected.
    * Begin work on adding a life indicator.
      * Add working HUD for both lives and score.
    * More things that need to be finished:
      * Defined loss handling (ran out of lives)
      * Adjust scoring
      * Double jump may be failing at higher frame rates. Need to test more.
      * Defined win conditions
    * Begin working on loss handling
      * Add handleLose function with message rendering in middle of screen. The music also pauses so that no other functionality takes place. 
    * Begin working on win condition.
      * Running into some trouble trying to figure out how to get the "end" of the rendered audio and make it an actionable condition.
      * Found that comparing `globalAudioHTMLElement.currentTime` to  `globalAudioBuffer.duration` should be what is needed, since this gets updated independently from any other functionality.
      * Add functional winning message.
    * Looking into scoring issues where enemy collides with end of level multiple times, causing multiple points to be added.
      * Create demov8
      * Give each enemy a unique ID using the current time. (`new Date().toLocaleTimeString();`). Will try having a global "ScoresSet" that unique scores can be added to, then the player's score is calculated by getting the count of those scores.
      * Add successful scoring via set using globalScoreSet variable. Confirmed that now only one point is added per avoided enemy.
    * Cleaned up code.
    * Begin looking into double-jumping issues at higher framerates
      * Appears that sometimes the player can't double-jump, but other times, the player can jump more than twice.
      * Implemented old jump functionality which seems to be working better, but can still slow down at highest framerates.
      * Wondering if perhaps the delay using the timeout needs to happen not at the assignment of the ability, but on the check to see if the key was pressed again.
      * Jump still not working with new technique. Will work on this more later.

* 2024-04-26 - 3.8 hours total
  * 11:15am PST - 3:03pm PST
    * Continue working on delta time. 
    * Working with Delta Time. Discussion with Henry on spatial filters for audio to see if overall wavelengths could be reduced at all.
    * Finalize delta time for jump! Ended up using a modified version of the formula from https://www.youtube.com/watch?v=c4b9lCfSDQM.

* 2024-04-17 - 6.49 hours total
  * 9:04am BST - 10:02am BST
    * Working on resume and cover letter for internship through Epicodus. Sent resume and cover letter, CC'ing Nina from Epicodus.
  * 10:02am BST - 11:02am BST
    * Reading up more on delta time
    * Implemented first functional version of delta time, though this somehow made the frame rate....consistently choppy?
    * Second implementation of delta time works! Needed to be added to the drawLevel method instead of the updateRenderX method.
    * Successfully add delta time to enemy. Will just need to add to player now.
  * 11:56am BST - 3:03pm BST
    * Continue working on adding delta time to player.
    * Fix bug where invincibility would deactivate if hit again.
    * Continue working on implementing delta time. The current issue seems to be that the jump height increases at higher framerates due to the `deltaTimeMultiplier` multiplying the velocity.
    * Attempting to solve gravity first instead of jump as this may be easier to reverse.
      * `enforceGravity(deltaTimeMultiplier)` may need to have an additional calculation performed on it (potentially twice). Delta time may need to first be calculated as part of the velocity calculation (modifying `this.velocity.y`), then again as part of the actual movement (changing `this.position.y` based on `this.velocity.y`).
      * Successfully update `enforceGravity` to account for delta time. Also refactored "isGrounded" check to be part of gravity enforcement, as originally desired. 
      * Noted that at higher framerates, the setTimeout method does not work as desired for double jumping, since the player may have already landed by the time the timeout is complete. Will need to look into refactoring this.
    * After looking into it more, may just be able to scale the delay by delta time.
    * Reviewing some more resources
      * https://www.youtube.com/watch?v=c4b9lCfSDQM
      * https://www.youtube.com/watch?v=yGhfUcPjXuE
      * https://www.youtube.com/watch?v=rWtfClpWSb8
    * Rebuilding jump functionality from scratch.
    * Will look into this more later.
  * 8:30pm BST - 9:54pm BST
    * Working on resume and cover letter for internship through Epicodus. Sent resume and cover letter, CC'ing Nina from Epicodus.

* 2024-04-16 - 7.35 hours total
  * 8am BST - 12:30pm BST
    * Begin working on lives and losing functionality.
    * Update repo's README.
    * Add three lives for the player, detracted on collision with an enemy.
    * Add three seconds of invincibility when the player is hit.
      * Looking into adding a visual effect for this.
      * Add basic glow effect if player has invincibility via ShadowBlur
    * Separate jump to have its own method in PlayerObj.
    * Working on bug as to why score is not increasing when enemy is successfully avoided.
      * Resolved the issue. Wasn't calling checkBoundaries method from requestUpdate of Enemy.
      * Discovered another issue -- score is being added for each frame of collision (most likely, unsure what else would be causing it). Need to make this only apply once.
        * Attempted to add a "scored" flag property to the enemy object that sets when the score is set, but this only ends up getting reapplied multiple times. 
        * Attempted to add a timeout but this just delays all of the scoring and doesn't fix the issue.
        * Also noticed that enemy timer runs from the moment the canvas starts and that framerate is still choppy on larger songs. Need delta time implementation and to make sure timer isn't running until play is pressed.
        * Still researching how to solve the frame score issue
        * More research time.
      * Scoring seems to be consistently inconsistent. Going to try to implement delta time to see if this can be solved once framerate is smooth.
      * Created demov7 and began implementing delta time.
  * 2:30pm BST - 2:50pm BST
    * Adjusting delta time functionality. Player appears to be floating upwards continually
  * 5:30pm BST - 6:00pm BST
    * Watch video on Delta Time (https://www.youtube.com/watch?v=WU6GPObmNwM).
    * Doing some research into [`performance.now()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) vs `Date.now()`.
  * 7:45pm BST - 8:30pm BST
    * Continue working on Delta Time functionality.
    * Attempting to work out how to apply the delta time multiplier once obtained.
    * Not finding the solution easily. May need to do a deep-dive on the topic to further explore it. 
  * 9:40pm BST - 10:56pm BST
    * Working on resume and cover letter for internship through Epicodus. Sent resume and cover letter, CC'ing Nina from Epicodus.


* 2024-04-15 - 7.3 hours total
  * 7:56am BST - 1:03pm BST
    * Continue working on enemy spawning.
    * Determined that the issue is not with the spawning method, but moreso that the condition is checking if the enemy's x position is equal to the song position via globalRenderX (grX). Because grX increments by a number relative to the length of the song, the condition is often not returning any spawned enemies until an enemy's xPos just so happens to be grX, which is rare. 
    * Resolved enemy spawning issue by getting a range if the enemy's position is greater than grX and less than grX + canvaswidth
    * Fixed initial enemy spawning not working due to y spawn value not being properly defined. 
    * Working on resolving issue with enemy rendering. Enemy renders at a static position but seems as though it can't move.
      * Appears `this.position.y` for enemy1 is NaN.
      * Determined that the issue was caused by incorrectly scoped `this` when declaring the enemy. After changing to a non-relative value, rendering works as expected.
    * Fix bug in marking enemies ready for deletion. Was using `this.x` instead of `this.position.x`.
    * Add enemy spawner. List seems to be populating, but is not always rendering all enemies on screen. Some songs will render too many of the enemies (to the point of lag) and others will not.
      * After doing some research it appears that this is because I am setting the enemy's posX value to be the x value of the data point, but because the enemy list does not scroll across the screen like the audio track does, they are rendering outside of the view. Could either solve this by having render on the right side of the screen whenever they are added to the spawn list, or could attempt to move one layer on top of the other one (enemy layer flows concurrently with wavelength layer)
      * Resolved issue by rendering enemy on right side of the canvas. Can add it as a second layer later if there is a need for it.
      * Enemy spawning still runs if the game is paused or not started. 
      * Doing some research on game pausing best practices. Decided to just set this to be globalAudioIsPaused for now, since all game effects will likely be based on whether audio is playing or not. 
    * Add pause functionality to game which fixes multiple enemies rendering at the start of the game. However,
      * Enemies are spawning below platform (just need height adjustment)
      * Enemies are moving much slower than the level scroll.
      * There is currently no collision detection between the player and an enemy
      * Multiple enemies may be spawning at once. This is hard to tell currently as all enemies move so slowly.
    * Make enemies render above platform.
    * Looking through code to determine how best to make enemies move at same speed as wavelength.
  * 2:08pm BST - 3:32pm BST
    * Continue working on enemy spawning.
    * Determined to have a moveSpeed property of the enemy and update it based on renderX on each requestUpdate call.
    * Added moveSpeed property to enemy. Also added a `globalPreviousRenderX` variable to assist with calculations for movement speed. This variable gets updated right before the new `renderX` is set.
    * Researching collision detection. Appears to be best practice to have a separate collision detection handler instead of building it into the code of one of the objects that are colliding. Will begin work on this. 
    * Add collision detector. Appears that there is no x position on player. Will adjust this.
  * 4:20pm BST - 5:07pm BST
    * Add x position to player.
    * Collision appears to be registering on the wrong side. Collision is detected and undetected preemptively.
      * Resolved this. Appears that collision order was reversed. Object1 needs to be the object being hit and Object2 needs to be the approaching object. 
    * Noted that collision detection works correctly on the x axis but does not work correctly when the player jumps over the enemy successfully (still detects a hit).
      * Resolved by adding a condition for object1 and object2's x and y values (four conditions total)

* 2024-04-13 - 1 hour total
  * 9:30am BST - 10:30am BST
    * Continue working on rendering enemies onscreen.
    * Add basic functionality for rendering enemies every x seconds using setInterval to increase a global counter.

* 2024-04-06 - 2.3 hours total
  * 11:50am PST - 2:08pm PST
    * Continue working on making the beat hit at the right time.
    * Finalize rendering delay.
    * Begin planning out enemies.
      * Got list of all spikes in audio. Should be able to overlap these spikes with the track.
      * Create Enemy class. Looking through old code snippets to determine how to spawn enemies. May end up something like "if enemy exists in array every x seconds, spawn one at the requested position". X could be dependent on difficulty.
      * Working on rendering enemies on screen.


* 2024-04-06 - 2.5 hours total
  * 11:32am PST - 1:03pm PST
    * Work on math for rendering the level spikes at the right length.
    * Finalize math and complete level rendering with proper timing. 
      * Ended up needing to set the width to the audio's duration times 1000 miliseconds. 
      * Then, adjust renderX updater to update based on completion percentage times the final X value in the levelData array.
      * This resolves the issue but ends up creating another (anticipated) problem where the level is rendering very quickly and the spikes are difficult to jump over. Now that audio is rendering at the proper time though, this should be easy enough to adjust in the next update.
  * 5:20pm PST - 6:28pm PST
    * Improve gravity to make levels easier.
    * Work on adjusting color affects of wavelengths and change height.
    * Begin work on making beat hit at the point of the player instead of at the edge of the canvas.


* 2024-04-05 - 7.33 hours total
  * 8:30am PST - 10am PST
    * Adjusting height of platform to make it more usable.
    * Begin working on gravity system.
  * 10:30am PST - 1:20pm PST
    * Continue working on gravity.
    * Determined it would be easier to have everything broken up as separate classes as defined in pseudocode. Begin creating PlayerObj class.
    * Finalize gravity functionality. Now need to add ground checking.
    * Finalize gravity check for platform height. Now player doesn't fall through ground.
    * Begin work on InputControllerObj
    * Add input controller.
  * 2pm PST - 5pm PST
    * Finished jump functionality. Working on double jump functionality.
    * Continue work on double jump functionality.
    * Complete double jump functionality.

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
    
# Epicodus Capstone Timetracker & Devlog

### Total Time Spent: 101.25 hours (see time log below for more details)

### To-Do List:
  * Create a how-to-play menu.

### Time Log:

* 2024-05-02 - hours total
  * 7:48am PST - 9am PST
    * Created `info-and-how-to` branch and cloned down.
    * Began working on README.
    * Add basic README structure.
  * 9am PST - 9:15am PST
    * Scrum
  * 9:15 - 9:45am PST
    * Typing out an interview question I was asked (as well as my answer) for the benefit of my Epicodus cohort.
  * 9:45am PST - 12:51pm PST
    * Continue working on README.
    * Continue styling README
    * Add links to my other repositories in README
    * Update Controls section and Known Bugs section.
    * Finalize setup/install instructions
    * Add separate LICENSE.txt file.
    * Add logo and render logo in README.
    * Merge `info-and-how-to` branch into `main`. Deleted `info-and-how-to` branch.
    * Updated my Epicodus Capstone Gallery entry.
  * 12:51pm PST - 2:09pm PST
    * Lunch + appointment
  * 2:09pm PST - pm PST
    * Created `enemy-graphic-update` branch and cloned down.
    * Working on converting the square into a triangle ("spike").
    * Enemy renders as a triangle, but is hovering above the track for some reason. Looking into it.
    * Make enemies render in the middle of the audio spike now, not to the right like they were previously.
    * Fixed rendering position. Appears that spawning the enemy on line 188 of `GameRendering.tsx` was also subtracting 50, moving the enemy upwards. Resolved this.
    * Noticed that `globalEnemiesPerLevelDisplay` was not getting set on shorter tracks. Appears that this was because it is in the conditional that reduces large enemy sets. Removed it from this and confirmed it now works for short tracks as well as long ones.
    * Add custom types for png and mp3 files in `vite-env.d.ts`. Noticed that the import statements were now throwing errors about those files being imported despite them not showing errors yesterday. Confirmed that adding custom types fixed the issue and the game still functions.
    * Re-ran ESLint and confirmed that there were no unexpected errors. Did some more looking into the `any` assignment on the `blob` variable declaration but not finding anything apart from one [TypeScript Issue](https://github.com/microsoft/TypeScript/issues/3753) from 2015 that I wasn't able to find a resolution on.
    * Update README.
    * Merge `enemy-graphic-update` branch into `main`. Deleted `enemy-graphic-update` branch.
    * Update topics on GH repo.
    * Created `how-to-play` branch and cloned down.
      * Add `GameInfo.tsx`.
      * Add slice of state to `GameRendering.tsx` for displaying `GameInfo`.
      * Add info button.



* 2024-05-01 - 12.46 hours total
  * 8am PST - 12:06pm PST
    * Created `enemy-upgrade` branch and cloned down.
    * Reviewed ESLint and confirmed that the only error is with the `any` type for blob storage on line 36 of `GameRendering.tsx`, as already known. Will fix this bug later if there is time.
    * Began reviewing enemy spawning code.
    * In `EnemyObj`, refactor `updateMoveSpeed` method to be `moveToLeft` method instead of having the single line of movement code exist in the `requestUpdate` method.
    * Remove `globalEnemySpawnInterval` variable from `GameRendering.tsx`. It is unused. Tested with three different audio tracks and confirmed that the results are still the same.
    * Due to console.logging `globalEnemyTimer`, noted that if the end of the track is reached, this variable is not getting reset if the player restarts the level, leading to inconsistent enemy spawn times between the two versions of the level.
      * Added a line in `resetGame()` to set this back to 0. Testing.
        * This does not resolve the issue. Looking into it.
        * Appears to be due to the enforcement that `globalEnemyTimer` be set to `globalEnemyTimerPausedState` in `checkEnemySpawn()`. 
        * Added a line to set `globalEnemyTimerPausedState` to 0, since this should set globalEnemyTimer to the same. Testing.
        * Confirmed that this works as expected. Committimg change.
    * Also noticed that pausing the game seems to throw off the enemy spawn times. This will likely get addressed in the enemy spawning refactor since the spawn positions seem to be off already.
    * Began testing spawning all enemies from the globalEnemyPositionList to ensure that all enemy positions are consistent on each playthrough, and confirm suspicions that it's just the spawning method acting spontaneously.
      * Interestingly, it seems as though large sections of enemies spawn. The enemy spawn blocks *do* always occur on an actual beat, but it appears that they almost have a "tail" of enemies after that. This would explain why sometimes the enemies spawn in off the beat, since the game *is* spawning in one of the enemies for that sequence, just not necessarily the one on the beat.
      * Confirmed that enemies do spawn consistently between rounds and page reloads. With this information, the only thing that likely needs to be changed is figuring out a way to make sure that an enemy will spawn on the beat every time.
      * Noted that when pausing the game, enemies visually pause, but their movement does not pause, such that when the game is resumed, the enemies are already past the player.
      * Upon playing a different track, noted that the enemies may be delayed by a small period of time, since there was a large spike at the start of the audio, but the enemies appeared after (perhaps the 250ms offset is responsible?).
    * This gives enough evidence for now. Will look into some of these things and start revising.
      * Starting with enemies moving after pause.
        * Console logging the EnemyObj's `moveToLeft()` method shows that the enemy does keep moving while the game is paused, but stops whenever it hits the left canvas side (as expected).
        * In `updateSpawnedEnemies()`, putting the "forEach enemy requestUpdate" loop into an if statement conditional on `globalAudioIsPlaying`. Testing.
        * Enemies still appear to be moving. Wondering if this is due to the forEach loop running even after the pause.
        * Placed the conditional *within* the forEach loop and tested again.
        * Still not working. Moved other if statements (collision checks) outside of the conditional to reduce processing time. Testing again.
        * Still failed. Attempting to console.log `globalAudioIsPlaying` in the loop to see if something is being missed.
        * Appears that it is always returning as true in the brief period that the sprites move after the audio plays. This must be because `updateSpawnedEnemies()` is only called within a conditional loop checking for `globalAudioIsPlaying`, but would've assumed that the timing would be instantaneous. Must just still be processing a few frames of movement in the loop after the audio is paused. Will attempt to make this a requirement in the EnemyObj.
        * Export `globalAudioIsPlaying` from `GameRendering.tsx` and import into `EnemyObj.ts`. Set as a requirement for the position to update.
        * Still not working as expected.
        * `drawLevel` pauses correctly. This appears to be because the rendering is based directly off of globalRenderX, which doesn't update when the game is paused, whereas EnemyObj uses actual position and moveSpeed variables which do calculations using globalRenderX and globalPreviousRenderX, but also rely on other math that will still move the Enemy even if globalRenderX doesn't necessarily update.
        * Wondering if the enemy can be refactored to rely solely on globalRenderX. Something like "this.position.x = globalLevelData.length - globalRenderX" (pseudocode is more for conveying concept of a direct reliance on globalRenderX, unlikely that it would actually work). Looking into this.
        * Realized that the main issue is that the enemy currently doesn't have any knowledge of its surroundings, it is only told to update.
        * Completed first working attempt. It seems that it is not affected by deltaTime at all though, so will work on implementing that.
        * Realizing that the enemy might not need to be the one moving. Instead of moving the enemy through the level, we need to move the level through the enemy (similar to how the player behaves statically). Refactoring.
        * Implementing rudimentary system where player stays at one x position. May be able to pass this in via the x spawn position from `checkEnemySpawn()`.
        * Appears to be working to some extent, but there is an x value that keeps going undefined. Not currently sure which x value it is or why this is happening. 
          * Tested and confirmed that it is not the enemy's `this.position.x` or `this.xPositionOnTrack`. Looks like it may be the call of `globalLevelData[this.xPositionOnTrack].x`, but not sure why this would be undefined.
          * Noted that pausing the game does pause the enemies now though, so this solution should work once the variable issue gets sorted out.
          * Appears that the issue occurs when near the second enemy. Not sure if this is relevant or just coincidence.
          * Appears that with longer songs, more enemies can be spawned before crash. May be exceeding the globalLevelData. 
          * Attempting to just use `this.xPositionOnTrack` for the calculation instead of `globalLevelData[this.xPositionOnTrack].x` since this may have been redundant. Testing.
          * This works for first sample track! Testing with others to ensure it works consistently.
          * Confirmed it works across several different tracks.
          * Sucessfully added delta time. Interestingly, this was very close to my original prediction for the formula stated above.
        * Cleaning up code.
        * Tested game again and confirmed it still works as expected.
      * Removed some exports from `GameRendering.tsx` that are no longer needed and kept them locally scoped.
      * Completed removed `globalPreviousRenderX` since calculating moveSpeed was the only thing it was doing for the enemy, which isn't relevant anymore.
        * Noted that the player gets a point for the enemy regardless of whether or not the player was hit by the enemy. Will also need to determine if enemy timer should still be used. Thinking probably not, but will need to test more.
  * 12:06pm PST - 1:10pm PST
    * Lunch
  * 1:10pm PST - 6:48pm PST
    * Will first work on resolving enemy scoring as mentioned above.
    * Running into some issues determining what exactly is causing the scoring inconsistency.
      * After breaking down the code more, realized that the issue is actually just due to the fact that the game is spawning multiple enemies for each position. Will turn globalEnemySpawnedList into a Set instead using the unique id.
      * Even after converting to a Set, duplicate objects can be added. 
      * Did some research. Appears that object uniqueness is not checked for in Sets.
      * Attempting to JSON.stringify() each enemy.
      * This stringified properly, but the objects did not seem to retain that they are objects. Kept getting errors such as `parsedEnemy.requestUpdate is not a function`.
      * May try to make an instance set in the EnemyObj instead and manage set updates there.
      * Instance list did not work as expected, since each enemy would've had to carry the list based on how class is set up. 
      * Working on filtering objects out of array based on unique object properties.
      * It appears that there are still two of the same object at any given time, and that one reappears in the globalEnemySpawnedList even after one dies.
      * This may be due to how often `checkEnemySpawn` is called. This was originally meant to check at each globalRenderX change, but this may not be necessary anymore given that spawning is handled differently now. Going to attempt to make a secondary function that preloads all enemies and will see how this goes.
      * Secondary function works much better. Only issue now is that it is all IDs are unique because they are generated at the same time. However, now that all x positions are unique, we can add the x positions to the globalScoreSet instead.
      * Changing globalScoreSet to accept numbers resolves the issue and score increments as expected now.
      * Tweaking the amount of enemies spawned in large datasets. 
      * Added a `reduceEnemiesByNThousand()` method that gets called as part of the `preLoadEnemies()` method for sets larger than 10000 and 5000 respectively.
      * Also added a check for 2000.
      * Everything appears to be functioning now.
    * Noted that on some tracks, large clusters of enemies can lead to some difficulty jumping over them without getting hit. A few thoughts on how to fix this:
      * Do a check in pre-rendering to see if there are any x positions that are close to each other (this would likely be a long loop which isn't optimal -- foreach xPos, check the next xPos after it, if they are within close range to each other, remove the second one).
      * Increase player health in relation to number of enemies spawned (maybe set lives to 5% of total enemies, minimum of 3).
      * Add power-ups to restore health
      * Make invincibility last longer
    * Testing adjusting the gravity instead so that player falls back faster which makes for better precision jumping.
    * Fix bug where enemies do not spawn on Retry Track. `resetGame()` now clears `globalEnemySpawnedList` and then runs `preLoadEnemies()` again.
    * Noted that `globalGravity` export is only used in one line of code in `PlayerObj`. Moved variable there instead since no other part of the game is likely ever going to deal with gravity globally.
    * Gravity of 2 is too much and barely playable. Gravity of .8 was the old default and is fine for levels with less enemies, but it makes precision jumps difficult. 1.5 seems workable but will keep testing. 1.3 feels better and is less heavy. 1.1 is too weightless.
    * Determined that 1.3 feels right.
    * Will look into changing the way that the audio track is generated. Curious if there's a way to get only the "beats" out of the audio file.
    * Still researching beat analysis methods.
    * Not finding many good ways to go about this. Will look into it more later.
  * 8:48pm PST - 11:32pm PST
    * Ensure all variables are statically typed except for `blob`.
    * Continue working on making enemy spacing fair.
    * Determined that I could add a new method in the position generator (`createLevelData`) that declares a `lastEnemyXpos` variable, then only allows enemies to be added if their x position value is greater than that `lastEnemyXPos` plus a predetermined integer. If true, the `lastEnemyXPos` will update, ensuring that the enemies are spaced out evenly.
      * Tested this and it appears to be working as desired. Tweaking it now.
      * Added text to HUD for total possible points per level.
      * Works very well for some tracks and just okay for others (still a few too many enemies that make it difficult for jumping over).
      * Will attempt to adjust by length of audio track. The best track so far has 40 enemies for ~2 minutes. Will see if the number can be scaled and still work well.
        * Working on adding this functionality. Should be able to use `Math.ceil()` against the duration of the audio. Something like `const desiredAmount = Math.ceil(globalAudioBuffer.duration/50) * 20`, as this should return 40 in the case of the ~2 minute track.
        * Appears desired formula is actually slightly different, but basically the same: `const maxEnemyLimit: number = Math.ceil((globalAudioBuffer.duration/50) * 20);`.
        * Working on enemy reducer for iterator. Not sure what this number should be. Initially trying `const enemyReducer: number = maxEnemyLimit / globalEnemySpawnedList.length;` but this always ends up being a decimal less than 1. Need to determine if this should be something else.
        * After some more research, it appears that this was close but should actually be `const enemyReducer: number = globalEnemySpawnedList.length / maxEnemyLimit;`, as this returns a decimal greater than 1. Can use `Math.round` on this to convert it to a larger number.
          * Also changed `maxEnemyLimit` to use `Math.round` instead of `Math.ceil`.
        * Got the reducer working. Noted that upon playing the adjusted levels, they feel a bit boring because each jump is spaced out relatively evenly (due to removing 1 enemy every N point in the array). May need to do the mass bulk thousands-place reducers first, then worry about the limit after that.
        * Running the thousands-reducers first is not fixing the issue. Attempting to increase the `maxEnemyLimit` from 20 enemies per section to 30. This did not work as desired, longer songs still feel boring.
        * Ended up increasing the `lastEnemyXPos` checker to be 400 instead of 300, which seemed to do a lot for making the jumps manageable without instantly becoming too easy. Temporarily disabled the `maxEnemyLimit` entirely to test and confirmed that it is a pretty good amount. Longer tracks are still *slightly* too difficult, but nowhere near what they used to be, and could easily be fixed by adding a few more lives or similar easy fix.
        * Set `maxEnemyLimit` up to 75 enemies per section to reduce as few as possible.
        * Added a random remover so that the removals aren't periodic.
        * Changed removal function to not be random in order to maintain consistency in experience between players. Confirmed via playthrough that the game is challenging but playable, as desired.
    * Add new variable `globalEnemiesPerLevelDisplay` that will render the total number of enemies in the level (for use in the HUD, since the previous variable was incorrect after reductions).
    * Clean up code.
      * Ran ESLint and found that `globalEnemyTimer` is no longer being used. Removed it and the timeout that it was attached to.
    * Merge `enemy-upgrade` branch into `main`. Delete `enemy-upgrade` branch.
      

* 2024-04-30 - 11.48 hours total
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
  * 1:07pm PST - 6:39pm PST
    * Continue working on finding spritesheet for player and enemy
      * Attempted to develop my own spritesheet but determined that this might take too much time.
      * Started looking through https://craftpix.net/.
      * Also exploring https://itch.io/game-assets/free
      * Also exploring https://kenney.nl/assets
      * Also exploring https://opengameart.org/
    * Decided on using spritesheet from https://0x72.itch.io/16x16-robot-tileset.
    * Begin learning how to animate a spritesheet.
    * Working on determining which coordinates of the spritesheet needs to be targeted for each animation set.
    * Working on scaling up sprites to be 50x50px since they are currently smaller.
    * After scaling sprite sheet, working on rendering frames of animation.
    * Animation is not quite working as expected. Appears to be grabbing some data from the next frame in addition to the current frame, and also rendering a 0 frame.
    * Add working sprite animation for player.
    * Continue animating player after win condition is met so that it appears player is running off-screen.
    * Testing adjusting the visual offset to see if it makes the user experience better.
      * Removing the offset entirely makes the beat hit at the left side of the screen.
      * Somewhere in the 200 to 300 range makes the beat hit roughly at the player. Trying to find a more precise song to test with.
      * Somewhere around 700 makes the beat hit near the right side of the screen, as if the played beat is spawning out of the side of the screen.
    * Determined that offset should be set to 250ms in order for the sprite to line up with when the beat hits (200px position + 50px sprite width). Tested in multiple songs and confirmed this amount works well.
    * The offset appears to cause a little bit of the track to be left rendered on the win condition that does not go away. Trying to determine how to get rid of this.
      * Appears that globalRenderX stops incrementing for an unknown reason. Looking into this.
      * Appears to stop incrementing if increase is lower than 250 for an unknown reason. Likely has to do with offset. Setting increase to 250 resolves the issue. 
    * Finalize player running off screen.
  * 8:15pm PST - 10:07pm PST
    * Looking into adding a restart button.
    * Successfully add a "Retry Track" option at the end of level either due to win or loss.
    * Noticed some bugs with Retry Track where HUD keeps rendering regardless of scores being reset.
      * Putting the `resetGame` method in a timeout for 500ms resolves the issue.
    * Add reset method to player object.
    * Make player object's sprite animations smooth using the deltaTimeMultiplier.
    * Create custom page icon and add to index.html. Change page title.
    * For tomorrow, to ensure project is polished before adding stretch goal features:
      * Will work on modifying the enemy to ensure consistency in spawning. It seems to be better since the timer has been adjusted, but it's still not entirely consistent, and sometimes the enemy does not generate on the audio spikes. 
      * Will potentially find sprite or texture for enemy.
      * Will create a how-to-play menu.
      * Will update README.
      * Re-run ESLint.
    * Merged `graphics-upgrade` branch into `main` and deleted `graphics-upgrade` branch.



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
    
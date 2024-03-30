# Welcome to Pseudocode.md

### The purpose of this document is to write overall functionality for the game in pseudocode so that it can be easily referenced when writing actual code. Each set of code will be broken up by section. JavaScript is assumed.


### MusicAnalyzer
  
  * Objectives:
    - get frames of songs? -- these might not need to be gathered all at once, but it is possible that we will need to establish highs and lows of the song so that code can know what to consider a "high" on a quiet song or a "low" on a loud song (`this.musicMaxHeight` & `this.musicMinHeight`)
    - get bpm / tempo of song (`this.musicTempo`)
    - get length of song (`this.musicLength`)

  ```javascript
  
  ```

### LevelGen
  
  - Get audio data from MusicAnalyzer. 
  - create a canvas and get width and height (will probably just make these a little square for the beginning so that fitting on a modern display is guaranteed)
  - initiailize an empty array to hold level complications (`this.levelComplications`)
  - for each sample in MusicAnalyzer (`MusicAnalyzer.musicLength`) and for the length of the canvas, do:
    - get data from the MusicAnalyzer audio frame
    - // do something with height here. If nothing else, make sure that the sample is mapped relatively to the height of the canvas. Realisticly, we want to make sure that it's mapped much lower so that it doesn't create an insurmountable spike.
    - once data is properly manipulated, push it to `this.levelComplications`. 
      - // may need to push x and y values separately as keyvalue pair.... not sure yet. If so, `x = iterator / MusicAnalyzer.musicLength.count * canvasWidth` and MAYBE `y = canvasHeight - audiotrackheight` (again, need to nail down exactly how high audio should be)
  
  - This should fully generate the `levelComplications` array. These for now could be represented as red spikes that must be jumped over. Can do fancier things later if time allows.
  
    
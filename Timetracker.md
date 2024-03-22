# Epicodus Capstone Planning Log

### Thoughts:
* ~~Python has [pygame](https://www.pygame.org/news) framework.~~ Will use JavaScript.
* How to convert audio to jsonified format. Python? This would likely result in an upload API call though, which isn't desired.


### Time Log:
* 2024-03-22
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

  * 9:11am PST - am PST --- Researching Audio JSON-ifier
    * Looking into [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) as it has an analyze method that seems to be [used for this purpose](https://stackoverflow.com/questions/62408542/how-to-export-an-audio-file-byte-frequency-data-to-a-json-object).
    * Located [Python-based approach](https://stackoverflow.com/questions/61952022/creating-a-json-with-information-about-audio-file) as well.
    * Located https://webaudioapi.com/samples/. Began experimenting with examples.
      * [This example](https://webaudioapi.com/samples/visualizer/) gives me one of the main things I need for the game -- visualizer.
      * MDN has some [useful tutorials](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API).
      * Also found a good list of resources on [this Reddit post](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API).
      
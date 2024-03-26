# Project Proposal Template
From the [Epicodus capstone proposal prompt](https://full-time.learnhowtoprogram.com/capstone/capstone-week-2/capstones---sign-ups-and-proposal).

### Name of Student: Aaron Mejia

### Name of Project: RhythmRunner

### Project's Purpose or Goal: *(What will it do for users?)*
This application will allow users to play a platformer level that is synchronized to a song of their choosing.


#### List the absolute minimum features the project requires to meet this purpose or goal:
  * User must be able to specify the song being played (this will be through local file upload initially)
  * Users must be able to play a fully-functional platforming level with a defined start and end.
  * The level will autoscroll to the tempo of the song and obstacles will appear based on frequencies in the song.

#### What tools, frameworks, libraries, APIs, modules and/or other resources (whatever is specific to your track, and your language) will you use to create this MVP? List them all here. Be specific.

The game will be written in pure JavaScript. No additional frameworks will be used.
  * [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
  * [JavaScript](https://www.javascript.com/)
    * [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
  * [Visual Studio Code](https://code.visualstudio.com/)

#### If you finish developing the minimum viable product (MVP) with time to spare, what will you work on next? Describe these features here: Be specific.
  * Convert to a webpack application (preferably React).
  * Authentication
    * Leaderboards for fastest completion.
    * Sharing of levels (not the audio, just the raw data used to generate the level).
  * Integration with a third-party music service.
  * Host on my website and/or Netlify.


#### What additional tools, frameworks, libraries, APIs, or other resources will these additional features require?
  * Convert to a webpack application
    * [React](https://react.dev/)
  * Authentication
    * [Google Firebase](https://firebase.google.com/) (user accounts)
    * [Cloud Firestore](https://firebase.google.com/docs/firestore) (user data storage/sharing)
  * Integration with a third-party music service
    * [Apple MusicKit for Web](https://js-cdn.music.apple.com/musickit/v3/docs/index.html?path=/story/introduction--page) (in a shocking turn of events, Apple seems to be the most developer-friendly for the purposes of gamemaking)
    * [LibreSpot](https://github.com/librespot-org/librespot) (open-source Spotify player that can be used for games)
    * [SoundCloud](https://developers.soundcloud.com/docs/api/guide)
  * Host on my website and/or Netlify.
    * [Netlify](https://www.netlify.com/)


#### Is there anything else you'd like your instructor to know?
  * You are cool 😎
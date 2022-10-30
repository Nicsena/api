# API

API for [nicsena.tk](nicsena.tk) and my personal website.

**Note:** This is in an early development stage.


## API Endpoints

The API will be available soon.

**Public Endpoints:**

- `/` -
- `/spotify/played` - Get recently played song from Spotify.
- `/spotify/playing` - Get current song that is being played from Spotify.

**Testing Endpoints:**
These endpoints work only when the environment variable `NODE_ENV` is set to `development`.

- `/testing/:key` - To test the `key` param (environment variable `PASSWORD`).
- `/testing/:key/variables` - See list of variables.
- `/testing/:key/Spotify/GetRecentlyPlayed` - Get recently played song from Spotify.
- `/testing/:key/Spotify/GetCurrentPlaying` - Get current song that is being played from Spotify.

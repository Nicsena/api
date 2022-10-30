# API

API for [nicsena.tk](nicsena.tk) and my personal website.

**Note:** This is in an early development stage.


## API Endpoints

The API will be available soon.

**Public Endpoints:**

- `/` -
- `/spotify` - Get recently played song from Spotify. I don't know that this is going to get my spotify account banned or not.

**Testing Endpoints:**
These endpoints work only when the environment variable `NODE_ENV` is set to `development`.

- `/testing/:key` - To test the `key` param (environment variable `PASSWORD`).
- `/testing/:key/variables` - See list of variables.
- `/testing/:key/Spotify/GetRecentlyPlayed` - Get recently played song from Spotify.

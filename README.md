# API

API for [nicsena.tk](nicsena.tk) and my personal website.

**Note:** This is in an early development stage.

## API Endpoints

The API will be available soon.

**Public Endpoints:**

- `/` -
- `/ping` - Pong!
- `/health` - API Health - uptime, cpu load, etc. 
- `/spotify/played` - Get recently played song from Spotify.
- `/spotify/playing` - Get current song that is being played from Spotify.
- `/dashboard` - Web Dashboard. This requires authorization and only can be used by Nicsena.

**Testing Endpoints:**
These endpoints work only when the environment variable `NODE_ENV` is set to `development`.

- `/testing/auth` - Test `Authorization` header with Bearer Token. The Token is the environment variable `PASSWORD`. 
- `/testing/:key` - Test the `key` param (environment variable `PASSWORD`).
- `/testing/:key/variables` - List of variables.
- `/testing/:key/Spotify/GetRecentlyPlayed` - Get recently played song from Spotify.
- `/testing/:key/Spotify/GetCurrentPlaying` - Get current song that is being played from Spotify.

**Nicsena-Only Endpoints:**
These endpoints are only accessible by Nicsena.
- `/private/auth` - Authorization endpoint for the dashboard.

## Routes

Routes for endpoints are located in `/routes/`.

- `/routes/spotify.js` - Route for Spotify endpoints.
- `/routes/testing.js` - Route for Testing endponts. Testing endpoints only work when the environment variable `NODE_ENV` is set to `development`.
- `/routes/private.js` - Rotue for Private endpoints. Private endpoints require `Authorization` header to use.

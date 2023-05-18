const fetch = require("node-fetch")
const querystring = require("querystring")

const env = process.env;

// ==== Spotify ====
var SpotifyClientID = env.SPOTIFY_CLIENT_ID
var SpotifyClientSecret = env.SPOTIFY_CLIENT_SECRET
var SpotifyRefreshToken = env.SPOTIFY_REFRESH_TOKEN

var SpotifyAPI = `https://api.spotify.com/v1`
var SpotifyTokenURL = `https://accounts.spotify.com/api/token`

var RecentlyPlayedURL = `${SpotifyAPI}/me/player/recently-played`
var CurrentPlayingURL = `${SpotifyAPI}/me/player/currently-playing`

var basicAuth = Buffer.from(`${SpotifyClientID}:${SpotifyClientSecret}`).toString('base64')
// ==================


// ========= Spotify Access Token =========
async function getAccessToken() {

    const response = await fetch(SpotifyTokenURL, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + (basicAuth),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: SpotifyRefreshToken
      }),
    })
  
    var result = await response.json();
    return result["access_token"];
  
}



// ========= Spotify Recently Played =========
async function getRecentlyPlayed() {
    const AccessToken = await getAccessToken()
      
      const response = await fetch(`${RecentlyPlayedURL}?limit=1`, {
        headers: {
          Authorization: `Bearer ${AccessToken}`
        },
      })
    
      const result = await response
      
      if(result["status"] === 200) {
        return result.json();
      }
      
      if(result["status"] === 400) {
       return { status: 400, message: "Spotify API - Bad Request"}
      }

      if(result["status"] === 401) {
        return { status: 401, message: "Spotify API - Unauthorized"}
       }
      
      if(result["status"] === 429) {
       return { status: 429, message: "Spotify API - Rate Limit"}
      }
        
};



// ========= Spotify Currently Playing =========
async function getCurrentPlaying() {

    const AccessToken = await getAccessToken()
      
    const response = await fetch(CurrentPlayingURL, {
        headers: {
          Authorization: `Bearer ${AccessToken}`
        },
    });
      
      const result = await response
      var body = result.json();

      console.log(await body)
    
      if(result["status"] === 200) {
        return body
      }
      
      if(result["status"] === 204) {
       return { status: 204, message: "Nothing is currently playing."}
      }
      
      if(result["status"] === 401) {
       return { status: 401, message: "Spotify API - Unauthorized"}
      }
      
      if(result["status"] === 429) {
       return { status: 429, message: "Spotify API - Rate Limit"}
      }
      
    }





module.exports = {
    AccessToken: getAccessToken,
    RecentlyPlayed: getRecentlyPlayed,
    CurrentPlaying: getCurrentPlaying
}
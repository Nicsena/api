const fetch = require("node-fetch")
const querystring = require("querystring")

const env = process.env;

// ==== Spotify ====
var SpotifyUserID = env.SPOTIFY_USER_ID
var SpotifyClientID = env.SPOTIFY_CLIENT_ID
var SpotifyClientSecret = env.SPOTIFY_CLIENT_SECRET
var SpotifyRefreshToken = env.SPOTIFY_REFRESH_TOKEN

var SpotifyAPI = `https://api.spotify.com/v1`
var SpotifyTokenURL = `https://accounts.spotify.com/api/token`
var SpotifyMeURL = `${SpotifyAPI}/me/`

var RecentlyPlayedURL = `${SpotifyAPI}/me/player/recently-played`
var CurrentPlayingURL = `${SpotifyAPI}/me/player/currently-playing`
var QueueURL = `${SpotifyAPI}/me/player/queue`

var basicAuth = Buffer.from(`${SpotifyClientID}:${SpotifyClientSecret}`).toString('base64')
// ==================



// ========= Spotify Callback - Tokens =========
async function callbackGetTokens(code, uri) {

  const response = await fetch(SpotifyTokenURL, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + (basicAuth),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: querystring.stringify({
      code: code,
      redirect_uri: uri,
      grant_type: 'authorization_code'
    }),
  })

  var result = await response
  var body = await result.json();

  if(result["status"] === 200) {
    
    // User ID Check
    var userInfo = await getUserInfo(body["access_token"])

    if(SpotifyUserID && userInfo.id !== SpotifyUserID ) return "Incorrect User ID";

    if(SpotifyUserID) {
      if(!SpotifyRefreshToken) {
        console.log(`\nPut this in .env\nSPOTIFY_REFRESH_TOKEN=${body["refresh_token"]}\n`);
      } else {
        console.log(`\nYou are all set!\n`)
      }
    }

    if(!SpotifyUserID) {
      console.log(`\nPut these in .env\nSPOTIFY_USER_ID=${userInfo["id"]}\nSPOTIFY_REFRESH_TOKEN=${body["refresh_token"]}\n`);
    }

    return { refresh_token: body["refresh_token"], scope: body["scope"], user: { id: userInfo["id"] } };

  }
  
  if(result["status"] === 400) {
   return { status: 400, message: "Spotify API - Bad Request", response: body }
  }

  if(result["status"] === 401) {
    return { status: 401, message: "Spotify API - Unauthorized", response: body}
   }

   if(result["status"] === 403) {
    return { status: 403, message: "Spotify API - Forbidden", response: body}
   }
  
  if(result["status"] === 429) {
   return { status: 429, message: "Spotify API - Rate Limit", response: body}
  }

  
}

// ========= Spotify User Info =========
async function getUserInfo(token) {
      
  const response = await fetch(`${SpotifyMeURL}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  })

  var result = await response
  var body = await result.json();

  if(result["status"] === 200) {
    return body
  }
  
  if(result["status"] === 400) {
   return { status: 400, message: "Spotify API - User - Bad Request", response: body }
  }

  if(result["status"] === 401) {
    return { status: 401, message: "Spotify API - Unauthorized", response: body }
   }

   if(result["status"] === 403) {
    return { status: 403, message: "Spotify API - Forbidden", response: body }
   }
  
  if(result["status"] === 429) {
   return { status: 429, message: "Spotify API - Rate Limit", response: body }
  }

  
}


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
  
    var result = await response
    var body = await result.json()
    
    return body["access_token"];
  
}



// ========= Spotify Recently Played =========
async function getRecentlyPlayed() {
    const AccessToken = await getAccessToken()
      
      const response = await fetch(`${RecentlyPlayedURL}?limit=5`, {
        headers: {
          Authorization: `Bearer ${AccessToken}`
        },
      })
    
      const result = await response
      var body = await result.json();
      
      if(result["status"] === 200) {
        return body
      }
      
      if(result["status"] === 400) {
       return { status: 400, message: "Spotify API - Bad Request", response: body}
      }

      if(result["status"] === 401) {
        return { status: 401, message: "Spotify API - Unauthorized", response: body}
       }

       if(result["status"] === 403) {
        return { status: 403, message: "Spotify API - Forbidden", response: body}
       }
      
      if(result["status"] === 429) {
       return { status: 429, message: "Spotify API - Rate Limit", response: body}
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
      var body = await result.json();
    
      if(result["status"] === 200) {
        return body
      }
      
      if(result["status"] === 204) {
       return { status: 204, message: "Nothing is currently playing."}
      }

      if(result["status"] === 400) {
        return { status: 400, message: "Spotify API - Bad Request", response: body}
       }
      
      if(result["status"] === 401) {
       return { status: 401, message: "Spotify API - Unauthorized", response: body}
      }

      if(result["status"] === 403) {
        return { status: 403, message: "Spotify API - Forbidden", response: body}
       }
      
      if(result["status"] === 429) {
       return { status: 429, message: "Spotify API - Rate Limit", response: body}
      }
      
};


// ========= Spotify Queue =========
// NOTE: This is untested since the spotify queue endpoint
// has been returning a forbidden (403) error for
// whatever reason for me.

async function getQueue() {
  const AccessToken = await getAccessToken()
    
    const response = await fetch(`${QueueURL}`, {
      headers: {
        Authorization: `Bearer ${AccessToken}`
      },
    })
  
    const result = await response
    var body = await result.json();
    
    if(result["status"] === 200) {
      return body["queue"]
    }
    
    if(result["status"] === 400) {
     return { status: 400, message: "Spotify API - Bad Request", response: body}
    }

    if(result["status"] === 401) {
      return { status: 401, message: "Spotify API - Unauthorized", response: body}
     }
    
     if(result["status"] === 403) {
      return { status: 403, message: "Spotify API - Forbidden", response: body}
     }

    if(result["status"] === 429) {
     return { status: 429, message: "Spotify API - Rate Limit", response: body}
    }
      
};





module.exports = {
    GetTokens: callbackGetTokens,
    getUserInfo: getUserInfo,
    AccessToken: getAccessToken,
    RecentlyPlayed: getRecentlyPlayed,
    CurrentPlaying: getCurrentPlaying,
    CurrentQueue: getQueue
}
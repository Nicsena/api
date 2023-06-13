const express = require("express");
const router = express.Router();
const querystring = require("querystring")
var { GetTokens, getUserInfo, AccessToken, RecentlyPlayed, CurrentPlaying, CurrentQueue } = require("./../src/spotify")
var { simplifiedMilliseconds, generateRandomString } = require("./../src/utility")

const env = process.env
var SpotifyUserID = env.SPOTIFY_USER_ID
var SpotifyClientID = env.SPOTIFY_CLIENT_ID
var SpotifyClientSecret = env.SPOTIFY_CLIENT_SECRET
var SpotifyRefreshToken = env.SPOTIFY_REFRESH_TOKEN

// TODO - Add caching for spotify endpoints. 

router.all("*", async (req, res, next) => {
  var path = req.path

    if(!SpotifyUserID || !SpotifyClientSecret || !SpotifyRefreshToken || !SpotifyClientID) {

      if(path === "/login" || path === "/callback") {
        if(!SpotifyClientID || !SpotifyClientSecret) {
          return res.status(400).json({ status: 400, message: "If you are going to login and get callback - Please set the environment variables: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET"});
        } else {
          return next();
        }
      } 

      return res.status(400).json({ status: 400, message: "Please set the environment variables: SPOTIFY_USER_ID, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN"});
    };

    if(SpotifyUserID || SpotifyClientSecret || SpotifyRefreshToken || SpotifyClientID) return next();

});

router.get("/", (res, req) => {
    req.status(200).json({ message: "Spotify Route" });
});



// ========= Login =========
router.get('/login', function(req, res) {


    var state = generateRandomString(16);
    var scope = 'user-read-recently-played user-read-currently-playing user-read-playback-state user-read-email user-top-read user-follow-read user-read-private';
    var uri = `${req.protocol}://${req.get('host')}/spotify/callback`

    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: SpotifyClientID,
        scope: scope,
        redirect_uri: uri,
        state: state
      }));

});



// ========= Callback =========
router.get("/callback", async(req, res) => {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var uri = `${req.protocol}://${req.get('host')}/spotify/callback`

  if(state === null) {
    return res.status(400).json({
      message: "Mismatched State"
    });
  };

  if(code === null) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  };

  var callbackResult = await GetTokens(code, uri);

  if(callbackResult === "Incorrect User ID") {
    return res.status(401).json({
      message: "Unauthorized - Incorrect User ID"
    });
  }

  return res.status(200).json(callbackResult);

})




// ========= Played =========
router.get("/played", async (req, res) => {
    var result = await RecentlyPlayed()
    var json = result;
  
    if(!result || !json) {
      console.log(`Result: ${result}\nJSON: ${json}`)
      return res.status(500).json({
        message: "An Internal Server Error has occurred!",
        code: "PLAYED_SONG_IS_RETURNING_UNDEFINED"
      })
    }

        // If the Spotify API returns 400 - Bad Request.
        if (result["status"] == 400) {
            json = {
              message: result["message"],
              response: result["response"]
            };
        
            return res.status(400).json(json);
          }

    // If the Spotify API returns 401 - Unauthorized.
    if (result["status"] == 401) {
        json = {
          message: result["message"],
          response: result["response"]
        };
    
        return res.status(401).json(json);
      }

      // If the Spotify API returns 403 - Forbidden
      if (result["status"] == 403) {
        json = {
          message: result["message"],
          response: result["response"]
        };
    
        return res.status(403).json(json);
      }
  
    // If the Spotify API returns 429 - Rate Limit.
    if (result["status"] == 429) {
      json = {
        message: result["message"],
        response: result["response"]
      };
  
      return res.status(429).json(json);
    }

  
    // If the Spotify API retuns 200 - OK.
    let playedSongs = []
    json["items"].forEach(s => {
      playedSongs.push({
        song: s["track"]["name"],
        artist: s["track"]["artists"][0]["name"],
        played: new Date(s["played_at"]).toLocaleString(),
      });
    })
  
    return res.status(200).json(playedSongs);

});



// ========= Playing =========
router.get("/playing", async (req, res) => {
    
      var currentSongPlaying = await CurrentPlaying();

      if(!currentSongPlaying) {
        console.log(currentSongPlaying)
        return res.status(500).json({
          message: "An Internal Server Error has occurred!",
          code: "CURRENT_PLAYING_SONG_IS_RETURNING_UNDEFINED"
        })
      }
    
      if (currentSongPlaying["status"] == 204) {
        return res.status(200).json({
          message: "Nothing is currently playing on Spotify.",
        });
      }

      if (currentSongPlaying["status"] == 400) {
        return res.status(400).json({
          message: currentSongPlaying["message"],
          response: currentSongPlaying["response"]
        });
      }
    
      if (currentSongPlaying["status"] == 401) {
        return res.status(500).json({
          message: currentSongPlaying["message"],
          response: currentSongPlaying["response"]
        });
      }

      if (currentSongPlaying["status"] == 403) {
        return res.status(403).json({
          message: currentSongPlaying["message"],
          response: currentSongPlaying["response"]
        });
      }
    
      if (currentSongPlaying["status"] == 429) {
        return res.status(429).json({
          message: currentSongPlaying["message"],
          response: currentSongPlaying["response"]
        });
      }
    
      // If a Ad was playing.
      if (currentSongPlaying["currently_playing_type"] == "ad") {
        var startedtime = new Date(currentSongPlaying["timestamp"]).toLocaleString();
        var currentprogress = simplifiedMilliseconds(
          currentSongPlaying["progress_ms"]
        );
        var type = currentSongPlaying["currently_playing_type"];
        var playing = currentSongPlaying["is_playing"];
    
        return res.status(200).json({
          startedplaying: startedtime,
          current: currentprogress,
          type: type,
          playing: playing,
        });
      }
    
      // If a Song was playing
      var artist = currentSongPlaying["item"]["artists"][0]["name"];
      var song = currentSongPlaying["item"]["name"];
      var songurl = currentSongPlaying["item"]["external_urls"]["spotify"]
      var startedtime = new Date(currentSongPlaying["timestamp"]).toLocaleString();
      var currentprogress = simplifiedMilliseconds(
        currentSongPlaying["progress_ms"]
      );
      var duration = simplifiedMilliseconds(
        currentSongPlaying["item"]["duration_ms"]
      );
      var local = currentSongPlaying["item"]["is_local"];
      var explicit = currentSongPlaying["item"]["explicit"];
      var type = currentSongPlaying["currently_playing_type"];
      var playing = currentSongPlaying["is_playing"];
      var repeatState = currentSongPlaying["repeat_state"];
      var shuffleState = currentSongPlaying["shuffle_state"]
      var image = currentSongPlaying["item"]["album"]["images"][0]["url"]
    
      const json = {
        song: song,
        artist: artist,
        startedplaying: startedtime,
        current: currentprogress,
        duration: duration,
        type: type,
        repeat: repeatState,
        shuffle: shuffleState,
        explicit: explicit,
        local: local,
        playing: playing,
        url: songurl,
        image: image,
      };

      return res.status(200).json(json);
      
    });


// ========= Queue =========
// NOTE: This is untested since the spotify queue endpoint
// has been returning a forbidden (403) error for
// whatever reason for me.

router.get("/queue", async (req, res) => {

  var currentQueue = await CurrentQueue();

  if(!currentQueue) {
    console.log(currentQueue)
    return res.status(500).json({
      message: "An Internal Server Error has occurred!",
      code: "QUEUE_IS_RETURNING_UNDEFINED"
    })
  }
    
  if (currentQueue["status"] == 204) {
    return res.status(200).json({
      message: "Nothing is in the queue on Spotify.",
    });
  }

  if (currentQueue["status"] == 400) {
    return res.status(400).json({
      message: currentQueue["message"],
      response: currentQueue["response"]
    });
  }

  if (currentQueue["status"] == 401) {
    return res.status(500).json({
      message: currentQueue["message"],
      response: currentQueue["response"]
    });
  }

  if (currentQueue["status"] == 403) {
    return res.status(403).json({
      message: currentQueue["message"],
      response: currentQueue["response"]
    });
  }

  if (currentQueue["status"] == 429) {
    return res.status(429).json({
      message: currentQueue["message"],
      response: currentQueue["response"]
    });
  }

  return res.status(200).json(currentQueue["queue"])
  

});



module.exports = router


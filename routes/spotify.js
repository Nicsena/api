const express = require("express");
const router = express.Router();
var { AccessToken, RecentlyPlayed, CurrentPlaying } = require("./../src/spotify")
var { simplifiedMilliseconds } = require("./../src/utility")

// TODO - Add caching for spotify endpoints. 

router.all("/", async (req, res, next) => {

    if(!SpotifyClientID || !SpotifyClientSecret || !SpotifyRefreshToken) return res.status(400).json({ status: 400, message: "Please set the environment variables: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECERT, SPOTIFY_REFRESH_TOKEN"});
    if(SpotifyClientID || SpotifyClientSecret || SpotifyRefreshToken) return next();

});

router.get("/", (res, req) => {
    req.status(200).json({ message: "Spotify Route" });
});



// Played
router.get("/played", async (req, res) => {
    var result = await RecentlyPlayed()
    var json = result;
  

        // If the Spotify API returns 400 - Bad Request.
        if (result["status"] == 400) {
            json = {
              message: result["message"],
            };
        
            return res.status(400).json(json);
          }

    // If the Spotify API returns 401 - Unauthorized.
    if (result["status"] == 401) {
        json = {
          message: result["message"],
        };
    
        return res.status(401).json(json);
      }
  
    // If the Spotify API returns 429 - Rate Limit.
    if (result["status"] == 429) {
      json = {
        message: result["message"],
      };
  
      return res.status(429).json(json);
    }
  
    // If the Spotify API retuns 200 - OK.
    var item = json["items"][0];
    var artist = item["track"]["artists"][0]["name"];
    var song = item["track"]["name"];
    var played = new Date(item["played_at"]).toLocaleString();
  
    res.status(200).json({
      song: song,
      artist: artist,
      played: played,
    });

});



// Playing
router.get("/playing", async (req, res) => {
    
      var currentSongPlaying = await CurrentPlaying();
    
      if (currentSongPlaying["status"] == 204) {
        return res.status(200).json({
          message: "Nothing is currently playing on Spotify.",
        });
      }

      if (currentSongPlaying["status"] == 400) {
        return res.status(400).json({
          message: currentSongPlaying["message"],
        });
      }
    
      if (currentSongPlaying["status"] == 401) {
        return res.status(500).json({
          message: currentSongPlaying["message"],
        });
      }
    
      if (currentSongPlaying["status"] == 429) {
        return res.status(429).json({
          message: currentSongPlaying["message"],
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
      var image = currentSongPlaying["item"]["album"]["images"][0]["url"]
    
      const json = {
        song: song,
        artist: artist,
        startedplaying: startedtime,
        current: currentprogress,
        duration: duration,
        type: type,
        explicit: explicit,
        local: local,
        playing: playing,
        url: songurl,
        image: image
      };

      return res.status(200).json(json);
      
    });




module.exports = router


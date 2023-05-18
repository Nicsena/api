const express = require("express");
const router = express.Router();

const env = process.env;
var SpotifyClientID = env.SPOTIFY_CLIENT_ID
var SpotifyClientSecret = env.SPOTIFY_CLIENT_SECRET
var SpotifyRefreshToken = env.SPOTIFY_REFRESH_TOKEN

// TODO - Spotify - User's Currently Playing and Recently Played

router.all("/", async (req, res, next) => {

    if(!SpotifyClientID || !SpotifyClientSecret || !SpotifyRefreshToken) return res.status(400).json({ status: 400, message: "Please set the environment variables: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECERT, SPOTIFY_REFRESH_TOKEN"});
    if(SpotifyClientID || SpotifyClientSecret || SpotifyRefreshToken) return next();

});

router.get("/", (res, req) => {
    req.status(200).json({ message: "Spotify Route" });
});

router.get("/played", async (req, res) => {

});

router.get("/playing", async (req, res) => {

});


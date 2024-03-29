require('dotenv').config()

const express = require("express");
const app = express();
const path = require("path");
const env = process.env
var package = require("./package.json")

var PORT = process.env["PORT"]
let requests = 1;
app.use(express.raw({ inflate: true, type: "*/*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'public'));
app.enable("trust proxy");


// ======= DATABASES =========

const mongoose = require("mongoose");
var db_username = env.MONGODB_USERNAME;
var db_password = env.MONGODB_PASSWORD;
var db_address = env.MONGODB_SERVER;
var db_name = env.MONGODB_DATABASE;
var db_url = `mongodb://${db_username}:${db_password}@${db_address}/${db_name}?retryWrites=true&w=majority`;

mongoose.connect(db_url, {
    useNewUrlParser: true,
    dbName: `${db_name}`,
    useUnifiedTopology: true,
  }
);

var mongodb_db = mongoose.connection;

mongodb_db.on("open", function (ref) {
  console.log("Connected to MongoDB Server: " + db_address);
});

mongodb_db.on("connecting", function (ref) {
  console.log("Connecting to MongoDB Server: " + db_address);
});

mongodb_db.on("disconnecting", function () {
  console.log("Disconnecting from MongoDB Server: " + db_address);
});

mongodb_db.on("disconnect", function () {
  console.log("Disconnected from MongoDB Server: " + db_address);
});

mongodb_db.on("reconnected", function () {
  console.log("Reconnected to MongoDB Server: " + db_address);
});

mongodb_db.on("error", function (err) {
  console.log("Unable to connect to MongoDB Server: " + db_address);
  console.log(err);
});

// ===========================


// -- PUBLIC ENDPOINTS --

app.all('*', (req, res, next) => {
  
  var IP = req.headers['cf-connecting-ip'] || req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
  var time = new Date().toLocaleString();
  var host = req.hostname;
  var UserAgent = req.get('User-Agent') || "No User Agent";
  var Path = req.url || "Unknown Path";
  var Method = req.method;
  var Referer = req.get('referer') || "No Referer";

  console.log(`[${time}] ${IP} - ${host} - ${Method} ${Path} - ${UserAgent} - ${Referer}`);

  next();
  
});

app.get('/', (req, res) => {
  res.status(200).json({ message: "OK", version: package["version"] });
})

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Pong!' });
});


// ==== ENDPOINTS: ====
const HealthRouter = require(`${__dirname}/routes/health.js`)
app.use('/health', HealthRouter)

const TailscaleRouter = require(`${__dirname}/routes/tailscale.js`)
app.use('/tailscale', TailscaleRouter)

const GitRouter = require(`${__dirname}/routes/git.js`)
app.use('/git', GitRouter)

const SpotifyRouter = require(`${__dirname}/routes/spotify.js`)
app.use('/spotify', SpotifyRouter)

// Error Handling
app.use(function(err, req, res, next) {
  console.err(err);
  res.status(500).json({
    message: "An Internal Server error has occurred."
  });
});

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});

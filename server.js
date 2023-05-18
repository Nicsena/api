require('dotenv').config()

const express = require("express");
const app = express();
const os = require('os');
const humanizeDuration = require("humanize-duration");
const path = require("path")
const package = require("./package.json")

const { formatBytes } = require("./src/utility")
const { MemoryUsage } = require("./src/system")

var PORT = process.env["PORT"]
let requests = 1;
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'public'));
app.enable("trust proxy");


// ======= DATABASES =========

const mongoose = require("mongoose");
var db_username = process.env.MONGODB_USERNAME;
var db_password = process.env.MONGODB_PASSWORD;
var db_address = process.env.MONGODB_SERVER;
var db_name = process.env.MONGODB_DATABASE;
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

app.get('/', (req, res) => {
  res.status(200).json({ message: "OK", version: package["version"] });
})

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Pong!' });
});

app.get('/health', async (req, res) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');

  var uptime = os.uptime() * 1000
  var processuptime = Math.round(process.uptime() * 1000);
  var processmemory = process.memoryUsage().heapUsed;
  var systemMemory = await MemoryUsage();

  var MongooseConnection = {
    '0': 'Disconnected',
    '1': 'Connected',
    '2': 'Connecting',
    '3': 'Disconnecting',
    '99': 'Uninitialized',
  }

  res.status(200).json({
    database: {
      MongoDB: {
        status: MongooseConnection[await mongodb_db.readyState]
     }
    },
    uptime: {
      system: {
        milliseconds: uptime,
        human: humanizeDuration(uptime),
      },
      process: {
        milliseconds: processuptime,
        human: humanizeDuration(processuptime)
      }
    },
    memory: {
      system: {
        total: formatBytes(systemMemory["total"]),
        used: formatBytes(systemMemory["used"]),
        free: formatBytes(systemMemory["free"]),
        swap: {
          total: formatBytes(systemMemory["swap"]["swaptotal"]),
          used: formatBytes(systemMemory["swap"]["swapused"]),
        }
      },
      process: {
        used: formatBytes(processmemory)
      }
    },
    load: os.loadavg(),
    time: new Date().toLocaleString()  
  })
})


// ==== ENDPOINTS: ====
const TailscaleRouter = require(`${__dirname}/routes/tailscale.js`)
app.use('/tailscale', TailscaleRouter)

const GitHubRouter = require(`${__dirname}/routes/github.js`)
app.use('/github', GitHubRouter)

const SpotifyRouter = require(`${__dirname}/routes/spotify.js`)
app.use('/spotify', SpotifyRouter)

app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});

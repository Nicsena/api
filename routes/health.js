const os = require('os');

const humanizeDuration = require("humanize-duration");

const express = require("express");
const router = express.Router()

const mongoose = require("mongoose");

const env = process.env

const { formatBytes } = require("../src/utility")
const { MemoryUsage } = require("../src/system")


router.all("*", async (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    next();
})

router.get('/', async (req, res) => {

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
          status: MongooseConnection[await mongoose.connection.readyState]
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


  });



router.get('/database', async (req, res) => {

    var MongooseConnection = {
        '0': 'Disconnected',
        '1': 'Connected',
        '2': 'Connecting',
        '3': 'Disconnecting',
        '99': 'Uninitialized',
    }

    res.status(200).json({
        MongoDB: {
            status: MongooseConnection[await mongoose.connection.readyState]
        }
    });
  });


router.get("/uptime", async (req, res) => {

    var uptime = os.uptime() * 1000
    var processuptime = Math.round(process.uptime() * 1000);

    res.status(200).json({
        system: {
            milliseconds: uptime,
            human: humanizeDuration(uptime),
          },
          process: {
            milliseconds: processuptime,
            human: humanizeDuration(processuptime)
          }
    });

})


router.get("/memory", async (req, res) => {

res.status(200).json({
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
})

})



router.get("/load", async (req, res) => {

    res.status(200).json({
        load: os.loadavg()
    })
    
})



router.get("/time", async (req, res) => {

    res.status(200).json({
        time: new Date().toLocaleString() 
    })
    
})


module.exports = router
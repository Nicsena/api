const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const { exec } = require("child_process")

const env = process.env
var webhookSecret = env.GITHUB_WEBHOOK_SECRET

router.all("*", (res, req, next) => {
    if(!webhookSecret) res.status(400).json({ status: 400, message: "Please set the GITHUB_WEBHOOK_SECRET environment variable"});
    if(webhookSecret) return next();
});

router.get("/", (res, req) => {
    req.status(200).json({ message: "GitHub Route"})
});

router.post("/webhook/update", (res, req) => {
    var body = JSON.stringify(res.body)
    var headers = res.headers;
    var webhookSignature = headers["x-hub-signature"]
    var hmac = `sha1=${crypto.createHmac('sha1', webhookSecret).update(body).digest("hex")}`

    if( webhookSignature !== hmac) {
        //console.log("GitHub Webhook Signature doesn't match!");
        req.status(400).json( { message: "Webhook Signature does not match!" } )
    }
    
    if( webhookSignature == hmac) {
        var currentTime = new Date().toLocaleString();

        //console.log("GitHub Webhook Signature does match!");
        if(headers["x-github-event"] === "push") {
            console.log(`[${currentTime}] GitHub Webhook - PUSH Event - Now updating`)
            var pro = exec('git pull -f origin main');

            pro.stdout.on('data', (data => {
                console.log(`${pro.pid} - ${data}`)
              }));
              
              pro.stderr.on('data', (data => {
                console.error(`${pro.pid} - ${data}`);
              }));
              
              pro.on('close', (code, singal) => {
                console.log(`${pro.pid} - ${code} - ${singal}`)
                RestartProcess();
              });
              
              pro.on('error', (err) => {
                console.log(`${pro.pid} - ${err}`)
                
              });
              

        }
        req.status(200).send({ message: "OK"});
    }

});


async function RestartProcess() {
  var PMID = env.pm_id

  if(process.env["PM2_HOME"]) {
    await exec(`pm2 restart ${PMID}`)
  } else {
    return;
  }

}

module.exports = router
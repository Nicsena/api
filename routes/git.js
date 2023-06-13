const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const { exec } = require("child_process")
var package = require("../package.json")

const env = process.env
var webhookSecret = env.GIT_WEBHOOK_SECRET

router.all("*", (res, req, next) => {
    if(!webhookSecret) return res.status(400).json({ status: 400, message: "Please set the GITHUB_WEBHOOK_SECRET environment variable"});
    if(webhookSecret) return next();
});

router.get("/", (res, req) => {
    req.status(200).json({ message: "GitHub Route"})
});

router.get("/repo/visit", (res, req) => {
  var RepoURL = package["repository"]["url"]
  if(!RepoURL) return res.status(200).json({ message: "There is no repository url in the package.json file."})
  if(RepoURL) return res.status(200).redirect(RepoURL);
});

router.post("/webhook/update", express.raw({ inflate: true, type: 'application/json' }), (res, req) => {
    var body = res.body
    var headers = res.headers;
    var webhookSignature = headers["x-hub-signature"]
    var hmac = `sha1=${crypto.createHmac('sha1', webhookSecret).update(body).digest("hex")}`
    var currentTime = new Date().toLocaleString();

    if( webhookSignature !== hmac ) {
        console.log(`[${currentTime}] Webhook - Signature doesn't match!`);
        return res.status(400).json( { message: "Webhook Signature does not match!" } )
    }
    
    if( webhookSignature == hmac ) {

        console.log(`[${currentTime}] Webhook - Signature does match!`);
        if(headers["x-github-event"] === "push") {
            console.log(`[${currentTime}] Webhook - PUSH Event - Now updating`)
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
        return res.status(200).send({ message: "OK"});
    }

});


async function RestartProcess() {

  if(process.env["PM2_HOME"]) {
    var PMID = env.pm_id
    await exec(`pm2 restart ${PMID}`)
  } else {
    return;
  }

}

module.exports = router
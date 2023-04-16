const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const { exec } = require("child_process")

router.all("*", (res, req, next) => {
    next()
});

router.get("/", (res, req) => {
    req.status(200).json({ message: "GitHub Route"})
});

router.post("/webhook/update", (res, req) => {
    var webhookSecret = process.env.GITHUB_WEBHOOK_SECRET
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
            exec('git pull -f origin main');
        }
        req.status(200).send({ message: "OK"});
    }

});

module.exports = router
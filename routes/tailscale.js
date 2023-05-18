const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const { tailscaleEvents } = require("./../models");
var crypto = require('crypto');

var env = process.env
var webhookSecretKey = env.TAILSCALE_WEBHOOK_SECRET

router.all('*', async (req, res, next) => {
    if(!webhookSecretKey) return res.status(400).json({ status: 400, message: "Please set the TAILSCALE_WEBHOOK_SECRET environment variable"});
    if(webhookSecretKey) return next();
});


router.get('/', async (req, res) => {
    return res.status(200).json({message: "Tailscale Route"});
});



router.post('/webhook', async (req, res) => {

var webhookSignature = req.headers["tailscale-webhook-signature"];

if(webhookSignature == null) return res.status(400).json({ message: "Please add the `tailscale-webhook-signature` header."})

var time = Math.floor(Date.now() / 1000 )
var body = JSON.stringify(req.body)
var webhookSecret = process.env.TAILSCALE_WEBHOOK_SECRET;
let webhookSignatureArray = []

webhookSignature.split(",", 2).forEach((item) => {
  i = item.split("=", 4);
  webhookSignatureArray.push({ [ i[0] ]: i[1] });
});

var signatureTime = webhookSignatureArray[0]["t"]
var signatureCode = webhookSignatureArray[1]["v1"]
var message = `${time}.${body}`
var hmac = crypto.createHmac("SHA256", webhookSecret).update(message).setEncoding("hex").digest("hex")

// 5 minutes - 5 (m) * 60 (s)
var timeLeft = time - (5 * 60)

// if the time of webhook signature is less than current server time.
if(signatureTime < timeLeft ) {
    return res.status(400).json({ message: "Invaild Webhook Signature" })
}

if(hmac !== signatureCode) {
    //console.log("Tailscale Webhook Signature doesn't match!");
    res.status(400).json( { message: "Webhook Signature does not match!" } )
};

if(hmac == signatureCode) {
    var bodyResponse = JSON.parse(body)
    //console.log("Tailscale Webhook Signature does match!");

    // https://tailscale.com/kb/1213/webhooks/#events-payload
    bodyResponse.forEach(i => {
        var currentTime = new Date().toLocaleString();
        var eventMessage = `[${currentTime}] Tailscale Webhook - New Event - ${i["type"]}`

        LogWebhookEvent(i, i["type"]);
        return console.log(eventMessage);


    });

    res.status(200).json({ message: "OK"});

};


});




async function LogWebhookEvent(eventData, eventType) {
    var type = eventType
    var i = eventData

    if (type === "test") {
        return;
    };


    if (type === "nodeKeyExpiringInOneDay" || type === "nodeKeyExpired") {
    
        var json = {
            timestamp: i["timestamp"],
            type: i["type"],
            tailnet: i["type"],
            message: i["message"],
            actor: i["data"]["actor"],
            nodeID: i["data"]["nodeID"],
            deviceName: i["data"]["deviceName"],
            managedBy: i["data"]["managedBy"],
            expiration: i["data"]["expiration"]
        }

        return tailscaleEvents.create(json)
    };

    if (type === "policyUpdate") {

        var json = {
            timestamp: i["timestamp"],
            type: i["type"],
            tailnet: i["tailnet"],
            message: i["message"],
            actor: i["data"]["actor"],
            newPolicy: i["data"]["newPolicy"],
            oldPolicy: i["data"]["oldPolicy"],
        }

        return tailscaleEvents.create(json);
    };

    if (type === "userRoleUpdated" ) {

        var json = {
            timestamp: i["timestamp"],
            type: i["type"],
            tailnet: i["tailnet"],
            message: i["message"],
            actor: i["data"]["actor"],
            user: i["data"]["user"],
            oldRoles: i["data"]["oldRoles"],
            newRoles: i["data"]["newRoles"]
        }

        return tailscaleEvents.create(json);
    };



    var json = {
        timestamp: i["timestamp"],
        type: i["type"],
        tailnet: i["tailnet"],
        message: i["message"],
        actor: i["data"]["actor"],
        nodeID: i["data"]["nodeID"],
        deviceName: i["data"]["deviceName"],
        managedBy: i["data"]["managedBy"],
    }

    return tailscaleEvents.create(json);

}



module.exports = router
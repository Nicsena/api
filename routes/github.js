const express = require("express")
const router = express.Router()


router.get("/", (res, req) => {
    
});

router.post("/webhook/update", (res, req) => {
    var body = res.body;
    //var event = body["hook"]["events"][0];

    //console.log(event)
    console.log("HEADERS", res.headers)

    console.log("BODY",res.body);
    req.status(200).json({ message: "OK" })

});

module.exports = router
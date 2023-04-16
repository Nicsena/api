const express = require("express")
const router = express.Router()


router.get("/", (res, req) => {
    
});

router.post("/webhook/update", (res, req) => {
    var body = res.body;
    //var event = body["hook"]["events"][0];

    //console.log(event)
    console.log(res.headers)

    //console.log(res.body);
    req.status(200).json({ message: "OK" })

});

module.exports = router
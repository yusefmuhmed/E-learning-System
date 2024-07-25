const router = require("express").Router();
const middleware = require("../app/util/generateZoomToken");

router.post("/generateToken",middleware.generateToken)


module.exports = router
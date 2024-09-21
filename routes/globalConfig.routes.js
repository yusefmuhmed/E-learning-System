const router = require("express").Router();

const GlobalConfig = require("../app/controller/globalConfig.controller");



router.get("/getGlobalSessionDuration", GlobalConfig.getGlobalSessionDuration);

router.post("/addGlobalSessionDuration", GlobalConfig.addGlobalSessionDuration);


module.exports = router
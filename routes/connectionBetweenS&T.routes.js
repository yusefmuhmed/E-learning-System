const router = require("express").Router();
const Connection = require("../app/controller/connection.controller");


router.post("/sendConnectToTeacher/:studentId/:teacherId", Connection.sendConnectToTeacher);

router.post("/sendAcceptToStudent/:studentId/:teacherId", Connection.sendAcceptToStudent);

module.exports = router
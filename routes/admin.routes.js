const router = require("express").Router();
const Admin = require("../app/controller/admin.controller");

const { auth } = require("../app/middleware/admin.auth.middleware");

router.post("/register", Admin.createAdmin);
router.post("/login", Admin.login);
router.post("/logout", auth, Admin.logOut);
router.post("/enable-teacher", auth, Admin.enableTeacher)
router.post("/enable-teachers", auth, Admin.enableTeachers)
router.get("/fetch-teachers", auth, Admin.getAllTeachers)
router.get("/fetch-teacher/:teachedId", auth, Admin.getTeacherDetails);

module.exports = router;

const router = require("express").Router();
const Student = require("../app/controller/student.controller");
const { auth } = require("../app/middleware/student.auth.middleware");
const upload = require("../app/middleware/fileUpload.middleware");

router.post("/register", Student.register);
router.post("/login", Student.login);
router.post("/logout", auth, Student.logOut);

router.post("/me", auth, Student.profile);

router.get("/", auth, Student.allStudents);

router.get("/single/:id", auth, Student.getSingle);

router.patch("/profileImg", auth, upload.single("img"), Student.uploadImage);

module.exports = router;

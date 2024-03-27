const router = require("express").Router();
const Teacher = require("../app/controller/teacher.controller");
const { auth } = require("../app/middleware/teacher.auth.middleware");
const upload = require("../app/middleware/fileUpload.middleware");

router.post("/register", Teacher.register);
router.post("/login", Teacher.login);
router.post("/logout", auth, Teacher.logOut);

router.post("/me", auth, Teacher.profile);

router.get("/", auth, Teacher.allTeachers);

router.get("/single/:id", auth, Teacher.getSingle);

router.patch("/profileImg", auth, upload.single("img"), Teacher.uploadImage);

module.exports = router;

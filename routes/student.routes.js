const router = require("express").Router();
const Student = require("../app/controller/student.controller");
const { auth } = require("../app/middleware/student.auth.middleware");
const upload = require("../app/middleware/fileUpload.middleware");

router.post("/register", Student.register);
router.post("/login", Student.login);
router.post("/logout", auth, Student.logOut);

router.post("/resetPassword", Student.resetPassword);
router.post("/verifyOTP", Student.verifyOTP);
router.post("/updateInfo/:id", Student.updateInfo);

router.post("/me", auth, Student.profile);
router.get("/single/:id", auth, Student.getSingle);
router.get("/", auth, Student.allStudents);

router.patch("/profileImg", auth, upload.single("img"), Student.uploadImage);

router.get("/classes", auth, Student.getListOfClasses);
router.get("/subjects", auth, Student.getListOfSubjects);


module.exports = router;

const router = require("express").Router();
const Teacher = require("../app/controller/teacher.controller");
const StudentAndTeacher = require("../app/controller/student&teacher.controller");

const { auth } = require("../app/middleware/teacher.auth.middleware");
const upload = require("../app/middleware/fileUpload.middleware");

router.post("/register", Teacher.register);
router.post("/login", Teacher.login);
router.post("/logout", auth, Teacher.logOut);


router.post("/resetPassword", Teacher.resetPassword);
router.post("/verifyOTP", Teacher.verifyOTP);
router.put("/updateInfo", Teacher.updateInfo);

router.post("/me", auth, Teacher.profile);
router.get("/single/:id", auth, Teacher.getSingle);
router.get("/", auth, Teacher.allTeachers);
router.get("/getMyStudents", auth,StudentAndTeacher.getMyStudents);


router.post(
    "/profileImg1",
    upload.single("img"),
    Teacher.uploadImageBuffer
  );
  router.get("/getProfileImgBuffer", Teacher.getImageBuffer);

module.exports = router;

const router = require("express").Router();
const Student = require("../app/controller/student.controller");
const StudentAndTeacher = require("../app/controller/student&teacher.controller");

const { auth } = require("../app/middleware/student.auth.middleware");
const upload = require("../app/middleware/fileUpload.middleware");
const Guest = require("../app/controller/guest.controller");

router.post("/register", upload.single("bufferProfileImage"),Student.register);
router.post("/login", Student.login);
router.post("/logout", auth, Student.logOut);

router.post("/resetPassword", Student.resetPassword);
router.post("/verifyOTP", Student.verifyOTP);
router.post("/updateInfo", upload.single("bufferProfileImage"),Student.updateInfo);

router.post("/me", auth, Student.profile);
router.get("/single/:id", auth, Student.getSingle);
router.get("/", auth, Student.allStudents);
router.patch("/profileImg", upload.single("img"), Student.uploadImage);

router.post(
  "/profileImg1",
  upload.single("img"),
  Student.uploadImageBuffer
);
router.get("/getProfileImgBuffer",Student.getImageBuffer);

router.post(
  "/sendConnectToTeacher/:studentId/:teacherId",
  StudentAndTeacher.sendConnectToTeacher
);
router.get("/getMyTeachers", auth, StudentAndTeacher.getMyTeachers);
router.get("/getPendingTeachers", auth, StudentAndTeacher.getPendingTeachers);
router.post(
  "/addStudentToTeacher",
  auth,
  StudentAndTeacher.addStudentToTeacherArray
);
router.post(
  "/filterTeachersBySubjectAndClasses",
  StudentAndTeacher.filterBySubjectAndClass
);

router.get("/checkIfStudentHasSession/:id", Student.checkIfStudentHasSession);
router.get("/checkIfTeacherIsOnlineOrOffline/:id", StudentAndTeacher.checkIfTeacherIsOnlineOrOffline);

router.put(
  "/rateTeacher/:id",
  auth,
  StudentAndTeacher.rateTeacher
);


router.post(
  "/loginAsGuest",
  Guest.checkVisitedGuest
);

router.get("/classes", Student.getListOfClasses);
router.get("/subjects", Student.getListOfSubjects);

module.exports = router;

const router = require("express").Router();
const Teacher = require("../app/controller/teacher.controller");
const StudentAndTeacher = require("../app/controller/student&teacher.controller");

const { auth } = require("../app/middleware/teacher.auth.middleware");
const upload = require("../app/middleware/fileUpload.middleware");

router.post("/register", upload.single("bufferProfileImage"),Teacher.register);
router.post("/login", Teacher.login);
router.post("/logout", auth, Teacher.logOut);

router.post("/resetPassword", Teacher.resetPassword);
router.post("/verifyOTP", Teacher.verifyOTP);
router.post("/updateInfo",upload.single("bufferProfileImage"), Teacher.updateInfo);

router.post("/me", auth, Teacher.profile);
router.get("/single/:id", Teacher.getSingle);
router.get("/", auth, Teacher.allTeachers);
router.get("/getMyStudents", auth, StudentAndTeacher.getMyStudents);
router.get("/getStudentsRequests", auth, Teacher.getStudentsRequests);

router.get("/checkIfTeacherHasSession/:teacherId", Teacher.checkIfTeacherHasSession);

router.post("/approveRequest/:studentId/:teacherId", Teacher.approveRequest);
router.get("/rejectRequest/:studentId/:teacherId", Teacher.rejectRequest);

router.post("/profileImg1", upload.single("img"), Teacher.uploadImageBuffer);
router.get("/getProfileImgBuffer", Teacher.getImageBuffer);

router.get("/getTeacherStatus/:id",Teacher.getStatus);
router.post("/changeTeacherStatus", auth,Teacher.changeStatus);

router.post("/endMeeting", Teacher.endMeeting);

module.exports = router;

const router = require("express").Router();
const Teacher = require("../app/controller/teacher.controller");
const StudentAndTeacher = require("../app/controller/student&teacher.controller");

const { auth } = require("../app/middleware/teacher.auth.middleware");
const upload = require("../app/middleware/fileUpload.middleware");

router.post("/register", upload,Teacher.register);
router.post("/login", Teacher.login);
router.post("/logout", auth, Teacher.logOut);

router.post("/resetPassword", Teacher.resetPassword);
router.post("/verifyOTP", Teacher.verifyOTP);
router.post("/updateInfo",upload, Teacher.updateInfo);

router.post("/me", auth, Teacher.getSingle);

router.get("/", auth, Teacher.allTeachers);
router.get("/getMyStudents", auth, StudentAndTeacher.getMyStudents);
router.get("/getStudentsRequests", auth, Teacher.getStudentsRequests);

router.get("/getSpecificStudent/:id", StudentAndTeacher.getSpecificStudent);


router.get("/checkIfTeacherHasSession/:teacherId", Teacher.checkIfTeacherHasSession);

router.post("/approveRequest/:studentId/:teacherId", Teacher.approveRequest);
router.get("/rejectRequest/:studentId/:teacherId", Teacher.rejectRequest);


router.get("/getTeacherStatus/:id",Teacher.getStatus);
router.post("/changeTeacherStatus", auth,Teacher.changeStatus);

router.post("/endMeeting", Teacher.endMeeting);

module.exports = router;

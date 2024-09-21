const teacherModel = require("../../db/models/teacher.model");
const myHelper = require("../util/helper");
const fs = require("fs");
const bcryptjs = require("bcryptjs");
const SessionMap = require("../util/sessionMapCache");
const globalConfigModel = require("../../db/models/globalConfig.model");
class Teacher {
  static register = async (req, res) => {
    try {
      if (req.body.password.length < 6)
        throw new Error("password must be more than 6");
      let teacherData;
      if (req.file) {
        const imageBuffer = req.file.buffer;
        teacherData = new teacherModel({
          ...req.body,
          status: true,
          bufferProfileImage: imageBuffer,
        });

        await teacherData.save();
      } else {
        teacherData = new teacherModel({
          ...req.body,
          status: true,
        });
        await teacherData.save();
      }
      myHelper.resHandler(
        res,
        200,
        true,
        teacherData,
        "teacher added successfully"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static login = async (req, res) => {
    try {
      const teacherData = await teacherModel.loginTeacher(
        req.body.username,
        req.body.password
      );
      const token = await teacherData.generateToken();
      myHelper.resHandler(
        res,
        200,
        true,
        { teacher: teacherData, token },
        "teacher logged in successfully"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static allTeachers = async (req, res) => {
    try {
      const teachers = await teacherModel.find();
      myHelper.resHandler(res, 200, true, teachers, "teachers fetched");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static profile = (req, res) => {
    myHelper.resHandler(
      res,
      200,
      true,
      { teacher: req.teacher },
      "teacher profile fetched"
    );
  };
  static logOut = async (req, res) => {
    try {
      req.teacher.tokens = req.teacher.tokens.filter(
        (t) => t.token != req.token
      );
      await req.teacher.save();
      myHelper.resHandler(res, 200, true, null, "logged out");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static getSingle = async (req, res) => {
    try {
      const teacher = await teacherModel.findById(req.params.id);
      myHelper.resHandler(res, 200, true, teacher, "single teacher fetched");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static uploadImage = async (req, res) => {
    try {
      const ext = req.file.originalname.split(".").pop();
      const newName = "uploads/" + req.teacher._id + "." + ext;
      fs.renameSync(req.file.path, newName);
      req.teacher.image = newName;
      await req.teacher.save();
      myHelper.resHandler(res, 200, true, newName, "updated");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static resetPassword = async (req, res) => {
    try {
      const teacher = await teacherModel.findOne({ email: req.body.email });
      if (!teacher) {
        return myHelper.resHandler(
          res,
          404,
          false,
          "Email not found",
          "Email not found in the system"
        );
      } else {
        const result = await myHelper.emailHandler(req.body.email);
        if (result.apiStatus) {
          teacher.OTP = result.otp;
          await teacher.save();
          myHelper.resHandler(
            res,
            200,
            true,
            req.body.email,
            "Email sent successfully"
          );
        } else {
          {
            myHelper.resHandler(res, 500, false, e, e.message);
          }
        }
      }
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static verifyOTP = async (req, res) => {
    try {
      const teacher = await teacherModel.findOne({ email: req.body.email });
      if (!teacher) {
        return myHelper.resHandler(
          res,
          404,
          false,
          "Email not found",
          "Email not found in the system"
        );
      }

      if (req.body.otp === teacher.OTP) {
        return myHelper.resHandler(
          res,
          200,
          true,
          "",
          "OTP verified successfully"
        );
      } else {
        return myHelper.resHandler(res, 400, false, "", "OTP not correct");
      }
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static updateInfo = async (req, res) => {
    try {
      let imageBuffer;
      let teacher;
      if (req.body.password) {
        req.body.password = await bcryptjs.hash(req.body.password, 8);
      }

      if (req.file) {
        imageBuffer = req.file.buffer;

        teacher = await teacherModel.findOneAndUpdate(
          { email: req.body.email },
          { ...req.body, bufferProfileImage: imageBuffer },
          { new: true }
        );
      } else {
        teacher = await teacherModel.findOneAndUpdate(
          { email: req.body.email },
          { ...req.body },
          { new: true }
        );
      }
      if (!teacher) {
        return myHelper.resHandler(
          res,
          404,
          false,
          "Teacher not found",
          "Teacher not found with the provided ID"
        );
      }
      myHelper.resHandler(
        res,
        200,
        true,
        teacher,
        "Teacher information updated successfully"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };

  static uploadImageBuffer = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const student = await studentModel.findOne({
        username: req.body.username,
      });
      if (!student) {
        return res.status(404).json({ error: "User not found" });
      }

      const imageBuffer = req.file.buffer;

      const updatedStudent = await teacherModel.findOneAndUpdate(
        { username: req.body.username },
        { bufferProfileImage: req.body.imageBuffer },
        { new: true }
      );

      res.status(201).json({ message: imageBuffer });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static getImageBuffer = async (req, res) => {
    try {
      const teacher = await teacherModel.findOne({
        username: req.body.username,
      });
      if (!teacher || !teacher.bufferProfileImage) {
        return res.status(404).json({ error: "Image not found" });
      }

      // res.set("Content-Type", "image/jpeg"); // Set the response content type
      // res.send(teacher.bufferProfileImage); // Send the image buffer as the response
      res.status(201).json({ image: teacher.bufferProfileImage });
    } catch (error) {
      console.error("Error retrieving image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static getStatus = async (req, res) => {
    try {
      const teacher = await teacherModel.findById(req.params.id);
      myHelper.resHandler(
        res,
        200,
        true,
        true,
        teacher.status,
        "teacher's status fetched"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };

  static changeStatus = async (req, res) => {
    try {
      let newStatus = !req.teacher.status;
      const teacher = await teacherModel.findByIdAndUpdate(
        req.teacher.id,
        { status: newStatus },
        { new: true }
      );
      myHelper.resHandler(
        res,
        200,
        true,
        true,
        teacher.status,
        "status changes successfully"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };

  static getStudentsRequests = async (req, res) => {
    try {
      const teacher = await teacherModel.findById(req.teacher.id);
      myHelper.resHandler(
        res,
        200,
        true,
        teacher.requestsFromStudents,
        "Students requests fetched"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };

  static approveRequest = async (req, res) => {
    try {
      const teacherId = req.params.teacherId;
      const studentId = req.params.studentId;
      let globalSessionDuration = await globalConfigModel.findOne({});
      if (!globalSessionDuration) {
        await globalConfigModel.create({
          id:1,
          sessionDuration: 30,
        });
      }

      globalSessionDuration = await globalConfigModel.findOne({});

      const session = SessionMap.generateSession(
        studentId,
        teacherId,
        globalSessionDuration.meetingDuration 
      );

      const teacher = await teacherModel.findOneAndUpdate(
        { _id: teacherId },
        { $pull: { requestsFromStudents: { studentID: studentId } } },
        { new: true }
      );
      myHelper.resHandler(
        res,
        200,
        true,
        session,
        "Session created successfully"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };

  static rejectRequest = async (req, res) => {
    try {
      const teacherId = req.params.teacherId;
      const studentId = req.params.studentId;

      const teacher = await teacherModel.findOneAndUpdate(
        { _id: teacherId },
        { $pull: { requestsFromStudents: { studentID: studentId } } },
        { new: true }
      );

      if (!teacher) {
        return myHelper.resHandler(res, 404, false, null, "Teacher not found");
      }

      myHelper.resHandler(
        res,
        200,
        true,
        teacher,
        "Request rejected successfully"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };

  static checkIfTeacherHasSession = async (req, res) => {
    try {
      const sessionName = SessionMap.checkIfTeacherHasSession(
        req.params.teacherId
      );

      if (!sessionName) {
        return myHelper.resHandler(res, 404, false, null, "Session not found");
      }
      myHelper.resHandler(res, 200, true, sessionName, "Session found");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };

  static endMeeting = async (req, res) => {
    try {
      SessionMap.deleteSession(req.body.session);
      myHelper.resHandler(res, 200, true, "", "Sessions ended successfully");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
}
module.exports = Teacher;

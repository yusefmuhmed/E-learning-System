const teacherModel = require("../../db/models/teacher.model");
const myHelper = require("../util/helper");
const fs = require("fs");
const path = require("path");
const bcryptjs = require("bcryptjs");
const SessionMap = require("../util/sessionMapCache");
const studentAndTeacherController = require("./student&teacher.controller");
class Teacher {
  static register = async (req, res) => {
    try {
      if (req.body.password.length < 6)
        throw new Error("Password must be more than 6 characters");

      const teacherData = new teacherModel({
        ...req.body,
        status: true,
        profileImage: req.file
          ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
          : null,
      });

      await teacherData.save();

      myHelper.resHandler(
        res,
        200,
        true,
        teacherData,
        "Teacher added successfully"
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
      const teacher = req.teacher;

      if (!teacher) throw new Error("Teacher not found");

      const imageUrl = teacher.profileImage;

      myHelper.resHandler(
        res,
        200,
        true,
        { ...teacher.toObject(), imageUrl },
        "Teacher info retrieved successfully"
      );
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
      let teacher = await teacherModel.findOne({ email: req.body.email });

      if (!teacher) {
        return myHelper.resHandler(
          res,
          404,
          false,
          "Teacher not found",
          "Teacher not found with the provided email"
        );
      }

      // Hash the password if it's being updated
      if (req.body.password) {
        req.body.password = await bcryptjs.hash(req.body.password, 8);
      }

      // If a new profile image is uploaded, delete the old one
      if (req.file) {
        // Check if the teacher already has an existing image
        if (teacher.profileImage) {
          const fileName = teacher.profileImage.split("/").pop();
          const oldImagePath = path.join(__dirname, "../../uploads/", fileName);

          // Delete the old image file from the uploads folder
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              myHelper.resHandler(res, 500, false, err, err.message);
            }
          });
        }

        // Update with the new image filename
        teacher = await teacherModel.findOneAndUpdate(
          { email: req.body.email },
          {
            ...req.body,
            profileImage: req.file
              ? `${req.protocol}://${req.get("host")}/uploads/${
                  req.file.filename
                }`
              : null,
          },
          { new: true }
        );
      } else {
        // Update without changing the profile image
        teacher = await teacherModel.findOneAndUpdate(
          { email: req.body.email },
          { ...req.body },
          { new: true }
        );
      }

      // Send a success response
      myHelper.resHandler(
        res,
        200,
        true,
        teacher,
        "Teacher information updated successfully"
      );
    } catch (e) {
      // Handle any errors
      myHelper.resHandler(res, 500, false, e, e.message);
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

      const object = await teacherModel.findOne(
        { _id: teacherId },
        { requestsFromStudents: { $elemMatch: { studentID: studentId } } }
      );

      // Check if a matching request was found
      if (
        !object ||
        !object.requestsFromStudents ||
        object.requestsFromStudents.length === 0
      ) {
        return res
          .status(404)
          .json({ success: false, message: "No matching request found." });
      }

      // Retrieve the duration
      const durationInMinutes =
        object.requestsFromStudents[0].durationInMinutes;

      // Generate the session using the retrieved duration
      const session = SessionMap.generateSession(
        studentId,
        teacherId,
        durationInMinutes
      );

      const teacher = await teacherModel.findOneAndUpdate(
        { _id: teacherId },
        {
          $pull: { requestsFromStudents: { studentID: studentId } },
          status: false,
        },
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
      const session = SessionMap.getSession(req.body.session);

      const transfer = await studentAndTeacherController.transferBalance(
        session.studentId,
        session.teacherId,
        req.body.price
      );

      if (!transfer) {
        return myHelper.resHandler(res, 404, false, null, "Transfer failed");
      }
      const result = SessionMap.deleteSession(req.body.session);

      if (result.session)
        await this.changeTeacherStatus(result.session.teacherId);
      myHelper.resHandler(res, 200, true, "", "Sessions ended successfully");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static changeTeacherStatus = async (teacherId) => {
    try {
      const teacher = await teacherModel.findByIdAndUpdate(
        teacherId,
        { status: true },
        { new: true }
      );
      return "status changes successfully to " + newStatus;
    } catch (e) {
      return e;
    }
  };
  static checkTeacherBalance = async (req, res) => {
    try {
      if (!req.teacher) {
        return myHelper.resHandler(res, 404, false, null, "Teacher not found");
      }
      const teacherBalance = req.teacher.balance;

      if (req.body.amount > teacherBalance) {
        return myHelper.resHandler(
          res,
          404,
          false,
          null,
          "Teacher does not have enough balance"
        );
      } else {
        myHelper.resHandler(res, 200, true, teacherBalance, "Balance fetched");
      }
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
}
module.exports = Teacher;

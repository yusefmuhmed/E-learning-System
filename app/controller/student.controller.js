const studentModel = require("../../db/models/student.model");
const myHelper = require("../../app/helper");
const subjects = require("../../app/subjects");
const fs = require("fs");
const bcryptjs = require("bcryptjs");
class Student {
  static register = async (req, res) => {
    try {
      if (req.body.password.length < 6)
        throw new Error("password must be more than 6");
      const studentData = new studentModel(req.body);
      await studentData.save();
      myHelper.resHandler(
        res,
        200,
        true,
        studentData,
        "student added successfully"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static login = async (req, res) => {
    try {
      const studentData = await studentModel.loginStudent(
        req.body.username,
        req.body.password
      );
      const token = await studentData.generateToken();
      myHelper.resHandler(
        res,
        200,
        true,
        { student: studentData, token },
        "student logged in successfully"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static allStudents = async (req, res) => {
    try {
      const Students = await studentModel.find();
      myHelper.resHandler(res, 200, true, Students, "Students fetched");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static profile = (req, res) => {
    myHelper.resHandler(
      res,
      200,
      true,
      { student: req.student },
      "student profile fetched"
    );
  };
  static logOut = async (req, res) => {
    try {
      req.student.tokens = req.student.tokens.filter(
        (t) => t.token != req.token
      );
      await req.student.save();
      myHelper.resHandler(res, 200, true, null, "logged out");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static getSingle = async (req, res) => {
    try {
      const student = await studentModel.findById(req.params.id);
      myHelper.resHandler(res, 200, true, student, "single student fetched");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static resetPassword = async (req, res) => {
    try {
      const student = await studentModel.findOne({ email: req.body.email });
      if (!student) {
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
          student.OTP = result.otp;
          await student.save();
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
      const student = await studentModel.findOne({ email: req.body.email });
      if (!student) {
        return myHelper.resHandler(
          res,
          404,
          false,
          "Email not found",
          "Email not found in the system"
        );
      }

      if (req.body.otp === student.OTP) {
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
      if (req.body.password) {
        req.body.password = await bcryptjs.hash(req.body.password, 8);
      }

      const student = await studentModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!student) {
        return myHelper.resHandler(
          res,
          404,
          false,
          "Student not found",
          "Student not found with the provided ID"
        );
      }
      myHelper.resHandler(
        res,
        200,
        true,
        student,
        "Student information updated successfully"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static uploadImage = async (req, res) => {
    try {
      const ext = req.file.originalname.split(".").pop();
      const newName = "uploads/" + req.student._id + "." + ext;
      fs.renameSync(req.file.path, newName);
      req.student.image = newName;
      await req.student.save();
      myHelper.resHandler(res, 200, true, newName, "updated");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };

  static getListOfClasses = async (req, res) => {
    try {
      const classes = await subjects.getClasses(req.headers.locale);
      myHelper.resHandler(res, 200, true, classes, "Classes fetched");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };

  static getListOfSubjects = async (req, res) => {
    try {
      const subject = await subjects.getSubjects(req.headers.locale);
      myHelper.resHandler(res, 200, true, subject, "Subjects fetched");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
}
module.exports = Student;

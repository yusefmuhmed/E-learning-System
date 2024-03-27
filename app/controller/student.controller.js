const studentModel = require("../../db/models/student.model");
const myHelper = require("../../app/helper");
const fs = require("fs");
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


  static uploadImage = async (req, res) => {
    try {
      const ext = req.file.originalname.split(".").pop();
      const newName = "uploads/" + req.student._id+"."+ext;
      fs.renameSync(req.file.path, newName);
      req.student.image = newName;
      await req.student.save();
      myHelper.resHandler(res, 200, true, newName, "updated");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
}
module.exports = Student;

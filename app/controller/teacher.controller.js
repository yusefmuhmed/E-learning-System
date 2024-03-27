const teacherModel = require("../../db/models/teacher.model");
const myHelper = require("../../app/helper");
const fs = require("fs");
class Teacher {
  static register = async (req, res) => {
    try {
      if (req.body.password.length < 6)
        throw new Error("password must be more than 6");
      const teacherData = new teacherModel(req.body);
      await teacherData.save();
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
      myHelper.resHandler(res, 200, true, teacher, "logged out");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
  static changeStatus = async (req, res) => {
    try {
      let teacher = req.teacher;
      if (!req.query.current || req.query.current == "0")
        teacher = await teacherModel.findById(req.body._id);

      if (req.query.activate == "1") teacher.status = true;
      else teacher.status = false;
      await teacher.save();
      myHelper.resHandler(res, 200, true, teacher, "updated");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };

  static uploadImage = async (req, res) => {
    try {
      const ext = req.file.originalname.split(".").pop();
      const newName = "uploads/" + Date.now() + "testApp." + ext;
      fs.renameSync(req.file.path, newName);
      req.teacher.image = newName;
      await req.teacher.save();
      myHelper.resHandler(res, 200, true, req.teacher, "updated");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
}
module.exports = Teacher;

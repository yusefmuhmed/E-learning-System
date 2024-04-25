const teacherModel = require("../../db/models/teacher.model");
const myHelper = require("../../app/helper");
const fs = require("fs");
const bcryptjs = require("bcryptjs");
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
      if (req.body.password) {
        req.body.password = await bcryptjs.hash(req.body.password, 8);
      }

      const teacher = await teacherModel.findOneAndUpdate(
        { email: req.body.email },
        req.body,
        { new: true }
      );
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
      const teacher = await teacherModel.findById(req.teacher.id);
      if (!teacher || !teacher.bufferProfileImage) {
        return res.status(404).json({ error: "Image not found" });
      }

      res.set("Content-Type", "image/jpeg"); // Set the response content type
      res.send(teacher.bufferProfileImage); // Send the image buffer as the response
    } catch (error) {
      console.error("Error retrieving image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
module.exports = Teacher;

const studentModel = require("../../db/models/student.model");
const myHelper = require("../util/helper");
const subjects = require("../../app/subjects");
const fs = require('fs');
const path = require('path');
const bcryptjs = require("bcryptjs");
const SessionMap = require("../util/sessionMapCache");
class Student {
  static register = async (req, res) => {
    try {
      let studentData;
      if (req.body.password.length < 6)
        throw new Error("password must be more than 6");

      studentData = new studentModel({
        ...req.body,
        profileImage: req.file ? req.file.filename : null,
      });

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
      const student =  req.student 
      const imageUrl = student.profileImage
        ? `${req.protocol}://${req.get('host')}/uploads/${student.profileImage}`
        : null;
        myHelper.resHandler(res, 200, true, { ...student.toObject(), imageUrl }, "Student info retrieved successfully");
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
      let student = await studentModel.findOne({ email: req.body.email });
  
      if (!student) {
        return myHelper.resHandler(
          res,
          404,
          false,
          "Student not found",
          "Student not found with the provided email"
        );
      }
  
      // Hash the password if it's being updated
      if (req.body.password) {
        req.body.password = await bcryptjs.hash(req.body.password, 8);
      }
  
      // If a new profile image is uploaded, delete the old one
      if (req.file) {
        // Check if the student already has an existing image
        if (student.profileImage) {
          const oldImagePath = path.join(__dirname, '../../uploads/', student.profileImage);
  
          // Delete the old image file from the uploads folder
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error("Failed to delete old profile image:", err);
            }
          });
        }
  
        // Update with the new image filename
        student = await studentModel.findOneAndUpdate(
          { email: req.body.email },
          { ...req.body, profileImage: req.file.filename },
          { new: true }
        );
      } else {
        // Update without changing the profile image
        student = await studentModel.findOneAndUpdate(
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
        student,
        "Student information updated successfully"
      );
    } catch (e) {
      // Handle any errors
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

      const updatedStudent = await studentModel.findOneAndUpdate(
        { username: req.body.username },
        { bufferProfileImage: req.body.imageBuffer },
        { new: true }
      );

      res.status(201).json({ imageBuffer: imageBuffer });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static getImageBuffer = async (req, res) => {
    try {
      const student = await studentModel.findOne({
        username: req.body.username,
      });
      if (!student || !student.bufferProfileImage) {
        return res.status(404).json({ error: "Image not found" });
      }

      res.status(201).json({ imageBuffer: student.bufferProfileImage });
    } catch (error) {
      console.error("Error retrieving image:", error);
      res.status(500).json({ error: "Internal server error" });
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

  static checkIfStudentHasSession = async (req, res) => {
    try {
      const sessionName = SessionMap.checkIfStudentHasSession(req.params.id);

      if (!sessionName) {
        return myHelper.resHandler(res, 404, false, null, "Session not found");
      }
      myHelper.resHandler(res, 200, true, sessionName, "Session found");
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
}
module.exports = Student;

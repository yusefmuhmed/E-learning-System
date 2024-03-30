const teacherModel = require("../../db/models/teacher.model");
const studentModel = require("../../db/models/student.model");
const myHelper = require("../../app/helper");

class Student_Teacher {
  static addStudentToTeacherArray = async (req, res) => {
    try {
      const student = await studentModel.findById(req.body.studentId);
      const teacher = await teacherModel.findById(req.body.teacherId);

      if (!student || !teacher) {
        myHelper.resHandler(res, 404, false, "Data not found", e.message);
      }

      student.teachersIDs.push(req.body.teacherId);
      teacher.studentsIDs.push(req.body.studentId);

      await student.save();
      await teacher.save();

      //return { student, teacher };
      myHelper.resHandler(
        res,
        200,
        true,
        "Student assigned with a teacher",
        ""
      );
    } catch (error) {
      myHelper.resHandler(res, 404, false, "Data not found", e.message);
    }
  };

  static getMyTeachers = async (req, res) => {
    try {
      const student = await studentModel.findById(req.body.studentId);

      if (!student) {
        myHelper.resHandler(res, 404, false, "Student not found", e.message);
      }

      const teacherIds = student.teachersIDs;
      const teachers = [];

      for (const teacherId of teacherIds) {
        const teacher = await teacherModel.findById(teacherId, {
          firstName: 1,
          lastName: 1,
          username: 1,
          "classes.class": 1,
          _id: 1,
        });
        if (teacher) {
          teachers.push(teacher);
        }
      }

      myHelper.resHandler(
        res,
        200,
        true,
        teachers,
        "Yours teachers fetched successfully"
      );
    } catch (error) {
      myHelper.resHandler(res, 404, false, "Data not found", e.message);
    }
  };

  static getMyStudents = async (req, res) => {
    try {
      const teacher = await teacherModel.findById(req.body.teacherId);

      if (!teacher) {
        myHelper.resHandler(res, 404, false, "Teacher not found", e.message);
      }

      const studentIds = teacher.studentsIDs;
      const students = [];

      for (const studentId of studentIds) {
        const student = await studentModel.findById(studentId, {
          firstName: 1,
          lastName: 1,
          username: 1,
          class: 1,
          _id: 1,
        });
        if (student) {
          students.push(student);
        }
      }

      myHelper.resHandler(
        res,
        200,
        true,
        students,
        "Yours students fetched successfully"
      );
    } catch (error) {
      myHelper.resHandler(res, 404, false, "Data not found", e.message);
    }
  };

  static filterBySubjectAndClass = async (req, res) => {
    try {
      const { subject, class: studentClass } = req.body;

      const query = {};

      if (subject || studentClass) {
        query.$and = [];

        if (subject) {
          query.$and.push({ "subjects.subject": subject });
        }

        if (studentClass) {
          query.$and.push({ "classes.class": studentClass });
        }
      }

      const teachers = await teacherModel.find(query, {
        firstName: 1,
        lastName: 1,
        username: 1,
        classes: 1,
        subjects: 1,
        _id: 1,
      });

      myHelper.resHandler(
        res,
        200,
        true,
        teachers,
        "Teachers filtered successfully"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
}

module.exports = Student_Teacher;

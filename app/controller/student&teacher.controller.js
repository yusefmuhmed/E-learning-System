const teacherModel = require("../../db/models/teacher.model");
const studentModel = require("../../db/models/student.model");
const myHelper = require("../util/helper");
const Teacher = require("../../db/models/teacher.model");

class Student_Teacher {
  static addStudentToTeacherArray = async (req, res) => {
    try {
      const student = await studentModel.findById(req.params.studentId);
      const teacher = await teacherModel.findById(req.params.teacherId);

      if (!student || !teacher) {
        myHelper.resHandler(res, 404, false, "Data not found", e.message);
      }

      student.teachersIDs.push(req.params.teacherId);
      teacher.studentsIDs.push(req.params.studentId);

      await student.save();
      await teacher.save();

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

      let query = {
        status: true,
      };

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

  static sendConnectToTeacher = async (req, res) => {
    try {
      const studentId = req.params.studentId;
      const teacherId = req.params.teacherId;
      const className = req.body.class;
      const duration = req.body.duration;

      if (!studentId || !teacherId || !className || !duration) {
        myHelper.resHandler(
          res,
          404,
          false,
          "Data not found",
          "Please provide all required fields"
        );
      }

      let student;

      if (myHelper.checkIsObjectId(studentId)) {
        student = await studentModel.findByIdAndUpdate(
          studentId,
          {
            $push: {
              pendingTeachersIDs: {
                teachersID: teacherId,
                durationInMinutes: duration,
                class: className,
              },
            },
          },
          { new: true }
        );
      }

      const teacher = await teacherModel.findByIdAndUpdate(
        teacherId,
        {
          $push: {
            requestsFromStudents: {
              studentID: studentId,
              class: className,
              durationInMinutes: duration,
            },
          },
        },
        { new: true }
      );

      myHelper.resHandler(
        res,
        200,
        true,
        '',
        "Connect Sent successfully to the teacher"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };

  static rateTeacher = async (req, res) => {
    try {
      const teacherId = req.params.id;
      const rating = req.body.rating;
      const studentId = req.student.id;

      const teacher = await Teacher.findById(teacherId);

      teacher.ratings.push({ studentId: studentId, rate: rating });

      const totalRatings = teacher.ratings.length;
      const totalRatingSum = teacher.ratings.reduce(
        (acc, curr) => acc + curr.rate,
        0
      );
      teacher.ratingAverage =
        Math.round((totalRatingSum / totalRatings) * 10) / 10;
      teacher.totalNumberOfRatings = totalRatings;

      await teacher.save();

      myHelper.resHandler(
        res,
        200,
        true,
        {
          ratingAverage: teacher.ratingAverage,
          totalRatings: teacher.totalNumberOfRatings,
        },

        "Rating successfully submitted for the teacher"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };

  static getPendingTeachers = async (req, res) => {
    try {
      const student = await studentModel.findById(req.student._id);
      let teachers = [];
      for (const teacherId of student.pendingTeachersIDs) {
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
        "Pending Teachers fetched successfully"
      );
    } catch (e) {
      myHelper.resHandler(res, 500, false, e, e.message);
    }
  };
}

module.exports = Student_Teacher;

const teacherModel = require("../../db/models/teacher.model");
const studentModel = require("../../db/models/student.model");
const MyHelper = require("../util/helper");
const clients = require("../util/socketHandler").clients;

class ConnectionBetweenStudentAndTeacher {
  static sendConnectToTeacher = async (req, res) => {
    try {
      const { studentId, teacherId } = req.params;
      if (clients[teacherId]) {
        clients[teacherId].emit("notification", {
          message: `Student ${studentId} wants to connect`,
          studentId,
        });

        MyHelper.resHandler(
          res,
          200,
          true,
          "Connection between student and teacher created successfully",
          ""
        );
      } else {
        MyHelper.resHandler(res, 404, false, "Data not found", "Data not found");
      }
    } catch (e) {
      MyHelper.resHandler(res, 500, false, e, e.message);
    }
  };

  static sendAcceptToStudent = async (req, res) => {
    try {
      const { teacherId, studentId } = req.params;
      if (clients[studentId]) {
        clients[studentId].emit("notification", {
          message: `Teacher ${teacherId} accepted your connection request`,
          teacherId,
        });

        MyHelper.resHandler(
          res,
          200,
          true,
          "Connection between student and teacher created successfully",
          ""
        );
      } else {
        MyHelper.resHandler(res, 404, false, "Data not found", e.message);
      }
    } catch (error) {
      MyHelper.resHandler(res, 500, false, e, e.message);
    }
  };
}

module.exports = ConnectionBetweenStudentAndTeacher;

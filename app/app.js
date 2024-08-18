module.exports = (app) => {
  const teacherRoutes = require("../routes/teacher.routes");
  const studentRoutes = require("../routes/student.routes");

  app.use("/api/teacher/", teacherRoutes);
  app.use("/api/student/", studentRoutes);

  app.all("*", (req, res) => {
      res.status(404).send({
          apisStatus: false,
          message: "Invalid URL",
          data: {},
      });
  });
};

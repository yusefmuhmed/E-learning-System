module.exports = (app) => {
  const teacherRoutes = require("../routes/teacher.routes");
  const studentRoutes = require("../routes/student.routes");
  const globalConfigRoutes = require("../routes/globalConfig.routes");

  

  app.use("/api/teacher/", teacherRoutes);
  app.use("/api/student/", studentRoutes);
  app.use("/api/globalConfig/", globalConfigRoutes);

  app.all("*", (req, res) => {
      res.status(404).send({
          apisStatus: false,
          message: "Invalid URL",
          data: {},
      });
  });
};

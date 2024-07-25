module.exports = (app) => {
  const teacherRoutes = require("../routes/teacher.routes");
  const studentRoutes = require("../routes/student.routes");
  const connectionRoutes = require("../routes/connectionBetweenS&T.routes");
  const zoomRoutes = require("../routes/zoom.routes");

  app.use("/api/teacher/", teacherRoutes);
  app.use("/api/student/", studentRoutes);
  app.use("/api/connection/", connectionRoutes);
  app.use("/api/zoom/", zoomRoutes);

  app.all("*", (req, res) => {
      res.status(404).send({
          apisStatus: false,
          message: "Invalid URL",
          data: {},
      });
  });
};

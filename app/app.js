const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const http = require("http");
const webSocket = require("ws");
const server = http.createServer(app);
const { initializeSocket } = require("./util/socketHandler");

require("../db/connect");

const teacherRoutes = require("../routes/teacher.routes");
const studentRoutes = require("../routes/student.routes");


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../uploads")));

app.use("/api/teacher/", teacherRoutes);
app.use("/api/student/", studentRoutes);
app.use("/api/connection/", require("../routes/connectionBetweenS&T.routes"));

app.use("/api/zoom/", require("../routes/zoom.routes"));



const wss = new webSocket.Server({ server });
initializeSocket(wss);

app.all("*", (req, res) => {
  res.status(404).send({
    apisStatus: false,
    message: "Invalid URL",
    data: {},
  });
});
module.exports = app;

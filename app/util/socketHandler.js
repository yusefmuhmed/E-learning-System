// Server side
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3030 });

let clients = {};

const initializeSocket = () => {
  wss.on("connection", (socket, req) => {
    console.log("New client connected:", req.socket.remoteAddress);

    socket.on("message", (message) => {
      const data = JSON.parse(message);

      if (data.type === "register") {
        if (data.role === "teacher") {
          teacherSocket = socket;
        } else {
          clients[data.studentId] = socket;
        }
      } else if (data.type === "studentNotification") {
        if (teacherSocket) {
          teacherSocket.send(
            JSON.stringify({ type: "notification", studentId: data.studentId })
          );
        }
      } else if (data.type === "teacherResponse") {
        const studentSocket = clients[data.studentId];
        if (studentSocket) {
          studentSocket.send(
            JSON.stringify({ type: "response", response: data.response })
          );
        }
      }
    });

    socket.on("close", () => {
      console.log("Client disconnected");
      if (socket === teacherSocket) {
        teacherSocket = null;
      } else {
        for (let studentId in clients) {
          if (clients[studentId] === socket) {
            delete clients[studentId];
          }
        }
      }
    });
  });
};

module.exports = { initializeSocket, clients };

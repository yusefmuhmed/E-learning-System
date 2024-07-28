require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app); // Create HTTP server
const wss = new WebSocket.Server({ server }); // Attach WebSocket server to HTTP server

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

let teacherSocket = null;
const clients = {};

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
                teacherSocket.send(JSON.stringify({ type: "notification", studentId: data.studentId }));
            }
        } else if (data.type === "teacherResponse") {
            const studentSocket = clients[data.studentId];
            if (studentSocket) {
                studentSocket.send(JSON.stringify({ type: "response", response: data.response }));
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

// Serve your existing routes
require("./app/app")(app);
require('./db/connect');


// Start the server
server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

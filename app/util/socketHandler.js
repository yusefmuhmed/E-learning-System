// Server side
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3030 });

let clients = {};

const initializeSocket = () => {
  wss.on('connection', (socket) => {
    console.log('New client connected:', socket._socket.remoteAddress);

    socket.send('Send something');

    socket.on('message', (binaryData) => {
      const message = Buffer.from(binaryData).toString('utf8');
      const data = JSON.parse(message);
      if (data.type === 'connect_to_teacher') {
        // Forward the request to the teacher
        const teacherSocket = clients['teacher'];  // assuming the teacher's ID is 'teacher'
        if (teacherSocket) {
          teacherSocket.send(JSON.stringify({
            type: 'connection_request',
            studentId: data.studentId
          }));
        }
      } else if (data.type === 'connect_response') {
        const studentSocket = clients[data.studentId];
        if (studentSocket) {
          studentSocket.send(JSON.stringify({
            type: 'connect_response',
            response: data.response
          }));
        }
      }
    });

    socket.on('close', () => {
      for (let clientId in clients) {
        if (clients[clientId] === socket) {
          delete clients[clientId];
          console.log('User disconnected:', clientId);
        }
      }
    });

    // Assuming the teacher's ID is 'teacher', register the teacher's socket on connection
    if (socket._socket.remoteAddress === '::1') {
      clients['teacher'] = socket;
      console.log('Teacher connected');
    }
  });
};

module.exports = { initializeSocket, clients };
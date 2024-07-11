let clients = {};

const initializeSocket = (wss) => {
  wss.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    wss.send('Send something')

    socket.on('register', (data) => {
      clients[data.userId] = socket;
      console.log('User registered:', data.userId);
    });

    socket.on('disconnect', () => {
      for (let userId in clients) {
        if (clients[userId].id === socket.id) {
          delete clients[userId];
          console.log('User disconnected:', userId);
        }
      }
    });
  });
};

module.exports = { initializeSocket, clients };

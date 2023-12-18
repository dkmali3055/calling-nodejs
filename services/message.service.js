const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');
const socketio = require('socket.io');
const jwt_SECRET_KEY = process.env.jwt_SECRET_KEY;

// Function to create socket connection with JWT authentication
const createSocketConnection = (server) => {
    const io = socketio(server, {
        cors: {
          origin: "*",
        },
      });

    io.use(socketioJwt.authorize({
        secret: jwt_SECRET_KEY,
        handshake: true,
    }));

    io.on('connection', (socket) => {
        // Handle socket connection events here
        console.log('Socket connected:', socket.decoded_token);

        // Example: Emit a welcome message to the connected client
        socket.emit('message', 'Welcome to the socket connection!');

    });

    return io;
};

module.exports = createSocketConnection;

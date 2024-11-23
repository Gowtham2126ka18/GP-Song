const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (if necessary)
app.use(express.static('public'));

// Example room route
app.get('/room/:roomId', (req, res) => {
    res.send(`Welcome to room ${req.params.roomId}`);
});

// Handle socket connection
io.on('connection', (socket) => {
    console.log('New user connected');

    // Join a room
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // Play song event (sync with other users in the room)
    socket.on('playSong', (songUri, roomId) => {
        // Broadcast the song to all users in the room
        io.to(roomId).emit('songPlaying', songUri);
        console.log(`Song playing: ${songUri}`);
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

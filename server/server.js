const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
// const io = socketIO(server);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = 3000;

app.use(express.static('public')); // serve frontend

// Emit random temperature every minute (for demo, we’ll do every 5s)
setInterval(() => {
    const temp = (Math.random() * 40 + 5).toFixed(1); // 5°C to 45°C
    const timestamp = new Date().toLocaleTimeString();
    console.log(`Temperature: ${temp}°C at ${timestamp}`);

    io.emit('temperature', { temp: Number(temp), time: timestamp });
}, 5000); // every 5 seconds

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

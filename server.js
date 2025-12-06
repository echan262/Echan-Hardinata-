const express = require("express");
const app = express();
const http = require("http").createServer(app);

// FIX PENTING UNTUK RENDER (CORS WAJIB)
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Serve public folder
app.use(express.static("public"));

// Socket.io
io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("message", (msg) => {
        io.emit("message", msg);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// Jalankan server
http.listen(PORT, () => {
    console.log("Server running on port", PORT);
});

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("message", (msg) => {
        io.emit("message", msg);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

http.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("join", (data) => {
        io.emit("chat message", {
            username: "System",
            avatar: "",
            text: `${data.username} joined the chat`
        });
    });

    socket.on("chat message", (data) => {
        socket.broadcast.emit("chat message", data);
    });

    socket.on("typing", (username) => {
        socket.broadcast.emit("typing", username);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

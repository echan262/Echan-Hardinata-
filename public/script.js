const socket = io();

// kirim pesan
document.getElementById("sendBtn").onclick = () => {
    const msg = messageInput.value;
    socket.emit("message", msg);
};

// tampilkan pesan
socket.on("message", (msg) => {
    const chatBox = document.getElementById("messages");
    chatBox.innerHTML += `<div>${msg}</div>`;
});

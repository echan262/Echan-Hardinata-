let socket = io();

function sendMessage() {
    let msg = document.getElementById("msg").value;

    if (msg.trim() !== "") {
        socket.emit("message", msg);
        document.getElementById("msg").value = "";
    }
}

socket.on("message", (msg) => {
    let box = document.getElementById("messages");
    box.innerHTML += `<div>${msg}</div>`;
    box.scrollTop = box.scrollHeight;
});
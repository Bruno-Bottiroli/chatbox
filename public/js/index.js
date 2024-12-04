
const socket = io();

let user;
let chatBox = document.getElementById("chatBox");
let participantList = document.getElementById("participantList");

swal.fire({
    title: "Identifícate",
    input: "text",
    text: "Ingresa tu nombre de usuario",
    inputValidator: (value) => {
        if (!value.trim()) {
            return "Por favor ingresa un nombre de usuario válido";
        }
    },
    allowOutsideClick: false
}).then((result) => {
    user = result.value;
    socket.emit("newUser", user);
});

chatBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && chatBox.value.trim().length > 0) {
        socket.emit("message", { user: user, text: chatBox.value });
        chatBox.value = "";
    }
});

// Mostrar lista de participantes
socket.on("updateParticipants", (participants) => {
    participantList.innerHTML = ""; 
    participants.forEach(participant => {
        let participantItem = document.createElement("li");
        participantItem.className = "participant-item";
        participantItem.innerHTML = `
            <div class="participant-circle"></div>
            <span class="fs-5 white">${participant}</span>
        `;
        participantList.appendChild(participantItem);
    });
});

socket.on("messageLogs", (data) => {
    let messageLogs = document.getElementById("messageLogs");
    let messages = "";

    data.forEach((messageLog) => {
        
        const isMyMessage = messageLog.user === user; 
        const alignmentClass = isMyMessage ? "message-right" : "message-left";

        messages += `
        <div class="message ${alignmentClass}">
            <div class="message-header">
                <strong>${messageLog.user}</strong>
            </div>
            <div class="message-body">
                ${messageLog.text}
            </div>
        </div>`;
    });

    messageLogs.innerHTML = messages;
    messageLogs.scrollTop = messageLogs.scrollHeight;
});

socket.on("newUser", (data) => {
    swal.fire({
        text: `Se conectó ${data}`,
        toast: true,
        position: "top-right",
        timer: 2000
    });
});
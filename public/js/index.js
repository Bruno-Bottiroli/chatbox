
const socket = io()

let user

let chatBox = document.getElementById("chatBox")

swal.fire({
    title: "identificate",
    input : "text",
    text : "ingrese su nombre de usuario",
    inputValidator : (value)=>{
        return !value && "Por favor ingrese el nombre de usuario"
    },
    allowOutsideClick : false
}).then((result)=>{
    user = result.value
    socket.emit("newUser", user)
})

chatBox.addEventListener("keyup", (event)=>{
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            socket.emit("message", {user : user, message : chatBox.value})
            chatBox.value = ""
        }
    }
})

socket.on("messageLogs", (data)=>{
    let messageLogs = document.getElementById("messageLogs")
    let messages = ""
    data.forEach((messageLog) => {
        messages = messages + `${messageLog.user} dice: ${messageLog.message}<br>`
    });

    messageLogs.innerHTML = messages
})

socket.on("newUser", (data)=>{
    swal.fire({
        text: `se conecto ${data}`,
        toast : true,
        position : "top-right",
        timer: 2000
    })
})
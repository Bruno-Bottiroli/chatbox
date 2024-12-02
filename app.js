import express from "express"
import handlebars from "express-handlebars"
import {  Server, Socket  } from "socket.io"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))

app.engine("handlebars", handlebars.engine())
app.set("views", "./src/views")
app.set("view engine", "handlebars")

app.get("/", (req, res)=>{
    res.render("index")
})


const port = 8080

const httpServer = app.listen(port, ()=>{
    console.log("server andando")
})

const io = new Server(httpServer)

let messages = []

io.on("connection", (socket)=>{
    console.log("nuevo cliente")

    socket.on("newUser", (data)=>{
        socket.broadcast.emit("newUser", data)
    })

    socket.on("message", (data)=>{
        messages.push(data)
        io.emit("messageLogs", messages)
    })
})


import express from "express";
import { createServer } from "http"; 
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import MessageManager from "./MessageManager.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const messageManager = new MessageManager("./messages.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("index");
});

let participants = []; 

io.on("connection", async (socket) => {
  console.log("nuevo cliente conectado");

  try {
    const messages = await messageManager.getMessages();
    socket.emit("messageLogs", messages);
  } catch (error) {
    console.error("Error leyendo el archivo de mensajes:", error);
  }

  socket.on("newUser", (data) => {
    participants.push(data);
    io.emit("updateParticipants", participants);
    socket.broadcast.emit("newUser", data);

    socket.on("disconnect", () => {
      participants = participants.filter((participant) => participant !== data);
      io.emit("updateParticipants", participants);
    });
  });

  socket.on("message", async (data) => {
    try {
      await messageManager.saveMessage(data);
      const messages = await messageManager.getMessages();
      io.emit("messageLogs", messages);
    } catch (error) {
      console.error("Error guardando o leyendo mensajes:", error);
    }
  });
});


const port = 8080;
httpServer.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

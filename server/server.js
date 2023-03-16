const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const userRoute = require("./routes/userRoutes");
const gameSocket = require("./sockets/gameSocket");


const app = express();
app.use(bodyParser.json());
const server = http.createServer(app);
const io = socketio(server);

gameSocket(io)
app.use("/users", userRoute);

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

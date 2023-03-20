const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const db = require("./models");
const userRoute = require("./routes/userRoutes");
//const gameSocket = require("./sockets/gameSocket");
let { gameSocket, isPrivateRoomAvailable } = require("./sockets/gameSocket");

var cors = require("cors");
var app = express();

app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);
const io = socketio(server);

db.sequelize
  .sync({ force: false, alter: true })
  .then(() => {
    console.log("Database is synced.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

gameSocket(io);

app.use("/users", userRoute);

app.get("/check-room-availability/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  console.log(roomId);
  res.status(200).json({ message: isPrivateRoomAvailable(roomId) });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

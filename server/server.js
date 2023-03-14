const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let text = ""; // the text that needs to be typed by the players
const MAX_PLAYERS_PER_ROOM = 2; // maximum number of players per room
const rooms = []; // list of all active rooms

// generate a random text for the game
const generateText = () => {
  const words = [
    "apple",
    "banana",
    "cherry",
    "durian",
    "elderberry",
    "fig",
    "grape",
    "honeydew",
    "kiwi",
    "lemon",
    "mango",
    "nectarine",
    "orange",
    "pear",
    "quince",
    "raspberry",
    "strawberry",
    "tangerine",
    "watermelon",
  ];
  const textLength = Math.floor(Math.random() * 6) + 15; // generate a random number between 15-20
  let text = "";
  for (let i = 0; i < textLength; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    text += words[randomIndex] + " ";
  }
  // return text.trim();
  return "The great in your life comes when you realize that you can learn anything you need to learn to accomplish any goal that you set for yourself.";
};

const calculateProgress = (text, progress) => {
  // const correctChars = text
  //   .slice(0, progress.length)
  //   .split("")
  //   .filter((char, i) => char === progress[i]).length;
  let correctChars = 0;
  for (let i = 0; i < text.length; i++) {
    const char1 = text[i];
    const char2 = progress[i];
    if (char1 !== char2) {
      break;
    }
    correctChars += 1;
  }
  const percentage = (correctChars / text.length) * 100;
  return `${percentage.toFixed(2)}%`;
};

// update the player's progress and emit the updated list of players to all clients
const updateProgress = (socket, progress) => {
  const room = rooms.find(
    (r) => r.players && r.players.some((p) => p.id === socket.id)
  );
  if (room) {
    const player = room.players.find((p) => p.id === socket.id);
    if (player) {
      let wps = 0;
      player.progress = calculateProgress(room.text, progress);
      if (room.startTime) {
        const elapsedTime = (Date.now() - room.startTime) / 1000; // Convert to seconds
        console.log(
          Date.now(),
          room.startTime,
          (Date.now() - room.startTime) / 1000,
          progress
            .trim()
            .replace(/(\r\n|\n|\r)/gm, "")
            .split(" ").length,
          elapsedTime / 60,
          Math.round(
            progress
              .trim()
              .replace(/(\r\n|\n|\r)/gm, "")
              .split(" ").length /
              (elapsedTime / 60)
          )
        );
        wps = Math.round(
          progress
            .trim()
            .replace(/(\r\n|\n|\r)/gm, "")
            .split(" ").length /
            (elapsedTime / 60)
        );
      }
      player.wps = wps;
      io.to(`room-${room.id}`).emit("players", {
        players: room.players,
        startTime: room.startTime,
      });
    }
  }
};

const findAvailableRoom = () => {
  let roomId;
  for (const room of rooms) {
    if (room?.players?.length < MAX_PLAYERS_PER_ROOM) {
      roomId = room.id;
      break;
    }
  }
  if (roomId == undefined) {
    roomId = rooms.length;
  }
  return roomId;
};

io.on("connection", (socket) => {
  console.log(`A new client has connected with id ${socket.id}`);

  const roomId = findAvailableRoom();
  if (!rooms[roomId]) {
    rooms[roomId] = { id: roomId, players: [], text: "" };
  }

  rooms[roomId].players.push({
    id: socket.id,
    name: `Player ${rooms[roomId].players.length + 1}`,
    progress: "",
  });
  socket.join(`room-${roomId}`);
  socket.emit("joinedRoom", roomId);
  io.to(`room-${roomId}`).emit("text", "Waiting for players");
  console.log(roomId, rooms);
  if (rooms[roomId].players.length == MAX_PLAYERS_PER_ROOM) {
    rooms[roomId].id = roomId;
    rooms[roomId].text = generateText();
    rooms[roomId].startTime = Date.now();
    rooms[roomId].players = rooms[roomId].players.map((player) => ({
      ...player,
      progress: "",
    }));
    console.log(rooms);
    io.to(`room-${roomId}`).emit("text", rooms[roomId].text);
    io.to(`room-${roomId}`).emit("players", {
      players: rooms[roomId].players,
      startTime: rooms[roomId].startTime,
    });
  }

  // handle the update progress event
  socket.on("updateProgress", (progress) => {
    updateProgress(socket, progress, roomId);
  });

  // handle the start game event
  // socket.on("startGame", () => {
  //   rooms[roomId].id = roomId;
  //   rooms[roomId].text = generateText();
  //   rooms[roomId].startTime = Date.now();
  //   rooms[roomId].players = rooms[roomId].players.map((player) => ({
  //     ...player,
  //     progress: "",
  //   }));
  //   console.log(rooms);
  //   io.to(`room-${roomId}`).emit("text", rooms[roomId].text);
  //   io.to(`room-${roomId}`).emit("players", {
  //     players: rooms[roomId].players,
  //     startTime: rooms[roomId].startTime,
  //   });
  // });

  socket.on("disconnect", () => {
    console.log(`The client with id ${socket.id} has disconnected`);

    // remove the player from the room and emit the updated list to all clients in the room
    const playerIndex = rooms[roomId].players.findIndex(
      (player) => player.id === socket.id
    );
    if (playerIndex !== -1) {
      rooms[roomId].players.splice(playerIndex, 1);
      io.to(`room-${roomId}`).emit("players", {
        players: rooms[roomId].players,
        startTime: rooms[roomId].startTime,
      });
    }

    // if the room is now empty, delete it
    if (rooms[roomId].players.length === 0) {
      // delete rooms[roomId];
    }
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

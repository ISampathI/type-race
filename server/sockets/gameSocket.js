let text = "";
const MAX_PLAYERS_PER_ROOM = 2;
const publicRooms = [];
const privateRooms = [];
const soloRooms = [];

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

const findAvailableRoom = (rooms) => {
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

module.exports = (io) => {
  const updateProgress = (socket, progress, rooms) => {
    const room = rooms.find(
      (r) => r.players && r.players.some((p) => p.id === socket.id)
    );
    if (room) {
      const player = room.players.find((p) => p.id === socket.id);
      if (player) {
        let wpm = 0;
        player.progress = calculateProgress(room.text, progress);
        if (room.startTime) {
          const elapsedTime = (Date.now() - room.startTime) / 1000; // Convert to seconds
          wpm = Math.round(
            progress
              .trim()
              .replace(/(\r\n|\n|\r)/gm, "")
              .split(" ").length /
              (elapsedTime / 60)
          );
        }
        player.wpm = wpm;
        io.to(`room-${room.id}`).emit("players", {
          players: room.players,
          startTime: room.startTime,
          status: room.status,
        });
      }
    }
  };

  io.on("connection", (socket) => {
    console.log(`A new client has connected with id ${socket.id}`);
    const username = socket.handshake.query.username;
    const character = socket.handshake.query.character;
    const roomType = socket.handshake.query.gameType;
    let rooms = [];

    if (roomType == 0) {
      rooms = publicRooms;
    } else if (roomType == 1) {
      rooms = privateRooms;
    } else if (roomType == 2) {
      rooms = soloRooms;
    }
    const roomId = findAvailableRoom(rooms);
    if (!rooms[roomId]) {
      rooms[roomId] = {
        id: roomId,
        players: [],
        text: "",
        status: { status: 0 },
      };
    }

    rooms[roomId].players.push({
      id: socket.id,
      name: username,
      progress: "",
      character: character,
    });
    socket.join(`room-${roomId}`);
    //socket.emit("joinedRoom", roomId);
    io.to(`room-${roomId}`).emit("text", "Waiting for players");
    if (rooms[roomId].players.length == MAX_PLAYERS_PER_ROOM || roomType == 2) {
      rooms[roomId].id = roomId;
      rooms[roomId].text = generateText();
      rooms[roomId].startTime = Date.now();
      rooms[roomId].status = { status: 1 };
      rooms[roomId].players = rooms[roomId].players.map((player) => ({
        ...player,
        progress: "",
      }));
      io.to(`room-${roomId}`).emit("text", rooms[roomId].text);
      io.to(`room-${roomId}`).emit("players", {
        players: rooms[roomId].players,
        status: rooms[roomId].status,
        startTime: rooms[roomId].startTime,
      });
    } else {
      io.to(`room-${roomId}`).emit("players", {
        players: rooms[roomId].players,
        status: rooms[roomId].status,
      });
    }
    console.log({
      players: rooms[roomId].players,
      status: rooms[roomId].status,
      publicRooms: publicRooms,
      privateRooms: privateRooms,
      soloRooms: soloRooms,
    });

    // handle the update progress event
    socket.on("updateProgress", (progress) => {
      updateProgress(socket, progress, rooms);
    });

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
          status: rooms[roomId].status,
        });
      }

      // if the room is now empty, delete it
      if (rooms[roomId].players.length === 0) {
        rooms[roomId].status.status = 0;
        // delete rooms[roomId];
      }
    });
  });
};

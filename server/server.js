const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let text = ''; // the text that needs to be typed by the players
let players = []; // an array to store the current status of each player's typing progress

// generate a random text for the game
const generateText = () => {
  const words = ['apple', 'banana', 'cherry', 'durian', 'elderberry', 'fig', 'grape', 'honeydew'];
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

// update the player's progress and emit the updated list of players to all clients
const updateProgress = (socket, progress) => {
  const playerIndex = players.findIndex((player) => player.id === socket.id);
  if (playerIndex !== -1) {
    players[playerIndex].progress = progress;
    io.emit('players', players);
  }
};

io.on('connection', (socket) => {
  console.log(`A new client has connected with id ${socket.id}`);

  // add the new player to the list of players and emit the updated list to all clients
  players.push({ id: socket.id, name: `Player ${players.length + 1}`, progress: '' });
  io.emit('players', players);

  // send the current text to the new player
  socket.emit('text', text);

  // handle the update progress event
  socket.on('updateProgress', (progress) => {
    updateProgress(socket, progress);
  });

  // handle the start game event
  socket.on('startGame', () => {
    text = generateText();
    players = players.map((player) => ({ ...player, progress: '' }));
    io.emit('text', text);
    io.emit('players', players);
  });

  socket.on('disconnect', () => {
    console.log(`The client with id ${socket.id} has disconnected`);

    // remove the player from the list of players and emit the updated list to all clients
    players = players.filter((player) => player.id !== socket.id);
    io.emit('players', players);
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 3000');
});

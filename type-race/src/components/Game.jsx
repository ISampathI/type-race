import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./game.scss";

// const socket = io("http://localhost:5000", {
//   transports: ["websocket", "polling", "flashsocket"],
// });

const TyperaceMultiplayer = () => {
  const [text, setText] = useState("");
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (socket !== null) {
      socket.on("players", (gameData) => {
        setPlayers(gameData.players);
        console.log(gameData.players);
      });

      socket.on("text", (text) => {
        setText(text);
      });
    }
  }, [socket]);

  const handleInputChange = (event) => {
    // update the current player's typing progress and send it to the server via socket.io
    socket.emit("updateProgress", event.target.value);
  };

  return (
    <div className="Game">
      <h1>Typerace Multiplayer Game</h1>
      <button
        onClick={() =>
          setSocket(
            io("http://localhost:5000", {
              transports: ["websocket", "polling", "flashsocket"],
            })
          )
        }
      >
        Start Game
      </button>
      <br />
      <p>{text}</p>
      <textarea onChange={handleInputChange} />
      <h2>Scoreboard</h2>
      {/* <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name}: {player.progress}
          </li>
        ))}
      </ul> */}
      <ul className="car-tracks">
        {players.map((player) => (
          <li key={player.id}>
            {player.name}: {player.progress} - {player.wps || 0}wps
            <div className="car-track">
              {" "}
              <div className="car" style={{ marginLeft: player.progress }}>
                🚗
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TyperaceMultiplayer;

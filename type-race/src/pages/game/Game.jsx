import React, { useContext, useEffect, useState } from "react";
import "./game.scss";
import starsImg from "../../assets/img/background/stars.png";
import rocket1 from "../../assets/img/rockets/rocket1.png";
import rocket2 from "../../assets/img/rockets/rocket2.png";
import rocket3 from "../../assets/img/rockets/rocket3.png";
import rocket4 from "../../assets/img/rockets/rocket4.png";
import rocket5 from "../../assets/img/rockets/rocket5.png";
import rocket6 from "../../assets/img/rockets/rocket6.png";
import rocket7 from "../../assets/img/rockets/rocket7.png";
import rocket8 from "../../assets/img/rockets/rocket8.png";
import rocket9 from "../../assets/img/rockets/rocket9.png";
import Rocket from "./components/rocket/Rocket";
import io from "socket.io-client";
import { PlayerPosContext, UserContext } from "../../helper/context";

const rocketList = [
  rocket1,
  rocket2,
  rocket3,
  rocket4,
  rocket5,
  rocket6,
  rocket7,
  rocket8,
  rocket9,
];

function Game() {
  const { user, setUser } = useContext(UserContext);
  const { playerPos, setPlayerPos } = useContext(PlayerPosContext);
  // const [isConnected, setIsConnected] = useState(socket.connected);

  const [text, setText] = useState("");
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(null);

  const [player1, setPlayer1] = useState({
    userName: "player1",
    character: 0,
    realPos: 0,
    relativePos: 0,
  });
  const [player2, setPlayer2] = useState({
    userName: "player2",
    character: 0,
    realPos: 0,
    relativePos: 0,
  });
  const [player3, setPlayer3] = useState({
    userName: "player3",
    character: 0,
    realPos: 0,
    relativePos: 0,
  });
  const [player4, setPlayer4] = useState({
    userName: "player4",
    character: 0,
    realPos: 0,
    relativePos: 0,
  });

  // useEffect(() => {
  //   console.log("@@@@@", user);
  //   if (user?.username) {
  //     setSocket(
  //       io("http://localhost:5000", {
  //         transports: ["websocket", "polling", "flashsocket"],
  //       })
  //     )
  //   }
  // }, [user]);

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
    socket.emit("updateProgress", event.target.value);
  };

  return (
    <div className="Game">
      <img src={starsImg} alt="" className="background-stars" />
      <div className="text-space">
        <button
          onClick={() =>
            setSocket(
              io("http://localhost:5000", {
                transports: ["websocket", "polling", "flashsocket"],
                query: {
                  username: user.username || "guest",
                  character: user.character || 0,
                },
              })
            )
          }
        >
          Start Game
        </button>
        <div className="reading-para">{text}</div>
        <textarea
          className="typing-para"
          name=""
          id=""
          cols="30"
          rows="10"
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div className="rocket-tracks">
        {players.map((player) => (
          <div
            className="ship"
            style={{
              marginBottom: player.progress,
            }}
          >
            {player.name}: {player.progress}
            <Rocket rocket={rocketList[player.character || 0]} />
            {player.wpm}wpm
          </div>
        ))}
        {/* <div className="ship my-ship" style={{ marginBottom: `${0}%` }}>
          <Rocket rocket={rocketList[user.character]} />
        </div> */}
        {/* <div
          className="ship"
          style={{ marginBottom: `${Math.abs(playerPos - player3Yc)}%` }}
        >
          <Rocket rocket={rocketList[3]} />
        </div>
        <div
          className="ship"
          style={{ marginBottom: `${Math.abs(playerPos - player4Yc)}%` }}
        >
          <Rocket rocket={rocketList[4]} />
        </div> */}
      </div>
    </div>
  );
}

export default Game;

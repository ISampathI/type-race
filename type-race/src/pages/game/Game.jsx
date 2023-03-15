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
import earth from "../../assets/img/space/earth.png";
import Rocket from "./components/rocket/Rocket";
import io from "socket.io-client";
import {
  PlayerPosContext,
  SocketContext,
  UserContext,
} from "../../helper/context";

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
const calculateProgress = (text, progress) => {
  let ptext = "";
  for (let i = 0; i < text.length; i++) {
    const char1 = text[i];
    const char2 = progress[i];
    if (char1 !== char2) {
      break;
    }
    ptext += text[i];
  }
  return ptext;
};
function Game() {
  const { user, setUser } = useContext(UserContext);
  const { socket, setSocket } = useContext(SocketContext);
  const [isConnected, setIsConnected] = useState(false);

  const [text, setText] = useState("");
  const [progress, setProgress] = useState("");
  const [players, setPlayers] = useState([]);
  const [gameStatus, setGameStatus] = useState({ status: 0 });

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
        setGameStatus(gameData.status);
      });

      socket.on("text", (text) => {
        setText(text);
      });
    }
  }, [socket]);

  const handleInputChange = (event) => {
    socket.emit("updateProgress", event.target.value);
    setProgress(calculateProgress(text, event.target.value));
  };

  return (
    <div className="Game">
      <img src={starsImg} alt="" className="background-stars" />
      <div
        className={
          gameStatus.status == 0
            ? "rocket-tracks rocket-tracks-in-wating"
            : "rocket-tracks rocket-tracks-in-start"
        }
      >
        <div className="earth-img">
          <img src={earth} alt="" />
        </div>
        <div className="player-track-list">
          {players.map((player) => (
            <div
              className="ship"
              style={{
                marginLeft: player.progress,
              }}
            >
              <Rocket rocket={rocketList[player.character || 0]} />
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-container">
        {gameStatus.status == 2 && (
          <div className="text-space">
            <div className="reading-para" style={{ textAlign: "center" }}>
              {text}
            </div>
          </div>
        )}
        {gameStatus.status == 1 && (
          <div className="text-space">
            <div className="reading-para">
              <span className="reading-para-1">{progress}</span>
              <span className="reading-para-2">
                {text.replace(progress, "").split(" ")[0]}
              </span>
              <span className="reading-para-3">
                {text
                  .replace(progress, "")
                  .replace(text.replace(progress, "").split(" ")[0], "")}
              </span>
            </div>
            <textarea
              className="typing-para"
              name=""
              id=""
              cols="30"
              rows="10"
              value={progress}
              onChange={handleInputChange}
            ></textarea>
          </div>
        )}
        {gameStatus.status == 1 && (
          <div className="players-status">
            <ul>
              {players.map((player) => (
                <li>
                  {player.name}: {player.progress}- {player.wpm}wpm
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;

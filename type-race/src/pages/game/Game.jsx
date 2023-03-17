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
import Modal from "react-modal";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Ripples from "react-ripples";
import {
  PlayerPosContext,
  SocketContext,
  UserContext,
} from "../../helper/context";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

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
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);
  const { socket, setSocket } = useContext(SocketContext);
  const [isConnected, setIsConnected] = useState(false);

  const [text, setText] = useState("");
  const [progress, setProgress] = useState("");
  const [players, setPlayers] = useState([]);
  const [gameStatus, setGameStatus] = useState({ status: 0 });
  const [roomId, setRoomId] = useState();
  const [isModalOpen, setIsModalOpen] = useState({
    modal1: false,
    madal2: false,
  });

  const [username, setUsername] = useState("player");
  const [rocket, setRocket] = useState(0);
  const [gameType, setGameType] = useState(0);

  var { qrid } = useParams();

  useEffect(() => {
    if (qrid) {
      setRoomId(qrid);
      axios
        .get(`http://192.168.1.102:5000/check-room-availability/${qrid}`)
        .then((res) => {
          console.log(res.data);
          if (res.data.message.availability) {
            setPlayers(res.data.message.data.players);
            setGameStatus(res.data.message.data.status);
            handleModalOpen("modal2");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [qrid]);

  useEffect(() => {
    if (socket !== null) {
      socket.on("players", (gameData) => {
        setPlayers(gameData.players);
        setGameStatus(gameData.status);
      });

      socket.on("text", (text) => {
        setText(text);
        handleModalClose("modal1");
        handleModalClose("modal2");
      });

      socket.on("joinedRoom", (roomId) => {
        setRoomId(roomId);
        handleModalClose("modal1");
        handleModalClose("modal2");
        console.log(roomId);
      });
    } else {
      !qrid && navigate("/");
    }
  }, [socket]);

  const handleInputChange = (event) => {
    socket.emit("updateProgress", event.target.value);
    setProgress(calculateProgress(text, event.target.value));
  };

  const handleModalOpen = (modal) => {
    setIsModalOpen((prev) => ({ ...prev, [modal]: true }));
  };
  const handleModalClose = (modal) => {
    setIsModalOpen((prev) => ({ ...prev, [modal]: false }));
  };

  const changeRocket = (left = true) => {
    if (left) {
      rocket == 0 ? setRocket(rocketList.length - 1) : setRocket(rocket - 1);
    } else {
      rocket == rocketList.length - 1 ? setRocket(0) : setRocket(rocket + 1);
    }
  };

  const handleSubmit = (e) => {
    console.log("mmmm");
    e.preventDefault();
    setUser({ username: username, character: rocket });
    setSocket(
      io("http://192.168.1.102:5000", {
        transports: ["websocket", "polling", "flashsocket"],
        query: {
          username: username || "guest",
          character: rocket || 0,
          gameType: 1,
          roomId: roomId,
        },
      })
    );
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
          <img
            src={earth}
            alt=""
            onClick={() => {
              handleModalOpen("modal1");
            }}
          />
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
        <div className="players-status">
          <ul>
            {players.map((player) => (
              <li>
                {player.name}: {player.wpm || 0} wpm
              </li>
            ))}
          </ul>
        </div>

        <div className="spacer-r"></div>
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
        {/* {gameStatus.status == 1 && (
          <div className="players-status">
            <ul>
              {players.map((player) => (
                <li>
                  {player.name}: {player.wpm || 0} wpm
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
      <Modal
        isOpen={isModalOpen.modal2}
        className="Modal"
        overlayClassName="modal-overlay"
        contentLabel="Player Details Modal"
      >
        <div className="player-details-modal">
          <div className="join-form">
            <form onSubmit={handleSubmit}>
              <div className="select-rocket">
                <div className="left-switch-btn switch-btn">
                  <i
                    className="fa-solid fa-angle-left"
                    onClick={() => changeRocket()}
                  ></i>
                </div>
                <img src={rocketList[rocket]} alt="" className="rocket-img" />
                <div className="right-switch-btn switch-btn">
                  <i
                    className="fa-solid fa-angle-right"
                    onClick={() => changeRocket(false)}
                  ></i>
                </div>
              </div>
              <div className="column">
                <input
                  type="text"
                  placeholder="Name"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
                <div className="spacer-l"></div>
                <input
                  type="submit"
                  value="Join"
                  name="submit"
                  onClick={() => setGameType(0)}
                />
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isModalOpen.modal1}
        onRequestClose={() => {
          handleModalClose("modal1");
        }}
        className="Modal"
        overlayClassName="modal-overlay"
        contentLabel="Link Share Modal"
      >
        <div className="link-share-modal">
          <div className="title">Share this link via</div>
          <div className="links">
            <FacebookShareButton
              url={window.location.href}
              quote={"check this out!"}
              hashtag="hireNow"
            >
              <FacebookIcon size={45} round />
            </FacebookShareButton>
            <TelegramShareButton
              url={window.location.href}
              quote={"check this out!"}
              hashtag="hireNow"
            >
              <TelegramIcon size={45} round />
            </TelegramShareButton>
            <TwitterShareButton
              url={window.location.href}
              quote={"check this out!"}
              hashtag="hireNow"
            >
              <TwitterIcon size={45} round />
            </TwitterShareButton>
            <WhatsappShareButton
              url={window.location.href}
              quote={"check this out!"}
              hashtag="hireNow"
            >
              <WhatsappIcon size={45} round />
            </WhatsappShareButton>
            <EmailShareButton
              url={window.location.href}
              quote={"check this out!"}
              hashtag="hireNow"
            >
              <EmailIcon size={45} round />
            </EmailShareButton>
          </div>
          <div className="title">Or copy link</div>
          <div className="copy-row">
            <i class="fa-solid fa-link"></i>
            <input value={`${window.location.href}/${roomId}`} type="text" />
            <Ripples
              className="riple-btn"
              color="rgba(255,255,255, 0.5)"
              during={1200}
            >
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.href}/${roomId}`
                  );
                }}
              >
                copy
              </button>
            </Ripples>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Game;

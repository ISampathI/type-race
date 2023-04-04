import React, { useContext, useEffect, useState } from "react";
import "./land.scss";
import rocket1 from "../../../assets/img/rockets/rocket1.png";
import rocket2 from "../../../assets/img/rockets/rocket2.png";
import rocket3 from "../../../assets/img/rockets/rocket3.png";
import rocket4 from "../../../assets/img/rockets/rocket4.png";
import rocket5 from "../../../assets/img/rockets/rocket5.png";
import rocket6 from "../../../assets/img/rockets/rocket6.png";
import rocket7 from "../../../assets/img/rockets/rocket7.png";
import rocket8 from "../../../assets/img/rockets/rocket8.png";
import rocket9 from "../../../assets/img/rockets/rocket9.png";
import planet from "../../../assets/img/space/planet.png";
import { useNavigate } from "react-router-dom";
import { SocketContext, UserContext } from "../../../helper/context";
import io from "socket.io-client";

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

function Land() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { socket, setSocket } = useContext(SocketContext);

  const [username, setUsername] = useState("guest");
  const [rocket, setRocket] = useState(0);
  const [gameType, setGameType] = useState(0);

  useEffect(() => {
    socket?.disconnect();
  }, []);

  useEffect(() => {
    console.log(username, user.username);
    setUsername(user.username || "guest");
  }, [user.username]);

  const changeRocket = (left = true) => {
    if (left) {
      rocket == 0 ? setRocket(rocketList.length - 1) : setRocket(rocket - 1);
    } else {
      rocket == rocketList.length - 1 ? setRocket(0) : setRocket(rocket + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ username: username, character: rocket });
    setSocket(
      io("http://localhost:5000", {
        transports: ["websocket", "polling", "flashsocket"],
        query: {
          username: username || "guest",
          character: rocket || 0,
          gameType: gameType,
        },
      })
    );
    navigate("play");
  };

  return (
    <div className="Land">
      <img src={planet} alt="" className="planet-img" />
      <div className="join-form">
        <div className="form-title">Play Now</div>
        <p>
          Multiplayer typing challenge. Test your skills, compete with friends,
          and improve your typing speed and accuracy!
        </p>
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
          <div className="row">
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
              value="Play As Guest"
              name="submit"
              onClick={() => setGameType(0)}
            />
          </div>
          <div className="row" style={{ height: "20px" }}></div>
          <div className="row">
            <input
              type="submit"
              value="Play Solo"
              name="submit"
              onClick={() => setGameType(2)}
            />
            <div className="spacer-l"></div>
            <input
              type="submit"
              value="Play With Friends"
              name="submit"
              onClick={() => setGameType(1)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Land;

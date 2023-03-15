import React, { useContext, useState } from "react";
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
import { UserContext } from "../../../helper/context";

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
  const [username, setUsername] = useState("player");
  const { user, setUser } = useContext(UserContext);
  const [rocket, setRocket] = useState(0);

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
    navigate("play");
  };

  return (
    <div className="Land">
      <img src={planet} alt="" className="planet-img" />
      <div className="join-form">
        <div className="form-title">Play Now</div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
          placeat reiciendis assumenda culpa, itaque ipsum
        </p>
        <form onSubmit={handleSubmit}>
          <div className="select-rocket">
            <div className="left-switch-btn switch-btn">
              <i
                class="fa-solid fa-angle-left"
                onClick={() => changeRocket()}
              ></i>
            </div>
            <img src={rocketList[rocket]} alt="" className="rocket-img" />
            <div className="right-switch-btn switch-btn">
              <i
                class="fa-solid fa-angle-right"
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
            <input type="submit" value="PLAY" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Land;

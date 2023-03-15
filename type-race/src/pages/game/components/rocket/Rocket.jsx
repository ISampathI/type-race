import React from "react";
import "./rocket.scss";

function Rocket(props) {
  return (
    <div className="Rocket">
      <img src={props.rocket} alt="" className="rocket-img" />
    </div>
  );
}

export default Rocket;

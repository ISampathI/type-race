import React from "react";
import "./header.scss";

function Header() {
  return (
    <div className="Header">
      <div className="logo">spacerace</div>
      <div className="spacer-l"></div>
      <nav>
        <ul>
          <li className="active-nav">Home</li>
          <li>Contact</li>
          <li>About</li>
        </ul>
      </nav>
      <div className="spacer-r"></div>
      <div className="buttons">
        <button className="login-btn">LOGIN</button>
        <button className="register-btn">REGISTER</button>
      </div>
    </div>
  );
}

export default Header;

import React from "react";
import "./header.scss";

function Header() {
  return (
    <div className="Header">
      <div className="logo">spacerace</div>
      <nav>
        <ul>
          <li className="active-nav">Home</li>
          <li>Contact</li>
          <li>About</li>
        </ul>
      </nav>
      <div className="buttons">
        <button className="login-btn">LOGIN</button>
      </div>
    </div>
  );
}

export default Header;

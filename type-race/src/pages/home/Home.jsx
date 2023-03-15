import React from "react";
import Land from "./land/Land";
import "./home.scss";
import starsImg from "../../assets/img/background/stars.png";
import Header from "../layouts/header/Header";

function Home() {
  return (
    <div className="Home">
      <img src={starsImg} alt="" className="background-stars" />
      <Header />
      <Land />
    </div>
  );
}

export default Home;

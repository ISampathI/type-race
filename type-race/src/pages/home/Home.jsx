import React, { createContext, useState } from "react";
import Land from "./land/Land";
import "./home.scss";
import starsImg from "../../assets/img/background/stars.png";
import Header from "../layouts/header/Header";

export const ModalOpenContext = createContext();

function Home() {
  const [isModalOpen, setIsModalOpen] = useState({
    modal1: false,
    modal2: false,
  });

  return (
    <ModalOpenContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      <div className="Home">
        <img src={starsImg} alt="" className="background-stars" />
        <Header />
        <Land />
      </div>
    </ModalOpenContext.Provider>
  );
}

export default Home;

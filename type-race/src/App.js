import logo from "./logo.svg";
import "./App.css";
import SignIn from "./pages/login/SignIn";
import { useState } from "react";
import { PlayerPosContext, UserContext } from "./helper/context";
import Home from "./pages/home/Home";
import { Route, Router, Routes } from "react-router-dom";
import Game from "./pages/game/Game";

function App() {
  const [user, setUser] = useState({});
  const [playerPos, setPlayerPos] = useState(0);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <PlayerPosContext.Provider value={{ playerPos, setPlayerPos }}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Game />} />
          </Routes>
        </div>
      </PlayerPosContext.Provider>
    </UserContext.Provider>
  );
}

export default App;

import logo from "./logo.svg";
import "./App.css";
import SignIn from "./pages/login/SignIn";
import { useState } from "react";
import { PlayerPosContext, SocketContext, UserContext } from "./helper/context";
import Home from "./pages/home/Home";
import { Route, Router, Routes } from "react-router-dom";
import Game from "./pages/game/Game";

function App() {
  const [user, setUser] = useState({});
  const [socket, setSocket] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SocketContext.Provider value={{ socket, setSocket }}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Game />} />
            <Route path="/play/:qrid" element={<Game />} />
          </Routes>
        </div>
      </SocketContext.Provider>
    </UserContext.Provider>
  );
}

export default App;

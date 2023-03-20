import React, { useContext, useState } from "react";
import { ModalOpenContext } from "../../home/Home";
import Modal from "react-modal";
import Ripples from "react-ripples";
import "./header.scss";
import axios from "axios";
import { UserContext } from "../../../helper/context";

const api = axios.create({
  baseURL: "http://localhost:5000/",
});

function Header() {
  const { user, setUser } = useContext(UserContext);
  const { isModalOpen, setIsModalOpen } = useContext(ModalOpenContext);
  const [regForm, setRegForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [logForm, setLogForm] = useState({
    username: "",
    password: "",
  });
  const [regErrors, setRegErrors] = useState({});
  const [logErrors, setLogErrors] = useState({});

  const handleModalOpen = (modal) => {
    setIsModalOpen((prev) => ({ ...prev, [modal]: true }));
  };
  const handleModalClose = (modal) => {
    setLogErrors({});
    setLogForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setRegErrors({});
    setRegForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setIsModalOpen((prev) => ({ ...prev, [modal]: false }));
  };

  const handleRegSubmit = (e) => {
    e.preventDefault();
    console.log(
      regForm,
      regForm.password === regForm.confirmPassword && regForm.password != ""
    );
    if (
      regForm.password === regForm.confirmPassword &&
      regForm.password != ""
    ) {
      api
        .post("/users", regForm)
        .then((res) => {
          console.log(res);
          if (res.status == 201) {
            handleModalClose("modal2");
            handleModalOpen("modal1");
          }
        })
        .catch((e) => {
          if (e.response.status == 400) {
            setRegErrors(e.response.data.errors);
          }
        });
    } else {
      setRegErrors((prev) => {
        return {
          ...prev,
          confirmPassword: "Please make sure your passwords match",
        };
      });
    }
    console.log(regErrors);
  };

  const handleLogSubmit = (e) => {
    e.preventDefault();
    console.log(logForm);
    api
      .post("/users/login", logForm)
      .then((res) => {
        console.log(res);
        if (res.status == 200) {
          let userObj = res.data.user;
          userObj.isLogged = true;
          setUser(userObj);
          handleModalClose("modal2");
          handleModalClose("modal1");
        }
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status == 400) {
          setLogErrors(e.response.data.errors);
          console.log(logErrors, "#");
        }
      });
  };

  const handleRegForm = (e) => {
    setRegForm((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleLogForm = (e) => {
    setLogForm((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

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
        {!user.isLogged && (
          <>
            <button
              className="login-btn"
              onClick={() => handleModalOpen("modal1")}
            >
              LOGIN
            </button>
            <button
              className="register-btn"
              onClick={() => handleModalOpen("modal2")}
            >
              REGISTER
            </button>
          </>
        )}
        {user.isLogged && <button className="profile-btn"><i class="fa-solid fa-user"></i></button>}
      </div>
      <Modal
        isOpen={isModalOpen.modal1}
        onRequestClose={() => {
          handleModalClose("modal1");
        }}
        className="Modal"
        overlayClassName="modal-overlay"
        contentLabel="Player Details Modal"
      >
        <div className="login-modal">
          <div className="login-form">
            <div className="form-title">LOGIN</div>
            <form onSubmit={handleLogSubmit}>
              <div className="column">
                <label htmlFor="">User Name</label>
                <input
                  type="text"
                  name="username"
                  style={
                    logErrors.hasOwnProperty("username")
                      ? { borderColor: "red" }
                      : {}
                  }
                  value={handleLogForm.usename}
                  onChange={handleLogForm}
                />
                <label htmlFor="">Password</label>
                <input
                  type="password"
                  name="password"
                  style={
                    logErrors.hasOwnProperty("password")
                      ? { borderColor: "red" }
                      : {}
                  }
                  value={handleLogForm.password}
                  onChange={handleLogForm}
                />
                <input type="submit" value="Login" name="submit" />
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isModalOpen.modal2}
        onRequestClose={() => {
          handleModalClose("modal2");
        }}
        className="Modal"
        overlayClassName="modal-overlay"
        contentLabel="Player Details Modal"
      >
        <div className="login-modal">
          <div className="login-form">
            <div className="form-title">REGISTER</div>
            <form onSubmit={handleRegSubmit}>
              <div className="column">
                <label htmlFor="">User Name</label>
                <input
                  type="text"
                  name="username"
                  style={
                    regErrors.hasOwnProperty("username")
                      ? { borderColor: "red" }
                      : {}
                  }
                  value={handleRegForm.usename}
                  onChange={handleRegForm}
                />
                <label htmlFor="">Email</label>
                <input
                  type="text"
                  name="email"
                  style={
                    regErrors.hasOwnProperty("email")
                      ? { borderColor: "red" }
                      : {}
                  }
                  value={handleRegForm.email}
                  onChange={handleRegForm}
                />
                <label htmlFor="">Password</label>
                <input
                  type="password"
                  name="password"
                  style={
                    regErrors.hasOwnProperty("password")
                      ? { borderColor: "red" }
                      : {}
                  }
                  value={handleRegForm.password}
                  onChange={handleRegForm}
                />
                <label htmlFor="">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  style={
                    regErrors.hasOwnProperty("confirmPassword")
                      ? { borderColor: "red" }
                      : {}
                  }
                  value={handleRegForm.confirmPassword}
                  onChange={handleRegForm}
                />
                <input type="submit" value="Register" name="submit" />
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Header;

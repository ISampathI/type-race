const express = require("express");
const router = express.Router();
const { User } = require("../models");
const userController = require('../controllers/userController');

// router.get("/", async (req, res) => {
//   const { name } = req.query;
//   const user = await User.findAll();
//   res.send(`welcom back, ${JSON.stringify(user)}`);
// });
// router.post("/", async (req, res) => {
//   const { username, password } = req.body;
//   console.log(req.body, username, password);
//   // const user = await User.findAll();
//   res.send(`welcom back, ${JSON.stringify(username)}`);
// });

router.post('/', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;

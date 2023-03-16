const express = require("express");
const router = express.Router();
const { User } = require("../models");

router.get("/", async (req, res) => {
  const { name } = req.query;
  const user = await User.findAll();
  res.send(`welcom back, ${JSON.stringify(user)}`);
});

module.exports = router;

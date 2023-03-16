const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  const { name } = req.query;
  res.send(`welcom back, ${name}`);
});

module.exports = router;

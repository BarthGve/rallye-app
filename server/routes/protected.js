const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/auth");

router.get("/home", authenticateJWT, (req, res) => {
  res.status(200).json({ message: "Welcome to the protected home route!" });
});

module.exports = router;

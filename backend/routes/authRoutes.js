const express = require("express");
const router = express.Router();

const register = require("../controllers/registerController");
const login = require("../controllers/loginController");
const verifyToken = require("../middleware/jwt");

router.post("/register", register);
router.post("/login", login);

router.get("/verify", verifyToken, (req, res) => {
  return res.status(200).json({
    message: "Token is valid",
    user: req.user,
  });
});

module.exports = router;

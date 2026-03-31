const express = require("express");
const router = express.Router();

const login = require("../controllers/loginController");
const register = require("../controllers/registerController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/register", register);

router.get("/verify", verifyToken, (req, res) => {
  return res.status(200).json({
    message: "Token is valid",
    user: req.user,
  });
});

module.exports = router;

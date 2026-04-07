const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { getHome } = require("../controllers/homeController");

router.get("/home", verifyToken, getHome);

module.exports = router;

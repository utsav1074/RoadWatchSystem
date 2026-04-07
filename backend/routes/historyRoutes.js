const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { fetchHistory } = require("../controllers/historyController");

// ================= ROUTES =================
router.get("/history", verifyToken, fetchHistory);

module.exports = router;

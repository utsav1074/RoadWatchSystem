const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { fetchNotifications } = require("../controllers/notificationController");

// ================= NOTIFICATION ROUTE =================
router.get("/notifications", verifyToken, fetchNotifications);

module.exports = router;

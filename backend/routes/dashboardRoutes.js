const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const {
  fetchDashboardAnalytics,
} = require("../controllers/dashboardController");

router.get("/admin/dashboard", verifyToken, fetchDashboardAnalytics);

module.exports = router;

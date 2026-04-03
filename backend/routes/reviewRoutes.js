const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { reviewReport } = require("../controllers/reviewController");

// ================= REVIEW ROUTE =================
router.patch("/admin/reports/:id/review", verifyToken, reviewReport);

module.exports = router;

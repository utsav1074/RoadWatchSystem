const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  fetchReports,
  fetchSingleReport,
  changeStatus,
  removeReport,
} = require("../controllers/adminReportController");

// ================= ROUTES =================

// GET ALL REPORTS
router.get("/admin/reports", verifyToken, fetchReports);

// GET SINGLE REPORT
router.get("/admin/reports/:id", verifyToken, fetchSingleReport);

// UPDATE STATUS
router.patch("/admin/reports/:id", verifyToken, changeStatus);

// DELETE REPORT
router.delete("/admin/reports/:id", verifyToken, removeReport);

module.exports = router;

const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { fetchFines } = require("../controllers/fineController");

// ================= ROUTES =================
router.get("/fines", verifyToken, fetchFines);

module.exports = router;

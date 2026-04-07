const { getUserHistory } = require("../services/historyService");

// ================= GET HISTORY =================
const fetchHistory = (req, res) => {
  const userId = req.user.userId; // ✅ FIXED (same as home)

  getUserHistory(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error." });
    }

    return res.status(200).json(results);
  });
};

module.exports = {
  fetchHistory,
};

const { getUserFines } = require("../services/fineService");

// ================= GET FINES =================
const fetchFines = (req, res) => {
  const userId = req.user.userId; // same as history ✅

  getUserFines(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error." });
    }

    return res.status(200).json(results);
  });
};

module.exports = {
  fetchFines,
};

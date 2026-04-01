const { handleReview } = require("../services/reviewService");

// ================= REVIEW REPORT =================
const reviewReport = (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!status) {
    return res.status(400).json({
      message: "Status is required.",
    });
  }

  handleReview(id, status, notes || "", (err) => {
    if (err) {
      return res.status(500).json({
        message: "Review failed.",
      });
    }

    return res.status(200).json({
      message: "Report reviewed successfully.",
    });
  });
};

module.exports = {
  reviewReport,
};

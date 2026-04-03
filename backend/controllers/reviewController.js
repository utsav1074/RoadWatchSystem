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
      // ✅ HANDLE ALREADY REVIEWED ERROR
      if (err.message === "Report already reviewed") {
        return res.status(400).json({
          message: "This report has already been reviewed.",
        });
      }

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

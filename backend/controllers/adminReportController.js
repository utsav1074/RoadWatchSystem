const {
  getAllReports,
  getReportById,
  updateReportStatus,
  deleteReport,
} = require("../services/adminReportService");

// ================= GET ALL =================
const fetchReports = (req, res) => {
  const { search = "", status = "All" } = req.query;

  getAllReports({ search, status }, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error." });
    }

    return res.status(200).json(results);
  });
};

// ================= GET SINGLE =================
const fetchSingleReport = (req, res) => {
  const { id } = req.params;

  getReportById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error." });
    }

    if (!results.length) {
      return res.status(404).json({ message: "Report not found." });
    }

    return res.status(200).json(results[0]);
  });
};

// ================= UPDATE STATUS =================
const changeStatus = (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!status) {
    return res.status(400).json({
      message: "Status is required.",
    });
  }

  updateReportStatus(id, status, notes || "", (err) => {
    if (err) {
      return res.status(500).json({ message: "Update failed." });
    }

    return res.status(200).json({
      message: "Report updated successfully.",
    });
  });
};

// ================= DELETE =================
const removeReport = (req, res) => {
  const { id } = req.params;

  deleteReport(id, (err) => {
    if (err) {
      return res.status(500).json({ message: "Delete failed." });
    }

    return res.status(200).json({
      message: "Report deleted successfully.",
    });
  });
};

module.exports = {
  fetchReports,
  fetchSingleReport,
  changeStatus,
  removeReport,
};

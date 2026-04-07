const { getDashboardAnalytics } = require("../services/dashboardService");

const fetchDashboardAnalytics = (req, res) => {
  getDashboardAnalytics((err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Dashboard fetch failed.",
        error: err.message,
      });
    }

    return res.status(200).json(results);
  });
};

module.exports = {
  fetchDashboardAnalytics,
};

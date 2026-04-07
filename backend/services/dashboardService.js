const db = require("../config/db");

const runQuery = (query) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getDashboardAnalytics = async (callback) => {
  try {
    // ================= TOTAL REPORTS =================
    const totalReportsResult = await runQuery(`
      SELECT COUNT(*) AS totalReports FROM report
    `);

    // ================= TOTAL REVENUE =================
    const totalRevenueResult = await runQuery(`
      SELECT COALESCE(SUM(fine_amount), 0) AS totalRevenue
      FROM fine
      WHERE LOWER(fine_status) = 'unpaid'
    `);

    // ================= UNDER REVIEW =================
    const underReviewResult = await runQuery(`
      SELECT COUNT(*) AS underReview
      FROM report
      WHERE LOWER(report_status) = 'pending'
    `);

    // ================= TOTAL USERS =================
    const totalUsersResult = await runQuery(`
      SELECT COUNT(*) AS totalUsers
      FROM user
      WHERE LOWER(user_role) != 'admin'
    `);

    // ================= STATUS =================
    const statusResult = await runQuery(`
      SELECT
        CASE
          WHEN LOWER(report_status) = 'accepted' THEN 'Accepted'
          WHEN LOWER(report_status) = 'rejected' THEN 'Rejected'
          ELSE 'Pending'
        END AS name,
        COUNT(*) AS value
      FROM report
      GROUP BY
        CASE
          WHEN LOWER(report_status) = 'accepted' THEN 'Accepted'
          WHEN LOWER(report_status) = 'rejected' THEN 'Rejected'
          ELSE 'Pending'
        END
    `);

    // ================= VIOLATIONS =================
    const violationsRaw = await runQuery(`
      SELECT violation_type AS label, COUNT(*) AS total
      FROM report
      GROUP BY violation_type
      ORDER BY total DESC
      LIMIT 5
    `);

    // ================= TREND (FINAL FIX) =================
    const trendResult = await runQuery(`
      SELECT
        DATE(report_date) AS actual_date,
        DATE_FORMAT(report_date, '%b %e') AS label,
        COUNT(*) AS reports
      FROM report
      GROUP BY DATE(report_date), DATE_FORMAT(report_date, '%b %e')
      ORDER BY actual_date ASC
    `);

    // ================= FIX STATUS =================
    const fixedStatusData = [
      { name: "Accepted", value: 0 },
      { name: "Pending", value: 0 },
      { name: "Rejected", value: 0 },
    ].map((item) => {
      const found = statusResult.find((s) => s.name === item.name);
      return {
        name: item.name,
        value: found ? Number(found.value || 0) : 0,
      };
    });

    // ================= VIOLATION % =================
    const totalViolationCount = violationsRaw.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0,
    );

    const violationsData = violationsRaw.map((item) => ({
      label: item.label,
      percentage:
        totalViolationCount > 0
          ? Math.round((Number(item.total || 0) / totalViolationCount) * 100)
          : 0,
    }));

    // ================= CHART =================
    const chartData = trendResult.map((item) => ({
      label: item.label,
      reports: Number(item.reports || 0),
    }));

    return callback(null, {
      summary: {
        totalReports: Number(totalReportsResult[0]?.totalReports || 0),
        totalRevenue: Number(totalRevenueResult[0]?.totalRevenue || 0),
        underReview: Number(underReviewResult[0]?.underReview || 0),
        totalUsers: Number(totalUsersResult[0]?.totalUsers || 0),
      },
      statusData: fixedStatusData,
      violationsData,
      chartData,
    });
  } catch (err) {
    return callback(err);
  }
};

module.exports = {
  getDashboardAnalytics,
};

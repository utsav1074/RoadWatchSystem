const db = require("../config/db");

// ================= GET USER REPORT HISTORY =================
const getUserHistory = (userId, callback) => {
  const query = `
    SELECT 
      r.report_id,
      r.violation_type,
      r.report_status,
      r.report_date,
      v.vehicle_number
    FROM report r
    LEFT JOIN vehicle v ON r.vehicle_id = v.vehicle_id
    WHERE r.user_id = ?
    ORDER BY r.report_date DESC
  `;

  db.query(query, [userId], callback);
};

module.exports = {
  getUserHistory,
};

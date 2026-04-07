const db = require("../config/db");

// ================= GET USER FINES (FIXED LOGIC) =================
const getUserFines = (userId, callback) => {
  const query = `
    SELECT 
      f.fine_id,
      f.fine_amount,
      f.fine_status,
      f.fine_issueDate,
      r.violation_type,
      v.vehicle_number
    FROM fine f
    LEFT JOIN report r ON f.report_id = r.report_id
    LEFT JOIN vehicle v ON r.vehicle_id = v.vehicle_id
    WHERE v.user_id = ?
    ORDER BY f.fine_issueDate DESC
  `;

  db.query(query, [userId], callback);
};

module.exports = {
  getUserFines,
};

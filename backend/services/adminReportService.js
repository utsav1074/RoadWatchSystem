const db = require("../config/db");

// ================= GET ALL REPORTS (WITH FILTER) =================
const getAllReports = (filters, callback) => {
  const { search, status } = filters;

  let query = `
    SELECT 
      r.report_id,
      r.violation_type,
      r.description,
      r.latitude,
      r.longitude,
      r.plate_image,
      r.support_image,
      r.report_status,
      r.report_date,

      u.user_id,
      u.username AS reporter_username,
      u.full_name AS reporter_name,

      v.vehicle_number,

      owner.user_id AS owner_id,
      owner.username AS owner_username,
      owner.full_name AS owner_name

    FROM report r
    JOIN user u ON r.user_id = u.user_id
    JOIN vehicle v ON r.vehicle_id = v.vehicle_id
    LEFT JOIN user owner ON v.user_id = owner.user_id
    WHERE 1=1
  `;

  const params = [];

  if (search) {
    query += `
      AND (
        u.full_name LIKE ? OR
        u.username LIKE ? OR
        v.vehicle_number LIKE ? OR
        r.violation_type LIKE ?
      )
    `;
    const like = `%${search}%`;
    params.push(like, like, like, like);
  }

  if (status && status !== "All") {
    query += ` AND r.report_status = ?`;
    params.push(status);
  }

  query += ` ORDER BY r.report_date DESC`;

  db.query(query, params, callback);
};

// ================= GET SINGLE REPORT =================
const getReportById = (id, callback) => {
  const query = `
    SELECT 
      r.*,
      u.username AS reporter_username,
      u.full_name AS reporter_name,
      v.vehicle_number,
      v.owner_name,
      v.owner_email,
      v.owner_phone,
      v.registered_date,
      owner.username AS owner_username,
      owner.full_name AS owner_full_name

    FROM report r
    JOIN user u ON r.user_id = u.user_id
    JOIN vehicle v ON r.vehicle_id = v.vehicle_id
    LEFT JOIN user owner ON v.user_id = owner.user_id

    WHERE r.report_id = ?
  `;

  db.query(query, [id], callback);
};

// ================= UPDATE STATUS =================
const updateReportStatus = (id, status, notes, callback) => {
  const query = `
    UPDATE report
    SET report_status = ?, review_notes = ?
    WHERE report_id = ?
  `;

  db.query(query, [status, notes, id], callback);
};

// ================= DELETE REPORT =================
const deleteReport = (id, callback) => {
  db.query("DELETE FROM report WHERE report_id = ?", [id], callback);
};

module.exports = {
  getAllReports,
  getReportById,
  updateReportStatus,
  deleteReport,
};

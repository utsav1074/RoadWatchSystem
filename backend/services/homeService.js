const db = require("../config/db");

const getUserHomeData = (userId, callback) => {
  const queries = {
    totalReports: `
      SELECT COUNT(*) AS total 
      FROM report 
      WHERE user_id = ?
    `,

    pendingReports: `
      SELECT COUNT(*) AS total 
      FROM report 
      WHERE user_id = ? AND LOWER(report_status) = 'pending'
    `,

    verifiedReports: `
      SELECT COUNT(*) AS total 
      FROM report 
      WHERE user_id = ? AND LOWER(report_status) = 'accepted'
    `,

    // ✅ FIXED LOGIC HERE
    unpaidFines: `
      SELECT COALESCE(SUM(f.fine_amount),0) AS total
      FROM fine f
      JOIN report r ON f.report_id = r.report_id
      JOIN vehicle v ON r.vehicle_id = v.vehicle_id
      WHERE v.user_id = ? AND LOWER(f.fine_status) = 'unpaid'
    `,
  };

  db.query(queries.totalReports, [userId], (err, totalRes) => {
    if (err) return callback(err);

    db.query(queries.pendingReports, [userId], (err2, pendingRes) => {
      if (err2) return callback(err2);

      db.query(queries.verifiedReports, [userId], (err3, verifiedRes) => {
        if (err3) return callback(err3);

        db.query(queries.unpaidFines, [userId], (err4, fineRes) => {
          if (err4) return callback(err4);

          return callback(null, {
            totalReports: totalRes[0].total,
            pendingReports: pendingRes[0].total,
            verifiedReports: verifiedRes[0].total,
            unpaidFines: fineRes[0].total,
          });
        });
      });
    });
  });
};

module.exports = {
  getUserHomeData,
};

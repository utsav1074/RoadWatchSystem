const db = require("../config/db");
const nodemailer = require("nodemailer");

// ================= EMAIL SETUP =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "roadwatch162@gmail.com",
    pass: "fvid tdcr yupl vovr",
  },
});

// ================= FINE MAP =================
const fineMap = {
  Speeding: 1000,
  "Illegal Parking": 800,
  "Red Light Violation": 1200,
  "Reckless Driving": 1500,
};

// ================= MAIN REVIEW LOGIC =================
const handleReview = (reportId, status, notes, callback) => {
  db.beginTransaction((err) => {
    if (err) return callback(err);

    // ================= CHECK CURRENT STATUS =================
    const checkQuery = `SELECT report_status FROM report WHERE report_id = ?`;

    db.query(checkQuery, [reportId], (err, results) => {
      if (err) return db.rollback(() => callback(err));

      if (!results.length) {
        return db.rollback(() => callback(new Error("Report not found")));
      }

      const currentStatus = results[0].report_status;

      //  BLOCK IF ALREADY REVIEWED
      if (currentStatus !== "pending") {
        return db.rollback(() =>
          callback(new Error("Report already reviewed")),
        );
      }

      // ================= UPDATE =================
      const updateQuery = `
        UPDATE report
        SET report_status = ?, review_notes = ?
        WHERE report_id = ?
      `;

      db.query(updateQuery, [status.toLowerCase(), notes, reportId], (err) => {
        if (err) return db.rollback(() => callback(err));

        // ================= FETCH DATA =================
        const fetchQuery = `
          SELECT 
            r.report_id,
            r.user_id AS reporter_id,
            r.violation_type,
            v.owner_email,
            v.user_id AS owner_user_id
          FROM report r
          JOIN vehicle v ON r.vehicle_id = v.vehicle_id
          WHERE r.report_id = ?
        `;

        db.query(fetchQuery, [reportId], (err, results) => {
          if (err) return db.rollback(() => callback(err));

          const data = results[0];

          const reporterId = data.reporter_id;
          const ownerUserId = data.owner_user_id;
          const ownerEmail = data.owner_email;
          const violation = data.violation_type;

          // ================= NOTIFICATIONS =================
          const reporterMessage =
            status.toLowerCase() === "accepted"
              ? "Your report has been accepted."
              : "Your report has been rejected.";

          db.query(
            `INSERT INTO notification (notification_message, user_id, report_id)
             VALUES (?, ?, ?)`,
            [reporterMessage, reporterId, reportId],
          );

          if (ownerUserId && status.toLowerCase() === "accepted") {
            const ownerMessage =
              "You have been fined for a traffic violation. Please check the details in the fines section and make the payment on time.";

            db.query(
              `INSERT INTO notification (notification_message, user_id, report_id)
               VALUES (?, ?, ?)`,
              [ownerMessage, ownerUserId, reportId],
            );
          }

          // ================= FINE =================
          if (status.toLowerCase() === "accepted") {
            const fineAmount = fineMap[violation] || 1000;

            db.query(
              `INSERT INTO fine (fine_amount, fine_status, report_id)
               VALUES (?, 'unpaid', ?)`,
              [fineAmount, reportId],
            );
          }

          // ================= EMAIL (UPDATED: ALWAYS SEND IF ACCEPTED) =================
          if (status.toLowerCase() === "accepted" && ownerEmail) {
            const mailOptions = {
              from: "roadwatch162@gmail.com",
              to: ownerEmail,
              subject: "Traffic Violation Notice - RoadWatch",
              text: `You have received a traffic violation report for your vehicle.

The report has been reviewed by the relevant authority and confirmed as a valid violation. As a result, a fine has been issued. Please review the details and ensure timely payment to avoid any further penalties.

If you do not have an account, please register in the RoadWatch app and log in to view the details and pay your fine`,
            };

            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.log("Email error:", err);
              } else {
                console.log("Email sent:", info.response);
              }
            });
          }

          db.commit((err) => {
            if (err) return db.rollback(() => callback(err));
            return callback(null);
          });
        });
      });
    });
  });
};

module.exports = {
  handleReview,
};

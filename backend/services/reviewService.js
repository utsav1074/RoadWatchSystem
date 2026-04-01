const db = require("../config/db");
const nodemailer = require("nodemailer");

// ================= EMAIL SETUP =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com",
    pass: "your_app_password",
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

    const updateQuery = `
      UPDATE report
      SET report_status = ?, review_notes = ?
      WHERE report_id = ?
    `;

    db.query(updateQuery, [status.toLowerCase(), notes, reportId], (err) => {
      if (err) return db.rollback(() => callback(err));

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
        if (!results.length)
          return db.rollback(() => callback(new Error("Report not found")));

        const data = results[0];

        const reporterId = data.reporter_id;
        const ownerUserId = data.owner_user_id;
        const ownerEmail = data.owner_email;
        const violation = data.violation_type;

        // ================= NOTIFICATIONS =================
        const reporterMessage =
          status === "Accepted"
            ? "Your report has been accepted."
            : "Your report has been rejected.";

        db.query(
          `INSERT INTO notification (notification_message, user_id, report_id)
           VALUES (?, ?, ?)`,
          [reporterMessage, reporterId, reportId],
        );

        if (ownerUserId && status === "Accepted") {
          const ownerMessage =
            "You have been fined for a traffic violation. Please check the details in the fines section and make the payment on time.";

          db.query(
            `INSERT INTO notification (notification_message, user_id, report_id)
             VALUES (?, ?, ?)`,
            [ownerMessage, ownerUserId, reportId],
          );
        }

        // ================= FINE =================
        if (status === "Accepted") {
          const fineAmount = fineMap[violation] || 1000;

          db.query(
            `INSERT INTO fine (fine_amount, fine_status, report_id)
             VALUES (?, 'unpaid', ?)`,
            [fineAmount, reportId],
          );
        }

        // ================= EMAIL =================
        if (!ownerUserId && status === "Accepted") {
          const mailOptions = {
            from: "yourgmail@gmail.com",
            to: ownerEmail,
            subject: "Traffic Violation Notice - RoadWatch",
            text: `You have received a traffic violation report for your vehicle.

The report has been accepted and a fine has been issued.

Please register and link your vehicle to view and pay the fine.`,
          };

          transporter.sendMail(mailOptions);
        }

        db.commit((err) => {
          if (err) return db.rollback(() => callback(err));
          return callback(null);
        });
      });
    });
  });
};

module.exports = {
  handleReview,
};

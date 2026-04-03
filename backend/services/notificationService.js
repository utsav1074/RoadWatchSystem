const db = require("../config/db");

// ================= GET USER NOTIFICATIONS =================
const getNotificationsByUserId = (userId, callback) => {
  const query = `
    SELECT
      notification_id,
      notification_message,
      notification_time,
      user_id,
      report_id
    FROM notification
    WHERE user_id = ?
    ORDER BY notification_time DESC, notification_id DESC
  `;

  db.query(query, [userId], callback);
};

module.exports = {
  getNotificationsByUserId,
};

const { getNotificationsByUserId } = require("../services/notificationService");

// ================= GET LOGGED IN USER NOTIFICATIONS =================
const fetchNotifications = (req, res) => {
  const userId =
    req.user?.user_id || req.user?.id || req.user?.userId || req.user?.userid;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized.",
    });
  }

  getNotificationsByUserId(userId, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch notifications.",
      });
    }

    return res.status(200).json(results);
  });
};

module.exports = {
  fetchNotifications,
};

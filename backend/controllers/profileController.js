const db = require("../config/db");

// ================= GET PROFILE =================
const getProfile = (req, res) => {
  const userId = req.user.userId;

  const userQuery = `
    SELECT user_id, username, full_name, email, contact, user_role, image_path
    FROM user WHERE user_id = ?
  `;

  db.query(userQuery, [userId], (err, userResult) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (!userResult.length)
      return res.status(404).json({ message: "User not found." });

    const vehicleQuery = `
      SELECT vehicle_id, vehicle_number
      FROM vehicle WHERE user_id = ?
      ORDER BY vehicle_id DESC
    `;

    db.query(vehicleQuery, [userId], (err2, vehicles) => {
      if (err2)
        return res.status(500).json({ message: "Vehicle fetch error." });

      const user = userResult[0];

      return res.status(200).json({
        user: {
          userId: user.user_id,
          username: user.username,
          fullName: user.full_name,
          email: user.email,
          phone: user.contact,
          role: user.user_role,
          imagePath: user.image_path,
        },
        vehicles,
      });
    });
  });
};

// ================= UPLOAD IMAGE =================
const uploadProfileImage = (req, res) => {
  const userId = req.user.userId;

  if (!req.file) return res.status(400).json({ message: "No image selected." });

  const imagePath = `/uploads/${req.file.filename}`;

  db.query(
    "UPDATE user SET image_path=? WHERE user_id=?",
    [imagePath, userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Update failed." });

      if (!result.affectedRows)
        return res.status(404).json({ message: "User not found." });

      return res.status(200).json({
        message: "Profile image updated.",
        imagePath,
      });
    },
  );
};

// ================= LINK VEHICLE =================
const linkVehicle = (req, res) => {
  const userId = req.user.userId;
  let { vehicleNumber } = req.body;

  if (!vehicleNumber)
    return res.status(400).json({ message: "Vehicle required." });

  vehicleNumber = vehicleNumber.trim().toUpperCase();

  db.query(
    "SELECT vehicle_id, user_id FROM vehicle WHERE UPPER(vehicle_number)=? LIMIT 1",
    [vehicleNumber],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error." });

      if (!result.length)
        return res.status(404).json({ message: "Vehicle not found." });

      const vehicle = result[0];

      if (vehicle.user_id == userId)
        return res.status(400).json({ message: "Already linked." });

      if (vehicle.user_id)
        return res.status(400).json({ message: "Linked to another user." });

      db.query(
        "UPDATE vehicle SET user_id=? WHERE vehicle_id=?",
        [userId, vehicle.vehicle_id],
        (err2) => {
          if (err2) return res.status(500).json({ message: "Link failed." });

          return res.status(200).json({ message: "Vehicle linked." });
        },
      );
    },
  );
};

// ================= UNLINK VEHICLE =================
const unlinkVehicle = (req, res) => {
  const userId = req.user.userId;
  const vehicleId = req.params.vehicleId;

  db.query(
    "SELECT user_id FROM vehicle WHERE vehicle_id=?",
    [vehicleId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error." });

      if (!result.length)
        return res.status(404).json({ message: "Not found." });

      if (result[0].user_id != userId)
        return res.status(403).json({ message: "Not allowed." });

      db.query(
        "UPDATE vehicle SET user_id=NULL WHERE vehicle_id=?",
        [vehicleId],
        (err2) => {
          if (err2) return res.status(500).json({ message: "Failed." });

          return res.status(200).json({ message: "Vehicle removed." });
        },
      );
    },
  );
};

module.exports = {
  getProfile,
  uploadProfileImage,
  linkVehicle,
  unlinkVehicle,
};

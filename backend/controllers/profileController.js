const {
  getUserById,
  getUserVehicles,
  updateProfileImage,
  findVehicleByNumber,
  linkVehicleToUser,
  getVehicleOwner,
  unlinkVehicleFromUser,
} = require("../services/profileService");

// ================= GET PROFILE =================
const getProfile = (req, res) => {
  const userId = req.user.userId;

  getUserById(userId, (err, userResult) => {
    if (err) return res.status(500).json({ message: "Database error." });
    if (!userResult.length)
      return res.status(404).json({ message: "User not found." });

    getUserVehicles(userId, (err2, vehicles) => {
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

  updateProfileImage(userId, imagePath, (err, result) => {
    if (err) return res.status(500).json({ message: "Update failed." });
    if (!result.affectedRows)
      return res.status(404).json({ message: "User not found." });

    return res.status(200).json({
      message: "Profile image updated.",
      imagePath,
    });
  });
};

// ================= LINK VEHICLE =================
const linkVehicle = (req, res) => {
  const userId = req.user.userId;
  let { vehicleNumber } = req.body;

  if (!vehicleNumber)
    return res.status(400).json({ message: "Vehicle required." });

  vehicleNumber = vehicleNumber.trim().toUpperCase();

  findVehicleByNumber(vehicleNumber, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error." });
    if (!result.length)
      return res.status(404).json({ message: "Vehicle not found." });

    const vehicle = result[0];

    if (vehicle.user_id == userId)
      return res.status(400).json({ message: "Already linked." });

    if (vehicle.user_id)
      return res.status(400).json({ message: "Linked to another user." });

    linkVehicleToUser(userId, vehicle.vehicle_id, (err2) => {
      if (err2) return res.status(500).json({ message: "Link failed." });

      return res.status(200).json({ message: "Vehicle linked." });
    });
  });
};

// ================= UNLINK VEHICLE =================
const unlinkVehicle = (req, res) => {
  const userId = req.user.userId;
  const vehicleId = req.params.vehicleId;

  getVehicleOwner(vehicleId, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error." });
    if (!result.length) return res.status(404).json({ message: "Not found." });

    if (result[0].user_id != userId)
      return res.status(403).json({ message: "Not allowed." });

    unlinkVehicleFromUser(vehicleId, (err2) => {
      if (err2) return res.status(500).json({ message: "Failed." });

      return res.status(200).json({ message: "Vehicle removed." });
    });
  });
};

module.exports = {
  getProfile,
  uploadProfileImage,
  linkVehicle,
  unlinkVehicle,
};

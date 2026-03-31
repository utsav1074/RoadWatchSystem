const {
  insertReport,
  findVehicleByNumber,
} = require("../services/reportService");

// ================= CREATE REPORT =================
const createReport = (req, res) => {
  const userId = req.user.userId;

  let { plate, violationType, description, latitude, longitude } = req.body;

  if (!plate || !violationType || !description || !latitude || !longitude) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  if (!req.files?.plateImage || !req.files?.supportImage) {
    return res.status(400).json({
      message: "Both images are required.",
    });
  }

  plate = plate.trim().toUpperCase();

  // ================= UPDATED PATHS =================
  const plateImage = `/uploads/plateImages/${req.files.plateImage[0].filename}`;
  const supportImage = `/uploads/supportImages/${req.files.supportImage[0].filename}`;

  findVehicleByNumber(plate, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (!result.length) {
      return res.status(404).json({
        message: "Vehicle not found.",
      });
    }

    const vehicleId = result[0].vehicle_id;

    insertReport(
      {
        userId,
        vehicleId,
        violationType,
        description,
        latitude,
        longitude,
        plateImage,
        supportImage,
      },
      (err2) => {
        if (err2) return res.status(500).json({ message: "Insert failed." });

        return res.status(201).json({
          message: "Report submitted successfully.",
        });
      },
    );
  });
};

module.exports = {
  createReport,
};

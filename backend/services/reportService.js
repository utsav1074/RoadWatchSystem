const db = require("../config/db");

// ================= FIND VEHICLE =================
const findVehicleByNumber = (plate, callback) => {
  const query =
    "SELECT vehicle_id FROM vehicle WHERE UPPER(vehicle_number) = ? LIMIT 1";

  db.query(query, [plate], callback);
};

// ================= INSERT REPORT =================
const insertReport = (data, callback) => {
  const query = `
    INSERT INTO report
    (
      violation_type,
      description,
      latitude,
      longitude,
      plate_image,
      support_image,
      user_id,
      vehicle_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      data.violationType,
      data.description,
      data.latitude,
      data.longitude,
      data.plateImage,
      data.supportImage,
      data.userId,
      data.vehicleId,
    ],
    callback,
  );
};

module.exports = {
  findVehicleByNumber,
  insertReport,
};

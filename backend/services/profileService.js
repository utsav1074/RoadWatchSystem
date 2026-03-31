const db = require("../config/db");

const getUserById = (userId, callback) => {
  const query = `
    SELECT user_id, username, full_name, email, contact, user_role, image_path
    FROM user WHERE user_id = ?
  `;
  db.query(query, [userId], callback);
};

const getUserVehicles = (userId, callback) => {
  const query = `
    SELECT vehicle_id, vehicle_number
    FROM vehicle WHERE user_id = ?
    ORDER BY vehicle_id DESC
  `;
  db.query(query, [userId], callback);
};

const updateProfileImage = (userId, imagePath, callback) => {
  db.query(
    "UPDATE user SET image_path=? WHERE user_id=?",
    [imagePath, userId],
    callback,
  );
};

const findVehicleByNumber = (vehicleNumber, callback) => {
  db.query(
    "SELECT vehicle_id, user_id FROM vehicle WHERE UPPER(vehicle_number)=? LIMIT 1",
    [vehicleNumber],
    callback,
  );
};

const linkVehicleToUser = (userId, vehicleId, callback) => {
  db.query(
    "UPDATE vehicle SET user_id=? WHERE vehicle_id=?",
    [userId, vehicleId],
    callback,
  );
};

const getVehicleOwner = (vehicleId, callback) => {
  db.query(
    "SELECT user_id FROM vehicle WHERE vehicle_id=?",
    [vehicleId],
    callback,
  );
};

const unlinkVehicleFromUser = (vehicleId, callback) => {
  db.query(
    "UPDATE vehicle SET user_id=NULL WHERE vehicle_id=?",
    [vehicleId],
    callback,
  );
};

module.exports = {
  getUserById,
  getUserVehicles,
  updateProfileImage,
  findVehicleByNumber,
  linkVehicleToUser,
  getVehicleOwner,
  unlinkVehicleFromUser,
};

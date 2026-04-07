const db = require("../config/db");

// ================= GET USERS =================
const getAllUsers = (search, callback) => {
  const query = `
    SELECT 
      u.user_id,
      u.full_name,
      u.username,
      u.email,
      u.contact,
      GROUP_CONCAT(DISTINCT v.vehicle_number SEPARATOR ', ') AS vehicle_numbers
    FROM user u
    LEFT JOIN vehicle v ON u.user_id = v.user_id
    WHERE 
      u.user_role != 'admin' AND
      (
        u.full_name LIKE ? OR
        u.username LIKE ? OR
        u.contact LIKE ? OR
        v.vehicle_number LIKE ?
      )
    GROUP BY u.user_id
    ORDER BY u.user_id DESC
  `;

  const value = `%${search}%`;

  db.query(query, [value, value, value, value], callback);
};

// ================= GET SINGLE USER =================
const getUserById = (id, callback) => {
  const query = `
    SELECT 
      u.user_id,
      u.full_name,
      u.username,
      u.email,
      u.contact,
      GROUP_CONCAT(DISTINCT v.vehicle_number SEPARATOR ', ') AS vehicle_numbers
    FROM user u
    LEFT JOIN vehicle v ON u.user_id = v.user_id
    WHERE u.user_id = ?
    GROUP BY u.user_id
  `;

  db.query(query, [id], callback);
};

// ================= UPDATE USER =================
const updateUser = (id, data, callback) => {
  const { name, username, email, phone } = data;

  const query = `
    UPDATE user 
    SET full_name = ?, username = ?, email = ?, contact = ?
    WHERE user_id = ?
  `;

  db.query(query, [name, username, email, phone, id], callback);
};

// ================= DELETE =================
const deleteUser = (id, callback) => {
  const query = "DELETE FROM user WHERE user_id = ?";
  db.query(query, [id], callback);
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
